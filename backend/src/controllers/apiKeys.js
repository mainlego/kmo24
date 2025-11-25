import ApiKey from '../models/ApiKey.js';
import IntegrationLog from '../models/IntegrationLog.js';

/**
 * Get all API keys
 * GET /api/admin/api-keys
 */
const getAllApiKeys = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, isActive } = req.query;

    const query = {};
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const apiKeys = await ApiKey.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-secret'); // Never return the hashed secret

    const total = await ApiKey.countDocuments(query);

    res.json({
      success: true,
      data: apiKeys,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get single API key with statistics
 * GET /api/admin/api-keys/:id
 */
const getApiKey = async (req, res) => {
  try {
    const apiKey = await ApiKey.findById(req.params.id)
      .populate('createdBy', 'name email')
      .select('-secret');

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        error: 'API key not found',
      });
    }

    // Get usage statistics
    const stats = await IntegrationLog.getStats(apiKey._id, 30);

    res.json({
      success: true,
      data: {
        ...apiKey.toObject(),
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Create new API key
 * POST /api/admin/api-keys
 */
const createApiKey = async (req, res) => {
  try {
    const {
      name,
      type = '1c',
      permissions = [],
      ipWhitelist = [],
      rateLimit,
      metadata,
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required',
      });
    }

    // Generate key pair
    const { key, secret } = ApiKey.generateKeyPair();

    // Create API key
    const apiKey = await ApiKey.create({
      name,
      key,
      secret, // Will be hashed in pre-save hook
      type,
      permissions,
      ipWhitelist,
      rateLimit,
      metadata,
      createdBy: req.user._id,
    });

    // Return the secret ONLY ONCE during creation
    res.status(201).json({
      success: true,
      data: {
        ...apiKey.toObject(),
        secret: undefined, // Remove hashed secret
      },
      credentials: {
        key,
        secret, // Plain text secret - shown only once!
      },
      message: 'API key created successfully. Please save the secret - it will not be shown again!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update API key
 * PUT /api/admin/api-keys/:id
 */
const updateApiKey = async (req, res) => {
  try {
    const {
      name,
      permissions,
      ipWhitelist,
      isActive,
      rateLimit,
      metadata,
    } = req.body;

    const apiKey = await ApiKey.findById(req.params.id);

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        error: 'API key not found',
      });
    }

    // Update fields
    if (name) apiKey.name = name;
    if (permissions) apiKey.permissions = permissions;
    if (ipWhitelist !== undefined) apiKey.ipWhitelist = ipWhitelist;
    if (isActive !== undefined) apiKey.isActive = isActive;
    if (rateLimit) apiKey.rateLimit = { ...apiKey.rateLimit, ...rateLimit };
    if (metadata) apiKey.metadata = { ...apiKey.metadata, ...metadata };

    await apiKey.save();

    res.json({
      success: true,
      data: apiKey,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Regenerate API secret
 * POST /api/admin/api-keys/:id/regenerate
 */
const regenerateSecret = async (req, res) => {
  try {
    const apiKey = await ApiKey.findById(req.params.id);

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        error: 'API key not found',
      });
    }

    // Generate new secret
    const { secret } = ApiKey.generateKeyPair();
    apiKey.secret = secret; // Will be hashed in pre-save hook

    await apiKey.save();

    res.json({
      success: true,
      data: apiKey,
      credentials: {
        key: apiKey.key,
        secret, // Plain text secret - shown only once!
      },
      message: 'Secret regenerated successfully. Please save it - it will not be shown again!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Delete API key
 * DELETE /api/admin/api-keys/:id
 */
const deleteApiKey = async (req, res) => {
  try {
    const apiKey = await ApiKey.findById(req.params.id);

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        error: 'API key not found',
      });
    }

    await apiKey.deleteOne();

    res.json({
      success: true,
      message: 'API key deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get integration logs for an API key
 * GET /api/admin/api-keys/:id/logs
 */
const getApiKeyLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, endpoint } = req.query;

    const query = { apiKey: req.params.id };
    if (status) query.status = status;
    if (endpoint) query.endpoint = new RegExp(endpoint, 'i');

    const logs = await IntegrationLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await IntegrationLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get integration statistics
 * GET /api/admin/api-keys/stats/overview
 */
const getIntegrationStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get total requests by status
    const statusStats = await IntegrationLog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgDuration: { $avg: '$duration' },
        },
      },
    ]);

    // Get requests by endpoint
    const endpointStats = await IntegrationLog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$endpoint',
          count: { $sum: 1 },
          errors: {
            $sum: { $cond: [{ $eq: ['$status', 'error'] }, 1, 0] },
          },
          avgDuration: { $avg: '$duration' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get daily stats
    const dailyStats = await IntegrationLog.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: 1 },
          success: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] },
          },
          error: {
            $sum: { $cond: [{ $eq: ['$status', 'error'] }, 1, 0] },
          },
          avgDuration: { $avg: '$duration' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get active API keys count
    const activeKeysCount = await ApiKey.countDocuments({ isActive: true });
    const totalKeysCount = await ApiKey.countDocuments();

    res.json({
      success: true,
      data: {
        statusStats,
        endpointStats,
        dailyStats,
        apiKeys: {
          active: activeKeysCount,
          total: totalKeysCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export default {
  getAllApiKeys,
  getApiKey,
  createApiKey,
  updateApiKey,
  regenerateSecret,
  deleteApiKey,
  getApiKeyLogs,
  getIntegrationStats,
};
