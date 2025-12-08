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
      <div v-if="isOpen && (searchResults.length > 0 || isLoading || !searchQuery || searchHistory.length > 0)" class="smart-search__dropdown">
        <div v-if="isLoading" class="smart-search__loading">
          <div class="spinner"></div>
          <span>Поиск...</span>
        </div>

        <!-- Search Results -->
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
              <img
                :src="getProductImageUrl(product.images?.[0]?.url)"
                :alt="product.images?.[0]?.alt || product.name"
                loading="lazy"
              />
            </div>
            <div class="smart-search__item-content">
              <h4 class="smart-search__item-title">{{ highlightMatch(product.name) }}</h4>
              <p class="smart-search__item-category">{{ product.category.name }}</p>
            </div>
            <div class="smart-search__item-price">
              {{ formatPrice(product.price) }}
            </div>
          </div>
        </div>

        <!-- Empty Search Results -->
        <div v-else-if="searchQuery && searchResults.length === 0" class="smart-search__empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>Ничего не найдено</p>
          <p class="smart-search__empty-hint">Попробуйте изменить запрос или поищите в категориях</p>
        </div>

        <!-- Search History & Popular Searches (когда пусто) -->
        <div v-else-if="!searchQuery" class="smart-search__suggestions">
          <!-- Search History -->
          <div v-if="searchHistory.length > 0" class="smart-search__section">
            <div class="smart-search__section-header">
              <h3 class="smart-search__section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Недавние поиски
              </h3>
              <button class="smart-search__clear-history" @click="clearHistory">
                Очистить
              </button>
            </div>
            <div class="smart-search__history-list">
              <button
                v-for="(term, index) in searchHistory"
                :key="index"
                class="smart-search__history-item"
                @click="applyHistorySearch(term)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>{{ term }}</span>
                <button
                  class="smart-search__remove-history"
                  @click.stop="removeFromHistory(term)"
                  aria-label="Удалить"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </button>
            </div>
          </div>

          <!-- Popular Searches -->
          <div class="smart-search__section">
            <div class="smart-search__section-header">
              <h3 class="smart-search__section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Популярные запросы
              </h3>
            </div>
            <div class="smart-search__tags">
              <button
                v-for="tag in popularSearches"
                :key="tag"
                class="smart-search__tag"
                @click="applyHistorySearch(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Quick Categories -->
          <div class="smart-search__section">
            <div class="smart-search__section-header">
              <h3 class="smart-search__section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Категории
              </h3>
            </div>
            <div class="smart-search__categories">
              <NuxtLink
                v-for="category in quickCategories"
                :key="category.slug"
                :to="`/products?category=${category.slug}`"
                class="smart-search__category"
                @click="emit('close')"
              >
                <span class="smart-search__category-icon">{{ category.icon }}</span>
                <span class="smart-search__category-name">{{ category.name }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import type { Product } from '~/types';

// Props для управления состоянием извне (например из модального окна)
const props = defineProps<{
  autoOpen?: boolean; // Автоматически открывать dropdown при монтировании
}>();

const { getProductImageUrl } = useMediaUrl();

const searchQuery = ref('');
const isOpen = ref(false);
const isLoading = ref(false);
const searchResults = ref<Product[]>([]);
const selectedIndex = ref(-1);
const searchInput = ref<HTMLInputElement | null>(null);
const searchHistory = ref<string[]>([]);
let searchTimeout: NodeJS.Timeout | null = null;

// Popular searches
const popularSearches = [
  'Печь',
  'Холодильник',
  'Миксер',
  'Плита',
  'Гриль',
  'Фритюрница',
];

// Quick categories
const quickCategories = [
  { name: 'Хлебопекарное оборудование', slug: 'bakery', icon: '🍞' },
  { name: 'Холодильное оборудование', slug: 'refrigeration', icon: '❄️' },
  { name: 'Тепловое оборудование', slug: 'thermal', icon: '🔥' },
  { name: 'Кухонное оборудование', slug: 'kitchen', icon: '🍳' },
];

// Load search history from localStorage
if (process.client) {
  try {
    const stored = localStorage.getItem('kmo24_search_history');
    if (stored) {
      searchHistory.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading search history:', error);
  }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  isLoading.value = true;

  try {
    const { apiFetch } = useApi();
    const response = await apiFetch<{ success: boolean; data: Product[] }>(
      `/products?search=${encodeURIComponent(searchQuery.value)}&limit=8`
    );

    if (response.success && response.data) {
      searchResults.value = response.data;
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error('Search error:', error);
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
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
  // Если используется в модальном окне, не закрываем по потере фокуса
  if (props.autoOpen) return;

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
  // Add to search history
  addToHistory(product.name);

  navigateTo(`/products/${product.slug}`);
  closeSearch();
  clearSearch();
  emit('close');
};

// Search history functions
const addToHistory = (term: string) => {
  if (!term.trim() || term.length < 2) return;

  // Remove if already exists
  searchHistory.value = searchHistory.value.filter(t => t !== term);

  // Add to beginning
  searchHistory.value.unshift(term);

  // Limit to 5 items
  if (searchHistory.value.length > 5) {
    searchHistory.value = searchHistory.value.slice(0, 5);
  }

  // Save to localStorage
  if (process.client) {
    try {
      localStorage.setItem('kmo24_search_history', JSON.stringify(searchHistory.value));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }
};

const clearHistory = () => {
  searchHistory.value = [];
  if (process.client) {
    localStorage.removeItem('kmo24_search_history');
  }
};

const removeFromHistory = (term: string) => {
  searchHistory.value = searchHistory.value.filter(t => t !== term);
  if (process.client) {
    try {
      localStorage.setItem('kmo24_search_history', JSON.stringify(searchHistory.value));
    } catch (error) {
      console.error('Error updating search history:', error);
    }
  }
};

const applyHistorySearch = (term: string) => {
  searchQuery.value = term;
  performSearch();
  searchInput.value?.focus();
};

// Highlight matching text
const highlightMatch = (text: string) => {
  // Note: Since we can't use v-html in template interpolation,
  // we'll just return the text. A proper implementation would use
  // a separate highlighting component or v-html directive
  return text;
};

// Закрывать поиск при клике вне области
// НО не закрываем если autoOpen=true (используется в модальном окне)
const handleClickOutside = (event: MouseEvent) => {
  // Если используется в модальном окне, не закрываем по клику вне
  if (props.autoOpen) return;

  const target = event.target as HTMLElement;
  if (!target.closest('.smart-search')) {
    closeSearch();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  // Если autoOpen=true (используется в модальном окне), открываем dropdown сразу
  if (props.autoOpen) {
    isOpen.value = true;
  }

  // Auto-focus the search input when mounted
  setTimeout(() => {
    searchInput.value?.focus();
  }, 100);
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
  z-index: 1;

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
    z-index: 2;
    pointer-events: auto;

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
    pointer-events: none;

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
    z-index: 3;
    pointer-events: auto;
    cursor: text;

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
    pointer-events: auto;
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

      &:first-of-type {
        font-weight: $font-weight-semibold;
        color: $gray-700;
        margin-bottom: $spacing-xs;
      }
    }
  }

  &__empty-hint {
    font-size: $font-size-sm !important;
    color: $gray-500 !important;
  }

  // Suggestions Section
  &__suggestions {
    display: flex;
    flex-direction: column;
  }

  &__section {
    padding: $spacing-lg;
    border-bottom: 1px solid $gray-100;

    &:last-child {
      border-bottom: none;
    }
  }

  &__section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-md;
  }

  &__section-title {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $gray-700;
    margin: 0;

    svg {
      color: $primary;
    }
  }

  &__clear-history {
    font-size: $font-size-xs;
    color: $gray-500;
    background: none;
    border: none;
    cursor: pointer;
    transition: color $transition-base $transition-ease;
    padding: 0;

    &:hover {
      color: $error;
    }
  }

  // Search History
  &__history-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__history-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background: transparent;
    border: 1px solid $gray-200;
    border-radius: $radius-lg;
    font-size: $font-size-sm;
    color: $gray-700;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    text-align: left;

    svg {
      color: $gray-400;
      flex-shrink: 0;
    }

    span {
      flex: 1;
    }

    &:hover {
      background: $gray-50;
      border-color: $primary;
      color: $gray-900;

      svg {
        color: $primary;
      }
    }
  }

  &__remove-history {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: $radius-sm;
    color: $gray-400;
    cursor: pointer;
    transition: all $transition-base $transition-ease;

    &:hover {
      background: $error;
      color: $white;
    }
  }

  // Popular Tags
  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }

  &__tag {
    padding: $spacing-xs $spacing-md;
    background: $gray-100;
    border: 1px solid transparent;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    color: $gray-700;
    cursor: pointer;
    transition: all $transition-base $transition-ease;

    &:hover {
      background: rgba($primary, 0.1);
      border-color: $primary;
      color: $primary;
      transform: translateY(-2px);
    }
  }

  // Quick Categories
  &__categories {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-sm;

    @media (max-width: $breakpoint-sm) {
      grid-template-columns: 1fr;
    }
  }

  &__category {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md;
    background: $gray-50;
    border: 1px solid $gray-200;
    border-radius: $radius-lg;
    text-decoration: none;
    transition: all $transition-base $transition-ease;

    &:hover {
      background: $white;
      border-color: $primary;
      transform: translateY(-2px);
      box-shadow: $shadow-md;
    }
  }

  &__category-icon {
    font-size: $font-size-2xl;
    flex-shrink: 0;
  }

  &__category-name {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-800;
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
