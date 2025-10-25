<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="checkout-page__title">Оформление заказа</h1>

      <!-- Empty Cart Redirect -->
      <div v-if="cartStore.isEmpty" class="checkout-page__empty">
        <p>Ваша корзина пуста. Добавьте товары для оформления заказа.</p>
        <BaseButton variant="primary" @click="navigateTo('/products')">
          Перейти в каталог
        </BaseButton>
      </div>

      <!-- Checkout Content -->
      <div v-else class="checkout-page__content">
        <!-- Forms Section -->
        <div class="checkout-page__forms">
          <!-- Personal Info -->
          <BaseCard class="checkout-page__card">
            <template #header>
              <h2>1. Личные данные</h2>
            </template>

            <div class="checkout-page__form-grid">
              <BaseInput
                v-model="formData.firstName"
                label="Имя"
                placeholder="Иван"
                :error="errors.firstName"
                required
              />
              <BaseInput
                v-model="formData.lastName"
                label="Фамилия"
                placeholder="Иванов"
                :error="errors.lastName"
                required
              />
              <BaseInput
                v-model="formData.email"
                type="email"
                label="Email"
                placeholder="email@example.com"
                :error="errors.email"
                required
              />
              <BaseInput
                v-model="formData.phone"
                type="tel"
                label="Телефон"
                placeholder="+7 (900) 123-45-67"
                :error="errors.phone"
                required
              />
            </div>
          </BaseCard>

          <!-- Delivery -->
          <BaseCard class="checkout-page__card">
            <template #header>
              <h2>2. Доставка</h2>
            </template>

            <div class="checkout-page__delivery-methods">
              <label
                v-for="method in deliveryMethods"
                :key="method.id"
                class="checkout-page__delivery-method"
              >
                <BaseRadio
                  v-model="formData.deliveryMethod"
                  :value="method.id"
                  name="delivery"
                />
                <div class="checkout-page__delivery-info">
                  <div class="checkout-page__delivery-name">
                    {{ method.name }}
                    <span v-if="method.price > 0">({{ formatPrice(method.price) }})</span>
                    <BaseBadge v-else variant="success" size="sm">Бесплатно</BaseBadge>
                  </div>
                  <p class="checkout-page__delivery-description">{{ method.description }}</p>
                </div>
              </label>
            </div>

            <div v-if="formData.deliveryMethod === 'courier'" class="checkout-page__form-grid">
              <BaseInput
                v-model="formData.address.street"
                label="Улица"
                placeholder="ул. Ленина"
                :error="errors['address.street']"
                required
                fullWidth
              />
              <BaseInput
                v-model="formData.address.house"
                label="Дом"
                placeholder="10"
                :error="errors['address.house']"
                required
              />
              <BaseInput
                v-model="formData.address.apartment"
                label="Квартира"
                placeholder="25"
              />
              <BaseInput
                v-model="formData.address.entrance"
                label="Подъезд"
                placeholder="2"
              />
              <BaseInput
                v-model="formData.address.floor"
                label="Этаж"
                placeholder="5"
              />
              <BaseInput
                v-model="formData.address.intercom"
                label="Домофон"
                placeholder="125"
              />
            </div>
          </BaseCard>

          <!-- Payment -->
          <BaseCard class="checkout-page__card">
            <template #header>
              <h2>3. Способ оплаты</h2>
            </template>

            <div class="checkout-page__payment-methods">
              <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="checkout-page__payment-method"
              >
                <BaseRadio
                  v-model="formData.paymentMethod"
                  :value="method.id"
                  name="payment"
                />
                <div class="checkout-page__payment-info">
                  <div class="checkout-page__payment-name">{{ method.name }}</div>
                  <p class="checkout-page__payment-description">{{ method.description }}</p>
                </div>
              </label>
            </div>
          </BaseCard>

          <!-- Comment -->
          <BaseCard class="checkout-page__card">
            <template #header>
              <h2>4. Комментарий к заказу</h2>
            </template>

            <BaseTextarea
              v-model="formData.comment"
              placeholder="Дополнительная информация, пожелания по доставке..."
              :rows="4"
              :maxlength="500"
            />
          </BaseCard>
        </div>

        <!-- Order Summary -->
        <div class="checkout-page__summary">
          <BaseCard>
            <template #header>
              <h3>Ваш заказ</h3>
            </template>

            <div class="checkout-page__summary-content">
              <!-- Items -->
              <div class="checkout-page__summary-items">
                <div
                  v-for="item in cartStore.items"
                  :key="item.product._id"
                  class="checkout-page__summary-item"
                >
                  <div class="checkout-page__summary-item-image">
                    <img
                      :src="item.product.images?.[0]?.url || 'https://via.placeholder.com/60'"
                      :alt="item.product.name"
                    />
                  </div>
                  <div class="checkout-page__summary-item-info">
                    <div class="checkout-page__summary-item-name">{{ item.product.name }}</div>
                    <div class="checkout-page__summary-item-quantity">{{ item.quantity }} шт.</div>
                  </div>
                  <div class="checkout-page__summary-item-price">
                    {{ formatPrice(item.product.price * item.quantity) }}
                  </div>
                </div>
              </div>

              <!-- Totals -->
              <div class="checkout-page__summary-totals">
                <div class="checkout-page__summary-line">
                  <span>Товары:</span>
                  <span>{{ formatPrice(cartStore.subtotal) }}</span>
                </div>

                <div
                  v-if="deliveryPrice > 0"
                  class="checkout-page__summary-line"
                >
                  <span>Доставка:</span>
                  <span>{{ formatPrice(deliveryPrice) }}</span>
                </div>

                <div
                  v-if="cartStore.discount > 0"
                  class="checkout-page__summary-line checkout-page__summary-line--discount"
                >
                  <span>Скидка:</span>
                  <span>-{{ formatPrice(cartStore.discount) }}</span>
                </div>

                <div class="checkout-page__summary-line checkout-page__summary-line--total">
                  <span>Итого:</span>
                  <span>{{ formatPrice(totalWithDelivery) }}</span>
                </div>
              </div>

              <!-- Agreement -->
              <div class="checkout-page__agreement">
                <BaseCheckbox
                  v-model="formData.agreeToTerms"
                  :error="errors.agreeToTerms"
                >
                  Я согласен с <a href="/terms" target="_blank">условиями обработки персональных данных</a>
                </BaseCheckbox>
              </div>
            </div>

            <template #footer>
              <BaseButton
                variant="primary"
                size="lg"
                fullWidth
                :loading="isSubmitting"
                :disabled="!isFormValid"
                @click="handleSubmitOrder"
              >
                Оформить заказ на {{ formatPrice(totalWithDelivery) }}
              </BaseButton>
            </template>
          </BaseCard>

          <!-- Security Info -->
          <div class="checkout-page__security">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 8V12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 16H12.01"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Ваши данные защищены и не передаются третьим лицам</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const router = useRouter();
