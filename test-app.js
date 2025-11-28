#!/usr/bin/env node

// Скрипт для проверки работы приложения
const http = require('http');
const https = require('https');

// Цвета для вывода
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Функция для выполнения HTTP запроса
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const protocol = options.protocol === 'https:' ? https : http;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(5000);
    req.end();
  });
}

// Проверки
const tests = [
  {
    name: 'Frontend главная страница',
    url: 'http://localhost:3000',
    expectedStatus: 200,
    checkContent: (body) => body.includes('<!DOCTYPE html>')
  },
  {
    name: 'Backend API статус',
    url: 'http://localhost:3001/api/v1',
    expectedStatus: 200,
    checkContent: (body) => {
      try {
        const json = JSON.parse(body);
        return json.message === 'Онлайн Магазин API';
      } catch {
        return false;
      }
    }
  },
  {
    name: 'Backend health check',
    url: 'http://localhost:3001/health',
    expectedStatus: 200,
    checkContent: (body) => {
      try {
        const json = JSON.parse(body);
        return json.status === 'OK';
      } catch {
        return false;
      }
    }
  },
  {
    name: 'API Products endpoint',
    url: 'http://localhost:3001/api/v1/products',
    expectedStatus: 200,
    checkContent: (body) => {
      try {
        const json = JSON.parse(body);
        return json.success === true && Array.isArray(json.data);
      } catch {
        return false;
      }
    }
  },
  {
    name: 'API Categories endpoint',
    url: 'http://localhost:3001/api/v1/categories',
    expectedStatus: 200,
    checkContent: (body) => {
      try {
        const json = JSON.parse(body);
        return json.success === true;
      } catch {
        return false;
      }
    }
  }
];

// Запуск тестов
async function runTests() {
  console.log(`${colors.blue}🔍 Проверка работы приложения КМО24${colors.reset}\n`);

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const url = new URL(test.url);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: 'GET',
        protocol: url.protocol,
        timeout: 5000
      };

      const response = await makeRequest(options);
      const statusOk = response.statusCode === test.expectedStatus;
      const contentOk = test.checkContent ? test.checkContent(response.body) : true;

      if (statusOk && contentOk) {
        console.log(`${colors.green}✓${colors.reset} ${test.name}`);
        console.log(`  URL: ${test.url}`);
        console.log(`  Статус: ${response.statusCode}\n`);
        passed++;
      } else {
        console.log(`${colors.red}✗${colors.reset} ${test.name}`);
        console.log(`  URL: ${test.url}`);
        console.log(`  Ожидаемый статус: ${test.expectedStatus}, получен: ${response.statusCode}`);
        if (!contentOk) {
          console.log(`  Проверка контента: FAILED`);
        }
        console.log('');
        failed++;
      }
    } catch (error) {
      console.log(`${colors.red}✗${colors.reset} ${test.name}`);
      console.log(`  URL: ${test.url}`);
      console.log(`  Ошибка: ${error.message}\n`);
      failed++;
    }
  }

  // Итоги
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}Результаты тестирования:${colors.reset}`);
  console.log(`${colors.green}✓ Пройдено: ${passed}${colors.reset}`);
  if (failed > 0) {
    console.log(`${colors.red}✗ Провалено: ${failed}${colors.reset}`);
  }

  // Дополнительная информация
  console.log(`\n${colors.yellow}📝 Дополнительная информация:${colors.reset}`);
  console.log('• Frontend доступен по адресу: http://localhost:3000');
  console.log('• Backend API доступен по адресу: http://localhost:3001/api/v1');
  console.log('• Документация API: http://localhost:3001/api/v1/docs');

  console.log(`\n${colors.blue}Новые изменения в приложении:${colors.reset}`);
  console.log('✅ Стильные хлебные крошки с градиентами и анимациями');
  console.log('✅ Ультра-минималистичная страница товара:');
  console.log('   • Компактная 3-колоночная сетка');
  console.log('   • Вся информация помещается на одном экране');
  console.log('   • Минимальные отступы и размеры шрифтов');
  console.log('   • Горизонтальная карусель похожих товаров');
  console.log('✅ Ультра-компактные карточки товаров:');
  console.log('   • Соотношение изображения 5:3 (60% высота)');
  console.log('   • Минимальные отступы 8px');
  console.log('   • Фиксированные малые размеры шрифтов');
  console.log('   • Кнопки высотой 32px');

  return failed === 0;
}

// Запуск
runTests().then((success) => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error(`${colors.red}Критическая ошибка: ${error.message}${colors.reset}`);
  process.exit(1);
});