<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h2 class="modal-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="title-icon">
                <path d="M18 18.5a1.5 1.5 0 01-1 1.415V21a1 1 0 11-2 0v-1.085a1.5 1.5 0 111-1.415zm-12 0a1.5 1.5 0 01-1 1.415V21a1 1 0 11-2 0v-1.085a1.5 1.5 0 111-1.415zM3 6a1 1 0 000 2h1v7a2 2 0 002 2h7v-2H6V8h12v2h2V8a2 2 0 00-2-2H3zm16 5h-3a1 1 0 00-1 1v3a1 1 0 001 1h5a1 1 0 001-1v-2a2 2 0 00-2-2h-1z" fill="currentColor"/>
              </svg>
              Расчет доставки
            </h2>
            <button class="modal-close" @click="closeModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- Product Info -->
            <div v-if="product" class="product-info">
              <img
                v-if="product.images?.length"
                :src="product.images[0].url"
                :alt="product.name"
                class="product-image"
              />
              <div class="product-details">
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-specs">
                  <span v-if="product.weight">Вес: {{ product.weight }} кг</span>
                  <span v-if="product.dimensions">
                    Габариты: {{ product.dimensions.length }}x{{ product.dimensions.width }}x{{ product.dimensions.height }} см
                  </span>
                </div>
              </div>
            </div>

            <!-- Delivery Form -->
            <form @submit.prevent="calculateDelivery" class="delivery-form">
              <div class="form-group">
                <label class="form-label">Город доставки</label>
                <div class="city-input-wrapper">
                  <input
                    v-model="deliveryCity"
                    type="text"
                    placeholder="Начните вводить город..."
                    class="form-input"
                    @input="searchCity"
                  />
                  <div v-if="isSearchingCity" class="input-spinner">
                    <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
                <ul v-if="citySuggestions.length" class="city-suggestions">
                  <li
                    v-for="city in citySuggestions"
                    :key="city.code"
                    @click="selectCity(city)"
                    class="suggestion-item"
                  >
                    {{ city.name }}, {{ city.region }}
                  </li>
                </ul>
              </div>

              <div class="form-group">
                <label class="form-label">Тип доставки</label>
                <div class="delivery-types">
                  <label class="delivery-type">
                    <input
                      v-model="deliveryType"
                      type="radio"
                      value="address"
                      class="radio-input"
                    />
                    <span class="type-content">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" fill="currentColor"/>
                      </svg>
                      <span>До адреса</span>
                    </span>
                  </label>
                  <label class="delivery-type">
                    <input
                      v-model="deliveryType"
                      type="radio"
                      value="terminal"
                      class="radio-input"
                    />
                    <span class="type-content">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span>До терминала</span>
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                :disabled="!selectedCity || isCalculating"
                class="calc-button"
              >
                <span v-if="!isCalculating">Рассчитать стоимость</span>
                <span v-else class="loading-state">
                  <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                  </svg>
                  Расчет...
                </span>
              </button>
            </form>

            <!-- Results -->
            <div v-if="deliveryResult" class="delivery-result">
              <h3 class="result-title">Стоимость доставки</h3>

              <div class="result-cards">
                <div v-for="option in deliveryResult.options" :key="option.type" class="result-card">
                  <div class="result-header">
                    <span class="result-type">{{ option.name }}</span>
                    <span class="result-days">{{ option.days }} дн.</span>
                  </div>
                  <div class="result-price">{{ formatPrice(option.price) }}</div>
                  <div class="result-info">
                    <span v-if="option.insurance">Страховка включена</span>
                    <span v-if="option.terminal">Терминал: {{ option.terminal }}</span>
                  </div>
                </div>
              </div>

              <div class="result-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Окончательная стоимость может быть скорректирована менеджером</span>
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ error }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Product } from '~/types'

interface Props {
  isOpen: boolean
  product: Product | null
}

interface City {
  code: string
  name: string
  region: string
}

interface DeliveryOption {
  type: string
  name: string
  price: number
  days: string
  insurance?: boolean
  terminal?: string
}

