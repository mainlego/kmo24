# 🎨 Единая цветовая палитра КМО24

## Обзор

Цветовая система построена на трех основных цветах:
- **Orange (Оранжевый)** - основной цвет бренда
- **Purple (Фиолетовый)** - вторичный цвет
- **Indigo/Pink** - акцентные цвета для спецэффектов

---

## 🟠 Основной цвет - Orange

Главный цвет бренда КМО24. Используется для:
- Кнопки призыва к действию (CTA)
- Цены товаров
- Активные состояния
- Акцентные элементы
- Логотип

### Палитра Orange

```scss
$primary-50:  #fff7ed;  // Очень светлый фон
$primary-100: #ffedd5;  // Светлый фон
$primary-200: #fed7aa;  // Светлый акцент
$primary-300: #fdba74;  // Средний светлый
$primary-400: #fb923c;  // Светлый
$primary-500: #f59e0b;  // ⭐ ОСНОВНОЙ
$primary-600: #ea580c;  // Темный
$primary-700: #c2410c;  // Более темный
$primary-800: #9a3412;  // Очень темный
$primary-900: #7c2d12;  // Самый темный

// Алиасы
$primary: $primary-500;
$primary-light: #fbbf24;  // Яркий светлый (особый)
$primary-dark: $primary-600;
```

### Использование в коде

**SCSS:**
```scss
.button-cta {
  background: $primary-500;    // ✅
  border: 2px solid $primary-600;
  color: $white;

  &:hover {
    background: $primary-600;
  }
}

.price {
  color: $primary-500;
  font-weight: bold;
}

.light-background {
  background: $primary-50;
}
```

**Tailwind:**
```html
<!-- Основное использование -->
<button class="bg-primary text-white">Купить</button>
<button class="bg-primary-500 text-white">Купить</button>

<!-- Оттенки -->
<div class="bg-primary-50">Светлый фон</div>
<div class="bg-primary-100">Фон карточки</div>
<div class="text-primary-500">Цена</div>
<div class="text-primary-600">Темный текст</div>

<!-- Бордеры -->
<div class="border-2 border-primary-500">
<div class="border-primary-300">Светлый бордер</div>

<!-- Hover -->
<button class="bg-primary-500 hover:bg-primary-600">
```

---

## 🟣 Вторичный цвет - Purple

Вторичный цвет для:
- Вторичные кнопки
- Альтернативные акценты
- Градиенты
- Декоративные элементы

### Палитра Purple

```scss
$secondary-400: #a78bfa;  // Светлый фиолетовый
$secondary-500: #8b5cf6;  // ⭐ ВТОРИЧНЫЙ
$secondary-600: #7c3aed;  // Темный фиолетовый

$secondary: $secondary-500;
```

### Использование

**SCSS:**
```scss
.button-secondary {
  background: $secondary-500;
  color: $white;

  &:hover {
    background: $secondary-600;
  }
}
```

**Tailwind:**
```html
<button class="bg-secondary text-white">Вторичная кнопка</button>
<button class="bg-secondary-500 hover:bg-secondary-600">
<div class="text-secondary-500">Акцентный текст</div>
```

---

## 💎 Акцентные цвета

### Indigo (Индиго)

Используется в:
- Hero секции
- Премиум градиенты
- Декоративные элементы

```scss
$indigo-400: #818cf8;  // Светлый индиго
$indigo-500: #6366f1;  // ⭐ ИНДИГО
$indigo-600: #4f46e5;  // Темный индиго
```

**Tailwind:**
```html
<div class="bg-indigo-500">Hero фон</div>
<div class="text-indigo-500">Акцентный текст</div>
```

### Pink (Розовый)

Используется в:
- Градиенты
- Премиум эффекты
- Декоративные акценты

```scss
$pink-400: #f472b6;  // Светлый розовый
$pink-500: #ec4899;  // ⭐ РОЗОВЫЙ
$pink-600: #db2777;  // Темный розовый
```

