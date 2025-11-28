import logger from '../utils/logger.js';

/**
 * Middleware для логирования HTTP запросов
 */
const requestLogger = (req, res, next) => {
  // Запоминаем время начала запроса
  req.startTime = Date.now();

  // Логируем входящий запрос
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?._id || 'anonymous',
    sessionId: req.headers['x-session-id'],
  });

  // Перехватываем завершение ответа
  const originalSend = res.send;
  res.send = function (data) {
    const responseTime = Date.now() - req.startTime;

    // Логируем исходящий ответ
    logger.info('Response sent', {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userId: req.user?._id || 'anonymous',
    });

    // Если время ответа слишком большое, логируем предупреждение
    if (responseTime > 1000) {
      logger.warn('Slow response detected', {
        method: req.method,
        url: req.originalUrl || req.url,
        responseTime: `${responseTime}ms`,
        threshold: '1000ms',
      });
    }

    originalSend.call(this, data);
  };

  next();
};

export default requestLogger;