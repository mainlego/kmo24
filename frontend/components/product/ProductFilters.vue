<template>
  <div class="product-filters">
    <div class="product-filters__header">
      <h3 class="product-filters__title">Фильтры</h3>
      <button
        v-if="hasActiveFilters"
        class="product-filters__reset"
        type="button"
        @click="handleReset"
      >
        Сбросить
      </button>
    </div>

    <div class="product-filters__body">
      <!-- Search -->
      <div class="product-filters__section">
        <BaseInput
          v-model="localFilters.search"
          type="search"
          placeholder="Поиск товаров..."
          @input="handleSearchInput"
        >
          <template #prefix>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </template>
        </BaseInput>
      </div>

      <!-- Category -->
      <div v-if="categories && categories.length > 0" class="product-filters__section">
        <h4 class="product-filters__section-title">Категория</h4>
        <BaseSelect
          v-model="localFilters.category"
          :options="categoryOptions"
          placeholder="Все категории"
          @change="handleFilterChange"
        />
      </div>

      <!-- Price Range -->
      <div class="product-filters__section">
        <h4 class="product-filters__section-title">Цена</h4>
        <div class="product-filters__price-inputs">
          <BaseInput
            v-model="localFilters.minPrice"
            type="number"
            placeholder="От"
            min="0"
            @input="handlePriceChange"
          />
          <span class="product-filters__price-separator">—</span>
          <BaseInput
            v-model="localFilters.maxPrice"
            type="number"
            placeholder="До"
            min="0"
            @input="handlePriceChange"
          />
        </div>
      </div>

      <!-- In Stock -->
      <div class="product-filters__section">
        <BaseCheckbox
          v-model="localFilters.inStock"
          label="Только в наличии"
          @change="handleFilterChange"
        />
      </div>

      <!-- Sort -->
      <div class="product-filters__section">
        <h4 class="product-filters__section-title">Сортировка</h4>
        <BaseSelect
          v-model="localFilters.sort"
          :options="sortOptions"
          @change="handleFilterChange"
        />
      </div>

      <!-- Active Filters Tags -->
      <div v-if="hasActiveFilters" class="product-filters__section">
        <h4 class="product-filters__section-title">Активные фильтры</h4>
        <div class="product-filters__tags">
          <BaseBadge
            v-if="localFilters.search"
            closable
            @close="clearSearch"
          >
            Поиск: {{ localFilters.search }}
          </BaseBadge>
          <BaseBadge
            v-if="localFilters.category"
            closable
            @close="clearCategory"
          >
            {{ getCategoryName(localFilters.category) }}
          </BaseBadge>
          <BaseBadge
            v-if="localFilters.minPrice"
            closable
            @close="clearMinPrice"
          >
            От {{ formatPrice(localFilters.minPrice) }}
          </BaseBadge>
          <BaseBadge
            v-if="localFilters.maxPrice"
            closable
            @close="clearMaxPrice"
          >
            До {{ formatPrice(localFilters.maxPrice) }}
          </BaseBadge>
          <BaseBadge
            v-if="localFilters.inStock"
            closable
            @close="clearInStock"
          >
            В наличии
          </BaseBadge>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { ProductFilters as Filters, Category } from '~/types';

interface Props {
  filters: Filters;
  categories?: Category[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:filters': [filters: Filters];
}>();

const localFilters = ref<Filters>({ ...props.filters });
let searchTimeout: NodeJS.Timeout | null = null;

const sortOptions = [
  { label: 'По популярности', value: 'popular' },
  { label: 'Сначала дешевые', value: 'price_asc' },
  { label: 'Сначала дорогие', value: 'price_desc' },
  { label: 'По рейтингу', value: 'rating' },
  { label: 'Сначала новые', value: 'newest' },
  { label: 'По названию (А-Я)', value: 'name_asc' },
  { label: 'По названию (Я-А)', value: 'name_desc' },
];

const categoryOptions = computed(() => {
  if (!props.categories) return [];
  return [
    { label: 'Все категории', value: '' },
    ...props.categories.map((cat) => ({
      label: cat.name,
      value: cat._id,
    })),
  ];
});

const hasActiveFilters = computed(() => {
  return !!(
    localFilters.value.search ||
    localFilters.value.category ||
    localFilters.value.minPrice ||
    localFilters.value.maxPrice ||
    localFilters.value.inStock
  );
});

const getCategoryName = (categoryId: string): string => {
  const category = props.categories?.find((cat) => cat._id === categoryId);
  return category?.name || 'Категория';
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const handleSearchInput = () => {
  // Debounce search input
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    handleFilterChange();
  }, 500);
};

const handlePriceChange = () => {
  // Convert to numbers
  if (localFilters.value.minPrice) {
    localFilters.value.minPrice = Number(localFilters.value.minPrice);
  }
  if (localFilters.value.maxPrice) {
    localFilters.value.maxPrice = Number(localFilters.value.maxPrice);
  }

  // Debounce price input
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    handleFilterChange();
  }, 500);
};

