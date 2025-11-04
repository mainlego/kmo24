# Дизайн-система КМО24

Единая система дизайна для проекта КМО24 - комиссионный магазин оборудования для кафе и ресторанов.

## 📁 Структура файлов

```
frontend/
├── assets/scss/
│   ├── _variables.scss    # Все переменные (цвета, размеры, отступы)
│   ├── _mixins.scss        # Переиспользуемые миксины
│   ├── _animations.scss    # Все анимации (@keyframes)
│   └── main.scss           # Базовые стили и импорты
├── tailwind.config.ts      # Конфигурация Tailwind (интеграция с SCSS)
└── components/
    ├── common/             # ✅ Базовые UI компоненты
    ├── base/               # ⚠️ DEPRECATED - используйте common/
    ├── product/            # Компоненты для товаров
    ├── cart/               # Компоненты корзины
    ├── admin/              # Компоненты админ-панели
    └── icons/              # Иконки
```

---

## 🎨 Цветовая палитра

### Основные цвета бренда

```scss
$primary: #f59e0b;       // Оранжевый - основной цвет бренда
$primary-light: #fbbf24; // Светло-оранжевый
$primary-dark: #ea580c;  // Темно-оранжевый
$secondary: #8b5cf6;     // Фиолетовый - акцентный цвет
```

**Tailwind классы:**
```html
<div class="bg-primary text-white">
<div class="bg-primary-light">
<div class="bg-secondary">
```

### Системные цвета (статусы)

```scss
$success: #10b981;  // Зеленый - успех
$error: #ef4444;    // Красный - ошибка
$info: #3b82f6;     // Синий - информация
$warning: #f59e0b;  // = $primary
```

**Использование:**
```html
<!-- Уведомления -->
<div class="border-l-4 border-success">Успешно сохранено</div>
<div class="border-l-4 border-error">Ошибка валидации</div>
<div class="bg-info/10 text-info">Информация</div>
```

### Нейтральная палитра (Gray scale)

```scss
$gray-50: #f9fafb;   // Светлые фоны
$gray-100: #f3f4f6;  // Карточки, секции
$gray-200: #e5e7eb;  // Бордеры
$gray-300: #d1d5db;  // Разделители
$gray-400: #9ca3af;  // Плейсхолдеры
$gray-500: #6b7280;  // Второстепенный текст
$gray-600: #4b5563;  // Основной серый текст
$gray-700: #374151;  // Заголовки
$gray-800: #1f2937;  // Темный текст
$gray-900: #111827;  // Самый темный текст
```

**Tailwind:**
```html
<div class="bg-gray-50">       <!-- Фоны -->
<p class="text-gray-500">      <!-- Второстепенный текст -->
<h1 class="text-gray-900">     <!-- Заголовки -->
<div class="border border-gray-200">  <!-- Бордеры -->
```

### Градиенты

```scss
$gradient-primary: linear-gradient(135deg, #f59e0b, #ea580c);
$gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
$gradient-success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
$gradient-purple: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
$gradient-sunset: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
$gradient-ocean: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
$gradient-cosmic: linear-gradient(135deg, #fa8bff 0%, #2bd2ff 52%, #2bff88 90%);
```

**Использование в SCSS:**
```scss
.premium-button {
  background: $gradient-primary;
}
```

**Tailwind классы:**
```html
<div class="bg-gradient-primary">
<button class="bg-gradient-cosmic">
```

---

## 📝 Типографика

### Шрифты

```scss
$font-family-base: 'Inter', sans-serif;              // Основной шрифт
$font-family-heading: 'Plus Jakarta Sans', 'Inter';  // Заголовки
```

**CSS классы:**
```css
body { font-family: var(--font-sans); }
h1, h2, h3 { font-family: var(--font-heading); }
```

### Размеры шрифтов

```scss
$font-size-xs: 0.75rem;    // 12px - мелкий текст, метки
$font-size-sm: 0.875rem;   // 14px - второстепенный текст
$font-size-base: 1rem;      // 16px - основной текст
$font-size-lg: 1.125rem;    // 18px - крупный текст
$font-size-xl: 1.25rem;     // 20px - подзаголовки
$font-size-2xl: 1.5rem;     // 24px - заголовки H3
$font-size-3xl: 1.875rem;   // 30px - заголовки H2
$font-size-4xl: 2.25rem;    // 36px - заголовки H1
$font-size-5xl: 3rem;       // 48px - hero заголовки
```

