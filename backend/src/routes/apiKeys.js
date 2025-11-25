import express from 'express';
import apiKeysController from '../controllers/apiKeys.js';
import { protect as authenticate, authorize } from '../middleware/auth.js';

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
router.get('/', apiKeysController.getAllApiKeys);

// Get integration statistics overview
router.get('/stats/overview', apiKeysController.getIntegrationStats);

// Get single API key with stats
router.get('/:id', apiKeysController.getApiKey);

// Create new API key
router.post('/', apiKeysController.createApiKey);

// Update API key
router.put('/:id', apiKeysController.updateApiKey);

// Regenerate API secret
router.post('/:id/regenerate', apiKeysController.regenerateSecret);

// Delete API key
router.delete('/:id', apiKeysController.deleteApiKey);

// Get logs for specific API key
router.get('/:id/logs', apiKeysController.getApiKeyLogs);

export default router;
