# Руководство по запуску проекта

## Предварительные требования

Перед началом работы убедитесь, что у вас установлены:

- **Node.js** 18+ ([скачать](https://nodejs.org/))
- **MongoDB** 6+ ([скачать](https://www.mongodb.com/try/download/community))
- **Redis** 7+ ([скачать](https://redis.io/download))
- **Docker** и **Docker Compose** (опционально, [скачать](https://www.docker.com/get-started))

## Быстрый старт

### Вариант 1: Локальный запуск (без Docker)

#### 1. Установка зависимостей

```bash
# Установка зависимостей для всего проекта
npm install

# Или установка для каждого модуля отдельно
cd backend && npm install
cd ../frontend && npm install
```

#### 2. Настройка переменных окружения

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Отредактируйте `backend/.env`:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/onlineshop
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
```

Отредактируйте `frontend/.env`:
```env
NUXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 3. Запуск MongoDB и Redis

**MongoDB:**
```bash
# Windows
mongod --dbpath C:\data\db

# macOS/Linux
mongod --dbpath /data/db
```

**Redis:**
```bash
# Windows (через WSL или Redis для Windows)
redis-server

# macOS/Linux
redis-server
```

#### 4. Запуск приложения

**Вариант A: Запуск всего проекта одной командой**
```bash
# Из корневой директории
npm run dev
```

**Вариант B: Запуск Backend и Frontend отдельно**

В первом терминале (Backend):
```bash
cd backend
npm run dev
```

В втором терминале (Frontend):
```bash
cd frontend
npm run dev
```

#### 5. Открытие приложения

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1
- Health check: http://localhost:3001/health

---

### Вариант 2: Запуск с Docker Compose

#### 1. Настройка переменных окружения

Создайте файлы `.env` в директориях `backend` и `frontend` как описано выше.

Также создайте корневой `.env`:
```bash
cp .env.example .env
```

Отредактируйте `.env`:
```env
MONGO_PASSWORD=your_secure_mongo_password
REDIS_PASSWORD=your_secure_redis_password
```

#### 2. Запуск всех сервисов

```bash
docker-compose up -d
```

#### 3. Проверка статуса

```bash
# Просмотр запущенных контейнеров
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### 4. Остановка сервисов

```bash
# Остановка
docker-compose stop

# Остановка и удаление контейнеров
docker-compose down

# Остановка и удаление контейнеров + volumes
docker-compose down -v
```

---

## Структура проекта

```
onlineshop/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Конфигурация
│   │   ├── models/         # Mongoose модели
│   │   ├── routes/         # API роуты
│   │   ├── controllers/    # Контроллеры
│   │   ├── middleware/     # Middleware
│   │   ├── services/       # Бизнес-логика
│   │   ├── utils/          # Утилиты
│   │   └── index.js        # Точка входа
│   ├── logs/               # Логи
│   ├── uploads/            # Загруженные файлы
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/                # Frontend
│   ├── assets/             # Стили, изображения
│   ├── components/         # Vue компоненты
│   ├── composables/        # Composables
│   ├── layouts/            # Layouts
│   ├── pages/              # Страницы
│   ├── plugins/            # Плагины
│   ├── stores/             # Pinia stores
│   ├── utils/              # Утилиты
│   ├── Dockerfile
│   ├── nuxt.config.ts
│   ├── package.json
│   └── .env
├── nginx/                   # Nginx конфигурация
│   └── nginx.conf
├── docker-compose.yml
├── package.json
└── README.md
```

---

## Разработка

### Backend

#### Доступные команды

```bash
cd backend

# Разработка с hot-reload
npm run dev

# Запуск в production режиме
npm start

# Тесты
npm test
npm run test:watch

# Линтинг
npm run lint
npm run lint:fix
```

#### Создание нового API endpoint

1. Создайте модель в `src/models/`
2. Создайте контроллер в `src/controllers/`
3. Создайте роут в `src/routes/`
4. Подключите роут в `src/index.js`

#### Работа с MongoDB

```bash
# Подключение к MongoDB через CLI
mongosh mongodb://localhost:27017/onlineshop

# Просмотр коллекций
show collections

# Просмотр документов
db.users.find()
db.products.find()
```

#### Работа с Redis

```bash
# Подключение к Redis через CLI
redis-cli

# Просмотр всех ключей
KEYS *

# Получение значения
GET key_name

# Очистка кэша
FLUSHALL
```

---

### Frontend

#### Доступные команды

```bash
cd frontend

# Разработка с hot-reload
npm run dev

# Сборка для production
npm run build

# Preview production сборки
npm run preview

# Генерация статического сайта
npm run generate

# Type checking
npm run type-check

# Линтинг
npm run lint
npm run lint:fix
```

#### Создание новой страницы

1. Создайте файл в `pages/` (например, `pages/about.vue`)
2. Nuxt автоматически создаст роут `/about`

#### Создание компонента

1. Создайте файл в `components/` (например, `components/ProductCard.vue`)
2. Используйте компонент в любой странице без импорта: `<ProductCard />`

#### Работа со стилями

Стили используют SCSS с переменными:

```vue
<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.my-component {
  color: $primary;
  padding: $spacing-md;
}
</style>
```

---

## Тестирование

### Backend

```bash
cd backend

# Все тесты
npm test

# Тесты с покрытием
npm run test:coverage

# Watch mode
npm run test:watch
```

### Frontend

```bash
cd frontend

# Unit тесты
npm run test:unit

# E2E тесты
npm run test:e2e
```

---

## Production deployment

### Сборка проекта

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Docker production build

```bash
# Сборка образов
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Запуск в production режиме
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Troubleshooting

### MongoDB не запускается

**Проблема:** MongoDB не может запуститься

**Решение:**
```bash
# Проверьте, не запущен ли MongoDB уже
ps aux | grep mongod

# Создайте директорию для данных
mkdir -p /data/db
sudo chown -R $(whoami) /data/db
```

### Redis не подключается

**Проблема:** Ошибка подключения к Redis

**Решение:**
```bash
# Проверьте, запущен ли Redis
redis-cli ping
# Должен вернуть PONG

# Если нет, запустите Redis
redis-server
```

### Backend не запускается

**Проблема:** Backend выдает ошибки при запуске

**Решение:**
1. Проверьте файл `.env`
2. Убедитесь, что MongoDB и Redis запущены
3. Проверьте логи: `backend/logs/error.log`
4. Переустановите зависимости: `rm -rf node_modules && npm install`

### Frontend не собирается

**Проблема:** Ошибки при сборке Frontend

**Решение:**
1. Очистите кэш Nuxt: `rm -rf .nuxt .output`
2. Переустановите зависимости: `rm -rf node_modules && npm install`
3. Проверьте версию Node.js: `node -v` (должна быть 18+)

---

## Полезные ссылки

- [Node.js документация](https://nodejs.org/docs/)
- [Express.js документация](https://expressjs.com/)
- [Mongoose документация](https://mongoosejs.com/docs/)
- [Nuxt.js документация](https://nuxt.com/docs)
- [Vue.js документация](https://vuejs.org/guide/)
- [Pinia документация](https://pinia.vuejs.org/)
- [MongoDB документация](https://docs.mongodb.com/)
- [Redis документация](https://redis.io/docs/)

---

## Поддержка

Если возникли проблемы:

1. Проверьте раздел Troubleshooting выше
2. Просмотрите логи приложения
3. Создайте issue в репозитории проекта
