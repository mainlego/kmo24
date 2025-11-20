import express from 'express';
import deliveryController from '../controllers/delivery.js';

const router = express.Router();

/**
 * Delivery Routes
 */

// Расчет стоимости доставки
router.post('/calculate', deliveryController.calculateDelivery);

// Поиск городов
router.get('/cities/search', deliveryController.searchCities);

// Получение терминалов
router.get('/terminals/:cityCode', deliveryController.getTerminals);

export default router;
