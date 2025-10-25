# FAQ - Часто задаваемые вопросы

## Общие вопросы

### Какие технологии используются в проекте?

**Backend:**
- Node.js 18+ с Express.js
- MongoDB для хранения данных
- Redis для кэширования
- JWT для аутентификации

**Frontend:**
- Nuxt.js 3 (Vue.js 3)
- Pinia для управления состоянием
- Tailwind CSS + SCSS для стилей
- TypeScript

**DevOps:**
- Docker и Docker Compose
- Nginx как reverse proxy

### Какие требования к системе для запуска проекта?

**Минимальные требования:**
- Node.js 18+
- 4 GB RAM
- 10 GB свободного места на диске
- MongoDB 6+
- Redis 7+

**Рекомендуемые требования:**
- Node.js 18 LTS
- 8 GB RAM
- 20 GB свободного места на диске
- SSD диск
- Docker установлен (опционально)

### Сколько времени займет полная разработка?

Согласно ТЗ: **4-6 недель** при работе 1-2 разработчиков.

**Разбивка по этапам:**
- Этап 1: Базовый функционал (1-2 недели)
- Этап 2: Интеграции (1-2 недели)
- Этап 3: Расширенный функционал (1-2 недели)
- Этап 4: Тестирование и оптимизация (1 неделя)
- Этап 5: Ребрендинг и дизайн (1 неделя)

---

## Установка и запуск

### Как установить проект?

**Windows:**
```bash
setup.bat
```

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**Вручную:**
```bash
# 1. Установка зависимостей
npm install

# 2. Создание .env файлов
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. Запуск
npm run dev
```

### Как запустить только Backend?

```bash
cd backend
npm install
npm run dev
```

Backend будет доступен на http://localhost:3001

### Как запустить только Frontend?

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен на http://localhost:3000

### Как запустить с Docker?

```bash
# 1. Создайте .env файлы
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Запустите Docker Compose
docker-compose up -d

# 3. Проверьте статус
docker-compose ps

# 4. Просмотр логов
docker-compose logs -f
```

### Не запускается MongoDB. Что делать?

**Проблема:** MongoDB не может запуститься

**Решения:**

1. **Создайте директорию для данных:**
```bash
# Windows
mkdir C:\data\db

# Linux/macOS
sudo mkdir -p /data/db
sudo chown -R $(whoami) /data/db
```

2. **Проверьте, не запущен ли MongoDB уже:**
```bash
# Windows
tasklist | findstr mongod

# Linux/macOS
ps aux | grep mongod
```

3. **Используйте Docker:**
```bash
docker-compose up -d mongodb
```

### Redis не подключается. Что делать?

**Проблема:** Ошибка подключения к Redis

**Решения:**

1. **Проверьте, запущен ли Redis:**
```bash
redis-cli ping
# Должен вернуть: PONG
```

2. **Запустите Redis:**
```bash
# Windows (требует WSL или Redis для Windows)
redis-server

# Linux/macOS
redis-server
```

3. **Используйте Docker:**
```bash
docker-compose up -d redis
```

### Ошибка "EADDRINUSE" при запуске. Что делать?

**Проблема:** Порт уже занят

**Решение:**

1. **Найдите процесс на порту:**
```bash
# Windows
netstat -ano | findstr :3001
netstat -ano | findstr :3000

# Linux/macOS
lsof -i :3001
lsof -i :3000
```

2. **Завершите процесс или измените порт в .env:**
```env
# backend/.env
PORT=3002

# frontend/.env (в nuxt.config.ts)
```

---

## Разработка

### Как создать новый API endpoint?

1. **Создайте контроллер** в `backend/src/controllers/`:
```javascript
// backend/src/controllers/example.js
export const getExample = async (req, res, next) => {
  try {
    res.json({ message: 'Example endpoint' });
  } catch (error) {
    next(error);
  }
};
```