**Tailwind:**
```html
<p class="text-sm">Мелкий текст</p>
<p class="text-base">Обычный текст</p>
<h3 class="text-2xl">Заголовок</h3>
<h1 class="text-4xl">Главный заголовок</h1>
```

### Веса шрифтов

```scss
$font-weight-light: 300;     // Легкий
$font-weight-normal: 400;    // Обычный
$font-weight-medium: 500;    // Средний
$font-weight-semibold: 600;  // Полужирный
$font-weight-bold: 700;      // Жирный
```

**Использование:**
```html
<p class="font-normal">Обычный текст</p>
<p class="font-medium">Средний вес</p>
<h1 class="font-bold">Жирный заголовок</h1>
```

### Высота строки

```scss
$line-height-tight: 1.25;    // Плотная (заголовки)
$line-height-normal: 1.5;    // Нормальная (основной текст)
$line-height-relaxed: 1.75;  // Свободная (длинный текст)
```

---

## 📏 Отступы и размеры

### Spacing (отступы)

```scss
$spacing-xs: 0.25rem;   // 4px  - минимальные отступы
$spacing-sm: 0.5rem;    // 8px  - маленькие
$spacing-md: 1rem;      // 16px - стандартные
$spacing-lg: 1.5rem;    // 24px - большие
$spacing-xl: 2rem;      // 32px - очень большие
$spacing-2xl: 3rem;     // 48px - секции
$spacing-3xl: 4rem;     // 64px - между секциями
```

**Tailwind:**
```html
<div class="p-md">Padding 16px</div>
<div class="m-lg">Margin 24px</div>
<div class="gap-sm">Gap 8px</div>
```

**SCSS миксины:**
```scss
.card {
  padding: $spacing-lg;
  margin-bottom: $spacing-xl;
}
```

### Border Radius (скругления)

```scss
$radius-sm: 0.25rem;    // 4px  - минимальное
$radius-md: 0.375rem;   // 6px  - стандартное
$radius-lg: 0.5rem;     // 8px  - среднее
$radius-xl: 0.75rem;    // 12px - большое
$radius-2xl: 1rem;      // 16px - очень большое
$radius-full: 9999px;   // Круглое
```

**Tailwind:**
```html
<div class="rounded-md">Стандартное скругление</div>
<div class="rounded-xl">Большое скругление</div>
<button class="rounded-full">Круглая кнопка</button>
```

---

## 🎭 Тени (Shadows)

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
$shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
$shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
$shadow-glow: 0 0 20px rgba(245, 158, 11, 0.5);          // Свечение
$shadow-colored: 0 10px 40px rgba(245, 158, 11, 0.3);    // Цветная тень
```

**Использование:**
```html
<div class="shadow-md">Карточка</div>
<div class="shadow-lg hover:shadow-xl">Hover эффект</div>
<button class="shadow-colored">Премиум кнопка</button>
```

---

## ⚡ Анимации и переходы

### Transitions (переходы)

```scss
$transition-fast: 150ms;   // Быстрые переходы
$transition-base: 200ms;   // Стандартные
$transition-slow: 300ms;   // Медленные

$transition-ease: cubic-bezier(0.4, 0, 0.2, 1);      // Стандартная кривая
$transition-ease-in: cubic-bezier(0.4, 0, 1, 1);     // Ускорение
$transition-ease-out: cubic-bezier(0, 0, 0.2, 1);    // Замедление
```

**Использование:**
```scss
.button {
  transition: all $transition-base $transition-ease;
}
```

**Tailwind:**
```html
<div class="transition-all duration-base ease-out">
```

### Готовые анимации

Все анимации находятся в [`_animations.scss`](assets/scss/_animations.scss)

**Базовые:**
- `fadeIn`, `fadeOut` - появление/исчезновение
- `fadeInUp`, `fadeInDown` - появление с движением
- `slideDown`, `slideUp` - слайды
- `pulse`, `bounce`, `float` - движения

**Эффекты:**
- `shimmer` - переливание (загрузка)
- `shine` - блеск (премиум кнопки)
- `glow` - свечение
- `sparkle` - мерцание

**Утилитные классы:**
```html
<div class="animate-fade-in">
<div class="animate-slide-down">
<div class="animate-pulse">
<div class="animate-shimmer">
```

---

## 🧩 Компоненты

### Кнопки

**Миксины:**
```scss
@use '~/assets/scss/mixins' as *;

