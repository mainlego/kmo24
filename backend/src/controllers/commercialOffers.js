import CommercialOffer from '../models/CommercialOffer.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse, paginatedResponse, createPagination } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Создание коммерческого предложения
 * POST /api/v1/commercial-offers
 */
export const createCommercialOffer = async (req, res, next) => {
  try {
    const {
      customer,
      items,
      validUntil,
      notes,
      discount,
      deliveryIncluded,
    } = req.body;

    const userId = req.user?._id;

    // Проверка наличия всех товаров
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return errorResponse(
          res,
          `Товар с ID ${item.product} не найден или неактивен`,
          400
        );
      }
    }

    // Подготовка данных для КП
    const offerData = {
      createdBy: userId,
      customer,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
      })),
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
      notes,
      discount: discount || 0,
      deliveryIncluded: deliveryIncluded || false,
    };

    const offer = await CommercialOffer.create(offerData);

    await offer.populate([
      { path: 'createdBy', select: 'firstName lastName email' },
      { path: 'items.product', select: 'name slug images price' },
    ]);

    logger.info(`Commercial offer created: ${offer.offerNumber}`);

    return successResponse(
      res,
      offer,
      'Коммерческое предложение создано',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Получение списка КП
 * GET /api/v1/commercial-offers
 */
export const getCommercialOffers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      startDate,
      endDate,
    } = req.query;

    // Построение фильтра
    const filter = {};

    if (status) filter.status = status;

    if (search) {
      filter.$or = [
        { offerNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.company': { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const total = await CommercialOffer.countDocuments(filter);

    const offers = await CommercialOffer.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .populate('items.product', 'name slug images')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const pagination = createPagination(page, limit, total);

    return paginatedResponse(res, offers, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение КП по ID
 * GET /api/v1/commercial-offers/:id
 */
export const getCommercialOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await CommercialOffer.findById(id)
      .populate('createdBy', 'firstName lastName email phone')
      .populate('items.product', 'name slug images price specifications');

    if (!offer) {
      return errorResponse(res, 'Коммерческое предложение не найдено', 404);
    }

    return successResponse(res, offer);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение КП по номеру
 * GET /api/v1/commercial-offers/number/:offerNumber
 */
export const getByOfferNumber = async (req, res, next) => {
  try {
    const { offerNumber } = req.params;

    const offer = await CommercialOffer.findOne({ offerNumber })
      .populate('createdBy', 'firstName lastName email phone')
      .populate('items.product', 'name slug images price specifications');

    if (!offer) {
      return errorResponse(res, 'Коммерческое предложение не найдено', 404);
    }

    return successResponse(res, offer);
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление КП
 * PUT /api/v1/commercial-offers/:id
 */
export const updateCommercialOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customer, items, validUntil, notes, discount, deliveryIncluded } = req.body;

    const offer = await CommercialOffer.findById(id);

    if (!offer) {
      return errorResponse(res, 'Коммерческое предложение не найдено', 404);
    }

    // Обновление полей
    if (customer) offer.customer = customer;
    if (items) offer.items = items;
    if (validUntil) offer.validUntil = validUntil;
    if (notes !== undefined) offer.notes = notes;
    if (discount !== undefined) offer.discount = discount;
    if (deliveryIncluded !== undefined) offer.deliveryIncluded = deliveryIncluded;

    await offer.save();

    await offer.populate([
      { path: 'createdBy', select: 'firstName lastName email' },
      { path: 'items.product', select: 'name slug images price' },
    ]);

    logger.info(`Commercial offer updated: ${offer.offerNumber}`);

    return successResponse(res, offer, 'Коммерческое предложение обновлено');
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление КП
 * DELETE /api/v1/commercial-offers/:id
 */
export const deleteCommercialOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await CommercialOffer.findByIdAndDelete(id);

    if (!offer) {
      return errorResponse(res, 'Коммерческое предложение не найдено', 404);
    }

    logger.info(`Commercial offer deleted: ${offer.offerNumber}`);

    return successResponse(res, null, 'Коммерческое предложение удалено');
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление статуса КП
 * PATCH /api/v1/commercial-offers/:id/status
 */
export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const offer = await CommercialOffer.findById(id);

    if (!offer) {
      return errorResponse(res, 'Коммерческое предложение не найдено', 404);
    }

    offer.status = status;
    await offer.save();

    logger.info(`Commercial offer ${offer.offerNumber} status updated to ${status}`);

    return successResponse(res, offer, 'Статус обновлен');
  } catch (error) {
    next(error);
  }
};

/**
 * Отправка КП по email
 * POST /api/v1/commercial-offers/:id/send
 */
export const sendCommercialOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, subject, message } = req.body;

    const offer = await CommercialOffer.findById(id)
      .populate('createdBy', 'firstName lastName email phone')
      .populate('items.product', 'name slug images price specifications');

    if (!offer) {
      return errorResponse(res, 'Коммерческое предложение не найдено', 404);
    }

    // TODO: Реализовать генерацию PDF и отправку email
    // 1. Сгенерировать PDF из шаблона
    // 2. Отправить email с прикрепленным PDF

    // Добавление в историю отправок
    offer.sentHistory.push({
      sentTo: email || offer.customer.email,
      sentBy: req.user._id,
      sentAt: new Date(),
      method: 'email',
    });

    if (offer.status === 'draft') {
      offer.status = 'sent';
    }

    await offer.save();

    logger.info(`Commercial offer ${offer.offerNumber} sent to ${email || offer.customer.email}`);

    return successResponse(
      res,
      offer,
      'Коммерческое предложение отправлено. Функция отправки PDF в разработке.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Генерация PDF КП
 * GET /api/v1/commercial-offers/:id/pdf
 */
export const generatePDF = async (req, res, next) => {
  try {
    const { id } = req.params;

    const offer = await CommercialOffer.findById(id)
      .populate('createdBy', 'firstName lastName email phone')
      .populate('items.product', 'name slug images price specifications');

    if (!offer) {
      return errorResponse(res, 'Коммерческое предложение не найдено', 404);
    }

    // TODO: Реализовать генерацию PDF с Puppeteer
    // 1. Создать HTML шаблон
    // 2. Сгенерировать PDF с Puppeteer
    // 3. Вернуть файл

    logger.info(`PDF generation requested for offer ${offer.offerNumber}`);

    return successResponse(
      res,
      null,
      'Генерация PDF в разработке. Используйте /send для отправки по email.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Получение статистики КП
 * GET /api/v1/commercial-offers/stats/summary
 */
export const getStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const stats = await CommercialOffer.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalOffers: { $sum: 1 },
          totalValue: { $sum: '$total' },
          avgValue: { $avg: '$total' },
          draftOffers: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] },
          },
          sentOffers: {
            $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] },
          },
          viewedOffers: {
            $sum: { $cond: [{ $eq: ['$status', 'viewed'] }, 1, 0] },
          },
          acceptedOffers: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] },
          },
          rejectedOffers: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] },
          },
          expiredOffers: {
            $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] },
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
  createCommercialOffer,
  getCommercialOffers,
  getCommercialOffer,
  getByOfferNumber,
  updateCommercialOffer,
  deleteCommercialOffer,
  updateStatus,
  sendCommercialOffer,
  generatePDF,
  getStats,
};
