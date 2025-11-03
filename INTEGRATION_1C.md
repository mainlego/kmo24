# Интеграция с 1С

## Обзор

Система предоставляет полноценное REST API для интеграции с 1С. Все запросы к API требуют аутентификации через API ключи.

## Архитектура интеграции

```
┌─────────┐           ┌──────────────┐           ┌──────────┐
│   1С    │  ──HTTP──>│  KMO24 API   │  ──────> │  MongoDB │
│         │ <──JSON─  │  (Node.js)   │           │          │
└─────────┘           └──────────────┘           └──────────┘
                            │
                            ▼
                      ┌────────────┐
                      │   Логи     │
                      │ интеграции │
                      └────────────┘
```

## Компоненты системы

### 1. Модели данных

#### ApiKey (API ключи)
- **Файл:** `backend/models/ApiKey.js`
- **Назначение:** Управление API ключами для внешних систем
- **Поля:**
  - `name` - название ключа
  - `key` - публичный API ключ
  - `secret` - секретный ключ (хешируется)
  - `type` - тип ('1c', 'external', 'internal')
  - `permissions` - массив разрешений
  - `ipWhitelist` - белый список IP адресов
  - `isActive` - статус активности
  - `rateLimit` - лимиты запросов

#### IntegrationLog (Логи интеграции)
- **Файл:** `backend/models/IntegrationLog.js`
- **Назначение:** Логирование всех запросов от внешних систем
- **Поля:**
  - Информация о запросе (endpoint, method, headers, body)
  - Информация об ответе (statusCode, body)
  - Статистика (duration, itemsProcessed)
  - Ошибки (errorMessage, errorStack)

### 2. Middleware аутентификации

#### apiAuth
- **Файл:** `backend/middleware/apiAuth.js`
- **Функции:**
  - Проверка API ключа и секрета
  - Валидация разрешений
  - Проверка IP whitelist
  - Проверка rate limits
  - Автоматическое логирование

### 3. Контроллеры

#### apiKeys Controller
- **Файл:** `backend/controllers/apiKeys.js`
- **Endpoints для админ-панели:**
  - `GET /api/admin/api-keys` - список всех ключей
  - `POST /api/admin/api-keys` - создание нового ключа
  - `PUT /api/admin/api-keys/:id` - обновление ключа
  - `DELETE /api/admin/api-keys/:id` - удаление ключа
  - `POST /api/admin/api-keys/:id/regenerate` - перегенерация секрета
  - `GET /api/admin/api-keys/:id/logs` - логи конкретного ключа

#### integration1c Controller
- **Файл:** `backend/controllers/integration1c.js`
- **Endpoints для 1С:**
  - Health check и статистика
  - Синхронизация товаров
  - Синхронизация категорий
  - Обновление остатков
  - Обновление цен
  - Получение заказов
  - Обновление статусов заказов

## Настройка интеграции

### Шаг 1: Создание API ключа

1. Войдите в админ-панель: `https://yoursite.com/admin`
2. Перейдите в раздел "Интеграции" → "API Ключи"
3. Нажмите "Создать новый ключ"
4. Заполните форму:
   ```json
   {
     "name": "1С Склад",
     "type": "1c",
     "permissions": [
       "products.read",
       "products.write",
       "orders.read",
       "orders.write",
       "stock.write",
       "prices.write",
       "categories.write"
     ],
     "ipWhitelist": ["192.168.1.100"], // опционально
     "rateLimit": {
       "requestsPerMinute": 60,
       "requestsPerDay": 10000
     }
   }
   ```
5. **ВАЖНО:** Сохраните `key` и `secret` - секрет больше не будет показан!

### Шаг 2: Настройка 1С

#### HTTP-сервис в 1С

