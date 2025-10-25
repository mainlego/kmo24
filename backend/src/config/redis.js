import { createClient } from 'redis';
import config from './index.js';
import logger from '../utils/logger.js';

/**
 * Redis клиент
 */
let redisClient = null;

/**
 * Подключение к Redis
 */
export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: config.redis.url,
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis Client Error: ${err}`);
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis Client Ready');
    });

    redisClient.on('end', () => {
      logger.warn('Redis Client Disconnected');
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error(`Error connecting to Redis: ${error.message}`);
    // Redis не является критичным для работы приложения
    return null;
  }
};

/**
 * Получить Redis клиент
 */
export const getRedisClient = () => {
  return redisClient;
};

/**
 * Установить значение в кэш
 * @param {string} key - Ключ
 * @param {any} value - Значение
 * @param {number} ttl - Время жизни в секундах
 */
export const setCache = async (key, value, ttl = config.redis.ttl) => {
  try {
    if (!redisClient || !redisClient.isReady) {
      return false;
    }

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redisClient.setEx(key, ttl, stringValue);
    return true;
  } catch (error) {
    logger.error(`Error setting cache: ${error.message}`);
    return false;
  }
};

/**
 * Получить значение из кэша
 * @param {string} key - Ключ
 */
export const getCache = async (key) => {
  try {
    if (!redisClient || !redisClient.isReady) {
      return null;
    }

    const value = await redisClient.get(key);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    logger.error(`Error getting cache: ${error.message}`);
    return null;
  }
};

/**
 * Удалить значение из кэша
 * @param {string} key - Ключ
 */
export const deleteCache = async (key) => {
  try {
    if (!redisClient || !redisClient.isReady) {
      return false;
    }

    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Error deleting cache: ${error.message}`);
    return false;
  }
};

/**
 * Удалить значения по паттерну
 * @param {string} pattern - Паттерн
 */
export const deleteCachePattern = async (pattern) => {
  try {
    if (!redisClient || !redisClient.isReady) {
      return false;
    }

    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    logger.error(`Error deleting cache pattern: ${error.message}`);
    return false;
  }
};

/**
 * Очистить весь кэш
 */
export const flushCache = async () => {
  try {
    if (!redisClient || !redisClient.isReady) {
      return false;
    }

    await redisClient.flushAll();
    return true;
  } catch (error) {
    logger.error(`Error flushing cache: ${error.message}`);
    return false;
  }
};

export default {
  connectRedis,
  getRedisClient,
  setCache,
  getCache,
  deleteCache,
  deleteCachePattern,
  flushCache,
};
