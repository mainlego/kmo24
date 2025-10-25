<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="cart-page__title">Корзина</h1>

      <!-- Loading State -->
      <div v-if="cartStore.isLoading" class="cart-page__loading">
        <BaseSpinner size="lg" text="Загрузка корзины..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="cartStore.isEmpty" class="cart-page__empty">
        <div class="cart-page__empty-icon">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h2>Ваша корзина пуста</h2>
        <p>Добавьте товары из каталога, чтобы оформить заказ</p>
        <BaseButton variant="primary" size="lg" @click="navigateTo('/products')">
          Перейти в каталог
        </BaseButton>
      </div>

      <!-- Cart Content -->
      <div v-else class="cart-page__content">
        <div class="cart-page__items">
          <div class="cart-page__items-header">
            <h2>Товары в корзине ({{ cartStore.itemsCount }})</h2>
            <button
              class="cart-page__clear-button"
              @click="handleClearCart"
              :disabled="isClearing"
            >
              Очистить корзину
            </button>
          </div>

          <div class="cart-page__items-list">
            <CartItem
              v-for="item in cartStore.items"
              :key="item.product._id"
              :item="item"
              @update-quantity="handleUpdateQuantity"
              @remove="handleRemoveItem"
            />
          </div>
        </div>

        <div class="cart-page__summary">
          <BaseCard>
            <template #header>
              <h3>Итого</h3>
            </template>

            <div class="cart-page__summary-content">
              <!-- Promo Code -->
              <div class="cart-page__promo">
                <h4>Промокод</h4>
                <div class="cart-page__promo-input">
                  <BaseInput
                    v-model="promoCode"
                    placeholder="Введите промокод"
                    :disabled="!!cartStore.cart?.promoCode"
                  />
                  <BaseButton
                    v-if="!cartStore.cart?.promoCode"
                    variant="outline"
                    @click="handleApplyPromoCode"
                    :loading="isApplyingPromo"
                    :disabled="!promoCode"
                  >
                    Применить
                  </BaseButton>
                  <BaseButton
                    v-else
                    variant="outline"
                    @click="handleRemovePromoCode"
                    :loading="isRemovingPromo"
                  >
                    Удалить
                  </BaseButton>
                </div>
                <BaseBadge
                  v-if="cartStore.cart?.promoCode"
                  variant="success"
                  closable
                  @close="handleRemovePromoCode"
                >
                  {{ cartStore.cart.promoCode.code }}
                </BaseBadge>
              </div>

              <!-- Summary -->
              <div class="cart-page__summary-lines">
                <div class="cart-page__summary-line">
                  <span>Товары ({{ cartStore.itemsCount }}):</span>
                  <span>{{ formatPrice(cartStore.subtotal) }}</span>
                </div>

                <div
                  v-if="cartStore.discount > 0"
                  class="cart-page__summary-line cart-page__summary-line--discount"
                >
                  <span>Скидка:</span>
                  <span>-{{ formatPrice(cartStore.discount) }}</span>
                </div>

                <div class="cart-page__summary-line cart-page__summary-line--total">
                  <span>Итого:</span>
                  <span>{{ formatPrice(cartStore.total) }}</span>
                </div>
              </div>
            </div>

            <template #footer>
              <BaseButton
                variant="primary"
                size="lg"
                fullWidth
                @click="handleCheckout"
              >
                Оформить заказ
              </BaseButton>
              <BaseButton
                variant="outline"
                size="md"
                fullWidth
                @click="navigateTo('/products')"
              >
                Продолжить покупки
              </BaseButton>
            </template>
          </BaseCard>

          <!-- Additional Info -->
          <div class="cart-page__info">
            <div class="cart-page__info-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Гарантия качества</span>
            </div>
            <div class="cart-page__info-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 8H19M5 8C3.89543 8 3 8.89543 3 10V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V10C21 8.89543 20.1046 8 19 8M5 8V6C5 4.89543 5.89543 4 7 4H17C18.1046 4 19 4.89543 19 6V8M12 14H12.01"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Безопасная оплата</span>
            </div>
            <div class="cart-page__info-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 16V6C13 4.89543 13.8954 4 15 4H19C20.1046 4 21 4.89543 21 6V16M13 16H3M13 16H21M3 16V12C3 10.8954 3.89543 10 5 10H9C10.1046 10 11 10.8954 11 12V16M3 16H1V20H23V16H21"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Быстрая доставка</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const router = useRouter();
