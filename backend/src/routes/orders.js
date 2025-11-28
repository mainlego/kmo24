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
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Публичные/защищенные маршруты
router.post('/', protect, asyncHandler(createOrder));
router.get('/', protect, asyncHandler(getMyOrders));
router.get('/:id', protect, asyncHandler(getOrder));
router.post('/:id/cancel', protect, asyncHandler(cancelOrder));

// Маршруты только для администраторов
router.get('/all/list', protect, authorize('admin', 'manager'), asyncHandler(getAllOrders));
router.patch('/:id/status', protect, authorize('admin', 'manager'), asyncHandler(updateOrderStatus));
router.patch('/:id/payment', protect, authorize('admin', 'manager'), asyncHandler(updatePaymentStatus));
router.get('/stats/summary', protect, authorize('admin', 'manager'), asyncHandler(getOrderStats));

export default router;
