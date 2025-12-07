<template>
  <Transition name="slide-up">
    <div v-if="isVisible" class="sticky-cart">
      <div class="sticky-cart__container">
        <!-- Product Info -->
        <div class="sticky-cart__product">
          <div class="sticky-cart__image">
            <img :src="getProductImageUrl(product.images?.[0]?.url)" :alt="product.name" />
          </div>
          <div class="sticky-cart__info">
            <h3 class="sticky-cart__name">{{ product.name }}</h3>
            <div class="sticky-cart__price">
              <span v-if="product.oldPrice" class="sticky-cart__old-price">
                {{ formatPrice(product.oldPrice) }}
              </span>
              <span class="sticky-cart__current-price">
                {{ formatPrice(product.price) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="sticky-cart__actions">
          <!-- Quantity Selector -->
          <div class="sticky-cart__quantity">
            <button
              class="sticky-cart__quantity-btn"
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
              aria-label="Уменьшить количество"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              :max="product.stock"
              class="sticky-cart__quantity-input"
            />
            <button
              class="sticky-cart__quantity-btn"
              @click="increaseQuantity"
              :disabled="quantity >= product.stock"
              aria-label="Увеличить количество"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Add to Cart Button -->
          <button
            class="sticky-cart__add-btn"
            @click="handleAddToCart"
            :disabled="product.stock === 0 || isAdding"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 2L7.17 4M15 2L16.83 4M9 11V15M12 11V15M15 11V15M3 6H21M19 6L18.1 19.1C18.0448 19.6116 17.8014 20.0843 17.4186 20.4279C17.0357 20.7715 16.5398 20.9623 16.027 21H7.973C7.46024 20.9623 6.96428 20.7715 6.58145 20.4279C5.19862 20.0843 5.95519 19.6116 5.9 19.1L5 6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span v-if="!isAdding">
              {{ product.stock > 0 ? 'В корзину' : 'Нет в наличии' }}
            </span>
            <span v-else>Добавление...</span>
          </button>

          <!-- Favorite Button -->
          <button
            class="sticky-cart__favorite-btn"
            :class="{ 'sticky-cart__favorite-btn--active': isFavorite }"
            @click="toggleFavorite"
            aria-label="Добавить в избранное"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20.84 4.61C20.3292 4.09944 19.7228 3.69541 19.0554 3.4211C18.3879 3.14679 17.6725 3.00731 16.95 3.00731C16.2275 3.00731 15.5121 3.14679 14.8446 3.4211C14.1772 3.69541 13.5708 4.09944 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 3.00022 7.05 3.00022C5.59096 3.00022 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.55022 7.04096 1.55022 8.5C1.55022 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3506 11.8792 21.7546 11.2728 22.0289 10.6054C22.3032 9.93789 22.4427 9.22249 22.4427 8.5C22.4427 7.77751 22.3032 7.0621 22.0289 6.39461C21.7546 5.72711 21.3506 5.12075 20.84 4.61Z" :fill="isFavorite ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useToast } from '~/composables/useToast';

const { getProductImageUrl } = useMediaUrl();

interface Product {
  _id: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
  images?: Array<{ url: string; alt?: string }>;
}

interface Props {
  product: Product;
  scrollThreshold?: number; // Pixels to scroll before showing
}

const props = withDefaults(defineProps<Props>(), {
  scrollThreshold: 300
});

const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const { showToast } = useToast();

const isVisible = ref(false);
const quantity = ref(1);
const isAdding = ref(false);

// Check if product is in wishlist
const isFavorite = computed(() => wishlistStore.hasItem(props.product._id));

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(price);
};

