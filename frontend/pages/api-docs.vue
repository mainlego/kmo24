<template>
  <div class="api-docs">
    <div class="container">
      <div class="docs-header">
        <h1>API Documentation для интеграции с 1С</h1>
        <p class="subtitle">Полная документация по REST API для синхронизации с 1С:Предприятие</p>
      </div>

      <div class="docs-content">
        <!-- Общая информация -->
        <section class="docs-section">
          <h2>🔐 Аутентификация</h2>
          <div class="info-box">
            <p>Все запросы к API должны содержать заголовок с API ключом:</p>
            <code class="code-block">X-API-Key: YOUR_API_KEY_HERE</code>
            <p class="mt-2">API ключи выдаются администратором системы.</p>
          </div>
        </section>

        <!-- Base URL -->
        <section class="docs-section">
          <h2>🌐 Base URL</h2>
          <div class="info-box">
            <code class="code-block">https://kmo24-backend.onrender.com/api/v1</code>
          </div>
        </section>

        <!-- Товары -->
        <section class="docs-section">
          <h2>📦 Товары (Products)</h2>

          <div class="endpoint">
            <h3>Получить список товаров</h3>
            <div class="endpoint-details">
              <span class="method get">GET</span>
              <code>/products</code>
            </div>
            <div class="params">
              <h4>Query параметры:</h4>
              <ul>
                <li><code>page</code> - номер страницы (default: 1)</li>
                <li><code>limit</code> - количество на странице (default: 20)</li>
                <li><code>category</code> - ID категории</li>
                <li><code>search</code> - поиск по названию</li>
              </ul>
            </div>
            <div class="response">
              <h4>Пример ответа:</h4>
              <pre class="code-block">{{ productsResponse }}</pre>
            </div>
          </div>

          <div class="endpoint">
            <h3>Создать/обновить товар</h3>
            <div class="endpoint-details">
              <span class="method post">POST</span>
              <code>/products</code>
            </div>
            <div class="params">
              <h4>Body (JSON):</h4>
              <pre class="code-block">{{ productCreateBody }}</pre>
            </div>
          </div>

          <div class="endpoint">
            <h3>Обновить остатки</h3>
            <div class="endpoint-details">
              <span class="method patch">PATCH</span>
              <code>/products/:sku/stock</code>
            </div>
            <div class="params">
              <h4>Body (JSON):</h4>
              <pre class="code-block">{{ stockUpdateBody }}</pre>
            </div>
          </div>
        </section>

        <!-- Категории -->
        <section class="docs-section">
          <h2>📂 Категории (Categories)</h2>

          <div class="endpoint">
            <h3>Получить дерево категорий</h3>
            <div class="endpoint-details">
              <span class="method get">GET</span>
              <code>/categories</code>
            </div>
            <div class="response">
              <h4>Пример ответа:</h4>
              <pre class="code-block">{{ categoriesResponse }}</pre>
            </div>
          </div>

          <div class="endpoint">
            <h3>Создать категорию</h3>
            <div class="endpoint-details">
              <span class="method post">POST</span>
              <code>/categories</code>
            </div>
            <div class="params">
              <h4>Body (JSON):</h4>
              <pre class="code-block">{{ categoryCreateBody }}</pre>
            </div>
          </div>
        </section>

        <!-- Заказы -->
        <section class="docs-section">
          <h2>🛒 Заказы (Orders)</h2>

          <div class="endpoint">
            <h3>Получить новые заказы</h3>
            <div class="endpoint-details">
              <span class="method get">GET</span>
              <code>/orders?status=pending</code>
            </div>
            <div class="response">
              <h4>Пример ответа:</h4>
              <pre class="code-block">{{ ordersResponse }}</pre>
            </div>
          </div>

          <div class="endpoint">
            <h3>Обновить статус заказа</h3>
            <div class="endpoint-details">
              <span class="method patch">PATCH</span>
              <code>/orders/:id/status</code>
            </div>
            <div class="params">
              <h4>Body (JSON):</h4>
              <pre class="code-block">{{ orderStatusBody }}</pre>
            </div>
          </div>
        </section>

        <!-- Цены -->
        <section class="docs-section">
          <h2>💰 Цены (Prices)</h2>

          <div class="endpoint">
            <h3>Массовое обновление цен</h3>
            <div class="endpoint-details">
              <span class="method post">POST</span>
              <code>/products/bulk-price-update</code>
            </div>
            <div class="params">
              <h4>Body (JSON):</h4>
              <pre class="code-block">{{ pricesUpdateBody }}</pre>
            </div>
          </div>
        </section>

        <!-- Интеграция 1С -->
        <section class="docs-section">
          <h2>🔄 Специальные методы для 1С</h2>

          <div class="endpoint">
            <h3>Полная синхронизация</h3>
            <div class="endpoint-details">
              <span class="method post">POST</span>
              <code>/integration/1c/sync</code>
            </div>
            <div class="params">
              <h4>Body (JSON):</h4>
              <pre class="code-block">{{ syncBody }}</pre>
            </div>
          </div>

          <div class="endpoint">
            <h3>Получить изменения с даты</h3>
            <div class="endpoint-details">
              <span class="method get">GET</span>
              <code>/integration/1c/changes?since=2024-01-01T00:00:00Z</code>
            </div>
          </div>
        </section>

        <!-- Коды ответов -->
        <section class="docs-section">
          <h2>📊 Коды ответов</h2>
          <div class="info-box">
            <table class="status-table">
              <thead>
                <tr>
                  <th>Код</th>
                  <th>Описание</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="status success">200</span></td>
                  <td>Успешный запрос</td>
                </tr>
                <tr>
                  <td><span class="status success">201</span></td>
                  <td>Ресурс создан</td>
                </tr>
                <tr>
                  <td><span class="status warning">400</span></td>
                  <td>Некорректный запрос</td>
                </tr>
                <tr>
                  <td><span class="status warning">401</span></td>
                  <td>Требуется авторизация</td>
                </tr>
                <tr>
                  <td><span class="status warning">404</span></td>
                  <td>Ресурс не найден</td>
                </tr>
                <tr>
                  <td><span class="status danger">500</span></td>
                  <td>Внутренняя ошибка сервера</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Примеры кода -->
        <section class="docs-section">
          <h2>💻 Примеры кода для 1С</h2>

          <div class="code-example">
            <h3>Пример запроса из 1С</h3>
            <pre class="code-block language-1c">{{ oneCExample }}</pre>
          </div>
        </section>

        <!-- Контакты -->
        <section class="docs-section">
          <h2>📞 Поддержка</h2>
          <div class="info-box">
            <p>По вопросам интеграции обращайтесь:</p>
            <ul>
              <li>Email: api@kmo24.ru</li>
              <li>Телефон: +7 (800) 555-35-35</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
