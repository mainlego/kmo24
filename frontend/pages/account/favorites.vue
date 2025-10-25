<template>
  <div class="favorites-page">
    <div class="container">
      <div class="favorites-page__header">
        <NuxtLink to="/account" class="favorites-page__back">
          ← Назад в личный кабинет
        </NuxtLink>
        <div class="favorites-page__header-content">
          <h1>Избранное</h1>
          <div v-if="!isEmpty" class="favorites-page__header-count">
            {{ count }} {{ getItemsWord(count) }}
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="favorites-page__loading">
        <BaseSpinner size="lg" text="Загрузка избранного..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="isEmpty" class="favorites-page__empty">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          <path
            d="M20.84 4.61C20.3292 4.09944 19.7228 3.69541 19.0554 3.4211C18.3879 3.14679 17.6725 3.00731 16.95 3.00731C16.2275 3.00731 15.5121 3.14679 14.8446 3.4211C14.1772 3.69541 13.5708 4.09944 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 3.00022 7.05 3.00022C5.59096 3.00022 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.55022 7.04096 1.55022 8.5C1.55022 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3506 11.8792 21.7546 11.2728 22.0289 10.6054C22.3032 9.93789 22.4427 9.22249 22.4427 8.5C22.4427 7.77751 22.3032 7.0621 22.0289 6.39461C21.7546 5.72711 21.3506 5.12075 20.84 4.61Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h2>В избранном пока пусто</h2>
        <p>Добавляйте понравившиеся товары в избранное, чтобы не потерять их</p>
        <BaseButton variant="primary" @click="navigateTo('/products')">
          Перейти в каталог
        </BaseButton>
      </div>

      <!-- Favorites Grid -->
      <div v-else>
        <div class="favorites-page__actions">
          <BaseButton
            variant="outline"
            size="sm"
            @click="clearAllFavorites"
          >
            Очистить всё
          </BaseButton>
          <BaseButton
            variant="primary"
            size="sm"
            @click="addAllToCart"
          >
            Добавить всё в корзину
          </BaseButton>
        </div>

        <div class="favorites-page__grid">
          <div
            v-for="product in items"
            :key="product._id"
            class="favorites-page__item"
          >
            <ProductCard :product="product" />

            <button
              class="favorites-page__remove-btn"
              @click.stop="removeFromFavorites(product._id)"
              title="Удалить из избранного"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useWishlistStore } from '~/stores/wishlist';
import { useCartStore } from '~/stores/cart';

const wishlistStore = useWishlistStore();
const cartStore = useCartStore();

const { items, isLoading, count, isEmpty } = storeToRefs(wishlistStore);

const getItemsWord = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'товаров';
  }

  if (lastDigit === 1) {
    return 'товар';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'товара';
  }

  return 'товаров';
};

const removeFromFavorites = async (productId: string) => {
  try {
    await wishlistStore.removeItem(productId);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    alert('Ошибка при удалении из избранного');
  }
};

const clearAllFavorites = async () => {
  if (!confirm('Вы уверены, что хотите очистить всё избранное?')) return;

  try {
    await wishlistStore.clearWishlist();
  } catch (error) {
    console.error('Error clearing favorites:', error);
    alert('Ошибка при очистке избранного');
  }
};

const addAllToCart = async () => {
  try {
    let added = 0;
    for (const product of items.value) {
      if (product.stock.available > 0) {
        await cartStore.addItem(product._id, 1);
        added++;
      }
    }

    if (added > 0) {
      alert(`${added} ${getItemsWord(added)} добавлено в корзину`);
    } else {
      alert('Нет доступных товаров для добавления в корзину');
    }
  } catch (error) {
    console.error('Error adding all to cart:', error);
    alert('Ошибка при добавлении в корзину');
  }
};

onMounted(async () => {
  try {
    await wishlistStore.fetchWishlist();
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
});

// SEO
useHead({
  title: 'Избранное - Онлайн Магазин',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.favorites-page {
  min-height: calc(100vh - 200px);
  padding: $spacing-xl 0;
  background: $gray-50;

  &__header {
    margin-bottom: $spacing-xl;
  }

  &__header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: $spacing-md;

    h1 {
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
      color: $gray-900;
      margin: 0;
    }

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
      align-items: flex-start;
      gap: $spacing-sm;
    }
  }

  &__header-count {
    font-size: $font-size-base;
    color: $gray-600;
    font-weight: $font-weight-medium;
    padding: $spacing-xs $spacing-md;
    background: $gray-100;
    border-radius: $radius-full;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    color: $primary;
    text-decoration: none;
    font-size: $font-size-sm;
    transition: color $transition-base;

    &:hover {
      color: darken($primary, 10%);
    }
  }

  &__loading,
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: $spacing-lg;
    background: $white;
    border-radius: $radius-xl;
    padding: $spacing-2xl;

    svg {
      color: $gray-300;
    }

    h2 {
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0;
    }

    p {
      font-size: $font-size-base;
      color: $gray-600;
      margin: 0;
      text-align: center;
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-sm;
    margin-bottom: $spacing-lg;

    @media (max-width: $breakpoint-sm) {
      justify-content: stretch;

      button {
        flex: 1;
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-xl;
  }

  &__item {
    position: relative;
  }

  &__remove-btn {
    position: absolute;
    top: $spacing-sm;
    right: $spacing-sm;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: rgba($white, 0.95);
    color: $gray-600;
    font-size: $font-size-2xl;
    line-height: 1;
    border-radius: $radius-full;
    cursor: pointer;
    z-index: 10;
    box-shadow: $shadow-md;
    transition: all $transition-base;

    &:hover {
      background: $error;
      color: $white;
      transform: scale(1.1);
    }
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
