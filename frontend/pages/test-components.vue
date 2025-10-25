<template>
  <div class="test-components">
    <div class="container">
      <h1 class="test-components__title">Тестирование UI Компонентов</h1>

      <!-- Buttons -->
      <section class="test-section">
        <h2>Кнопки (BaseButton)</h2>
        <div class="test-row">
          <BaseButton variant="primary">Primary</BaseButton>
          <BaseButton variant="secondary">Secondary</BaseButton>
          <BaseButton variant="outline">Outline</BaseButton>
          <BaseButton variant="ghost">Ghost</BaseButton>
          <BaseButton variant="danger">Danger</BaseButton>
        </div>
        <div class="test-row">
          <BaseButton variant="primary" size="sm">Small</BaseButton>
          <BaseButton variant="primary" size="md">Medium</BaseButton>
          <BaseButton variant="primary" size="lg">Large</BaseButton>
        </div>
        <div class="test-row">
          <BaseButton variant="primary" :loading="true">Loading</BaseButton>
          <BaseButton variant="primary" disabled>Disabled</BaseButton>
        </div>
      </section>

      <!-- Inputs -->
      <section class="test-section">
        <h2>Поля ввода (BaseInput)</h2>
        <div class="test-grid">
          <BaseInput
            v-model="testData.email"
            label="Email"
            type="email"
            placeholder="example@mail.ru"
            required
          />
          <BaseInput
            v-model="testData.password"
            label="Password"
            type="password"
            placeholder="Введите пароль"
            required
          />
          <BaseInput
            v-model="testData.search"
            label="Поиск"
            type="search"
            placeholder="Искать..."
          >
            <template #prefix>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" />
              </svg>
            </template>
          </BaseInput>
          <BaseInput
            label="Disabled"
            value="Disabled value"
            disabled
          />
          <BaseInput
            label="With Error"
            value="invalid value"
            error="Это поле заполнено неверно"
          />
          <BaseInput
            label="With Hint"
            placeholder="Enter something"
            hint="Подсказка для пользователя"
          />
        </div>
      </section>

      <!-- Select -->
      <section class="test-section">
        <h2>Выпадающие списки (BaseSelect)</h2>
        <div class="test-grid">
          <BaseSelect
            v-model="testData.category"
            :options="categoryOptions"
            label="Категория"
            placeholder="Выберите категорию"
          />
          <BaseSelect
            v-model="testData.sort"
            :options="sortOptions"
            label="Сортировка"
          />
        </div>
      </section>

      <!-- Textarea -->
      <section class="test-section">
        <h2>Текстовые области (BaseTextarea)</h2>
        <div class="test-grid">
          <BaseTextarea
            v-model="testData.comment"
            label="Комментарий"
            placeholder="Введите ваш комментарий..."
            :maxlength="200"
            :rows="4"
          />
          <BaseTextarea
            v-model="testData.description"
            label="Описание (Auto-resize)"
            placeholder="Начните вводить..."
            auto-resize
            :show-counter="false"
          />
        </div>
      </section>

      <!-- Checkboxes and Radios -->
      <section class="test-section">
        <h2>Чекбоксы и радио-кнопки</h2>
        <div class="test-grid">
          <div>
            <h3>BaseCheckbox</h3>
            <BaseCheckbox v-model="testData.acceptTerms" label="Я принимаю условия" />
            <BaseCheckbox v-model="testData.subscribe" label="Подписаться на рассылку" />
            <BaseCheckbox
              v-model="testData.notifications"
              label="Получать уведомления"
              hint="Вы будете получать уведомления на email"
            />
          </div>
          <div>
            <h3>BaseRadio</h3>
            <BaseRadio
              v-model="testData.gender"
              value="male"
              name="gender"
              label="Мужской"
            />
            <BaseRadio
              v-model="testData.gender"
              value="female"
              name="gender"
              label="Женский"
            />
            <BaseRadio
              v-model="testData.gender"
              value="other"
              name="gender"
              label="Другое"
            />
          </div>
        </div>
      </section>

      <!-- Badges -->
      <section class="test-section">
        <h2>Бейджи (BaseBadge)</h2>
        <div class="test-row">
          <BaseBadge variant="primary">Primary</BaseBadge>
          <BaseBadge variant="secondary">Secondary</BaseBadge>
          <BaseBadge variant="success">Success</BaseBadge>
          <BaseBadge variant="warning">Warning</BaseBadge>
          <BaseBadge variant="danger">Danger</BaseBadge>
          <BaseBadge variant="info">Info</BaseBadge>
          <BaseBadge variant="neutral">Neutral</BaseBadge>
        </div>
        <div class="test-row">
          <BaseBadge variant="primary" size="sm">Small</BaseBadge>
          <BaseBadge variant="primary" size="md">Medium</BaseBadge>
          <BaseBadge variant="primary" size="lg">Large</BaseBadge>
        </div>
        <div class="test-row">
          <BaseBadge variant="primary" rounded>Rounded</BaseBadge>
          <BaseBadge variant="success" outline>Outline</BaseBadge>
          <BaseBadge variant="danger" closable @close="handleBadgeClose">Closable</BaseBadge>
        </div>
      </section>

      <!-- Spinner -->
      <section class="test-section">
        <h2>Загрузка (BaseSpinner)</h2>
        <div class="test-row">
          <BaseSpinner size="sm" />
          <BaseSpinner size="md" />
          <BaseSpinner size="lg" />
          <BaseSpinner size="xl" />
        </div>
        <div class="test-row">
          <BaseSpinner variant="primary" text="Загрузка..." />
          <BaseSpinner variant="secondary" text="Подождите..." />
        </div>
      </section>

      <!-- Cards -->
      <section class="test-section">
        <h2>Карточки (BaseCard)</h2>
        <div class="test-grid">
          <BaseCard variant="default" title="Default Card" subtitle="With subtitle">
            <p>Контент карточки. Это базовый вариант с обводкой.</p>
          </BaseCard>

          <BaseCard variant="elevated" title="Elevated Card">
            <p>Карточка с тенью для визуального выделения.</p>
            <template #footer>
              <BaseButton variant="primary" size="sm">Действие</BaseButton>
            </template>
          </BaseCard>

          <BaseCard variant="outlined" title="Outlined Card" hoverable>
            <p>Карточка с рамкой и эффектом при наведении.</p>
          </BaseCard>

          <BaseCard clickable @click="handleCardClick">
            <template #header>
              <h3>Clickable Card</h3>
            </template>
            <p>Кликните на эту карточку чтобы увидеть событие в консоли.</p>
          </BaseCard>
        </div>
      </section>

      <!-- Modal -->
      <section class="test-section">
        <h2>Модальное окно (BaseModal)</h2>
        <div class="test-row">
          <BaseButton variant="primary" @click="showModal = true">
            Открыть модалку
          </BaseButton>
        </div>

        <BaseModal v-model="showModal" title="Тестовое модальное окно" size="md">
          <p>Это содержимое модального окна.</p>
          <p>Вы можете закрыть его нажав на крестик, клавишу Escape, или кликнув вне окна.</p>

          <template #footer>
            <BaseButton variant="outline" @click="showModal = false">
              Отмена
            </BaseButton>
            <BaseButton variant="primary" @click="showModal = false">
              Подтвердить
            </BaseButton>
          </template>
        </BaseModal>
      </section>

      <!-- Mock Product Card -->
      <section class="test-section">
        <h2>Карточка товара (ProductCard)</h2>
        <div class="test-row">
          <div style="width: 300px">
            <ProductCard :product="mockProduct" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const testData = ref({
  email: '',
  password: '',
  search: '',
  category: '',
  sort: 'popular',
  comment: '',
  description: '',
  acceptTerms: false,
  subscribe: false,
  notifications: false,
  gender: 'male',
});

