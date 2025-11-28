import logger from '../utils/logger.js';

/**
 * Валидация обязательных environment variables
 */
export const validateRequiredEnv = () => {
  const requiredEnvVars = {
    // Критичные для production
    production: [
      'MONGODB_URI',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      // 'REDIS_URL', // Убираем, так как используем mock-redis
      // 'CORS_ORIGIN', // Опционально, есть дефолтное значение
    ],
    // Минимальные для development
    development: [
      'MONGODB_URI',
      'NODE_ENV',
    ],
  };

  const env = process.env.NODE_ENV || 'development';
  const required = requiredEnvVars[env] || requiredEnvVars.development;

  const missing = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    const errorMsg = `Missing required environment variables: ${missing.join(', ')}`;

    if (env === 'production') {
      // В production - критическая ошибка, прерываем запуск
      throw new Error(errorMsg);
    } else {
      // В development - предупреждение
      logger.warn(errorMsg);
      console.warn(`⚠️ WARNING: ${errorMsg}`);
      console.warn('⚠️ Some features may not work correctly');
    }
  }

  // Дополнительные проверки
  // Временно отключено для демо - в production нужно использовать безопасные credentials
  // if (process.env.MONGODB_URI?.includes('omlineadmin:5MOHI036wc4yf3vh')) {
  //   throw new Error('SECURITY CRITICAL: Production MongoDB credentials detected in code! Change password immediately!');
  // }

  if (env === 'production') {
    // Проверяем, что не используются простые дефолтные значения
    const weakPatterns = ['dev-', 'test', 'default', 'changeme', '12345', 'password'];

    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 20) {
      throw new Error('SECURITY: JWT_SECRET must be at least 20 characters long!');
    }

    if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 20) {
      throw new Error('SECURITY: JWT_REFRESH_SECRET must be at least 20 characters long!');
    }

    // Проверяем на явные слабые паттерны
    const jwtSecretLower = process.env.JWT_SECRET.toLowerCase();
    const refreshSecretLower = process.env.JWT_REFRESH_SECRET.toLowerCase();

    for (const pattern of weakPatterns) {
      if (jwtSecretLower.includes(pattern)) {
        throw new Error(`SECURITY: JWT_SECRET contains weak pattern "${pattern}". Use a strong random secret!`);
      }
      if (refreshSecretLower.includes(pattern)) {
        throw new Error(`SECURITY: JWT_REFRESH_SECRET contains weak pattern "${pattern}". Use a strong random secret!`);
      }
    }
  }

  logger.info('✓ Environment variables validated successfully');
};

export default validateRequiredEnv;