const increaseQuantity = () => {
  if (quantity.value < props.product.stock) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = async () => {
  if (isAdding.value || props.product.stock === 0) return;

  isAdding.value = true;

  try {
    await cartStore.addItem(props.product._id, quantity.value);

    showToast({
      message: `${props.product.name} добавлен в корзину (${quantity.value} шт.)`,
      type: 'success'
    });

    // Reset quantity after adding
    quantity.value = 1;
  } catch (error) {
    showToast({
      message: 'Ошибка при добавлении в корзину',
      type: 'error'
    });
    console.error('Error adding to cart:', error);
  } finally {
    isAdding.value = false;
  }
};

const toggleFavorite = async () => {
  try {
    // Create a minimal product object for wishlist
    const productForWishlist = {
      _id: props.product._id,
      name: props.product.name,
      price: props.product.price,
      oldPrice: props.product.oldPrice,
      images: props.product.images || []
    };

    await wishlistStore.toggleItem(productForWishlist as any);

    const isNowFavorite = wishlistStore.hasItem(props.product._id);

    showToast({
      message: isNowFavorite
        ? `${props.product.name} добавлен в избранное`
        : `${props.product.name} удален из избранного`,
      type: isNowFavorite ? 'success' : 'info'
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};

// Handle scroll visibility
const handleScroll = () => {
  if (process.client) {
    const scrollY = window.scrollY;
    isVisible.value = scrollY > props.scrollThreshold;
  }
};

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', handleScroll);
  }
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.sticky-cart {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $white;
  border-top: 1px solid $gray-200;
  box-shadow: 0 -4px 20px rgba($gray-900, 0.1);
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba($white, 0.98);

  @media (max-width: $breakpoint-md) {
    box-shadow: 0 -2px 15px rgba($gray-900, 0.1);
  }

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: $spacing-md $spacing-xl;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-xl;

    @media (max-width: $breakpoint-lg) {
      padding: $spacing-md $spacing-lg;
      gap: $spacing-lg;
    }

    @media (max-width: $breakpoint-md) {
      flex-direction: column;
      gap: $spacing-md;
      padding: $spacing-md;
    }
  }

  &__product {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    flex: 0 0 auto;
    min-width: 0;

    @media (max-width: $breakpoint-md) {
      width: 100%;
    }
  }

  &__image {
    width: 60px;
    height: 60px;
    border-radius: $radius-lg;
    overflow: hidden;
    flex-shrink: 0;
    background: $gray-100;

    @media (max-width: $breakpoint-md) {
      width: 50px;
      height: 50px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    min-width: 0;
    flex: 1;
  }

  &__name {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: $breakpoint-md) {
      font-size: $font-size-sm;
    }
  }

  &__price {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__old-price {
    font-size: $font-size-sm;
    color: $gray-500;
    text-decoration: line-through;
  }

  &__current-price {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    background: $gradient-primary;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;

    @media (max-width: $breakpoint-md) {
      font-size: $font-size-lg;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    @media (max-width: $breakpoint-md) {
      width: 100%;
      gap: $spacing-sm;
    }
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    background: $gray-50;
    border-radius: $radius-lg;
    padding: $spacing-xs;

    @media (max-width: $breakpoint-md) {
      flex: 0 0 auto;
    }
  }

  &__quantity-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $white;
    border: 1px solid $gray-200;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    color: $gray-700;

    &:hover:not(:disabled) {
      background: $gradient-primary;
      border-color: transparent;
      color: $white;
      transform: scale(1.05);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__quantity-input {
    width: 50px;
    height: 32px;
    text-align: center;
    border: 1px solid $gray-200;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    background: $white;

    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }

    /* Hide spinner */
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-xl;
    background: $gradient-primary;
    color: $white;
    border: none;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    box-shadow: $shadow-colored;
    white-space: nowrap;

    @media (max-width: $breakpoint-md) {
      flex: 1;
      padding: $spacing-sm $spacing-lg;
      font-size: $font-size-sm;
    }

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: $shadow-2xl, $shadow-colored;
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      background: $gray-300;
      color: $gray-600;
      cursor: not-allowed;
      box-shadow: none;
    }

    svg {
      flex-shrink: 0;
    }
  }

  &__favorite-btn {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $white;
    border: 2px solid $gray-200;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    color: $gray-500;

    @media (max-width: $breakpoint-md) {
      width: 44px;
      height: 44px;
    }

    &:hover {
      border-color: $primary;
      color: $primary;
      transform: scale(1.05);
    }

    &--active {
      background: rgba($error, 0.1);
      border-color: $error;
      color: $error;

      &:hover {
        background: $error;
        color: $white;
      }
    }
  }
}

// Transition animations
.slide-up-enter-active {
  animation: slideUpIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-leave-active {
  animation: slideUpOut 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUpIn {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUpOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}
</style>
