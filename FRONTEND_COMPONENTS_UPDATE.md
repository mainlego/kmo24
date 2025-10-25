# Frontend UI Components - Update

**Дата:** 25 октября 2025
**Статус:** Завершена разработка базовых UI компонентов и компонентов продуктов

## Выполненные задачи

### 1. Базовые UI компоненты (Base Components)

Созданы все основные переиспользуемые компоненты для построения интерфейса:

#### ✅ BaseButton (frontend/components/common/BaseButton.vue)
- 5 вариантов: primary, secondary, outline, ghost, danger
- 3 размера: sm, md, lg
- Поддержка иконок, состояния загрузки
- Интеграция с NuxtLink для навигации
- Полная стилизация с SCSS и переменными

#### ✅ BaseInput (frontend/components/common/BaseInput.vue)
- Полная поддержка v-model с TypeScript
- Label с индикатором обязательности
- Отображение ошибок и подсказок
- Слоты prefix/suffix для иконок
- Состояния: disabled, readonly, error
- Валидация (min, max, pattern, required)

#### ✅ BaseCard (frontend/components/common/BaseCard.vue)
- 4 варианта: default, outlined, elevated, flat
- Состояния: hoverable, clickable, bordered, shadow
- Слоты: image, badge, header, footer, default
- Адаптивная верстка
- Анимации при наведении

#### ✅ BaseModal (frontend/components/common/BaseModal.vue)
- 4 размера: sm, md, lg, xl
- Fullscreen режим
- Закрытие по Escape и клику на overlay
- Блокировка прокрутки body
- Слоты: header, footer, default
- Анимации появления/исчезновения
- Teleport в body

#### ✅ BaseSelect (frontend/components/common/BaseSelect.vue)
- Поддержка массивов объектов и примитивов
- Кастомные valueKey и labelKey
- Placeholder опция
- Disabled опции
- Иконка с анимацией при фокусе
- Обработка ошибок и подсказок

#### ✅ BaseTextarea (frontend/components/common/BaseTextarea.vue)
- v-model binding
- Счетчик символов (опционально)
- Авто-resize функциональность
- maxlength с визуальным отображением
- Кастомный scrollbar
- Error/hint сообщения

#### ✅ BaseCheckbox (frontend/components/common/BaseCheckbox.vue)
- Поддержка single value (boolean)
- Поддержка multiple values (array)
- Кастомная иконка галочки (SVG)
- Slot для кастомного label
- Состояния: disabled, error
- Hint сообщения

#### ✅ BaseRadio (frontend/components/common/BaseRadio.vue)
- v-model с любым типом значения
- Группировка по name
- Кастомная визуализация (circle + dot)
- Slot для label
- Состояния: disabled, error, checked
- Hint сообщения

#### ✅ BaseBadge (frontend/components/common/BaseBadge.vue)
- 7 вариантов цветов: primary, secondary, success, warning, danger, info, neutral
- 3 размера: sm, md, lg
- Outline вариант
- Rounded опция
- Closable с событием close
- Слот для иконки

#### ✅ BaseSpinner (frontend/components/common/BaseSpinner.vue)
- 4 размера: sm, md, lg, xl
- 3 варианта цвета: primary, secondary, white
- Анимированный SVG spinner
- Опциональный текст загрузки
- CSS анимации (rotate + dash)

### 2. Компоненты продуктов (Product Components)

Созданы специализированные компоненты для отображения каталога:

#### ✅ ProductCard (frontend/components/product/ProductCard.vue)
- Интеграция с BaseCard
- Отображение изображения с placeholder
- Бейджи: Новинка, Скидка, Нет в наличии
- Рейтинг со звездами
- Цена с отображением старой цены
- Кнопка "В корзину" с loading state
- Кнопка "Избранное" (wishlist)
- Клик по карточке → переход на страницу товара
- Анимация изображения при hover
- Адаптивная верстка

**Функциональность:**
- Вычисление процента скидки
- Определение новинок (14 дней с момента создания)
- Проверка наличия на складе
- Интеграция с cartStore для добавления в корзину
- Форматирование цены (RUB)
- Truncate описания

#### ✅ ProductGrid (frontend/components/product/ProductGrid.vue)
- Адаптивная сетка товаров
- Состояние загрузки (spinner)
- Empty state с иконкой
- Пагинация с навигацией
- Информация о текущей странице
- Кнопка сброса фильтров
- Авто-прокрутка вверх при смене страницы
- Responsive: от 4 колонок на десктопе до 2 на мобильных

**События:**
- nextPage
- prevPage
- reset

#### ✅ ProductFilters (frontend/components/product/ProductFilters.vue)
- Поиск товаров (debounced, 500ms)
- Фильтр по категории (select)
- Фильтр по цене (min-max range)
- Фильтр "Только в наличии" (checkbox)
- Сортировка (7 вариантов)
- Активные фильтры в виде badges
- Возможность удаления каждого фильтра
- Кнопка "Сбросить все"
- Синхронизация с props

**Варианты сортировки:**
1. По популярности
2. Сначала дешевые
3. Сначала дорогие
4. По рейтингу
5. Сначала новые
6. По названию (А-Я)
7. По названию (Я-А)

## Технические детали

