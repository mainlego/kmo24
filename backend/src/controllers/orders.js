import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import PromoCode from '../models/PromoCode.js';
import { successResponse, errorResponse, paginatedResponse, createPagination } from '../utils/response.js';
import { getCache, setCache, deleteCache, deleteCachePattern } from '../config/redis-mock.js';
import logger from '../utils/logger.js';
import { sendNewOrderNotifications } from '../services/notifications.js';

/**
 * Создание заказа с товарами напрямую (без корзины в БД)
 * POST /api/v1/orders
 */
export const createOrder = async (req, res, next) => {
  // Запускаем сессию для транзакции
  const session = await mongoose.startSession();

  try {
    // Начинаем транзакцию
    session.startTransaction();
    const {
      items: requestItems,
      shippingAddress,
      paymentMethod,
      deliveryMethod,
      deliveryPrice,
      notes,
      legalEntity,
    } = req.body;

    const userId = req.user?._id;

    // Проверяем наличие товаров
    if (!requestItems || requestItems.length === 0) {
      await session.abortTransaction();
      return errorResponse(res, 'Корзина пуста', 400);
    }

    // Проверка и загрузка данных товаров
    const orderItems = [];
    let subtotal = 0;

    for (const item of requestItems) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || !product.isActive) {
        await session.abortTransaction();
        return errorResponse(
          res,
          `Товар "${item.name}" больше не доступен`,
          400
        );
      }

      if (product.stock.available < item.quantity) {
        await session.abortTransaction();
        return errorResponse(
          res,
          `Недостаточно товара "${product.name}". Доступно: ${product.stock.available}`,
          400
        );
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku || '',
        image: product.images?.[0]?.url || '',
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      });
    }

    // Подготовка данных заказа
    const orderData = {
      user: userId || null,
      isGuest: !userId,
      customer: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
      },
      items: orderItems,
      shippingAddress: {
        country: shippingAddress.country || 'Россия',
        city: shippingAddress.city,
        street: shippingAddress.street || '',
        building: shippingAddress.building || '',
        apartment: shippingAddress.apartment || '',
        postalCode: shippingAddress.postalCode || '',
        comment: shippingAddress.comment || '',
      },
      shipping: {
        method: deliveryMethod,
        cost: deliveryPrice || 0,
      },
      payment: {
        method: paymentMethod,
        status: 'pending',
      },
      pricing: {
        subtotal: subtotal,
        shipping: deliveryPrice || 0,
        discount: 0,
        total: subtotal + (deliveryPrice || 0),
      },
      customerComment: notes,
    };

    // Добавляем данные юр. лица если есть
    if (legalEntity) {
      orderData.legalEntity = {
        companyName: legalEntity.companyName,
        inn: legalEntity.inn,
        kpp: legalEntity.kpp || '',
        legalAddress: legalEntity.legalAddress || '',
      };
    }

    // Генерируем номер заказа вручную (pre-save не работает с create([...], {session}))
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const todayStart = new Date(date);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(date);
    todayEnd.setHours(23, 59, 59, 999);

    const lastOrder = await Order.findOne(
      { createdAt: { $gte: todayStart, $lt: todayEnd } },
      { orderNumber: 1 },
      { sort: { createdAt: -1 } }
    ).session(session);

    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4), 10);
      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }

    orderData.orderNumber = `${year}${month}${day}-${String(sequence).padStart(4, '0')}`;

    // Создание заказа в рамках транзакции
    const order = await Order.create([orderData], { session });

    // Резервирование товаров в рамках транзакции
    for (const item of orderItems) {
      const result = await Product.findOneAndUpdate(
        {
          _id: item.product,
          'stock.available': { $gte: item.quantity }
        },
        {
          $inc: {
            'stock.available': -item.quantity,
            'stock.reserved': item.quantity
          }
        },
        { session, new: true }
      );

      if (!result) {
        await session.abortTransaction();
        return errorResponse(
          res,
          `Недостаточно товара "${item.name}" в наличии`,
          400
        );
      }
    }

    // Завершаем транзакцию
    await session.commitTransaction();

    // Очистка кэша
    if (userId) {
      await deleteCachePattern(`orders:user:${userId}*`);
    }

    logger.info(`Order created: ${order[0].orderNumber} by user ${userId || 'guest'}`);

    // Отправка уведомлений (асинхронно, не блокируем ответ)
    // Преобразуем в plain object для логирования
    const orderForNotification = order[0].toObject ? order[0].toObject() : order[0];
    logger.info(`Sending notifications for order: ${orderForNotification.orderNumber}`);
    logger.info(`Order data for notifications: customer=${JSON.stringify(orderForNotification.customer)}, items=${orderForNotification.items?.length || 0}`);

    sendNewOrderNotifications(orderForNotification).then(result => {
      logger.info(`Notification results: ${JSON.stringify(result)}`);
    }).catch(err => {
      logger.error('Failed to send order notifications:', err);
    });

    return successResponse(
      res,
      order[0],
      'Заказ успешно создан',
      201
    );
  } catch (error) {
    // Откатываем транзакцию при любой ошибке
    await session.abortTransaction();
    next(error);
  } finally {
    // Завершаем сессию
    session.endSession();
  }
};

