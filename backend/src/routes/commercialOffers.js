import express from 'express';
import {
  createCommercialOffer,
  getCommercialOffers,
  getCommercialOffer,
  getByOfferNumber,
  updateCommercialOffer,
  deleteCommercialOffer,
  updateStatus,
  sendCommercialOffer,
  generatePDF,
  getStats,
} from '../controllers/commercialOffers.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Все маршруты требуют авторизации
router.use(protect);

// Общие маршруты
router.get('/', asyncHandler(getCommercialOffers));
router.post('/', asyncHandler(createCommercialOffer));
router.get('/stats/summary', authorize('admin', 'manager'), asyncHandler(getStats));
router.get('/number/:offerNumber', asyncHandler(getByOfferNumber));
router.get('/:id', asyncHandler(getCommercialOffer));
router.put('/:id', authorize('admin', 'manager'), asyncHandler(updateCommercialOffer));
router.delete('/:id', authorize('admin', 'manager'), asyncHandler(deleteCommercialOffer));
router.patch('/:id/status', authorize('admin', 'manager'), asyncHandler(updateStatus));
router.post('/:id/send', asyncHandler(sendCommercialOffer));
router.get('/:id/pdf', asyncHandler(generatePDF));

export default router;
