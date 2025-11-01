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

const router = express.Router();

// Все маршруты требуют авторизации
router.use(protect);

// Общие маршруты
router.get('/', getCommercialOffers);
router.post('/', createCommercialOffer);
router.get('/stats/summary', authorize('admin', 'manager'), getStats);
router.get('/number/:offerNumber', getByOfferNumber);
router.get('/:id', getCommercialOffer);
router.put('/:id', authorize('admin', 'manager'), updateCommercialOffer);
router.delete('/:id', authorize('admin', 'manager'), deleteCommercialOffer);
router.patch('/:id/status', authorize('admin', 'manager'), updateStatus);
router.post('/:id/send', sendCommercialOffer);
router.get('/:id/pdf', generatePDF);

export default router;
