<template>
  <div class="checkout">
    <div class="container">
      <!-- Пустая корзина -->
      <div v-if="cartStore.isEmpty && !isLoading" class="checkout__empty">
        <div class="empty-icon">🛒</div>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары для оформления заказа</p>
        <NuxtLink to="/products" class="btn btn--primary">
          Перейти в каталог
        </NuxtLink>
      </div>

      <!-- Контент оформления -->
      <div v-else-if="!isLoading" class="checkout__content">
        <h1 class="checkout__title">Оформление заказа</h1>

        <div class="checkout__grid">
          <!-- Левая колонка - формы -->
          <div class="checkout__main">
            <!-- Шаг 1: Контактные данные -->
            <div class="checkout__section">
              <div class="section-header">
                <span class="section-number">1</span>
                <h2>Контактные данные</h2>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Имя <span class="required">*</span></label>
                  <input
                    v-model="form.firstName"
                    type="text"
                    placeholder="Введите имя"
                    :class="{ 'has-error': errors.firstName }"
                  />
                  <span v-if="errors.firstName" class="error-text">{{ errors.firstName }}</span>
                </div>
                <div class="form-group">
                  <label>Фамилия <span class="required">*</span></label>
                  <input
                    v-model="form.lastName"
                    type="text"
                    placeholder="Введите фамилию"
                    :class="{ 'has-error': errors.lastName }"
                  />
                  <span v-if="errors.lastName" class="error-text">{{ errors.lastName }}</span>
                </div>
                <div class="form-group">
                  <label>Телефон <span class="required">*</span></label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    :class="{ 'has-error': errors.phone }"
                  />
                  <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
                </div>
                <div class="form-group">
                  <label>Email <span class="required">*</span></label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="email@example.com"
                    :class="{ 'has-error': errors.email }"
                  />
                  <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
                </div>
              </div>
            </div>

            <!-- Шаг 2: Способ доставки -->
            <div class="checkout__section">
              <div class="section-header">
                <span class="section-number">2</span>
                <h2>Способ доставки</h2>
              </div>

              <div class="delivery-options">
                <!-- Самовывоз -->
                <label class="delivery-option" :class="{ active: form.deliveryMethod === 'pickup' }">
                  <input v-model="form.deliveryMethod" type="radio" value="pickup" />
                  <div class="option-content">
                    <div class="option-icon">🏪</div>
                    <div class="option-info">
                      <strong>Самовывоз</strong>
                      <span class="option-desc">г. Красноярск, ул. Складская, 15</span>
                      <span class="option-price free">Бесплатно</span>
                    </div>
                  </div>
                </label>

                <!-- Курьерская доставка -->
                <label class="delivery-option" :class="{ active: form.deliveryMethod === 'courier' }">
                  <input v-model="form.deliveryMethod" type="radio" value="courier" />
                  <div class="option-content">
                    <div class="option-icon">🚗</div>
                    <div class="option-info">
                      <strong>До объекта</strong>
                      <span class="option-desc">Доставка в пределах г. Красноярска, 1 день</span>
                      <span class="option-price">от 1 000 ₽</span>
                    </div>
                  </div>
                </label>

                <!-- Транспортная компания -->
                <label class="delivery-option" :class="{ active: form.deliveryMethod === 'transport' }">
                  <input v-model="form.deliveryMethod" type="radio" value="transport" />
                  <div class="option-content">
                    <div class="option-icon">🚚</div>
                    <div class="option-info">
                      <strong>Транспортная компания</strong>
                      <span class="option-desc">Деловые Линии - доставка по всей России</span>
                      <span v-if="deliveryPrice > 0" class="option-price">{{ formatPrice(deliveryPrice) }}</span>
                      <span v-else class="option-price calc">Рассчитать ниже</span>
                    </div>
                  </div>
                </label>
              </div>

              <!-- Калькулятор доставки для ТК -->
              <div v-if="form.deliveryMethod === 'transport'" class="delivery-calculator">
                <h3>Расчёт стоимости доставки</h3>

                <!-- Поиск города -->
                <div class="city-search">
                  <label>Город доставки <span class="required">*</span></label>
                  <div class="city-input-wrapper">
                    <input
                      v-model="citySearch"
                      type="text"
                      placeholder="Начните вводить название города..."
                      :class="{ 'has-error': errors.city }"
                      @input="searchCities"
                      @focus="showCitySuggestions = true"
                    />
                    <div v-if="isSearchingCities" class="search-spinner"></div>
                  </div>
                  <span v-if="errors.city" class="error-text">{{ errors.city }}</span>

                  <!-- Подсказки городов -->
                  <div v-if="showCitySuggestions && citySuggestions.length > 0" class="city-suggestions">
                    <div
                      v-for="city in citySuggestions"
                      :key="city.code"
                      class="city-suggestion"
                      @click="selectCity(city)"
                    >
                      {{ city.fullName || city.name }}
                    </div>
                  </div>
                </div>

                <!-- Выбранный город и кнопка расчёта -->
                <div v-if="selectedCity" class="selected-city">
                  <span>📍 {{ selectedCity.name }}</span>
                  <button type="button" class="btn-clear" @click="clearCity">✕</button>
                </div>

                <!-- Кнопка расчёта -->
                <button
                  v-if="selectedCity && !deliveryResult"
                  type="button"
                  class="btn btn--secondary btn--full"
                  :disabled="isCalculating"
                  @click="calculateDelivery"
                >
                  {{ isCalculating ? 'Рассчитываем...' : 'Рассчитать стоимость' }}
                </button>

                <!-- Результат расчёта -->
                <div v-if="deliveryResult" class="delivery-result">
                  <div class="result-header">
                    <strong>Стоимость доставки</strong>
                    <span v-if="deliveryResult.provider === 'estimate'" class="badge badge--warning">Примерная</span>
                    <span v-else class="badge badge--success">Деловые Линии</span>
                  </div>
                  <div class="result-price">{{ formatPrice(deliveryResult.price) }}</div>
                  <div class="result-details">
                    <span>⏱ Срок: {{ deliveryResult.minDeliveryTime || deliveryResult.deliveryTime }}-{{ deliveryResult.maxDeliveryTime || deliveryResult.deliveryTime + 2 }} дней</span>
                    <span v-if="deliveryResult.details?.weight">📦 Вес: {{ deliveryResult.details.weight }} кг</span>
                  </div>
                  <p v-if="deliveryResult.details?.note" class="result-note">
                    {{ deliveryResult.details.note }}
                  </p>
                  <button type="button" class="btn-recalc" @click="clearDeliveryResult">
                    Пересчитать
                  </button>
                </div>

                <!-- Ошибка расчёта -->
                <div v-if="deliveryError" class="delivery-error">
                  {{ deliveryError }}
                </div>
              </div>
            </div>

            <!-- Шаг 3: Способ оплаты -->
            <div class="checkout__section">
              <div class="section-header">
                <span class="section-number">3</span>
                <h2>Способ оплаты</h2>
              </div>

              <div class="payment-options">
                <label class="payment-option" :class="{ active: form.paymentMethod === 'bank_transfer' }">
                  <input v-model="form.paymentMethod" type="radio" value="bank_transfer" />
                  <div class="option-content">
                    <div class="option-icon">🏦</div>
                    <div class="option-info">
                      <strong>Безналичный расчёт</strong>
                      <span class="option-desc">Счёт на оплату для юр. лиц и ИП</span>
                    </div>
                  </div>
                </label>

                <label class="payment-option" :class="{ active: form.paymentMethod === 'card' }">
                  <input v-model="form.paymentMethod" type="radio" value="card" />
                  <div class="option-content">
                    <div class="option-icon">💳</div>
                    <div class="option-info">
                      <strong>Картой онлайн</strong>
                      <span class="option-desc">МИР</span>
                    </div>
                  </div>
                </label>

                <label class="payment-option" :class="{ active: form.paymentMethod === 'cash' }">
                  <input v-model="form.paymentMethod" type="radio" value="cash" />
                  <div class="option-content">
                    <div class="option-icon">💵</div>
                    <div class="option-info">
                      <strong>Наличными при получении</strong>
                      <span class="option-desc">Оплата при самовывозе</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Шаг 4: Комментарий -->
            <div class="checkout__section">
              <div class="section-header">
                <span class="section-number">4</span>
                <h2>Комментарий к заказу</h2>
              </div>
              <textarea
                v-model="form.comment"
                placeholder="Дополнительная информация, пожелания..."
                rows="3"
              ></textarea>
            </div>
          </div>

          <!-- Правая колонка - итого -->
          <div class="checkout__sidebar">
            <div class="order-summary">
              <h3>Ваш заказ</h3>

              <!-- Товары -->
              <div class="summary-items">
                <div v-for="item in cartStore.items" :key="item.productId" class="summary-item">
                  <img
                    :src="getProductImage(item.product)"
                    :alt="item.product.name"
                    class="item-image"
                  />
                  <div class="item-info">
                    <div class="item-name">{{ item.product.name }}</div>
                    <div class="item-qty">{{ item.quantity }} шт.</div>
                  </div>
                  <div class="item-price">{{ formatPrice(item.product.price * item.quantity) }}</div>
                </div>
              </div>

              <!-- Итоги -->
              <div class="summary-totals">
                <div class="total-row">
                  <span>Товары ({{ cartStore.totalItems }})</span>
                  <span>{{ formatPrice(cartStore.subtotal) }}</span>
                </div>
                <div class="total-row">
                  <span>Доставка</span>
                  <span v-if="form.deliveryMethod === 'pickup'" class="free">Бесплатно</span>
                  <span v-else-if="deliveryPrice > 0">{{ formatPrice(deliveryPrice) }}</span>
                  <span v-else class="pending">Не рассчитана</span>
                </div>
                <div class="total-row total-row--final">
                  <span>Итого</span>
                  <span class="total-price">{{ formatPrice(totalPrice) }}</span>
                </div>
              </div>

              <!-- Согласие -->
              <label class="agreement">
                <input v-model="form.agreeToTerms" type="checkbox" />
                <span>
                  Я согласен с
                  <NuxtLink to="/privacy" target="_blank">политикой конфиденциальности</NuxtLink>
                </span>
              </label>
              <span v-if="errors.agreeToTerms" class="error-text">{{ errors.agreeToTerms }}</span>

              <!-- Кнопка оформления -->
              <button
                type="button"
                class="btn btn--primary btn--full btn--lg"
                :disabled="!canSubmit || isSubmitting"
                @click="submitOrder"
              >
                <span v-if="isSubmitting">Оформляем заказ...</span>
                <span v-else>Оформить заказ</span>
              </button>

              <!-- Безопасность -->
              <div class="security-note">
                <span>🔒</span>
                Ваши данные защищены и не передаются третьим лицам
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Загрузка -->
      <div v-if="isLoading" class="checkout__loading">
        <div class="spinner"></div>
        <p>Загрузка корзины...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const cartStore = useCartStore();
