import path from 'path';
import fs from 'fs/promises';
import Product from '../models/Product.js';
import { successResponse, errorResponse, paginatedResponse, createPagination } from '../utils/response.js';
import { getCache, setCache, deleteCache, deleteCachePattern } from '../config/redis-mock.js';
import logger from '../utils/logger.js';
import { UPLOADS_PATH } from '../middleware/upload.js';

/**
 * Получение списка товаров с фильтрацией и пагинацией
 * GET /api/v1/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      inStock,
      sort = '-createdAt',
      // Дополнительные фильтры для админки
      source,
      condition,
      status,
      availability,
      isActive,
    } = req.query;

    // Создание кэш ключа
    const cacheKey = `products:${JSON.stringify(req.query)}`;

    // Проверка кэша (только для публичных запросов без фильтров админки)
    if (!source && !condition && !status && !availability && isActive === undefined) {
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        return res.json(cachedData);
      }
    }

    // Построение фильтра
    const filter = {};

    // По умолчанию показываем только активные для публичного API
    if (isActive === undefined && !source) {
      filter.isActive = true;
    } else if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      // Поддержка поиска по названию, артикулу, описанию
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { 'description.short': { $regex: search, $options: 'i' } },
      ];
    }

    if (inStock === 'true') {
      filter['stock.available'] = { $gt: 0 };
    }

    // Фильтр по источнику (1С или вручную)
    if (source === '1c') {
      filter.externalId = { $exists: true, $ne: null };
    } else if (source === 'manual') {
      filter.externalId = { $exists: false };
    }

    // Фильтр по состоянию товара
    if (condition) {
      filter.condition = condition;
    }

    // Фильтр по статусу
    if (status) {
      filter.status = status;
    }

    // Фильтр по наличию
    if (availability === 'in-stock') {
      filter['stock.quantity'] = { $gt: 5 };
    } else if (availability === 'low-stock') {
      filter['stock.quantity'] = { $gt: 0, $lte: 5 };
    } else if (availability === 'out-of-stock') {
      filter['stock.quantity'] = { $lte: 0 };
    }

    // Подсчет общего количества
    const total = await Product.countDocuments(filter);

    // Получение товаров
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const pagination = createPagination(page, limit, total);

    const response = {
      success: true,
      data: products,
      pagination: {
        currentPage: pagination.page,
        itemsPerPage: pagination.limit,
        totalItems: pagination.total,
        totalPages: pagination.totalPages,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPrevPage: pagination.page > 1,
      },
    };

    // Кэширование на 10 минут
    await setCache(cacheKey, response, 600);

    return res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение одного товара по ID или slug
 * GET /api/v1/products/:id
 */
export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Проверка кэша
    const cacheKey = `product:${id}`;
    const cachedProduct = await getCache(cacheKey);
    if (cachedProduct) {
      return successResponse(res, cachedProduct);
    }

    // Поиск по ID или slug
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id, isActive: true }
      : { slug: id, isActive: true };

    const product = await Product.findOne(query)
      .populate('category', 'name slug')
      .populate({
        path: 'relatedProducts.product',
        select: 'name slug price images rating',
      });

    if (!product) {
      return errorResponse(res, 'Товар не найден', 404);
    }

    // Увеличение счетчика просмотров
    product.stats.views += 1;
    await product.save();

    // Кэширование на 30 минут
    await setCache(cacheKey, product, 1800);

    return successResponse(res, product);
  } catch (error) {
    next(error);
  }
};

/**
 * Создание нового товара
 * POST /api/v1/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    // Очистка кэша списка товаров
    await deleteCachePattern('products:*');

    logger.info(`Product created: ${product.name} (${product._id})`);

    return successResponse(res, product, 'Товар создан', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление товара
 * PUT /api/v1/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return errorResponse(res, 'Товар не найден', 404);
    }

    // Очистка кэша
    await deleteCache(`product:${id}`);
    await deleteCache(`product:${product.slug}`);
    await deleteCachePattern('products:*');

    logger.info(`Product updated: ${product.name} (${product._id})`);

    return successResponse(res, product, 'Товар обновлен');
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление товара (мягкое удаление - деактивация)
 * DELETE /api/v1/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return errorResponse(res, 'Товар не найден', 404);
    }

    // Очистка кэша
    await deleteCache(`product:${id}`);
    await deleteCache(`product:${product.slug}`);
    await deleteCachePattern('products:*');

    logger.info(`Product deleted: ${product.name} (${product._id})`);

    return successResponse(res, null, 'Товар удален');
  } catch (error) {
    next(error);
  }
};

/**
 * Получение отзывов товара
 * GET /api/v1/products/:id/reviews
 */
export const getProductReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 'Товар не найден', 404);
    }

    const Review = (await import('../models/Review.js')).default;

    const filter = { product: id, isApproved: true };
    const total = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const pagination = createPagination(page, limit, total);

    return paginatedResponse(res, reviews, pagination);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение похожих товаров
 * GET /api/v1/products/:id/related
 */
