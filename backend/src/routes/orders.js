import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getOrderStats,
} from '../controllers/orders.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Публичные/защищенные маршруты
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.post('/:id/cancel', protect, cancelOrder);

// Маршруты только для администраторов
router.get('/all/list', protect, authorize('admin', 'manager'), getAllOrders);
router.patch('/:id/status', protect, authorize('admin', 'manager'), updateOrderStatus);
router.patch('/:id/payment', protect, authorize('admin', 'manager'), updatePaymentStatus);
router.get('/stats/summary', protect, authorize('admin', 'manager'), getOrderStats);

export default router;
