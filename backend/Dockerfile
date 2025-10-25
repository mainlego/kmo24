# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Production stage
FROM node:18-alpine

WORKDIR /app

# Создаем непривилегированного пользователя
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Копируем node_modules из builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Копируем исходный код
COPY --chown=nodejs:nodejs . .

# Создаем необходимые директории
RUN mkdir -p logs uploads && chown -R nodejs:nodejs logs uploads

# Переключаемся на непривилегированного пользователя
USER nodejs

# Открываем порт
EXPOSE 3001

# Устанавливаем переменную окружения
ENV NODE_ENV=production

# Запускаем приложение
CMD ["node", "src/index.js"]
