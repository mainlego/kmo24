import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Обработчик ошибок Express
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Логирование ошибки с расширенным контекстом
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl || req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?._id || 'anonymous',
    body: req.body,
    params: req.params,
    query: req.query,
    headers: {
      'content-type': req.get('content-type'),
      'x-session-id': req.get('x-session-id'),
    },
    timestamp: new Date().toISOString(),
    errorCode: err.code,
    errorName: err.name,
  });

  // Ошибка валидации Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    error.message = 'Ошибка валидации данных';
    error.statusCode = 400;
    error.errors = errors;
  }

  // Ошибка дубликата ключа Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} уже существует`;
    error.statusCode = 400;
  }

  // Ошибка Cast Mongoose (неверный ObjectId)
  if (err.name === 'CastError') {
    error.message = 'Ресурс не найден';
    error.statusCode = 404;
  }

  // Ошибка JWT
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Недействительный токен';
    error.statusCode = 401;
  }

  // Ошибка истекшего JWT
  if (err.name === 'TokenExpiredError') {
    error.message = 'Токен истек';
    error.statusCode = 401;
  }

  // Формирование ответа
  const response = {
    success: false,
    error: error.message || 'Ошибка сервера',
  };

  // Добавляем детали в режиме разработки
  if (config.env === 'development') {
    response.stack = err.stack;
    response.originalError = err;
  }

  // Добавляем массив ошибок валидации если есть
  if (error.errors) {
    response.errors = error.errors;
  }

  res.status(error.statusCode || 500).json(response);
};

export default errorHandler;
