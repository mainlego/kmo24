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
  telegramWebhook,
  getTelegramSettings,
  setupTelegramWebhook,
} from '../controllers/news.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Публичные статические маршруты (ПЕРЕД динамическими /:id)
router.get('/tags/all', asyncHandler(getAllTags));

// Telegram webhook (публичный, вызывается Telegram сервером)
router.post('/webhook/telegram', asyncHandler(telegramWebhook));

// Маршруты для администраторов (статические)
router.get('/telegram/settings', protect, authorize('admin'), asyncHandler(getTelegramSettings));
router.post('/telegram/setup-webhook', protect, authorize('admin'), asyncHandler(setupTelegramWebhook));
router.post('/sync/telegram', protect, authorize('admin', 'manager'), asyncHandler(syncFromTelegram));

// Публичные маршруты
router.get('/', asyncHandler(getNews));

// Маршруты для администраторов (CRUD)
router.post('/', protect, authorize('admin', 'manager'), asyncHandler(createNews));

// Динамические маршруты (ПОСЛЕ статических)
router.get('/:id', asyncHandler(getNewsItem));
router.get('/:id/related', asyncHandler(getRelatedNews));
router.put('/:id', protect, authorize('admin', 'manager'), asyncHandler(updateNews));
router.delete('/:id', protect, authorize('admin', 'manager'), asyncHandler(deleteNews));
router.patch('/:id/publish', protect, authorize('admin', 'manager'), asyncHandler(togglePublish));

export default router;
