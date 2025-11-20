<template>
  <div class="products-page">
    <PageHeader
      title="Каталог оборудования"
      description="Профессиональное медицинское оборудование по выгодным ценам"
      :breadcrumbs="[{ text: 'Каталог' }]"
    />

    <div class="container">
      <!-- Premium Stats Bar -->
      <div class="products-page__stats">
        <div class="stats-info">
          <p class="products-page__subtitle">
            Найдено товаров: <strong>{{ productsStore.pagination.totalItems || 0 }}</strong>
          </p>

          <!-- Active Filters Chips -->
          <Transition name="slide-down">
            <div v-if="hasActiveFilters" class="active-filters">
              <span class="active-filters__label">Активные фильтры:</span>
              <div class="active-filters__chips">
                <button
                  v-if="productsStore.filters.category"
                  class="filter-chip"
                  @click="removeFilter('category')"
                >
                  <span>{{ getCategoryName(productsStore.filters.category) }}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <button
                  v-if="productsStore.filters.search"
                  class="filter-chip"
                  @click="removeFilter('search')"
                >
                  <span>{{ productsStore.filters.search }}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <button
                  v-if="productsStore.filters.minPrice || productsStore.filters.maxPrice"
                  class="filter-chip"
                  @click="removeFilter('price')"
                >
                  <span>
                    {{ productsStore.filters.minPrice || 0 }} ₽ - {{ productsStore.filters.maxPrice || '∞' }} ₽
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <button
                  v-if="productsStore.filters.inStock"
                  class="filter-chip"
                  @click="removeFilter('inStock')"
                >
                  <span>В наличии</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
                <button class="filter-chip filter-chip--reset" @click="handleReset">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M3 12H7M3 12L5 10M3 12L5 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Сбросить все</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <div class="products-toolbar">
          <!-- View Toggle -->
          <div class="view-toggle">
            <button
              class="view-toggle__btn"
              :class="{ 'view-toggle__btn--active': viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              aria-label="Сетка"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button
              class="view-toggle__btn"
              :class="{ 'view-toggle__btn--active': viewMode === 'list' }"
              @click="viewMode = 'list'"
              aria-label="Список"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Mobile Filter Button -->
          <button class="mobile-filter-btn" @click="showMobileFilters = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 4h18M3 12h12M3 20h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>Фильтры</span>
            <span v-if="hasActiveFilters" class="filter-badge">{{ activeFiltersCount }}</span>
          </button>
        </div>
      </div>

      <div class="products-page__layout">
        <!-- Filters Sidebar -->
        <aside class="products-page__sidebar" :class="{ 'is-open': showMobileFilters }">
          <div class="mobile-filter-header">
            <h3>Фильтры</h3>
            <button class="mobile-filter-close" @click="showMobileFilters = false">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <ProductFilters
            :filters="productsStore.filters"
            :categories="categories"
            @update:filters="handleFiltersUpdate"
          />
          <div class="mobile-filter-footer">
            <button class="btn-apply" @click="applyMobileFilters">Применить</button>
          </div>
        </aside>

        <!-- Mobile Filters Overlay -->
        <Transition name="fade">
          <div v-if="showMobileFilters" class="mobile-filter-overlay" @click="showMobileFilters = false"></div>
        </Transition>

        <!-- Products Grid -->
        <main class="products-page__main">
          <ProductGrid
            :products="productsStore.products"
            :is-loading="productsStore.isLoading"
            :pagination="productsStore.pagination"
            :view-mode="viewMode"
            @next-page="productsStore.nextPage"
            @prev-page="productsStore.prevPage"
            @reset="handleReset"
          />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { mockCategories } from '~/mocks/products';

const productsStore = useProductsStore();

// Use real categories from КМО24
const categories = ref(mockCategories);

// Mobile filters state
const showMobileFilters = ref(false);

// View mode state
const viewMode = ref<'grid' | 'list'>('grid');

// Count active filters
const hasActiveFilters = computed(() => {
  const f = productsStore.filters;
  return !!(f.search || f.category || f.minPrice || f.maxPrice || f.inStock);
});

const activeFiltersCount = computed(() => {
  const f = productsStore.filters;
  let count = 0;
  if (f.search) count++;
  if (f.category) count++;
  if (f.minPrice || f.maxPrice) count++;
  if (f.inStock) count++;
  return count;
});

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find(c => c._id === categoryId);
  return category?.name || categoryId;
};

