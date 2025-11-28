/**
 * Утилиты валидации данных
 */

/**
 * Валидация телефонного номера
 * @param {string} phone - Телефонный номер
 * @returns {boolean} - true если номер валидный
 */
export const validatePhone = (phone) => {
  if (!phone) return false;

  // Удаляем все нецифровые символы
  const cleanPhone = phone.replace(/\D/g, '');

  // Проверяем длину (российский номер: 11 цифр с 7 или 8, или 10 цифр без кода страны)
  if (cleanPhone.length === 11) {
    return cleanPhone.startsWith('7') || cleanPhone.startsWith('8');
  }
  if (cleanPhone.length === 10) {
    return cleanPhone.startsWith('9');
  }

  return false;
};

/**
 * Валидация email адреса
 * @param {string} email - Email адрес
 * @returns {boolean} - true если email валидный
 */
export const validateEmail = (email) => {
  if (!email) return false;

  // Простая регулярка для email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Валидация ИНН
 * @param {string} inn - ИНН
 * @returns {boolean} - true если ИНН валидный
 */
export const validateINN = (inn) => {
  if (!inn) return false;

  const cleanInn = inn.replace(/\D/g, '');

  // Проверяем длину (10 для юр.лиц, 12 для физ.лиц)
  return cleanInn.length === 10 || cleanInn.length === 12;
};

/**
 * Валидация ОГРН
 * @param {string} ogrn - ОГРН
 * @returns {boolean} - true если ОГРН валидный
 */
export const validateOGRN = (ogrn) => {
  if (!ogrn) return false;

  const cleanOgrn = ogrn.replace(/\D/g, '');

  // Проверяем длину (13 для ОГРН, 15 для ОГРНИП)
  return cleanOgrn.length === 13 || cleanOgrn.length === 15;
};

/**
 * Валидация строки на минимальную длину
 * @param {string} str - Строка для проверки
 * @param {number} minLength - Минимальная длина
 * @returns {boolean} - true если строка достаточной длины
 */
export const validateMinLength = (str, minLength = 1) => {
  if (!str) return false;
  return str.trim().length >= minLength;
};

/**
 * Валидация на непустое значение
 * @param {any} value - Значение для проверки
 * @returns {boolean} - true если значение не пустое
 */
export const validateRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/**
 * Валидация URL
 * @param {string} url - URL для проверки
 * @returns {boolean} - true если URL валидный
 */
export const validateURL = (url) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Валидация даты
 * @param {string|Date} date - Дата для проверки
 * @returns {boolean} - true если дата валидная
 */
export const validateDate = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);
  return !isNaN(dateObj.getTime());
};

/**
 * Валидация числа в диапазоне
 * @param {number} value - Число для проверки
 * @param {number} min - Минимальное значение
 * @param {number} max - Максимальное значение
 * @returns {boolean} - true если число в диапазоне
 */
export const validateRange = (value, min = -Infinity, max = Infinity) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

// Экспорт всех функций как объект для удобства
export default {
  validatePhone,
  validateEmail,
  validateINN,
  validateOGRN,
  validateMinLength,
  validateRequired,
  validateURL,
  validateDate,
  validateRange,
};