import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { getCache, setCache, deleteCache, deleteCachePattern } from '../config/redis-mock.js';
import logger from '../utils/logger.js';

/**
 * Получение всех категорий (дерево)
 * GET /api/v1/categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;

    // Проверка кэша
    const cacheKey = `categories:tree:${includeInactive || 'active'}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return successResponse(res, cachedData);
    }

    const filter = includeInactive === 'true' ? {} : { isActive: true };

    // Получение всех категорий
    const categories = await Category.find(filter).sort('order name');

    // Построение дерева
    const tree = Category.buildTree(categories);

    // Кэш на 1 час
    await setCache(cacheKey, tree, 3600);

    return successResponse(res, tree);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение категории по ID или slug
 * GET /api/v1/categories/:id
 */
export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Проверка кэша
    const cacheKey = `category:${id}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return successResponse(res, cachedData);
    }

    // Поиск по ID или slug
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id }
      : { slug: id };

    const category = await Category.findOne(query)
      .populate('parent', 'name slug')
      .populate('children', 'name slug image productCount');

    if (!category) {
      return errorResponse(res, 'Категория не найдена', 404);
    }

    // Кэш на 1 час
    await setCache(cacheKey, category, 3600);

    return successResponse(res, category);
  } catch (error) {
    next(error);
  }
};

/**
 * Создание категории (только для администраторов)
 * POST /api/v1/categories
 */
export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    // Очистка кэша
    await deleteCachePattern('categories:*');

    logger.info(`Category created: ${category.name} (${category._id})`);

    return successResponse(res, category, 'Категория создана', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление категории (только для администраторов)
 * PUT /api/v1/categories/:id
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return errorResponse(res, 'Категория не найдена', 404);
    }

    // Очистка кэша
    await deleteCache(`category:${id}`);
    await deleteCache(`category:${category.slug}`);
    await deleteCachePattern('categories:*');

    logger.info(`Category updated: ${category.name} (${category._id})`);

    return successResponse(res, category, 'Категория обновлена');
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление категории (только для администраторов)
 * DELETE /api/v1/categories/:id
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Проверка наличия товаров
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return errorResponse(
        res,
        `Невозможно удалить категорию. В ней ${productsCount} товар(ов)`,
        400
      );
    }

    // Проверка наличия подкатегорий
    const childrenCount = await Category.countDocuments({ parent: id });
    if (childrenCount > 0) {
      return errorResponse(
        res,
        `Невозможно удалить категорию. У неё ${childrenCount} подкатегори(й/и)`,
        400
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return errorResponse(res, 'Категория не найдена', 404);
    }

    // Очистка кэша
    await deleteCache(`category:${id}`);
    await deleteCache(`category:${category.slug}`);
    await deleteCachePattern('categories:*');

    logger.info(`Category deleted: ${category.name} (${category._id})`);

    return successResponse(res, null, 'Категория удалена');
  } catch (error) {
    next(error);
  }
};

/**
 * Получение товаров категории
 * GET /api/v1/categories/:id/products
 */
export const getCategoryProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      minPrice,
      maxPrice,
      inStock,
    } = req.query;

    const category = await Category.findOne(
      id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id }
    );

    if (!category) {
      return errorResponse(res, 'Категория не найдена', 404);
    }

    // Построение фильтра
    const filter = { category: category._id, isActive: true };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      filter['stock.available'] = { $gt: 0 };
    }

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return successResponse(res, {
      category,
      products,
      pagination: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление порядка категорий (только для администраторов)
 * PATCH /api/v1/categories/reorder
 */
export const reorderCategories = async (req, res, next) => {
  try {
    const { categories } = req.body; // [{ id, order }, ...]

    const updatePromises = categories.map(({ id, order }) =>
      Category.findByIdAndUpdate(id, { order })
    );

    await Promise.all(updatePromises);

    // Очистка кэша
    await deleteCachePattern('categories:*');

    logger.info('Categories reordered');

    return successResponse(res, null, 'Порядок категорий обновлен');
  } catch (error) {
    next(error);
  }
};

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  reorderCategories,
};
