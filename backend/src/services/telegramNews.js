import News from '../models/News.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

// Путь для сохранения загруженных файлов
const UPLOADS_DIR = process.env.UPLOADS_PATH || path.join(process.cwd(), 'uploads');
const NEWS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'news');

/**
 * Сервис для интеграции с Telegram каналом
 * Получает посты из канала и создает новости на сайте
 */

const TELEGRAM_API_URL = 'https://api.telegram.org/bot';

/**
 * Получение обновлений из Telegram (работает только без webhook)
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
 * Получение последних сообщений канала через getChat + копирование
 * Это workaround, так как Telegram Bot API не предоставляет прямой метод для получения истории канала
 */
export const getChannelHistory = async (botToken, channelId, limit = 20) => {
  try {
    // Получаем информацию о канале
    const chatResponse = await fetch(
      `${TELEGRAM_API_URL}${botToken}/getChat?chat_id=${channelId}`
    );

    if (!chatResponse.ok) {
      const errorText = await chatResponse.text();
      logger.error('getChat error:', errorText);
      throw new Error(`Telegram API error: ${chatResponse.status}`);
    }

    const chatData = await chatResponse.json();
    if (!chatData.ok) {
      throw new Error(chatData.description || 'Failed to get chat info');
    }

    logger.info(`Channel info: ${chatData.result?.title || channelId}`);

    // К сожалению, Bot API не позволяет получить историю канала напрямую
    // Webhook - это основной способ получения новых постов
    // Для синхронизации существующих постов нужно использовать Telegram Client API (не Bot API)

    return [];
  } catch (error) {
    logger.error('Error getting channel history:', error);
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
 * Скачивание и сохранение файла из Telegram
 * Возвращает локальный URL для доступа к файлу
 */
export const downloadAndSaveFile = async (botToken, fileId, type = 'image') => {
  try {
    // Создаем директорию если не существует
    if (!fs.existsSync(NEWS_UPLOADS_DIR)) {
      fs.mkdirSync(NEWS_UPLOADS_DIR, { recursive: true });
    }

    // Получаем информацию о файле
    const fileInfo = await getFileInfo(botToken, fileId);
    if (!fileInfo || !fileInfo.file_path) {
      logger.error('Failed to get file info for', fileId);
      return null;
    }

    // Определяем расширение файла
    const ext = path.extname(fileInfo.file_path) || (type === 'video' ? '.mp4' : '.jpg');
    const fileName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    const localPath = path.join(NEWS_UPLOADS_DIR, fileName);

    // URL файла на серверах Telegram
    const fileUrl = getFileUrl(botToken, fileInfo.file_path);

    // Скачиваем файл
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status}`);
    }

    // Сохраняем файл локально
    const fileStream = fs.createWriteStream(localPath);
    await pipeline(Readable.fromWeb(response.body), fileStream);

    logger.info(`File downloaded: ${fileName}`);

    // Возвращаем относительный URL для доступа к файлу
    return `/uploads/news/${fileName}`;
  } catch (error) {
    logger.error('Error downloading file:', error);
    return null;
  }
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
 * Поддерживает: одиночные фото, media groups (несколько фото), видео
 */
export const processChannelPost = async (post, botToken) => {
  try {
    const messageId = post.message_id;
    const chatId = post.chat?.id;
    const text = post.text || post.caption || '';
    const date = new Date(post.date * 1000);
    const mediaGroupId = post.media_group_id;

    // Если это часть media group, проверяем существующую новость по media_group_id
    let existingNews = null;
    if (mediaGroupId) {
      existingNews = await News.findOne({ telegramMediaGroupId: mediaGroupId });
    } else {
      existingNews = await News.findOne({ telegramMessageId: messageId });
    }

    // Если новость существует и это media group - добавляем изображения к существующей
    if (existingNews && mediaGroupId) {
      // Обработка дополнительных изображений для media group
      if (post.photo && post.photo.length > 0) {
        const largestPhoto = post.photo[post.photo.length - 1];
        const imageUrl = await downloadAndSaveFile(botToken, largestPhoto.file_id, 'image');

        if (imageUrl) {
          existingNews.images.push({
            url: imageUrl,
            alt: existingNews.title,
          });
          await existingNews.save();
          logger.info(`Added image to existing news media group: ${existingNews._id}`);
        }
      }
      return null;
    }

    // Новость уже существует (не media group)
    if (existingNews) {
      logger.info(`News already exists for Telegram message ${messageId}`);
      return null;
    }

    // Извлекаем данные
    const title = extractTitle(text);
    const tags = extractHashtags(text);
    const content = text;
    const excerpt = text.slice(0, 300) + (text.length > 300 ? '...' : '');

    // Обработка медиа-контента
    let thumbnail = null;
    const images = [];
    let video = null;

    // Обработка фото
    if (post.photo && post.photo.length > 0) {
      // Берем самое большое изображение (последнее в массиве)
      const largestPhoto = post.photo[post.photo.length - 1];
      const imageUrl = await downloadAndSaveFile(botToken, largestPhoto.file_id, 'image');

      if (imageUrl) {
        thumbnail = imageUrl;
        images.push({
          url: imageUrl,
          alt: title,
        });
      }
    }

    // Обработка видео
    if (post.video) {
      const videoUrl = await downloadAndSaveFile(botToken, post.video.file_id, 'video');
      if (videoUrl) {
        video = {
          url: videoUrl,
          duration: post.video.duration,
          width: post.video.width,
          height: post.video.height,
        };

        // Если есть thumbnail видео, используем его
        if (post.video.thumb) {
          const thumbUrl = await downloadAndSaveFile(botToken, post.video.thumb.file_id, 'image');
          if (thumbUrl) {
            thumbnail = thumbUrl;
          }
        }
      }
    }

    // Обработка video_note (круглые видео)
    if (post.video_note) {
      const videoUrl = await downloadAndSaveFile(botToken, post.video_note.file_id, 'video');
      if (videoUrl) {
        video = {
          url: videoUrl,
          duration: post.video_note.duration,
          isVideoNote: true,
        };

        if (post.video_note.thumb) {
          const thumbUrl = await downloadAndSaveFile(botToken, post.video_note.thumb.file_id, 'image');
          if (thumbUrl) {
            thumbnail = thumbUrl;
          }
        }
      }
    }

    // Обработка анимаций (GIF)
    if (post.animation) {
      const animationUrl = await downloadAndSaveFile(botToken, post.animation.file_id, 'video');
      if (animationUrl) {
        video = {
          url: animationUrl,
          duration: post.animation.duration,
          isAnimation: true,
        };

        if (post.animation.thumb) {
          const thumbUrl = await downloadAndSaveFile(botToken, post.animation.thumb.file_id, 'image');
          if (thumbUrl) {
            thumbnail = thumbUrl;
          }
        }
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
      video,
      telegramMessageId: messageId,
      telegramMediaGroupId: mediaGroupId || null,
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
 * Важно: getUpdates работает только если webhook НЕ установлен
 * После установки webhook новые посты будут приходить автоматически
 */
export const syncNewsFromTelegram = async (botToken, channelId) => {
  try {
    logger.info('Starting Telegram news sync...');

    // Проверяем статус webhook
    const webhookResponse = await fetch(
      `${TELEGRAM_API_URL}${botToken}/getWebhookInfo`
    );
    const webhookInfo = await webhookResponse.json();

    const results = {
      processed: 0,
      created: 0,
      skipped: 0,
      errors: 0,
      webhookActive: false,
      message: '',
    };

    if (webhookInfo.ok && webhookInfo.result?.url) {
      results.webhookActive = true;
      results.message = `Webhook активен (${webhookInfo.result.url}). Новые посты будут приходить автоматически. Ручная синхронизация работает только для pending updates.`;
      logger.info('Webhook is active, getUpdates may return empty');
    }

    // Пробуем получить updates (может быть пусто если webhook активен)
    const updates = await getChannelUpdates(botToken, channelId);

    logger.info(`Got ${updates.length} updates from Telegram`);

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

    if (results.processed === 0 && results.webhookActive) {
      results.message = 'Webhook установлен. Новые посты из канала будут автоматически добавляться на сайт. Опубликуйте новый пост в канал для проверки.';
    } else if (results.processed === 0) {
      results.message = 'Нет новых постов для синхронизации. Установите webhook для автоматического получения новых постов.';
    } else {
      results.message = `Синхронизация завершена. Создано: ${results.created}, пропущено: ${results.skipped}`;
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
