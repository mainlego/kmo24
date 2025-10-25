# 🚀 Инструкция по запуску для тестирования

## Текущий статус

✅ **Frontend запущен и работает!**
- URL: http://localhost:3000/
- Страница тестирования компонентов: http://localhost:3000/test-components

❌ **Backend не запущен** (требуется MongoDB и Redis)

## Что можно тестировать прямо сейчас

### 1. Страница тестирования всех UI компонентов

**URL:** http://localhost:3000/test-components

На этой странице можно протестировать:

#### Базовые компоненты:
- ✅ **BaseButton** - 5 вариантов (primary, secondary, outline, ghost, danger), 3 размера, loading состояние
- ✅ **BaseInput** - поля ввода с валидацией, ошибками, префиксами/суффиксами
- ✅ **BaseSelect** - выпадающие списки с опциями
- ✅ **BaseTextarea** - текстовые области со счетчиком символов
- ✅ **BaseCheckbox** - чекбоксы одиночные и групповые
- ✅ **BaseRadio** - радио-кнопки
- ✅ **BaseBadge** - бейджи 7 цветов (primary, secondary, success, warning, danger, info, neutral)
- ✅ **BaseSpinner** - анимированные спиннеры загрузки
- ✅ **BaseCard** - карточки с разными вариантами оформления
- ✅ **BaseModal** - модальные окна (нажмите кнопку "Открыть модалку")

#### Компоненты продуктов:
- ✅ **ProductCard** - карточка товара с mock данными

### 2. Главная страница

**URL:** http://localhost:3000/

Базовая главная страница проекта.

### 3. Страница каталога

**URL:** http://localhost:3000/products

Показывает:
- ✅ **ProductFilters** - панель фильтров (поиск, категория, цена, наличие, сортировка)
- ✅ **ProductGrid** - сетка товаров
- ✅ **Empty State** - так как нет подключения к backend, отображается состояние "товары не найдены"

## Для полного тестирования с Backend

Чтобы запустить полноценное приложение с базой данных:

### Вариант 1: Docker (рекомендуется)

1. Запустите Docker Desktop

2. Запустите MongoDB и Redis:
```bash
docker-compose up -d mongodb redis
```

3. В отдельном терминале запустите backend:
```bash
cd backend
npm run dev
```

4. Frontend уже запущен на http://localhost:3000/

### Вариант 2: Локальная установка

Если у вас установлены MongoDB и Redis локально:

1. Убедитесь что MongoDB запущен на порту 27017
2. Убедитесь что Redis запущен на порту 6379
3. Запустите backend:
```bash
cd backend
npm run dev
```

## Полезные команды

### Frontend (уже запущен)
```bash
cd frontend
npm run dev          # Запуск dev сервера
npm run build        # Сборка для продакшена
npm run preview      # Просмотр production сборки
```

### Backend
```bash
cd backend
npm run dev          # Запуск с nodemon (авто-перезагрузка)
npm start            # Запуск без nodemon
npm test             # Запуск тестов
npm run lint         # Проверка кода
npm run lint:fix     # Автоисправление проблем
```

### Docker
```bash
docker-compose up -d                 # Запустить все сервисы
docker-compose up -d mongodb redis   # Только MongoDB и Redis
docker-compose down                  # Остановить все сервисы
docker-compose logs -f backend       # Смотреть логи backend
docker-compose ps                    # Статус контейнеров
```

## Созданные компоненты (13 шт)

### Base UI Components (10):
1. `frontend/components/common/BaseButton.vue`
2. `frontend/components/common/BaseInput.vue`
3. `frontend/components/common/BaseCard.vue`
4. `frontend/components/common/BaseModal.vue`
5. `frontend/components/common/BaseSelect.vue`
6. `frontend/components/common/BaseTextarea.vue`
7. `frontend/components/common/BaseCheckbox.vue`
8. `frontend/components/common/BaseRadio.vue`
9. `frontend/components/common/BaseBadge.vue`
10. `frontend/components/common/BaseSpinner.vue`

### Product Components (3):
1. `frontend/components/product/ProductCard.vue`
2. `frontend/components/product/ProductGrid.vue`
3. `frontend/components/product/ProductFilters.vue`

### Pages:
1. `frontend/pages/test-components.vue` - Тестовая страница со всеми компонентами
2. `frontend/pages/products/index.vue` - Каталог товаров

## Особенности

### Hot Module Replacement (HMR)
- Frontend автоматически обновляется при изменении файлов
- Backend с nodemon перезапускается при изменении файлов

### TypeScript поддержка
- Все компоненты полностью типизированы
- Автодополнение работает в IDE

### Responsive дизайн
- Все компоненты адаптивны
- Breakpoints: sm (640px), md (768px), lg (1024px)

### SCSS переменные
Используются единые переменные из `frontend/assets/scss/_variables.scss`:
- Цвета
- Отступы
- Шрифты
- Радиусы
- Тени
- Transitions

## Известные проблемы

1. **SASS Deprecation Warning** - использование `darken()` устарело, но не критично
2. **Backend не запущен** - страницы с реальными данными показывают empty state
3. **JIT TOTAL warnings** - косметическая проблема Tailwind CSS

## Следующие шаги

После тестирования UI компонентов:

1. ✅ Базовые UI компоненты созданы
2. ✅ Компоненты продуктов созданы
3. ⏳ Запустить backend с БД для полного тестирования
4. ⏳ Создать mock данные для тестирования
5. ⏳ Добавить больше страниц (checkout, cart, account)
6. ⏳ Интеграции (1C, Transport APIs, Telegram)

---

**Дата:** 25 октября 2025
**Автор:** Claude Code
**Версия:** 1.0