const cartStore = useCartStore();

const promoCode = ref('');
const isApplyingPromo = ref(false);
const isRemovingPromo = ref(false);
const isClearing = ref(false);

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const handleUpdateQuantity = async (productId: string, quantity: number) => {
  try {
    await cartStore.updateItemQuantity(productId, quantity);
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
};

const handleRemoveItem = async (productId: string) => {
  try {
    await cartStore.removeItem(productId);
  } catch (error) {
    console.error('Error removing item:', error);
  }
};

const handleApplyPromoCode = async () => {
  if (!promoCode.value.trim()) return;

  isApplyingPromo.value = true;
  try {
    await cartStore.applyPromoCode(promoCode.value.trim());
    promoCode.value = '';
  } catch (error) {
    console.error('Error applying promo code:', error);
  } finally {
    isApplyingPromo.value = false;
  }
};

const handleRemovePromoCode = async () => {
  isRemovingPromo.value = true;
  try {
    await cartStore.removePromoCode();
  } catch (error) {
    console.error('Error removing promo code:', error);
  } finally {
    isRemovingPromo.value = false;
  }
};

const handleClearCart = async () => {
  if (!confirm('Вы уверены, что хотите очистить корзину?')) return;

  isClearing.value = true;
  try {
    await cartStore.clearCart();
  } catch (error) {
    console.error('Error clearing cart:', error);
  } finally {
    isClearing.value = false;
  }
};

const handleCheckout = () => {
  router.push('/checkout');
};

onMounted(async () => {
  try {
    await cartStore.fetchCart();
  } catch (error) {
    console.error('Error loading cart:', error);
  }
});

// SEO
useHead({
  title: 'Корзина - Онлайн Магазин',
  meta: [
    {
      name: 'description',
      content: 'Оформите заказ в нашем интернет-магазине. Быстрая доставка, удобная оплата.',
    },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.cart-page {
  min-height: calc(100vh - 200px);
  padding: $spacing-xl 0;
  background: $gray-50;

  &__title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin: 0 0 $spacing-xl 0;
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
  }

  &__empty-icon {
    color: $gray-300;
  }

  &__empty {
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
      max-width: 400px;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: $spacing-xl;
    align-items: start;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: 1fr;
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__items-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-lg;
    background: $white;
    border-radius: $radius-lg;

    h2 {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0;
    }
  }

  &__clear-button {
    padding: $spacing-sm $spacing-md;
    border: 1px solid $gray-300;
    border-radius: $radius-md;
    background: $white;
    color: $error;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $transition-base;

    &:hover:not(:disabled) {
      border-color: $error;
      background: rgba($error, 0.05);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__items-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__summary {
    position: sticky;
    top: $spacing-xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;

    @media (max-width: $breakpoint-lg) {
      position: static;
    }
  }

  &__summary-content {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__promo {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    h4 {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  &__promo-input {
    display: flex;
    gap: $spacing-sm;
  }

  &__summary-lines {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding-top: $spacing-lg;
    border-top: 1px solid $gray-200;
  }

  &__summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $font-size-base;
    color: $gray-700;

    &--discount {
      color: $success;
      font-weight: $font-weight-medium;
    }

    &--total {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: $gray-900;
      padding-top: $spacing-md;
      border-top: 2px solid $gray-200;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: $white;
    border-radius: $radius-lg;
  }

  &__info-item {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    color: $gray-700;
    font-size: $font-size-sm;

    svg {
      color: $success;
      flex-shrink: 0;
    }
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
