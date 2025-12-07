/**
 * Скрипт миграции изображений новостей из Telegram на локальный диск
 *
 * Запуск: npm run migrate-news-images
 * или: node src/scripts/migrateNewsImages.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

dotenv.config();

// Подключение к MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
const UPLOADS_DIR = process.env.UPLOADS_PATH || path.join(process.cwd(), 'uploads');
const NEWS_UPLOADS_DIR = path.join(UPLOADS_DIR, 'news');

// Импортируем модель
import News from '../models/News.js';

/**
 * Скачивает файл по URL и сохраняет локально
 */
async function downloadFile(url, type = 'image') {
  try {
    // Создаем директорию если не существует
    if (!fs.existsSync(NEWS_UPLOADS_DIR)) {
      fs.mkdirSync(NEWS_UPLOADS_DIR, { recursive: true });
    }

    // Определяем расширение файла
    let ext = '.jpg';
    if (url.includes('.mp4') || type === 'video') {
      ext = '.mp4';
    } else if (url.includes('.webm')) {
      ext = '.webm';
    } else if (url.includes('.gif')) {
      ext = '.gif';
    } else if (url.includes('.png')) {
      ext = '.png';
    }

    const fileName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`;
    const localPath = path.join(NEWS_UPLOADS_DIR, fileName);

    console.log(`Downloading: ${url}`);

    // Скачиваем файл
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
    }

    // Сохраняем файл локально
    const fileStream = fs.createWriteStream(localPath);
    await pipeline(Readable.fromWeb(response.body), fileStream);

    console.log(`  Saved to: ${fileName}`);

    // Возвращаем относительный URL
    return `/uploads/news/${fileName}`;
  } catch (error) {
    console.error(`  Error downloading ${url}:`, error.message);
    return null;
  }
}

/**
 * Проверяет, является ли URL внешним (не локальным)
 */
function isExternalUrl(url) {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Проверяет, является ли URL от Telegram
 */
function isTelegramUrl(url) {
  if (!url) return false;
  return url.includes('api.telegram.org');
}

/**
 * Мигрирует изображения одной новости
 */
async function migrateNewsImages(news) {
  let updated = false;
  const updates = {};

  // Миграция thumbnail
  if (news.thumbnail && isExternalUrl(news.thumbnail)) {
    console.log(`\nMigrating thumbnail for: ${news.title}`);
    const newUrl = await downloadFile(news.thumbnail, 'image');
    if (newUrl) {
      updates.thumbnail = newUrl;
      updated = true;
    }
  }

  // Миграция images
  if (news.images && news.images.length > 0) {
    const newImages = [];
    for (const image of news.images) {
      if (image.url && isExternalUrl(image.url)) {
        console.log(`\nMigrating image for: ${news.title}`);
        const newUrl = await downloadFile(image.url, 'image');
        if (newUrl) {
          newImages.push({ ...image.toObject(), url: newUrl });
          updated = true;
        } else {
          newImages.push(image.toObject());
        }
      } else {
        newImages.push(image.toObject());
      }
    }
    if (updated) {
      updates.images = newImages;
    }
  }

  // Миграция video
  if (news.video && news.video.url && isExternalUrl(news.video.url)) {
    console.log(`\nMigrating video for: ${news.title}`);
    const newUrl = await downloadFile(news.video.url, 'video');
    if (newUrl) {
      updates.video = { ...news.video.toObject(), url: newUrl };
      updated = true;
    }
  }

  // Обновляем документ если были изменения
  if (updated) {
    await News.findByIdAndUpdate(news._id, { $set: updates });
    console.log(`  Updated news: ${news._id}`);
  }

  return updated;
}

/**
 * Основная функция миграции
 */
async function main() {
  console.log('='.repeat(60));
  console.log('News Images Migration Script');
  console.log('='.repeat(60));
  console.log(`\nMongoDB URI: ${MONGODB_URI ? '***configured***' : 'NOT SET'}`);
  console.log(`Uploads directory: ${NEWS_UPLOADS_DIR}`);

  if (!MONGODB_URI) {
    console.error('\nError: MONGODB_URI is not set!');
    process.exit(1);
  }

  try {
    // Подключаемся к MongoDB
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    // Создаем директорию для загрузок
    if (!fs.existsSync(NEWS_UPLOADS_DIR)) {
      fs.mkdirSync(NEWS_UPLOADS_DIR, { recursive: true });
      console.log(`Created directory: ${NEWS_UPLOADS_DIR}`);
    }

    // Находим все новости с внешними URL в изображениях
    const news = await News.find({
      $or: [
        { thumbnail: { $regex: /^https?:\/\// } },
        { 'images.url': { $regex: /^https?:\/\// } },
        { 'video.url': { $regex: /^https?:\/\// } },
      ],
    });

    console.log(`\nFound ${news.length} news items with external URLs`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const item of news) {
      try {
        const wasMigrated = await migrateNewsImages(item);
        if (wasMigrated) {
          migratedCount++;
        }
      } catch (error) {
        console.error(`\nError migrating news ${item._id}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('Migration Summary');
    console.log('='.repeat(60));
    console.log(`Total news processed: ${news.length}`);
    console.log(`Successfully migrated: ${migratedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\nFatal error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Запуск
main().catch(console.error);
