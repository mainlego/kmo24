<template>
  <div class="product-grid">
    <!-- Loading State -->
    <div v-if="isLoading" class="product-grid__loading">
      <BaseSpinner size="lg" text="Загрузка товаров..." />
    </div>

    <!-- Empty State -->
    <div v-else-if="!products || products.length === 0" class="product-grid__empty">
      <div class="product-grid__empty-icon">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3 class="product-grid__empty-title">{{ emptyTitle }}</h3>
      <p class="product-grid__empty-text">{{ emptyText }}</p>
      <BaseButton
        v-if="showResetButton"
        variant="primary"
        @click="handleReset"
      >
        Сбросить фильтры
      </BaseButton>
    </div>

    <!-- Products Grid -->
    <div v-else class="product-grid__list">
      <ProductCard
        v-for="product in products"
        :key="product._id"
        :product="product"
      />
    </div>

    <!-- Pagination -->
    <div v-if="showPagination && pagination" class="product-grid__pagination">
      <BaseButton
        variant="outline"
        :disabled="!pagination.hasPrevPage"
        @click="handlePrevPage"
      >
        Назад
      </BaseButton>

      <div class="product-grid__pagination-info">
        <span class="product-grid__pagination-current">
          Страница {{ pagination.currentPage }} из {{ pagination.totalPages }}
        </span>
        <span class="product-grid__pagination-total">
          Всего товаров: {{ pagination.totalItems }}
        </span>
      </div>

      <BaseButton
        variant="outline"
        :disabled="!pagination.hasNextPage"
        @click="handleNextPage"
      >
        Далее
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, PaginatedResponse } from '~/types';

interface Props {
  products?: Product[];
  isLoading?: boolean;
  pagination?: PaginatedResponse<Product>['pagination'];
  emptyTitle?: string;
  emptyText?: string;
  showPagination?: boolean;
  showResetButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  isLoading: false,
  emptyTitle: 'Товары не найдены',
  emptyText: 'Попробуйте изменить параметры поиска или фильтры',
  showPagination: true,
  showResetButton: true,
});

const emit = defineEmits<{
  nextPage: [];
  prevPage: [];
  reset: [];
}>();

const handlePrevPage = () => {
  emit('prevPage');
  scrollToTop();
};

const handleNextPage = () => {
  emit('nextPage');
  scrollToTop();
};

const handleReset = () => {
  emit('reset');
};

const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.product-grid {
  display: flex;
  flex-direction: column;
  gap: $spacing-xl;

  &__loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-lg;
    min-height: 400px;
    padding: $spacing-xl;
    text-align: center;
  }

  &__empty-icon {
    color: $gray-300;
  }

  &__empty-title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0;
  }

  &__empty-text {
    font-size: $font-size-base;
    color: $gray-600;
    margin: 0;
    max-width: 400px;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-xl;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: $spacing-lg;
    }

    @media (max-width: $breakpoint-md) {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: $spacing-md;
    }

    @media (max-width: $breakpoint-sm) {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: $spacing-sm;
    }
  }

  &__pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-lg;
    padding: $spacing-xl 0;
    border-top: 1px solid $gray-200;

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
      gap: $spacing-md;
    }
  }

  &__pagination-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
  }

  &__pagination-current {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $gray-900;
  }

  &__pagination-total {
    font-size: $font-size-sm;
    color: $gray-600;
  }
}
</style>
