<template>
  <div class="cart-item">
    <div class="cart-item__image">
      <img
        :src="item.product.images?.[0]?.url || 'https://via.placeholder.com/100'"
        :alt="item.product.name"
      />
    </div>

    <div class="cart-item__info">
      <NuxtLink :to="`/products/${item.product.slug}`" class="cart-item__name">
        {{ item.product.name }}
      </NuxtLink>
      <p v-if="item.variant" class="cart-item__variant">
        Вариант: {{ item.variant.name }}
      </p>
      <p class="cart-item__price">
        {{ formatPrice(item.product.price) }} × {{ item.quantity }}
      </p>
    </div>

    <div class="cart-item__actions">
      <div class="cart-item__quantity">
        <button
          @click="decreaseQuantity"
          :disabled="item.quantity <= 1 || isUpdating"
          aria-label="Уменьшить количество"
        >
          -
        </button>
        <span>{{ item.quantity }}</span>
        <button
          @click="increaseQuantity"
          :disabled="isUpdating"
          aria-label="Увеличить количество"
        >
          +
        </button>
      </div>

      <div class="cart-item__total">
        {{ formatPrice(item.product.price * item.quantity) }}
      </div>

      <button
        class="cart-item__remove"
        @click="handleRemove"
        :disabled="isRemoving"
        aria-label="Удалить товар"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CartItem as CartItemType } from '~/types';

interface Props {
  item: CartItemType;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  updateQuantity: [productId: string, quantity: number];
  remove: [productId: string];
}>();

const isUpdating = ref(false);
const isRemoving = ref(false);

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const increaseQuantity = async () => {
  isUpdating.value = true;
  try {
    emit('updateQuantity', props.item.product._id, props.item.quantity + 1);
    await new Promise(resolve => setTimeout(resolve, 300));
  } finally {
    isUpdating.value = false;
  }
};

const decreaseQuantity = async () => {
  if (props.item.quantity <= 1) return;

  isUpdating.value = true;
  try {
    emit('updateQuantity', props.item.product._id, props.item.quantity - 1);
    await new Promise(resolve => setTimeout(resolve, 300));
  } finally {
    isUpdating.value = false;
  }
};

const handleRemove = async () => {
  isRemoving.value = true;
  try {
    emit('remove', props.item.product._id);
    await new Promise(resolve => setTimeout(resolve, 300));
  } finally {
    isRemoving.value = false;
  }
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: $spacing-lg;
  padding: $spacing-lg;
  background: $white;
  border: 1px solid $gray-200;
  border-radius: $radius-lg;
  transition: all $transition-base;

  &:hover {
    box-shadow: $shadow-sm;
  }

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 80px 1fr;
    gap: $spacing-md;
  }

  &__image {
    width: 100px;
    height: 100px;
    border-radius: $radius-md;
    overflow: hidden;
    background: $gray-100;

    @media (max-width: $breakpoint-sm) {
      width: 80px;
      height: 80px;
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
  }

  &__name {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    text-decoration: none;
    transition: color $transition-base;

    &:hover {
      color: $primary;
    }

    @media (max-width: $breakpoint-sm) {
      font-size: $font-size-sm;
    }
  }

  &__variant {
    font-size: $font-size-sm;
    color: $gray-600;
    margin: 0;
  }

  &__price {
    font-size: $font-size-sm;
    color: $gray-700;
    margin: 0;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-md;

    @media (max-width: $breakpoint-sm) {
      grid-column: 1 / -1;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__quantity {
    display: flex;
    align-items: center;
    border: 1px solid $gray-300;
    border-radius: $radius-md;
    overflow: hidden;

    button {
      width: 32px;
      height: 32px;
      border: none;
      background: $gray-100;
      color: $gray-700;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      cursor: pointer;
      transition: all $transition-base;

      &:hover:not(:disabled) {
        background: $gray-200;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    span {
      min-width: 40px;
      text-align: center;
      font-weight: $font-weight-medium;
      font-size: $font-size-base;
    }
  }

  &__total {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $gray-900;
  }

  &__remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid $gray-300;
    border-radius: $radius-md;
    background: $white;
    color: $gray-500;
    cursor: pointer;
    transition: all $transition-base;

    &:hover:not(:disabled) {
      border-color: $error;
      color: $error;
      background: rgba($error, 0.05);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
</style>
