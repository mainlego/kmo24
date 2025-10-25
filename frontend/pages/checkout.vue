<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="checkout-page__title">Оформление заказа</h1>

      <!-- Redirect if cart is empty -->
      <div v-if="isEmpty" class="checkout-page__empty">
        <h2>Корзина пуста</h2>
        <p>Добавьте товары в корзину, чтобы оформить заказ</p>
        <BaseButton variant="primary" @click="navigateTo('/products')">
          Перейти в каталог
        </BaseButton>
      </div>

      <div v-else class="checkout-page__content">
        <!-- Steps Indicator -->
        <div class="checkout-steps">
          <div
            v-for="(step, index) in steps"
            :key="step.id"
            class="checkout-steps__step"
            :class="{
              'checkout-steps__step--active': currentStep === index + 1,
              'checkout-steps__step--completed': currentStep > index + 1,
            }"
          >
            <div class="checkout-steps__number">{{ index + 1 }}</div>
            <div class="checkout-steps__label">{{ step.label }}</div>
          </div>
        </div>

        <div class="checkout-page__main">
          <!-- Form Section -->
          <div class="checkout-page__form">
            <!-- Step 1: Contact Info -->
            <div v-show="currentStep === 1" class="checkout-step">
              <h2>Контактная информация</h2>
              <div class="checkout-step__fields">
                <div class="checkout-step__row">
                  <BaseInput
                    v-model="form.firstName"
                    label="Имя"
                    placeholder="Иван"
                    required
                  />
                  <BaseInput
                    v-model="form.lastName"
                    label="Фамилия"
                    placeholder="Иванов"
                    required
                  />
                </div>
                <BaseInput
                  v-model="form.email"
                  type="email"
                  label="Email"
                  placeholder="your@email.com"
                  required
                />
                <BaseInput
                  v-model="form.phone"
                  type="tel"
                  label="Телефон"
                  placeholder="+7 (999) 123-45-67"
                  required
                />
              </div>
            </div>

            <!-- Step 2: Delivery Address -->
            <div v-show="currentStep === 2" class="checkout-step">
              <h2>Адрес доставки</h2>
              <div class="checkout-step__fields">
                <div class="checkout-step__row">
                  <BaseInput
                    v-model="form.city"
                    label="Город"
                    placeholder="Москва"
                    required
                  />
                  <BaseInput
                    v-model="form.postalCode"
                    label="Индекс"
                    placeholder="123456"
                    required
                  />
                </div>
                <BaseInput
                  v-model="form.street"
                  label="Улица"
                  placeholder="Ленина"
                  required
                />
                <div class="checkout-step__row">
                  <BaseInput
                    v-model="form.building"
                    label="Дом"
                    placeholder="12"
                    required
                  />
                  <BaseInput
                    v-model="form.apartment"
                    label="Квартира"
                    placeholder="45"
                  />
                </div>
                <div class="checkout-step__row">
                  <BaseInput
                    v-model="form.entrance"
                    label="Подъезд"
                    placeholder="3"
                  />
                  <BaseInput
                    v-model="form.floor"
                    label="Этаж"
                    placeholder="5"
                  />
                </div>
                <BaseInput
                  v-model="form.notes"
                  label="Комментарий"
                  placeholder="Код домофона, особые указания"
                />
              </div>
            </div>

            <!-- Step 3: Delivery Method -->
            <div v-show="currentStep === 3" class="checkout-step">
              <h2>Способ доставки</h2>
              <div class="delivery-methods">
                <label
                  v-for="method in deliveryMethods"
                  :key="method.id"
                  class="delivery-method"
                  :class="{ 'delivery-method--selected': form.deliveryMethod === method.id }"
                >
                  <input
                    v-model="form.deliveryMethod"
                    type="radio"
                    :value="method.id"
                    name="delivery"
                  />
                  <div class="delivery-method__content">
                    <div class="delivery-method__icon" v-html="method.icon"></div>
                    <div class="delivery-method__info">
                      <div class="delivery-method__name">{{ method.name }}</div>
                      <div class="delivery-method__time">{{ method.time }}</div>
                      <div class="delivery-method__price">
                        {{ method.price > 0 ? formatPrice(method.price) : 'Бесплатно' }}
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Step 4: Payment Method -->
            <div v-show="currentStep === 4" class="checkout-step">
              <h2>Способ оплаты</h2>
              <div class="payment-methods">
                <label
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="payment-method"
                  :class="{ 'payment-method--selected': form.paymentMethod === method.id }"
                >
                  <input
                    v-model="form.paymentMethod"
                    type="radio"
                    :value="method.id"
                    name="payment"
                  />
                  <div class="payment-method__content">
                    <div class="payment-method__icon" v-html="method.icon"></div>
                    <div class="payment-method__name">{{ method.name }}</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="checkout-step__actions">
              <BaseButton
                v-if="currentStep > 1"
                variant="outline"
                size="lg"
                @click="previousStep"
              >
                ← Назад
              </BaseButton>
              <BaseButton
                v-if="currentStep < 4"
                variant="primary"
                size="lg"
                @click="nextStep"
                :disabled="!isCurrentStepValid"
              >
                Продолжить →
              </BaseButton>
              <BaseButton
                v-else
                variant="primary"
                size="lg"
                @click="submitOrder"
                :loading="isSubmitting"
                :disabled="!isCurrentStepValid"
              >
                Оформить заказ
              </BaseButton>
            </div>
          </div>

          <!-- Order Summary Sidebar -->
          <div class="checkout-page__summary">
            <div class="order-summary">
              <h3>Ваш заказ</h3>

              <!-- Items -->
              <div class="order-summary__items">
                <div
                  v-for="item in items"
                  :key="item.productId"
                  class="order-summary__item"
                >
                  <img
                    :src="item.product.images?.[0]?.url || 'https://via.placeholder.com/60'"
                    :alt="item.product.name"
                    class="order-summary__item-image"
                  />
                  <div class="order-summary__item-info">
                    <div class="order-summary__item-name">{{ item.product.name }}</div>
                    <div class="order-summary__item-quantity">{{ item.quantity }} шт.</div>
                  </div>
                  <div class="order-summary__item-price">
                    {{ formatPrice(item.product.price * item.quantity) }}
                  </div>
                </div>
              </div>

              <div class="order-summary__divider"></div>

              <!-- Totals -->
              <div class="order-summary__totals">
                <div class="order-summary__row">
                  <span>Товары ({{ totalItems }})</span>
                  <span>{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="order-summary__row">
                  <span>Доставка</span>
                  <span>{{ deliveryCost > 0 ? formatPrice(deliveryCost) : 'Бесплатно' }}</span>
                </div>
              </div>

              <div class="order-summary__divider"></div>

              <div class="order-summary__total">
                <span>Итого</span>
                <span class="order-summary__total-price">{{ formatPrice(total + deliveryCost) }}</span>
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

const currentStep = ref(1);
const isSubmitting = ref(false);

const steps = [
  { id: 1, label: 'Контакты' },
  { id: 2, label: 'Адрес' },
  { id: 3, label: 'Доставка' },
  { id: 4, label: 'Оплата' },
];

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  postalCode: '',
  street: '',
  building: '',
  apartment: '',
  entrance: '',
  floor: '',
  notes: '',
  deliveryMethod: 'courier',
  paymentMethod: 'card',
});

