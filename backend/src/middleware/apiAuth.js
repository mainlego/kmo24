const ApiKey = require('../models/ApiKey');
const IntegrationLog = require('../models/IntegrationLog');

/**
 * Middleware для аутентификации API запросов (1С и других внешних систем)
 *
 * Использование:
 * - Добавьте заголовки в запрос:
 *   X-API-Key: your_api_key
 *   X-API-Secret: your_api_secret
 */
const apiAuth = (requiredPermissions = []) => {
  return async (req, res, next) => {
    const startTime = Date.now();
    let apiKey = null;
    let logData = {
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent'),
      requestData: {
        headers: {
          'content-type': req.get('content-type'),
          'x-api-key': req.get('x-api-key') ? '***' : undefined,
        },
        query: req.query,
        body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined,
      },
    };

    try {
      // Extract API credentials from headers
      const apiKeyValue = req.get('X-API-Key');
      const apiSecret = req.get('X-API-Secret');

      if (!apiKeyValue || !apiSecret) {
        throw new Error('API credentials missing. Please provide X-API-Key and X-API-Secret headers.');
      }

      // Find API key in database
      apiKey = await ApiKey.findOne({ key: apiKeyValue });

      if (!apiKey) {
        throw new Error('Invalid API key');
      }

      // Check if API key is active
      if (!apiKey.isActive) {
        throw new Error('API key is inactive');
      }

      // Verify secret
      if (!apiKey.verifySecret(apiSecret)) {
        throw new Error('Invalid API secret');
      }

      // Check IP whitelist
      const clientIp = req.ip || req.connection.remoteAddress;
      if (!apiKey.isIpAllowed(clientIp)) {
        throw new Error(`IP address ${clientIp} is not whitelisted`);
      }

      // Check permissions
      if (requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every(permission =>
          apiKey.hasPermission(permission)
        );

        if (!hasAllPermissions) {
          throw new Error(`Missing required permissions: ${requiredPermissions.join(', ')}`);
        }
      }

      // Check rate limits
      await checkRateLimit(apiKey);

      // Record usage
      await apiKey.recordUsage();

      // Attach API key to request for later use
      req.apiKey = apiKey;
      req.integration = {
        type: apiKey.type,
        name: apiKey.name,
      };

      // Continue to next middleware
      next();

      // Log successful request after response
      res.on('finish', async () => {
        const duration = Date.now() - startTime;
        logData = {
          ...logData,
          apiKey: apiKey._id,
          status: res.statusCode >= 400 ? 'error' : 'success',
          statusCode: res.statusCode,
          duration,
        };

        await IntegrationLog.logRequest(logData);
      });

    } catch (error) {
      const duration = Date.now() - startTime;

      // Log error
      logData = {
        ...logData,
        apiKey: apiKey?._id,
        status: 'error',
        statusCode: 401,
        errorMessage: error.message,
        duration,
      };

      if (apiKey) {
        await IntegrationLog.logRequest(logData);
      }

      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: error.message,
      });
    }
  };
};

/**
 * Check rate limits for API key
 */
async function checkRateLimit(apiKey) {
  const now = new Date();

  // Check requests per minute
  const oneMinuteAgo = new Date(now.getTime() - 60000);
  const requestsLastMinute = await IntegrationLog.countDocuments({
    apiKey: apiKey._id,
    createdAt: { $gte: oneMinuteAgo },
  });

  if (requestsLastMinute >= apiKey.rateLimit.requestsPerMinute) {
    throw new Error('Rate limit exceeded: too many requests per minute');
  }

  // Check requests per day
  const oneDayAgo = new Date(now.getTime() - 86400000);
  const requestsLastDay = await IntegrationLog.countDocuments({
    apiKey: apiKey._id,
    createdAt: { $gte: oneDayAgo },
  });

  if (requestsLastDay >= apiKey.rateLimit.requestsPerDay) {
    throw new Error('Rate limit exceeded: daily limit reached');
  }
}

/**
 * Sanitize request body for logging (remove sensitive data)
 */
function sanitizeBody(body) {
  if (!body || typeof body !== 'object') return body;

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'secret', 'token', 'apiKey', 'apiSecret'];

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '***';
    }
  }

  return sanitized;
}

/**
 * Middleware для проверки конкретных разрешений
 */
const requirePermissions = (...permissions) => {
  return apiAuth(permissions);
};

module.exports = {
  apiAuth,
  requirePermissions,
};
