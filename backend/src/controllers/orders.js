import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse, paginatedResponse, createPagination } from '../utils/response.js';
import { getCache, setCache, deleteCache, deleteCachePattern } from '../config/redis.js';
import logger from '../utils/logger.js';

/**
 * Создание заказа из корзины
 * POST /api/v1/orders
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      deliveryMethod,
      deliveryPrice,
      notes,
    } = req.body;

    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    // Получение корзины
    const cart = userId
      ? await Cart.findOne({ user: userId }).populate('items.product')
      : await Cart.findOne({ sessionId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return errorResponse(res, 'Корзина пуста', 400);
    }

    // Проверка наличия всех товаров
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || !product.isActive) {
        return errorResponse(
          res,
          `Товар "${item.product.name}" больше не доступен`,
          400
        );
      }
      if (product.stock.available < item.quantity) {
        return errorResponse(
          res,
          `Недостаточно товара "${product.name}". Доступно: ${product.stock.available}`,
          400
        );
      }
    }

    // Подготовка данных заказа
    const orderData = {
      user: userId || null,
      isGuestOrder: !userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        quantity: item.quantity,
        price: item.price,
        variant: item.variant,
        total: item.price * item.quantity,
      })),
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      payment: {
        method: paymentMethod,
        status: 'pending',
      },
      delivery: {
        method: deliveryMethod,
        price: deliveryPrice || 0,
      },
      pricing: {
        subtotal: cart.subtotal,
        deliveryPrice: deliveryPrice || 0,
        discount: cart.discount?.amount || 0,
        total: cart.total + (deliveryPrice || 0),
      },
      notes,
    };

    // Применение промокода если есть
    if (cart.discount?.code) {
      orderData.discount = {
        code: cart.discount.code,
        amount: cart.discount.amount,
      };
    }

    // Создание заказа
    const order = await Order.create(orderData);

    // Резервирование товаров
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        await product.reserveStock(item.quantity);
      }
    }

    // Очистка корзины
    await cart.clear();

    // Очистка кэша
    await deleteCachePattern(`orders:user:${userId}*`);

    logger.info(`Order created: ${order.orderNumber} by user ${userId || 'guest'}`);

    return successResponse(
      res,
      order,
      'Заказ успешно создан',
      201
    );
  } catch (error) {
    next(error);
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
  try {
    const { id } = req.params;
    const { status, comment } = req.body;

    const order = await Order.findById(id);

    if (!order) {
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

    await order.save();

    // Если заказ отменен, освобождаем зарезервированные товары
    if (status === 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          await product.releaseReserved(item.quantity);
        }
      }
    }

    // Если заказ подтвержден, списываем товары
    if (status === 'completed') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          await product.decreaseStock(item.quantity);
        }
      }
    }

    // Очистка кэша
    await deleteCache(`order:${id}`);
    if (order.user) {
      await deleteCachePattern(`orders:user:${order.user}*`);
    }

    logger.info(`Order ${order.orderNumber} status updated to ${status}`);

    return successResponse(res, order, 'Статус заказа обновлен');
  } catch (error) {
    next(error);
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
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const order = await Order.findById(id);

    if (!order) {
      return errorResponse(res, 'Заказ не найден', 404);
    }

    // Проверка прав
    if (order.user && order.user.toString() !== userId.toString()) {
      return errorResponse(res, 'Доступ запрещен', 403);
    }

    // Проверка возможности отмены
    if (['completed', 'cancelled', 'shipped'].includes(order.status)) {
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

    await order.save();

    // Освобождение зарезервированных товаров
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        await product.releaseReserved(item.quantity);
      }
    }

    // Очистка кэша
    await deleteCache(`order:${id}`);
    await deleteCachePattern(`orders:user:${userId}*`);

    logger.info(`Order ${order.orderNumber} cancelled by user`);

    return successResponse(res, order, 'Заказ отменен');
  } catch (error) {
    next(error);
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

    const stats = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' },
          avgOrderValue: { $avg: '$pricing.total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          processingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] },
          },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] },
          },
        },
      },
    ]);

    return successResponse(res, stats[0] || {});
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
