<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="cart-page__title">Корзина</h1>

      <!-- Empty State -->
      <div v-if="isEmpty" class="cart-page__empty">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          <path
            d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога, чтобы оформить заказ</p>
        <BaseButton variant="primary" size="lg" @click="navigateTo('/products')">
          Перейти в каталог
        </BaseButton>
      </div>

      <!-- Cart Content -->
      <div v-else class="cart-page__content">
        <div class="cart-page__main">
          <!-- Cart Items -->
          <div class="cart-page__items">
            <div
              v-for="item in items"
              :key="item.productId"
              class="cart-item"
            >
              <div class="cart-item__image-wrapper">
                <img
                  :src="item.product.images?.[0]?.url || 'https://via.placeholder.com/120'"
                  :alt="item.product.name"
                  class="cart-item__image"
                  @click="navigateToProduct(item.product.slug)"
                />
              </div>

              <div class="cart-item__info">
                <h3 class="cart-item__name" @click="navigateToProduct(item.product.slug)">
                  {{ item.product.name }}
                </h3>
                <p v-if="item.product.description?.short" class="cart-item__description">
                  {{ truncateText(item.product.description.short, 100) }}
                </p>

                <!-- Stock Status -->
                <div class="cart-item__status">
                  <BaseBadge
                    v-if="item.product.stock.available >= item.quantity"
                    variant="success"
                    size="sm"
                  >
                    В наличии
                  </BaseBadge>
                  <BaseBadge v-else variant="warning" size="sm">
                    Осталось {{ item.product.stock.available }} шт.
                  </BaseBadge>
                </div>
              </div>

              <!-- Quantity Controls -->
              <div class="cart-item__quantity">
                <button
                  @click="decreaseQuantity(item.productId)"
                  :disabled="item.quantity <= 1"
                  class="cart-item__quantity-btn"
                >
                  −
                </button>
                <input
                  :value="item.quantity"
                  @input="updateQuantity(item.productId, $event)"
                  type="number"
                  min="1"
                  :max="item.product.stock.available"
                  class="cart-item__quantity-input"
                />
                <button
                  @click="increaseQuantity(item.productId)"
                  :disabled="item.quantity >= item.product.stock.available"
                  class="cart-item__quantity-btn"
                >
                  +
                </button>
              </div>

              <!-- Price -->
              <div class="cart-item__price">
                <div v-if="item.product.oldPrice" class="cart-item__old-price">
                  {{ formatPrice(item.product.oldPrice * item.quantity) }}
                </div>
                <div class="cart-item__current-price">
                  {{ formatPrice(item.product.price * item.quantity) }}
                </div>
                <div v-if="item.product.oldPrice" class="cart-item__savings">
                  Экономия: {{ formatPrice((item.product.oldPrice - item.product.price) * item.quantity) }}
                </div>
              </div>

              <!-- Remove Button -->
              <button
                @click="removeFromCart(item.productId)"
                class="cart-item__remove"
                title="Удалить из корзины"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Clear Cart Button -->
          <div class="cart-page__actions">
            <BaseButton
              variant="outline"
              size="sm"
              @click="clearCart"
            >
              Очистить корзину
            </BaseButton>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="cart-page__summary">
          <div class="cart-summary">
            <h2 class="cart-summary__title">Итого</h2>

            <div class="cart-summary__items">
              <div class="cart-summary__row">
                <span>Товары ({{ totalItems }})</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>

              <div v-if="discount > 0" class="cart-summary__row cart-summary__row--discount">
                <span>Скидка</span>
                <span>−{{ formatPrice(discount) }}</span>
              </div>

              <div class="cart-summary__row">
                <span>Доставка</span>
                <span>{{ deliveryCost > 0 ? formatPrice(deliveryCost) : 'Бесплатно' }}</span>
              </div>
            </div>

            <div class="cart-summary__divider"></div>

            <div class="cart-summary__total">
              <span>К оплате</span>
              <span class="cart-summary__total-price">{{ formatPrice(total) }}</span>
            </div>

            <!-- Promo Code -->
            <div class="cart-summary__promo">
              <BaseInput
                v-model="promoCode"
                placeholder="Промокод"
                :disabled="promoApplied"
              >
                <template #suffix>
                  <button
                    v-if="!promoApplied"
                    @click="applyPromo"
                    class="cart-summary__promo-btn"
                    :disabled="!promoCode"
                  >
                    Применить
                  </button>
                  <button
                    v-else
                    @click="removePromo"
                    class="cart-summary__promo-btn cart-summary__promo-btn--remove"
                  >
                    Удалить
                  </button>
                </template>
              </BaseInput>
              <div v-if="promoApplied" class="cart-summary__promo-success">
                ✓ Промокод применен
              </div>
            </div>

            <!-- Free Delivery Progress -->
            <div v-if="!isFreeDelivery" class="cart-summary__delivery-progress">
              <div class="cart-summary__delivery-text">
                До бесплатной доставки: <strong>{{ formatPrice(freeDeliveryThreshold - subtotal) }}</strong>
              </div>
              <div class="cart-summary__delivery-bar">
                <div
                  class="cart-summary__delivery-bar-fill"
                  :style="{ width: deliveryProgressPercentage + '%' }"
                ></div>
              </div>
            </div>
            <div v-else class="cart-summary__free-delivery">
              🎉 Бесплатная доставка!
            </div>

            <!-- Checkout Button -->
            <BaseButton
              variant="primary"
              size="lg"
              @click="proceedToCheckout"
              fullWidth
            >
              Оформить заказ
            </BaseButton>

            <!-- Continue Shopping -->
            <BaseButton
              variant="outline"
              size="md"
              @click="navigateTo('/products')"
              fullWidth
            >
              Продолжить покупки
            </BaseButton>

            <!-- Security Badges -->
            <div class="cart-summary__badges">
              <div class="cart-summary__badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>Безопасная оплата</span>
              </div>
              <div class="cart-summary__badge">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H16"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>Гарантия возврата</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();
