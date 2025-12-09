import crypto from 'crypto';
import User from '../models/User.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { deleteCache } from '../config/redis-mock.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

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
    const { firstName, lastName, phone, birthDate, gender, notifications } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    // Обновление полей
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (birthDate !== undefined) user.birthDate = birthDate;
    if (gender !== undefined) user.gender = gender;
    if (notifications !== undefined) {
      user.notifications = {
        email: notifications.email !== undefined ? notifications.email : user.notifications.email,
        sms: notifications.sms !== undefined ? notifications.sms : user.notifications.sms,
        newsletter: notifications.newsletter !== undefined ? notifications.newsletter : user.notifications.newsletter,
      };
    }

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

/**
 * Получение всех адресов текущего пользователя
 * GET /api/v1/auth/addresses
 */
export const getMyAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    return successResponse(res, user.addresses);
  } catch (error) {
    next(error);
  }
};

/**
 * Добавление адреса текущему пользователю
 * POST /api/v1/auth/addresses
 */
export const addMyAddress = async (req, res, next) => {
  try {
    const address = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    // Если это первый адрес или задан по умолчанию
    if (address.isDefault || user.addresses.length === 0) {
      // Сброс других адресов
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
      address.isDefault = true;
    }

    user.addresses.push(address);
    await user.save();

    // Очистка кэша
    await deleteCache(`user:${user._id}`);

    logger.info(`Address added for user: ${user.email}`);

    return successResponse(res, user.addresses, 'Адрес добавлен', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление адреса текущего пользователя
 * PUT /api/v1/auth/addresses/:addressId
 */
export const updateMyAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return errorResponse(res, 'Адрес не найден', 404);
    }

    // Обновление полей адреса
    Object.keys(updates).forEach((key) => {
      if (key !== '_id') {
        address[key] = updates[key];
      }
    });

    // Если устанавливаем как основной, сбрасываем другие
    if (updates.isDefault) {
      user.addresses.forEach((addr) => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    await user.save();

    // Очистка кэша
    await deleteCache(`user:${user._id}`);

    logger.info(`Address updated for user: ${user.email}`);

    return successResponse(res, user.addresses, 'Адрес обновлен');
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление адреса текущего пользователя
 * DELETE /api/v1/auth/addresses/:addressId
 */
export const deleteMyAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return errorResponse(res, 'Адрес не найден', 404);
    }

    const wasDefault = address.isDefault;
    address.remove();

    // Если удалили основной адрес, делаем первый оставшийся основным
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    // Очистка кэша
    await deleteCache(`user:${user._id}`);

    logger.info(`Address deleted for user: ${user.email}`);

    return successResponse(res, user.addresses, 'Адрес удален');
  } catch (error) {
    next(error);
  }
};

/**
 * Установка адреса как основного
 * PATCH /api/v1/auth/addresses/:addressId/default
 */
export const setDefaultAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 'Пользователь не найден', 404);
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return errorResponse(res, 'Адрес не найден', 404);
    }

    // Сброс всех адресов
    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();

    // Очистка кэша
    await deleteCache(`user:${user._id}`);

    logger.info(`Default address set for user: ${user.email}`);

    return successResponse(res, user.addresses, 'Адрес установлен как основной');
  } catch (error) {
    next(error);
  }
};

/**
 * Авторизация через Telegram
 * POST /api/v1/auth/telegram
 */
export const telegramAuth = async (req, res, next) => {
  try {
    const { id, first_name, last_name, username, photo_url, auth_date, hash } = req.body;

    // Логирование для диагностики
    logger.info('Telegram auth request:', { id, first_name, username, auth_date, hasHash: !!hash });

    // Проверка обязательных полей
    if (!id || !first_name || !auth_date || !hash) {
      logger.warn('Telegram auth missing fields:', { id: !!id, first_name: !!first_name, auth_date: !!auth_date, hash: !!hash });
      return errorResponse(res, 'Недостаточно данных для авторизации', 400);
    }

    // Получение токена бота из конфигурации
    const botToken = config.telegram?.botToken || process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      logger.error('TELEGRAM_BOT_TOKEN not configured');
      return errorResponse(res, 'Telegram авторизация не настроена', 500);
    }

    // Проверка подлинности данных от Telegram
    const checkString = Object.keys(req.body)
      .filter(key => key !== 'hash')
      .sort()
      .map(key => `${key}=${req.body[key]}`)
      .join('\n');

    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

    if (hmac !== hash) {
      logger.warn(`Telegram auth failed: invalid hash for user ${id}`);
      return errorResponse(res, 'Неверная подпись данных', 401);
    }

    // Проверка срока действия данных (не старше 1 часа)
    const authTimestamp = parseInt(auth_date);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - authTimestamp > 3600) {
      return errorResponse(res, 'Данные авторизации устарели', 401);
    }

    // Поиск существующего пользователя по telegramId
    let user = await User.findOne({ telegramId: String(id) });

    if (!user) {
      // Создание нового пользователя
      user = await User.create({
        telegramId: String(id),
        telegramUsername: username || null,
        firstName: first_name,
        lastName: last_name || '',
        avatar: photo_url || null,
        isEmailVerified: false, // Email не подтвержден, так как его нет
      });

      logger.info(`New Telegram user registered: ${first_name} (${id})`);
    } else {
      // Обновление данных существующего пользователя
      user.firstName = first_name;
      if (last_name) user.lastName = last_name;
      if (username) user.telegramUsername = username;
      if (photo_url) user.avatar = photo_url;
      user.lastLogin = new Date();
      await user.save();

      logger.info(`Telegram user logged in: ${first_name} (${id})`);
    }

    // Проверка активности аккаунта
    if (!user.isActive) {
      return errorResponse(res, 'Аккаунт деактивирован', 401);
    }

    // Генерация токенов
    const { accessToken, refreshToken } = generateTokenPair(user._id);

    // Сохранение refresh token
    await user.addRefreshToken(
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
    );

    return successResponse(res, {
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
    });
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
  getMyAddresses,
  addMyAddress,
  updateMyAddress,
  deleteMyAddress,
  setDefaultAddress,
  telegramAuth,
};
