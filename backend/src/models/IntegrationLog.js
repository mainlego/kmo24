const mongoose = require('mongoose');

const integrationLogSchema = new mongoose.Schema({
  apiKey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApiKey',
    required: true,
    index: true,
  },
  endpoint: {
    type: String,
    required: true,
    index: true,
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    required: true,
  },
  status: {
    type: String,
    enum: ['success', 'error', 'warning'],
    required: true,
    index: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  requestData: {
    headers: mongoose.Schema.Types.Mixed,
    body: mongoose.Schema.Types.Mixed,
    query: mongoose.Schema.Types.Mixed,
  },
  responseData: {
    body: mongoose.Schema.Types.Mixed,
    headers: mongoose.Schema.Types.Mixed,
  },
  errorMessage: String,
  errorStack: String,
  ip: String,
  userAgent: String,
  duration: {
    type: Number, // in milliseconds
  },
  itemsProcessed: {
    type: Number,
    default: 0,
  },
  itemsSuccess: {
    type: Number,
    default: 0,
  },
  itemsFailed: {
    type: Number,
    default: 0,
  },
  metadata: mongoose.Schema.Types.Mixed,
}, {
  timestamps: true,
});

// Indexes for efficient querying
integrationLogSchema.index({ createdAt: -1 });
integrationLogSchema.index({ apiKey: 1, createdAt: -1 });
integrationLogSchema.index({ status: 1, createdAt: -1 });
integrationLogSchema.index({ endpoint: 1, status: 1 });

// Auto-delete old logs after 90 days
integrationLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

// Static method to create log entry
integrationLogSchema.statics.logRequest = async function(data) {
  try {
    return await this.create(data);
  } catch (error) {
    console.error('Failed to create integration log:', error);
    // Don't throw - logging shouldn't break the app
    return null;
  }
};

// Get statistics for a specific API key
integrationLogSchema.statics.getStats = async function(apiKeyId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await this.aggregate([
    {
      $match: {
        apiKey: mongoose.Types.ObjectId(apiKeyId),
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          status: '$status',
        },
        count: { $sum: 1 },
        avgDuration: { $avg: '$duration' },
        totalItemsProcessed: { $sum: '$itemsProcessed' },
      },
    },
    {
      $sort: { '_id.date': -1 },
    },
  ]);

  return stats;
};

// Get error rate for an endpoint
integrationLogSchema.statics.getErrorRate = async function(endpoint, hours = 24) {
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - hours);

  const result = await this.aggregate([
    {
      $match: {
        endpoint,
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        errors: {
          $sum: {
            $cond: [{ $eq: ['$status', 'error'] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        errors: 1,
        errorRate: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            { $multiply: [{ $divide: ['$errors', '$total'] }, 100] },
          ],
        },
      },
    },
  ]);

  return result[0] || { total: 0, errors: 0, errorRate: 0 };
};

module.exports = mongoose.model('IntegrationLog', integrationLogSchema);