const showModal = ref(false);

const categoryOptions = [
  { label: 'Все категории', value: '' },
  { label: 'Электроника', value: 'electronics' },
  { label: 'Одежда', value: 'clothing' },
  { label: 'Книги', value: 'books' },
];

const sortOptions = [
  { label: 'По популярности', value: 'popular' },
  { label: 'Сначала дешевые', value: 'price_asc' },
  { label: 'Сначала дорогие', value: 'price_desc' },
];

const mockProduct = ref({
  _id: '1',
  name: 'Тестовый товар',
  slug: 'test-product',
  description: {
    short: 'Это краткое описание тестового товара для демонстрации компонента ProductCard.',
    full: 'Полное описание',
  },
  price: 15990,
  oldPrice: 19990,
  images: [
    {
      url: 'https://via.placeholder.com/400',
      alt: 'Тестовое изображение',
      isPrimary: true,
    },
  ],
  category: '1',
  rating: {
    average: 4.5,
    count: 128,
  },
  stock: {
    quantity: 10,
    reserved: 0,
  },
  isActive: true,
  createdAt: new Date().toISOString(),
});

const handleBadgeClose = () => {
  console.log('Badge closed');
};

const handleCardClick = () => {
  console.log('Card clicked');
  alert('Карточка была нажата!');
};

// SEO
useHead({
  title: 'Тестирование компонентов',
  meta: [{ name: 'robots', content: 'noindex' }],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.test-components {
  min-height: 100vh;
  padding: $spacing-xl 0;
  background: $gray-50;

  &__title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin: 0 0 $spacing-xl 0;
    text-align: center;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}

.test-section {
  margin-bottom: $spacing-2xl;
  padding: $spacing-xl;
  background: $white;
  border-radius: $radius-lg;
  box-shadow: $shadow-sm;

  h2 {
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0 0 $spacing-lg 0;
    padding-bottom: $spacing-md;
    border-bottom: 2px solid $gray-200;
  }

  h3 {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $gray-800;
    margin: 0 0 $spacing-md 0;
  }
}

.test-row {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-md;
  align-items: center;
  margin-bottom: $spacing-md;

  &:last-child {
    margin-bottom: 0;
  }
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-lg;
}
</style>
