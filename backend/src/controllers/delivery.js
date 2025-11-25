import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';

// Конфигурация Деловых Линий
const DELLIN_API_URL = 'https://api.dellin.ru/v3/public';
const DELLIN_APP_KEY = config.delivery.dellin.apiKey;

/**
 * Расчет стоимости доставки через Деловые Линии
 * POST /api/v1/delivery/calculate
 */
export const calculateDelivery = async (req, res) => {
  try {
    const {
      arrivalCity,      // Город доставки
      cargo,            // Массив товаров с габаритами
    } = req.body;

    // Валидация
    if (!arrivalCity) {
      return res.status(400).json({
        success: false,
        error: 'Не указан город доставки',
      });
    }

    if (!cargo || !Array.isArray(cargo) || cargo.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Необходимо указать товары для расчета',
      });
    }

    // Используем адрес магазина из конфигурации
    const storeCity = config.delivery.storeAddress.city;

    // Подсчитываем общий вес и объем
    let totalWeight = 0;
    let totalVolume = 0;

    cargo.forEach((item) => {
      const weight = item.weight || 10;
      const length = item.length || 50;
      const width = item.width || 50;
      const height = item.height || 50;
      const quantity = item.quantity || 1;

      totalWeight += weight * quantity;
      // Объем = длина × ширина × высота (в м³)
      totalVolume += (length / 100) * (width / 100) * (height / 100) * quantity;
    });

    // Подготовка данных для API Деловых Линий
    const requestData = {
      appKey: DELLIN_APP_KEY,
      delivery: {
        derivalDoor: false,        // Забор от двери отправителя
        derivalTerminal: true,     // Забор с терминала
        arrivalDoor: false,        // Доставка до двери получателя
        arrivalTerminal: true,     // Доставка на терминал
        derivalCity: storeCity,    // Город магазина из конфига
        arrivalCity: arrivalCity,  // КЛАДР код города доставки
      },
      cargo: {
        weight: totalWeight || 1,  // Общий вес в кг (минимум 1 кг)
        volume: totalVolume || 0.1, // Общий объем в м³
      },
    };

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
