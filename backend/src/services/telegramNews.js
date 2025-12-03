import News from '../models/News.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';
import crypto from 'crypto';

/**
 * Сервис для интеграции с Telegram каналом
 * Получает посты из канала и создает новости на сайте
 */

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

/**
 * Получение обновлений из Telegram
 */
export const getChannelUpdates = async (botToken, channelId, offset = 0) => {
  try {
    const response = await fetch(
      `${TELEGRAM_API_URL}${botToken}/getUpdates?offset=${offset}&allowed_updates=["channel_post"]`
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    const data = await response.json();
    return data.result || [];
  } catch (error) {
    logger.error('Error fetching Telegram updates:', error);
    throw error;
  }
};

/**
 * Получение информации о файле (для скачивания изображений)
 */
export const getFileInfo = async (botToken, fileId) => {
  try {
    const response = await fetch(
      `${TELEGRAM_API_URL}${botToken}/getFile?file_id=${fileId}`
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    logger.error('Error getting file info:', error);
    return null;
  }
};

/**
 * Получение URL файла для скачивания
 */
export const getFileUrl = (botToken, filePath) => {
  return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
};

/**
 * Генерация slug из заголовка
 */
const generateSlug = (title) => {
  const translitMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  };

  let slug = title.toLowerCase();

  // Транслитерация
  for (const [ru, en] of Object.entries(translitMap)) {
    slug = slug.replace(new RegExp(ru, 'g'), en);
  }

  // Удаление спецсимволов и замена пробелов
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Добавляем уникальный суффикс
  const uniqueSuffix = crypto.randomBytes(3).toString('hex');

  return `${slug}-${uniqueSuffix}`;
};

/**
 * Извлечение хэштегов из текста
 */
const extractHashtags = (text) => {
  const matches = text.match(/#[а-яёa-z0-9_]+/gi) || [];
  return matches.map(tag => tag.slice(1)); // Убираем #
};

/**
 * Извлечение заголовка из текста (первая строка или первые 100 символов)
 */
const extractTitle = (text) => {
  const lines = text.split('\n');
  const firstLine = lines[0].replace(/#[а-яёa-z0-9_]+\s*/gi, '').trim();

  if (firstLine.length > 0 && firstLine.length <= 200) {
    return firstLine;
  }

  // Если первая строка слишком длинная, берем первые 100 символов
  const cleanText = text.replace(/#[а-яёa-z0-9_]+\s*/gi, '').trim();
  return cleanText.slice(0, 100) + (cleanText.length > 100 ? '...' : '');
};

/**
 * Обработка поста из Telegram и создание новости
 */
export const processChannelPost = async (post, botToken) => {
  try {
    const messageId = post.message_id;
    const chatId = post.chat?.id;
    const text = post.text || post.caption || '';
    const date = new Date(post.date * 1000);

    // Проверяем, не существует ли уже такая новость
    const existingNews = await News.findOne({ telegramMessageId: messageId });
    if (existingNews) {
      logger.info(`News already exists for Telegram message ${messageId}`);
      return null;
    }

    // Извлекаем данные
    const title = extractTitle(text);
    const tags = extractHashtags(text);
    const content = text;
    const excerpt = text.slice(0, 300) + (text.length > 300 ? '...' : '');

    // Обработка изображений
    let thumbnail = null;
    const images = [];

    if (post.photo && post.photo.length > 0) {
      // Берем самое большое изображение
      const largestPhoto = post.photo[post.photo.length - 1];
      const fileInfo = await getFileInfo(botToken, largestPhoto.file_id);

      if (fileInfo) {
        const imageUrl = getFileUrl(botToken, fileInfo.file_path);
        thumbnail = imageUrl;
        images.push({
          url: imageUrl,
          alt: title,
        });
      }
    }

    // Создаем новость
    const newsData = {
      title,
      slug: generateSlug(title),
      content,
      excerpt,
      tags,
      thumbnail,
      images,
      telegramMessageId: messageId,
      telegramDate: date,
      telegramUrl: chatId ? `https://t.me/c/${String(chatId).replace('-100', '')}/${messageId}` : null,
      type: 'news',
      isPublished: true,
      publishedAt: date,
      stats: {
        views: 0,
        shares: 0,
      },
    };

    const news = await News.create(newsData);
    logger.info(`Created news from Telegram: ${news.title} (${news._id})`);

    return news;
  } catch (error) {
    logger.error('Error processing channel post:', error);
    throw error;
  }
};

/**
 * Синхронизация новостей из Telegram канала
 */
export const syncNewsFromTelegram = async (botToken, channelId) => {
  try {
    logger.info('Starting Telegram news sync...');

    const updates = await getChannelUpdates(botToken, channelId);
    const results = {
      processed: 0,
      created: 0,
      skipped: 0,
      errors: 0,
    };

    for (const update of updates) {
      if (update.channel_post) {
        results.processed++;

        try {
          const news = await processChannelPost(update.channel_post, botToken);
          if (news) {
            results.created++;
          } else {
            results.skipped++;
          }
        } catch (err) {
          results.errors++;
          logger.error('Error processing update:', err);
        }
      }
    }

    logger.info(`Telegram sync completed: ${JSON.stringify(results)}`);
    return results;
  } catch (error) {
    logger.error('Error syncing from Telegram:', error);
    throw error;
  }
};

/**
 * Webhook обработчик для получения обновлений от Telegram
 */
export const handleTelegramWebhook = async (update) => {
  try {
    if (update.channel_post) {
      const botToken = config.telegram?.botToken;
      if (!botToken) {
        logger.warn('Telegram bot token not configured');
        return null;
      }

      return await processChannelPost(update.channel_post, botToken);
    }

    return null;
  } catch (error) {
    logger.error('Error handling Telegram webhook:', error);
    throw error;
  }
};

export default {
  getChannelUpdates,
  processChannelPost,
  syncNewsFromTelegram,
  handleTelegramWebhook,
  getFileInfo,
  getFileUrl,
};
