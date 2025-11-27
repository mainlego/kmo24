import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { successResponse, errorResponse, paginatedResponse, createPagination } from '../utils/response.js';
import { deleteCachePattern } from '../config/redis-mock.js';
import logger from '../utils/logger.js';

/**
 * Создание отзыва
 * POST /api/v1/reviews
 */
export const createReview = async (req, res, next) => {
  try {
    const {
      product: productId,
      rating,
      title,
      comment,
      pros,
      cons,
      images,
    } = req.body;
    const userId = req.user._id;

    // Проверка существования товара
    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 'Товар не найден', 404);
    }

    // Проверка, покупал ли пользователь этот товар
    const hasPurchased = await Order.findOne({
      user: userId,
      'items.product': productId,
      status: 'completed',
    });

    // Проверка, не оставлял ли уже отзыв
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return errorResponse(
        res,
        'Вы уже оставили отзыв на этот товар',
        400
      );
    }

    // Создание отзыва
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      title,
      comment,
      pros,
      cons,
      images: images || [],
      isPurchaseVerified: !!hasPurchased,
    });

    // Обновление рейтинга товара
    await product.updateRating();

    // Очистка кэша
    await deleteCachePattern(`product:${productId}*`);
    await deleteCachePattern('products:*');

    logger.info(`Review created for product ${productId} by user ${userId}`);

    return successResponse(
      res,
      await review.populate('user', 'firstName lastName avatar'),
      'Отзыв отправлен на модерацию',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Получение списка отзывов
 * GET /api/v1/reviews
 */
export const getReviews = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      product,
      user,
      rating,
      isApproved,
      sort = '-createdAt',
    } = req.query;

    // Построение фильтра
    const filter = {};
    if (product) filter.product = product;
    if (user) filter.user = user;
    if (rating) filter.rating = parseInt(rating);
    if (isApproved !== undefined) filter.isApproved = isApproved === 'true';

    const total = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName avatar')
      .populate('product', 'name slug images')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const pagination = createPagination(page, limit, total);

    return paginatedResponse(res, reviews, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение отзыва по ID
 * GET /api/v1/reviews/:id
 */
export const getReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('user', 'firstName lastName avatar')
      .populate('product', 'name slug images price')
      .populate('response.author', 'firstName lastName');

    if (!review) {
      return errorResponse(res, 'Отзыв не найден', 404);
    }

    return successResponse(res, review);
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление отзыва
 * PUT /api/v1/reviews/:id
 */
export const updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, pros, cons, images } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, 'Отзыв не найден', 404);
    }

    // Проверка прав
    if (review.user.toString() !== userId.toString()) {
      return errorResponse(res, 'Доступ запрещен', 403);
    }

    // Обновление полей
    if (rating !== undefined) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (pros) review.pros = pros;
    if (cons) review.cons = cons;
    if (images) review.images = images;

    // Сброс модерации при изменении
    review.isApproved = false;
    review.moderatedAt = null;

    await review.save();

    // Обновление рейтинга товара
    const product = await Product.findById(review.product);
    if (product) {
      await product.updateRating();
    }

    // Очистка кэша
    await deleteCachePattern(`product:${review.product}*`);
    await deleteCachePattern('products:*');

    logger.info(`Review ${id} updated by user ${userId}`);

    return successResponse(res, review, 'Отзыв обновлен');
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление отзыва
 * DELETE /api/v1/reviews/:id
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'manager';

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, 'Отзыв не найден', 404);
    }

    // Проверка прав
    if (!isAdmin && review.user.toString() !== userId.toString()) {
      return errorResponse(res, 'Доступ запрещен', 403);
    }

    const productId = review.product;
    await review.deleteOne();

    // Обновление рейтинга товара
    const product = await Product.findById(productId);
    if (product) {
      await product.updateRating();
    }

    // Очистка кэша
    await deleteCachePattern(`product:${productId}*`);
    await deleteCachePattern('products:*');

    logger.info(`Review ${id} deleted`);

    return successResponse(res, null, 'Отзыв удален');
  } catch (error) {
    next(error);
  }
};

/**
 * Модерация отзыва (только для администраторов)
 * PATCH /api/v1/reviews/:id/moderate
 */
export const moderateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved, moderationComment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, 'Отзыв не найден', 404);
    }

    review.isApproved = isApproved;
    review.moderatedAt = new Date();
    review.moderatedBy = req.user._id;
    if (moderationComment) {
      review.moderationComment = moderationComment;
    }

    await review.save();

    // Обновление рейтинга товара
    const product = await Product.findById(review.product);
    if (product) {
      await product.updateRating();
    }

    // Очистка кэша
    await deleteCachePattern(`product:${review.product}*`);
    await deleteCachePattern('products:*');

    logger.info(`Review ${id} moderated by ${req.user._id}`);

    return successResponse(
      res,
      review,
      isApproved ? 'Отзыв одобрен' : 'Отзыв отклонен'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Добавление ответа на отзыв (только для администраторов)
 * POST /api/v1/reviews/:id/response
 */
export const addResponse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, 'Отзыв не найден', 404);
    }

    review.response = {
      text,
      author: req.user._id,
      date: new Date(),
    };

    await review.save();

    logger.info(`Response added to review ${id}`);

    return successResponse(res, review, 'Ответ добавлен');
  } catch (error) {
    next(error);
  }
};

/**
 * Отметка "полезно" для отзыва
 * POST /api/v1/reviews/:id/helpful
 */
export const markHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, 'Отзыв не найден', 404);
    }

    // Проверка, не голосовал ли уже
    if (review.helpfulVotes.includes(userId)) {
      return errorResponse(res, 'Вы уже отметили этот отзыв', 400);
    }

    review.helpfulVotes.push(userId);
    await review.save();

    return successResponse(res, { helpfulCount: review.helpfulCount });
  } catch (error) {
    next(error);
  }
};

/**
 * Отметка "не полезно" для отзыва
 * POST /api/v1/reviews/:id/not-helpful
 */
export const markNotHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(id);

    if (!review) {
      return errorResponse(res, 'Отзыв не найден', 404);
    }

    // Проверка, не голосовал ли уже
    if (review.notHelpfulVotes.includes(userId)) {
      return errorResponse(res, 'Вы уже отметили этот отзыв', 400);
    }

    review.notHelpfulVotes.push(userId);
    await review.save();

    return successResponse(res, { notHelpfulCount: review.notHelpfulCount });
  } catch (error) {
    next(error);
  }
};

/**
 * Получение статистики отзывов
 * GET /api/v1/reviews/stats/summary
 */
export const getReviewStats = async (req, res, next) => {
  try {
    const { product } = req.query;

    const filter = product ? { product } : {};

    const stats = await Review.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          fiveStars: {
            $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] },
          },
          fourStars: {
            $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] },
          },
          threeStars: {
            $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] },
          },
          twoStars: {
            $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] },
          },
          oneStar: {
            $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] },
          },
          approvedReviews: {
            $sum: { $cond: ['$isApproved', 1, 0] },
          },
          pendingReviews: {
            $sum: { $cond: ['$isApproved', 0, 1] },
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
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  moderateReview,
  addResponse,
  markHelpful,
  markNotHelpful,
  getReviewStats,
};
