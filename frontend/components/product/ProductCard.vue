<template>
  <BaseCard
    class="product-card"
    :class="`product-card--${viewMode}`"
    hoverable
    clickable
    shadow
    @click="navigateToProduct"
  >
    <template #image>
      <div class="product-card__image-wrapper">
        <img
          v-if="product.images?.length && product.images[0]?.url"
          :src="getProductImageUrl(product.images[0].url)"
          :alt="product.images[0]?.alt || product.name"
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

        <!-- Quick View Button - Hidden for compact view -->
      </div>
    </template>

    <template #badge>
      <div class="product-card__badges">
        <BaseBadge v-if="isNew" variant="primary" size="sm" rounded>
          Новинка
        </BaseBadge>
        <BaseBadge v-if="hasNewPrice && savingsPercent >= 20" variant="success" size="sm" rounded>
          Выгода {{ savingsPercent }}%
        </BaseBadge>
        <BaseBadge v-if="!isInStock" variant="warning" size="sm" rounded>
          Нет в наличии
        </BaseBadge>
      </div>
    </template>

    <template #default>
      <div class="product-card__content">
        <h3 class="product-card__title">{{ product.name }}</h3>

        <p v-if="product.description" class="product-card__description">
          {{ typeof product.description === 'string' ? product.description : product.description.short }}
        </p>

        <div class="product-card__rating">
          <div class="product-card__stars">
            <svg
              v-for="star in 5"
              :key="star"
              :class="{ 'product-card__star--filled': star <= Math.round(product.rating.average) }"
              class="product-card__star"
              width="14"
              height="14"
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
            {{ product.rating.average.toFixed(1) }}
          </span>
        </div>

        <div class="product-card__price">
          <span class="product-card__current-price">
            {{ formatPrice(product.price) }}
          </span>
          <span v-if="hasNewPrice" class="product-card__new-price">
            Новый: {{ formatPrice(product.oldPrice) }}
          </span>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="product-card__footer-actions">
        <BaseButton
          variant="primary"
          size="sm"
          :disabled="!isInStock"
          :loading="isAddingToCart"
          @click.stop="handleAddToCart"
          fullWidth
          class="buy-button"
        >
          <span class="buy-button__content">
            <svg v-if="isInStock" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 20C9 21.1 8.1 22 7 22C5.9 22 5 21.1 5 20C5 18.9 5.9 18 7 18C8.1 18 9 18.9 9 20ZM17 18C15.9 18 15 18.9 15 20C15 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18ZM7.2 14.8V14.7L8.1 13H15.5C16.2 13 16.9 12.6 17.2 12L21 5H6.2L5 2H2V4H4L7.6 11.6L6.2 14.2C5.5 15.4 6.2 17 7.7 17H19V15H7.7C7.6 15 7.5 14.9 7.5 14.8L7.2 14.8Z" fill="currentColor"/>
            </svg>
            <span>{{ isInStock ? 'Купить' : 'Нет в наличии' }}</span>
          </span>
        </BaseButton>
      </div>

      <button
        class="product-card__favorite"
        :class="{ 'product-card__favorite--active': isFavorite }"
        type="button"
        @click.stop="toggleFavorite"
        aria-label="Добавить в избранное"
      >
        <svg
          width="20"
          height="20"
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
  viewMode?: 'grid' | 'list';
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid',
});
const emit = defineEmits(['openQuickView', 'openDeliveryCalc']);

const router = useRouter();
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const { getProductImageUrl } = useMediaUrl();

const isAddingToCart = ref(false);

// Check if product is in wishlist
const isFavorite = computed(() => wishlistStore.hasItem(props.product._id));


const isInStock = computed(() => {
  return props.product.stock.quantity > 0 && props.product.isActive;
});

// oldPrice теперь используется как "Цена нового"
const hasNewPrice = computed(() => {
  return props.product.oldPrice && props.product.oldPrice > props.product.price;
});

// Процент экономии по сравнению с ценой нового
const savingsPercent = computed(() => {
  if (!hasNewPrice.value || !props.product.oldPrice) return 0;
  return Math.round(((props.product.oldPrice - props.product.price) / props.product.oldPrice) * 100);
});

// Для обратной совместимости
const hasDiscount = hasNewPrice;
const discountPercent = savingsPercent;

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
  } catch {
    // Error adding to cart
  } finally {
    isAddingToCart.value = false;
  }
};

const toggleFavorite = async () => {
  try {
    await wishlistStore.toggleItem(props.product);
  } catch {
    // Error toggling favorite
  }
};

