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
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Статические маршруты должны быть ПЕРЕД динамическими /:id
// Маршруты только для администраторов
router.get('/stats', protect, authorize('admin', 'manager'), asyncHandler(getOrderStats));
router.get('/stats/summary', protect, authorize('admin', 'manager'), asyncHandler(getOrderStats));
router.get('/all/list', protect, authorize('admin', 'manager'), asyncHandler(getAllOrders));

// Публичные/защищенные маршруты
router.post('/', optionalAuth, asyncHandler(createOrder)); // Гости тоже могут создавать заказы
router.get('/', protect, asyncHandler(getMyOrders));
router.get('/my', protect, asyncHandler(getMyOrders)); // Alias for /orders

// Динамические маршруты с :id в конце
router.get('/:id', protect, asyncHandler(getOrder));
router.post('/:id/cancel', protect, asyncHandler(cancelOrder));
router.patch('/:id/status', protect, authorize('admin', 'manager'), asyncHandler(updateOrderStatus));
router.patch('/:id/payment', protect, authorize('admin', 'manager'), asyncHandler(updatePaymentStatus));

export default router;