const deliveryMethods = [
  {
    id: 'courier',
    name: 'Курьером',
    time: '1-2 дня',
    price: 500,
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 16V6C13 5.46957 12.7893 4.96086 12.4142 4.58579C12.0391 4.21071 11.5304 4 11 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13H16C14.89 13 14 12.1 14 11V7C14 6.46957 13.7893 5.96086 13.4142 5.58579C13.0391 5.21071 12.5304 5 12 5H11" stroke="currentColor" stroke-width="2"/></svg>',
  },
  {
    id: 'pickup',
    name: 'Самовывоз',
    time: 'Завтра',
    price: 0,
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2"/></svg>',
  },
  {
    id: 'express',
    name: 'Экспресс доставка',
    time: 'Сегодня',
    price: 1000,
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/></svg>',
  },
];

const paymentMethods = [
  {
    id: 'card',
    name: 'Банковской картой',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" stroke-width="2"/><path d="M1 10H23" stroke="currentColor" stroke-width="2"/></svg>',
  },
  {
    id: 'cash',
    name: 'Наличными при получении',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2"/></svg>',
  },
  {
    id: 'online',
    name: 'Онлайн-переводом',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/><path d="M2 12H22" stroke="currentColor" stroke-width="2"/><path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" stroke-width="2"/></svg>',
  },
];

const deliveryCost = computed(() => {
  const method = deliveryMethods.find(m => m.id === form.deliveryMethod);
  return method?.price || 0;
});

