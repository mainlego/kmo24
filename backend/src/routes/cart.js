import express from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  applyPromoCode,
  removePromoCode,
  mergeCart,
} from '../controllers/cart.js';
import { optionalAuth, protect } from '../middleware/auth.js';
import { validate, cartSchemas } from '../utils/validation.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

/**
 * @route   GET /api/v1/cart
 * @desc    Получение корзины
 * @access  Public (с session ID) / Private
 */
router.get('/', optionalAuth, asyncHandler(getCart));

/**
 * @route   POST /api/v1/cart/items
 * @desc    Добавление товара в корзину
 * @access  Public (с session ID) / Private
 */
router.post('/items', optionalAuth, validate(cartSchemas.addItem), asyncHandler(addItem));

/**
 * @route   PUT /api/v1/cart/items/:productId
 * @desc    Обновление количества товара
 * @access  Public (с session ID) / Private
 */
router.put('/items/:productId', optionalAuth, validate(cartSchemas.updateItem), asyncHandler(updateItem));

/**
 * @route   DELETE /api/v1/cart/items/:productId
 * @desc    Удаление товара из корзины
 * @access  Public (с session ID) / Private
 */
router.delete('/items/:productId', optionalAuth, asyncHandler(removeItem));

/**
 * @route   DELETE /api/v1/cart
 * @desc    Очистка корзины
 * @access  Public (с session ID) / Private
 */
router.delete('/', optionalAuth, asyncHandler(clearCart));

/**
 * @route   POST /api/v1/cart/promo-code
 * @desc    Применение промокода
 * @access  Public (с session ID) / Private
 */
router.post('/promo-code', optionalAuth, validate(cartSchemas.applyPromoCode), asyncHandler(applyPromoCode));

/**
 * @route   DELETE /api/v1/cart/promo-code
 * @desc    Удаление промокода
 * @access  Public (с session ID) / Private
 */
router.delete('/promo-code', optionalAuth, asyncHandler(removePromoCode));

/**
 * @route   POST /api/v1/cart/merge
 * @desc    Слияние гостевой корзины с корзиной пользователя
 * @access  Private
 */
router.post('/merge', protect, asyncHandler(mergeCart));

export default router;
