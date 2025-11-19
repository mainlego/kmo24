# 🚀 Быстрый старт интеграции с 1С

## ✅ Статус: Готово к использованию!

Вся инфраструктура для интеграции с 1С **УЖЕ РЕАЛИЗОВАНА**. Осталось только создать API ключ и настроить 1С.

---

## 📝 Что уже готово

- ✅ **9 API endpoints** для обмена данными (товары, категории, остатки, цены, заказы)
- ✅ **Аутентификация** по API ключам (X-API-Key + X-API-Secret)
- ✅ **Безопасность**: IP whitelist, rate limiting, permissions
- ✅ **Логирование** всех запросов
- ✅ **Модели данных** с поддержкой externalId для связи с 1С
- ✅ **Маршруты подключены** в index.js

---

## 🎯 Быстрый старт за 3 шага

### Шаг 1: Создайте API ключ

```bash
cd backend
node scripts/createApiKey.js
```

Вы получите:
```
API Key: kmo24_a1b2c3d4e5f6...
API Secret: s3cr3t_xyz123...
```

⚠️ **ВАЖНО:** Сохраните Secret! Он показывается только один раз.

### Шаг 2: Протестируйте API

```bash
# Health check
curl -X GET http://localhost:5000/api/v1/integration/1c/health \
  -H "X-API-Key: kmo24_..." \
  -H "X-API-Secret: s3cr3t_..."

# Создайте тестовую категорию
curl -X POST http://localhost:5000/api/v1/integration/1c/categories/sync \
  -H "X-API-Key: kmo24_..." \
  -H "X-API-Secret: s3cr3t_..." \
  -H "Content-Type: application/json" \
  -d '{
    "categories": [{
      "externalId": "test-001",
      "name": "Тест",
      "slug": "test"
    }]
  }'

# Создайте тестовый товар
curl -X POST http://localhost:5000/api/v1/integration/1c/products/sync \
  -H "X-API-Key: kmo24_..." \
  -H "X-API-Secret: s3cr3t_..." \
  -H "Content-Type: application/json" \
  -d '{
    "products": [{
      "externalId": "prod-001",
      "name": "Тестовый товар",
      "sku": "TEST-001",
      "price": 100,
      "stock": {"quantity": 10},
      "category": "test-001"
    }]
  }'
```

### Шаг 3: Настройте 1С

Добавьте в 1С константы:
- `KMO24_API_URL` = `http://your-domain.com/api/v1/integration/1c`
- `KMO24_API_KEY` = ваш API ключ
- `KMO24_API_SECRET` = ваш API secret

Используйте пример кода из полной документации.

---

## 📡 Доступные endpoints

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/products/sync` | POST | Создание/обновление товаров |
| `/categories/sync` | POST | Создание/обновление категорий |
| `/stock/update` | POST | Обновление остатков |
| `/prices/update` | POST | Обновление цен |
| `/orders/new` | GET | Получение новых заказов |
| `/orders/:id/status` | POST | Обновление статуса заказа |
| `/orders/mark-exported` | POST | Отметить заказы как выгруженные |
| `/health` | GET | Проверка работоспособности |
| `/stats` | GET | Статистика интеграции |

---

## 🔐 Формат запросов

Все запросы требуют заголовки:
```http
X-API-Key: kmo24_a1b2c3d4e5f6...
X-API-Secret: s3cr3t_xyz123...
Content-Type: application/json
```

---

## 📊 Структура данных

### Товар
```json
{
  "externalId": "1c-product-123",
  "name": "Название товара",
  "sku": "ART-001",
  "price": 100.00,
  "oldPrice": 120.00,
  "stock": {
    "quantity": 50
  },
  "category": "1c-category-456",
  "description": {
    "short": "Краткое описание",
    "full": "Полное описание"
  },
  "specifications": [
    {"name": "Длина", "value": "50", "unit": "мм"}
  ]
}
```

### Категория
```json
{
  "externalId": "1c-category-456",
  "name": "Название категории",
  "slug": "category-slug",
  "description": "Описание",
  "parent": null,
  "sortOrder": 1
}
```

---

## 📖 Полная документация

См. [INTEGRATION_1C.md](./INTEGRATION_1C.md) для:
- Подробных примеров всех endpoints
- Кода для 1С
- Настройки расписания синхронизации
- Мониторинга и отладки
- Решения типичных проблем

---

## 🆘 Помощь

**Проблемы с аутентификацией?**
- Проверьте, что оба заголовка (X-API-Key и X-API-Secret) присутствуют
- Убедитесь, что ключ скопирован полностью

**Ошибка "IP address not whitelisted"?**
- Либо добавьте IP сервера 1С в ipWhitelist
- Либо оставьте ipWhitelist пустым массивом `[]`

**Товары не создаются?**
- Проверьте, что категория с указанным externalId существует
- Создайте сначала категорию, затем товар

---

**Готово к использованию! 🎉**
