/**
 * Скрипт для миграции изображений товаров с внешних URL на локальный Render Disk
 *
 * Запуск: node src/scripts/migrateImagesToLocal.js
 *
 * Скачивает все изображения товаров с внешних URL и сохраняет их локально
 * в директорию /var/data/uploads/products (на Render) или uploads/products (локально)
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import crypto from 'crypto';
import sharp from 'sharp';

// Импорты для конфигурации
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загрузка переменных окружения
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Подключение к MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kmo24';

// Путь для сохранения изображений
const UPLOADS_BASE = process.env.UPLOADS_PATH ||
  (process.env.NODE_ENV === 'production'
    ? '/var/data/uploads'
    : path.join(__dirname, '../../uploads'));

const PRODUCTS_DIR = path.join(UPLOADS_BASE, 'products');

// Статистика миграции
const stats = {
  total: 0,
  downloaded: 0,
  skipped: 0,
  errors: 0,
  products: 0,
};

/**
 * Создание директорий
 */
async function ensureDirectories() {
  const dirs = [
    PRODUCTS_DIR,
    path.join(PRODUCTS_DIR, 'thumbnails'),
  ];

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }
}

/**
 * Генерация уникального имени файла
 */
function generateFilename(originalUrl, productSku) {
  const ext = path.extname(new URL(originalUrl).pathname) || '.jpg';
  const hash = crypto.randomBytes(4).toString('hex');
  const safeSku = productSku.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  return `${safeSku}-${Date.now()}-${hash}${ext}`;
}

/**
 * Скачивание и сохранение изображения
 */
async function downloadImage(url, filename) {
  const localPath = path.join(PRODUCTS_DIR, filename);
  const thumbnailPath = path.join(PRODUCTS_DIR, 'thumbnails', `thumb-${filename}`);

  try {
    // Скачиваем изображение
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageMigration/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Сохраняем во временный файл
    const tempPath = localPath + '.tmp';
    const fileStream = fs.createWriteStream(tempPath);
    await pipeline(Readable.fromWeb(response.body), fileStream);

    // Проверяем и оптимизируем изображение через Sharp
    const image = sharp(tempPath);
    const metadata = await image.metadata();

    // Оптимизируем основное изображение (max 1200px width)
    const optimizedFilename = filename.replace(path.extname(filename), '.webp');
    const optimizedPath = path.join(PRODUCTS_DIR, optimizedFilename);

    await image
      .resize(1200, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 85 })
      .toFile(optimizedPath);

    // Создаем thumbnail (300x300)
    const thumbFilename = `thumb-${optimizedFilename}`;
    const thumbPath = path.join(PRODUCTS_DIR, 'thumbnails', thumbFilename);

    await sharp(tempPath)
      .resize(300, 300, { fit: 'cover' })
      .webp({ quality: 75 })
      .toFile(thumbPath);

    // Удаляем временный файл
    fs.unlinkSync(tempPath);

    console.log(`  ✅ Downloaded: ${optimizedFilename} (${metadata.width}x${metadata.height})`);

    return {
      url: `/uploads/products/${optimizedFilename}`,
      thumbnail: `/uploads/products/thumbnails/${thumbFilename}`,
      originalUrl: url,
    };
  } catch (error) {
    console.error(`  ❌ Error downloading ${url}:`, error.message);
    stats.errors++;
    return null;
  }
}

/**
 * Проверка, является ли URL внешним
 */
function isExternalUrl(url) {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Проверка, является ли URL уже локальным
 */
function isLocalUrl(url) {
  if (!url) return false;
  return url.startsWith('/uploads/');
}

/**
 * Миграция изображений одного товара
 */
async function migrateProductImages(product) {
  const updatedImages = [];
  let hasChanges = false;

  for (const image of product.images) {
    stats.total++;

    // Пропускаем уже локальные изображения
    if (isLocalUrl(image.url)) {
      console.log(`  ⏭️  Skipped (already local): ${image.url}`);
      stats.skipped++;
      updatedImages.push(image);
      continue;
    }

    // Пропускаем пустые URL
    if (!image.url) {
      stats.skipped++;
      continue;
    }

    // Скачиваем внешние изображения
    if (isExternalUrl(image.url)) {
      const filename = generateFilename(image.url, product.sku);
      const result = await downloadImage(image.url, filename);

      if (result) {
        updatedImages.push({
          url: result.url,
          alt: image.alt || product.name,
          isPrimary: image.isPrimary || false,
          sortOrder: image.sortOrder || 0,
        });
        stats.downloaded++;
        hasChanges = true;
      } else {
        // Сохраняем оригинальный URL если не удалось скачать
        updatedImages.push(image);
      }
    } else {
      updatedImages.push(image);
      stats.skipped++;
    }
  }

  // Обновляем товар если были изменения
  if (hasChanges) {
    product.images = updatedImages;
    await product.save();
    console.log(`  💾 Product updated: ${product.name}`);
  }

  return hasChanges;
}

/**
 * Основная функция миграции
 */
async function migrate() {
  console.log('🚀 Starting image migration to Render Disk...\n');
  console.log(`📂 Upload directory: ${PRODUCTS_DIR}\n`);

  try {
    // Подключение к MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Создаем директории
    await ensureDirectories();

    // Импортируем модель Product
    const { default: Product } = await import('../models/Product.js');

    // Получаем все товары с изображениями
    const products = await Product.find({ 'images.0': { $exists: true } });
    console.log(`📦 Found ${products.length} products with images\n`);

    // Мигрируем изображения
    for (const product of products) {
      console.log(`\n📦 Processing: ${product.name} (${product.sku})`);
      const changed = await migrateProductImages(product);
      if (changed) {
        stats.products++;
      }
    }

    // Выводим статистику
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Statistics:');
    console.log('='.repeat(50));
    console.log(`  Total images:    ${stats.total}`);
    console.log(`  Downloaded:      ${stats.downloaded}`);
    console.log(`  Skipped:         ${stats.skipped}`);
    console.log(`  Errors:          ${stats.errors}`);
    console.log(`  Products updated: ${stats.products}`);
    console.log('='.repeat(50));

    if (stats.errors > 0) {
      console.log('\n⚠️  Some images failed to download. Check the logs above.');
    } else {
      console.log('\n✅ Migration completed successfully!');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Запуск миграции
migrate();
