import express from 'express';
import integration1cController from '../controllers/integration1c.js';
import { apiAuth, requirePermissions } from '../middleware/apiAuth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

/**
 * 1C Integration Routes
 * All routes require API key authentication
 */

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