2. **Создайте роут** в `backend/src/routes/`:
```javascript
// backend/src/routes/example.js
import express from 'express';
import { getExample } from '../controllers/example.js';

const router = express.Router();

router.get('/', getExample);

export default router;
```

3. **Подключите роут** в `backend/src/index.js`:
```javascript
import exampleRoutes from './routes/example.js';
app.use(`${API_PREFIX}/example`, exampleRoutes);
```

### Как создать новую страницу в Frontend?

1. **Создайте файл** в `frontend/pages/`:
```vue
<!-- frontend/pages/example.vue -->
<template>
  <div class="container">
    <h1>Example Page</h1>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Example Page',
});
</script>
```

Страница автоматически будет доступна на `/example`

### Как создать компонент?

1. **Создайте файл** в `frontend/components/`:
```vue
<!-- frontend/components/ExampleCard.vue -->
<template>
  <div class="card">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Props, logic
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.card {
  padding: $spacing-md;
  border-radius: $radius-lg;
}
</style>
```

2. **Используйте компонент** (импорт не нужен):
```vue
<template>
  <ExampleCard>
    Content here
  </ExampleCard>
</template>
```

### Как работать со стилями?

**Использование SCSS переменных:**
```vue
<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.my-class {
  color: $primary;
  padding: $spacing-md;
  border-radius: $radius-lg;
}
</style>
```

**Использование Tailwind CSS:**
```vue
<template>
  <div class="p-4 bg-blue-500 rounded-lg">
    Content
  </div>
</template>
```

### Как добавить новую модель в Backend?

1. **Создайте файл модели** в `backend/src/models/`:
```javascript
// backend/src/models/Example.js
import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // другие поля
}, {
  timestamps: true,
});

export default mongoose.model('Example', exampleSchema);
```

2. **Импортируйте модель** где нужно:
```javascript
import Example from '../models/Example.js';

const example = await Example.findById(id);
```

---

## Интеграции

### Как подключить 1С:Сервис?

1. **Настройте переменные окружения** в `backend/.env`:
```env
1C_API_URL=http://your-1c-server/api
1C_API_USERNAME=api_user
1C_API_PASSWORD=api_password
1C_SYNC_INTERVAL=1800000
```

2. **Создайте сервис** в `backend/src/services/oneC.js`
3. **Реализуйте методы** синхронизации согласно ТЗ

### Как подключить Telegram Bot?