const removeFilter = async (filterType: string) => {
  const updatedFilters = { ...productsStore.filters };

  switch (filterType) {
    case 'category':
      delete updatedFilters.category;
      break;
    case 'search':
      delete updatedFilters.search;
      break;
    case 'price':
      delete updatedFilters.minPrice;
      delete updatedFilters.maxPrice;
      break;
    case 'inStock':
      delete updatedFilters.inStock;
      break;
  }

  await productsStore.fetchProducts(updatedFilters);
};

const handleFiltersUpdate = async (filters: any) => {
  console.log('Filters updated:', filters);

  // Convert sort format from price_asc/price_desc to price/-price
  let convertedFilters = { ...filters };
  if (filters.sort) {
    const sortMap: Record<string, string> = {
      'price_asc': 'price',
      'price_desc': '-price',
      'name_asc': 'name',
      'name_desc': '-name',
      'rating': '-rating',
      'newest': '-createdAt',
      'popular': '-rating',
    };
    convertedFilters.sort = sortMap[filters.sort] || filters.sort;
  }

  // Fetch products with all filters at once
  await productsStore.fetchProducts(convertedFilters);
};

const handleReset = () => {
  productsStore.resetFilters();
  productsStore.fetchProducts();
};

const applyMobileFilters = () => {
  showMobileFilters.value = false;
};

// Load products on mount
onMounted(async () => {
  try {
    console.log('🚀 Products page mounted, fetching products...');
    await productsStore.fetchProducts();
    console.log('✅ Products loaded:', productsStore.products.length);
    console.log('📊 Products data:', productsStore.products);
  } catch (error) {
    console.error('Error loading products:', error);
  }
});

// SEO
useHead({
  title: 'Каталог товаров - Онлайн Магазин',
  meta: [
    {
      name: 'description',
      content: 'Широкий выбор товаров в нашем интернет-магазине. Быстрая доставка, гарантия качества.',
    },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 200px;
    transform: translateY(0);
  }
}

.products-page {
  min-height: calc(100vh - 200px);
  padding: $spacing-2xl 0 $spacing-3xl;
  background: linear-gradient(180deg, $white 0%, $gray-50 100%);
  position: relative;
  overflow-x: hidden;

  // Premium background decoration
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: $gradient-primary;
    opacity: 0.03;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 200px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: $gradient-hero;
    opacity: 0.05;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;

    @media (max-width: $breakpoint-md) {
      right: -50px;
      width: 250px;
      height: 250px;
    }

    @media (max-width: $breakpoint-sm) {
      display: none;
    }
  }

  &__stats {
    margin-bottom: $spacing-xl;
    animation: fadeInUp 0.6s $transition-ease;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: $spacing-lg;
    flex-wrap: wrap;

    @media (max-width: $breakpoint-md) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .stats-info {
    flex: 1;
    min-width: 0;
  }

  .products-toolbar {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    @media (max-width: $breakpoint-md) {
      justify-content: space-between;
      width: 100%;
    }
  }

  &__subtitle {
    font-size: $font-size-lg;
    color: $gray-600;
    margin: 0 0 $spacing-md;
    font-weight: $font-weight-medium;

    strong {
      background: $gradient-text-warm;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: $font-weight-bold;
    }

    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-base;
    }
  }

  &__layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: $spacing-2xl;
    position: relative;
    z-index: 1;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: 280px 1fr;
      gap: $spacing-xl;
    }

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
      gap: $spacing-lg;
    }
  }

  &__sidebar {
    @media (max-width: $breakpoint-md) {
      position: fixed;
      top: 0;
      left: -100%;
      width: 85%;
      max-width: 400px;
      height: 100vh;
      background: $white;
      box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      transition: left 0.3s ease;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      &.is-open {
        left: 0;
      }
    }

    // Sticky sidebar on desktop
    @media (min-width: calc($breakpoint-md + 1px)) {
      position: sticky;
      top: 100px;
      height: fit-content;
      max-height: calc(100vh - 120px);
      overflow-y: auto;

      // Custom scrollbar
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: $gray-100;
        border-radius: $radius-full;
      }

      &::-webkit-scrollbar-thumb {
        background: $gradient-primary;
        border-radius: $radius-full;

        &:hover {
          background: $gradient-primary;
        }
      }
    }
  }

  &__main {
    @media (max-width: $breakpoint-md) {
      order: 1;
    }
  }
}

