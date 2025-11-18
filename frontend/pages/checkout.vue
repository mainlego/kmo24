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
            <!-- Step 1: Company & Contact Info -->
            <div v-show="currentStep === 1" class="checkout-step">
              <h2>Реквизиты организации</h2>
              <div class="checkout-step__fields">
                <BaseInput
                  v-model="form.companyName"
                  label="Наименование организации"
                  placeholder="ООО 'Ваша компания'"
                  required
                />
                <div class="checkout-step__row">
                  <BaseInput
                    v-model="form.inn"
                    label="ИНН"
                    placeholder="1234567890"
                    required
                  />
                  <BaseInput
                    v-model="form.kpp"
                    label="КПП"
                    placeholder="123456789"
                    required
                  />
                </div>
                <BaseInput
                  v-model="form.legalAddress"
                  label="Юридический адрес"
                  placeholder="г. Красноярск, ул. Ленина, д. 1"
                  required
                />
                <BaseInput
                  v-model="form.contactPerson"
                  label="ФИО контактного лица"
                  placeholder="Иванов Иван Иванович"
                  required
                />
                <BaseInput
                  v-model="form.email"
                  type="email"
                  label="Email"
                  placeholder="company@email.com"
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
                <BaseInput
                  v-model="form.city"
                  label="Город"
                  placeholder="Красноярск"
                  required
                />
                <BaseInput
                  v-model="form.street"
                  label="Улица"
                  placeholder="ул. Ленина"
                  required
                />
                <BaseInput
                  v-model="form.building"
                  label="Дом/Офис"
                  placeholder="д. 12, офис 45"
                  required
                />
                <BaseInput
                  v-model="form.notes"
                  label="Комментарий к доставке"
                  placeholder="Особые указания, время доставки"
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

            <!-- Commercial Proposal Section -->
            <div class="proposal-section">
              <div class="proposal-section__header">
                <h3>Коммерческое предложение</h3>
                <p>Сформируйте КП для согласования с руководством</p>
              </div>

              <div class="proposal-section__options">
                <label class="proposal-checkbox">
                  <input v-model="generateProposalOnOrder" type="checkbox" />
                  <span class="proposal-checkbox__mark"></span>
                  <span class="proposal-checkbox__text">
                    Сформировать КП при оформлении заказа
                  </span>
                </label>
              </div>

              <div class="proposal-section__actions">
                <button
                  type="button"
                  class="proposal-btn"
                  @click="generateProposalNow"
                  :disabled="!isProposalFormValid"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  Сформировать КП сейчас
                </button>

                <div v-if="proposalGenerated" class="proposal-success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>КП {{ proposalNumber }} сформировано</span>
                  <button type="button" @click="printGeneratedProposal" class="proposal-action-btn">
                    Печать
                  </button>
                </div>
              </div>
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
import {
  generateProposalPDF,
  generateProposalHTML,
  generateProposalNumber,
  printProposal,
  type ProposalData,
} from '~/utils/commercialProposal';

const cartStore = useCartStore();
const router = useRouter();

const { items, totalItems, subtotal, total, isEmpty } = storeToRefs(cartStore);

const currentStep = ref(1);
const isSubmitting = ref(false);
const generateProposalOnOrder = ref(false);
const proposalGenerated = ref(false);
const proposalNumber = ref('');
const proposalUrl = ref('');

const steps = [
  { id: 1, label: 'Контакты' },
  { id: 2, label: 'Адрес' },
  { id: 3, label: 'Доставка' },
  { id: 4, label: 'Оплата' },
];

const form = reactive({
  // Контактная информация
  contactPerson: '',
  email: '',
  phone: '',
  // Реквизиты организации
  companyName: '',
  inn: '',
  kpp: '',
  legalAddress: '',
  // Адрес доставки
  city: '',
  street: '',
  building: '',
  notes: '',
  deliveryMethod: 'city',
  paymentMethod: 'cash-pickup',
});

const deliveryMethods = [
  {
    id: 'city',
    name: 'Доставка по городу',
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
    id: 'transport',
    name: 'Транспортная компания',
    time: '3-5 дней',
    price: 0,
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/></svg>',
  },
];

