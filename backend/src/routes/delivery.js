import express from 'express';
import deliveryController from '../controllers/delivery.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

/**
 * Delivery Routes
 */

// Расчет стоимости доставки
router.post('/calculate', asyncHandler(deliveryController.calculateDelivery));

// Поиск городов
router.get('/cities/search', asyncHandler(deliveryController.searchCities));

// Получение терминалов
router.get('/terminals/:cityCode', asyncHandler(deliveryController.getTerminals));

export default router;
