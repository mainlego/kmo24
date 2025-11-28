import express from 'express';
import apiKeysController from '../controllers/apiKeys.js';
import { protect as authenticate, authorize } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

/**
 * All routes require authentication and admin role
 */
router.use(authenticate);
router.use(authorize('admin'));

/**
 * API Keys Management Routes
 */

// Get all API keys
router.get('/', asyncHandler(apiKeysController.getAllApiKeys));

// Get integration statistics overview
router.get('/stats/overview', asyncHandler(apiKeysController.getIntegrationStats));

// Get single API key with stats
router.get('/:id', asyncHandler(apiKeysController.getApiKey));

// Create new API key
router.post('/', asyncHandler(apiKeysController.createApiKey));

// Update API key
router.put('/:id', asyncHandler(apiKeysController.updateApiKey));

// Regenerate API secret
router.post('/:id/regenerate', asyncHandler(apiKeysController.regenerateSecret));

// Delete API key
router.delete('/:id', asyncHandler(apiKeysController.deleteApiKey));

// Get logs for specific API key
router.get('/:id/logs', asyncHandler(apiKeysController.getApiKeyLogs));

export default router;
