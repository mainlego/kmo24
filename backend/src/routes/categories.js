import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  reorderCategories,
} from '../controllers/categories.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Публичные маршруты
router.get('/', asyncHandler(getCategories));
router.get('/:id', asyncHandler(getCategory));
router.get('/:id/products', asyncHandler(getCategoryProducts));

// Маршруты только для администраторов
router.post('/', protect, authorize('admin', 'manager'), asyncHandler(createCategory));
router.put('/:id', protect, authorize('admin', 'manager'), asyncHandler(updateCategory));
router.delete('/:id', protect, authorize('admin', 'manager'), asyncHandler(deleteCategory));
router.patch('/reorder', protect, authorize('admin', 'manager'), asyncHandler(reorderCategories));

export default router;
