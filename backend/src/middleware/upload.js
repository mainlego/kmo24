import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// База для загрузок - /var/data/uploads на продакшене (Render), иначе локальная папка
const UPLOAD_BASE = process.env.UPLOAD_PATH || (
  process.env.NODE_ENV === 'production'
    ? '/var/data/uploads'
    : path.join(__dirname, '../../uploads')
);

// Создание директорий для загрузки
const uploadDirs = {
  products: path.join(UPLOAD_BASE, 'products'),
  documents: path.join(UPLOAD_BASE, 'documents'),
  users: path.join(UPLOAD_BASE, 'users'),
  news: path.join(UPLOAD_BASE, 'news'),
  temp: path.join(UPLOAD_BASE, 'temp'),
};

// Экспортируем базовый путь для использования в других модулях
export const UPLOADS_PATH = UPLOAD_BASE;

// Создание директорий при запуске
Object.values(uploadDirs).forEach(async (dir) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    logger.error(`Error creating upload directory ${dir}:`, error);
  }
});

// Конфигурация хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Определяем директорию на основе типа файла
    const uploadType = req.uploadType || 'temp';
    const destination = uploadDirs[uploadType] || uploadDirs.temp;
    cb(null, destination);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// Фильтр файлов
const fileFilter = (req, file, cb) => {
  // Разрешенные типы файлов
  const allowedMimes = {
    images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  };

  const fileType = req.fileType || 'images';
  const allowed = allowedMimes[fileType] || allowedMimes.images;

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Неподдерживаемый тип файла. Разрешены: ${allowed.join(', ')}`), false);
  }
};

// Базовый multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/**
 * Middleware для загрузки одного изображения
 */
export const uploadSingleImage = (fieldName, uploadType = 'temp') => {
  return (req, res, next) => {
    req.uploadType = uploadType;
    req.fileType = 'images';

    const multerSingle = upload.single(fieldName);

    multerSingle(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'Файл слишком большой. Максимальный размер: 10MB',
            });
          }
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'Ошибка загрузки файла',
        });
      }
      next();
    });
  };
};

/**
 * Middleware для загрузки нескольких изображений
 */
export const uploadMultipleImages = (fieldName, maxCount = 5, uploadType = 'temp') => {
  return (req, res, next) => {
    req.uploadType = uploadType;
    req.fileType = 'images';

    const multerArray = upload.array(fieldName, maxCount);

    multerArray(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'Один или несколько файлов слишком большие. Максимальный размер: 10MB',
            });
          }
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
              success: false,
              message: `Слишком много файлов. Максимум: ${maxCount}`,
            });
          }
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'Ошибка загрузки файлов',
        });
      }
      next();
    });
  };
};

/**
 * Middleware для обработки изображения (изменение размера и оптимизация)
 */
export const processImage = (options = {}) => {
  const {
    width = 1200,
    height = null,
    quality = 80,
    format = 'webp',
    fit = 'inside',
  } = options;

  return async (req, res, next) => {
    try {
      if (!req.file && !req.files) {
        return next();
      }

      const files = req.files || [req.file];

      for (const file of files) {
        if (!file) continue;

        const outputPath = file.path.replace(
          path.extname(file.path),
          `.${format}`
        );

        await sharp(file.path)
          .resize(width, height, { fit })
          [format]({ quality })
          .toFile(outputPath);

        // Удаление оригинального файла
        await fs.unlink(file.path);

        // Обновление информации о файле
        file.path = outputPath;
        file.filename = path.basename(outputPath);
        file.mimetype = `image/${format}`;
      }

      logger.info(`Processed ${files.length} image(s)`);
      next();
    } catch (error) {
      logger.error('Error processing image:', error);
      next(error);
    }
  };
};

/**
 * Middleware для создания thumbnails
 */
export const createThumbnail = (options = {}) => {
  const {
    width = 300,
    height = 300,
    quality = 70,
    format = 'webp',
  } = options;

  return async (req, res, next) => {
    try {
      if (!req.file && !req.files) {
        return next();
      }

      const files = req.files || [req.file];

      for (const file of files) {
        if (!file) continue;

        const thumbnailPath = file.path.replace(
          path.basename(file.path),
          `thumb-${path.basename(file.path)}`
        );

        await sharp(file.path)
          .resize(width, height, { fit: 'cover' })
          [format]({ quality })
          .toFile(thumbnailPath);

        // Добавление пути к thumbnail
        file.thumbnailPath = thumbnailPath;
        file.thumbnail = path.basename(thumbnailPath);
      }

      logger.info(`Created ${files.length} thumbnail(s)`);
      next();
    } catch (error) {
      logger.error('Error creating thumbnail:', error);
      next(error);
    }
  };
};

/**
 * Middleware для загрузки документов
 */
export const uploadDocument = (fieldName, uploadType = 'temp') => {
  return (req, res, next) => {
    req.uploadType = uploadType;
    req.fileType = 'documents';

    const multerSingle = upload.single(fieldName);

    multerSingle(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              message: 'Файл слишком большой. Максимальный размер: 10MB',
            });
          }
        }
        return res.status(400).json({
          success: false,
          message: err.message || 'Ошибка загрузки файла',
        });
      }
      next();
    });
  };
};

/**
 * Удаление файла
 */
export const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    logger.info(`File deleted: ${filePath}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting file ${filePath}:`, error);
    return false;
  }
};

/**
 * Удаление нескольких файлов
 */
export const deleteFiles = async (filePaths) => {
  const results = await Promise.allSettled(
    filePaths.map((filePath) => deleteFile(filePath))
  );

  const deleted = results.filter((r) => r.status === 'fulfilled' && r.value).length;
  logger.info(`Deleted ${deleted} of ${filePaths.length} files`);

  return deleted;
};

export default {
  uploadSingleImage,
  uploadMultipleImages,
  processImage,
  createThumbnail,
  uploadDocument,
  deleteFile,
  deleteFiles,
};
