import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  changePassword,
  getMyAddresses,
  addMyAddress,
  updateMyAddress,
  deleteMyAddress,
  setDefaultAddress,
} from '../controllers/auth.js';
import { protect } from '../middleware/auth.js';
import { validate, authSchemas } from '../utils/validation.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Регистрация нового пользователя
 * @access  Public
 */
router.post('/register', authLimiter, validate(authSchemas.register), register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Вход пользователя
 * @access  Public
 */
router.post('/login', authLimiter, validate(authSchemas.login), login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Обновление токенов
 * @access  Public
 */
router.post('/refresh', validate(authSchemas.refreshToken), refresh);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Выход пользователя
 * @access  Private
 */
router.post('/logout', protect, logout);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Получение информации о текущем пользователе
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Обновление профиля
 * @access  Private
 */
router.put('/profile', protect, validate(authSchemas.updateProfile), updateProfile);

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Изменение пароля
 * @access  Private
 */
router.put('/change-password', protect, validate(authSchemas.changePassword), changePassword);

/**
 * @route   GET /api/v1/auth/addresses
 * @desc    Получение всех адресов текущего пользователя
 * @access  Private
 */
router.get('/addresses', protect, getMyAddresses);

/**
 * @route   POST /api/v1/auth/addresses
 * @desc    Добавление адреса текущему пользователю
 * @access  Private
 */
router.post('/addresses', protect, validate(authSchemas.addAddress), addMyAddress);

/**
 * @route   PUT /api/v1/auth/addresses/:addressId
 * @desc    Обновление адреса текущего пользователя
 * @access  Private
 */
router.put('/addresses/:addressId', protect, validate(authSchemas.updateAddress), updateMyAddress);

/**
 * @route   DELETE /api/v1/auth/addresses/:addressId
 * @desc    Удаление адреса текущего пользователя
 * @access  Private
 */
router.delete('/addresses/:addressId', protect, deleteMyAddress);

/**
 * @route   PATCH /api/v1/auth/addresses/:addressId/default
 * @desc    Установка адреса как основного
 * @access  Private
 */
router.patch('/addresses/:addressId/default', protect, setDefaultAddress);

export default router;
