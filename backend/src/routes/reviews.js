import express from 'express';
import {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  moderateReview,
  addResponse,
  markHelpful,
  markNotHelpful,
  getReviewStats,
} from '../controllers/reviews.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Публичные маршруты
router.get('/', getReviews);
router.get('/stats/summary', getReviewStats);
router.get('/:id', getReview);

// Защищенные маршруты
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);
router.post('/:id/not-helpful', protect, markNotHelpful);

// Маршруты только для администраторов
router.patch('/:id/moderate', protect, authorize('admin', 'manager'), moderateReview);
router.post('/:id/response', protect, authorize('admin', 'manager'), addResponse);

export default router;