interface DeliveryResult {
  options: DeliveryOption[]
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const deliveryCity = ref('')
const deliveryType = ref('terminal')
const selectedCity = ref<City | null>(null)
const citySuggestions = ref<City[]>([])
const isSearchingCity = ref(false)
const isCalculating = ref(false)
const deliveryResult = ref<DeliveryResult | null>(null)
const error = ref('')

// Debounce timer
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  deliveryCity.value = ''
  selectedCity.value = null
  citySuggestions.value = []
  deliveryResult.value = null
  error.value = ''
}

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

const searchCity = async () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (deliveryCity.value.length < 2) {
    citySuggestions.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    isSearchingCity.value = true

    try {
      // TODO: Integrate with DelLin API for city search
      // const response = await $fetch('/api/dellin/cities', {
      //   params: { query: deliveryCity.value }
      // })

      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 300))

      const mockCities: City[] = [
        { code: '7700000000000', name: 'Москва', region: 'Московская область' },
        { code: '7800000000000', name: 'Санкт-Петербург', region: 'Ленинградская область' },
        { code: '5400000100000', name: 'Новосибирск', region: 'Новосибирская область' },
        { code: '6600000100000', name: 'Екатеринбург', region: 'Свердловская область' },
        { code: '1600000100000', name: 'Казань', region: 'Республика Татарстан' },
        { code: '2400000100000', name: 'Красноярск', region: 'Красноярский край' },
      ].filter(city =>
        city.name.toLowerCase().includes(deliveryCity.value.toLowerCase())
      )

      citySuggestions.value = mockCities
    } catch (err) {
      console.error('Error searching cities:', err)
    } finally {
      isSearchingCity.value = false
    }
  }, 300)
}

const selectCity = (city: City) => {
  selectedCity.value = city
  deliveryCity.value = `${city.name}, ${city.region}`
  citySuggestions.value = []
}

const calculateDelivery = async () => {
  if (!selectedCity.value || !props.product) return

  isCalculating.value = true
  error.value = ''
  deliveryResult.value = null

  try {
    // TODO: Integrate with DelLin API
    // const response = await $fetch('/api/dellin/calculate', {
    //   method: 'POST',
    //   body: {
    //     productId: props.product._id,
    //     cityCode: selectedCity.value.code,
    //     deliveryType: deliveryType.value,
    //     weight: props.product.weight,
    //     dimensions: props.product.dimensions
    //   }
    // })

    // Mock calculation for demonstration
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simulate distance-based calculation
    const basePrice = deliveryType.value === 'terminal' ? 2500 : 4500
    const weightFactor = props.product.weight ? props.product.weight * 50 : 500

    deliveryResult.value = {
      options: [
        {
          type: 'standard',
          name: 'Стандартная доставка',
          price: basePrice + weightFactor,
          days: '5-7',
          insurance: true
        },
        {
          type: 'express',
          name: 'Экспресс доставка',
          price: (basePrice + weightFactor) * 1.5,
          days: '2-3',
          insurance: true
        },
        ...(deliveryType.value === 'terminal' ? [{
          type: 'economy',
          name: 'Экономичная',
          price: (basePrice + weightFactor) * 0.7,
          days: '7-10',
          insurance: false,
          terminal: 'Терминал Деловые Линии'
        }] : [])
      ]
    }
  } catch (err: any) {
    error.value = 'Не удалось рассчитать стоимость доставки. Попробуйте позже.'
    console.error('Delivery calculation error:', err)
  } finally {
    isCalculating.value = false
  }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-md;
  z-index: $z-index-modal;
}

.modal-container {
  background: $white;
  border-radius: $radius-2xl;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: $shadow-2xl;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  border-bottom: 2px solid $gray-100;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin: 0;

  .title-icon {
    color: $primary-500;
  }
}

.modal-close {
  padding: $spacing-sm;
  background: $gray-100;
  border: none;
  border-radius: $radius-lg;
  color: $gray-600;
  cursor: pointer;
  transition: all $transition-base $transition-ease;

  &:hover {
    background: $gray-200;
    color: $gray-900;
  }
}

