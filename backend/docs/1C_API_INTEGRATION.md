# API документация для интеграции с 1С

## Содержание

1. [Общая информация](#общая-информация)
2. [Аутентификация](#аутентификация)
3. [API Endpoints](#api-endpoints)
   - [Товары](#товары)
   - [Категории](#категории)
   - [Остатки](#остатки)
   - [Цены](#цены)
   - [Заказы](#заказы)
4. [Примеры использования](#примеры-использования)
5. [Коды ошибок](#коды-ошибок)

---

## Общая информация

### Base URL
```
Production: https://kmo24-backend.onrender.com/api/v1
Development: http://localhost:3001/api/v1
```

### Формат данных
- Content-Type: `application/json`
- Кодировка: `UTF-8`
- Формат дат: ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)

### Rate Limiting
- 100 запросов в 15 минут на IP-адрес
- При превышении лимита: HTTP 429 Too Many Requests

---

## Аутентификация

Для работы с API необходимо получить API ключ и секрет.

### 1. Создание API ключа (через админ-панель)

API ключи создаются администратором через веб-интерфейс:
- Перейдите в админ-панель: `/admin/api-keys`
- Нажмите "Создать новый ключ"
- Выберите тип: `1c`
- Укажите разрешения
- Сохраните API Key и API Secret

### 2. Использование API ключа

Для каждого запроса необходимо передавать заголовки:

```http
X-API-Key: your_api_key
X-API-Secret: your_api_secret
Content-Type: application/json
```

### Пример с cURL:

```bash
curl -X GET "https://kmo24-backend.onrender.com/api/v1/integration/1c/health" \
  -H "X-API-Key: your_api_key" \
  -H "X-API-Secret: your_api_secret"
```

---

## API Endpoints

### Health Check

Проверка доступности API и статуса подключения к базе данных.

**Endpoint:** `GET /integration/1c/health`

**Аутентификация:** Требуется

**Пример запроса:**
```bash
curl -X GET "https://kmo24-backend.onrender.com/api/v1/integration/1c/health" \
  -H "X-API-Key: your_api_key" \
  -H "X-API-Secret: your_api_secret"
```

**Пример ответа:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-11-25T12:00:00.000Z",
  "database": {
    "connected": true,
    "productsCount": 150,
    "ordersCount": 45
  }
}
```

---

### Товары

#### Синхронизация товаров

Массовое создание/обновление товаров из 1С.

**Endpoint:** `POST /integration/1c/products/sync`

**Аутентификация:** Требуется (permission: `products.sync`)

**Request Body:**
```json
{
  "products": [
    {
      "externalId": "00000001",
      "sku": "UNOX-XBC-805E",
      "name": "Печь конвекционная Unox XBC 805E",
      "description": {
        "short": "Профессиональная конвекционная печь",
        "full": "Полное описание товара..."
      },
      "categoryExternalId": "CAT001",
      "price": 289000,
      "oldPrice": 350000,
      "stock": {
        "quantity": 5,
        "reserved": 1,
        "available": 4
      },
      "dimensions": {
        "length": 120,
        "width": 80,
        "height": 180,
        "weight": 150
      },
      "specifications": [
        {
          "name": "Бренд",
          "value": "Unox",
          "group": "Общие"
        },
        {
          "name": "Мощность",
          "value": "15",
          "unit": "кВт",
          "group": "Технические"
        }
      ],
      "images": [
        {
          "url": "https://example.com/image1.jpg",
          "alt": "Фото товара",
          "isPrimary": true,
          "sortOrder": 1
        }
      ],
      "isActive": true,
      "isFeatured": false
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "created": 5,
    "updated": 12,
    "failed": 0,
    "total": 17,
    "errors": [],
    "duration": 1234
  }
}
```

**Поля товара:**

| Поле | Тип | Обязательно | Описание |
|------|-----|-------------|----------|
| externalId | string | Да | Уникальный ID из 1С |
| sku | string | Да | Артикул товара |
| name | string | Да | Название товара |
| description.short | string | Нет | Краткое описание |
| description.full | string | Нет | Полное описание |
| categoryExternalId | string | Да | ID категории из 1С |
| price | number | Да | Цена в рублях |
| oldPrice | number | Нет | Старая цена для скидки |
| stock.quantity | number | Да | Общее количество |
| stock.reserved | number | Нет | Зарезервировано |
| stock.available | number | Да | Доступно для продажи |
| dimensions.length | number | Нет | Длина в см |
| dimensions.width | number | Нет | Ширина в см |
| dimensions.height | number | Нет | Высота в см |
| dimensions.weight | number | Нет | Вес в кг |
| isActive | boolean | Нет | Активен ли товар |

---

### Категории

#### Синхронизация категорий

**Endpoint:** `POST /integration/1c/categories/sync`

**Аутентификация:** Требуется (permission: `categories.sync`)

**Request Body:**
```json
{
  "categories": [
    {
      "externalId": "CAT001",
      "name": "Тепловое оборудование",
      "slug": "teplovoe-oborudovanie",
      "parentExternalId": null,
      "description": "Описание категории",
      "sortOrder": 1,
      "isActive": true
    },
    {
      "externalId": "CAT001-001",
      "name": "Печи",
      "slug": "pechi",
      "parentExternalId": "CAT001",
      "description": "Подкатегория печей",
      "sortOrder": 1,
      "isActive": true
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "created": 2,
    "updated": 5,
    "failed": 0,
    "total": 7
  }
}
```

---

### Остатки

#### Обновление остатков товаров

Быстрое обновление остатков без полной синхронизации товаров.

**Endpoint:** `POST /integration/1c/stock/update`

**Аутентификация:** Требуется (permission: `stock.update`)

**Request Body:**
```json
{
  "items": [
    {
      "externalId": "00000001",
      "quantity": 10,
      "reserved": 2,
      "available": 8
    },
    {
      "externalId": "00000002",
      "quantity": 0,
      "reserved": 0,
      "available": 0
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "updated": 2,
    "failed": 0,
    "total": 2,
    "errors": []
  }
}
```

---

### Цены

#### Обновление цен товаров

**Endpoint:** `POST /integration/1c/prices/update`

**Аутентификация:** Требуется (permission: `prices.update`)

**Request Body:**
```json
{
  "items": [
    {
      "externalId": "00000001",
      "price": 295000,
      "oldPrice": 350000
    },
    {
      "externalId": "00000002",
      "price": 125000,
      "oldPrice": null
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "updated": 2,
    "failed": 0,
    "total": 2
  }
}
```

---

### Заказы

#### Получение новых заказов

Получить список заказов, которые еще не были экспортированы в 1С.

**Endpoint:** `GET /integration/1c/orders/new`

**Аутентификация:** Требуется (permission: `orders.read`)

**Query параметры:**
- `since` (string, optional) - Дата в формате ISO 8601, получить заказы после этой даты
- `limit` (number, optional) - Максимум заказов (default: 100, max: 500)

**Пример запроса:**
```bash
curl -X GET "https://kmo24-backend.onrender.com/api/v1/integration/1c/orders/new?limit=50" \
  -H "X-API-Key: your_api_key" \
  -H "X-API-Secret: your_api_secret"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "orderNumber": "ORD-2024-001",
      "customer": {
        "name": "Иван Иванов",
        "email": "ivan@example.com",
        "phone": "+79991234567"
      },
      "items": [
        {
          "product": {
            "_id": "507f191e810c19729de860ea",
            "name": "Печь конвекционная Unox XBC 805E",
            "sku": "UNOX-XBC-805E",
            "externalId": "00000001"
          },
          "quantity": 1,
          "price": 289000,
          "subtotal": 289000
        }
      ],
      "totals": {
        "subtotal": 289000,
        "shipping": 5000,
        "discount": 0,
        "total": 294000
      },
      "shipping": {
        "method": "transport_company",
        "address": {
          "city": "Москва",
          "street": "ул. Ленина",
          "building": "10",
          "apartment": "5",
          "postalCode": "123456"
        },
        "transportCompany": {
          "name": "Деловые Линии",
          "city": "Москва",
          "price": 5000,
          "deliveryTime": 5
        }
      },
      "payment": {
        "method": "bank_transfer",
        "status": "pending"
      },
      "status": "pending",
      "createdAt": "2024-11-25T10:00:00.000Z",
      "updatedAt": "2024-11-25T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50
  }
}
```

---

#### Обновление статуса заказа

**Endpoint:** `POST /integration/1c/orders/:orderId/status`

**Аутентификация:** Требуется (permission: `orders.update`)

**Path параметры:**
- `orderId` - MongoDB ObjectId заказа

**Request Body:**
```json
{
  "status": "processing",
  "tracking": "TK123456789",
  "notes": "Заказ принят в работу",
  "external1CId": "DOC-2024-001"
}
```

**Возможные статусы:**
- `pending` - Ожидает обработки
- `processing` - В обработке
- `shipped` - Отправлен
- `delivered` - Доставлен
- `cancelled` - Отменен

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-2024-001",
    "status": "processing",
    "tracking": "TK123456789",
    "metadata": {
      "external1CId": "DOC-2024-001"
    }
  }
}
```

---

#### Отметить заказы как экспортированные

После успешного импорта заказов в 1С, отметьте их как экспортированные.

**Endpoint:** `POST /integration/1c/orders/mark-exported`

**Аутентификация:** Требуется (permission: `orders.update`)

**Request Body:**
```json
{
  "orderIds": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012"
  ],
  "external1CIds": [
    "DOC-2024-001",
    "DOC-2024-002"
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "updated": 2,
    "failed": 0
  }
}
```

---

### Статистика

#### Получение статистики интеграции

**Endpoint:** `GET /integration/1c/stats`

**Аутентификация:** Требуется

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": {
      "total": 150,
      "synced": 145,
      "available": 132
    },
    "orders": {
      "total": 45,
      "exported": 40,
      "pending": 5
    },
    "lastSync": "2024-11-25T10:00:00.000Z"
  }
}
```

---

## Примеры использования

### Python

```python
import requests
import json

API_BASE = "https://kmo24-backend.onrender.com/api/v1"
API_KEY = "your_api_key"
API_SECRET = "your_api_secret"

headers = {
    "X-API-Key": API_KEY,
    "X-API-Secret": API_SECRET,
    "Content-Type": "application/json"
}

# Синхронизация товаров
def sync_products(products):
    url = f"{API_BASE}/integration/1c/products/sync"
    data = {"products": products}

    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Получение новых заказов
def get_new_orders():
    url = f"{API_BASE}/integration/1c/orders/new"
    response = requests.get(url, headers=headers)
    return response.json()

# Обновление статуса заказа
def update_order_status(order_id, status, tracking=None):
    url = f"{API_BASE}/integration/1c/orders/{order_id}/status"
    data = {
        "status": status,
        "tracking": tracking
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Пример использования
if __name__ == "__main__":
    # Получить новые заказы
    orders = get_new_orders()
    print(f"Новых заказов: {len(orders['data'])}")

    # Обновить статус первого заказа
    if orders['data']:
        first_order = orders['data'][0]
        result = update_order_status(
            first_order['_id'],
            'processing',
            'TK123456789'
        )
        print(f"Статус обновлен: {result}")
```

### 1C (HTTP-сервисы)

```bsl
// Модуль обмена с интернет-магазином

Функция ПолучитьНовыеЗаказы() Экспорт

    АдресСервиса = "https://kmo24-backend.onrender.com/api/v1";
    APIKey = ПолучитьКлючAPI();
    APISecret = ПолучитьСекретAPI();

    Соединение = Новый HTTPСоединение(
        "kmo24-backend.onrender.com",
        443,
        ,
        ,
        ,
        0,
        Новый ЗащищенноеСоединениеOpenSSL()
    );

    Заголовки = Новый Соответствие;
    Заголовки.Вставить("X-API-Key", APIKey);
    Заголовки.Вставить("X-API-Secret", APISecret);
    Заголовки.Вставить("Content-Type", "application/json");

    Запрос = Новый HTTPЗапрос("/api/v1/integration/1c/orders/new");
    Запрос.Заголовки = Заголовки;

    Ответ = Соединение.Получить(Запрос);

    Если Ответ.КодСостояния = 200 Тогда
        ЧтениеJSON = Новый ЧтениеJSON;
        ЧтениеJSON.УстановитьСтроку(Ответ.ПолучитьТелоКакСтроку());
        Данные = ПрочитатьJSON(ЧтениеJSON);
        Возврат Данные.data;
    Иначе
        ВызватьИсключение "Ошибка получения заказов: " + Ответ.КодСостояния;
    КонецЕсли;

КонецФункции

Процедура СинхронизироватьТовары(МассивТоваров) Экспорт

    АдресСервиса = "https://kmo24-backend.onrender.com/api/v1";
    APIKey = ПолучитьКлючAPI();
    APISecret = ПолучитьСекретAPI();

    Соединение = Новый HTTPСоединение(
        "kmo24-backend.onrender.com",
        443,
        ,
        ,
        ,
        0,
        Новый ЗащищенноеСоединениеOpenSSL()
    );

    Заголовки = Новый Соответствие;
    Заголовки.Вставить("X-API-Key", APIKey);
    Заголовки.Вставить("X-API-Secret", APISecret);
    Заголовки.Вставить("Content-Type", "application/json");

    ДанныеJSON = Новый Структура;
    ДанныеJSON.Вставить("products", МассивТоваров);

    ЗаписьJSON = Новый ЗаписьJSON;
    ЗаписьJSON.УстановитьСтроку();
    ЗаписатьJSON(ЗаписьJSON, ДанныеJSON);
    ТелоЗапроса = ЗаписьJSON.Закрыть();

    Запрос = Новый HTTPЗапрос("/api/v1/integration/1c/products/sync");
    Запрос.Заголовки = Заголовки;
    Запрос.УстановитьТелоИзСтроки(ТелоЗапроса);

    Ответ = Соединение.ОтправитьДляОбработки(Запрос);

    Если Ответ.КодСостояния = 200 Тогда
        Сообщить("Товары успешно синхронизированы");
    Иначе
        ВызватьИсключение "Ошибка синхронизации: " + Ответ.КодСостояния;
    КонецЕсли;

КонецПроцедуры
```

---

## Коды ошибок

| Код | Описание | Решение |
|-----|----------|---------|
| 400 | Bad Request | Проверьте формат данных в запросе |
| 401 | Unauthorized | Проверьте API Key и Secret |
| 403 | Forbidden | У API ключа недостаточно прав |
| 404 | Not Found | Проверьте URL endpoint |
| 422 | Validation Error | Проверьте обязательные поля |
| 429 | Too Many Requests | Превышен лимит запросов, подождите |
| 500 | Internal Server Error | Свяжитесь с поддержкой |

### Формат ошибки

```json
{
  "success": false,
  "error": "Описание ошибки",
  "details": {
    "field": "Конкретное поле с ошибкой",
    "message": "Детальное сообщение"
  }
}
```

---

## Рекомендации по интеграции

### 1. Частота синхронизации

- **Товары и категории:** 1-2 раза в день (полная синхронизация)
- **Остатки:** Каждые 15-30 минут
- **Цены:** При изменении или 1 раз в час
- **Заказы:** Каждые 5-10 минут

### 2. Обработка ошибок

- Реализуйте повторные попытки с экспоненциальной задержкой
- Логируйте все ошибки для анализа
- При массовых операциях обрабатывайте частичные ошибки

### 3. Оптимизация

- Отправляйте товары пакетами по 50-100 штук
- Используйте сжатие (gzip) для больших запросов
- Кешируйте список категорий

### 4. Безопасность

- Храните API ключи в безопасном месте
- Используйте HTTPS для всех запросов
- Регулярно ротируйте API ключи
- Ограничьте доступ к API ключам по IP

---

## Поддержка

При возникновении вопросов или проблем:

- Email: support@kmo24.ru
- Телефон: +7 (XXX) XXX-XX-XX
- Документация: https://kmo24.ru/docs

---

**Версия документа:** 1.0
**Дата обновления:** 25.11.2024
