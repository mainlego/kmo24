<template>
  <div class="delivery-calculator">
    <h3 class="calculator-title">Расчет стоимости доставки</h3>

    <!-- City Selection -->
    <div class="calculator-field">
      <label class="calculator-label">Город доставки</label>
      <input
        v-model="searchQuery"
        type="text"
        class="calculator-input"
        placeholder="Начните вводить название города..."
        @input="searchCities"
      />

      <!-- City Suggestions -->
      <div v-if="showSuggestions && cities.length > 0" class="city-suggestions">
        <div
          v-for="city in cities"
          :key="city.code"
          class="city-suggestion"
          @click="selectCity(city)"
        >
          {{ city.name }}
        </div>
      </div>

      <!-- Selected City -->
      <div v-if="selectedCity" class="selected-city">
        Выбран: {{ selectedCity.name }}
        <button class="clear-btn" @click="clearCity">✕</button>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      v-if="selectedCity && cartItems.length > 0"
      class="calculate-btn"
      :disabled="calculating"
      @click="calculateDelivery"
    >
      {{ calculating ? 'Рассчитываем...' : 'Рассчитать стоимость' }}
    </button>

    <!-- Results -->
    <div v-if="deliveryResult" class="delivery-result">
      <div class="result-header">
        <h4>Результат расчета</h4>
      </div>

      <div class="result-details">
        <div class="result-row">
          <span>Стоимость доставки:</span>
          <strong>{{ formatPrice(deliveryResult.price) }}</strong>
        </div>
        <div class="result-row">
          <span>Срок доставки:</span>
          <strong>{{ deliveryResult.deliveryTime }} дн.</strong>
        </div>
        <div v-if="deliveryResult.distance" class="result-row">
          <span>Расстояние:</span>
          <strong>{{ deliveryResult.distance }} км</strong>
        </div>
      </div>

      <button class="apply-btn" @click="applyDelivery">
        Выбрать этот вариант
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface City {
  code: string;
  name: string;
}

interface DeliveryResult {
  price: number;
  deliveryTime: number;
  distance?: number;
}

interface CartItem {
  product: {
    _id: string;
    name: string;
    dimensions?: {
      length?: number;
      width?: number;
      height?: number;
      weight?: number;
    };
  };
  quantity: number;
}

const props = defineProps<{
  cartItems: CartItem[];
}>();

const emit = defineEmits<{
  (e: 'delivery-calculated', result: DeliveryResult & { city: City }): void;
}>();

const config = useRuntimeConfig();
const apiBase = config.public.apiBaseUrl;

// State
const searchQuery = ref('');
const cities = ref<City[]>([]);
const showSuggestions = ref(false);
const selectedCity = ref<City | null>(null);
const calculating = ref(false);
const deliveryResult = ref<DeliveryResult | null>(null);
const error = ref('');

// Search cities with debounce
let searchTimeout: ReturnType<typeof setTimeout>;
const searchCities = () => {
  if (searchQuery.value.length < 2) {
    cities.value = [];
    showSuggestions.value = false;
    return;
  }

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `${apiBase}/delivery/cities/search?query=${encodeURIComponent(searchQuery.value)}`
      );
      const data = await response.json();

      if (data.success) {
        cities.value = data.data;
        showSuggestions.value = true;
      }
    } catch (err: any) {
      console.error('Error searching cities:', err);
      error.value = 'Ошибка поиска городов';
    }
  }, 300);
};

// Select city
const selectCity = (city: City) => {
  selectedCity.value = city;
  searchQuery.value = city.name;
  showSuggestions.value = false;
  cities.value = [];
  error.value = '';
  deliveryResult.value = null;
};

// Clear city selection
const clearCity = () => {
  selectedCity.value = null;
  searchQuery.value = '';
  deliveryResult.value = null;
  error.value = '';
};

// Calculate delivery
const calculateDelivery = async () => {
  if (!selectedCity.value) {
    error.value = 'Выберите город доставки';
    return;
  }

  calculating.value = true;
  error.value = '';

  try {
    // Prepare cargo data from cart items
    const cargo = props.cartItems.map(item => {
      const dimensions = item.product.dimensions || {};
      return {
        length: dimensions.length || 50, // default values if not set
        width: dimensions.width || 50,
        height: dimensions.height || 50,
        weight: dimensions.weight || 10,
        quantity: item.quantity,
      };
    });

    const response = await fetch(`${apiBase}/delivery/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        arrivalCity: selectedCity.value.code,
        cargo,
      }),
    });
    const data = await response.json();

    if (data.success) {
      deliveryResult.value = data.data;
    } else {
      error.value = 'Не удалось рассчитать доставку';
    }
  } catch (err: any) {
    console.error('Error calculating delivery:', err);
    error.value = err.message || 'Ошибка расчета доставки';
  } finally {
    calculating.value = false;
  }
};

// Apply delivery
const applyDelivery = () => {
  if (deliveryResult.value && selectedCity.value) {
    emit('delivery-calculated', {
      ...deliveryResult.value,
      city: selectedCity.value,
    });
  }
};

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};

// Close suggestions on click outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.delivery-calculator')) {
      showSuggestions.value = false;
    }
  });
});
</script>

<style scoped lang="scss">
.delivery-calculator {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.calculator-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.calculator-field {
  margin-bottom: 1rem;
  position: relative;
}

.calculator-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.calculator-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.city-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-top: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.city-suggestion {
  padding: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.15s;

  &:hover {
    background: #f3f4f6;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
  }
}

.selected-city {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #dbeafe;
  border-radius: 6px;
  font-size: 0.875rem;
  color: #1e40af;
}

.clear-btn {
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0 0.25rem;
  opacity: 0.6;
  transition: opacity 0.15s;

  &:hover {
    opacity: 1;
  }
}

.calculate-btn {
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.delivery-result {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.result-header {
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
  }
}

.result-details {
  margin-bottom: 1rem;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.875rem;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }

  span {
    color: #6b7280;
  }

  strong {
    color: #1f2937;
  }
}

.apply-btn {
  width: 100%;
  padding: 0.75rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #059669;
  }
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 6px;
  font-size: 0.875rem;
}
</style>
