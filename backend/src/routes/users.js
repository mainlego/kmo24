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

const router = express.Router();

// Все маршруты требуют права администратора
router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', getUsers);
router.post('/', createUser);
router.get('/stats/summary', getUserStats);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/password', changeUserPassword);
router.patch('/:id/role', changeUserRole);
router.get('/:id/orders', getUserOrders);
router.post('/:id/addresses', addAddress);
router.delete('/:id/addresses/:addressId', removeAddress);

export default router;