const config = useRuntimeConfig();
const apiBase = config.public.apiBaseUrl as string;

// State
const isLoading = ref(true);
const isSubmitting = ref(false);
const isCalculating = ref(false);
const isSearchingCities = ref(false);

// Form data
const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  deliveryMethod: 'pickup',
  paymentMethod: 'bank_transfer',
  comment: '',
  agreeToTerms: false,
});

const errors = ref<Record<string, string>>({});

// City search
const citySearch = ref('');
const citySuggestions = ref<Array<{ code: string; name: string; fullName?: string }>>([]);
const showCitySuggestions = ref(false);
const selectedCity = ref<{ code: string; name: string } | null>(null);

// Delivery calculation
const deliveryResult = ref<{
  price: number;
  deliveryTime: number;
  minDeliveryTime?: number;
  maxDeliveryTime?: number;
  provider?: string;
  details?: { note?: string; weight?: number; volume?: number };
} | null>(null);
const deliveryError = ref('');

// Computed
const deliveryPrice = computed(() => {
  if (form.value.deliveryMethod === 'pickup') return 0;
  return deliveryResult.value?.price || 0;
});

const totalPrice = computed(() => {
  return cartStore.subtotal + deliveryPrice.value;
});

const canSubmit = computed(() => {
  const hasContact = form.value.firstName && form.value.lastName && form.value.phone && form.value.email;
  const hasDelivery = form.value.deliveryMethod === 'pickup' || deliveryResult.value;
  const hasPayment = form.value.paymentMethod;
  const hasAgreement = form.value.agreeToTerms;

  return hasContact && hasDelivery && hasPayment && hasAgreement && !cartStore.isEmpty;
});

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const getProductImage = (product: any) => {
  const image = product.images?.[0];
  if (!image?.url) return '/images/placeholder.jpg';
  if (image.url.startsWith('http')) return image.url;
  return `${apiBase.replace('/api/v1', '')}${image.url}`;
};