const paymentMethods = [
  {
    id: 'cash-pickup',
    name: 'Наличными при самовывозе',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2"/></svg>',
  },
  {
    id: 'bank-transfer',
    name: 'На расчетный счет',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" stroke-width="2"/><path d="M1 10H23" stroke="currentColor" stroke-width="2"/></svg>',
  },
];

const deliveryCost = computed(() => {
  const method = deliveryMethods.find(m => m.id === form.deliveryMethod);
  return method?.price || 0;
});

const isProposalFormValid = computed(() => {
  return form.companyName && form.contactPerson && form.phone && items.value.length > 0;
});

const isCurrentStepValid = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.companyName && form.inn && form.kpp && form.legalAddress &&
             form.contactPerson && form.email && form.phone;
    case 2:
      return form.city && form.street && form.building;
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

const generateProposalNow = async () => {
  if (!isProposalFormValid.value) return;

  const proposalData: ProposalData = {
    companyName: form.companyName,
    companyInn: form.inn,
    contactPerson: form.contactPerson,
    phone: form.phone,
    email: form.email,
    products: items.value.map(item => ({
      product: item.product,
      quantity: item.quantity,
    })),
    validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Valid for 14 days
    notes: form.notes,
  };

  try {
    const result = await generateProposalPDF(proposalData);
    proposalNumber.value = result.proposalNumber;
    proposalUrl.value = result.pdfUrl;
    proposalGenerated.value = true;

    // Open in new window
    window.open(result.pdfUrl, '_blank');
  } catch (error) {
    console.error('Error generating proposal:', error);
    alert('Ошибка при формировании КП');
  }
};

const printGeneratedProposal = () => {
  if (proposalUrl.value) {
    printProposal(proposalUrl.value);
  }
};

const submitOrder = async () => {
  if (!isCurrentStepValid.value) return;

  isSubmitting.value = true;

  try {
    // Generate proposal if requested
    if (generateProposalOnOrder.value && !proposalGenerated.value) {
      await generateProposalNow();
    }

    // TODO: API call to create order
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order object
    const orderData = {
      ...form,
      items: items.value,
      total: total.value + deliveryCost.value,
      deliveryCost: deliveryCost.value,
      proposalNumber: proposalNumber.value || null,
    };

    console.log('Order submitted:', orderData);

    // Clear cart
    await cartStore.clearCart();

    // Redirect to success page
    alert('Заказ успешно оформлен! Номер заказа: #' + Date.now() + (proposalNumber.value ? `\nКП: ${proposalNumber.value}` : ''));
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

// Container is defined globally in main.scss

// Commercial Proposal Section
.proposal-section {
  margin-top: $spacing-xl;
  padding: $spacing-lg;
  background: linear-gradient(135deg, rgba($primary, 0.05) 0%, rgba($warning, 0.05) 100%);
  border: 2px solid rgba($primary, 0.2);
  border-radius: $radius-xl;

  &__header {
    margin-bottom: $spacing-lg;

    h3 {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $gray-900;
      margin: 0 0 $spacing-xs;
    }

    p {
      font-size: $font-size-sm;
      color: $gray-600;
      margin: 0;
    }
  }

  &__options {
    margin-bottom: $spacing-lg;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }
}

.proposal-checkbox {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__mark {
    width: 20px;
    height: 20px;
    border: 2px solid $gray-300;
    border-radius: $radius-sm;
    background: $white;
    transition: all $transition-base;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid $white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
    }
  }

  input:checked + &__mark {
    background: $primary;
    border-color: $primary;

    &::after {
      opacity: 1;
    }
  }

  &__text {
    font-size: $font-size-base;
    color: $gray-700;
    font-weight: $font-weight-medium;
  }
}

.proposal-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-lg;
  background: $white;
  border: 2px solid $primary;
  border-radius: $radius-lg;
  color: $primary;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-base;

  &:hover:not(:disabled) {
    background: $primary;
    color: $white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba($primary, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.proposal-success {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  background: $success-light;
  border-radius: $radius-lg;
  color: $success;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;

  svg {
    flex-shrink: 0;
  }
}

.proposal-action-btn {
  margin-left: auto;
  padding: $spacing-xs $spacing-sm;
  background: $success;
  border: none;
  border-radius: $radius-md;
  color: $white;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    background: darken($success, 10%);
  }
}
</style>