/**
 * Получение списка заказов текущего пользователя
 * GET /api/v1/orders
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user._id;

    // Кэш ключ
    const cacheKey = `orders:user:${userId}:${JSON.stringify(req.query)}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Фильтр
    const filter = { user: userId };
    if (status) {
      filter.status = status;
    }

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('items.product', 'name slug images')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const pagination = createPagination(page, limit, total);

    const response = {
      success: true,
      data: orders,
      pagination: {
        currentPage: pagination.page,
        itemsPerPage: pagination.limit,
        totalItems: pagination.total,
        totalPages: pagination.totalPages,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPrevPage: pagination.page > 1,
      },
    };

    // Кэш на 5 минут
    await setCache(cacheKey, response, 300);

    return res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение всех заказов (только для администраторов)
 * GET /api/v1/orders/all
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      paymentStatus,
      search,
      startDate,
      endDate,
    } = req.query;

    // Построение фильтра
    const filter = {};

    if (status) filter.status = status;
    if (paymentStatus) filter['payment.status'] = paymentStatus;

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name slug images')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const pagination = createPagination(page, limit, total);

    return paginatedResponse(res, orders, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение деталей заказа
 * GET /api/v1/orders/:id
 */
export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'manager';

    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email phone')
      .populate('items.product', 'name slug images price');

    if (!order) {
      return errorResponse(res, 'Заказ не найден', 404);
    }

    // Проверка прав доступа
    if (!isAdmin && order.user && order.user._id.toString() !== userId.toString()) {
      return errorResponse(res, 'Доступ запрещен', 403);
    }

    return successResponse(res, order);
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление статуса заказа (только для администраторов)
 * PATCH /api/v1/orders/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { id } = req.params;
    const { status, comment } = req.body;

    const order = await Order.findById(id).session(session);

    if (!order) {
      await session.abortTransaction();
      return errorResponse(res, 'Заказ не найден', 404);
    }

    // Обновление статуса
    order.status = status;

    // Добавление в историю
    order.statusHistory.push({
      status,
      comment,
      changedBy: req.user._id,
    });

    await order.save({ session });

    // Если заказ отменен, освобождаем зарезервированные товары
    if (status === 'cancelled') {
      for (const item of order.items) {
        await Product.findOneAndUpdate(
          { _id: item.product },
          {
            $inc: {
              'stock.available': item.quantity,
              'stock.reserved': -item.quantity
            }
          },
          { session }
        );
      }
    }

    // Если заказ подтвержден, списываем зарезервированные товары
    if (status === 'completed') {
      for (const item of order.items) {
        await Product.findOneAndUpdate(
          { _id: item.product },
          {
            $inc: {
              'stock.reserved': -item.quantity
            }
          },
          { session }
        );
      }
    }

    await session.commitTransaction();

    // Очистка кэша
    await deleteCache(`order:${id}`);
    if (order.user) {
      await deleteCachePattern(`orders:user:${order.user}*`);
    }

    logger.info(`Order ${order.orderNumber} status updated to ${status}`);

    return successResponse(res, order, 'Статус заказа обновлен');
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * Обновление статуса оплаты (только для администраторов)
 * PATCH /api/v1/orders/:id/payment
 */
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, transactionId } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return errorResponse(res, 'Заказ не найден', 404);
    }

    order.payment.status = status;
    if (transactionId) {
      order.payment.transactionId = transactionId;
    }
    if (status === 'paid') {
      order.payment.paidAt = new Date();
    }

    await order.save();

    // Очистка кэша
    await deleteCache(`order:${id}`);
    if (order.user) {
      await deleteCachePattern(`orders:user:${order.user}*`);
    }

    logger.info(`Order ${order.orderNumber} payment status updated to ${status}`);

    return successResponse(res, order, 'Статус оплаты обновлен');
  } catch (error) {
    next(error);
  }
};

