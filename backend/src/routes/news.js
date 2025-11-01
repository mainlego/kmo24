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

const router = express.Router();

// Публичные маршруты
router.get('/', getNews);
router.get('/tags/all', getAllTags);
router.get('/:id', getNewsItem);
router.get('/:id/related', getRelatedNews);

// Маршруты только для администраторов
router.post('/', protect, authorize('admin', 'manager'), createNews);
router.put('/:id', protect, authorize('admin', 'manager'), updateNews);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteNews);
router.patch('/:id/publish', protect, authorize('admin', 'manager'), togglePublish);
router.post('/sync/telegram', protect, authorize('admin', 'manager'), syncFromTelegram);

export default router;