// City search with debounce
let searchTimeout: ReturnType<typeof setTimeout>;
const searchCities = () => {
  clearTimeout(searchTimeout);

  if (citySearch.value.length < 2) {
    citySuggestions.value = [];
    showCitySuggestions.value = false;
    return;
  }

  searchTimeout = setTimeout(async () => {
    isSearchingCities.value = true;
    try {
      const response = await fetch(
        `${apiBase}/delivery/cities/search?query=${encodeURIComponent(citySearch.value)}`
      );
      const data = await response.json();

      if (data.success) {
        citySuggestions.value = data.data;
        showCitySuggestions.value = true;
      }
    } catch (err) {
      console.error('Error searching cities:', err);
    } finally {
      isSearchingCities.value = false;
    }
  }, 300);
};

const selectCity = (city: { code: string; name: string; fullName?: string }) => {
  selectedCity.value = city;
  citySearch.value = city.name;
  showCitySuggestions.value = false;
  citySuggestions.value = [];
  deliveryResult.value = null;
  deliveryError.value = '';
  errors.value.city = '';
};

const clearCity = () => {
  selectedCity.value = null;
  citySearch.value = '';
  deliveryResult.value = null;
  deliveryError.value = '';
};

const clearDeliveryResult = () => {
  deliveryResult.value = null;
  deliveryError.value = '';
};

