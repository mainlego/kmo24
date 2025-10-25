<template>
  <BaseCard
    class="product-card"
    hoverable
    clickable
    shadow
    @click="navigateToProduct"
  >
    <template #image>
      <div class="product-card__image-wrapper">
        <img
          v-if="product.images?.length"
          :src="product.images[0].url"
          :alt="product.images[0].alt || product.name"
          class="product-card__image"
        />
        <div v-else class="product-card__image-placeholder">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="product-card__image-overlay"></div>
      </div>
    </template>

    <template #badge>
      <div class="product-card__badges">
        <BaseBadge v-if="isNew" variant="info" size="sm" rounded>
          Новинка
        </BaseBadge>
        <BaseBadge v-if="hasDiscount" variant="danger" size="sm" rounded>
          -{{ discountPercent }}%
        </BaseBadge>
        <BaseBadge v-if="!isInStock" variant="warning" size="sm" rounded>
          Нет в наличии
        </BaseBadge>
      </div>
    </template>

    <template #default>
      <div class="product-card__content">
        <h3 class="product-card__title">{{ product.name }}</h3>

        <p v-if="product.description?.short" class="product-card__description">
          {{ truncateDescription(product.description.short) }}
        </p>

        <div class="product-card__rating">
          <div class="product-card__stars">
            <svg
              v-for="star in 5"
              :key="star"
              :class="{ 'product-card__star--filled': star <= Math.round(product.rating.average) }"
              class="product-card__star"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                :fill="star <= Math.round(product.rating.average) ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <span class="product-card__rating-text">
            {{ product.rating.average.toFixed(1) }} ({{ product.rating.count }})
          </span>
        </div>

        <div class="product-card__price">
          <span v-if="hasDiscount" class="product-card__old-price">
            {{ formatPrice(product.oldPrice!) }}
          </span>
          <span class="product-card__current-price">
            {{ formatPrice(product.price) }}
          </span>
        </div>
      </div>
    </template>

    <template #footer>
      <BaseButton
        variant="primary"
        size="md"
        :disabled="!isInStock"
        :loading="isAddingToCart"
        @click.stop="handleAddToCart"
        fullWidth
      >
        {{ isInStock ? 'В корзину' : 'Нет в наличии' }}
      </BaseButton>

      <button
        class="product-card__favorite"
        :class="{ 'product-card__favorite--active': isFavorite }"
        type="button"
        @click.stop="toggleFavorite"
        aria-label="Добавить в избранное"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.84 4.61C20.3292 4.09944 19.7228 3.69541 19.0554 3.4211C18.3879 3.14679 17.6725 3.00731 16.95 3.00731C16.2275 3.00731 15.5121 3.14679 14.8446 3.4211C14.1772 3.69541 13.5708 4.09944 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 3.00022 7.05 3.00022C5.59096 3.00022 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.55022 7.04096 1.55022 8.5C1.55022 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3506 11.8792 21.7546 11.2728 22.0289 10.6054C22.3032 9.93789 22.4427 9.22249 22.4427 8.5C22.4427 7.77751 22.3032 7.0621 22.0289 6.39461C21.7546 5.72711 21.3506 5.12075 20.84 4.61Z"
            :fill="isFavorite ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </template>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Product } from '~/types';

interface Props {
  product: Product;
}

const props = defineProps<Props>();

const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();

const isAddingToCart = ref(false);

// Check if product is in wishlist
const isFavorite = computed(() => wishlistStore.hasItem(props.product._id));

// Debug output
onMounted(() => {
  console.log('🎴 ProductCard mounted for:', props.product.name);
  console.log('🖼️ Product images:', props.product.images);
  if (props.product.images?.length) {
    console.log('📸 First image URL:', props.product.images[0].url);
  }
});

const isInStock = computed(() => {
  return props.product.stock.quantity > 0 && props.product.isActive;
});

const hasDiscount = computed(() => {
  return props.product.oldPrice && props.product.oldPrice > props.product.price;
});

const discountPercent = computed(() => {
  if (!hasDiscount.value || !props.product.oldPrice) return 0;
  return Math.round(((props.product.oldPrice - props.product.price) / props.product.oldPrice) * 100);
});

