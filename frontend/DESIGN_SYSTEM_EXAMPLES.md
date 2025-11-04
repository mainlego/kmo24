# Примеры использования дизайн-системы КМО24

Практические примеры использования компонентов, миксинов и утилит дизайн-системы.

---

## 🎨 Цвета

### Использование в SCSS

```scss
// ❌ НЕПРАВИЛЬНО
.button {
  background: #f59e0b;
  color: #ffffff;
  border: 1px solid #3b82f6;
}

// ✅ ПРАВИЛЬНО
.button {
  background: $primary;
  color: $white;
  border: 1px solid $info;
}
```

### Использование в Tailwind

```vue
<template>
  <!-- ❌ НЕПРАВИЛЬНО -->
  <div style="background: #f59e0b; color: white;">

  <!-- ✅ ПРАВИЛЬНО -->
  <div class="bg-primary text-white">
    <p class="text-gray-500">Второстепенный текст</p>
    <span class="text-error">Ошибка</span>
    <span class="text-success">Успех</span>
  </div>
</template>
```

### Градиенты

```vue
<template>
  <!-- Tailwind классы -->
  <button class="bg-gradient-primary text-white">
    Премиум кнопка
  </button>

  <div class="bg-gradient-cosmic">
    Космический эффект
  </div>
</template>

<style lang="scss" scoped>
// SCSS переменные
.hero-section {
  background: $gradient-primary;
}

.premium-card {
  background: $gradient-sunset;
}
</style>
```

---

## 🔘 Кнопки

### Использование компонента

```vue
<template>
  <div>
    <!-- Primary кнопка -->
    <BaseButton variant="primary" size="md">
      Купить товар
    </BaseButton>

    <!-- Secondary кнопка -->
    <BaseButton variant="secondary" size="md">
      В корзину
    </BaseButton>

    <!-- Ghost кнопка -->
    <BaseButton variant="ghost" size="sm">
      Отмена
    </BaseButton>

    <!-- С иконкой -->
    <BaseButton variant="primary">
      <IconCart class="w-5 h-5" />
      Добавить в корзину
    </BaseButton>

    <!-- Disabled состояние -->
    <BaseButton variant="primary" :disabled="true">
      Недоступно
    </BaseButton>

    <!-- Loading состояние -->
    <BaseButton variant="primary" :loading="isLoading">
      Отправить
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
const isLoading = ref(false)
</script>
```

### Кастомная кнопка с миксинами

```vue
<template>
  <button class="custom-button">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.custom-button {
  @include button-base;
  @include button-primary;
  @include button-size(md);

  // Дополнительные стили
  &:hover {
    @include hover-lift(-4px);
  }
}
</style>
```

---

## 🃏 Карточки

### Использование компонента

```vue
<template>
  <!-- Карточка с тенью -->
  <BaseCard variant="elevated">
    <template #header>
      <h3>Название товара</h3>
    </template>

    <p>Описание товара...</p>

    <template #footer>
      <BaseButton variant="primary">Подробнее</BaseButton>
    </template>
  </BaseCard>

  <!-- Карточка с бордером -->
  <BaseCard variant="outlined">
    <p>Информационная карточка</p>
  </BaseCard>

  <!-- Плоская карточка -->
  <BaseCard variant="flat">
    <p>Простая карточка без теней</p>
  </BaseCard>
</template>
```

### Кастомная карточка товара

```vue
<template>
  <div class="product-card">
    <div class="product-card__image">
      <img :src="product.image" :alt="product.name" />
      <BaseBadge variant="success" class="product-card__badge">
        Новинка
      </BaseBadge>
    </div>

    <div class="product-card__content">
      <h3 class="product-card__title">{{ product.name }}</h3>
      <p class="product-card__price">{{ formatPrice(product.price) }}</p>

      <BaseButton variant="primary" class="product-card__button">
        В корзину
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.product-card {
  @include card-elevated;
  @include product-card-hover;
  position: relative;
  overflow: hidden;

  &__image {
    @include aspect-ratio(1, 1);
    position: relative;

    img {
      transition: transform $transition-base $transition-ease;
    }
  }

  &__badge {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
  }

  &__content {
    padding: $spacing-lg;
  }

  &__title {
    @include text-clamp(2);
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin-bottom: $spacing-sm;
  }

  &__price {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $primary;
    margin-bottom: $spacing-md;
  }

  &__button {
    width: 100%;
  }
}
</style>
```

