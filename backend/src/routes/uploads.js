import express from 'express';
import path from 'path';
import {
  uploadSingleImage,
  uploadMultipleImages,
  uploadDocument,
  processImage,
  createThumbnail,
  UPLOADS_PATH,
} from '../middleware/upload.js';
import { protect, authorize } from '../middleware/auth.js';
import asyncHandler from '../middleware/asyncHandler.js';

const router = express.Router();

/**
 * @route POST /api/v1/uploads/image
 * @desc Upload single image for products
 * @access Private (admin, manager)
 */
router.post(
  '/image',
  protect,
  authorize('admin', 'manager'),
  uploadSingleImage('image', 'products'),
  processImage({ width: 1200, quality: 85 }),
  createThumbnail({ width: 300, height: 300 }),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не загружен',
      });
    }

    const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
    const relativePath = path.relative(UPLOADS_PATH, req.file.path);
    const thumbnailRelativePath = req.file.thumbnailPath
      ? path.relative(UPLOADS_PATH, req.file.thumbnailPath)
      : null;

    res.json({
      success: true,
      message: 'Изображение загружено',
      data: {
        url: `${baseUrl}/uploads/${relativePath.replace(/\\/g, '/')}`,
        thumbnail: thumbnailRelativePath
          ? `${baseUrl}/uploads/${thumbnailRelativePath.replace(/\\/g, '/')}`
          : null,
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  })
);

/**
 * @route POST /api/v1/uploads/images
 * @desc Upload multiple images for products
 * @access Private (admin, manager)
 */
router.post(
  '/images',
  protect,
  authorize('admin', 'manager'),
  uploadMultipleImages('images', 10, 'products'),
  processImage({ width: 1200, quality: 85 }),
  createThumbnail({ width: 300, height: 300 }),
  asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Файлы не загружены',
      });
    }

    const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
    const uploadedFiles = req.files.map((file) => {
      const relativePath = path.relative(UPLOADS_PATH, file.path);
      const thumbnailRelativePath = file.thumbnailPath
        ? path.relative(UPLOADS_PATH, file.thumbnailPath)
        : null;

      return {
        url: `${baseUrl}/uploads/${relativePath.replace(/\\/g, '/')}`,
        thumbnail: thumbnailRelativePath
          ? `${baseUrl}/uploads/${thumbnailRelativePath.replace(/\\/g, '/')}`
          : null,
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      };
    });

    res.json({
      success: true,
      message: `Загружено ${uploadedFiles.length} изображений`,
      data: uploadedFiles,
    });
  })
);

/**
 * @route POST /api/v1/uploads/document
 * @desc Upload document (PDF, DOC, DOCX)
 * @access Private (admin, manager)
 */
router.post(
  '/document',
  protect,
  authorize('admin', 'manager'),
  uploadDocument('document', 'documents'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не загружен',
      });
    }

    const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
    const relativePath = path.relative(UPLOADS_PATH, req.file.path);

    res.json({
      success: true,
      message: 'Документ загружен',
      data: {
        url: `${baseUrl}/uploads/${relativePath.replace(/\\/g, '/')}`,
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  })
);

/**
 * @route POST /api/v1/uploads/news-image
 * @desc Upload image for news
 * @access Private (admin, manager)
 */
router.post(
  '/news-image',
  protect,
  authorize('admin', 'manager'),
  uploadSingleImage('image', 'news'),
  processImage({ width: 1200, quality: 85 }),
  createThumbnail({ width: 400, height: 250 }),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Файл не загружен',
      });
    }

    const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
    const relativePath = path.relative(UPLOADS_PATH, req.file.path);
    const thumbnailRelativePath = req.file.thumbnailPath
      ? path.relative(UPLOADS_PATH, req.file.thumbnailPath)
      : null;

    res.json({
      success: true,
      message: 'Изображение загружено',
      data: {
        url: `${baseUrl}/uploads/${relativePath.replace(/\\/g, '/')}`,
        thumbnail: thumbnailRelativePath
          ? `${baseUrl}/uploads/${thumbnailRelativePath.replace(/\\/g, '/')}`
          : null,
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  })
);

export default router;