.modal-body {
  padding: $spacing-lg;
}

.product-info {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $gray-50;
  border-radius: $radius-xl;
  margin-bottom: $spacing-lg;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: $radius-lg;
  background: $white;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin: 0 0 $spacing-xs;
}

.product-specs {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  font-size: $font-size-sm;
  color: $gray-600;
}

.delivery-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.form-group {
  position: relative;
}

.form-label {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-700;
  margin-bottom: $spacing-xs;
}

.city-input-wrapper {
  position: relative;
}

.form-input {
  width: 100%;
  padding: $spacing-sm $spacing-md;
  border: 2px solid $gray-200;
  border-radius: $radius-lg;
  font-size: $font-size-base;
  transition: all $transition-base $transition-ease;

  &:focus {
    outline: none;
    border-color: $primary-500;
    box-shadow: 0 0 0 3px rgba($primary-500, 0.1);
  }

  &::placeholder {
    color: $gray-400;
  }
}

.input-spinner {
  position: absolute;
  right: $spacing-sm;
  top: 50%;
  transform: translateY(-50%);
  color: $gray-400;
}

.city-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: $white;
  border: 2px solid $gray-200;
  border-radius: $radius-lg;
  margin-top: $spacing-xs;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  list-style: none;
  padding: 0;
  box-shadow: $shadow-lg;
}

.suggestion-item {
  padding: $spacing-sm $spacing-md;
  cursor: pointer;
  transition: background $transition-fast $transition-ease;

  &:hover {
    background: $primary-50;
    color: $primary-600;
  }
}

.delivery-types {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;
}

.delivery-type {
  cursor: pointer;

  .radio-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .type-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-md;
    background: $gray-50;
    border: 2px solid $gray-200;
    border-radius: $radius-xl;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-700;
    transition: all $transition-base $transition-ease;

    svg {
      color: $gray-400;
      transition: color $transition-base $transition-ease;
    }
  }

  .radio-input:checked + .type-content {
    background: $primary-50;
    border-color: $primary-500;
    color: $primary-700;

    svg {
      color: $primary-500;
    }
  }

  &:hover .type-content {
    border-color: $primary-400;
  }
}

.calc-button {
  width: 100%;
  padding: $spacing-md;
  background: $gradient-primary;
  border: none;
  border-radius: $radius-xl;
  color: $white;
  font-size: $font-size-base;
  font-weight: $font-weight-bold;
  cursor: pointer;
  transition: all $transition-base $transition-ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($primary-500, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
  }
}

.delivery-result {
  margin-top: $spacing-lg;
  padding-top: $spacing-lg;
  border-top: 2px solid $gray-100;
}

.result-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin: 0 0 $spacing-md;
}

.result-cards {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.result-card {
  padding: $spacing-md;
  background: $gray-50;
  border: 2px solid $gray-200;
  border-radius: $radius-xl;
  transition: all $transition-base $transition-ease;

  &:hover {
    border-color: $primary-300;
    background: $primary-50;
  }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-sm;
}

.result-type {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $gray-700;
}

.result-days {
  font-size: $font-size-sm;
  color: $gray-500;
  background: $white;
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-full;
}

.result-price {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $primary-600;
  margin-bottom: $spacing-xs;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
  font-size: $font-size-xs;
  color: $gray-500;
}

.result-note {
  display: flex;
  align-items: flex-start;
  gap: $spacing-sm;
  margin-top: $spacing-md;
  padding: $spacing-sm $spacing-md;
  background: $info-light;
  border-radius: $radius-lg;
  font-size: $font-size-sm;
  color: $info;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
}

.error-message {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-top: $spacing-md;
  padding: $spacing-md;
  background: $error-light;
  border-radius: $radius-lg;
  color: $error;
  font-size: $font-size-sm;
}

// Animation
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// Modal Transition
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .modal-container {
    transform: scale(0.9) translateY(20px);
  }
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;

  .modal-container {
    transform: scale(1) translateY(0);
  }
}
</style>
