#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}   Установка проекта 'Интернет-магазин'${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""

# Проверка Node.js
echo -e "${YELLOW}Проверка Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js не установлен. Пожалуйста, установите Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Требуется Node.js версии 18 или выше. Текущая версия: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js установлен: $(node -v)${NC}"
echo ""

# Проверка npm
echo -e "${YELLOW}Проверка npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm не установлен${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm установлен: $(npm -v)${NC}"
echo ""

# Проверка MongoDB (опционально)
echo -e "${YELLOW}Проверка MongoDB...${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✓ MongoDB установлен${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB не найден (можно использовать Docker)${NC}"
fi
echo ""

# Проверка Redis (опционально)
echo -e "${YELLOW}Проверка Redis...${NC}"
if command -v redis-server &> /dev/null; then
    echo -e "${GREEN}✓ Redis установлен${NC}"
else
    echo -e "${YELLOW}⚠ Redis не найден (можно использовать Docker)${NC}"
fi
echo ""

# Проверка Docker (опционально)
echo -e "${YELLOW}Проверка Docker...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker установлен: $(docker -v)${NC}"
else
    echo -e "${YELLOW}⚠ Docker не найден (опционально)${NC}"
fi
echo ""

# Установка зависимостей
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}   Установка зависимостей${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""

echo -e "${YELLOW}Установка зависимостей Backend...${NC}"
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend зависимости установлены${NC}"
else
    echo -e "${RED}✗ Ошибка установки Backend зависимостей${NC}"
    exit 1
fi
cd ..
echo ""

echo -e "${YELLOW}Установка зависимостей Frontend...${NC}"
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend зависимости установлены${NC}"
else
    echo -e "${RED}✗ Ошибка установки Frontend зависимостей${NC}"
    exit 1
fi
cd ..
echo ""

# Создание .env файлов
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}   Настройка переменных окружения${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Создание backend/.env...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ backend/.env создан${NC}"
else
    echo -e "${YELLOW}⚠ backend/.env уже существует${NC}"
fi

if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}Создание frontend/.env...${NC}"
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ frontend/.env создан${NC}"
else
    echo -e "${YELLOW}⚠ frontend/.env уже существует${NC}"
fi

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Создание .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env создан${NC}"
else
    echo -e "${YELLOW}⚠ .env уже существует${NC}"
fi
echo ""

# Создание директорий
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}   Создание необходимых директорий${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""

mkdir -p backend/logs
mkdir -p backend/uploads
echo -e "${GREEN}✓ Директории созданы${NC}"
echo ""

# Финальное сообщение
echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}   Установка завершена успешно!${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""
echo -e "${YELLOW}Следующие шаги:${NC}"
echo ""
echo -e "1. ${YELLOW}Отредактируйте файлы .env:${NC}"
echo -e "   - backend/.env"
echo -e "   - frontend/.env"
echo ""
echo -e "2. ${YELLOW}Запустите MongoDB и Redis:${NC}"
echo -e "   ${GREEN}mongod${NC}"
echo -e "   ${GREEN}redis-server${NC}"
echo ""
echo -e "   ${YELLOW}Или используйте Docker:${NC}"
echo -e "   ${GREEN}docker-compose up -d mongodb redis${NC}"
echo ""
echo -e "3. ${YELLOW}Запустите приложение:${NC}"
echo -e "   ${GREEN}npm run dev${NC}"
echo ""
echo -e "4. ${YELLOW}Откройте в браузере:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:3001${NC}"
echo ""
echo -e "${YELLOW}Для получения более подробной информации см.:${NC}"
echo -e "   ${GREEN}GETTING_STARTED.md${NC}"
echo -e "   ${GREEN}PROJECT_STATUS.md${NC}"
echo ""
