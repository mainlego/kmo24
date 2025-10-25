import User from '../models/User.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { deleteCache } from '../config/redis.js';
import logger from '../utils/logger.js';

/**
 * Регистрация нового пользователя
 * POST /api/v1/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Проверка существования пользователя
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Пользователь с таким email уже существует', 400);
    }

    // Создание пользователя
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
    });

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokenPair(user._id);

    // Сохранение refresh token
    await user.addRefreshToken(
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
    );

    logger.info(`New user registered: ${user.email}`);

    return successResponse(
      res,
      {
        user: user.toPublicJSON(),
        accessToken,
        refreshToken,
      },
      'Регистрация успешна',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Вход пользователя
 * POST /api/v1/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Поиск пользователя с паролем
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Неверный email или пароль', 401);
    }

    // Проверка активности аккаунта
    if (!user.isActive) {
      return errorResponse(res, 'Аккаунт деактивирован', 401);
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse(res, 'Неверный email или пароль', 401);
    }

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokenPair(user._id);

    // Сохранение refresh token
    await user.addRefreshToken(
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
    );

    // Обновление времени последнего входа
    user.lastLogin = new Date();
    await user.save();

    logger.info(`User logged in: ${user.email}`);

    return successResponse(res, {
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление токенов
 * POST /api/v1/auth/refresh
 */
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    // Верификация refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return errorResponse(res, 'Недействительный refresh token', 401);
    }

    // Поиск пользователя
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return errorResponse(res, 'Пользователь не найден или деактивирован', 401);
    }

    // Проверка наличия refresh token у пользователя
    const hasToken = user.refreshTokens.some(
      (rt) => rt.token === refreshToken && rt.expires > new Date()
    );

    if (!hasToken) {
      return errorResponse(res, 'Refresh token не найден или истек', 401);
    }

    // Генерация новых токенов
    const tokens = generateTokenPair(user._id);

    // Удаление старого refresh token и добавление нового
    await user.removeRefreshToken(refreshToken);
    await user.addRefreshToken(
      tokens.refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    // Очистка кэша пользователя
    await deleteCache(`user:${user._id}`);

    return successResponse(res, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Выход пользователя
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user;

    if (refreshToken) {
      // Удаление refresh token
      await user.removeRefreshToken(refreshToken);
    }

    // Очистка кэша пользователя
    await deleteCache(`user:${user._id}`);

    logger.info(`User logged out: ${user.email}`);

    return successResponse(res, null, 'Выход выполнен успешно');
  } catch (error) {
    next(error);
  }
};

/**
 * Получение текущего пользователя
 * GET /api/v1/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    return successResponse(res, user.toPublicJSON());
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление профиля
 * PUT /api/v1/auth/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    // Обновление полей
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    // Очистка кэша
    await deleteCache(`user:${user._id}`);

    logger.info(`User profile updated: ${user.email}`);

    return successResponse(res, user.toPublicJSON(), 'Профиль обновлен');
  } catch (error) {
    next(error);
  }
};

/**
 * Изменение пароля
 * PUT /api/v1/auth/change-password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    // Проверка текущего пароля
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return errorResponse(res, 'Неверный текущий пароль', 400);
    }

    // Установка нового пароля
    user.password = newPassword;
    await user.save();

    // Удаление всех refresh tokens (выход со всех устройств)
    user.refreshTokens = [];
    await user.save();

    // Очистка кэша
    await deleteCache(`user:${user._id}`);

    logger.info(`User password changed: ${user.email}`);

    return successResponse(res, null, 'Пароль успешно изменен');
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateProfile,
  changePassword,
};
