import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

/**
 * Общий rate limiter
 */
export const generalLimiter = rateLimit({
  windowMs: config.security.rateLimitWindow * 60 * 1000,
  max: config.security.rateLimitMaxRequests,
  message: {
    success: false,
    error: 'Слишком много запросов с этого IP, попробуйте позже',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter для аутентификации (более строгий)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // 5 попыток
  message: {
    success: false,
    error: 'Слишком много попыток входа, попробуйте позже',
  },
  skipSuccessfulRequests: true,
});

/**
 * Rate limiter для API запросов
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 60, // 60 запросов в минуту
  message: {
    success: false,
    error: 'Превышен лимит запросов к API',
  },
});

/**
 * Rate limiter для создания заказов
 */
export const orderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 минут
  max: 3, // 3 заказа
  message: {
    success: false,
    error: 'Слишком много заказов, подождите немного',
  },
});

/**
 * Rate limiter для отзывов
 */
export const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 5, // 5 отзывов в час
  message: {
    success: false,
    error: 'Слишком много отзывов, попробуйте позже',
  },
});

export default {
  generalLimiter,
  authLimiter,
  apiLimiter,
  orderLimiter,
  reviewLimiter,
};