// Примеры для документации
const productsResponse = `{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Сковорода электрическая Kogast",
      "sku": "KOGAST-EKP-T7-40SL",
      "price": 49000,
      "stock": {
        "available": 2,
        "reserved": 0
      },
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Тепловое оборудование"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100
  }
}`;

const productCreateBody = `{
  "name": "Холодильник Polair",
  "sku": "POLAIR-CM105-S",
  "price": 35000,
  "stock": {
    "quantity": 5
  },
  "category": "507f1f77bcf86cd799439012",
  "description": {
    "short": "Холодильный шкаф",
    "full": "Профессиональный холодильный шкаф..."
  }
}`;

const stockUpdateBody = `{
  "quantity": 10,
  "operation": "set" // или "increment"
}`;

const categoriesResponse = `{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Тепловое оборудование",
      "slug": "teplovoe",
      "children": []
    }
  ]
}`;

const categoryCreateBody = `{
  "name": "Холодильное оборудование",
  "description": "Холодильники и морозильники",
  "parent": null
}`;

const ordersResponse = `{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "orderNumber": "241125-0001",
      "status": "pending",
      "customer": {
        "firstName": "Иван",
        "lastName": "Иванов",
        "email": "ivan@example.com",
        "phone": "+79001234567"
      },
      "items": [
        {
          "product": "507f1f77bcf86cd799439011",
          "name": "Сковорода Kogast",
          "quantity": 1,
          "price": 49000
        }
      ],
      "pricing": {
        "subtotal": 49000,
        "shipping": 500,
        "total": 49500
      }
    }
  ]
}`;

const orderStatusBody = `{
  "status": "processing",
  "comment": "Заказ принят в обработку"
}`;

const pricesUpdateBody = `{
  "prices": [
    {
      "sku": "KOGAST-EKP-T7-40SL",
      "price": 52000,
      "oldPrice": 65000
    },
    {
      "sku": "POLAIR-CM105-S",
      "price": 38000
    }
  ]
}`;

const syncBody = `{
  "products": [...],
  "categories": [...],
  "prices": [...],
  "stocks": [...]
}`;

