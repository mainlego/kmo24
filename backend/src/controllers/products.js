import Product from '../models/Product.js';
import { successResponse, errorResponse, paginatedResponse, createPagination } from '../utils/response.js';
import { getCache, setCache, deleteCache, deleteCachePattern } from '../config/redis.js';
import logger from '../utils/logger.js';

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
    } = req.query;

    // Создание кэш ключа
    const cacheKey = `products:${JSON.stringify(req.query)}`;

    // Проверка кэша
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Построение фильтра
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (inStock === 'true') {
      filter['stock.available'] = { $gt: 0 };
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

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  getRelatedProducts,
};
