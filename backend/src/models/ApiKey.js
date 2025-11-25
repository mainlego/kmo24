import mongoose from 'mongoose';
import crypto from 'crypto';

const apiKeySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  secret: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['1c', 'external', 'internal'],
    default: '1c',
  },
  permissions: [{
    type: String,
    enum: [
      'products.read',
      'products.write',
      'orders.read',
      'orders.write',
      'stock.read',
      'stock.write',
      'categories.read',
      'categories.write',
      'prices.read',
      'prices.write',
      'customers.read',
      'customers.write',
    ],
  }],
  ipWhitelist: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastUsedAt: {
    type: Date,
  },
  requestCount: {
    type: Number,
    default: 0,
  },
  rateLimit: {
    requestsPerMinute: {
      type: Number,
      default: 60,
    },
    requestsPerDay: {
      type: Number,
      default: 10000,
    },
  },
  metadata: {
    version: String,
    server: String,
    description: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Generate API key and secret
apiKeySchema.statics.generateKeyPair = function() {
  const key = 'kmo24_' + crypto.randomBytes(16).toString('hex');
  const secret = crypto.randomBytes(32).toString('hex');
  return { key, secret };
};

// Hash secret before saving
apiKeySchema.pre('save', async function(next) {
  if (this.isModified('secret')) {
    this.secret = crypto
      .createHash('sha256')
      .update(this.secret)
      .digest('hex');
  }
  next();
});

// Verify secret
apiKeySchema.methods.verifySecret = function(secret) {
  const hash = crypto
    .createHash('sha256')
    .update(secret)
    .digest('hex');
  return this.secret === hash;
};

// Check permission
apiKeySchema.methods.hasPermission = function(permission) {
  return this.permissions.includes(permission);
};

// Check IP whitelist
apiKeySchema.methods.isIpAllowed = function(ip) {
  if (!this.ipWhitelist || this.ipWhitelist.length === 0) {
    return true; // No whitelist = allow all
  }
  return this.ipWhitelist.includes(ip);
};

// Update last used timestamp and increment counter
apiKeySchema.methods.recordUsage = async function() {
  this.lastUsedAt = new Date();
  this.requestCount += 1;
  await this.save();
};

// Virtual for masked key (for display)
apiKeySchema.virtual('maskedKey').get(function() {
  if (!this.key) return '';
  const visible = 8;
  return this.key.substring(0, visible) + '•'.repeat(this.key.length - visible);
});

// Ensure virtuals are included in JSON
apiKeySchema.set('toJSON', { virtuals: true });
apiKeySchema.set('toObject', { virtuals: true });

// Indexes
apiKeySchema.index({ createdAt: -1 });
apiKeySchema.index({ type: 1, isActive: 1 });

const ApiKey = mongoose.model('ApiKey', apiKeySchema);
export default ApiKey;
