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
      'REDIS_URL',
      'CORS_ORIGIN',
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
  if (process.env.MONGODB_URI?.includes('omlineadmin:5MOHI036wc4yf3vh')) {
    throw new Error('SECURITY CRITICAL: Production MongoDB credentials detected in code! Change password immediately!');
  }

  if (env === 'production') {
    // Проверяем, что не используются дефолтные значения
    if (process.env.JWT_SECRET?.includes('secret') ||
        process.env.JWT_SECRET?.includes('key') ||
        process.env.JWT_SECRET?.includes('change')) {
      throw new Error('SECURITY: JWT_SECRET appears to be a default value. Use a strong random secret!');
    }

    if (process.env.JWT_REFRESH_SECRET?.includes('secret') ||
        process.env.JWT_REFRESH_SECRET?.includes('key') ||
        process.env.JWT_REFRESH_SECRET?.includes('change')) {
      throw new Error('SECURITY: JWT_REFRESH_SECRET appears to be a default value. Use a strong random secret!');
    }
  }

  logger.info('✓ Environment variables validated successfully');
};

export default validateRequiredEnv;