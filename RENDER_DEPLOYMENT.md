# Инструкция по деплою на Render.com

## Backend Setup

### Переменные окружения на Render

Добавьте эти переменные в настройках вашего Web Service на Render:

```env
# Server
NODE_ENV=production
API_VERSION=v1

# Database
MONGODB_URI=mongodb+srv://omlineadmin:5MOHI036wc4yf3vh@kmo24.e0o4igm.mongodb.net/kmo24?retryWrites=true&w=majority&appName=kmo24

# JWT (Используйте эти безопасные ключи или сгенерируйте свои)
JWT_SECRET=87a48ddb8d2b97e6c401fc999294b364d49a54dba43b941d34ff1eedfe6ed70b
JWT_REFRESH_SECRET=21dd6ae581ff046ce14bd3a3e9f6aabf113b375b758652e82fdc9550e4047b88
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (замените на ваш frontend URL)
CORS_ORIGIN=https://kmo24-frontend.onrender.com

# Frontend URL
FRONTEND_URL=https://kmo24-frontend.onrender.com
```

### Генерация безопасных ключей

Для генерации безопасных JWT ключей используйте:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Build Command
```
npm install
```

### Start Command
```
npm start
```

## Frontend Setup

### Переменные окружения на Render для frontend

```env
NUXT_PUBLIC_API_BASE_URL=https://kmo24-backend.onrender.com/api/v1
NUXT_PUBLIC_SITE_NAME=КМО24
NUXT_PUBLIC_SITE_DESCRIPTION=Профессиональное оборудование для кухни
NUXT_PUBLIC_SITE_URL=https://kmo24-frontend.onrender.com
```

### Build Command
```
npm install && npm run build
```

### Start Command
```
npm run preview
```

## Важные моменты

1. **MongoDB**: Текущая строка подключения использует демо-учетные данные. В продакшене создайте новый кластер и пользователя.

2. **JWT Секреты**: Обязательно сгенерируйте новые безопасные ключи для JWT.

3. **CORS**: Убедитесь, что CORS_ORIGIN указывает на правильный frontend URL.

4. **Порт**: Render автоматически устанавливает переменную PORT, не переопределяйте её.

5. **Логи**: Проверяйте логи в Render Dashboard для диагностики проблем.

## Проверка работоспособности

После деплоя проверьте:
1. Backend health endpoint: `https://your-backend-url.onrender.com/health`
2. API endpoint: `https://your-backend-url.onrender.com/api/v1`
3. Frontend главная страница: `https://your-frontend-url.onrender.com`