export const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 'Товар не найден', 404);
    }

    // Поиск похожих товаров из той же категории
    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: product.category,
      isActive: true,
    })
      .select('name slug price images rating')
      .limit(parseInt(limit));

    return successResponse(res, relatedProducts);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение статистики товаров
 * GET /api/v1/products/stats
 */
export const getProductStats = async (req, res, next) => {
  try {
    // Даты для сравнения
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [
      totalProducts,
      activeProducts,
      outOfStock,
      lowStock,
      featuredProducts,
      newProducts,
      productsAddedCurrentMonth,
      productsAddedPreviousMonth,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ 'stock.available': 0 }),
      Product.countDocuments({ 'stock.available': { $gt: 0, $lte: 5 } }),
      Product.countDocuments({ isFeatured: true }),
      Product.countDocuments({ isNew: true }),
      Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Product.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    ]);

    // Вычисляем прирост активных товаров (%)
    let activeGrowth = 0;
    if (productsAddedPreviousMonth > 0) {
      activeGrowth = Math.round(((productsAddedCurrentMonth - productsAddedPreviousMonth) / productsAddedPreviousMonth) * 100);
    } else {
      activeGrowth = productsAddedCurrentMonth > 0 ? 100 : 0;
    }

    return successResponse(res, {
      totalProducts,
      activeProducts,
      inactiveProducts: totalProducts - activeProducts,
      outOfStock,
      lowStock,
      featuredProducts,
      newProducts,
      draftProducts: 0, // Товары без статуса draft в текущей схеме
      activeGrowth,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Загрузка изображений товара
 * POST /api/v1/products/:id/images
 */
export const uploadProductImages = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 'Товар не найден', 404);
    }

    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'Файлы не загружены', 400);
    }

    // Обрабатываем загруженные файлы
    const newImages = req.files.map((file, index) => {
      // Создаем относительный путь от UPLOADS_PATH
      const relativePath = path.relative(UPLOADS_PATH, file.path);
      const thumbnailRelativePath = file.thumbnailPath
        ? path.relative(UPLOADS_PATH, file.thumbnailPath)
        : null;

      return {
        url: `/uploads/${relativePath.replace(/\\/g, '/')}`,
        thumbnail: thumbnailRelativePath
          ? `/uploads/${thumbnailRelativePath.replace(/\\/g, '/')}`
          : null,
        alt: product.name,
        isPrimary: product.images.length === 0 && index === 0, // Первое изображение - главное
        sortOrder: product.images.length + index,
      };
    });

    // Добавляем новые изображения к существующим
    product.images.push(...newImages);
    await product.save();

    // Очистка кэша
    await deleteCache(`product:${id}`);
    await deleteCache(`product:${product.slug}`);
    await deleteCachePattern('products:*');

    logger.info(`Added ${newImages.length} images to product: ${product.name} (${product._id})`);

    return successResponse(res, {
      images: newImages,
      totalImages: product.images.length,
    }, `Загружено ${newImages.length} изображений`);
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление изображения товара
 * DELETE /api/v1/products/:id/images/:imageIndex
 */
export const deleteProductImage = async (req, res, next) => {
  try {
    const { id, imageIndex } = req.params;
    const index = parseInt(imageIndex);

    const product = await Product.findById(id);
    if (!product) {
      return errorResponse(res, 'Товар не найден', 404);
    }

    if (index < 0 || index >= product.images.length) {
      return errorResponse(res, 'Изображение не найдено', 404);
    }

    const imageToDelete = product.images[index];

    // Удаляем файлы с диска (если они локальные)
    if (imageToDelete.url && imageToDelete.url.startsWith('/uploads/')) {
      const filePath = path.join(UPLOADS_PATH, imageToDelete.url.replace('/uploads/', ''));
      try {
        await fs.unlink(filePath);
        logger.info(`Deleted image file: ${filePath}`);
      } catch (err) {
        logger.warn(`Failed to delete image file: ${filePath}`, err.message);
      }

      // Удаляем thumbnail если есть
      if (imageToDelete.thumbnail && imageToDelete.thumbnail.startsWith('/uploads/')) {
        const thumbPath = path.join(UPLOADS_PATH, imageToDelete.thumbnail.replace('/uploads/', ''));
        try {
          await fs.unlink(thumbPath);
          logger.info(`Deleted thumbnail file: ${thumbPath}`);
        } catch (err) {
          logger.warn(`Failed to delete thumbnail file: ${thumbPath}`, err.message);
        }
      }
    }

    // Удаляем изображение из массива
    product.images.splice(index, 1);

    // Если удалили главное изображение, делаем первое оставшееся главным
    if (imageToDelete.isPrimary && product.images.length > 0) {
      product.images[0].isPrimary = true;
    }

    // Пересчитываем sortOrder
    product.images.forEach((img, i) => {
      img.sortOrder = i;
    });

    await product.save();

    // Очистка кэша
    await deleteCache(`product:${id}`);
    await deleteCache(`product:${product.slug}`);
    await deleteCachePattern('products:*');

    logger.info(`Deleted image from product: ${product.name} (${product._id})`);

    return successResponse(res, {
      remainingImages: product.images.length,
    }, 'Изображение удалено');
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  getRelatedProducts,
  getProductStats,
  uploadProductImages,
  deleteProductImage,
};
