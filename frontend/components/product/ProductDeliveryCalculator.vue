<template>
  <div class="delivery-calc">
    <div class="delivery-calc__header">
      <svg class="delivery-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
      <span>Рассчитать доставку</span>
    </div>

    <div class="delivery-calc__body">
      <!-- Поиск города -->
      <div class="city-search">
        <div class="city-input-wrapper">
          <input
            v-model="cityInput"
            type="text"
            placeholder="Введите ваш город..."
            class="city-input"
            @input="searchCity"
            @focus="showSuggestions = true"
          />
          <div v-if="isSearching" class="input-spinner">
            <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"/>
              <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor"/>
            </svg>
          </div>
          <button
            v-if="selectedCity && !isCalculating"
            class="calc-btn"
            @click="calculateDelivery"
            title="Рассчитать"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>
        </div>

        <!-- Suggestions dropdown -->
        <ul v-if="showSuggestions && citySuggestions.length" class="city-suggestions">
          <li
            v-for="city in citySuggestions"
            :key="city.code"
            class="suggestion-item"
            @click="selectCity(city)"
          >
            <span class="city-name">{{ city.name }}</span>
            <span v-if="city.region" class="city-region">{{ city.region }}</span>
          </li>
        </ul>
      </div>

      <!-- Расчёт в процессе -->
      <div v-if="isCalculating" class="delivery-loading">
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25"/>
          <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor"/>
        </svg>
        <span>Расчёт стоимости...</span>
      </div>

      <!-- Результат расчёта -->
      <div v-else-if="deliveryResult" class="delivery-result">
        <div class="result-row">
          <div class="result-city">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>{{ selectedCity?.name }}</span>
          </div>
          <div class="result-price">
            {{ formatPrice(deliveryResult.price) }}
          </div>
        </div>
        <div class="result-details">
          <span v-if="deliveryResult.minDeliveryTime && deliveryResult.maxDeliveryTime" class="result-time">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
            {{ deliveryResult.minDeliveryTime }}-{{ deliveryResult.maxDeliveryTime }} дней
          </span>
          <button class="reset-btn" @click="resetResult" title="Изменить город">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="delivery-error">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ error }}</span>
        <button class="retry-btn" @click="resetResult">Попробовать снова</button>
      </div>

      <!-- Габариты товара (компактно) -->
      <div v-if="!deliveryResult && !error && hasProductDimensions" class="product-dims">
        <span v-if="product.dimensions?.weight">{{ product.dimensions.weight }} кг</span>
        <span v-if="hasDimensions" class="dims-sep">|</span>
        <span v-if="hasDimensions">
          {{ product.dimensions?.length }}x{{ product.dimensions?.width }}x{{ product.dimensions?.height }} см
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface ProductDimensions {
  length?: number
  width?: number
  height?: number
  weight?: number
}

interface Product {
  _id: string
  name: string
  price: number
  dimensions?: ProductDimensions
}

interface City {
  code: string
  name: string
  region?: string
  fullName?: string
}

interface DeliveryResult {
  price: number
  minDeliveryTime?: number
  maxDeliveryTime?: number
  currency?: string
  provider?: string
}

interface Props {
  product: Product
}

const props = defineProps<Props>()

const config = useRuntimeConfig()
const apiBase = config.public.apiBaseUrl

// State
const cityInput = ref('')
const selectedCity = ref<City | null>(null)
const citySuggestions = ref<City[]>([])
const showSuggestions = ref(false)
const isSearching = ref(false)
const isCalculating = ref(false)
const deliveryResult = ref<DeliveryResult | null>(null)
const error = ref('')

// Debounce timer
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Computed
const hasProductDimensions = computed(() => {
  return props.product.dimensions && (
    props.product.dimensions.weight ||
    props.product.dimensions.length ||
    props.product.dimensions.width ||
    props.product.dimensions.height
  )
})

const hasDimensions = computed(() => {
  return props.product.dimensions?.length &&
         props.product.dimensions?.width &&
         props.product.dimensions?.height
})