.my-button {
  @include button-primary;  // Главная кнопка
  @include button-size(md); // Размер
}

.secondary-btn {
  @include button-secondary;  // Вторичная
}

.ghost-btn {
  @include button-ghost;     // Прозрачная
}
```

**Размеры:**
- `button-size(sm)` - маленькая (8px/16px padding)
- `button-size(md)` - средняя (16px/24px)
- `button-size(lg)` - большая (24px/32px)

**Готовые компоненты:**
```vue
<BaseButton variant="primary" size="md">Купить</BaseButton>
<BaseButton variant="secondary">Отмена</BaseButton>
<BaseButton variant="ghost">Закрыть</BaseButton>
```

### Карточки

**Миксины:**
```scss
.product-card {
  @include card-elevated;  // С тенью
}

.info-card {
  @include card-outlined;  // С бордером
}

.simple-card {
  @include card-flat;      // Плоская
}
```

**Компонент:**
```vue
<BaseCard variant="elevated">
  <template #header>Заголовок</template>
  <p>Содержимое карточки</p>
</BaseCard>
```

### Формы

**Миксины:**
```scss
.custom-input {
  @include input-base;
}

.field-label {
  @include form-label;
}

.error-message {
  @include form-error;
}
```

**Компоненты:**
```vue
<BaseInput v-model="name" label="Имя" placeholder="Введите имя" />
<BaseSelect v-model="category" :options="categories" />
<BaseCheckbox v-model="agree">Согласен с условиями</BaseCheckbox>
```

---

## 🎯 Миксины

Все миксины находятся в [`_mixins.scss`](assets/scss/_mixins.scss)

### Responsive

```scss
// Min-width (для больших экранов)
@include respond-to(md) {
  font-size: 18px;
}

// Max-width (для маленьких экранов)
@include respond-below(md) {
  display: none;
}
```

### Типографика

```scss
// Обрезка текста
@include text-truncate;  // Одна строка с ...

// Многострочное обрезание
@include text-clamp(3);  // 3 строки с ...

// Градиентный текст
@include text-gradient($gradient-primary);

// Заголовок секции
@include section-title;
```

### Позиционирование

```scss
// Абсолютное центрирование
@include center-absolute;

// Flexbox центрирование
@include center-flex;

// Полный overlay
@include full-overlay;
```

### Эффекты

```scss
// Стеклянный эффект
@include glass-effect(0.9);

// Эффект переливания
@include shimmer-effect;

// Hover подъем
@include hover-lift(-8px);

// Skeleton загрузчик
@include skeleton-loader;

// Кастомный scrollbar
@include custom-scrollbar(10px);
```

### Утилиты

```scss
// Скрытие для screen readers
@include sr-only;

// Сброс списка
@include list-reset;

// Aspect ratio
@include aspect-ratio(16, 9);

// Контейнер
@include container;
```

---

## 📱 Breakpoints

```scss
$breakpoint-sm: 640px;   // Маленькие планшеты
$breakpoint-md: 768px;   // Планшеты
$breakpoint-lg: 1024px;  // Маленькие десктопы
$breakpoint-xl: 1280px;  // Большие десктопы
$breakpoint-2xl: 1536px; // Очень большие экраны
```

**Tailwind:**
```html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- 100% на мобилке, 50% на планшете, 33% на десктопе -->
</div>
```

**SCSS:**
```scss
.hero {
  padding: $spacing-lg;

  @include respond-to(md) {
    padding: $spacing-2xl;
  }

  @include respond-to(lg) {
    padding: $spacing-3xl;
  }
}
```

---

## 🔢 Z-index слои

```scss
$z-index-dropdown: 1000;        // Dropdown меню
$z-index-sticky: 1020;          // Sticky header
$z-index-fixed: 1030;           // Fixed элементы
$z-index-modal-backdrop: 1040;  // Backdrop модалки
$z-index-modal: 1050;           // Модальные окна
$z-index-popover: 1060;         // Popover
$z-index-tooltip: 1070;         // Тултипы (самые верхние)
```

---

## ✅ Правила использования

### ❌ НЕ ДЕЛАЙТЕ:

```scss
// ❌ Хардкод цветов
.button {
  background: #3b82f6;
  color: #ffffff;
}

