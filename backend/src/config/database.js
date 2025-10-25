import mongoose from 'mongoose';
import config from './index.js';
import logger from '../utils/logger.js';

/**
 * Подключение к MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri, {
      ...config.mongodb.options,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // События подключения
    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