**Tailwind:**
```html
<div class="bg-pink-500">Розовый акцент</div>
<div class="text-pink-500">Розовый текст</div>
```

### Rose (Коралловый/Красный)

Используется в:
- CTA градиенты
- Акценты призыва к действию

```scss
$rose-500: #f43f5e;  // Коралловый
$rose-600: #dc2626;  // ⭐ ТЕМНЫЙ КРАСНЫЙ
```

---

## ✅ Системные цвета (Статусы)

### Success (Успех)

```scss
$success: #10b981;        // Зеленый - основной
$success-light: #d1fae5;  // Светлый фон
```

**Использование:**
```html
<!-- Бейджи статуса -->
<span class="bg-success text-white">В наличии</span>
<div class="bg-success-light text-success-dark">Успешно</div>

<!-- Уведомления -->
<div class="border-l-4 border-success bg-success-light">
  Операция выполнена успешно
</div>
```

### Error (Ошибка)

```scss
$error: #ef4444;        // Красный - основной
$error-light: #fee2e2;  // Светлый фон
```

**Использование:**
```html
<span class="text-error">Ошибка валидации</span>
<div class="bg-error-light text-error">Предупреждение</div>
<button class="bg-error text-white">Удалить</button>
```

### Info (Информация)

```scss
$info: #3b82f6;        // Синий - основной
$info-light: #dbeafe;  // Светлый фон
```

**Использование:**
```html
<span class="bg-info text-white">Новинка</span>
<div class="bg-info-light text-info">Информация</div>
```

### Warning (Предупреждение)

```scss
$warning: $primary-500;   // = Оранжевый
$warning-light: #fef3c7;  // Светлый фон
```

**Использование:**
```html
<span class="bg-warning text-white">Мало</span>
<div class="bg-warning-light text-warning">Внимание</div>
```

---

## 🎨 Градиенты

### Gradient Primary

Основной градиент для кнопок и акцентов.

```scss
$gradient-primary: linear-gradient(135deg, $primary-500, $primary-600);
// linear-gradient(135deg, #f59e0b, #ea580c)
```

**Использование:**
```html
<button class="bg-gradient-primary text-white">
  Премиум кнопка
</button>
```

```scss
.premium-button {
  background: $gradient-primary;
}
```

### Gradient Hero

Многоцветный премиум эффект для hero секций.

```scss
$gradient-hero: linear-gradient(
  135deg,
  rgba($indigo-500, 0.88) 0%,      // Индиго
  rgba($secondary-500, 0.85) 35%,   // Фиолетовый
  rgba($pink-500, 0.82) 65%,        // Розовый
  rgba($primary-500, 0.8) 100%      // Оранжевый
);
```

**Использование:**
```html
<div class="relative">
  <div class="absolute inset-0 bg-gradient-hero opacity-10"></div>
  <h1>Hero заголовок</h1>
</div>
```

### Gradient CTA

Теплый градиент для призывов к действию.

```scss
$gradient-cta: linear-gradient(
  135deg,
  rgba($primary-500, 0.92) 0%,    // Оранжевый
  rgba($primary-600, 0.9) 50%,    // Темный оранжевый
  rgba($rose-600, 0.88) 100%      // Красный
);
```

**Использование:**
```html
<section class="bg-gradient-cta text-white">
  <h2>Специальное предложение!</h2>
  <button class="bg-white text-primary-600">Заказать сейчас</button>
</section>
```

### Gradient Text

Для градиентного текста (холодный).

```scss
$gradient-text: linear-gradient(135deg, $indigo-500 0%, $pink-500 100%);
// linear-gradient(135deg, #6366f1 0%, #ec4899 100%)
```

**SCSS:**
```scss
@use '~/assets/scss/mixins' as *;

.gradient-heading {
  @include text-gradient($gradient-text);
  font-size: $font-size-5xl;
  font-weight: $font-weight-bold;
}
```

