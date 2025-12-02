import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  changeUserRole,
  getUserOrders,
  addAddress,
  removeAddress,
  getUserStats,
} from '../controllers/users.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

// Все маршруты требуют права администратора
router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', asyncHandler(getUsers));
router.post('/', asyncHandler(createUser));
router.get('/stats', asyncHandler(getUserStats));
router.get('/stats/summary', asyncHandler(getUserStats));
router.get('/:id', asyncHandler(getUser));
router.put('/:id', asyncHandler(updateUser));
router.delete('/:id', asyncHandler(deleteUser));
router.patch('/:id/password', asyncHandler(changeUserPassword));
router.patch('/:id/role', asyncHandler(changeUserRole));
router.get('/:id/orders', asyncHandler(getUserOrders));
router.post('/:id/addresses', asyncHandler(addAddress));
router.delete('/:id/addresses/:addressId', asyncHandler(removeAddress));

export default router;
