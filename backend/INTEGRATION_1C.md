# Интеграция с 1С - Руководство по настройке

## 📋 Содержание
- [Статус готовности](#статус-готовности)
- [Архитектура интеграции](#архитектура-интеграции)
- [Подготовка к интеграции](#подготовка-к-интеграции)
- [Создание API ключей](#создание-api-ключей)
- [API Endpoints](#api-endpoints)
- [Примеры запросов](#примеры-запросов)
- [Настройка в 1С](#настройка-в-1с)
- [Мониторинг и логирование](#мониторинг-и-логирование)

---

## ✅ Статус готовности

### Что уже реализовано (100% готово к использованию):

✅ **Backend API полностью готов:**
- ✅ 9 REST API endpoints для обмена данными
- ✅ Система аутентификации по API ключам (X-API-Key + X-API-Secret)
- ✅ Защита: IP whitelist, rate limiting, permissions
- ✅ Автоматическое логирование всех запросов
- ✅ Мониторинг и статистика интеграции
- ✅ Управление API ключами (создание, обновление, удаление)

✅ **Модели данных готовы:**
- ✅ Product - поддержка externalId, lastSyncedAt
- ✅ Category - поддержка externalId для связи с 1С
- ✅ Order - поддержка externalId для двусторонней синхронизации

✅ **Middleware и безопасность:**
- ✅ apiAuth - проверка API ключей
- ✅ requirePermissions - гранулярный контроль доступа
- ✅ Rate limiting (запросы в минуту/день)
- ✅ IP whitelist для дополнительной безопасности

✅ **Маршруты подключены:**
- ✅ `/api/v1/integration/1c/*` - endpoints интеграции
- ✅ `/api/v1/admin/api-keys/*` - управление ключами

### Что нужно сделать перед запуском:

1. ⚠️ **Создать первый API ключ** (через админ-панель или скрипт)
2. ⚠️ **Настроить 1С** для отправки запросов на наш API
3. ✅ **Протестировать endpoints** (опционально, но рекомендуется)

---

## 🏗 Архитектура интеграции

### Принцип работы

```
┌─────────────┐                           ┌──────────────┐
│             │   HTTP REST API           │              │
│     1С      │◄─────────────────────────►│  KMO24 API   │
│             │   JSON (CommerceML)       │              │
└─────────────┘                           └──────────────┘
      │                                           │
      │                                           │
      ▼                                           ▼
┌─────────────┐                           ┌──────────────┐
│  1С База    │                           │   MongoDB    │
│  данных     │                           │              │
└─────────────┘                           └──────────────┘
```

### Потоки данных

**Из 1С в KMO24 (push от 1С):**
- Товары (создание/обновление)
- Категории
- Остатки товаров
- Цены
- Обновление статусов заказов

**Из KMO24 в 1С (pull от 1С):**
- Новые заказы с сайта
- Данные заказов для выгрузки

---

## 🚀 Подготовка к интеграции

### Шаг 1: Проверка backend

Backend уже полностью готов! Все необходимые файлы на месте:

```
backend/src/
├── controllers/
│   ├── integration1c.js     ✅ Контроллер с 9 методами
│   └── apiKeys.js           ✅ Управление API ключами
├── routes/
│   ├── integration1c.js     ✅ Маршруты интеграции
│   └── apiKeys.js           ✅ Маршруты управления ключами
├── models/
│   ├── Product.js           ✅ externalId, lastSyncedAt
│   ├── Category.js          ✅ externalId
│   ├── Order.js             ✅ externalId, lastSyncedAt
│   ├── ApiKey.js            ✅ Модель API ключей
│   └── IntegrationLog.js    ✅ Логирование запросов
└── middleware/
    └── apiAuth.js           ✅ Аутентификация API
```

### Шаг 2: Создание первого API ключа

**Вариант 1: Через API (требует админского JWT токена)**

```bash
POST http://localhost:5000/api/v1/admin/api-keys
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json

{
  "name": "1C Integration",
  "type": "1c",
  "permissions": [
    "products.read",
    "products.write",
    "categories.read",
    "categories.write",
    "orders.read",
    "orders.write",
    "stock.write",
    "prices.write"
  ],
  "ipWhitelist": ["192.168.1.100"], // IP сервера 1С (опционально)
  "rateLimit": {
    "requestsPerMinute": 60,
    "requestsPerDay": 10000
  }
}
```

**Ответ будет содержать:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "1C Integration",
    "key": "kmo24_a1b2c3d4e5f6...",
    "type": "1c",
    "permissions": [...],
    "isActive": true
  },
  "credentials": {
    "key": "kmo24_a1b2c3d4e5f6...",
    "secret": "s3cr3t_xyz123..."  // ⚠️ СОХРАНИТЕ! Показывается только один раз!
  },
  "message": "API key created successfully. Please save the secret - it will not be shown again!"
}
```

**⚠️ ВАЖНО:** Secret показывается только один раз! Сохраните его в надежном месте.

**Вариант 2: Через скрипт (прямое создание в MongoDB)**

Создайте файл `backend/scripts/createApiKey.js`:

```javascript
import ApiKey from '../src/models/ApiKey.js';
import connectDB from '../src/config/database.js';

async function createApiKey() {
  await connectDB();

  const { key, secret } = ApiKey.generateKeyPair();

  const apiKey = await ApiKey.create({
    name: '1C Integration',
    key,
    secret, // Будет автоматически захеширован
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
    isActive: true,
  });

  console.log('✅ API Key created successfully!');
  console.log('');
  console.log('API Key:', key);
  console.log('API Secret:', secret);
  console.log('');
  console.log('⚠️  SAVE THESE CREDENTIALS! Secret will not be shown again.');

  process.exit(0);
}

createApiKey().catch(console.error);
```

Запустите:
```bash
cd backend
node scripts/createApiKey.js
```

---

## 🔐 Безопасность и аутентификация

### Использование API ключей

Все запросы к `/api/v1/integration/1c/*` требуют заголовки:

```http
X-API-Key: kmo24_a1b2c3d4e5f6...
X-API-Secret: s3cr3t_xyz123...
```

### Уровни защиты

1. **API Key + Secret** - основная аутентификация
2. **Permissions** - гранулярный контроль (products.write, orders.read и т.д.)
3. **IP Whitelist** - только с указанных IP (опционально)
4. **Rate Limiting** - ограничение запросов (60/мин, 10000/день по умолчанию)
5. **Логирование** - все запросы записываются в IntegrationLog

---

## 📡 API Endpoints

### Base URL
```
http://your-domain.com/api/v1/integration/1c
```

### 1. Синхронизация товаров
```http
POST /products/sync
X-API-Key: kmo24_...
X-API-Secret: s3cr3t_...
Content-Type: application/json

{
  "products": [
    {
      "externalId": "1c-product-123",
      "name": "Болт М10x50",
      "sku": "BOLT-M10-50",
      "price": 15.50,
      "oldPrice": 20.00,
      "stock": {
        "quantity": 500
      },
      "category": "1c-category-456", // externalId категории
      "description": {
        "short": "Высокопрочный болт",
        "full": "Подробное описание..."
      },
      "specifications": [
        { "name": "Длина", "value": "50", "unit": "мм" },
        { "name": "Диаметр", "value": "10", "unit": "мм" }
      ]
    }
  ]
}
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "total": 1,
    "created": 1,
    "updated": 0,
    "failed": 0,
    "errors": []
  }
}
```

### 2. Синхронизация категорий
```http
POST /categories/sync
X-API-Key: kmo24_...
X-API-Secret: s3cr3t_...
Content-Type: application/json

{
  "categories": [
    {
      "externalId": "1c-category-456",
      "name": "Крепежные изделия",
      "slug": "krepezhnyie-izdeliya",
      "description": "Болты, гайки, шайбы",
      "parent": null,  // или externalId родительской категории
      "sortOrder": 1
    }
  ]
}
```

### 3. Обновление остатков
```http
POST /stock/update
X-API-Key: kmo24_...
X-API-Secret: s3cr3t_...
Content-Type: application/json

{
  "updates": [
    {
      "externalId": "1c-product-123",
      "quantity": 450
    },
    {
      "externalId": "1c-product-124",
      "quantity": 0
    }
  ]
}
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "total": 2,
    "updated": 2,
    "notFound": 0,
    "errors": []
  }
}
```

### 4. Обновление цен
```http
POST /prices/update
X-API-Key: kmo24_...
X-API-Secret: s3cr3t_...
Content-Type: application/json

{
  "updates": [
    {
      "externalId": "1c-product-123",
      "price": 16.00,
      "oldPrice": 20.00
    }
  ]
}
```

### 5. Получение новых заказов
```http
GET /orders/new?limit=50
X-API-Key: kmo24_...
X-API-Secret: s3cr3t_...
```

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "orderNumber": "251119-0001",
      "customer": {
        "firstName": "Иван",
        "lastName": "Петров",
        "email": "ivan@example.com",
        "phone": "+79001234567"
      },
      "items": [
        {
          "product": "...",
          "name": "Болт М10x50",
          "sku": "BOLT-M10-50",
          "quantity": 10,
          "price": 15.50,
          "total": 155.00
        }
      ],
      "pricing": {
        "subtotal": 155.00,
        "discount": 0,
        "shipping": 0,
        "total": 155.00
      },
      "status": "pending",
      "createdAt": "2025-11-19T10:30:00Z"
    }
  ]
}
```

### 6. Обновление статуса заказа
```http
POST /orders/:orderId/status
X-API-Key: kmo24_...
X-API-Secret: s3cr3t_...
Content-Type: application/json

{
  "status": "confirmed",  // pending, confirmed, processing, packed, shipped, delivered
  "externalId": "1c-order-789",  // ID заказа в 1С
  "comment": "Заказ подтвержден в 1С"
}
```

### 7. Отметить заказы как выгруженные
```http
POST /orders/mark-exported
X-API-Key: kmo24_...
X-API-Secret: s3cr3t_...
Content-Type: application/json

{
  "orderIds": ["orderId1", "orderId2", "orderId3"]
}
```

### 8. Health Check
```http
GET /health
X-API-Key: kmo24_...
X-API-Secret: s3cr3t_...
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-11-19T12:00:00.000Z",
    "database": "connected",
    "redis": "connected"
  }
}
```

### 9. Статистика интеграции
```http
GET /stats?days=7
X-API-Key: kmo24_...
X-API-Secret: s3cr3t_...
```

---

## 🔧 Настройка в 1С

### Конфигурация HTTP запросов в 1С

1. **Создайте константы в 1С:**
   - `KMO24_API_URL` = `http://your-domain.com/api/v1/integration/1c`
   - `KMO24_API_KEY` = `kmo24_a1b2c3d4e5f6...`
   - `KMO24_API_SECRET` = `s3cr3t_xyz123...`

2. **Пример функции отправки товаров (1С код):**

```1c
Функция ОтправитьТоварыНаСайт(МассивТоваров)

    // Подготовка данных
    Данные = Новый Структура;
    Данные.Вставить("products", Новый Массив);

    Для Каждого Товар Из МассивТоваров Цикл
        ТоварJSON = Новый Структура;
        ТоварJSON.Вставить("externalId", Строка(Товар.Ссылка.УникальныйИдентификатор()));
        ТоварJSON.Вставить("name", Товар.Наименование);
        ТоварJSON.Вставить("sku", Товар.Артикул);
        ТоварJSON.Вставить("price", Товар.Цена);

        СтруктураСток = Новый Структура;
        СтруктураСток.Вставить("quantity", Товар.ОстатокНаСкладе);
        ТоварJSON.Вставить("stock", СтруктураСток);

        Данные.products.Добавить(ТоварJSON);
    КонецЦикла;

    // Подготовка HTTP запроса
    Соединение = Новый HTTPСоединение(
        "your-domain.com",
        80,
        ,
        ,
        ,
        30
    );

    Запрос = Новый HTTPЗапрос("/api/v1/integration/1c/products/sync");

    // Добавляем заголовки аутентификации
    Запрос.Заголовки.Вставить("X-API-Key", Константы.KMO24_API_KEY.Получить());
    Запрос.Заголовки.Вставить("X-API-Secret", Константы.KMO24_API_SECRET.Получить());
    Запрос.Заголовки.Вставить("Content-Type", "application/json");

    // Конвертируем в JSON
    ЗаписьJSON = Новый ЗаписьJSON;
    ЗаписьJSON.УстановитьСтроку();
    ЗаписатьJSON(ЗаписьJSON, Данные);
    ТелоЗапроса = ЗаписьJSON.Закрыть();

    Запрос.УстановитьТелоИзСтроки(ТелоЗапроса, КодировкаТекста.UTF8);

    // Отправка запроса
    Попытка
        Ответ = Соединение.ОтправитьДляОбработки(Запрос);

        Если Ответ.КодСостояния = 200 Тогда
            // Разбор ответа
            ЧтениеJSON = Новый ЧтениеJSON;
            ЧтениеJSON.УстановитьСтроку(Ответ.ПолучитьТелоКакСтроку());
            Результат = ПрочитатьJSON(ЧтениеJSON);
            ЧтениеJSON.Закрыть();

            Возврат Результат;
        Иначе
            ВызватьИсключение "Ошибка HTTP: " + Ответ.КодСостояния;
        КонецЕсли;
    Исключение
        Сообщить("Ошибка отправки товаров на сайт: " + ОписаниеОшибки());
        Возврат Неопределено;
    КонецПопытки;

КонецФункции
```

### Расписание синхронизации в 1С

Рекомендуемая частота:
- **Товары и категории**: 1 раз в час (полная синхронизация)
- **Остатки**: каждые 15 минут
- **Цены**: каждые 30 минут
- **Заказы с сайта**: каждые 5 минут
- **Статусы заказов**: при изменении статуса в 1С

---

## 📊 Мониторинг и логирование

### Просмотр логов интеграции

```http
GET /api/v1/admin/api-keys/:keyId/logs?page=1&limit=50
Authorization: Bearer <ADMIN_JWT>
```

### Статистика

```http
GET /api/v1/admin/api-keys/stats/overview?days=7
Authorization: Bearer <ADMIN_JWT>
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "statusStats": [
      { "_id": "success", "count": 1250, "avgDuration": 45 },
      { "_id": "error", "count": 3, "avgDuration": 120 }
    ],
    "endpointStats": [
      { "_id": "/products/sync", "count": 500, "errors": 1, "avgDuration": 50 },
      { "_id": "/stock/update", "count": 400, "errors": 0, "avgDuration": 30 }
    ],
    "dailyStats": [...],
    "apiKeys": {
      "active": 1,
      "total": 1
    }
  }
}
```

### Что логируется

Каждый запрос сохраняется в `IntegrationLog`:
- Endpoint и HTTP метод
- Статус (success/error)
- Время выполнения (duration)
- IP адрес
- User-Agent
- Количество обработанных элементов
- Ошибки (если были)

Логи автоматически удаляются через 90 дней.

---

## 🧪 Тестирование интеграции

### 1. Health Check

```bash
curl -X GET http://localhost:5000/api/v1/integration/1c/health \
  -H "X-API-Key: kmo24_..." \
  -H "X-API-Secret: s3cr3t_..."
```

### 2. Создание тестовой категории

```bash
curl -X POST http://localhost:5000/api/v1/integration/1c/categories/sync \
  -H "X-API-Key: kmo24_..." \
  -H "X-API-Secret: s3cr3t_..." \
  -H "Content-Type: application/json" \
  -d '{
    "categories": [
      {
        "externalId": "test-cat-001",
        "name": "Тестовая категория",
        "slug": "test-category"
      }
    ]
  }'
```

### 3. Создание тестового товара

```bash
curl -X POST http://localhost:5000/api/v1/integration/1c/products/sync \
  -H "X-API-Key: kmo24_..." \
  -H "X-API-Secret: s3cr3t_..." \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "externalId": "test-product-001",
        "name": "Тестовый товар",
        "sku": "TEST-001",
        "price": 100,
        "stock": { "quantity": 10 },
        "category": "test-cat-001"
      }
    ]
  }'
```

---

## ⚠️ Типичные ошибки и решения

### 1. "API credentials missing"
**Причина:** Не переданы заголовки X-API-Key или X-API-Secret
**Решение:** Проверьте наличие обоих заголовков в запросе

### 2. "Invalid API key"
**Причина:** Неверный API ключ
**Решение:** Убедитесь, что ключ скопирован полностью (формат: `kmo24_...`)

### 3. "Invalid API secret"
**Причина:** Неверный secret
**Решение:** Если потеряли secret, создайте новый через `/admin/api-keys/:id/regenerate`

### 4. "IP address not whitelisted"
**Причина:** IP сервера 1С не в whitelist
**Решение:** Добавьте IP в `ipWhitelist` API ключа или оставьте массив пустым `[]`

### 5. "Rate limit exceeded"
**Причина:** Превышен лимит запросов
**Решение:** Увеличьте `rateLimit` в настройках API ключа или оптимизируйте частоту запросов

### 6. "Missing required permissions"
**Причина:** У API ключа нет нужных permissions
**Решение:** Добавьте необходимые разрешения в настройках ключа

---

## 🎯 Следующие шаги

1. ✅ **Создать API ключ** - используйте один из методов выше
2. ✅ **Протестировать endpoints** - начните с health check
3. ✅ **Настроить 1С** - добавьте код синхронизации
4. ✅ **Запустить тестовую синхронизацию** - отправьте 1-2 товара
5. ✅ **Настроить расписание** - автоматизируйте обмен данными
6. ✅ **Мониторить логи** - отслеживайте ошибки через админ-панель

---

## 📞 Поддержка

При возникновении проблем проверьте:
1. Логи backend: `backend/logs/error.log`
2. Логи интеграции: через API `/admin/api-keys/:id/logs`
3. MongoDB коллекцию `integrationlogs`

**Готово к использованию! 🚀**