const calculateDelivery = async () => {
  if (!selectedCity.value) {
    errors.value.city = 'Выберите город доставки';
    return;
  }

  isCalculating.value = true;
  deliveryError.value = '';

  try {
    // Prepare cargo data
    const cargo = cartStore.items.map((item) => {
      const dims = item.product.dimensions || {};
      return {
        length: dims.length || 50,
        width: dims.width || 50,
        height: dims.height || 50,
        weight: dims.weight || 10,
        quantity: item.quantity,
      };
    });

    const response = await fetch(`${apiBase}/delivery/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arrivalCity: selectedCity.value.code,
        cargo,
      }),
    });

    const data = await response.json();

    if (data.success) {
      deliveryResult.value = data.data;
    } else {
      deliveryError.value = data.error || 'Не удалось рассчитать доставку';
    }
  } catch (err: any) {
    deliveryError.value = err.message || 'Ошибка расчёта доставки';
  } finally {
    isCalculating.value = false;
  }
};

// Validation
const validateForm = (): boolean => {
  errors.value = {};
  let isValid = true;

  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'Введите имя';
    isValid = false;
  }

  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'Введите фамилию';
    isValid = false;
  }

  if (!form.value.phone.trim()) {
    errors.value.phone = 'Введите телефон';
    isValid = false;
  } else if (!/^[\d\s+\-()]{10,}$/.test(form.value.phone)) {
    errors.value.phone = 'Некорректный номер телефона';
    isValid = false;
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'Введите email';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Некорректный email';
    isValid = false;
  }

  if (form.value.deliveryMethod === 'transport' && !deliveryResult.value) {
    errors.value.city = 'Рассчитайте стоимость доставки';
    isValid = false;
  }

  if (!form.value.agreeToTerms) {
    errors.value.agreeToTerms = 'Необходимо согласие';
    isValid = false;
  }

  return isValid;
};

// Submit order
const submitOrder = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    const { apiFetch } = useApi();

    const orderData = {
      shippingAddress: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        phone: form.value.phone,
        email: form.value.email,
        city: form.value.deliveryMethod === 'transport' ? selectedCity.value?.name : 'Красноярск',
        street: '',
        house: '',
        apartment: '',
        postalCode: '',
        country: 'Россия',
      },
      billingAddress: {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        phone: form.value.phone,
        email: form.value.email,
        city: form.value.deliveryMethod === 'transport' ? selectedCity.value?.name : 'Красноярск',
        street: '',
        house: '',
        apartment: '',
        postalCode: '',
        country: 'Россия',
      },
      paymentMethod: form.value.paymentMethod,
      deliveryMethod: form.value.deliveryMethod,
      deliveryPrice: deliveryPrice.value,
      notes: form.value.comment || '',
    };

    const response = await apiFetch<{ success: boolean; data: any }>('/orders', {
      method: 'POST',
      body: orderData,
    });

    if (response.success && response.data) {
      const orderId = response.data._id || response.data.orderNumber;

      // Clear cart
      await cartStore.clearCart();

      // Redirect to success
      router.push(`/checkout/success?orderId=${orderId}`);
    } else {
      throw new Error('Не удалось создать заказ');
    }
  } catch (err: any) {
    alert(err.message || 'Ошибка при оформлении заказа. Попробуйте ещё раз.');
  } finally {
    isSubmitting.value = false;
  }
};

// Close city suggestions on click outside
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.city-search')) {
    showCitySuggestions.value = false;
  }
};

// Watch delivery method change
watch(() => form.value.deliveryMethod, () => {
  deliveryResult.value = null;
  deliveryError.value = '';
});

// Lifecycle
onMounted(async () => {
  document.addEventListener('click', handleClickOutside);

  try {
    await cartStore.fetchCart();

    if (cartStore.isEmpty) {
      router.push('/products');
    }
  } catch (err) {
    console.error('Error loading cart:', err);
  } finally {
    isLoading.value = false;
  }
});

// SEO
useHead({
  title: 'Оформление заказа - КМО24',
  meta: [
    { name: 'description', content: 'Оформите заказ быстро и удобно' },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<style scoped lang="scss">
.checkout {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
  background: #f5f5f5;

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 2rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 2rem;
    align-items: start;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__section {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    background: white;
    border-radius: 12px;
    padding: 3rem;
    text-align: center;

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
      margin-bottom: 1.5rem;
    }
  }

  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 1rem;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }
}

.section-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #f59e0b;
  color: white;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  input, textarea {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.9375rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    &.has-error {
      border-color: #ef4444;
    }
  }
}

.required {
  color: #ef4444;
}

.error-text {
  font-size: 0.75rem;
  color: #ef4444;
}

// Delivery & Payment Options
.delivery-options,
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.delivery-option,
.payment-option {
  display: block;
  cursor: pointer;

  input {
    display: none;
  }

  .option-content {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    transition: all 0.2s;
  }

  &:hover .option-content {
    border-color: #f59e0b;
    background: #fffbeb;
  }

  &.active .option-content {
    border-color: #f59e0b;
    background: #fffbeb;
  }

  .option-icon {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .option-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    strong {
      font-size: 0.9375rem;
      color: #1f2937;
    }
  }

  .option-desc {
    font-size: 0.8125rem;
    color: #6b7280;
  }

  .option-price {
    font-size: 0.875rem;
    font-weight: 600;
    color: #059669;

    &.free {
      color: #059669;
    }

    &.calc {
      color: #f59e0b;
    }
  }
}

// Delivery Calculator
.delivery-calculator {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #374151;
  }
}

.city-search {
  position: relative;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.375rem;
  }
}

.city-input-wrapper {
  position: relative;

  input {
    width: 100%;
    padding: 0.75rem;
    padding-right: 2.5rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.9375rem;

    &:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }
  }
}

.search-spinner {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  border: 2px solid #e5e7eb;
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: translateY(-50%) rotate(360deg); }
}

.city-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
}

.city-suggestion {
  padding: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fffbeb;
  }
}

.selected-city {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding: 0.625rem 0.875rem;
  background: #dbeafe;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1e40af;
}

.btn-clear {
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  font-size: 1.125rem;
  opacity: 0.7;
  padding: 0;

  &:hover {
    opacity: 1;
  }
}

.btn-recalc {
  background: none;
  border: none;
  color: #f59e0b;
  cursor: pointer;
  font-size: 0.8125rem;
  text-decoration: underline;
  padding: 0;
  margin-top: 0.5rem;
}

.delivery-result {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #d1fae5;

  .result-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    strong {
      font-size: 0.875rem;
      color: #374151;
    }
  }

  .result-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #059669;
    margin-bottom: 0.5rem;
  }

  .result-details {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.8125rem;
    color: #6b7280;
  }

  .result-note {
    margin-top: 0.75rem;
    padding: 0.625rem;
    background: #fef3c7;
    border-radius: 6px;
    font-size: 0.8125rem;
    color: #92400e;
    line-height: 1.4;
  }
}

.delivery-error {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fee2e2;
  border-radius: 6px;
  color: #991b1b;
  font-size: 0.875rem;
}

.badge {
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;

  &--warning {
    background: #fef3c7;
    color: #92400e;
  }

  &--success {
    background: #d1fae5;
    color: #065f46;
  }
}

// Sidebar
.checkout__sidebar {
  position: sticky;
  top: 1.5rem;

  @media (max-width: 1024px) {
    position: static;
  }
}

.order-summary {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
  }
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 250px;
  overflow-y: auto;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;

  .item-image {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    object-fit: cover;
    background: #f3f4f6;
  }

  .item-info {
    flex: 1;
    min-width: 0;
  }

  .item-name {
    font-size: 0.8125rem;
    font-weight: 500;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .item-qty {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .item-price {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1f2937;
    flex-shrink: 0;
  }
}

.summary-totals {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;

  .free {
    color: #059669;
    font-weight: 500;
  }

  .pending {
    color: #f59e0b;
    font-style: italic;
  }

  &--final {
    padding-top: 0.75rem;
    border-top: 2px solid #e5e7eb;
    margin-top: 0.5rem;
    font-size: 1rem;
    color: #1f2937;
    font-weight: 600;

    .total-price {
      font-size: 1.25rem;
      color: #f59e0b;
    }
  }
}

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: #6b7280;
  cursor: pointer;

  input {
    margin-top: 2px;
    accent-color: #f59e0b;
  }

  a {
    color: #f59e0b;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.security-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 0.75rem;
  color: #6b7280;

  span {
    font-size: 1rem;
  }
}

// Buttons
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;

  &--primary {
    background: #f59e0b;
    color: white;

    &:hover:not(:disabled) {
      background: #d97706;
    }
  }

  &--secondary {
    background: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background: #2563eb;
    }
  }

  &--full {
    width: 100%;
  }

  &--lg {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Utils
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