```1c
// Функция отправки запроса к API
Функция ОтправитьЗапросКAPI(Метод, Endpoint, Данные = Неопределено)

    // Настройки подключения
    АдресСервера = "https://yoursite.com";
    APIKey = "kmo24_xxxxxxxxxxxxxxxxxx";
    APISecret = "yyyyyyyyyyyyyyyyyyyyyyyy";

    // Создание HTTP соединения
    Соединение = Новый HTTPСоединение(
        АдресСервера,
        443, // Порт для HTTPS
        , // Пользователь
        , // Пароль
        , // Прокси
        30, // Таймаут
        Новый ЗащищенноеСоединениеOpenSSL()
    );

    // Подготовка запроса
    Запрос = Новый HTTPЗапрос(Endpoint);
    Запрос.Заголовки.Вставить("Content-Type", "application/json");
    Запрос.Заголовки.Вставить("X-API-Key", APIKey);
    Запрос.Заголовки.Вставить("X-API-Secret", APISecret);

    // Если есть данные, конвертируем в JSON
    Если Данные <> Неопределено Тогда
        ЗаписьJSON = Новый ЗаписьJSON;
        ЗаписьJSON.УстановитьСтроку();
        ЗаписатьJSON(ЗаписьJSON, Данные);
        Запрос.УстановитьТелоИзСтроки(ЗаписьJSON.Закрыть());
    КонецЕсли;

    // Отправка запроса
    Попытка
        Если Метод = "GET" Тогда
            Ответ = Соединение.Получить(Запрос);
        ИначеЕсли Метод = "POST" Тогда
            Ответ = Соединение.ОтправитьДляОбработки(Запрос);
        КонецЕсли;

        // Обработка ответа
        Если Ответ.КодСостояния = 200 Тогда
            ЧтениеJSON = Новый ЧтениеJSON;
            ЧтениеJSON.УстановитьСтроку(Ответ.ПолучитьТелоКакСтроку());
            Результат = ПрочитатьJSON(ЧтениеJSON);
            Возврат Результат;
        Иначе
            ВызватьИсключение "Ошибка API: " + Ответ.КодСостояния;
        КонецЕсли;
    Исключение
        Сообщить("Ошибка при обращении к API: " + ОписаниеОшибки());
        Возврат Неопределено;
    КонецПопытки;

КонецФункции
```

## API Endpoints

### Health Check
```http
GET /api/v1/integration/1c/health
X-API-Key: your_api_key
X-API-Secret: your_secret

Response 200:
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-11-03T10:00:00.000Z",
  "database": {
    "connected": true,
    "products": 1500,
    "orders": 234
  }
}
```

### Синхронизация товаров
```http
POST /api/v1/integration/1c/products/sync
X-API-Key: your_api_key
X-API-Secret: your_secret
Content-Type: application/json

{
  "products": [
    {
      "externalId": "00000001",
      "name": "Товар 1",
      "description": "Описание товара",
      "price": 1000,
      "compareAtPrice": 1500,
      "sku": "SKU-001",
      "barcode": "1234567890123",
      "categoryId": "category_object_id",
      "stock": 10,
      "isAvailable": true,
      "weight": 1.5,
      "dimensions": {
        "length": 10,
        "width": 20,
        "height": 30
      }
    }
  ]
}

Response 200:
{
  "success": true,
  "data": {
    "total": 1,
    "created": 1,
    "updated": 0,
    "failed": 0,
    "errors": []
  },
  "duration": "150ms"
}
```

### Обновление остатков
```http
POST /api/v1/integration/1c/stock/update
X-API-Key: your_api_key
X-API-Secret: your_secret

{
  "items": [
    {
      "externalId": "00000001",
      "stock": 25
    }
  ]
}
```

### Обновление цен
```http
POST /api/v1/integration/1c/prices/update
X-API-Key: your_api_key
X-API-Secret: your_secret

{
  "items": [
    {
      "externalId": "00000001",
      "price": 1200,
      "compareAtPrice": 1800
    }
  ]
}
```

### Получение новых заказов
```http
GET /api/v1/integration/1c/orders/new?since=2025-11-01T00:00:00Z&limit=100
X-API-Key: your_api_key
X-API-Secret: your_secret

Response 200:
{
  "success": true,
  "data": [
    {
      "orderId": "order_id",
      "orderNumber": "ORD-12345",
      "date": "2025-11-03T10:00:00Z",
      "customer": {
        "name": "Иван Иванов",
        "email": "ivan@example.com",
        "phone": "+79991234567"
      },
      "items": [
        {
          "externalId": "00000001",
          "productName": "Товар 1",
          "sku": "SKU-001",
          "quantity": 2,
          "price": 1000,
          "total": 2000
        }
      ],
      "subtotal": 2000,
      "deliveryFee": 300,
      "total": 2300
    }
  ],
  "count": 1
}
```

### Обновление статуса заказа
```http
POST /api/v1/integration/1c/orders/{orderId}/status
X-API-Key: your_api_key
X-API-Secret: your_secret

{
  "status": "processing",
  "tracking": {
    "trackingNumber": "TRACK-123",
    "carrier": "СДЭК"
  },
  "notes": "Заказ отправлен со склада",
  "external1CId": "1C-DOC-12345"
}
```

### Пометка заказов как экспортированных
```http
POST /api/v1/integration/1c/orders/mark-exported
X-API-Key: your_api_key
X-API-Secret: your_secret

{
  "orderIds": ["order_id_1", "order_id_2"]
}
```

## Разрешения (Permissions)

