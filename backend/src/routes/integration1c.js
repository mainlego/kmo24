import express from 'express';
import integration1cController from '../controllers/integration1c.js';
import { apiAuth, requirePermissions } from '../middleware/apiAuth.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

/**
 * 1C Integration Routes
 *
 * Два типа маршрутов:
 * 1. Для админки (protect + authorize) - запросы ИЗ сайта К 1С
 * 2. Для API (apiAuth) - webhook'и ОТ 1С К сайту
 */

// ==========================================
// МАРШРУТЫ ДЛЯ АДМИНКИ (запросы к 1С)
// ==========================================

// Статус интеграции
router.get('/status', protect, authorize('admin'), asyncHandler(integration1cController.getIntegrationStatus));

// Синхронизация товаров из 1С
router.post('/sync/products', protect, authorize('admin'), asyncHandler(integration1cController.fetchAndSyncProducts));

// Синхронизация категорий из 1С
router.post('/sync/categories', protect, authorize('admin'), asyncHandler(integration1cController.fetchAndSyncCategories));

// Полная синхронизация (категории + товары)
router.post('/sync/full', protect, authorize('admin'), asyncHandler(integration1cController.fullSync));

// Отправить заказ в 1С
router.post('/orders/:id/send', protect, authorize('admin', 'manager'), asyncHandler(integration1cController.sendOrderTo1C));

// ==========================================
// МАРШРУТЫ ДЛЯ WEBHOOK'ов (данные от 1С)
// ==========================================

// Health check - minimal permissions required
router.get('/health', apiAuth([]), asyncHandler(integration1cController.healthCheck));

// Get integration statistics
router.get('/stats', apiAuth([]), asyncHandler(integration1cController.getStats));

/**
 * Products Management
 */

// Sync products from 1C
router.post(
  '/products/sync',
  requirePermissions('products.write'),
  asyncHandler(integration1cController.syncProducts)
);

/**
 * Categories Management
 */

// Sync categories from 1C
router.post(
  '/categories/sync',
  requirePermissions('categories.write'),
  asyncHandler(integration1cController.syncCategories)
);

/**
 * Stock Management
 */

// Update product stock from 1C
router.post(
  '/stock/update',
  requirePermissions('stock.write'),
  asyncHandler(integration1cController.updateStock)
);

/**
 * Prices Management
 */

// Update product prices from 1C
router.post(
  '/prices/update',
  requirePermissions('prices.write'),
  asyncHandler(integration1cController.updatePrices)
);

/**
 * Orders Management
 */

// Get new orders for export to 1C
router.get(
  '/orders/new',
  requirePermissions('orders.read'),
  asyncHandler(integration1cController.getNewOrders)
);

// Update order status from 1C
router.post(
  '/orders/:id/status',
  requirePermissions('orders.write'),
  asyncHandler(integration1cController.updateOrderStatus)
);

// Mark orders as exported to 1C
router.post(
  '/orders/mark-exported',
  requirePermissions('orders.write'),
  asyncHandler(integration1cController.markOrdersAsExported)
);

export default router;