const router = useRouter();

const { items, totalItems, subtotal, total, isEmpty } = storeToRefs(cartStore);

const promoCode = ref('');
const promoApplied = ref(false);
const freeDeliveryThreshold = ref(5000); // 5000 RUB for free delivery

const discount = computed(() => {
  return items.value.reduce((sum, item) => {
    if (item.product.oldPrice) {
      return sum + (item.product.oldPrice - item.product.price) * item.quantity;
    }
    return sum;
  }, 0);
});

const deliveryCost = computed(() => {
  return isFreeDelivery.value ? 0 : 500;
});

const isFreeDelivery = computed(() => {
  return subtotal.value >= freeDeliveryThreshold.value;
});

const deliveryProgressPercentage = computed(() => {
  return Math.min((subtotal.value / freeDeliveryThreshold.value) * 100, 100);
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

const navigateToProduct = (slug: string) => {
  router.push(`/products/${slug}`);
};

const increaseQuantity = async (productId: string) => {
  const item = items.value.find(i => i.productId === productId);
  if (!item) return;

  if (item.quantity < item.product.stock.available) {
    await cartStore.updateQuantity(productId, item.quantity + 1);
  }
};

const decreaseQuantity = async (productId: string) => {
  const item = items.value.find(i => i.productId === productId);
  if (!item) return;

  if (item.quantity > 1) {
    await cartStore.updateQuantity(productId, item.quantity - 1);
  }
};

const updateQuantity = async (productId: string, event: Event) => {
  const target = event.target as HTMLInputElement;
  const newQuantity = parseInt(target.value);

  const item = items.value.find(i => i.productId === productId);
  if (!item) return;

  if (newQuantity > 0 && newQuantity <= item.product.stock.available) {
    await cartStore.updateQuantity(productId, newQuantity);
  }
};

const removeFromCart = async (productId: string) => {
  if (!confirm('Удалить товар из корзины?')) return;

  try {
    await cartStore.removeItem(productId);
  } catch (error) {
    console.error('Error removing from cart:', error);
  }
};

const clearCart = async () => {
  if (!confirm('Очистить всю корзину?')) return;

  try {
    await cartStore.clearCart();
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

const applyPromo = () => {
  // TODO: Validate promo code via API
  if (promoCode.value) {
    promoApplied.value = true;
    alert('Промокод применен!');
  }
};

const removePromo = () => {
  promoCode.value = '';
  promoApplied.value = false;
};

const proceedToCheckout = () => {
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
      content: 'Оформите заказ из корзины',
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
    box-shadow: $shadow-sm;

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

  &__content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: $spacing-xl;
    align-items: start;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: 1fr;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
  }

  &__summary {
    position: sticky;
    top: $spacing-xl;
  }
}

// Cart Item
.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto auto auto;
  gap: $spacing-lg;
  align-items: center;
  padding: $spacing-lg;
  background: $white;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  transition: all $transition-base;
  position: relative;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 80px 1fr;
    gap: $spacing-md;
  }

  &:hover {
    box-shadow: $shadow-md;
  }

  &__image-wrapper {
    width: 120px;
    height: 120px;
    border-radius: $radius-lg;
    overflow: hidden;
    background: $gray-100;
    cursor: pointer;

    @media (max-width: $breakpoint-md) {
      width: 80px;
      height: 80px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $transition-base;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    min-width: 0;
  }

  &__name {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0;
    cursor: pointer;
    transition: color $transition-base;

    &:hover {
      color: $primary;
    }

    @media (max-width: $breakpoint-md) {
      font-size: $font-size-base;
    }
  }

  &__description {
    font-size: $font-size-sm;
    color: $gray-600;
    margin: 0;
    line-height: 1.5;

    @media (max-width: $breakpoint-md) {
      display: none;
    }
  }

  &__status {
    @media (max-width: $breakpoint-md) {
      grid-column: 1 / -1;
    }
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: 2px;
    background: $gray-100;
    border-radius: $radius-lg;
    padding: 4px;

    @media (max-width: $breakpoint-md) {
      grid-column: 1 / -1;
      justify-self: start;
    }
  }

  &__quantity-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: $white;
    color: $gray-700;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-base;

    &:hover:not(:disabled) {
      background: $primary;
      color: $white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__quantity-input {
    width: 50px;
    height: 36px;
    border: none;
    background: transparent;
    text-align: center;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $gray-900;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-xs;
    text-align: right;

    @media (max-width: $breakpoint-md) {
      grid-column: 1 / -1;
      align-items: flex-start;
    }
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
  }

  &__savings {
    font-size: $font-size-xs;
    color: $success;
    font-weight: $font-weight-medium;
  }

  &__remove {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: $gray-400;
    border-radius: $radius-md;
    cursor: pointer;
    transition: all $transition-base;

    @media (max-width: $breakpoint-md) {
      position: absolute;
      top: $spacing-sm;
      right: $spacing-sm;
    }

    &:hover {
      background: rgba($error, 0.1);
      color: $error;
    }
  }
}

// Cart Summary
.cart-summary {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
  padding: $spacing-xl;
  background: $white;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin: 0;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $font-size-base;
    color: $gray-700;

    &--discount {
      color: $success;
      font-weight: $font-weight-medium;
    }
  }

  &__divider {
    height: 1px;
    background: $gray-200;
  }

  &__total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-900;
  }

  &__total-price {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    background: $gradient-primary;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &__promo {
    position: relative;
  }

  &__promo-btn {
    border: none;
    background: $primary;
    color: $white;
    padding: $spacing-xs $spacing-md;
    border-radius: $radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $transition-base;

    &:hover:not(:disabled) {
      background: darken($primary, 10%);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--remove {
      background: $error;

      &:hover {
        background: darken($error, 10%);
      }
    }
  }

  &__promo-success {
    font-size: $font-size-sm;
    color: $success;
    font-weight: $font-weight-medium;
    margin-top: $spacing-xs;
  }

  &__delivery-progress {
    padding: $spacing-md;
    background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($secondary, 0.05) 100%);
    border-radius: $radius-lg;
  }

  &__delivery-text {
    font-size: $font-size-sm;
    color: $gray-700;
    margin-bottom: $spacing-sm;
  }

  &__delivery-bar {
    height: 8px;
    background: $gray-200;
    border-radius: $radius-full;
    overflow: hidden;
  }

  &__delivery-bar-fill {
    height: 100%;
    background: $gradient-primary;
    border-radius: $radius-full;
    transition: width $transition-slow;
  }

  &__free-delivery {
    text-align: center;
    padding: $spacing-md;
    background: linear-gradient(135deg, rgba($success, 0.1) 0%, rgba($success, 0.2) 100%);
    border-radius: $radius-lg;
    color: $success;
    font-weight: $font-weight-semibold;
  }

  &__badges {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding-top: $spacing-md;
    border-top: 1px solid $gray-200;
  }

  &__badge {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    font-size: $font-size-sm;
    color: $gray-600;

    svg {
      color: $primary;
    }
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
