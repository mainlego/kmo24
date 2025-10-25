import dotenv from 'dotenv';

dotenv.config();

const config = {
  // Server
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  apiVersion: process.env.API_VERSION || 'v1',

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/onlineshop',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: 3600, // 1 hour default
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Security
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },

  // 1C Integration
  oneC: {
    apiUrl: process.env['1C_API_URL'],
    username: process.env['1C_API_USERNAME'],
    password: process.env['1C_API_PASSWORD'],
    syncInterval: parseInt(process.env['1C_SYNC_INTERVAL'], 10) || 1800000, // 30 minutes
  },

  // Transport Companies
  delivery: {
    dellin: {
      apiUrl: process.env.DL_API_URL || 'https://api.dellin.ru/v2',
      apiKey: process.env.DL_API_KEY,
    },
    pek: {
      apiUrl: process.env.PEK_API_URL || 'https://kabinet.pecom.ru/api',
      apiKey: process.env.PEK_API_KEY,
    },
    cacheTtl: 86400, // 24 hours
  },

  // Telegram
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    channelId: process.env.TELEGRAM_CHANNEL_ID,
    syncInterval: parseInt(process.env.TELEGRAM_SYNC_INTERVAL, 10) || 900000, // 15 minutes
  },

  // Email
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.SMTP_FROM,
    fromName: process.env.SMTP_FROM_NAME || 'Онлайн Магазин',
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/webp',
      'video/mp4',
    ],
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
  },
};

export default config;
