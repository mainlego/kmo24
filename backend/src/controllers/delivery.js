import axios from 'axios';
import logger from '../utils/logger.js';

// Конфигурация Деловых Линий
const DELLIN_API_URL = 'https://api.dellin.ru/v3/public';
const DELLIN_APP_KEY = '6CA4665F-F1F1-40AF-BF06-E3CD2B452599';

/**
 * Расчет стоимости доставки через Деловые Линии
 * POST /api/v1/delivery/calculate
 */
export const calculateDelivery = async (req, res) => {
  try {
    const {
      derivalCity,      // Город отправления
      arrivalCity,      // Город доставки
      weight,           // Вес в кг
      volume,           // Объем в м³
      length,           // Длина в см
      width,            // Ширина в см
      height,           // Высота в см
      declaredValue,    // Объявленная стоимость груза
    } = req.body;

    // Валидация
    if (!derivalCity || !arrivalCity) {
      return res.status(400).json({
        success: false,
        error: 'Не указаны города отправления или доставки',
      });
    }

    if (!weight && !volume) {
      return res.status(400).json({
        success: false,
        error: 'Необходимо указать вес или объем груза',
      });
    }

    // Подготовка данных для API Деловых Линий
    const requestData = {
      appKey: DELLIN_APP_KEY,
      delivery: {
        derivalDoor: false,        // Забор от двери отправителя
        derivalTerminal: true,     // Забор с терминала
        arrivalDoor: false,        // Доставка до двери получателя
        arrivalTerminal: true,     // Доставка на терминал
        derivalCity: derivalCity,  // КЛАДР код города отправления
        arrivalCity: arrivalCity,  // КЛАДР код города доставки
      },
      cargo: {
        weight: weight || 1,       // Вес в кг (минимум 1 кг)
      },
    };

    // Добавляем габариты если указаны
    if (length && width && height) {
      requestData.cargo.oversizedWeight = weight;
      requestData.cargo.length = length / 100;  // Переводим см в метры
      requestData.cargo.width = width / 100;
      requestData.cargo.height = height / 100;
    } else if (volume) {
      requestData.cargo.volume = volume;
    }

    // Объявленная стоимость
    if (declaredValue) {
      requestData.cargo.freightValue = declaredValue;
    }

    logger.info('Dellin API request:', requestData);

    // Запрос к API Деловых Линий
    const response = await axios.post(
      `${DELLIN_API_URL}/calculator.json`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 секунд таймаут
      }
    );

    logger.info('Dellin API response:', response.data);

    // Проверка на ошибки от API
    if (response.data.errors && response.data.errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ошибка расчета доставки',
        details: response.data.errors,
      });
    }

    // Извлекаем стоимость и сроки
    const deliveryData = response.data.data;

    res.json({
      success: true,
      data: {
        price: deliveryData.price || 0,
        minDeliveryTime: deliveryData.minDeliveryTime || null,
        maxDeliveryTime: deliveryData.maxDeliveryTime || null,
        currency: 'RUB',
        provider: 'dellin',
        details: {
          derivalTerminal: deliveryData.derivalTerminal || null,
          arrivalTerminal: deliveryData.arrivalTerminal || null,
          deliveryType: deliveryData.deliveryType || null,
        },
      },
    });
  } catch (error) {
    logger.error('Dellin API error:', error.response?.data || error.message);

    // Обработка различных типов ошибок
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        success: false,
        error: 'Превышено время ожидания ответа от службы доставки',
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: 'Ошибка при обращении к службе доставки',
        details: error.response.data,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера при расчете доставки',
    });
  }
};

/**
 * Поиск города по названию (для автодополнения)
 * GET /api/v1/delivery/cities/search?query=Москва
 */
export const searchCities = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Запрос должен содержать минимум 2 символа',
      });
    }

    // Запрос к API Деловых Линий для поиска городов
    const response = await axios.post(
      `${DELLIN_API_URL}/request_cities.json`,
      {
        appKey: DELLIN_APP_KEY,
        q: query,
        limit: 10,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (response.data.errors && response.data.errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ошибка поиска городов',
        details: response.data.errors,
      });
    }

    // Форматируем результаты
    const cities = response.data.city.map((city) => ({
      code: city.code,
      name: city.name,
      fullName: city.name + (city.region ? `, ${city.region}` : ''),
      region: city.region || null,
    }));

    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    logger.error('City search error:', error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: 'Ошибка при поиске городов',
    });
  }
};

/**
 * Получение терминалов в городе
 * GET /api/v1/delivery/terminals/:cityCode
 */
export const getTerminals = async (req, res) => {
  try {
    const { cityCode } = req.params;

    if (!cityCode) {
      return res.status(400).json({
        success: false,
        error: 'Не указан код города',
      });
    }

    const response = await axios.post(
      `${DELLIN_API_URL}/public/terminals.json`,
      {
        appKey: DELLIN_APP_KEY,
        cityID: cityCode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (response.data.errors && response.data.errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Ошибка получения терминалов',
        details: response.data.errors,
      });
    }

    // Форматируем результаты
    const terminals = response.data.terminals.map((terminal) => ({
      id: terminal.id,
      name: terminal.name,
      address: terminal.address,
      phone: terminal.phone,
      workTime: terminal.workTime,
      coordinates: {
        lat: terminal.latitude,
        lng: terminal.longitude,
      },
    }));

    res.json({
      success: true,
      data: terminals,
    });
  } catch (error) {
    logger.error('Terminals error:', error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: 'Ошибка при получении терминалов',
    });
  }
};

export default {
  calculateDelivery,
  searchCities,
  getTerminals,
};
