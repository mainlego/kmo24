<template>
  <div class="products-page">
    <PageHeader
      title="Каталог оборудования"
      description="Профессиональное оборудование для кафе и ресторанов по выгодным ценам"
      background-image="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&h=400&fit=crop"
      :breadcrumbs="[{ text: 'Каталог' }]"
    />

    <div class="container">
      <div class="products-page__stats">
        <p class="products-page__subtitle">
          Найдено товаров: <strong>{{ productsStore.pagination.totalItems || 0 }}</strong>
        </p>
        <!-- Mobile Filter Button -->
        <button class="mobile-filter-btn" @click="showMobileFilters = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 4h18M3 12h12M3 20h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span>Фильтры</span>
          <span v-if="hasActiveFilters" class="filter-badge">{{ activeFiltersCount }}</span>
        </button>
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
        <div v-if="showMobileFilters" class="mobile-filter-overlay" @click="showMobileFilters = false"></div>

        <!-- Products Grid -->
        <main class="products-page__main">
          <ProductGrid
            :products="productsStore.products"
            :is-loading="productsStore.isLoading"
            :pagination="productsStore.pagination"
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

.products-page {
  min-height: calc(100vh - 200px);
  padding: $spacing-2xl 0 $spacing-3xl;
  background: linear-gradient(180deg, $white 0%, $gray-50 100%);
  position: relative;

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
    background: $gradient-cosmic;
    opacity: 0.05;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }

  &__stats {
    margin-bottom: $spacing-xl;
    text-align: center;
    animation: fadeInUp 0.6s $transition-ease;
    position: relative;
    z-index: 1;
  }

  &__subtitle {
    font-size: $font-size-lg;
    color: $gray-600;
    margin: 0;
    font-weight: $font-weight-medium;

    strong {
      background: $gradient-sunset;
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
          background: $gradient-secondary;
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

.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 $spacing-2xl;

  @media (max-width: $breakpoint-lg) {
    padding: 0 $spacing-xl;
  }

  @media (max-width: $breakpoint-md) {
    padding: 0 $spacing-lg;
  }

  @media (max-width: $breakpoint-sm) {
    padding: 0 $spacing-md;
  }
}

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
      top: -8px;
      right: -8px;
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
    animation: fadeIn 0.3s ease;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