**Или напрямую:**
```scss
.gradient-heading {
  background: $gradient-text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Gradient Text Warm

Для градиентного текста (теплый).

```scss
$gradient-text-warm: linear-gradient(135deg, $primary-light 0%, $primary-500 50%, $primary-light 100%);
```

### Gradient Footer

Темный градиент для футера.

```scss
$gradient-footer: linear-gradient(135deg, $gray-800 0%, $gray-900 100%);
```

**Использование:**
```html
<footer class="bg-gradient-footer text-white">
  <!-- Footer content -->
</footer>
```

### Gradient Rainbow

Декоративная линия.

```scss
$gradient-rainbow: linear-gradient(90deg, transparent, $primary-500, $secondary-500, transparent);
```

**Использование:**
```html
<div class="h-1 w-full bg-gradient-rainbow"></div>
```

---

## 🌫️ Нейтральная палитра (Gray)

Используется для:
- Фоны
- Текст
- Бордеры
- Разделители

```scss
$gray-50:  #f9fafb;  // Светлые фоны секций
$gray-100: #f3f4f6;  // Фоны карточек
$gray-200: #e5e7eb;  // Светлые бордеры
$gray-300: #d1d5db;  // Бордеры, разделители
$gray-400: #9ca3af;  // Плейсхолдеры, вторичный текст
$gray-500: #6b7280;  // Третичный текст
$gray-600: #4b5563;  // Вторичный темный текст
$gray-700: #374151;  // Основной текст
$gray-800: #1f2937;  // Темные фоны
$gray-900: #111827;  // Заголовки, самый темный текст
```

### Использование Gray

**Фоны:**
```html
<body class="bg-gray-50">                    <!-- Фон страницы -->
<div class="bg-gray-100">                    <!-- Карточки -->
<section class="bg-white">                   <!-- Основные секции -->
<footer class="bg-gray-800 text-white">      <!-- Footer -->
```

**Текст:**
```html
<h1 class="text-gray-900">Заголовок H1</h1>
<p class="text-gray-700">Основной текст</p>
<span class="text-gray-500">Вторичный текст</span>
<small class="text-gray-400">Мелкий текст</small>
```

**Бордеры:**
```html
<div class="border border-gray-200">Светлый бордер</div>
<div class="border border-gray-300">Стандартный бордер</div>
<div class="divide-y divide-gray-200">Разделители</div>
```

---

## 📊 Таблица применения цветов

| Элемент | Цвет | Tailwind | SCSS |
|---------|------|----------|------|
| **Кнопки** |
| Primary CTA | Orange | `bg-primary` | `$primary-500` |
| Secondary | Purple | `bg-secondary` | `$secondary-500` |
| Danger | Red | `bg-error` | `$error` |
| Ghost | Transparent | `bg-transparent border-gray-300` | - |
| **Текст** |
| Заголовки | Dark Gray | `text-gray-900` | `$gray-900` |
| Основной | Gray | `text-gray-700` | `$gray-700` |
| Вторичный | Light Gray | `text-gray-500` | `$gray-500` |
| Цена | Orange | `text-primary` | `$primary-500` |
| Ссылки | Orange hover | `hover:text-primary` | - |
| **Badges** |
| Успех | Green | `bg-success` | `$success` |
| Ошибка | Red | `bg-error` | `$error` |
| Инфо | Blue | `bg-info` | `$info` |
| Новинка | Blue | `bg-info` | `$info` |
| В наличии | Green | `bg-success` | `$success` |
| Нет в наличии | Red | `bg-error` | `$error` |
| **Фоны** |
| Страница | Very Light Gray | `bg-gray-50` | `$gray-50` |
| Карточка | White | `bg-white` | `$white` |
| Альтернативный | Light Gray | `bg-gray-100` | `$gray-100` |
| Footer | Dark Gray Gradient | `bg-gradient-footer` | `$gradient-footer` |
| **Бордеры** |
| Светлый | Light Gray | `border-gray-200` | `$gray-200` |
| Стандартный | Gray | `border-gray-300` | `$gray-300` |
| Акцентный | Orange | `border-primary` | `$primary-500` |

---

## ✅ Правила использования

### ❌ НЕ ДЕЛАЙТЕ:

```scss
// ❌ Хардкод цветов
.button {
  background: #f59e0b;
  color: #ffffff;
}