// Methods
const searchCity = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  // Reset selected city when typing
  if (selectedCity.value) {
    selectedCity.value = null
    deliveryResult.value = null
    error.value = ''
  }

  if (cityInput.value.length < 2) {
    citySuggestions.value = []
    showSuggestions.value = false
    return
  }

  searchTimeout = setTimeout(async () => {
    isSearching.value = true
    showSuggestions.value = true

    try {
      const response = await fetch(`${apiBase}/delivery/cities/search?query=${encodeURIComponent(cityInput.value)}`)
      const data = await response.json()

      if (data.success && data.data) {
        citySuggestions.value = data.data
      } else {
        citySuggestions.value = []
      }
    } catch (err) {
      console.error('City search error:', err)
      citySuggestions.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
}

const selectCity = (city: City) => {
  selectedCity.value = city
  cityInput.value = city.name
  citySuggestions.value = []
  showSuggestions.value = false
  error.value = ''

  // Автоматически запускаем расчёт при выборе города
  calculateDelivery()
}

const calculateDelivery = async () => {
  if (!selectedCity.value) return

  isCalculating.value = true
  error.value = ''
  deliveryResult.value = null

  try {
    // Подготовка данных о товаре
    const cargoItem: any = {
      weight: props.product.dimensions?.weight || 10, // Default 10 kg
      quantity: 1
    }

    if (props.product.dimensions) {
      cargoItem.length = props.product.dimensions.length || 50
      cargoItem.width = props.product.dimensions.width || 50
      cargoItem.height = props.product.dimensions.height || 50
    }

    const response = await fetch(`${apiBase}/delivery/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        arrivalCity: selectedCity.value.code,
        cargo: [cargoItem]
      })
    })

    const data = await response.json()

    if (data.success && data.data) {
      deliveryResult.value = data.data
    } else {
      error.value = data.error || 'Не удалось рассчитать доставку'
    }
  } catch (err) {
    console.error('Delivery calculation error:', err)
    error.value = 'Ошибка при расчёте доставки'
  } finally {
    isCalculating.value = false
  }
}

const resetResult = () => {
  deliveryResult.value = null
  error.value = ''
  cityInput.value = ''
  selectedCity.value = null
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.city-search')) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.delivery-calc {
  background: $gray-50;
  border: 1px solid $gray-200;
  border-radius: 8px;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: $white;
    border-bottom: 1px solid $gray-200;
    font-size: 13px;
    font-weight: 600;
    color: $gray-700;

    .delivery-icon {
      color: $primary-500;
    }
  }

  &__body {
    padding: 12px;
  }
}

// City search
.city-search {
  position: relative;
}

.city-input-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
  background: $white;
  border: 1px solid $gray-300;
  border-radius: 6px;
  padding: 0 8px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: $primary-500;
    box-shadow: 0 0 0 2px rgba($primary-500, 0.1);
  }
}

.city-input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 0;
  font-size: 13px;
  color: $gray-900;
  outline: none;

  &::placeholder {
    color: $gray-400;
  }
}

.input-spinner {
  color: $gray-400;
}

.calc-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: $primary-500;
  border: none;
  border-radius: 4px;
  color: $white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: $primary-600;
  }
}

// Suggestions dropdown
.city-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: $white;
  border: 1px solid $gray-200;
  border-radius: 6px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 20;
  list-style: none;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: $primary-50;
  }

  .city-name {
    font-size: 13px;
    font-weight: 500;
    color: $gray-900;
  }

  .city-region {
    font-size: 11px;
    color: $gray-500;
  }
}

// Loading state
.delivery-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  color: $gray-600;
  font-size: 12px;
}

// Result
.delivery-result {
  background: $white;
  border: 1px solid $success-200;
  border-radius: 6px;
  padding: 10px 12px;
  margin-top: 8px;

  .result-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .result-city {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: $gray-600;

    svg {
      color: $gray-400;
    }
  }

  .result-price {
    font-size: 16px;
    font-weight: 700;
    color: $success-600;
  }

  .result-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .result-time {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: $gray-500;

    svg {
      color: $gray-400;
    }
  }
}

.reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: $gray-100;
  border: none;
  border-radius: 4px;
  color: $gray-500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: $gray-200;
    color: $gray-700;
  }
}

// Error
.delivery-error {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px;
  background: rgba($danger-500, 0.05);
  border: 1px solid rgba($danger-500, 0.2);
  border-radius: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: $danger-600;

  svg {
    flex-shrink: 0;
  }

  span {
    flex: 1;
  }
}

.retry-btn {
  padding: 4px 8px;
  background: $white;
  border: 1px solid $danger-300;
  border-radius: 4px;
  font-size: 11px;
  color: $danger-600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: $danger-50;
  }
}

// Product dimensions
.product-dims {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed $gray-200;
  font-size: 11px;
  color: $gray-500;

  .dims-sep {
    color: $gray-300;
  }
}

// Animations
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