const oneCExample = `Процедура ОтправитьЗапросAPI()

    HTTPСоединение = Новый HTTPСоединение(
        "kmo24-backend.onrender.com",
        443,
        Истина // HTTPS
    );

    HTTPЗапрос = Новый HTTPЗапрос("/api/v1/products");
    HTTPЗапрос.Заголовки.Вставить("X-API-Key", "YOUR_API_KEY");
    HTTPЗапрос.Заголовки.Вставить("Content-Type", "application/json");

    HTTPОтвет = HTTPСоединение.Получить(HTTPЗапрос);

    Если HTTPОтвет.КодСостояния = 200 Тогда
        ЧтениеJSON = Новый ЧтениеJSON;
        ЧтениеJSON.УстановитьСтроку(HTTPОтвет.ПолучитьТелоКакСтроку());
        Данные = ПрочитатьJSON(ЧтениеJSON);

        // Обработка полученных данных
        Для Каждого Товар Из Данные.data Цикл
            // Обновление номенклатуры в 1С
        КонецЦикла;
    КонецЕсли;

КонецПроцедуры`;

// SEO
useHead({
  title: 'API Documentation - КМО24',
  meta: [
    { name: 'description', content: 'Документация по REST API для интеграции с 1С:Предприятие' }
  ]
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.api-docs {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  padding: 2rem 0 4rem;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .docs-header {
    text-align: center;
    margin-bottom: 3rem;

    h1 {
      font-size: 2.5rem;
      font-weight: bold;
      color: $gray-900;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1.25rem;
      color: $gray-600;
    }
  }

  .docs-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }

  .docs-section {
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;

    &:last-child {
      border-bottom: none;
    }

    h2 {
      font-size: 1.75rem;
      font-weight: bold;
      color: $gray-900;
      margin-bottom: 1.5rem;
    }
  }

  .info-box {
    background: #f3f4f6;
    border-radius: 8px;
    padding: 1.5rem;

    p {
      margin: 0.5rem 0;
      color: $gray-700;
    }

    ul {
      margin: 1rem 0;
      padding-left: 1.5rem;

      li {
        color: $gray-700;
        margin: 0.5rem 0;
      }
    }
  }

  .endpoint {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: $gray-900;
      margin-bottom: 1rem;
    }

    .endpoint-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;

      .method {
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-weight: bold;
        font-size: 0.875rem;

        &.get {
          background: #10b981;
          color: white;
        }

        &.post {
          background: #3b82f6;
          color: white;
        }

        &.patch {
          background: #f59e0b;
          color: white;
        }

        &.delete {
          background: #ef4444;
          color: white;
        }
      }

      code {
        background: #f3f4f6;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-family: monospace;
        flex: 1;
      }
    }
  }

  .params, .response {
    margin-top: 1rem;

    h4 {
      font-size: 1rem;
      font-weight: 600;
      color: $gray-700;
      margin-bottom: 0.5rem;
    }

    ul {
      margin-left: 1.5rem;

      li {
        margin: 0.5rem 0;
        color: $gray-600;

        code {
          background: #fef3c7;
          padding: 0.125rem 0.375rem;
          border-radius: 3px;
          font-family: monospace;
          font-size: 0.875rem;
        }
      }
    }
  }

  .code-block {
    display: block;
    background: #1f2937;
    color: #f3f4f6;
    padding: 1rem;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    overflow-x: auto;
    white-space: pre;
    margin: 0.5rem 0;

    &.language-1c {
      background: #2d3748;
    }
  }

  .status-table {
    width: 100%;
    margin-top: 1rem;

    thead {
      background: #f9fafb;

      th {
        text-align: left;
        padding: 0.75rem;
        font-weight: 600;
        color: $gray-700;
      }
    }

    tbody {
      tr {
        border-top: 1px solid #e5e7eb;

        td {
          padding: 0.75rem;
          color: $gray-600;

          .status {
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.875rem;

            &.success {
              background: #d1fae5;
              color: #065f46;
            }

            &.warning {
              background: #fed7aa;
              color: #92400e;
            }

            &.danger {
              background: #fee2e2;
              color: #991b1b;
            }
          }
        }
      }
    }
  }

  .code-example {
    margin-top: 1.5rem;

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: $gray-800;
      margin-bottom: 1rem;
    }
  }

  .mt-2 {
    margin-top: 0.5rem;
  }
}

@media (max-width: 768px) {
  .api-docs {
    .docs-header h1 {
      font-size: 1.875rem;
    }

    .docs-content {
      padding: 1rem;
    }

    .endpoint-details {
      flex-direction: column;
      align-items: flex-start !important;

      code {
        width: 100%;
      }
    }
  }
}
</style>