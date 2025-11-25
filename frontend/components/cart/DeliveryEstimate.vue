<template>
  <div class="delivery-estimate">
    <div class="delivery-estimate__header">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M18 18.5a1.5 1.5 0 01-1 1.415V21a1 1 0 11-2 0v-1.085a1.5 1.5 0 111-1.415zm-12 0a1.5 1.5 0 01-1 1.415V21a1 1 0 11-2 0v-1.085a1.5 1.5 0 111-1.415zM3 6a1 1 0 000 2h1v7a2 2 0 002 2h7v-2H6V8h12v2h2V8a2 2 0 00-2-2H3zm16 5h-3a1 1 0 00-1 1v3a1 1 0 001 1h5a1 1 0 001-1v-2a2 2 0 00-2-2h-1z"
          fill="currentColor"
        />
      </svg>
      <h3>Рассчитать доставку</h3>
    </div>

    <div v-if="!isCalculated" class="delivery-estimate__form">
      <div class="delivery-estimate__field">
        <label for="delivery-city">Город доставки</label>
        <div class="delivery-estimate__input-wrapper">
          <input
            id="delivery-city"
            v-model="citySearch"
            type="text"
            placeholder="Введите город..."
            autocomplete="off"
            @input="handleCitySearch"
            @focus="showSuggestions = true"
          />
          <BaseSpinner v-if="isSearchingCity" size="sm" class="delivery-estimate__spinner" />
        </div>

        <div v-if="showSuggestions && citySuggestions.length > 0" class="delivery-estimate__suggestions">
          <div
            v-for="city in citySuggestions"
            :key="city.code"
            class="delivery-estimate__suggestion"
            @click="selectCity(city)"
          >
            {{ city.name }}
          </div>
        </div>
      </div>

      <BaseButton
        variant="primary"
        size="md"
        fullWidth
        :disabled="!selectedCity || isCalculating"
        :loading="isCalculating"
        @click="calculateDelivery"
      >
        Рассчитать стоимость
      </BaseButton>
    </div>

    <div v-else class="delivery-estimate__result">
      <div class="delivery-estimate__result-item">
        <span class="delivery-estimate__result-label">Город:</span>
        <span class="delivery-estimate__result-value">{{ selectedCity?.name }}</span>
      </div>
      <div class="delivery-estimate__result-item">
        <span class="delivery-estimate__result-label">Стоимость:</span>
        <span class="delivery-estimate__result-value delivery-estimate__result-value--price">
          {{ formatPrice(deliveryResult?.price || 0) }}
        </span>
      </div>
      <div class="delivery-estimate__result-item">
        <span class="delivery-estimate__result-label">Срок:</span>
        <span class="delivery-estimate__result-value">{{ deliveryResult?.time }} дн.</span>
      </div>

      <BaseButton
        variant="outline"
        size="sm"
        fullWidth
        @click="reset"
      >
        Рассчитать заново
      </BaseButton>
    </div>

    <div v-if="error" class="delivery-estimate__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface City {
  code: string;
  name: string;
}

interface DeliveryResult {
  price: number;
  time: number;
  distance?: number;
}

interface Props {
  cartItems: any[];
}

const props = defineProps<Props>();

const { apiFetch } = useApi();

const citySearch = ref('');
const citySuggestions = ref<City[]>([]);
const selectedCity = ref<City | null>(null);
const showSuggestions = ref(false);
const isSearchingCity = ref(false);
const isCalculating = ref(false);
const isCalculated = ref(false);
const deliveryResult = ref<DeliveryResult | null>(null);
const error = ref('');

let searchTimeout: NodeJS.Timeout;

