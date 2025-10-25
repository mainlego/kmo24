import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/User.js';
import { getCache, setCache } from '../config/redis.js';

/**
 * Middleware для проверки JWT токена
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Получаем токен из заголовка Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Или из cookie
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Не авторизован',
      });
    }

    try {
      // Верифицируем токен
      const decoded = jwt.verify(token, config.jwt.secret);

      // Проверяем кэш пользователя
      const cacheKey = `user:${decoded.id}`;
      let user = await getCache(cacheKey);

      if (!user) {
        // Получаем пользователя из БД
        user = await User.findById(decoded.id).select('-password');

        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'Пользователь не найден',
          });
        }

        if (!user.isActive) {
          return res.status(401).json({
            success: false,
            error: 'Аккаунт деактивирован',
          });
        }

        // Кэшируем пользователя на 1 час
        await setCache(cacheKey, user, 3600);
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Недействительный токен',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware для проверки ролей
 * @param  {...string} roles - Разрешенные роли
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Не авторизован',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'У вас нет прав для выполнения этого действия',
      });
    }

    next();
  };
};

/**
 * Middleware для опциональной аутентификации
 * Если токен есть - проверяем, если нет - пропускаем
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(decoded.id).select('-password');

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Игнорируем ошибки токена для опциональной аутентификации
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
