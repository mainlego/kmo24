import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  getRelatedProducts,
} from '../controllers/products.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate, productSchemas } from '../utils/validation.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   GET /api/v1/products
 * @desc    Получение списка товаров с фильтрацией
 * @access  Public
 */
router.get('/', apiLimiter, validate(productSchemas.query, 'query'), getProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Получение одного товара
 * @access  Public
 */
router.get('/:id', getProduct);

/**
 * @route   GET /api/v1/products/:id/reviews
 * @desc    Получение отзывов товара
 * @access  Public
 */
router.get('/:id/reviews', getProductReviews);

/**
 * @route   GET /api/v1/products/:id/related
 * @desc    Получение похожих товаров
 * @access  Public
 */
router.get('/:id/related', getRelatedProducts);

/**
 * @route   POST /api/v1/products
 * @desc    Создание нового товара
 * @access  Private (Admin, Manager)
 */
router.post(
  '/',
  protect,
  authorize('admin', 'manager'),
  validate(productSchemas.create),
  createProduct
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Обновление товара
 * @access  Private (Admin, Manager)
 */
router.put(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  validate(productSchemas.update),
  updateProduct
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Удаление товара (деактивация)
 * @access  Private (Admin)
 */
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
