# 🚀 Быстрый старт на Render.com

## За 5 минут до production!

### Шаг 1: Подготовка (1 минута)

1. **Зарегистрируйтесь на Render.com**
   - Перейдите на [render.com](https://render.com)
   - Нажмите "Get Started"
   - Войдите через GitHub

2. **Подключите репозиторий**
   - В Dashboard нажмите "Connect Account" → GitHub
   - Разрешите доступ к репозиторию `mainlego/kmo24`

### Шаг 2: Развертывание через Blueprint (2 минуты)

1. **Создайте Blueprint**
   ```
   Dashboard → New + → Blueprint
   ```

2. **Выберите репозиторий**
   ```
   Repository: mainlego/kmo24
   Branch: main
   ```

3. **Render найдет render.yaml автоматически**
   ```
   ✅ Blueprint detected: render.yaml
   Services to create:
   - kmo24-backend (Web Service - Node.js/Express API)
   - kmo24-frontend (Web Service - Node.js/Nuxt SSR)
   - kmo24-redis (Redis Cache)
   ```

4. **Нажмите "Apply"**
   ```
   Render создаст все сервисы автоматически!
   ```

### Шаг 3: Настройка Redis (1 минута)

После создания сервисов:

1. Перейдите в **kmo24-backend** → Environment
2. Добавьте переменную:
   ```
   Name: REDIS_URL
   Value: [Select] From Service → kmo24-redis → Redis Connection String
   ```
3. Нажмите "Save Changes"
4. Backend автоматически перезапустится

### Шаг 4: Проверка (1 минута)

1. **Backend Health Check**
   ```bash
   curl https://kmo24-backend.onrender.com/health
   ```

   Ожидаемый ответ:
   ```json
   {
     "status": "OK",
     "timestamp": "2025-01-23T10:00:00.000Z",
     "uptime": 12.34,
     "environment": "production"
   }
   ```

2. **Frontend**
   - Откройте URL вашего frontend сервиса
   - Сайт должен открыться и работать

3. **API Test**
   ```bash
   curl https://kmo24-backend.onrender.com/api/v1
   ```

---

## ✅ Готово! Ваш сайт в production!

### URLs ваших сервисов:

- 🌐 **Frontend:** `https://kmo24-frontend.onrender.com`
- 🔧 **Backend API:** `https://kmo24-backend.onrender.com`
- 🗄️ **MongoDB:** Уже настроен (MongoDB Atlas)
- 📦 **Redis:** `kmo24-redis.onrender.com`

---

## 🎯 Следующие шаги

### 1. Настройка домена (опционально)

**Frontend:**
```
kmo24-frontend → Settings → Custom Domain
Добавить: kmo24.ru
```

**Backend:**
```
kmo24-backend → Settings → Custom Domain
Добавить: api.kmo24.ru
```

Затем обновите DNS записи согласно инструкциям Render.

### 2. Обновите CORS после настройки домена

```
kmo24-backend → Environment
CORS_ORIGIN = https://kmo24.ru,https://www.kmo24.ru
```

### 3. Настройте алерты

```
Settings → Notifications
- Deploy Failed
- High Memory Usage
- High CPU Usage
```

### 4. Настройте автоматические backup

**MongoDB Atlas:**
1. Перейдите в MongoDB Atlas Dashboard
2. Cluster → Backup → Configure
3. Включите Continuous Backup
4. Настройте расписание snapshot

---

## 🔧 Опциональные настройки

### Email уведомления (SMTP)

Добавьте в Backend Environment:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@kmo24.ru
```

### Telegram уведомления

Добавьте в Backend Environment:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHANNEL_ID=@your_channel
```

### 1C интеграция

Добавьте в Backend Environment:
```env
1C_API_URL=https://your-1c-server.com/api
1C_API_USERNAME=api_user
1C_API_PASSWORD=api_password
```

---

## 📊 Мониторинг

### Логи в реальном времени

```
Dashboard → kmo24-backend → Logs
Dashboard → kmo24-frontend → Logs
```

### Метрики

```
Dashboard → Service → Metrics
- CPU Usage
- Memory Usage
- Request Count
- Response Time
```

---

## 🆘 Troubleshooting

### Backend не запускается

**Проблема:** MongoDB connection error

**Решение:**
1. Перейдите в MongoDB Atlas
2. Network Access → IP Whitelist
3. Добавьте: `0.0.0.0/0` (разрешить все IP)
4. Или добавьте конкретные IP Render: [Render IPs](https://render.com/docs/static-outbound-ip-addresses)

### Frontend не подключается к Backend

**Проблема:** CORS errors в консоли браузера

**Решение:**
1. Проверьте `NUXT_PUBLIC_API_BASE_URL` в frontend
2. Проверьте `CORS_ORIGIN` в backend
3. Убедитесь, что оба сервиса запущены

### Redis connection errors

**Проблема:** Redis timeout errors

**Решение:**
1. Убедитесь, что `REDIS_URL` добавлен в backend environment
2. Проверьте, что Redis сервис запущен (зеленый статус)
3. Перезапустите backend сервис

---

## 📞 Поддержка

- 📖 **Полная документация:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🐛 **Проблемы:** [GitHub Issues](https://github.com/mainlego/kmo24/issues)
- 📧 **Email:** info@kmo24.ru

---

## 🎉 Поздравляем!

Ваш интернет-магазин КМО24 теперь доступен в интернете 24/7!

**Что дальше?**
- ✅ Протестируйте все функции сайта
- ✅ Загрузите товары через админ-панель
- ✅ Настройте интеграцию с 1С
- ✅ Настройте Telegram уведомления
- ✅ Настройте email рассылку
- ✅ Добавьте свой домен
- ✅ Настройте Google Analytics

**Успехов в продажах! 🚀**