/**
 * Отмена заказа пользователем
 * POST /api/v1/orders/:id/cancel
 */
export const cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const order = await Order.findById(id).session(session);

    if (!order) {
      await session.abortTransaction();
      return errorResponse(res, 'Заказ не найден', 404);
    }

    // Проверка прав
    if (order.user && order.user.toString() !== userId.toString()) {
      await session.abortTransaction();
      return errorResponse(res, 'Доступ запрещен', 403);
    }

    // Проверка возможности отмены
    if (['completed', 'cancelled', 'shipped'].includes(order.status)) {
      await session.abortTransaction();
      return errorResponse(
        res,
        'Заказ не может быть отменен в текущем статусе',
        400
      );
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      comment: reason || 'Отменено пользователем',
      changedBy: userId,
    });

    await order.save({ session });

    // Освобождение зарезервированных товаров атомарно
    for (const item of order.items) {
      await Product.findOneAndUpdate(
        { _id: item.product },
        {
          $inc: {
            'stock.available': item.quantity,
            'stock.reserved': -item.quantity
          }
        },
        { session }
      );
    }

    await session.commitTransaction();

    // Очистка кэша
    await deleteCache(`order:${id}`);
    await deleteCachePattern(`orders:user:${userId}*`);

    logger.info(`Order ${order.orderNumber} cancelled by user`);

    return successResponse(res, order, 'Заказ отменен');
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

/**
 * Получение статистики заказов (только для администраторов)
 * GET /api/v1/orders/stats/summary
 */
export const getOrderStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Даты для сравнения
    const now = new Date();
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const stats = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' },
          avgOrderValue: { $avg: '$pricing.total' },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] },
          },
          processing: {
            $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] },
          },
          shipped: {
            $sum: { $cond: [{ $eq: ['$status', 'shipped'] }, 1, 0] },
          },
          delivered: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
    ]);

    // Заказы за текущий месяц
    const currentMonthOrders = await Order.countDocuments({
      createdAt: { $gte: monthAgo },
      status: { $nin: ['cancelled', 'refunded'] },
    });

    // Заказы за прошлый месяц
    const previousMonthOrders = await Order.countDocuments({
      createdAt: { $gte: twoMonthsAgo, $lt: monthAgo },
      status: { $nin: ['cancelled', 'refunded'] },
    });

    // Выручка за текущий месяц
    const currentMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: monthAgo },
          status: { $nin: ['cancelled', 'refunded'] },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$pricing.total' },
        },
      },
    ]);

    // Выручка за прошлый месяц
    const previousMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twoMonthsAgo, $lt: monthAgo },
          status: { $nin: ['cancelled', 'refunded'] },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$pricing.total' },
        },
      },
    ]);

    const result = stats[0] || {
      total: 0,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
    };

    // Добавляем totalOrders для совместимости с фронтендом
    result.totalOrders = result.total;

    // Добавляем выручку за месяц
    result.revenue = currentMonthRevenue[0]?.revenue || 0;

    // Вычисляем прирост заказов (%)
    const prevOrders = previousMonthOrders || 0;
    if (prevOrders > 0) {
      result.monthlyGrowth = Math.round(((currentMonthOrders - prevOrders) / prevOrders) * 100);
    } else {
      result.monthlyGrowth = currentMonthOrders > 0 ? 100 : 0;
    }

    // Вычисляем прирост выручки (%)
    const prevRevenue = previousMonthRevenue[0]?.revenue || 0;
    const currRevenue = currentMonthRevenue[0]?.revenue || 0;
    if (prevRevenue > 0) {
      result.revenueGrowth = Math.round(((currRevenue - prevRevenue) / prevRevenue) * 100);
    } else {
      result.revenueGrowth = currRevenue > 0 ? 100 : 0;
    }

    // Удаляем _id из результата (не нужен на фронтенде)
    delete result._id;

    logger.info('Order stats:', result);

    return successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
};
