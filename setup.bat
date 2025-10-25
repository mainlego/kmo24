@echo off
setlocal enabledelayedexpansion

echo ==================================================
echo    Установка проекта "Интернет-магазин"
echo ==================================================
echo.

REM Проверка Node.js
echo Проверка Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js не установлен. Пожалуйста, установите Node.js 18+
    echo Скачать: https://nodejs.org/
    pause
    exit /b 1
)

node -v
echo [OK] Node.js установлен
echo.

REM Проверка npm
echo Проверка npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm не установлен
    pause
    exit /b 1
)

npm -v
echo [OK] npm установлен
echo.

REM Проверка MongoDB (опционально)
echo Проверка MongoDB...
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB не найден (можно использовать Docker)
) else (
    echo [OK] MongoDB установлен
)
echo.

REM Проверка Redis (опционально)
echo Проверка Redis...
where redis-server >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Redis не найден (можно использовать Docker)
) else (
    echo [OK] Redis установлен
)
echo.

REM Проверка Docker (опционально)
echo Проверка Docker...
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Docker не найден (опционально)
) else (
    docker -v
    echo [OK] Docker установлен
)
echo.

REM Установка зависимостей
echo ==================================================
echo    Установка зависимостей
echo ==================================================
echo.

echo Установка зависимостей Backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Ошибка установки Backend зависимостей
    pause
    exit /b 1
)
echo [OK] Backend зависимости установлены
cd ..
echo.

echo Установка зависимостей Frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Ошибка установки Frontend зависимостей
    pause
    exit /b 1
)
echo [OK] Frontend зависимости установлены
cd ..
echo.

REM Создание .env файлов
echo ==================================================
echo    Настройка переменных окружения
echo ==================================================
echo.

if not exist "backend\.env" (
    echo Создание backend\.env...
    copy backend\.env.example backend\.env >nul
    echo [OK] backend\.env создан
) else (
    echo [WARNING] backend\.env уже существует
)

if not exist "frontend\.env" (
    echo Создание frontend\.env...
    copy frontend\.env.example frontend\.env >nul
    echo [OK] frontend\.env создан
) else (
    echo [WARNING] frontend\.env уже существует
)

if not exist ".env" (
    echo Создание .env...
    copy .env.example .env >nul
    echo [OK] .env создан
) else (
    echo [WARNING] .env уже существует
)
echo.

REM Создание директорий
echo ==================================================
echo    Создание необходимых директорий
echo ==================================================
echo.

if not exist "backend\logs" mkdir backend\logs
if not exist "backend\uploads" mkdir backend\uploads
echo [OK] Директории созданы
echo.

REM Финальное сообщение
echo ==================================================
echo    Установка завершена успешно!
echo ==================================================
echo.
echo Следующие шаги:
echo.
echo 1. Отредактируйте файлы .env:
echo    - backend\.env
echo    - frontend\.env
echo.
echo 2. Запустите MongoDB и Redis:
echo    mongod
echo    redis-server
echo.
echo    Или используйте Docker:
echo    docker-compose up -d mongodb redis
echo.
echo 3. Запустите приложение:
echo    npm run dev
echo.
echo 4. Откройте в браузере:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo.
echo Для получения более подробной информации см.:
echo    GETTING_STARTED.md
echo    PROJECT_STATUS.md
echo.
pause
