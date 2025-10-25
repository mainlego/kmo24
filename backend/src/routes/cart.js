import express from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  applyPromoCode,
  removePromoCode,
} from '../controllers/cart.js';
import { optionalAuth } from '../middleware/auth.js';
import { validate, cartSchemas } from '../utils/validation.js';

const router = express.Router();

/**
 * @route   GET /api/v1/cart
 * @desc    Получение корзины
 * @access  Public (с session ID) / Private
 */
router.get('/', optionalAuth, getCart);

/**
 * @route   POST /api/v1/cart/items
 * @desc    Добавление товара в корзину
 * @access  Public (с session ID) / Private
 */
router.post('/items', optionalAuth, validate(cartSchemas.addItem), addItem);

/**
 * @route   PUT /api/v1/cart/items/:productId
 * @desc    Обновление количества товара
 * @access  Public (с session ID) / Private
 */
router.put('/items/:productId', optionalAuth, validate(cartSchemas.updateItem), updateItem);

/**
 * @route   DELETE /api/v1/cart/items/:productId
 * @desc    Удаление товара из корзины
 * @access  Public (с session ID) / Private
 */
router.delete('/items/:productId', optionalAuth, removeItem);

/**
 * @route   DELETE /api/v1/cart
 * @desc    Очистка корзины
 * @access  Public (с session ID) / Private
 */
router.delete('/', optionalAuth, clearCart);

/**
 * @route   POST /api/v1/cart/promo-code
 * @desc    Применение промокода
 * @access  Public (с session ID) / Private
 */
router.post('/promo-code', optionalAuth, validate(cartSchemas.applyPromoCode), applyPromoCode);

/**
 * @route   DELETE /api/v1/cart/promo-code
 * @desc    Удаление промокода
 * @access  Public (с session ID) / Private
 */
router.delete('/promo-code', optionalAuth, removePromoCode);

export default router;