Система поддерживает гранулярные разрешения:

- `products.read` - чтение товаров
- `products.write` - создание/обновление товаров
- `orders.read` - чтение заказов
- `orders.write` - обновление заказов
- `stock.read` - чтение остатков
- `stock.write` - обновление остатков
- `categories.read` - чтение категорий
- `categories.write` - создание/обновление категорий
- `prices.read` - чтение цен
- `prices.write` - обновление цен
- `customers.read` - чтение клиентов
- `customers.write` - создание/обновление клиентов

## Rate Limiting

По умолчанию для каждого API ключа установлены лимиты:
- **60 запросов в минуту**
- **10,000 запросов в день**

Лимиты можно изменить в настройках ключа.

## Мониторинг и логирование

Все запросы логируются автоматически:
- Время выполнения
- Статус ответа
- Количество обработанных элементов
- Ошибки с полным stacktrace
- IP адрес клиента
- User-Agent

Просмотр логов: Админ-панель → Интеграции → Логи

## Обработка ошибок

### Коды ошибок
- `400` - Неверные данные запроса
- `401` - Ошибка аутентификации (неверный ключ/секрет)
- `403` - Недостаточно разрешений
- `404` - Ресурс не найден
- `429` - Превышен лимит запросов
- `500` - Внутренняя ошибка сервера

### Формат ошибки
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Примеры интеграции

### Пример 1: Ежедневная синхронизация товаров

```1c
Процедура СинхронизироватьТовары()

    Товары = Новый Массив;

    // Выборка товаров из 1С
    Запрос = Новый Запрос;
    Запрос.Текст = "
    |ВЫБРАТЬ
    |   Номенклатура.Код КАК ExternalId,
    |   Номенклатура.Наименование КАК Name,
    |   Номенклатура.Описание КАК Description,
    |   Цены.Цена КАК Price
    |ИЗ
    |   Справочник.Номенклатура КАК Номенклатура
    |";

    Выборка = Запрос.Выполнить().Выбрать();

    Пока Выборка.Следующий() Цикл
        Товар = Новый Структура;
        Товар.Вставить("externalId", Выборка.ExternalId);
        Товар.Вставить("name", Выборка.Name);
        Товар.Вставить("description", Выборка.Description);
        Товар.Вставить("price", Выборка.Price);

        Товары.Добавить(Товар);
    КонецЦикла;

    // Отправка в API
    Данные = Новый Структура("products", Товары);
    Результат = ОтправитьЗапросКAPI("POST", "/api/v1/integration/1c/products/sync", Данные);

    Если Результат <> Неопределено Тогда
        Сообщить("Синхронизировано товаров: " + Результат.data.created + Результат.data.updated);
    КонецЕсли;

КонецПроцедуры
```

### Пример 2: Получение новых заказов

```1c
Процедура ПолучитьНовыеЗаказы()

    // Получить заказы за последние 24 часа
    Вчера = ТекущаяДата() - 86400;
    Endpoint = "/api/v1/integration/1c/orders/new?since=" + Формат(Вчера, "ДФ=yyyy-MM-ddTHH:mm:ssZ");

    Результат = ОтправитьЗапросКAPI("GET", Endpoint);

    Если Результат <> Неопределено Тогда
        Для Каждого Заказ Из Результат.data Цикл
            // Создать документ в 1С
            СоздатьЗаказВ1С(Заказ);
        КонецЦикла;

        Сообщить("Получено заказов: " + Результат.count);
    КонецЕсли;

КонецПроцедуры
```

## Безопасность

### Рекомендации:
1. ✅ Храните секрет в защищенном месте
2. ✅ Используйте HTTPS для всех запросов
3. ✅ Настройте IP whitelist для дополнительной защиты
4. ✅ Регулярно ротируйте секреты
5. ✅ Мониторьте логи на подозрительную активность
6. ✅ Используйте минимально необходимые разрешения

### Не делайте:
1. ❌ Не передавайте секрет в query параметрах
2. ❌ Не логируйте секрет в 1С
3. ❌ Не используйте один ключ для разных систем
4. ❌ Не отключайте проверку SSL сертификатов

## Поддержка

По вопросам интеграции:
- Email: support@kmo24.ru
- Telegram: @kmo24_support
- Документация: https://docs.kmo24.ru

## Changelog

### v1.0.0 (2025-11-03)
- ✨ Первая версия API интеграции с 1С
- ✨ Поддержка синхронизации товаров, категорий, остатков, цен
- ✨ Двусторонняя синхронизация заказов
- ✨ Система API ключей с разрешениями
- ✨ Rate limiting
- ✨ Полное логирование
- ✨ Админ-панель для управления
