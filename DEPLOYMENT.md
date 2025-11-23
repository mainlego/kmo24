# Развертывание проекта КМО24 на Render.com

Это руководство поможет вам развернуть полнофункциональный интернет-магазин КМО24 на платформе Render.com.

## Архитектура

Проект состоит из трех основных сервисов:

1. **Backend API** (Node.js/Express)
   - RESTful API для обработки запросов
   - Интеграция с MongoDB Atlas
   - Интеграция с Redis для кеширования
   - Обработка файлов (загрузка изображений)

2. **Frontend** (Nuxt.js 3 SSR)
   - Серверный рендеринг для лучшего SEO
   - Статическая генерация для быстрой загрузки
   - Адаптивный дизайн

3. **Redis Cache**
   - Кеширование данных
   - Сессии пользователей

## Предварительные требования

### 1. MongoDB Atlas
База данных уже настроена:
- URI: `mongodb+srv://omlineadmin:5MOHI036wc4yf3vh@kmo24.e0o4igm.mongodb.net/kmo24`
- Убедитесь, что IP-адреса Render.com добавлены в белый список в MongoDB Atlas

### 2. Аккаунт Render.com
- Зарегистрируйтесь на [Render.com](https://render.com)
- Подключите ваш GitHub репозиторий

## Автоматическое развертывание с помощью Blueprint

### Шаг 1: Подготовка репозитория

Файл `render.yaml` уже создан в корне проекта и содержит всю необходимую конфигурацию.

### Шаг 2: Создание нового проекта на Render

1. Войдите в свой аккаунт Render.com
2. Нажмите **"New +"** → **"Blueprint"**
3. Подключите ваш GitHub репозиторий
4. Render автоматически обнаружит файл `render.yaml`
5. Нажмите **"Apply"**

### Шаг 3: Настройка переменных окружения

Render автоматически создаст большинство переменных окружения, но проверьте следующие:

#### Backend Environment Variables
- `MONGODB_URI` - ✅ Уже настроено
- `JWT_SECRET` - ✅ Автоматически генерируется
- `JWT_REFRESH_SECRET` - ✅ Автоматически генерируется
- `CORS_ORIGIN` - ✅ Автоматически связывается с frontend
- `DL_API_KEY` - ✅ API ключ Деловых Линий (уже в blueprint)

Дополнительные переменные (опционально):
- `TELEGRAM_BOT_TOKEN` - для уведомлений в Telegram
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` - для отправки email
- `1C_API_URL`, `1C_API_USERNAME`, `1C_API_PASSWORD` - для интеграции с 1С

#### Frontend Environment Variables
- `NUXT_PUBLIC_API_BASE_URL` - ✅ Автоматически связывается с backend
- `NUXT_PUBLIC_SITE_URL` - ✅ Автоматически устанавливается

### Шаг 4: Настройка Redis

Redis автоматически создается через blueprint. После создания:

1. Перейдите в настройки Backend сервиса
2. Найдите переменную окружения `REDIS_URL`
3. Добавьте её, связав с созданным Redis сервисом:
   - Нажмите **"Add Environment Variable"**
   - Name: `REDIS_URL`
   - Value: выберите **"From Service"** → `kmo24-redis` → `Redis Connection String`

### Шаг 5: Настройка загрузки файлов

Backend использует постоянное хранилище для загруженных файлов:
- Диск: 10 GB
- Mount Path: `/var/data/uploads`
- Это уже настроено в blueprint

### Шаг 6: Проверка развертывания

После завершения развертывания (обычно 5-10 минут):

1. **Backend Health Check**
   ```bash
   curl https://kmo24-backend.onrender.com/health
   ```
   Ожидаемый ответ:
   ```json
   {
     "status": "OK",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "uptime": 123.45,
     "environment": "production"
   }
   ```

2. **Frontend**
   Откройте URL вашего frontend сервиса в браузере

3. **API Endpoint Test**
   ```bash
   curl https://kmo24-backend.onrender.com/api/v1
   ```

## Ручное развертывание (альтернативный метод)

Если вы предпочитаете настраивать сервисы вручную:

### Backend API

1. **New Web Service**
   - Name: `kmo24-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Plan: Starter (или выше)

2. **Environment Variables** (скопируйте из `backend/.env.example`)

3. **Disk** (для uploads)
   - Name: `uploads`
   - Mount Path: `/var/data/uploads`
   - Size: 10 GB

### Frontend

1. **New Static Site**
   - Name: `kmo24-frontend`
   - Build Command: `cd frontend && npm install && npm run generate`
   - Publish Directory: `frontend/.output/public`

2. **Environment Variables**
   - `NUXT_PUBLIC_API_BASE_URL`: URL вашего backend сервиса
   - `NUXT_PUBLIC_SITE_URL`: URL вашего frontend сервиса

3. **Rewrite Rules**
   - Source: `/*`
   - Destination: `/index.html`

### Redis

1. **New Redis Instance**
   - Name: `kmo24-redis`
   - Plan: Starter
   - Maxmemory Policy: `allkeys-lru`

## Настройка домена

### Backend API

1. Перейдите в настройки Backend сервиса
2. **Settings** → **Custom Domain**
3. Добавьте ваш домен (например, `api.kmo24.ru`)
4. Настройте DNS записи согласно инструкциям Render

### Frontend

1. Перейдите в настройки Frontend сервиса
2. **Settings** → **Custom Domain**
3. Добавьте ваш домен (например, `kmo24.ru`)
4. Настройте DNS записи

### Обновление CORS

После настройки домена обновите переменную `CORS_ORIGIN` в backend:
```
CORS_ORIGIN=https://kmo24.ru,https://www.kmo24.ru
```

## Мониторинг и логи

### Просмотр логов

1. Перейдите в Dashboard вашего сервиса
2. Нажмите **"Logs"**
3. Фильтруйте по уровню (info, warn, error)

### Метрики

Render предоставляет встроенные метрики:
- CPU usage
- Memory usage
- Request latency
- Error rates

### Алерты

Настройте алерты для:
- Высокого использования CPU/памяти
- Ошибок развертывания
- Downtime

## Автоматическое развертывание

Render автоматически пересобирает сервисы при push в ветку `main`:

1. Commit ваши изменения
2. Push в GitHub
3. Render автоматически обнаружит изменения
4. Начнется автоматическое развертывание

Для отключения автоматического развертывания:
- Settings → Auto-Deploy → Off

## Масштабирование

### Вертикальное масштабирование

Upgrade планов для большей производительности:
- Starter: $7/month - 512 MB RAM
- Standard: $25/month - 2 GB RAM
- Pro: $85/month - 8 GB RAM

### Горизонтальное масштабирование

Для backend можно создать несколько инстансов:
- Settings → Instance Count → 2+
- Render автоматически балансирует нагрузку

## Резервное копирование

### MongoDB Atlas

1. Настройте автоматические backup в MongoDB Atlas
2. Настройте расписание (ежедневно/еженедельно)
3. Тестируйте восстановление из backup

### Загруженные файлы

Рекомендуется настроить периодический backup диска:
- Используйте S3/R2 для хранения файлов в production
- Настройте cron job для синхронизации

## Оптимизация производительности

### Кеширование

- Redis уже настроен для кеширования
- Кешируются: товары, категории, результаты API

### CDN

Для статических файлов frontend:
1. Включите Cloudflare или другой CDN
2. Настройте кеширование для `/_nuxt/*`

### Database Indexes

Убедитесь, что в MongoDB созданы индексы:
```javascript
// Products
db.products.createIndex({ name: "text", description: "text" })
db.products.createIndex({ category: 1, price: 1 })

// Orders
db.orders.createIndex({ userId: 1, createdAt: -1 })
db.orders.createIndex({ status: 1 })
```

## Безопасность

### Checklist

- ✅ HTTPS включен автоматически
- ✅ Переменные окружения защищены
- ⚠️ Измените JWT_SECRET и JWT_REFRESH_SECRET в production
- ⚠️ Настройте rate limiting в API
- ⚠️ Включите Helmet middleware (уже в коде)
- ⚠️ Регулярно обновляйте зависимости

### MongoDB Atlas Security

1. IP Whitelist: добавьте только IP Render.com
2. Database User: используйте пользователя с минимальными правами
3. Включите аудит логи

## Troubleshooting

### Backend не запускается

1. Проверьте логи: есть ли ошибки подключения к MongoDB?
2. Проверьте переменные окружения
3. Убедитесь, что IP Render добавлен в MongoDB Atlas whitelist

### Frontend не подключается к Backend

1. Проверьте `NUXT_PUBLIC_API_BASE_URL`
2. Проверьте CORS настройки в backend
3. Проверьте логи backend на наличие CORS ошибок

### Загрузка файлов не работает

1. Проверьте, что диск mounted правильно
2. Проверьте права доступа к `/var/data/uploads`
3. Проверьте размер файла (лимит 10 MB по умолчанию)

### Redis connection errors

1. Проверьте переменную `REDIS_URL`
2. Убедитесь, что Redis сервис запущен
3. Проверьте сетевое соединение между сервисами

## Контакты и поддержка

- Render Documentation: https://render.com/docs
- MongoDB Atlas Support: https://www.mongodb.com/cloud/atlas/support
- GitHub Issues: создайте issue в репозитории проекта

## Полезные команды

### Локальная разработка с production базой

```bash
# Backend
cd backend
cp .env.example .env
# Отредактируйте .env с production credentials
npm install
npm run dev

# Frontend
cd frontend
cp .env.example .env
# Отредактируйте .env
npm install
npm run dev
```

### Тестирование production сборки локально

```bash
# Backend
cd backend
NODE_ENV=production npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Обновление версий

### Backend

```bash
cd backend
npm update
npm audit fix
git add package.json package-lock.json
git commit -m "chore: update backend dependencies"
git push
```

### Frontend

```bash
cd frontend
npm update
npm audit fix
git add package.json package-lock.json
git commit -m "chore: update frontend dependencies"
git push
```

---

**Последнее обновление:** 2025-01-23
**Версия:** 1.0.0
