console.log('Starting server initialization...');

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

console.log('Loading config...');
import config from './config/index.js';
import connectDB from './config/database.js';
import { connectRedis } from './config/redis-mock.js';
import validateRequiredEnv from './config/validateEnv.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';
import requestLogger from './middleware/requestLogger.js';

console.log('Validating environment variables...');
// Валидация environment variables при запуске
try {
  validateRequiredEnv();
  console.log('Environment validation passed');
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

// Импорт роутов
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import newsRoutes from './routes/news.js';
import commercialOfferRoutes from './routes/commercialOffers.js';
import integration1cRoutes from './routes/integration1c.js';
import apiKeysRoutes from './routes/apiKeys.js';
import deliveryRoutes from './routes/delivery.js';
import leadRoutes from './routes/leads.js';
import uploadsRoutes from './routes/uploads.js';
import { UPLOADS_PATH } from './middleware/upload.js';

const app = express();

// Подключение к базе данных
console.log('Connecting to MongoDB...');
connectDB().then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection failed:', err);
});

// Подключение к Redis
console.log('Setting up Redis mock...');
connectRedis();

// Trust proxy
app.set('trust proxy', 1);

// Middleware для безопасности
app.use(helmet());

// CORS
const corsOptions = {
  origin: (origin, callback) => {
    // Разрешаем запросы без origin (мобильные приложения, Postman и т.д.)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = Array.isArray(config.cors.origin)
      ? config.cors.origin
      : [config.cors.origin];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Явная обработка preflight OPTIONS запросов
app.options('*', cors(corsOptions));

// Парсинг JSON и URL-encoded данных
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Sanitize данные против MongoDB инъекций
app.use(mongoSanitize());

// Защита от HTTP Parameter Pollution
app.use(hpp());

// Сжатие ответов
app.use(compression());

// Логирование HTTP запросов
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Расширенное логирование запросов
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

// API Routes
const API_PREFIX = `/api/${config.apiVersion}`;

app.get(API_PREFIX, (req, res) => {
  res.json({
    message: 'Онлайн Магазин API',
    version: config.apiVersion,
    documentation: `${API_PREFIX}/docs`,
  });
});

// Подключение роутов
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);
app.use(`${API_PREFIX}/news`, newsRoutes);
app.use(`${API_PREFIX}/commercial-offers`, commercialOfferRoutes);
app.use(`${API_PREFIX}/integration/1c`, integration1cRoutes);
app.use(`${API_PREFIX}/admin/api-keys`, apiKeysRoutes);
app.use(`${API_PREFIX}/delivery`, deliveryRoutes);
app.use(`${API_PREFIX}/leads`, leadRoutes);
app.use(`${API_PREFIX}/uploads`, uploadsRoutes);

// Статические файлы - раздаём из UPLOADS_PATH (продакшен: /var/data/uploads)
app.use('/uploads', express.static(UPLOADS_PATH));
app.use(express.static('public'));

// Обработка несуществующих роутов
app.use(notFound);

// Обработчик ошибок
app.use(errorHandler);

// Запуск сервера
const PORT = config.port;

console.log(`Starting server on port ${PORT}...`);
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running in ${config.env} mode on port ${PORT}`);
  logger.info(`Server running in ${config.env} mode on port ${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received, closing server gracefully...`);

  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  // Форсированное завершение через 10 секунд
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Обработка необработанных ошибок
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  gracefulShutdown('UNHANDLED_REJECTION');
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

export default app;
