import ApiKey from '../src/models/ApiKey.js';
import connectDB from '../src/config/database.js';
import logger from '../src/utils/logger.js';

/**
 * Скрипт для создания API ключа для интеграции с 1С
 *
 * Использование:
 * node scripts/createApiKey.js
 */

async function createApiKey() {
  try {
    // Подключаемся к базе данных
    await connectDB();
    logger.info('✅ Connected to MongoDB');

    // Генерируем пару ключ + секрет
    const { key, secret } = ApiKey.generateKeyPair();

    // Создаем API ключ с полными правами для 1С
    const apiKey = await ApiKey.create({
      name: '1C Integration',
      key,
      secret, // Будет автоматически захеширован в pre-save hook
      type: '1c',
      permissions: [
        'products.read',
        'products.write',
        'categories.read',
        'categories.write',
        'orders.read',
        'orders.write',
        'stock.write',
        'prices.write',
      ],
      ipWhitelist: [], // Пустой массив = доступ с любого IP
      rateLimit: {
        requestsPerMinute: 60,
        requestsPerDay: 10000,
      },
      isActive: true,
      metadata: {
        description: 'API ключ для синхронизации с 1С',
        createdBy: 'script',
      },
    });

    console.log('');
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║           ✅ API Key создан успешно!                           ║');
    console.log('╚════════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('📋 Сохраните эти данные:');
    console.log('');
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│ API Key (X-API-Key):                                        │');
    console.log(`│ ${key.padEnd(59)} │`);
    console.log('│                                                             │');
    console.log('│ API Secret (X-API-Secret):                                  │');
    console.log(`│ ${secret.padEnd(59)} │`);
    console.log('└─────────────────────────────────────────────────────────────┘');
    console.log('');
    console.log('⚠️  ВАЖНО: Secret показывается только один раз!');
    console.log('   Сохраните его в надежном месте.');
    console.log('');
    console.log('📌 Разрешения (permissions):');
    apiKey.permissions.forEach((perm) => {
      console.log(`   ✓ ${perm}`);
    });
    console.log('');
    console.log('📊 Лимиты:');
    console.log(`   • Запросов в минуту: ${apiKey.rateLimit.requestsPerMinute}`);
    console.log(`   • Запросов в день: ${apiKey.rateLimit.requestsPerDay}`);
    console.log('');
    console.log('🔗 Использование в запросах:');
    console.log('');
    console.log('   curl -X POST http://your-domain.com/api/v1/integration/1c/products/sync \\');
    console.log(`     -H "X-API-Key: ${key}" \\`);
    console.log(`     -H "X-API-Secret: ${secret}" \\`);
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"products": [...]}\'');
    console.log('');
    console.log('📖 Полная документация: backend/INTEGRATION_1C.md');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Ошибка при создании API ключа:');
    console.error(error.message);
    console.error('');
    process.exit(1);
  }
}

// Запускаем скрипт
createApiKey();
