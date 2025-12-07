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
      arrivalCity,      // Город доставки (КЛАДР код)
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

    // Если API ключ не настроен, используем fallback расчёт
    if (!DELLIN_APP_KEY) {
      logger.warn('Dellin API key not configured, using fallback calculation');

      // Расстояния от Красноярска до популярных городов (примерные, в км)
      const distances = {
        '2400000100000': 0,      // Красноярск
        '7700000000000': 4100,   // Москва
        '7800000000000': 4500,   // Санкт-Петербург
        '5400000100000': 800,    // Новосибирск
        '6600000100000': 2000,   // Екатеринбург
        '1600000100000': 2800,   // Казань
        '5200000100000': 3200,   // Нижний Новгород
        '7400000100000': 1900,   // Челябинск
        '6300000100000': 2600,   // Самара
        '5500000100000': 1300,   // Омск
      };

      // Получаем расстояние (или используем среднее)
      const distance = distances[arrivalCity] || 2500;

      // Базовая ставка: 50 руб/кг + 15 руб/км (для первых 100 кг)
      // + объёмный коэффициент
      const weightRate = 50;
      const distanceRate = 0.5; // за км
      const volumeRate = 3000; // за м³

      const weightCost = totalWeight * weightRate;
      const distanceCost = distance * distanceRate;
      const volumeCost = totalVolume * volumeRate;

      // Итоговая стоимость (минимум 500 руб)
      const price = Math.max(500, Math.round(weightCost + distanceCost + volumeCost));

      // Сроки доставки (примерные)
      const minDays = Math.max(1, Math.ceil(distance / 800)); // ~800 км/день
      const maxDays = minDays + 3;

      return res.json({
        success: true,
        data: {
          price,
          minDeliveryTime: minDays,
          maxDeliveryTime: maxDays,
          currency: 'RUB',
          provider: 'estimate',
          details: {
            note: 'Примерный расчёт. Точная стоимость будет уточнена менеджером.',
            weight: totalWeight,
            volume: Math.round(totalVolume * 1000) / 1000,
          },
        },
      });
    }

    // Используем адрес магазина из конфигурации
    const storeCity = config.delivery.storeAddress.city;

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

    // Если ошибка авторизации (401/403), используем fallback расчёт
    if (error.response?.status === 401 || error.response?.status === 403) {
      logger.warn('Dellin API authorization failed, using fallback calculation');

      const { arrivalCity, cargo } = req.body;

      // Подсчитываем общий вес и объем
      let totalWeight = 0;
      let totalVolume = 0;

      (cargo || []).forEach((item) => {
        const weight = item.weight || 10;
        const length = item.length || 50;
        const width = item.width || 50;
        const height = item.height || 50;
        const quantity = item.quantity || 1;

        totalWeight += weight * quantity;
        totalVolume += (length / 100) * (width / 100) * (height / 100) * quantity;
      });

      const distances = {
        '2400000100000': 0,      // Красноярск
        '7700000000000': 4100,   // Москва
        '7800000000000': 4500,   // Санкт-Петербург
        '5400000100000': 800,    // Новосибирск
        '6600000100000': 2000,   // Екатеринбург
        '1600000100000': 2800,   // Казань
        '5200000100000': 3200,   // Нижний Новгород
        '7400000100000': 1900,   // Челябинск
        '6300000100000': 2600,   // Самара
        '5500000100000': 1300,   // Омск
      };

      const distance = distances[arrivalCity] || 2500;
      const weightRate = 50;
      const distanceRate = 0.5;
      const volumeRate = 3000;

      const weightCost = totalWeight * weightRate;
      const distanceCost = distance * distanceRate;
      const volumeCost = totalVolume * volumeRate;

      const price = Math.max(500, Math.round(weightCost + distanceCost + volumeCost));
      const minDays = Math.max(1, Math.ceil(distance / 800));
      const maxDays = minDays + 3;

      return res.json({
        success: true,
        data: {
          price,
          minDeliveryTime: minDays,
          maxDeliveryTime: maxDays,
          currency: 'RUB',
          provider: 'estimate',
          details: {
            note: 'Примерный расчёт. Точная стоимость будет уточнена менеджером.',
            weight: totalWeight,
            volume: Math.round(totalVolume * 1000) / 1000,
          },
        },
      });
    }

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

    // Проверяем наличие API ключа
    if (!DELLIN_APP_KEY) {
      logger.warn('Dellin API key not configured, using fallback city list');

      // Fallback: возвращаем статический список популярных городов
      const fallbackCities = [
        { code: '2400000100000', name: 'Красноярск', fullName: 'Красноярск, Красноярский край', region: 'Красноярский край' },
        { code: '7700000000000', name: 'Москва', fullName: 'Москва', region: null },
        { code: '7800000000000', name: 'Санкт-Петербург', fullName: 'Санкт-Петербург', region: null },
        { code: '5400000100000', name: 'Новосибирск', fullName: 'Новосибирск, Новосибирская область', region: 'Новосибирская область' },
        { code: '6600000100000', name: 'Екатеринбург', fullName: 'Екатеринбург, Свердловская область', region: 'Свердловская область' },
        { code: '1600000100000', name: 'Казань', fullName: 'Казань, Республика Татарстан', region: 'Республика Татарстан' },
        { code: '5200000100000', name: 'Нижний Новгород', fullName: 'Нижний Новгород, Нижегородская область', region: 'Нижегородская область' },
        { code: '7400000100000', name: 'Челябинск', fullName: 'Челябинск, Челябинская область', region: 'Челябинская область' },
        { code: '6300000100000', name: 'Самара', fullName: 'Самара, Самарская область', region: 'Самарская область' },
        { code: '5500000100000', name: 'Омск', fullName: 'Омск, Омская область', region: 'Омская область' },
      ];

      const filtered = fallbackCities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        (city.region && city.region.toLowerCase().includes(query.toLowerCase()))
      );

      return res.json({
        success: true,
        data: filtered,
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
    const cities = (response.data.city || []).map((city) => ({
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

    // Если ошибка авторизации (401/403), используем fallback
    if (error.response?.status === 401 || error.response?.status === 403) {
      logger.warn('Dellin API authorization failed, using fallback city list');

      const { query } = req.query;
      const fallbackCities = [
        { code: '2400000100000', name: 'Красноярск', fullName: 'Красноярск, Красноярский край', region: 'Красноярский край' },
        { code: '7700000000000', name: 'Москва', fullName: 'Москва', region: null },
        { code: '7800000000000', name: 'Санкт-Петербург', fullName: 'Санкт-Петербург', region: null },
        { code: '5400000100000', name: 'Новосибирск', fullName: 'Новосибирск, Новосибирская область', region: 'Новосибирская область' },
        { code: '6600000100000', name: 'Екатеринбург', fullName: 'Екатеринбург, Свердловская область', region: 'Свердловская область' },
        { code: '1600000100000', name: 'Казань', fullName: 'Казань, Республика Татарстан', region: 'Республика Татарстан' },
        { code: '5200000100000', name: 'Нижний Новгород', fullName: 'Нижний Новгород, Нижегородская область', region: 'Нижегородская область' },
        { code: '7400000100000', name: 'Челябинск', fullName: 'Челябинск, Челябинская область', region: 'Челябинская область' },
        { code: '6300000100000', name: 'Самара', fullName: 'Самара, Самарская область', region: 'Самарская область' },
        { code: '5500000100000', name: 'Омск', fullName: 'Омск, Омская область', region: 'Омская область' },
        { code: '3800000100000', name: 'Иркутск', fullName: 'Иркутск, Иркутская область', region: 'Иркутская область' },
        { code: '6100000100000', name: 'Ростов-на-Дону', fullName: 'Ростов-на-Дону, Ростовская область', region: 'Ростовская область' },
        { code: '5000000100000', name: 'Краснодар', fullName: 'Краснодар, Краснодарский край', region: 'Краснодарский край' },
        { code: '5600000100000', name: 'Оренбург', fullName: 'Оренбург, Оренбургская область', region: 'Оренбургская область' },
        { code: '7000000100000', name: 'Томск', fullName: 'Томск, Томская область', region: 'Томская область' },
        { code: '4200000100000', name: 'Кемерово', fullName: 'Кемерово, Кемеровская область', region: 'Кемеровская область' },
        { code: '0400000100000', name: 'Барнаул', fullName: 'Барнаул, Алтайский край', region: 'Алтайский край' },
        { code: '7500000100000', name: 'Тюмень', fullName: 'Тюмень, Тюменская область', region: 'Тюменская область' },
        { code: '2500000100000', name: 'Владивосток', fullName: 'Владивосток, Приморский край', region: 'Приморский край' },
        { code: '2700000100000', name: 'Хабаровск', fullName: 'Хабаровск, Хабаровский край', region: 'Хабаровский край' },
      ];

      const filtered = fallbackCities.filter(city =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        (city.region && city.region.toLowerCase().includes(query.toLowerCase()))
      );

      return res.json({
        success: true,
        data: filtered,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Ошибка при поиске городов',
      details: error.message,
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
