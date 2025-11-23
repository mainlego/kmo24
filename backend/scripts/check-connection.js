import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Скрипт для проверки подключения к MongoDB
 * Использование: node scripts/check-connection.js
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI не установлен в переменных окружения');
  process.exit(1);
}

console.log('🔄 Проверка подключения к MongoDB...');
console.log(`📍 URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

try {
  await mongoose.connect(MONGODB_URI, {
    retryWrites: true,
    w: 'majority',
  });

  console.log('✅ Успешное подключение к MongoDB!');
  console.log(`📊 База данных: ${mongoose.connection.db.databaseName}`);
  console.log(`🌍 Хост: ${mongoose.connection.host}`);

  // Проверяем коллекции
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`\n📦 Найдено коллекций: ${collections.length}`);
  collections.forEach((col) => {
    console.log(`  - ${col.name}`);
  });

  await mongoose.connection.close();
  console.log('\n✅ Соединение закрыто');
  process.exit(0);
} catch (error) {
  console.error('❌ Ошибка подключения к MongoDB:', error.message);
  process.exit(1);
}
