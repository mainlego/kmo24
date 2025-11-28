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
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Публичные маршруты
router.get('/', asyncHandler(getReviews));
router.get('/stats/summary', asyncHandler(getReviewStats));
router.get('/:id', asyncHandler(getReview));

// Защищенные маршруты
router.post('/', protect, asyncHandler(createReview));
router.put('/:id', protect, asyncHandler(updateReview));
router.delete('/:id', protect, asyncHandler(deleteReview));
router.post('/:id/helpful', protect, asyncHandler(markHelpful));
router.post('/:id/not-helpful', protect, asyncHandler(markNotHelpful));

// Маршруты только для администраторов
router.patch('/:id/moderate', protect, authorize('admin', 'manager'), asyncHandler(moderateReview));
router.post('/:id/response', protect, authorize('admin', 'manager'), asyncHandler(addResponse));

export default router;