const cartStore = useCartStore();

const isSubmitting = ref(false);

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  deliveryMethod: 'courier',
  address: {
    street: '',
    house: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
  },
  paymentMethod: 'card_online',
  comment: '',
  agreeToTerms: false,
});

const errors = ref<Record<string, string>>({});

const deliveryMethods = [
  {
    id: 'courier',
    name: 'Курьером',
    description: 'Доставка по адресу в течение 1-3 дней',
    price: 500,
  },
  {
    id: 'pickup',
    name: 'Самовывоз',
    description: 'Забрать из пункта выдачи',
    price: 0,
  },
  {
    id: 'express',
    name: 'Экспресс-доставка',
    description: 'Доставка в день заказа',
    price: 1500,
  },
];

const paymentMethods = [
  {
    id: 'card_online',
    name: 'Онлайн оплата картой',
    description: 'Безопасная оплата через платежный шлюз',
  },
  {
    id: 'card_courier',
    name: 'Картой при получении',
    description: 'Оплата курьеру при доставке',
  },
  {
    id: 'cash',
    name: 'Наличными при получении',
    description: 'Оплата наличными курьеру',
  },
];

const deliveryPrice = computed(() => {
  const method = deliveryMethods.find(m => m.id === formData.value.deliveryMethod);
  return method?.price || 0;
});

const totalWithDelivery = computed(() => {
  return cartStore.total + deliveryPrice.value;
});

const isFormValid = computed(() => {
  return (
    formData.value.firstName.trim() &&
    formData.value.lastName.trim() &&
    formData.value.email.trim() &&
    formData.value.phone.trim() &&
    formData.value.deliveryMethod &&
    formData.value.paymentMethod &&
    formData.value.agreeToTerms &&
    (formData.value.deliveryMethod !== 'courier' ||
      (formData.value.address.street.trim() && formData.value.address.house.trim()))
  );
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.firstName.trim()) {
    errors.value.firstName = 'Введите имя';
    isValid = false;
  }

  if (!formData.value.lastName.trim()) {
    errors.value.lastName = 'Введите фамилию';
    isValid = false;
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'Введите email';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Некорректный email';
    isValid = false;
  }

  if (!formData.value.phone.trim()) {
    errors.value.phone = 'Введите телефон';
    isValid = false;
  }

  if (formData.value.deliveryMethod === 'courier') {
    if (!formData.value.address.street.trim()) {
      errors.value['address.street'] = 'Введите улицу';
      isValid = false;
    }
    if (!formData.value.address.house.trim()) {
      errors.value['address.house'] = 'Введите номер дома';
      isValid = false;
    }
  }

  if (!formData.value.agreeToTerms) {
    errors.value.agreeToTerms = 'Необходимо согласие';
    isValid = false;
  }

  return isValid;
};

