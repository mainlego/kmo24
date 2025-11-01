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

const router = express.Router();

// Публичные маршруты
router.get('/', getCategories);
router.get('/:id', getCategory);
router.get('/:id/products', getCategoryProducts);

// Маршруты только для администраторов
router.post('/', protect, authorize('admin', 'manager'), createCategory);
router.put('/:id', protect, authorize('admin', 'manager'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteCategory);
router.patch('/reorder', protect, authorize('admin', 'manager'), reorderCategories);

export default router;
