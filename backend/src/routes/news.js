import express from 'express';
import {
  getNews,
  getNewsItem,
  createNews,
  updateNews,
  deleteNews,
  togglePublish,
  getRelatedNews,
  getAllTags,
  syncFromTelegram,
} from '../controllers/news.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Публичные маршруты
router.get('/', asyncHandler(getNews));
router.get('/tags/all', asyncHandler(getAllTags));
router.get('/:id', asyncHandler(getNewsItem));
router.get('/:id/related', asyncHandler(getRelatedNews));

// Маршруты только для администраторов
router.post('/', protect, authorize('admin', 'manager'), asyncHandler(createNews));
router.put('/:id', protect, authorize('admin', 'manager'), asyncHandler(updateNews));
router.delete('/:id', protect, authorize('admin', 'manager'), asyncHandler(deleteNews));
router.patch('/:id/publish', protect, authorize('admin', 'manager'), asyncHandler(togglePublish));
router.post('/sync/telegram', protect, authorize('admin', 'manager'), asyncHandler(syncFromTelegram));

export default router;
