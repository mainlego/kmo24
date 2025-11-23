# КМО24 - Комиссионный магазин оборудования

> Профессиональное б/у оборудование для кафе и ресторанов в Красноярске

[![Deploy to GitHub Pages](https://github.com/mainlego/kmo24/actions/workflows/deploy.yml/badge.svg)](https://github.com/mainlego/kmo24/actions/workflows/deploy.yml)
[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-3.19-00DC82.svg)](https://nuxt.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D.svg)](https://vuejs.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

## 🌐 Live Demo

**Посмотреть сайт:** [https://mainlego.github.io/kmo24/](https://mainlego.github.io/kmo24/)

## 📋 Содержание

- [О проекте](#о-проекте)
- [Возможности](#основные-возможности)
- [Технологический стек](#технологический-стек)
- [Быстрый старт](#быстрый-старт)
- [Документация](#документация)
- [Структура проекта](#структура-проекта)
- [Разработка](#разработка)
- [Тестирование](#тестирование)
- [Deployment](#deployment)
- [Лицензия](#лицензия)

---

## 🎯 О проекте

КМО24 - современный веб-сайт для комиссионного магазина профессионального оборудования. Специализируемся на реализации б/у пищевого и хлебопекарного оборудования для кафе и ресторанов в Красноярске.

**Статус:** ✅ В разработке
**Текущая версия:** 1.0.0

---

## ✨ Основные возможности

- 🔄 **Интеграция с 1С:Сервис** - автоматическая синхронизация товаров, остатков и заказов
- 🛒 **Интеллектуальная корзина** - сохранение между сессиями, валидация наличия
- 📦 **Расчет доставки** - интеграция с API Деловых Линий и ПЭК
- 📄 **Генерация КП** - автоматическое создание PDF коммерческих предложений
- 📱 **Telegram интеграция** - автоматическая публикация новостей из канала
- ⭐ **Система отзывов** - модерация, рейтинги, фотографии
- 🎨 **Адаптивный дизайн** - Mobile-first подход, работает на всех устройствах
- 🔐 **Безопасность** - JWT аутентификация, защита от основных уязвимостей
- 🚀 **Высокая производительность** - Redis кэширование, оптимизация запросов
- 🔍 **SEO оптимизация** - SSR, микроразметка, ЧПУ URL

---

## 🛠 Технологический стек

### Frontend
| Технология | Версия | Описание |
|-----------|--------|----------|
| **Nuxt.js** | 3.9 | Vue.js фреймворк с SSR |
| **Vue.js** | 3.4 | Progressive JavaScript Framework |
| **Pinia** | 2.1 | State Management |
| **TypeScript** | 5.3 | Типизация JavaScript |
| **Tailwind CSS** | 6.11 | Utility-first CSS |
| **SCSS/SASS** | 1.69 | CSS препроцессор |
| **Vite** | 5.0 | Быстрая сборка |

### Backend
| Технология | Версия | Описание |
|-----------|--------|----------|
| **Node.js** | 18 LTS+ | JavaScript runtime |
| **Express.js** | 4.18 | Web framework |
| **MongoDB Atlas** | 7.0 | Cloud NoSQL база данных |
| **Mongoose** | 8.0 | MongoDB ODM |
| **Redis** | 7.0 | In-memory кэш |
| **JWT** | 9.0 | Аутентификация |
| **Bcrypt** | 2.4 | Хеширование паролей |
| **Winston** | 3.11 | Логирование |

### DevOps & Infrastructure
| Технология | Описание |
|-----------|----------|
| **Render.com** | Cloud Platform для deployment |
| **MongoDB Atlas** | Cloud база данных |
| **Docker** | Контейнеризация |
| **Docker Compose** | Оркестрация контейнеров |
| **Nginx** | Reverse proxy |
| **Let's Encrypt** | SSL/TLS сертификаты |

---

## 🚀 Быстрый старт

### Автоматическая установка

**Windows:**
```bash
setup.bat
```

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

### Ручная установка

1️⃣ **Установите зависимости:**
```bash
npm install
```

2️⃣ **Создайте файлы конфигурации:**
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3️⃣ **Запустите MongoDB и Redis:**
```bash
# MongoDB
mongod

# Redis
redis-server
```

4️⃣ **Запустите приложение:**
```bash
npm run dev
```

5️⃣ **Откройте в браузере:**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:3001/api/v1
- ❤️ **Health Check:** http://localhost:3001/health

### 🐳 Запуск с Docker

```bash
# 1. Создайте .env файлы
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Запустите все сервисы
docker-compose up -d

# 3. Проверьте статус
docker-compose ps

# 4. Просмотр логов
docker-compose logs -f
```

---

## 📚 Документация

Вся документация проекта находится в корневой директории:

- 📖 **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Подробное руководство по установке и запуску
- 📊 **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Текущий статус проекта, что создано, что нужно доработать
- ❓ **[FAQ.md](./FAQ.md)** - Часто задаваемые вопросы и ответы
- 📝 **[ТЗ (Техническое задание)](./ТЗ.pdf)** - Полное техническое задание проекта

---

## 📁 Структура проекта

```
onlineshop/
├── 📁 backend/              # Backend API (Express.js + MongoDB)
│   ├── src/
│   │   ├── config/         # Конфигурация приложения
│   │   ├── models/         # Mongoose модели
│   │   ├── routes/         # API маршруты
│   │   ├── controllers/    # Контроллеры запросов
│   │   ├── middleware/     # Middleware (auth, validation)
│   │   ├── services/       # Бизнес-логика
│   │   ├── utils/          # Утилиты и хелперы
│   │   └── index.js        # Точка входа
│   ├── logs/               # Логи приложения
│   ├── uploads/            # Загруженные файлы
│   └── Dockerfile
│
├── 📁 frontend/             # Frontend (Nuxt.js 3 + Vue 3)
│   ├── assets/             # Стили, изображения
│   ├── components/         # Vue компоненты
│   ├── composables/        # Композаблы
│   ├── layouts/            # Layouts
│   ├── pages/              # Страницы (auto-routing)
│   ├── stores/             # Pinia stores
│   ├── plugins/            # Nuxt плагины
│   ├── utils/              # Утилиты
│   ├── app.vue             # Корневой компонент
│   ├── nuxt.config.ts      # Конфигурация Nuxt
│   └── Dockerfile
│
├── 📁 nginx/                # Конфигурация Nginx
│   └── nginx.conf
│
├── 📄 docker-compose.yml    # Docker Compose конфигурация
├── 📄 package.json          # Root package.json (workspaces)
├── 📄 setup.sh / setup.bat  # Скрипты установки
├── 📄 README.md             # Этот файл
├── 📄 GETTING_STARTED.md    # Руководство по запуску
├── 📄 PROJECT_STATUS.md     # Статус проекта
└── 📄 FAQ.md                # Часто задаваемые вопросы
```

---

## 💻 Разработка

### Backend

```bash
cd backend

# Разработка с hot-reload
npm run dev

# Production запуск
npm start

# Тесты
npm test

# Линтинг
npm run lint
```

### Frontend

```bash
cd frontend

# Разработка с hot-reload
npm run dev

# Сборка для production
npm run build

# Preview production сборки
npm run preview

# Type checking
npm run type-check
```

### Полезные команды

```bash
# Запуск всего проекта
npm run dev

# Сборка всего проекта
npm run build

# Просмотр логов Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# Подключение к MongoDB
mongosh mongodb://localhost:27017/onlineshop

# Подключение к Redis
redis-cli
```

---

## 🧪 Тестирование

### Backend тесты

```bash
cd backend

# Все тесты
npm test

# Тесты с покрытием
npm run test:coverage

# Watch mode
npm run test:watch
```

### Frontend тесты

```bash
cd frontend

# Unit тесты
npm run test:unit

# E2E тесты
npm run test:e2e
```

---

## 🚢 Deployment

### Render.com (Рекомендуется для Production)

Проект готов к автоматическому развертыванию на Render.com с использованием Blueprint:

1. **Создайте аккаунт на [Render.com](https://render.com)**
2. **Подключите GitHub репозиторий**
3. **New → Blueprint** - Render автоматически найдет `render.yaml`
4. **Apply** - автоматически создастся:
   - ✅ Backend API сервис (Node.js/Express)
   - ✅ Frontend SSR сервис (Node.js/Nuxt)
   - ✅ Redis для кеширования
   - ✅ Persistent disk для uploads (10GB)

📖 **Полная инструкция:** См. [DEPLOYMENT.md](./DEPLOYMENT.md) для детального руководства

### Production сборка (локально)

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Docker Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Требования к Production

**Безопасность:**
- ✅ Смените все секретные ключи в .env
- ✅ Настройте SSL/TLS сертификаты (автоматически на Render)
- ✅ Настройте firewall
- ✅ Ограничьте доступ к БД (MongoDB Atlas whitelist)
- ✅ Включите регулярные backup

**Производительность:**
- ✅ Настройте CDN для статики
- ✅ Оптимизируйте изображения
- ✅ Включите кэширование (Redis настроен)
- ✅ Мониторинг и логирование

---

## 📊 Метрики производительности

Согласно ТЗ необходимо достичь следующих показателей:

| Метрика | Целевое значение | Статус |
|---------|------------------|--------|
| Время загрузки главной | < 2 секунд | 🔄 В разработке |
| Время отклика API | < 500 мс | 🔄 В разработке |
| Одновременных пользователей | До 1000 | 🔄 В разработке |
| Доступность (SLA) | 99.5% | 🔄 В разработке |
| Lighthouse Score | > 90 | 🔄 В разработке |

---

## 🤝 Участие в разработке

### Этапы разработки

- [x] **Этап 0:** Инфраструктура и базовая настройка ✅
- [ ] **Этап 1:** Базовый функционал (API, компоненты)
- [ ] **Этап 2:** Интеграции (1С, ТК, Telegram, PDF)
- [ ] **Этап 3:** Расширенный функционал (личный кабинет, отзывы)
- [ ] **Этап 4:** Тестирование и оптимизация
- [ ] **Этап 5:** Ребрендинг и дизайн

### Текущие задачи

Смотрите [PROJECT_STATUS.md](./PROJECT_STATUS.md) для детального списка задач.

---

## 📞 Поддержка

### Возникли проблемы?

1. Проверьте [FAQ.md](./FAQ.md)
2. Просмотрите [GETTING_STARTED.md](./GETTING_STARTED.md)
3. Создайте issue в репозитории
4. Обратитесь к команде разработки

### Полезные ссылки

- [Node.js документация](https://nodejs.org/docs/)
- [Express.js документация](https://expressjs.com/)
- [Nuxt.js документация](https://nuxt.com/docs)
- [MongoDB документация](https://docs.mongodb.com/)
- [Vue.js документация](https://vuejs.org/guide/)

---

## 💰 Стоимость

**Разработка:** от 280,000 рублей
**Постгарантийное обслуживание:** 15,000 рублей/месяц

---

## 📄 Лицензия

**Proprietary** - Все права защищены

---

<div align="center">

**Сделано с ❤️ для создания современного интернет-магазина**

*Версия 1.0.0 | Октябрь 2025*

</div>