const handleSubmitOrder = async () => {
  if (!validateForm()) {
    console.log('Form validation failed');
    return;
  }

  isSubmitting.value = true;

  try {
    // TODO: Submit order to API
    const orderData = {
      ...formData.value,
      items: cartStore.items,
      subtotal: cartStore.subtotal,
      delivery: deliveryPrice.value,
      discount: cartStore.discount,
      total: totalWithDelivery.value,
    };

    console.log('Submitting order:', orderData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear cart
    await cartStore.clearCart();

    // Redirect to success page
    router.push('/checkout/success');
  } catch (error) {
    console.error('Error submitting order:', error);
    alert('Произошла ошибка при оформлении заказа');
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    await cartStore.fetchCart();

    // Redirect if cart is empty
    if (cartStore.isEmpty) {
      router.push('/products');
    }
  } catch (error) {
    console.error('Error loading cart:', error);
  }
});

// SEO
useHead({
  title: 'Оформление заказа - Онлайн Магазин',
  meta: [
    {
      name: 'description',
      content: 'Оформите заказ быстро и удобно. Выберите способ доставки и оплаты.',
    },
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
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: $spacing-xl;
    align-items: start;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: 1fr;
    }
  }

  &__forms {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__card {
    h2 {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0;
    }
  }

  &__form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;

    @media (max-width: $breakpoint-sm) {
      grid-template-columns: 1fr;
    }

    & > *[fullWidth] {
      grid-column: 1 / -1;
    }
  }

  &__delivery-methods,
  &__payment-methods {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
  }

  &__delivery-method,
  &__payment-method {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-lg;
    border: 2px solid $gray-200;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: all $transition-base;

    &:hover {
      border-color: $primary;
      background: rgba($primary, 0.02);
    }

    &:has(input:checked) {
      border-color: $primary;
      background: rgba($primary, 0.05);
    }
  }

  &__delivery-info,
  &__payment-info {
    flex: 1;
  }

  &__delivery-name,
  &__payment-name {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin-bottom: $spacing-xs;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__delivery-description,
  &__payment-description {
    font-size: $font-size-sm;
    color: $gray-600;
    margin: 0;
  }

  &__summary {
    position: sticky;
    top: $spacing-xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    @media (max-width: $breakpoint-lg) {
      position: static;
    }

    h3 {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0;
    }
  }

  &__summary-content {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__summary-items {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    max-height: 300px;
    overflow-y: auto;
    padding-right: $spacing-sm;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: $gray-100;
      border-radius: $radius-full;
    }

    &::-webkit-scrollbar-thumb {
      background: $gray-300;
      border-radius: $radius-full;

      &:hover {
        background: $gray-400;
      }
    }
  }

  &__summary-item {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
  }

  &__summary-item-image {
    width: 60px;
    height: 60px;
    border-radius: $radius-md;
    overflow: hidden;
    background: $gray-100;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__summary-item-info {
    flex: 1;
    min-width: 0;
  }

  &__summary-item-name {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-900;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__summary-item-quantity {
    font-size: $font-size-xs;
    color: $gray-600;
  }

  &__summary-item-price {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    flex-shrink: 0;
  }

  &__summary-totals {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding-top: $spacing-lg;
    border-top: 1px solid $gray-200;
  }

  &__summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $font-size-sm;
    color: $gray-700;

    &--discount {
      color: $success;
      font-weight: $font-weight-medium;
    }

    &--total {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $gray-900;
      padding-top: $spacing-md;
      border-top: 2px solid $gray-200;
      margin-top: $spacing-sm;
    }
  }

  &__agreement {
    font-size: $font-size-sm;
    padding-top: $spacing-md;
    border-top: 1px solid $gray-200;

    a {
      color: $primary;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__security {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md;
    background: $white;
    border-radius: $radius-lg;
    font-size: $font-size-xs;
    color: $gray-600;

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