---

## 📝 Формы

### Использование компонентов

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Input -->
    <BaseInput
      v-model="form.name"
      label="Имя"
      placeholder="Введите ваше имя"
      :error="errors.name"
      required
    />

    <!-- Input с иконкой -->
    <BaseInput
      v-model="form.email"
      label="Email"
      type="email"
      placeholder="your@email.com"
      :error="errors.email"
    >
      <template #icon>
        <IconMail class="w-5 h-5" />
      </template>
    </BaseInput>

    <!-- Textarea -->
    <BaseTextarea
      v-model="form.message"
      label="Сообщение"
      placeholder="Введите ваше сообщение"
      :rows="4"
      :error="errors.message"
    />

    <!-- Select -->
    <BaseSelect
      v-model="form.category"
      label="Категория"
      :options="categoryOptions"
      placeholder="Выберите категорию"
      :error="errors.category"
    />

    <!-- Checkbox -->
    <BaseCheckbox v-model="form.agree">
      Я согласен с условиями использования
    </BaseCheckbox>

    <!-- Radio группа -->
    <div class="form-group">
      <label class="form-label">Доставка</label>
      <BaseRadio v-model="form.delivery" value="pickup">
        Самовывоз
      </BaseRadio>
      <BaseRadio v-model="form.delivery" value="courier">
        Курьером
      </BaseRadio>
    </div>

    <!-- Кнопка отправки -->
    <BaseButton
      type="submit"
      variant="primary"
      :loading="isSubmitting"
    >
      Отправить
    </BaseButton>
  </form>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  message: '',
  category: null,
  agree: false,
  delivery: 'pickup',
})

const errors = reactive({
  name: '',
  email: '',
  message: '',
  category: '',
})

const isSubmitting = ref(false)

const categoryOptions = [
  { value: 1, label: 'Холодильное оборудование' },
  { value: 2, label: 'Мебель для кафе' },
  { value: 3, label: 'Посуда' },
]

async function handleSubmit() {
  isSubmitting.value = true
  // Обработка формы...
  isSubmitting.value = false
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.form-group {
  margin-bottom: $spacing-lg;
}

.form-label {
  @include form-label;
}
</style>
```

### Кастомный input с миксинами

```vue
<template>
  <div class="custom-input">
    <label v-if="label" class="custom-input__label">
      {{ label }}
    </label>
    <input
      v-model="modelValue"
      :type="type"
      :placeholder="placeholder"
      class="custom-input__field"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="error" class="custom-input__error">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  error?: string
}>()

defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.custom-input {
  &__label {
    @include form-label;
  }

  &__field {
    @include input-base;
  }

  &__error {
    @include form-error;
  }
}
</style>
```

---

## 🏷️ Badges (Бейджи)

```vue
<template>
  <div class="badges-demo">
    <!-- Варианты -->
    <BaseBadge variant="primary">Primary</BaseBadge>
    <BaseBadge variant="success">Success</BaseBadge>
    <BaseBadge variant="error">Error</BaseBadge>
    <BaseBadge variant="warning">Warning</BaseBadge>
    <BaseBadge variant="info">Info</BaseBadge>

    <!-- Размеры -->
    <BaseBadge size="sm">Маленький</BaseBadge>
    <BaseBadge size="md">Средний</BaseBadge>
    <BaseBadge size="lg">Большой</BaseBadge>

    <!-- С иконкой -->
    <BaseBadge variant="success">
      <IconCheck class="w-4 h-4" />
      Проверено
    </BaseBadge>

    <!-- Статусы товаров -->
    <BaseBadge variant="success">В наличии</BaseBadge>
    <BaseBadge variant="warning">Мало</BaseBadge>
    <BaseBadge variant="error">Нет в наличии</BaseBadge>
  </div>