// ❌ Несистемные отступы
.card {
  padding: 13px;
}

// ❌ Дублирование анимаций
@keyframes myPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
```

### ✅ ДЕЛАЙТЕ:

```scss
// ✅ Используйте переменные
.button {
  background: $info;
  color: $white;
}

// ✅ Системные отступы
.card {
  padding: $spacing-md;
}

// ✅ Используйте готовые анимации
.element {
  animation: pulse 2s infinite;
}

// ✅ Или миксины
.element {
  @include button-primary;
}
```

### Tailwind или SCSS?

**Используйте Tailwind для:**
- Быстрого прототипирования
- Простых утилитарных классов (margin, padding, flex)
- Responsive дизайна

**Используйте SCSS для:**
- Сложных компонентов с логикой
- Кастомных анимаций и эффектов
- Когда нужны переменные и миксины
- Глобальных стилей

**Можно комбинировать:**
```vue
<template>
  <div class="flex items-center gap-md premium-card">
    <!-- Tailwind для layout, SCSS класс для стилей -->
  </div>
</template>

<style lang="scss" scoped>
.premium-card {
  @include card-elevated;
  background: $gradient-primary;
}
</style>
```

---

## 🚀 Быстрый старт

### 1. Подключение в компоненте

```vue
<template>
  <div class="my-component">
    <h1>Заголовок</h1>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.my-component {
  @include container;
  padding: $spacing-xl;

  h1 {
    @include section-title;
    color: $primary;
  }
}
</style>
```

### 2. Использование Tailwind

```vue
<template>
  <div class="container mx-auto p-xl">
    <h1 class="text-4xl font-bold text-primary mb-lg">
      Заголовок
    </h1>
    <BaseButton variant="primary" class="mt-md">
      Кнопка
    </BaseButton>
  </div>
</template>
```

### 3. Создание нового компонента

```vue
<template>
  <button :class="classes" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}>()

const classes = computed(() => [
  'base-button',
  `base-button--${props.variant || 'primary'}`,
  `base-button--${props.size || 'md'}`,
])
</script>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.base-button {
  @include button-base;

  &--primary {
    @include button-primary;
  }

  &--secondary {
    @include button-secondary;
  }

  &--ghost {
    @include button-ghost;
  }

  &--sm {
    @include button-size(sm);
  }

  &--md {
    @include button-size(md);
  }

  &--lg {
    @include button-size(lg);
  }
}
</style>
```

---

## 📚 Дополнительные ресурсы

- [Tailwind конфигурация](tailwind.config.ts)
- [SCSS переменные](assets/scss/_variables.scss)
- [Миксины](assets/scss/_mixins.scss)
- [Анимации](assets/scss/_animations.scss)
- [Базовые стили](assets/scss/main.scss)

---

## 🔄 Миграция существующих компонентов

### Проблемы для исправления:

1. **Дублирование компонентов** - `components/base/` vs `components/common/`
   - Решение: Оставить только `components/common/`

2. **Хардкод цветов** (250+ мест)
   - `#3b82f6` → `$info` или `class="text-info"`
   - `#ef4444` → `$error` или `class="text-error"`
   - `#10b981` → `$success` или `class="text-success"`

3. **Несистемные отступы**
   - `padding: 13px` → `padding: $spacing-md`
   - `margin: 5px` → `margin: $spacing-sm`

4. **Дублирующиеся анимации**
   - Удалить локальные @keyframes
   - Использовать из `_animations.scss`

---

**Версия:** 1.0.0
**Дата:** 2025
**Автор:** KMO24 Team
