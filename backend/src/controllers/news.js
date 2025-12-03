import News from '../models/News.js';
import { successResponse, errorResponse, paginatedResponse, createPagination } from '../utils/response.js';
import { getCache, setCache, deleteCache, deleteCachePattern } from '../config/redis-mock.js';
import logger from '../utils/logger.js';

/**
 * Получение списка новостей
 * GET /api/v1/news
 */
export const getNews = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      tag,
      search,
      isPublished,
      sort = '-publishedAt',
    } = req.query;

    // Кэш ключ
    const cacheKey = `news:${JSON.stringify(req.query)}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Построение фильтра
    const filter = {};

    // Для обычных пользователей показываем только опубликованные
    if (isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    } else {
      filter.isPublished = true;
      filter.publishedAt = { $lte: new Date() };
    }

    if (tag) {
      filter.tags = tag;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await News.countDocuments(filter);

    const news = await News.find(filter)
      .populate('author', 'firstName lastName avatar')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const pagination = createPagination(page, limit, total);

    const response = {
      success: true,
      data: news,
      pagination: {
        currentPage: pagination.page,
        itemsPerPage: pagination.limit,
        totalItems: pagination.total,
        totalPages: pagination.totalPages,
        hasNextPage: pagination.page < pagination.totalPages,
        hasPrevPage: pagination.page > 1,
      },
    };

    // Кэш на 10 минут
    await setCache(cacheKey, response, 600);

    return res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение одной новости по ID или slug
 * GET /api/v1/news/:id
 */
export const getNewsItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Проверка кэша
    const cacheKey = `news:item:${id}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return successResponse(res, cachedData);
    }

    // Поиск по ID или slug
    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id }
      : { slug: id };

    const newsItem = await News.findOne(query)
      .populate('author', 'firstName lastName avatar');

    if (!newsItem) {
      return errorResponse(res, 'Новость не найдена', 404);
    }

    // Увеличение счетчика просмотров
    newsItem.stats.views += 1;
    await newsItem.save();

    // Кэш на 30 минут
    await setCache(cacheKey, newsItem, 1800);

    return successResponse(res, newsItem);
  } catch (error) {
    next(error);
  }
};

/**
 * Создание новости (только для администраторов)
 * POST /api/v1/news
 */
export const createNews = async (req, res, next) => {
  try {
    const newsData = {
      ...req.body,
      author: req.user._id,
    };

    const newsItem = await News.create(newsData);

    // Очистка кэша
    await deleteCachePattern('news:*');

    logger.info(`News created: ${newsItem.title} (${newsItem._id})`);

    return successResponse(res, newsItem, 'Новость создана', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Обновление новости (только для администраторов)
 * PUT /api/v1/news/:id
 */
export const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const newsItem = await News.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!newsItem) {
      return errorResponse(res, 'Новость не найдена', 404);
    }

    // Очистка кэша
    await deleteCache(`news:item:${id}`);
    await deleteCache(`news:item:${newsItem.slug}`);
    await deleteCachePattern('news:*');

    logger.info(`News updated: ${newsItem.title} (${newsItem._id})`);

    return successResponse(res, newsItem, 'Новость обновлена');
  } catch (error) {
    next(error);
  }
};

/**
 * Удаление новости (только для администраторов)
 * DELETE /api/v1/news/:id
 */
export const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const newsItem = await News.findByIdAndDelete(id);

    if (!newsItem) {
      return errorResponse(res, 'Новость не найдена', 404);
    }

    // Очистка кэша
    await deleteCache(`news:item:${id}`);
    await deleteCache(`news:item:${newsItem.slug}`);
    await deleteCachePattern('news:*');

    logger.info(`News deleted: ${newsItem.title} (${newsItem._id})`);

    return successResponse(res, null, 'Новость удалена');
  } catch (error) {
    next(error);
  }
};

/**
 * Публикация/снятие с публикации (только для администраторов)
 * PATCH /api/v1/news/:id/publish
 */