const openQuickView = () => {
  emit('openQuickView', props.product);
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

  // List view mode
  &--list {
    :deep(.base-card__container) {
      display: grid;
      grid-template-columns: 240px 1fr auto;
      gap: $spacing-lg;
      height: auto;

      @media (max-width: $breakpoint-md) {
        grid-template-columns: 160px 1fr;
        gap: $spacing-md;
      }

      @media (max-width: $breakpoint-sm) {
        grid-template-columns: 120px 1fr;
        gap: $spacing-sm;
      }
    }

    .product-card__image-wrapper {
      padding-top: 0;
      height: 200px;
      border-radius: $radius-xl 0 0 $radius-xl;

      @media (max-width: $breakpoint-md) {
        height: 160px;
      }

      @media (max-width: $breakpoint-sm) {
        height: 120px;
      }
    }

    .product-card__content {
      padding: $spacing-lg;
      justify-content: center;

      @media (max-width: $breakpoint-md) {
        padding: $spacing-md;
      }
    }

    .product-card__title {
      font-size: $font-size-xl;

      @media (max-width: $breakpoint-md) {
        font-size: $font-size-lg;
      }
    }

    .product-card__description {
      display: block;
      -webkit-line-clamp: 3;

      @media (max-width: $breakpoint-sm) {
        display: none;
      }
    }

    :deep(.base-card__footer) {
      flex-direction: column;
      padding: $spacing-lg;
      gap: $spacing-md;
      justify-content: center;

      @media (max-width: $breakpoint-md) {
        grid-column: 1 / -1;
        flex-direction: row;
        padding: $spacing-md;
      }
    }

    :deep(.base-button) {
      @media (max-width: $breakpoint-md) {
        flex: 1;
      }
    }
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 60%; // Ultra-compact: 5:3 aspect ratio for minimal height
    overflow: hidden;
    background: linear-gradient(135deg, $gray-50 0%, $gray-100 100%);
    border-radius: $radius-lg $radius-lg 0 0; // Smaller radius
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
    gap: 4px; // Ultra-compact: Minimal gap
    position: relative;
    z-index: 2;

    :deep(.base-badge) {
      backdrop-filter: blur(8px);
      background: rgba($white, 0.95);
      box-shadow: $shadow-sm; // Smaller shadow
      font-weight: $font-weight-medium; // Less bold
      letter-spacing: 0.2px; // Less spacing
      font-size: 11px !important; // Ultra-compact: Tiny badges
      padding: 2px 6px !important; // Ultra-compact: Minimal padding
      transition: all $transition-base $transition-ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 4px; // Ultra-compact: Minimal gap
    padding: 8px; // Ultra-compact: Minimal padding
  }

  &__title {
    font-size: 14px; // Ultra-compact: Fixed small size
    font-weight: $font-weight-medium; // Ultra-compact: Medium weight
    color: $gray-900; // Simple color for cleaner look
    margin: 0;
    line-height: 1.3; // Tighter line height
    display: -webkit-box;
    -webkit-line-clamp: 2; // Maximum 2 lines
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color $transition-base $transition-ease;

    &:hover {
      color: $primary-600;
    }
  }

  &__description {
    font-size: 12px; // Ultra-compact: Small font for description
    color: $gray-600;
    margin: 4px 0 0 0; // Minimal top margin
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2; // Maximum 2 lines
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }


  &__rating {
    display: flex;
    align-items: center;
    gap: 4px; // Ultra-compact: Minimal gap
    width: fit-content;
  }

  &__stars {
    display: flex;
    gap: 1px; // Ultra-compact: Minimal star gap
  }

  &__star {
    color: $gray-300;
    width: 12px; // Ultra-compact: Smaller stars
    height: 12px;

    &--filled {
      color: $warning;
    }
  }

  &__rating-text {
    font-size: 11px; // Ultra-compact: Tiny text
    font-weight: $font-weight-medium;
    color: $gray-500;
  }

  &__price {
    display: flex;
    align-items: baseline;
    gap: 4px; // Ultra-compact: Minimal gap
    margin-top: auto;
    padding-top: 4px; // Ultra-compact: Minimal padding
    border-top: 1px solid $gray-100;
  }

  &__old-price {
    font-size: 12px;
    color: $gray-400;
    text-decoration: line-through;
    font-weight: $font-weight-normal;
  }

  &__new-price {
    font-size: 11px;
    color: $gray-500;
    font-weight: $font-weight-normal;
    white-space: nowrap;
  }

  &__current-price {
    font-size: 21px;
    font-weight: $font-weight-bold;
    color: $primary-600;
  }

  &__favorite {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px; // Такая же высота как кнопка "Купить"
    padding: 0;
    border: 1px solid $gray-200;
    border-radius: $radius-lg;
    background: $white;
    color: $gray-500;
    cursor: pointer;
    transition: all $transition-slow $transition-ease;
    position: relative;
    flex-shrink: 0;

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
                  $gradient-primary border-box;
      color: $error;
      animation: pulse 2s infinite;

      &::before {
        background: $gradient-primary;
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

  // Стиль для контента кнопки "Купить"
  .buy-button__content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    svg {
      flex-shrink: 0;
    }
  }

  :deep(.base-button) {
    background: $gradient-primary;
    border: none;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.3px;
    text-transform: none;
    font-size: 13px;
    padding: 0 16px !important;
    height: 40px !important; // Фиксированная высота
    min-height: 40px !important;
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

  &__footer-actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    flex: 1;
    min-width: 0;
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

// Quick View Button
.product-card__quick-view {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: rgba($white, 0.95);
  backdrop-filter: blur(12px);
  border: 2px solid transparent;
  border-radius: $radius-full;
  color: $primary;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-slow $transition-ease;
  opacity: 0;
  pointer-events: none;
  z-index: 3;
  box-shadow: $shadow-xl;

  svg {
    transition: transform $transition-base $transition-ease;
  }

  &:hover {
    background: $gradient-primary;
    color: $white;
    transform: translate(-50%, -50%) scale(1);
    box-shadow: $shadow-2xl, $shadow-glow;

    svg {
      transform: scale(1.1);
    }
  }

  .product-card:hover & {
    opacity: 1;
    pointer-events: auto;
    transform: translate(-50%, -50%) scale(1);
  }

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-xs;
    padding: $spacing-xs $spacing-md;
    gap: $spacing-xs;

    svg {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
