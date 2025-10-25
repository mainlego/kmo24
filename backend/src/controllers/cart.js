import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

/**
 * Получить или создать корзину
 */
const getOrCreateCart = async (userId, sessionId) => {
  let cart;

  if (userId) {
    cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    }
  }

  return cart;
};

/**
 * Получение корзины
 * GET /api/v1/cart
 */
export const getCart = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return errorResponse(res, 'Требуется авторизация или session ID', 400);
    }

    const cart = await getOrCreateCart(userId, sessionId);

    if (!cart) {
      return successResponse(res, {
        items: [],
        totalItems: 0,
        subtotal: 0,
        total: 0,
      });
    }

    // Обновление цен товаров
    await cart.updatePrices();

    // Проверка доступности товаров
    const unavailableItems = await cart.validateAvailability();

    return successResponse(res, {
      ...cart.toObject(),
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      total: cart.total,
      unavailableItems,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Добавление товара в корзину
 * POST /api/v1/cart/items
 */
export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity, variant } = req.body;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return errorResponse(res, 'Требуется авторизация или session ID', 400);
    }

    // Проверка существования товара
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return errorResponse(res, 'Товар не найден или недоступен', 404);
    }

    // Проверка наличия
    if (product.stock.available < quantity) {
      return errorResponse(
        res,
        `Недостаточно товара на складе. Доступно: ${product.stock.available}`,
        400
      );
    }

    const cart = await getOrCreateCart(userId, sessionId);
    await cart.addItem(productId, quantity, variant, product.price);

    logger.info(`Item added to cart: ${product.name} x${quantity}`);

    return successResponse(res, {
      ...cart.toObject(),
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      total: cart.total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление количества товара
 * PUT /api/v1/cart/items/:productId
 */
export const updateItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return errorResponse(res, 'Требуется авторизация или session ID', 400);
    }

    const cart = await getOrCreateCart(userId, sessionId);

    if (!cart) {
      return errorResponse(res, 'Корзина не найдена', 404);
    }

    // Проверка наличия товара
    const product = await Product.findById(productId);
    if (product && product.stock.available < quantity) {
      return errorResponse(
        res,
        `Недостаточно товара на складе. Доступно: ${product.stock.available}`,
        400
      );
    }

    await cart.updateItemQuantity(productId, quantity);

    return successResponse(res, {
      ...cart.toObject(),
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      total: cart.total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление товара из корзины
 * DELETE /api/v1/cart/items/:productId
 */
export const removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return errorResponse(res, 'Требуется авторизация или session ID', 400);
    }

    const cart = await getOrCreateCart(userId, sessionId);

    if (!cart) {
      return errorResponse(res, 'Корзина не найдена', 404);
    }

    await cart.removeItem(productId);

    return successResponse(res, {
      ...cart.toObject(),
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      total: cart.total,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Очистка корзины
 * DELETE /api/v1/cart
 */
export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return errorResponse(res, 'Требуется авторизация или session ID', 400);
    }

    const cart = await getOrCreateCart(userId, sessionId);

    if (cart) {
      await cart.clear();
    }

    return successResponse(res, null, 'Корзина очищена');
  } catch (error) {
    next(error);
  }
};

/**
 * Применение промокода
 * POST /api/v1/cart/promo-code
 */
export const applyPromoCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return errorResponse(res, 'Требуется авторизация или session ID', 400);
    }

    const cart = await getOrCreateCart(userId, sessionId);

    if (!cart) {
      return errorResponse(res, 'Корзина не найдена', 404);
    }

    // TODO: Реализовать проверку промокода в базе данных
    // Пока просто демо-версия
    const discount = 500; // 500 рублей скидка
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await cart.applyPromoCode(code, discount, expiresAt);

    return successResponse(res, {
      ...cart.toObject(),
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      total: cart.total,
    }, 'Промокод применен');
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление промокода
 * DELETE /api/v1/cart/promo-code
 */
export const removePromoCode = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'];

    if (!userId && !sessionId) {
      return errorResponse(res, 'Требуется авторизация или session ID', 400);
    }

    const cart = await getOrCreateCart(userId, sessionId);

    if (!cart) {
      return errorResponse(res, 'Корзина не найдена', 404);
    }

    await cart.removePromoCode();

    return successResponse(res, {
      ...cart.toObject(),
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
      total: cart.total,
    }, 'Промокод удален');
  } catch (error) {
    next(error);
  }
};

export default {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  applyPromoCode,
  removePromoCode,
};