const handleCitySearch = () => {
  clearTimeout(searchTimeout);

  if (citySearch.value.length < 2) {
    citySuggestions.value = [];
    return;
  }

  isSearchingCity.value = true;

  searchTimeout = setTimeout(async () => {
    try {
      const response = await apiFetch<{ success: boolean; data: { cities: City[] } }>(
        `/delivery/cities/search?query=${encodeURIComponent(citySearch.value)}`
      );

      if (response.success && response.data?.cities) {
        citySuggestions.value = response.data.cities;
      }
    } catch (err: any) {
      console.error('City search error:', err);
    } finally {
      isSearchingCity.value = false;
    }
  }, 300);
};

const selectCity = (city: City) => {
  selectedCity.value = city;
  citySearch.value = city.name;
  showSuggestions.value = false;
  citySuggestions.value = [];
};

const calculateDelivery = async () => {
  if (!selectedCity.value) return;

  isCalculating.value = true;
  error.value = '';

  try {
    // Подготовка данных о товарах
    const cargo = props.cartItems.map((item) => {
      const dimensions = item.product.dimensions || {};
      return {
        length: dimensions.length || 50,
        width: dimensions.width || 50,
        height: dimensions.height || 50,
        weight: dimensions.weight || 10,
        quantity: item.quantity,
      };
    });

    const response = await apiFetch<{ success: boolean; data: DeliveryResult }>(
      '/delivery/calculate',
      {
        method: 'POST',
        body: {
          arrivalCity: selectedCity.value.code,
          cargo,
        },
      }
    );

    if (response.success && response.data) {
      deliveryResult.value = response.data;
      isCalculated.value = true;
    } else {
      throw new Error('Не удалось рассчитать доставку');
    }
  } catch (err: any) {
    error.value = err.message || 'Ошибка расчета доставки';
    console.error('Delivery calculation error:', err);
  } finally {
    isCalculating.value = false;
  }
};

const reset = () => {
  isCalculated.value = false;
  deliveryResult.value = null;
  selectedCity.value = null;
  citySearch.value = '';
  error.value = '';
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

// Close suggestions when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.delivery-estimate__field')) {
      showSuggestions.value = false;
    }
  });
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.delivery-estimate {
  padding: $spacing-lg;
  background: $gray-50;
  border-radius: $radius-lg;
  border: 1px solid $gray-200;

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-lg;
    color: $gray-900;

    svg {
      flex-shrink: 0;
      color: $primary-500;
    }

    h3 {
      margin: 0;
      font-size: $font-size-base;
      font-weight: $font-weight-semibold;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__field {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    label {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $gray-700;
    }
  }

  &__input-wrapper {
    position: relative;

    input {
      width: 100%;
      padding: $spacing-sm $spacing-md;
      border: 1px solid $gray-300;
      border-radius: $radius-md;
      font-size: $font-size-base;
      transition: all $transition-base $transition-ease;

      &:focus {
        outline: none;
        border-color: $primary-500;
        box-shadow: 0 0 0 3px rgba($primary-500, 0.1);
      }
    }
  }

  &__spinner {
    position: absolute;
    right: $spacing-md;
    top: 50%;
    transform: translateY(-50%);
  }

  &__suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: $spacing-xs;
    background: $white;
    border: 1px solid $gray-300;
    border-radius: $radius-md;
    box-shadow: 0 4px 12px rgba($black, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 10;
  }

  &__suggestion {
    padding: $spacing-sm $spacing-md;
    cursor: pointer;
    transition: background $transition-base $transition-ease;

    &:hover {
      background: $gray-100;
    }

    &:not(:last-child) {
      border-bottom: 1px solid $gray-200;
    }
  }

  &__result {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-sm 0;
    border-bottom: 1px solid $gray-200;

    &:last-of-type {
      border-bottom: none;
      margin-bottom: $spacing-sm;
    }
  }

  &__result-label {
    font-size: $font-size-sm;
    color: $gray-600;
  }

  &__result-value {
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $gray-900;

    &--price {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $primary-600;
    }
  }

  &__error {
    margin-top: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background: $error-light;
    border: 1px solid $error;
    border-radius: $radius-md;
    color: $error;
    font-size: $font-size-sm;
  }
}
</style>
