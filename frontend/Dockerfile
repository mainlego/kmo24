# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Создаем непривилегированного пользователя
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Копируем собранное приложение
COPY --from=builder --chown=nodejs:nodejs /app/.output ./.output
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Переключаемся на непривилегированного пользователя
USER nodejs

# Открываем порт
EXPOSE 3000

# Устанавливаем переменную окружения
ENV NODE_ENV=production

# Запускаем приложение
CMD ["node", ".output/server/index.mjs"]
