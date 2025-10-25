import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Генерация access token
 * @param {string} userId - ID пользователя
 * @returns {string} JWT token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Генерация refresh token
 * @param {string} userId - ID пользователя
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Верификация access token
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Верификация refresh token
 * @param {string} token - JWT refresh token
 * @returns {object} Decoded token
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret);
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

/**
 * Генерация пары токенов
 * @param {string} userId - ID пользователя
 * @returns {object} Access и refresh токены
 */
export const generateTokenPair = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Декодирование токена без проверки
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  decodeToken,
};