export const togglePublish = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    const newsItem = await News.findById(id);

    if (!newsItem) {
      return errorResponse(res, 'Новость не найдена', 404);
    }

    newsItem.isPublished = isPublished;
    if (isPublished && !newsItem.publishedAt) {
      newsItem.publishedAt = new Date();
    }

    await newsItem.save();

    // Очистка кэша
    await deleteCache(`news:item:${id}`);
    await deleteCache(`news:item:${newsItem.slug}`);
    await deleteCachePattern('news:*');

    logger.info(
      `News ${isPublished ? 'published' : 'unpublished'}: ${newsItem.title}`
    );

    return successResponse(
      res,
      newsItem,
      isPublished ? 'Новость опубликована' : 'Новость снята с публикации'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Получение связанных новостей
 * GET /api/v1/news/:id/related
 */
export const getRelatedNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    const newsItem = await News.findById(id);
    if (!newsItem) {
      return errorResponse(res, 'Новость не найдена', 404);
    }

    // Поиск похожих новостей по тегам
    const relatedNews = await News.find({
      _id: { $ne: id },
      isPublished: true,
      publishedAt: { $lte: new Date() },
      tags: { $in: newsItem.tags },
    })
      .select('title slug excerpt thumbnail publishedAt')
      .sort('-publishedAt')
      .limit(parseInt(limit));

    return successResponse(res, relatedNews);
  } catch (error) {
    next(error);
  }
};

/**
 * Получение всех тегов
 * GET /api/v1/news/tags/all
 */
export const getAllTags = async (req, res, next) => {
  try {
    // Кэш ключ
    const cacheKey = 'news:tags:all';
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return successResponse(res, cachedData);
    }

    const tags = await News.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, tag: '$_id', count: 1 } },
    ]);

    // Кэш на 1 час
    await setCache(cacheKey, tags, 3600);

    return successResponse(res, tags);
  } catch (error) {
    next(error);
  }
};

/**
 * Синхронизация с Telegram каналом (только для администраторов)
 * POST /api/v1/news/sync/telegram
 */
export const syncFromTelegram = async (req, res, next) => {
  try {
    const { syncNewsFromTelegram } = await import('../services/telegramNews.js');
    const config = (await import('../config/index.js')).default;

    const botToken = config.telegram?.botToken;
    const channelId = config.telegram?.channelId;

    if (!botToken) {
      return errorResponse(res, 'Telegram Bot Token не настроен', 400);
    }

    const results = await syncNewsFromTelegram(botToken, channelId);

    logger.info('Telegram sync completed:', results);

    return successResponse(res, results, 'Синхронизация с Telegram завершена');
  } catch (error) {
    next(error);
  }
};

/**
 * Webhook для получения обновлений от Telegram бота
 * POST /api/v1/news/webhook/telegram
 */
export const telegramWebhook = async (req, res, next) => {
  try {
    const { handleTelegramWebhook } = await import('../services/telegramNews.js');

    const update = req.body;

    if (!update) {
      return res.status(200).send('OK');
    }

    const result = await handleTelegramWebhook(update);

    if (result) {
      // Очистка кэша новостей
      await deleteCachePattern('news:*');
      logger.info(`News created from Telegram webhook: ${result.title}`);
    }

    // Telegram требует ответ 200 OK
    return res.status(200).send('OK');
  } catch (error) {
    logger.error('Telegram webhook error:', error);
    // Всегда возвращаем 200, чтобы Telegram не повторял запрос
    return res.status(200).send('OK');
  }
};

/**
 * Получение настроек интеграции с Telegram
 * GET /api/v1/news/telegram/settings
 */
export const getTelegramSettings = async (req, res, next) => {
  try {
    const config = (await import('../config/index.js')).default;

    const settings = {
      isConfigured: !!(config.telegram?.botToken && config.telegram?.channelId),
      channelId: config.telegram?.channelId || null,
      syncInterval: config.telegram?.syncInterval || 900000,
      webhookUrl: `${process.env.API_URL || ''}/api/v1/news/webhook/telegram`,
    };

    return successResponse(res, settings);
  } catch (error) {
    next(error);
  }
};

/**
 * Настройка Webhook для Telegram бота
 * POST /api/v1/news/telegram/setup-webhook
 */
export const setupTelegramWebhook = async (req, res, next) => {
  try {
    const config = (await import('../config/index.js')).default;

    const botToken = config.telegram?.botToken;
    const apiUrl = process.env.API_URL;

    if (!botToken) {
      return errorResponse(res, 'Telegram Bot Token не настроен', 400);
    }

    if (!apiUrl) {
      return errorResponse(res, 'API_URL не настроен', 400);
    }

    const webhookUrl = `${apiUrl}/api/v1/news/webhook/telegram`;

    // Устанавливаем webhook
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}&allowed_updates=["channel_post"]`
    );

    const result = await response.json();

    if (result.ok) {
      logger.info('Telegram webhook set successfully');
      return successResponse(res, { webhookUrl }, 'Webhook установлен');
    } else {
      return errorResponse(res, result.description || 'Ошибка установки webhook', 400);
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getNews,
  getNewsItem,
  createNews,
  updateNews,
  deleteNews,
  togglePublish,
  getRelatedNews,
  getAllTags,
  syncFromTelegram,
  telegramWebhook,
  getTelegramSettings,
  setupTelegramWebhook,
};