const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.firstName && form.lastName && form.email && form.phone;
    case 2:
      return form.city && form.postalCode && form.street && form.building;
    case 3:
      return !!form.deliveryMethod;
    case 4:
      return !!form.paymentMethod;
    default:
      return false;
  }
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const nextStep = () => {
  if (isCurrentStepValid.value && currentStep.value < 4) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const submitOrder = async () => {
  if (!isCurrentStepValid.value) return;

  isSubmitting.value = true;

  try {
    // TODO: API call to create order
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order object
    const orderData = {
      ...form,
      items: items.value,
      total: total.value + deliveryCost.value,
      deliveryCost: deliveryCost.value,
    };

    console.log('Order submitted:', orderData);

    // Clear cart
    await cartStore.clearCart();

    // Redirect to success page
    alert('Заказ успешно оформлен! Номер заказа: #' + Date.now());
    router.push('/account/orders');
  } catch (error) {
    console.error('Error submitting order:', error);
    alert('Ошибка при оформлении заказа');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    await cartStore.fetchCart();
    if (isEmpty.value) {
      router.push('/cart');
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
});

// SEO
useHead({
  title: 'Оформление заказа - Онлайн Магазин',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.checkout-page {
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
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
  }

  &__main {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: $spacing-xl;
    align-items: start;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: 1fr;
    }
  }

  &__form {
    background: $white;
    border-radius: $radius-xl;
    padding: $spacing-xl;
    box-shadow: $shadow-sm;
  }

  &__summary {
    position: sticky;
    top: $spacing-xl;
  }
}

// Steps
.checkout-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;
  margin-bottom: $spacing-xl;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(2, 1fr);
  }

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-lg;
    background: $white;
    border: 2px solid $gray-200;
    border-radius: $radius-lg;
    transition: all $transition-base;

    &--active {
      border-color: $primary;
      background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($secondary, 0.05) 100%);

      .checkout-steps__number {
        background: $gradient-primary;
        color: $white;
      }
    }

    &--completed {
      border-color: $success;

      .checkout-steps__number {
        background: $success;
        color: $white;
      }
    }
  }

  &__number {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $radius-full;
    background: $gray-200;
    color: $gray-600;
    font-weight: $font-weight-bold;
    transition: all $transition-base;
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-700;
    text-align: center;
  }
}

// Step Content
.checkout-step {
  h2 {
    font-size: $font-size-2xl;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0 0 $spacing-lg 0;
  }

  &__fields {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;

    @media (max-width: $breakpoint-sm) {
      grid-template-columns: 1fr;
    }
  }

  &__actions {
    display: flex;
    gap: $spacing-md;
    margin-top: $spacing-xl;
    padding-top: $spacing-xl;
    border-top: 1px solid $gray-200;

    > button {
      flex: 1;

      @media (max-width: $breakpoint-sm) {
        flex: none;
      }
    }
  }
}

// Delivery & Payment Methods
.delivery-methods,
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.delivery-method,
.payment-method {
  position: relative;
  display: block;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: $white;
    border: 2px solid $gray-200;
    border-radius: $radius-lg;
    transition: all $transition-base;
  }

  &:hover &__content {
    border-color: $primary;
  }

  &--selected &__content {
    border-color: $primary;
    background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($secondary, 0.05) 100%);
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: $gray-100;
    border-radius: $radius-md;
    color: $primary;
  }

  &__info {
    flex: 1;
  }

  &__name {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin-bottom: $spacing-xs;
  }

  &__time {
    font-size: $font-size-sm;
    color: $gray-600;
  }

  &__price {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $primary;
    margin-top: $spacing-xs;
  }
}

// Order Summary
.order-summary {
  background: $white;
  border-radius: $radius-xl;
  padding: $spacing-xl;
  box-shadow: $shadow-md;

  h3 {
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin: 0 0 $spacing-lg 0;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__item {
    display: grid;
    grid-template-columns: 60px 1fr auto;
    gap: $spacing-md;
    align-items: center;
  }

  &__item-image {
    width: 60px;
    height: 60px;
    border-radius: $radius-md;
    object-fit: cover;
    background: $gray-100;
  }

  &__item-info {
    min-width: 0;
  }

  &__item-name {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-900;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__item-quantity {
    font-size: $font-size-xs;
    color: $gray-600;
  }

  &__item-price {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    text-align: right;
  }

  &__divider {
    height: 1px;
    background: $gray-200;
    margin: $spacing-md 0;
  }

  &__totals {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-base;
    color: $gray-700;
  }

  &__total {
    display: flex;
    justify-content: space-between;
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
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