### Использованные технологии
- **Vue 3 Composition API**: `<script setup>`, `ref`, `computed`, `watch`
- **TypeScript**: Полная типизация props, emits, interfaces
- **SCSS**: Модульные стили с использованием переменных
- **SVG**: Кастомные иконки для всех компонентов
- **Transitions**: CSS анимации для модалок, спиннеров
- **Teleport**: Для модальных окон
- **Debouncing**: Для поиска и фильтров по цене

### Паттерны разработки
- v-model двунаправленная связь через `update:modelValue`
- Slots для гибкой кастомизации
- Emits для событий с типизацией
- Computed properties для реактивных вычислений
- Props с дефолтными значениями через `withDefaults()`
- Responsive дизайн с media queries

### Интеграции
- **Pinia Stores**: cartStore, authStore, productsStore
- **Nuxt Router**: navigateTo, useRouter
- **Composables**: useApi для HTTP запросов
- **Types**: Импорт из ~/types/index.ts

### Стилизация
Все компоненты используют единые переменные из `assets/scss/variables`:
- Цвета: $primary, $error, $success, $warning, $gray-*
- Spacing: $spacing-xs, $spacing-sm, $spacing-md, $spacing-lg, $spacing-xl
- Typography: $font-size-*, $font-weight-*
- Border radius: $radius-sm, $radius-md, $radius-lg, $radius-xl, $radius-full
- Shadows: $shadow-sm, $shadow-md, $shadow-lg, $shadow-xl
- Transitions: $transition-base, $transition-slow, $transition-ease
- Breakpoints: $breakpoint-sm, $breakpoint-md, $breakpoint-lg

## Статистика

- **Всего создано файлов:** 13
- **Базовых компонентов:** 10
- **Компонентов продуктов:** 3
- **Строк кода:** ~2000+
- **Комментариев и документации:** Полная JSDoc типизация

## Следующие шаги

### 1. Создание страниц
- [ ] `/pages/products/index.vue` - Каталог товаров
- [ ] `/pages/products/[slug].vue` - Страница товара
- [ ] `/pages/cart.vue` - Корзина
- [ ] `/pages/checkout.vue` - Оформление заказа

### 2. Дополнительные компоненты продуктов
- [ ] ProductGallery - Галерея изображений
- [ ] ProductInfo - Подробная информация
- [ ] ProductReviews - Отзывы
- [ ] ProductSpecifications - Характеристики

### 3. Компоненты корзины
- [ ] CartItem - Элемент корзины
- [ ] CartSummary - Итоговая сумма
- [ ] PromoCodeInput - Ввод промокода

### 4. Компоненты оформления заказа
- [ ] CheckoutForm - Форма оформления
- [ ] ShippingMethod - Выбор доставки
- [ ] PaymentMethod - Выбор оплаты
- [ ] OrderSummary - Итоги заказа

### 5. Backend APIs (оставшиеся)
- [ ] Categories API
- [ ] Orders API
- [ ] Reviews API
- [ ] News API (Telegram)
- [ ] Users API (Admin)

### 6. Интеграции
- [ ] 1C:Service API
- [ ] Transport companies (Delovye Linii, PEK)
- [ ] Telegram Bot
- [ ] PDF Generation (Puppeteer)
- [ ] Email (Nodemailer)

## Примеры использования

### BaseButton
```vue
<BaseButton variant="primary" size="lg" :loading="isLoading" @click="handleClick">
  Нажми меня
</BaseButton>
```

### BaseInput
```vue
<BaseInput
  v-model="email"
  type="email"
  label="Email"
  placeholder="example@mail.ru"
  :error="emailError"
  required
>
  <template #prefix>
    <IconEmail />
  </template>
</BaseInput>
```

### BaseModal
```vue
<BaseModal v-model="isOpen" title="Подтверждение" size="md">
  <p>Вы уверены, что хотите удалить этот товар?</p>
  <template #footer>
    <BaseButton variant="outline" @click="isOpen = false">Отмена</BaseButton>
    <BaseButton variant="danger" @click="handleDelete">Удалить</BaseButton>
  </template>
</BaseModal>
```

### ProductCard
```vue
<ProductCard :product="product" />
```

### ProductGrid
```vue
<ProductGrid
  :products="products"
  :is-loading="isLoading"
  :pagination="pagination"
  @next-page="handleNextPage"
  @prev-page="handlePrevPage"
  @reset="handleReset"
/>
```

### ProductFilters
```vue
<ProductFilters
  :filters="filters"
  :categories="categories"
  @update:filters="handleFiltersUpdate"
/>
```

## Заметки

### Производительность
- Используется debouncing для поиска (500ms)
- Lazy loading компонентов через Nuxt auto-imports
- Оптимизированные SVG иконки
- CSS transitions вместо JS анимаций

### Доступность (A11y)
- Aria-labels для кнопок без текста
- Правильные семантические теги
- Keyboard navigation (Escape для модалок)
- Focus states для всех интерактивных элементов

### Безопасность
- Sanitized user inputs
- XSS защита через Vue
- Type-safe props и emits

## Контрольный список качества

- [x] TypeScript типизация
- [x] Responsive дизайн
- [x] Accessibility (A11y)
- [x] Loading states
- [x] Error handling
- [x] Empty states
- [x] Transitions/Animations
- [x] SCSS variables
- [x] Code documentation
- [x] Reusability
- [x] Performance optimizations
- [x] Browser compatibility

---

**Автор:** Claude Code
**Версия:** 1.0
**Последнее обновление:** 2025-10-25