const isNew = computed(() => {
  const createdDate = new Date(props.product.createdAt);
  const now = new Date();
  const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysDiff <= 14; // New if created within 14 days
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const truncateDescription = (text: string, maxLength = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const navigateToProduct = () => {
  router.push(`/products/${props.product.slug}`);
};

const handleAddToCart = async () => {
  if (!isInStock.value || isAddingToCart.value) return;

  isAddingToCart.value = true;

  try {
    await cartStore.addItem(props.product._id, 1);
  } catch (error) {
    console.error('Error adding to cart:', error);
  } finally {
    isAddingToCart.value = false;
  }
};

const toggleFavorite = async () => {
  try {
    await wishlistStore.toggleItem(props.product);
    console.log('✅ Toggled favorite:', props.product.name);
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
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

.product-card {
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: all $transition-slow $transition-ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-2xl, $shadow-colored;

    .product-card__image-overlay {
      opacity: 1;
    }

    .product-card__image {
      transform: scale(1.1);
    }

    .product-card__title {
      background-size: 200% auto;
      background-position: right center;
    }

    .product-card__favorite {
      transform: scale(1.1);
    }
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%; // 1:1 aspect ratio
    overflow: hidden;
    background: linear-gradient(135deg, $gray-50 0%, $gray-100 100%);
    border-radius: $radius-xl $radius-xl 0 0;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-slow $transition-ease;
  }

  &__image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba($primary, 0.1) 0%,
      rgba($secondary, 0.15) 100%
    );
    opacity: 0;
    transition: opacity $transition-slow $transition-ease;
    pointer-events: none;
  }

  &__image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $gray-400;
    background: linear-gradient(135deg, $gray-100 0%, $gray-200 100%);
  }

  &__badges {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    position: relative;
    z-index: 2;

    :deep(.base-badge) {
      backdrop-filter: blur(8px);
      background: rgba($white, 0.95);
      box-shadow: $shadow-md;
      font-weight: $font-weight-semibold;
      letter-spacing: 0.5px;
      transition: all $transition-base $transition-ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-md;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    background: linear-gradient(
      135deg,
      $gray-900 0%,
      $gray-700 50%,
      $primary 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: all $transition-slow $transition-ease;
  }

  &__description {
    font-size: $font-size-sm;
    color: $gray-600;
    margin: 0;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-xs $spacing-sm;
    background: linear-gradient(135deg, rgba($warning, 0.05) 0%, rgba($warning, 0.1) 100%);
    border-radius: $radius-lg;
    width: fit-content;
  }

  &__stars {
    display: flex;
    gap: 2px;
  }

  &__star {
    color: $gray-300;
    transition: all $transition-base $transition-ease;

    &--filled {
      color: $warning;
      filter: drop-shadow(0 0 4px rgba($warning, 0.5));
    }
  }

  &__rating-text {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    background: $gradient-sunset;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__price {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-top: auto;
    padding-top: $spacing-sm;
    border-top: 2px solid $gray-100;
  }

  &__old-price {
    font-size: $font-size-base;
    color: $gray-400;
    text-decoration: line-through;
    font-weight: $font-weight-medium;
  }

  &__current-price {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    background: $gradient-primary;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__favorite {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    padding: 0;
    border: 2px solid transparent;
    border-radius: $radius-xl;
    background: linear-gradient($white, $white) padding-box,
                $gradient-primary border-box;
    color: $gray-500;
    cursor: pointer;
    transition: all $transition-slow $transition-ease;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: $radius-xl;
      padding: 2px;
      background: $gradient-primary;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity $transition-base $transition-ease;
    }

    &:hover {
      border-color: $primary;
      color: $primary;
      background: linear-gradient(rgba($primary, 0.05), rgba($primary, 0.1)) padding-box,
                  $gradient-primary border-box;
      transform: scale(1.1);
      box-shadow: $shadow-glow;

      &::before {
        opacity: 1;
      }
    }

    &--active {
      background: linear-gradient(rgba($error, 0.1), rgba($error, 0.15)) padding-box,
                  $gradient-secondary border-box;
      color: $error;
      animation: pulse 2s infinite;

      &::before {
        background: $gradient-secondary;
        opacity: 1;
      }

      &:hover {
        border-color: $error;
        color: $error;
        box-shadow: 0 0 20px rgba($error, 0.5);
      }
    }

    svg {
      position: relative;
      z-index: 1;
      transition: all $transition-base $transition-ease;
    }
  }

  :deep(.base-button) {
    background: $gradient-primary;
    border: none;
    font-weight: $font-weight-bold;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-size: $font-size-sm;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba($white, 0.3),
        transparent
      );
      transition: left $transition-slow $transition-ease;
    }

    &:hover::before {
      left: 100%;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-lg, $shadow-glow;
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: $gray-300;
      color: $gray-500;
      cursor: not-allowed;

      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }
}

// Add overlay gradient to image wrapper
.product-card__image-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent 50%,
    rgba($black, 0.05) 100%
  );
  pointer-events: none;
}
</style>
