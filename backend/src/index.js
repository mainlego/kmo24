import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import config from './config/index.js';
import connectDB from './config/database.js';
import { connectRedis } from './config/redis.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/errorHandler.js';
import notFound from './middleware/notFound.js';

// Импорт роутов
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
// import userRoutes from './routes/users.js';
// import categoryRoutes from './routes/categories.js';
// import orderRoutes from './routes/orders.js';
// import reviewRoutes from './routes/reviews.js';
// import newsRoutes from './routes/news.js';
// import commercialOfferRoutes from './routes/commercialOffers.js';

const app = express();

// Подключение к базе данных
connectDB();

// Подключение к Redis
connectRedis();

// Trust proxy
app.set('trust proxy', 1);

// Middleware для безопасности
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
  })
);

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
// app.use(`${API_PREFIX}/users`, userRoutes);
// app.use(`${API_PREFIX}/categories`, categoryRoutes);
// app.use(`${API_PREFIX}/orders`, orderRoutes);
// app.use(`${API_PREFIX}/reviews`, reviewRoutes);
// app.use(`${API_PREFIX}/news`, newsRoutes);
// app.use(`${API_PREFIX}/commercial-offers`, commercialOfferRoutes);

// Статические файлы
app.use('/uploads', express.static('uploads'));

// Обработка несуществующих роутов
app.use(notFound);

// Обработчик ошибок
app.use(errorHandler);

// Запуск сервера
const PORT = config.port;

const server = app.listen(PORT, () => {
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