const handleFilterChange = () => {
  emit('update:filters', { ...localFilters.value });
};

const handleReset = () => {
  localFilters.value = {
    search: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    inStock: false,
    sort: 'popular',
  };
  handleFilterChange();
};

const clearSearch = () => {
  localFilters.value.search = '';
  handleFilterChange();
};

const clearCategory = () => {
  localFilters.value.category = '';
  handleFilterChange();
};

const clearMinPrice = () => {
  localFilters.value.minPrice = undefined;
  handleFilterChange();
};

const clearMaxPrice = () => {
  localFilters.value.maxPrice = undefined;
  handleFilterChange();
};

const clearInStock = () => {
  localFilters.value.inStock = false;
  handleFilterChange();
};

// Sync local filters with prop changes
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters };
  },
  { deep: true }
);
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-filters {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;
  padding: $spacing-xl;
  background: $white;
  border: 2px solid transparent;
  border-radius: $radius-2xl;
  box-shadow: $shadow-lg;
  position: relative;
  overflow: hidden;
  transition: all $transition-slow $transition-ease;

  // Premium gradient border
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: $radius-2xl;
    padding: 2px;
    background: $gradient-primary;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.3;
  }

  // Decorative orb
  &::after {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 150px;
    height: 150px;
    background: $gradient-cosmic;
    opacity: 0.05;
    border-radius: 50%;
    filter: blur(40px);
    pointer-events: none;
  }

  &:hover {
    box-shadow: $shadow-xl, $shadow-colored;
    transform: translateY(-2px);

    &::before {
      opacity: 0.5;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: $spacing-lg;
    border-bottom: 2px solid transparent;
    background: linear-gradient($white, $white) padding-box,
                $gradient-primary border-box;
    border-image-slice: 0 0 1 0;
    position: relative;
    z-index: 1;
  }

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    background: $gradient-primary;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    letter-spacing: -0.5px;
  }

  &__reset {
    padding: $spacing-sm $spacing-lg;
    border: 2px solid transparent;
    background: linear-gradient($white, $white) padding-box,
                $gradient-secondary border-box;
    color: $primary;
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    cursor: pointer;
    border-radius: $radius-xl;
    transition: all $transition-slow $transition-ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: $gradient-secondary;
      opacity: 0;
      transition: opacity $transition-base $transition-ease;
    }

    span {
      position: relative;
      z-index: 1;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-md;
      color: $white;

      &::before {
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
    position: relative;
    z-index: 1;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    animation: slideDown 0.4s $transition-ease;
    animation-fill-mode: both;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.05}s;
      }
    }
  }

  &__section-title {
    font-size: $font-size-sm;
    font-weight: $font-weight-bold;
    background: linear-gradient(135deg, $gray-900 0%, $primary 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    padding-bottom: $spacing-xs;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30px;
      height: 2px;
      background: $gradient-primary;
      border-radius: $radius-full;
    }
  }

  &__price-inputs {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: $spacing-sm;
    width: 100%;

    // Ensure inputs don't overflow
    > * {
      min-width: 0;
    }
  }

  &__price-separator {
    color: $gray-400;
    font-weight: $font-weight-bold;
    font-size: $font-size-lg;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;

    :deep(.base-badge) {
      background: linear-gradient(135deg, rgba($primary, 0.1) 0%, rgba($secondary, 0.15) 100%);
      border: 1px solid rgba($primary, 0.3);
      font-weight: $font-weight-semibold;
      padding: $spacing-xs $spacing-md;
      transition: all $transition-base $transition-ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-sm;
        background: linear-gradient(135deg, rgba($primary, 0.15) 0%, rgba($secondary, 0.2) 100%);
      }
    }
  }

  // Premium styling for child components
  :deep(.base-input) {
    border: 2px solid $gray-200;
    border-radius: $radius-xl;
    transition: all $transition-base $transition-ease;

    &:focus-within {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }
  }

  // Specific styling for price inputs
  &__price-inputs :deep(.base-input) {
    min-width: 0;
    width: 100%;
  }

  :deep(.base-select) {
    border: 2px solid $gray-200;
    border-radius: $radius-xl;
    transition: all $transition-base $transition-ease;

    &:focus-within {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }
  }

  :deep(.base-checkbox) {
    .checkbox {
      border: 2px solid $gray-300;
      border-radius: $radius-md;
      transition: all $transition-base $transition-ease;

      &:checked {
        background: $gradient-primary;
        border-color: $primary;
      }
    }

    label {
      font-weight: $font-weight-medium;
      color: $gray-700;
      transition: color $transition-base $transition-ease;

      &:hover {
        color: $primary;
      }
    }
  }

  @media (max-width: $breakpoint-md) {
    padding: $spacing-lg;
    gap: $spacing-lg;
  }
}
</style>