// Active Filters Chips
.active-filters {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  flex-wrap: wrap;
  animation: slideDown 0.4s $transition-ease;
  margin-top: $spacing-md;

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $gray-700;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
  }
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-xs $spacing-md;
  background: linear-gradient(135deg, rgba($primary, 0.1), rgba($secondary, 0.1));
  border: 1px solid rgba($primary, 0.3);
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-800;
  cursor: pointer;
  transition: all $transition-base $transition-ease;

  &:hover {
    background: linear-gradient(135deg, rgba($primary, 0.15), rgba($secondary, 0.15));
    border-color: rgba($primary, 0.5);
    transform: translateY(-2px);
    box-shadow: $shadow-sm;
  }

  svg {
    width: 14px;
    height: 14px;
    stroke: currentColor;
    opacity: 0.7;
  }

  &--reset {
    background: linear-gradient(135deg, rgba($error, 0.1), rgba($error, 0.05));
    border-color: rgba($error, 0.3);
    color: $error;

    &:hover {
      background: linear-gradient(135deg, rgba($error, 0.15), rgba($error, 0.1));
      border-color: rgba($error, 0.5);
    }
  }
}

// View Toggle
.view-toggle {
  display: none;
  background: $white;
  border-radius: $radius-lg;
  padding: 4px;
  box-shadow: $shadow-sm;
  border: 1px solid $gray-200;

  @media (min-width: calc($breakpoint-md + 1px)) {
    display: flex;
    gap: 4px;
  }

  &__btn {
    padding: $spacing-xs;
    background: transparent;
    border: none;
    border-radius: $radius-md;
    color: $gray-500;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: $primary;
      background: rgba($primary, 0.05);
    }

    &--active {
      background: $gradient-primary;
      color: $white;
      box-shadow: $shadow-sm;

      &:hover {
        background: $gradient-primary;
        color: $white;
      }
    }
  }
}

// Container is defined globally in main.scss

// Mobile Filter Button
.mobile-filter-btn {
  display: none;

  @media (max-width: $breakpoint-md) {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-lg;
    background: $gradient-primary;
    color: $white;
    border: none;
    border-radius: $radius-xl;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
    position: relative;

    &:active {
      transform: scale(0.98);
    }

    svg {
      stroke: currentColor;
    }

    .filter-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      min-width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: $error;
      color: $white;
      border-radius: $radius-full;
      font-size: $font-size-xs;
      font-weight: $font-weight-bold;
      padding: 0 6px;
      box-shadow: 0 2px 8px rgba($error, 0.3);
    }
  }
}

// Mobile Filter Header/Footer
.mobile-filter-header,
.mobile-filter-footer {
  display: none;

  @media (max-width: $breakpoint-md) {
    display: block;
  }
}

.mobile-filter-header {
  padding: $spacing-lg;
  border-bottom: 1px solid $gray-200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;

  h3 {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
  }
}

.mobile-filter-close {
  padding: $spacing-xs;
  background: transparent;
  border: none;
  color: $gray-600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.95);
    color: $gray-900;
  }
}

.mobile-filter-footer {
  padding: $spacing-lg;
  border-top: 1px solid $gray-200;
  background: $white;
  flex-shrink: 0;

  .btn-apply {
    width: 100%;
    padding: $spacing-md;
    background: $gradient-primary;
    color: $white;
    border: none;
    border-radius: $radius-xl;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);

    &:active {
      transform: scale(0.98);
    }
  }
}

// Mobile Filter Overlay
.mobile-filter-overlay {
  display: none;

  @media (max-width: $breakpoint-md) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  animation: slideDown 0.4s $transition-ease;
}

.slide-down-leave-active {
  animation: slideDown 0.4s $transition-ease reverse;
}

// Hide mobile elements on desktop
@media (min-width: calc($breakpoint-md + 1px)) {
  .mobile-filter-header,
  .mobile-filter-footer {
    display: none;
  }
}

// Make filters scrollable on mobile
.products-page__sidebar {
  @media (max-width: $breakpoint-md) {
    :deep(.product-filters) {
      flex: 1;
      overflow-y: auto;
      padding: $spacing-lg;
    }
  }
}
</style>