1. **Создайте бота** через [@BotFather](https://t.me/BotFather)
2. **Получите токен** и ID канала
3. **Настройте** в `backend/.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=@your_channel
```

4. **Реализуйте сервис** в `backend/src/services/telegram.js`

### Как подключить транспортные компании?

1. **Получите API ключи** от ТК
2. **Настройте** в `backend/.env`:
```env
DL_API_KEY=your_dellin_key
PEK_API_KEY=your_pek_key
```

3. **Реализуйте сервисы** в `backend/src/services/delivery/`

---

## Безопасность

### Как защищен проект?

**Backend:**
- Helmet для HTTP заголовков безопасности
- CORS настроен
- Rate limiting
- MongoDB sanitization (защита от NoSQL injection)
- JWT токены
- Bcrypt для хеширования паролей
- Validation входных данных

**Frontend:**
- XSS защита через Vue.js
- CSRF защита
- Sanitization пользовательского ввода
- HTTPS в production

### Нужно ли что-то менять для production?

**Да, обязательно:**

1. **Смените секретные ключи:**
```env
JWT_SECRET=generate_strong_random_secret
JWT_REFRESH_SECRET=generate_another_strong_secret
```

2. **Настройте production БД:**
```env
NODE_ENV=production
MONGODB_URI=mongodb://production_host/db
```

3. **Настройте SSL сертификаты** для Nginx
4. **Включите HTTPS** для всех соединений
5. **Настройте firewall** и ограничьте доступ к БД
6. **Включите логирование** и мониторинг
7. **Настройте регулярные backup**

---

## Производительность

### Как оптимизировать производительность?

**Backend:**
- Используйте Redis кэширование
- Добавьте индексы в MongoDB
- Используйте pagination для больших списков
- Оптимизируйте запросы к БД
- Используйте connection pooling

**Frontend:**
- Используйте lazy loading для изображений
- Минимизируйте bundle size
- Используйте code splitting
- Оптимизируйте изображения (WebP)
- Включите SSR/SSG где возможно

### Какие метрики производительности нужно достичь?

Согласно ТЗ:
- ✅ Время загрузки главной: < 2 секунд
- ✅ Время отклика API: < 500 мс (95% запросов)
- ✅ Поддержка: до 1000 одновременных пользователей
- ✅ Доступность: 99.5% (SLA)
- ✅ Lighthouse Score: > 90

---

## Тестирование

### Как запустить тесты?

**Backend:**
```bash
cd backend
npm test
npm run test:watch
npm run test:coverage
```

**Frontend:**
```bash
cd frontend
npm run test:unit
npm run test:e2e
```

### Какие тесты нужно написать?

**Backend:**
- Unit тесты для моделей
- Unit тесты для контроллеров
- Integration тесты для API endpoints
- Тесты безопасности

**Frontend:**
- Unit тесты для компонентов
- Unit тесты для composables
- Unit тесты для stores
- E2E тесты для критических потоков

---

## Deployment

### Как задеплоить проект?

**Вариант 1: VPS/Dedicated сервер**
1. Установите Docker и Docker Compose
2. Склонируйте репозиторий
3. Настройте .env файлы
4. Запустите: `docker-compose up -d`
5. Настройте домен и SSL сертификаты

**Вариант 2: Облачные платформы**
- **Backend:** Railway, Render, Heroku
- **Frontend:** Vercel, Netlify, Cloudflare Pages
- **БД:** MongoDB Atlas, Redis Cloud

### Как настроить SSL сертификаты?

**С Let's Encrypt (бесплатно):**
```bash
# 1. Установите certbot
sudo apt install certbot

# 2. Получите сертификат
sudo certbot certonly --webroot \
  -w /var/www/certbot \
  -d yourdomain.com

# 3. Обновите nginx.conf с путями к сертификатам
```

### Нужны ли CDN?

**Да, рекомендуется** для:
- Статических файлов (изображения, CSS, JS)
- Загруженных файлов пользователей
- Видео контента

**Популярные CDN:**
- Cloudflare (бесплатный план)
- Amazon CloudFront
- Fastly

---

## Поддержка

### Где получить помощь?

1. Прочитайте документацию проекта
2. Проверьте FAQ (этот файл)
3. Создайте issue в репозитории
4. Напишите команде разработки

### Как сообщить об ошибке?

1. Создайте issue в GitHub
2. Опишите проблему подробно
3. Приложите скриншоты/логи
4. Укажите версию Node.js и ОС

### Стоимость поддержки?

Согласно ТЗ:
- Гарантийная поддержка: включена в стоимость проекта
- Постгарантийная поддержка: **15,000 руб/месяц**

---

## Дополнительные вопросы

### Можно ли использовать другую БД вместо MongoDB?

Да, но потребуется:
- Переписать все модели
- Изменить ORM (например, на Prisma для PostgreSQL)
- Обновить конфигурацию
- Протестировать все функции

### Можно ли использовать другой фреймворк вместо Nuxt?

Да, можно использовать:
- Next.js (React)
- SvelteKit (Svelte)
- Remix (React)

Но потребуется полная переработка Frontend.

### Есть ли мобильное приложение?

Нет, проект включает только веб-версию. Мобильное приложение может быть разработано отдельно с использованием:
- React Native
- Flutter
- Native iOS/Android

Backend API можно использовать тот же самый.

---

**Последнее обновление:** 25 октября 2025