</template>
```

---

## 🔄 Анимации

### Готовые классы

```vue
<template>
  <!-- Появление -->
  <div class="animate-fade-in">
    Плавное появление
  </div>

  <!-- Появление снизу -->
  <div class="animate-fade-in-up">
    Появление с движением вверх
  </div>

  <!-- Слайд вниз (для dropdown) -->
  <div class="animate-slide-down">
    Выпадающее меню
  </div>

  <!-- Пульсация -->
  <div class="animate-pulse">
    Привлечение внимания
  </div>

  <!-- Подпрыгивание -->
  <div class="animate-bounce">
    Подпрыгивающий элемент
  </div>

  <!-- Плавание -->
  <div class="animate-float">
    Плавающий элемент
  </div>

  <!-- Вращение (для спиннеров) -->
  <div class="animate-rotate">
    Загрузка...
  </div>

  <!-- Переливание (для skeleton) -->
  <div class="animate-shimmer">
    Загрузка контента
  </div>

  <!-- Свечение -->
  <div class="animate-glow">
    Светящийся элемент
  </div>
</template>
```

### Кастомные анимации

```vue
<template>
  <div class="premium-button">
    Премиум кнопка с блеском
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.premium-button {
  @include button-primary;
  @include shimmer-effect;
  position: relative;
  overflow: hidden;

  // Анимации уже доступны глобально из _animations.scss
  &:hover {
    animation: pulse 2s infinite;
  }
}
</style>
```

---

## 📱 Responsive дизайн

### Использование миксинов

```vue
<template>
  <div class="responsive-section">
    <h1 class="responsive-section__title">Заголовок</h1>
    <div class="responsive-section__grid">
      <div class="card">Карточка 1</div>
      <div class="card">Карточка 2</div>
      <div class="card">Карточка 3</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.responsive-section {
  @include container;
  padding: $spacing-lg;

  // На планшетах увеличиваем отступы
  @include respond-to(md) {
    padding: $spacing-xl;
  }

  // На десктопах еще больше
  @include respond-to(lg) {
    padding: $spacing-2xl;
  }

  &__title {
    font-size: $font-size-2xl;

    @include respond-to(md) {
      font-size: $font-size-3xl;
    }

    @include respond-to(lg) {
      font-size: $font-size-4xl;
    }
  }

  &__grid {
    display: grid;
    gap: $spacing-md;
    grid-template-columns: 1fr;

    // На планшетах - 2 колонки
    @include respond-to(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    // На десктопах - 3 колонки
    @include respond-to(lg) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
```

### Использование Tailwind

```vue
<template>
  <div class="container mx-auto p-lg md:p-xl lg:p-2xl">
    <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
      Заголовок
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
      <div class="card">Карточка 1</div>
      <div class="card">Карточка 2</div>
      <div class="card">Карточка 3</div>
    </div>
  </div>
</template>
```

---

## 🎭 Специальные эффекты

### Эффект стекла (glassmorphism)

```vue
<template>
  <div class="glass-card">
    <h3>Стеклянная карточка</h3>
    <p>С эффектом размытия фона</p>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.glass-card {
  @include glass-effect(0.9);
  padding: $spacing-xl;
  border-radius: $radius-2xl;
  box-shadow: $shadow-xl;
}
</style>
```

### Skeleton загрузчик

```vue
<template>
  <div v-if="loading" class="skeleton-wrapper">
    <div class="skeleton-title"></div>
    <div class="skeleton-text"></div>
    <div class="skeleton-text"></div>
  </div>
  <div v-else>
    <!-- Реальный контент -->
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.skeleton-title {
  @include skeleton-loader;
  height: 32px;
  width: 70%;
  margin-bottom: $spacing-md;
}

.skeleton-text {
  @include skeleton-loader;
  height: 20px;
  width: 100%;
  margin-bottom: $spacing-sm;
}
</style>
```

### Hover эффект подъема

```vue
<template>
  <div class="product-card">
    <img :src="product.image" alt="" />
    <h3>{{ product.name }}</h3>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.product-card {
  @include card-elevated;
  @include hover-lift(-8px); // Поднимется на 8px при hover
  cursor: pointer;
}
</style>
```

---

## 🎯 Готовые паттерны

### Hero секция

```vue
<template>
  <section class="hero">
    <div class="hero__content">
      <h1 class="hero__title">
        Профессиональное оборудование
      </h1>
      <p class="hero__subtitle">
        Для кафе и ресторанов в Красноярске
      </p>
      <BaseButton variant="primary" size="lg" class="hero__button">
        Смотреть каталог
      </BaseButton>
    </div>

    <div class="hero__background"></div>
  </section>
</template>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.hero {
  @include container;
  position: relative;
  min-height: 600px;
  display: flex;
  align-items: center;
  padding: $spacing-2xl $spacing-lg;

  @include respond-to(lg) {
    padding: $spacing-3xl $spacing-xl;
  }

  &__content {
    position: relative;
    z-index: 2;
    max-width: 600px;
  }

  &__title {
    @include section-title;
    @include text-gradient($gradient-primary);
    font-size: clamp($font-size-3xl, 5vw, $font-size-5xl);
    margin-bottom: $spacing-lg;
    animation: fadeInUp 0.8s $transition-ease;
  }

  &__subtitle {
    font-size: $font-size-xl;
    color: $gray-600;
    margin-bottom: $spacing-xl;
    animation: fadeInUp 0.8s $transition-ease 0.2s both;
  }

  &__button {
    animation: fadeInUp 0.8s $transition-ease 0.4s both;
  }

  &__background {
    @include full-overlay;
    background: $gradient-cosmic;
    opacity: 0.05;
    border-radius: $radius-2xl;
    animation: meshRotate 20s infinite;
  }
}
</style>
```

### Сетка товаров

```vue
<template>
  <div class="products-grid">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>

<style lang="scss" scoped>
.products-grid {
  display: grid;
  gap: $spacing-lg;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  @include respond-to(md) {
    gap: $spacing-xl;
  }
}
</style>
```

### Модальное окно

```vue
<template>
  <BaseModal v-model="isOpen" title="Добавлено в корзину">
    <div class="modal-content">
      <img :src="product.image" alt="" class="modal-content__image" />
      <h3 class="modal-content__title">{{ product.name }}</h3>
      <p class="modal-content__price">{{ formatPrice(product.price) }}</p>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="isOpen = false">
        Продолжить покупки
      </BaseButton>
      <BaseButton variant="primary" @click="goToCart">
        Перейти в корзину
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
const isOpen = ref(false)

function goToCart() {
  navigateTo('/cart')
}
</script>

<style lang="scss" scoped>
.modal-content {
  text-align: center;
  padding: $spacing-lg;

  &__image {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: $radius-xl;
    margin: 0 auto $spacing-lg;
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    margin-bottom: $spacing-sm;
  }

  &__price {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $primary;
  }
}
</style>
```

---

## ✅ Чек-лист использования

При создании нового компонента проверьте:

- [ ] Используются переменные цветов, а не хардкод
- [ ] Используются системные отступы ($spacing-*)
- [ ] Используются миксины вместо дублирования кода
- [ ] Используются готовые анимации из _animations.scss
- [ ] Добавлены responsive стили для всех breakpoints
- [ ] Компонент доступен (accessibility)
- [ ] Есть hover/focus состояния
- [ ] Есть disabled/loading состояния (если применимо)

---

**Больше примеров в [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)**