// ❌ Случайные оттенки
.accent {
  background: #f5a623;  // Несистемный оранжевый
}

// ❌ Смешивание разных палитр
.element {
  color: #6366f1;      // Индиго
  border: 1px solid #8b5cf6;  // Фиолетовый - несочетаемо
}
```

### ✅ ДЕЛАЙТЕ:

```scss
// ✅ Используйте переменные
.button {
  background: $primary-500;
  color: $white;
}

// ✅ Используйте системные оттенки
.accent {
  background: $primary-400;  // Светлый из палитры
}

// ✅ Согласованные цвета
.element {
  color: $primary-500;
  border: 1px solid $primary-600;  // Темнее того же цвета
}
```

### Tailwind:

```html
<!-- ❌ НЕ ДЕЛАЙТЕ -->
<div style="background: #f59e0b;">

<!-- ✅ ДЕЛАЙТЕ -->
<div class="bg-primary-500">
<div class="bg-primary">
```

---

## 🎯 Рекомендации по комбинированию

### Основные комбинации:

1. **Primary + White**
   ```html
   <button class="bg-primary-500 text-white">Кнопка</button>
   ```

2. **Primary + Gray**
   ```html
   <div class="bg-gray-50 border-2 border-primary-500">
   ```

3. **Градиент + White text**
   ```html
   <div class="bg-gradient-primary text-white">
   ```

4. **Gray scale для текста**
   ```html
   <h1 class="text-gray-900">Заголовок</h1>
   <p class="text-gray-700">Текст</p>
   <small class="text-gray-500">Мелкий текст</small>
   ```

### Избегайте:

- ❌ Слишком много цветов на одном экране (максимум 3-4 цвета)
- ❌ Primary + Secondary вместе (слишком яркая комбинация)
- ❌ Разные оттенки одного цвета рядом (например, primary-400 и primary-600)
- ❌ Яркие цвета на ярких фонах

### Хорошие примеры:

```html
<!-- Hero секция -->
<section class="relative bg-white py-20">
  <div class="absolute inset-0 bg-gradient-hero opacity-5"></div>
  <h1 class="text-gray-900 text-5xl font-bold">Заголовок</h1>
  <p class="text-gray-600 text-xl">Подзаголовок</p>
  <button class="bg-gradient-primary text-white px-8 py-4 rounded-xl">
    Купить сейчас
  </button>
</section>

<!-- Карточка товара -->
<div class="bg-white rounded-xl shadow-lg p-6">
  <img src="..." alt="..." class="rounded-lg mb-4">
  <h3 class="text-gray-900 text-xl font-semibold">Название</h3>
  <p class="text-gray-600 mb-4">Описание</p>
  <div class="flex items-center justify-between">
    <span class="text-primary-500 text-2xl font-bold">25 000 ₽</span>
    <button class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg">
      В корзину
    </button>
  </div>
</div>
```

---

## 📝 Миграция старого кода

Если вы встретили хардкод цветов, замените их:

```scss
// Было → Стало
#f59e0b → $primary-500 или class="bg-primary-500"
#fbbf24 → $primary-light или class="bg-primary-light"
#ea580c → $primary-600 или class="bg-primary-600"
#8b5cf6 → $secondary-500 или class="bg-secondary-500"
#6366f1 → $indigo-500 или class="bg-indigo-500"
#ec4899 → $pink-500 или class="bg-pink-500"
#3b82f6 → $info или class="bg-info"
#10b981 → $success или class="bg-success"
#ef4444 → $error или class="bg-error"
```

---

**Версия:** 2.0.0
**Дата обновления:** 2025-11-04
**Статус:** ✅ Активная единая палитра
