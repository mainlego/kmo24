import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  changePassword,
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
router.put('/profile', protect, updateProfile);

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Изменение пароля
 * @access  Private
 */
router.put('/change-password', protect, changePassword);

export default router;
