<template>
  <div class="smart-search" :class="{ 'smart-search--open': isOpen }">
    <div class="smart-search__input-wrapper">
      <svg class="smart-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="smart-search__input"
        placeholder="Поиск товаров..."
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown.down="selectNext"
        @keydown.up="selectPrev"
        @keydown.enter="selectCurrent"
        @keydown.esc="closeSearch"
      />
      <button
        v-if="searchQuery"
        class="smart-search__clear"
        @click="clearSearch"
        aria-label="Очистить"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <Transition name="fade-slide">
      <div v-if="isOpen && (searchResults.length > 0 || isLoading)" class="smart-search__dropdown">
        <div v-if="isLoading" class="smart-search__loading">
          <div class="spinner"></div>
          <span>Поиск...</span>
        </div>

        <div v-else-if="searchResults.length > 0" class="smart-search__results">
          <div class="smart-search__results-header">
            <span>Найдено: {{ searchResults.length }}</span>
          </div>
          <div
            v-for="(product, index) in searchResults"
            :key="product._id"
            class="smart-search__item"
            :class="{ 'smart-search__item--selected': selectedIndex === index }"
            @mousedown.prevent="selectProduct(product)"
            @mouseenter="selectedIndex = index"
          >
            <div class="smart-search__item-image">
              <img :src="product.images[0]" :alt="product.name" loading="lazy" />
            </div>
            <div class="smart-search__item-content">
              <h4 class="smart-search__item-title">{{ product.name }}</h4>
              <p class="smart-search__item-category">{{ product.category.name }}</p>
            </div>
            <div class="smart-search__item-price">
              {{ formatPrice(product.price) }}
            </div>
          </div>
        </div>

        <div v-else class="smart-search__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>Ничего не найдено</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { Product } from '~/types';
import { mockProducts } from '~/mocks/products';

const searchQuery = ref('');
const isOpen = ref(false);
const isLoading = ref(false);
const searchResults = ref<Product[]>([]);
const selectedIndex = ref(-1);
const searchInput = ref<HTMLInputElement | null>(null);
let searchTimeout: NodeJS.Timeout | null = null;

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const performSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  isLoading.value = true;

  // Имитация задержки поиска
  setTimeout(() => {
    const query = searchQuery.value.toLowerCase();
    searchResults.value = mockProducts.filter((product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.name.toLowerCase().includes(query)
    ).slice(0, 8); // Показываем максимум 8 результатов

    isLoading.value = false;
  }, 300);
};

const handleInput = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    performSearch();
  }, 300);
};

const handleFocus = () => {
  isOpen.value = true;
  if (searchQuery.value.trim()) {
    performSearch();
  }
};

const handleBlur = () => {
  // Небольшая задержка, чтобы клик по результату успел сработать
  setTimeout(() => {
    isOpen.value = false;
  }, 200);
};

const clearSearch = () => {
  searchQuery.value = '';
  searchResults.value = [];
  selectedIndex.value = -1;
};

const closeSearch = () => {
  isOpen.value = false;
  searchInput.value?.blur();
};

const selectNext = () => {
  if (selectedIndex.value < searchResults.value.length - 1) {
    selectedIndex.value++;
  }
};

const selectPrev = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
};

const selectCurrent = () => {
  if (selectedIndex.value >= 0 && selectedIndex.value < searchResults.value.length) {
    selectProduct(searchResults.value[selectedIndex.value]);
  }
};

const emit = defineEmits<{
  close: []
}>();

const selectProduct = (product: Product) => {
  navigateTo(`/products/${product.slug}`);
  closeSearch();
  clearSearch();
  emit('close');
};

// Закрывать поиск при клике вне области
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.smart-search')) {
    closeSearch();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});

// Сбрасывать выбранный индекс при изменении результатов
watch(searchResults, () => {
  selectedIndex.value = -1;
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.smart-search {
  position: relative;
  width: 100%;
  max-width: 500px;

  &__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-lg;
    background: rgba($white, 0.95);
    border: 2px solid transparent;
    border-radius: $radius-full;
    transition: all $transition-base $transition-ease;
    backdrop-filter: blur(10px);

    .smart-search--open & {
      border-color: $primary;
      box-shadow: 0 0 0 4px rgba($primary, 0.1), $shadow-xl;
    }

    &:hover {
      background: $white;
      box-shadow: $shadow-md;
    }
  }

  &__icon {
    color: $gray-400;
    flex-shrink: 0;
    transition: color $transition-base $transition-ease;

    .smart-search--open & {
      color: $primary;
    }
  }

  &__input {
    flex: 1;
    border: none;
    outline: none;
    font-size: $font-size-base;
    font-family: $font-family-base;
    color: $gray-900;
    background: transparent;
    min-width: 0;

    &::placeholder {
      color: $gray-400;
    }
  }

  &__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-xs;
    border: none;
    background: rgba($gray-300, 0.5);
    border-radius: 50%;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    color: $gray-600;

    &:hover {
      background: $gray-300;
      color: $gray-900;
      transform: scale(1.1);
    }
  }

  &__dropdown {
    position: absolute;
    top: calc(100% + $spacing-sm);
    left: 0;
    right: 0;
    background: $white;
    border-radius: $radius-2xl;
    box-shadow: $shadow-xl;
    border: 1px solid $gray-200;
    overflow: hidden;
    z-index: 1000;
    max-height: 500px;
    overflow-y: auto;
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    padding: $spacing-2xl;
    color: $gray-600;

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid $gray-300;
      border-top-color: $primary;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  }

  &__results {
    display: flex;
    flex-direction: column;
  }

  &__results-header {
    padding: $spacing-md $spacing-lg;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $gray-600;
    background: $gray-50;
    border-bottom: 1px solid $gray-200;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md $spacing-lg;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    border-bottom: 1px solid $gray-100;

    &:last-child {
      border-bottom: none;
    }

    &:hover,
    &--selected {
      background: rgba($primary, 0.05);
    }

    &--selected {
      border-left: 3px solid $primary;
    }
  }

  &__item-image {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
    border-radius: $radius-lg;
    overflow: hidden;
    background: $gray-100;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__item-content {
    flex: 1;
    min-width: 0;
  }

  &__item-title {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0 0 $spacing-xs 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__item-category {
    font-size: $font-size-sm;
    color: $gray-600;
    margin: 0;
  }

  &__item-price {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $primary;
    flex-shrink: 0;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-3xl;
    color: $gray-500;

    svg {
      margin-bottom: $spacing-md;
      opacity: 0.5;
    }

    p {
      margin: 0;
      font-size: $font-size-base;
    }
  }

  @media (max-width: $breakpoint-md) {
    max-width: none;

    &__dropdown {
      position: fixed;
      top: 60px;
      left: $spacing-md;
      right: $spacing-md;
      max-height: calc(100vh - 80px);
    }
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s $transition-ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
