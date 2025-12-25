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
                v-if="product.images?.length && product.images[0]?.url"
                :src="getProductImageUrl(product.images[0].url)"
                :alt="product.name"
                class="product-image"
              />
              <div class="product-details">
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-specs">
                  <span v-if="formData.weight">Вес: {{ formData.weight }} кг</span>
                  <span v-if="formData.length && formData.width && formData.height">
                    Габариты: {{ formData.length }}x{{ formData.width }}x{{ formData.height }} см
                  </span>
                </div>
              </div>
            </div>

            <!-- Delivery Form -->
            <form @submit.prevent="calculateDelivery" class="delivery-form">
              <!-- Город отправления -->
              <div class="form-group">
                <label class="form-label">Город отправления</label>
                <div class="city-input-wrapper">
                  <input
                    v-model="originCityInput"
                    type="text"
                    placeholder="Начните вводить город..."
                    class="form-input"
                    @input="searchOriginCity"
                    @focus="showOriginSuggestions = true"
                  />
                  <div v-if="isSearchingOriginCity" class="input-spinner">
                    <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
                <ul v-if="showOriginSuggestions && originCitySuggestions.length" class="city-suggestions">
                  <li
                    v-for="city in originCitySuggestions"
                    :key="city.code"
                    @click="selectOriginCity(city)"
                    class="suggestion-item"
                  >
                    {{ city.name }}
                  </li>
                </ul>
              </div>

              <!-- Город назначения -->
              <div class="form-group">
                <label class="form-label">Город назначения</label>
                <div class="city-input-wrapper">
                  <input
                    v-model="destinationCityInput"
                    type="text"
                    placeholder="Начните вводить город..."
                    class="form-input"
                    @input="searchDestinationCity"
                    @focus="showDestinationSuggestions = true"
                  />
                  <div v-if="isSearchingDestinationCity" class="input-spinner">
                    <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
                <ul v-if="showDestinationSuggestions && destinationCitySuggestions.length" class="city-suggestions">
                  <li
                    v-for="city in destinationCitySuggestions"
                    :key="city.code"
                    @click="selectDestinationCity(city)"
                    class="suggestion-item"
                  >
                    {{ city.name }}
                  </li>
                </ul>
              </div>

              <!-- Вес -->
              <div class="form-group">
                <label class="form-label">Вес (кг) *</label>
                <input
                  v-model.number="formData.weight"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Вес груза в килограммах"
                  class="form-input"
                  required
                />
              </div>

              <!-- Габариты (опционально) -->
              <div class="form-group">
                <label class="form-label">Габариты (см) - опционально</label>
                <div class="dimensions-grid">
                  <input
                    v-model.number="formData.length"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Длина"
                    class="form-input"
                  />
                  <input
                    v-model.number="formData.width"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Ширина"
                    class="form-input"
                  />
                  <input
                    v-model.number="formData.height"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Высота"
                    class="form-input"
                  />
                </div>
              </div>

              <!-- Объявленная стоимость (опционально) -->
              <div class="form-group">
                <label class="form-label">Объявленная стоимость (₽) - опционально</label>
                <input
                  v-model.number="formData.declaredValue"
                  type="number"
                  min="0"
                  placeholder="Стоимость груза для страхования"
                  class="form-input"
                />
              </div>

              <button
                type="submit"
                :disabled="!isFormValid || isCalculating"
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

              <div class="result-main">
                <div class="result-price-block">
                  <span class="price-label">Стоимость</span>
                  <div class="result-price">{{ formatPrice(deliveryResult.price) }}</div>
                </div>
                <div class="result-delivery-time">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ deliveryResult.deliveryTime }}</span>
                </div>
              </div>

              <!-- Информация о терминалах -->
              <div v-if="deliveryResult.terminals?.length" class="terminals-info">
                <h4 class="terminals-title">Терминалы доставки</h4>
                <div class="terminals-list">
                  <div
                    v-for="(terminal, index) in deliveryResult.terminals"
                    :key="index"
                    class="terminal-card"
                  >
                    <div class="terminal-name">{{ terminal.name }}</div>
                    <div v-if="terminal.address" class="terminal-address">{{ terminal.address }}</div>
                    <div v-if="terminal.workTime" class="terminal-hours">{{ terminal.workTime }}</div>
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
import { ref, watch, computed } from 'vue'
import type { Product } from '~/types'

const { getProductImageUrl } = useMediaUrl();

interface Props {
  isOpen: boolean
  product: Product | null
}

interface City {
  code: string
  name: string
}

interface Terminal {
  name: string
  address?: string
  workTime?: string
}

interface DeliveryResult {
  price: number
  deliveryTime: string
  terminals?: Terminal[]
}

interface FormData {
  weight: number | null
  length: number | null
  width: number | null
  height: number | null
  declaredValue: number | null
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

// Города
const originCityInput = ref('')
const destinationCityInput = ref('')
const selectedOriginCity = ref<City | null>(null)
const selectedDestinationCity = ref<City | null>(null)
const originCitySuggestions = ref<City[]>([])
const destinationCitySuggestions = ref<City[]>([])
const showOriginSuggestions = ref(false)
const showDestinationSuggestions = ref(false)
const isSearchingOriginCity = ref(false)
const isSearchingDestinationCity = ref(false)

// Форма
const formData = ref<FormData>({
  weight: null,
  length: null,
  width: null,
  height: null,
  declaredValue: null
})

// Результаты и состояние
const isCalculating = ref(false)
const deliveryResult = ref<DeliveryResult | null>(null)
const error = ref('')

// Debounce timers
let originSearchTimeout: ReturnType<typeof setTimeout> | null = null
let destinationSearchTimeout: ReturnType<typeof setTimeout> | null = null

// Computed
const isFormValid = computed(() => {
  return (
    selectedOriginCity.value !== null &&
    selectedDestinationCity.value !== null &&
    formData.value.weight !== null &&
    formData.value.weight > 0
  )
})

// Инициализация данных из продукта
watch(() => props.product, (product) => {
  if (product) {
    formData.value.weight = product.weight || null
    if (product.dimensions) {
      formData.value.length = product.dimensions.length || null
      formData.value.width = product.dimensions.width || null
      formData.value.height = product.dimensions.height || null
    }
  }
}, { immediate: true })

const closeModal = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  originCityInput.value = ''
  destinationCityInput.value = ''
  selectedOriginCity.value = null
  selectedDestinationCity.value = null
  originCitySuggestions.value = []
  destinationCitySuggestions.value = []
  showOriginSuggestions.value = false
  showDestinationSuggestions.value = false
  deliveryResult.value = null
  error.value = ''

  // Сбросить formData, но восстановить данные из продукта
  if (props.product) {
    formData.value.weight = props.product.weight || null
    if (props.product.dimensions) {
      formData.value.length = props.product.dimensions.length || null
      formData.value.width = props.product.dimensions.width || null
      formData.value.height = props.product.dimensions.height || null
    }
  } else {
    formData.value = {
      weight: null,
      length: null,
      width: null,
      height: null,
      declaredValue: null
    }
  }
}

watch(() => props.isOpen, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

// Поиск города отправления
const searchOriginCity = async () => {
  if (originSearchTimeout) {
    clearTimeout(originSearchTimeout)
  }

  if (originCityInput.value.length < 2) {
    originCitySuggestions.value = []
    showOriginSuggestions.value = false
    return
  }

  originSearchTimeout = setTimeout(async () => {
    isSearchingOriginCity.value = true
    showOriginSuggestions.value = true

    try {
      const response = await $fetch('/api/v1/delivery/cities/search', {
        params: { query: originCityInput.value }
      })

      originCitySuggestions.value = response.cities || []
    } catch (err: any) {
      console.error('Error searching origin cities:', err)
      error.value = 'Ошибка при поиске города отправления'
      originCitySuggestions.value = []
    } finally {
      isSearchingOriginCity.value = false
    }
  }, 300)
}

// Поиск города назначения
const searchDestinationCity = async () => {
  if (destinationSearchTimeout) {
    clearTimeout(destinationSearchTimeout)
  }

  if (destinationCityInput.value.length < 2) {
    destinationCitySuggestions.value = []
    showDestinationSuggestions.value = false
    return
  }

  destinationSearchTimeout = setTimeout(async () => {
    isSearchingDestinationCity.value = true
    showDestinationSuggestions.value = true

    try {
      const response = await $fetch('/api/v1/delivery/cities/search', {
        params: { query: destinationCityInput.value }
      })

      destinationCitySuggestions.value = response.cities || []
    } catch (err: any) {
      console.error('Error searching destination cities:', err)
      error.value = 'Ошибка при поиске города назначения'
      destinationCitySuggestions.value = []
    } finally {
      isSearchingDestinationCity.value = false
    }
  }, 300)
}

const selectOriginCity = (city: City) => {
  selectedOriginCity.value = city
  originCityInput.value = city.name
  originCitySuggestions.value = []
  showOriginSuggestions.value = false
  error.value = ''
}

const selectDestinationCity = (city: City) => {
  selectedDestinationCity.value = city
  destinationCityInput.value = city.name
  destinationCitySuggestions.value = []
  showDestinationSuggestions.value = false
  error.value = ''
}

const calculateDelivery = async () => {
  if (!isFormValid.value) return

  isCalculating.value = true
  error.value = ''
  deliveryResult.value = null

  try {
    // Подготовка данных для запроса
    const requestData: any = {
      originCity: selectedOriginCity.value!.code,
      destinationCity: selectedDestinationCity.value!.code,
      weight: formData.value.weight
    }

    // Добавить габариты если указаны все три измерения
    if (
      formData.value.length &&
      formData.value.width &&
      formData.value.height
    ) {
      requestData.dimensions = {
        length: formData.value.length,
        width: formData.value.width,
        height: formData.value.height
      }
    }

    // Добавить объявленную стоимость если указана
    if (formData.value.declaredValue) {
      requestData.declaredValue = formData.value.declaredValue
    }

    // Запрос к API
    const response = await $fetch('/api/v1/delivery/calculate', {
      method: 'POST',
      body: requestData
    })

    deliveryResult.value = {
      price: response.price,
      deliveryTime: response.deliveryTime,
      terminals: response.terminals || []
    }
  } catch (err: any) {
    console.error('Delivery calculation error:', err)

    // Обработка различных типов ошибок
    if (err.statusCode === 400) {
      error.value = err.data?.message || 'Неверные параметры запроса. Проверьте введенные данные.'
    } else if (err.statusCode === 404) {
      error.value = 'Не удалось найти маршрут доставки для указанных городов.'
    } else if (err.statusCode === 503) {
      error.value = 'Сервис расчета доставки временно недоступен. Попробуйте позже.'
    } else {
      error.value = 'Не удалось рассчитать стоимость доставки. Попробуйте позже или обратитесь к менеджеру.'
    }
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

// Закрытие выпадающих списков при клике вне компонента
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.city-input-wrapper')) {
    showOriginSuggestions.value = false
    showDestinationSuggestions.value = false
  }
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})
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

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-sm;
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

.result-main {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: linear-gradient(135deg, $primary-50 0%, $primary-100 100%);
  border-radius: $radius-xl;
  margin-bottom: $spacing-md;
}

.result-price-block {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.price-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-price {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: $primary-600;
}

.result-delivery-time {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background: $white;
  border-radius: $radius-lg;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  color: $gray-700;

  svg {
    color: $primary-500;
  }
}

.terminals-info {
  margin-top: $spacing-md;
}

.terminals-title {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin: 0 0 $spacing-sm;
}

.terminals-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.terminal-card {
  padding: $spacing-md;
  background: $gray-50;
  border: 1px solid $gray-200;
  border-radius: $radius-lg;
  transition: all $transition-base $transition-ease;

  &:hover {
    border-color: $primary-300;
    background: $primary-50;
  }
}

.terminal-name {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: $spacing-xs;
}

.terminal-address {
  font-size: $font-size-xs;
  color: $gray-600;
  margin-bottom: $spacing-xs;
}

.terminal-hours {
  font-size: $font-size-xs;
  color: $gray-500;
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
  background: rgba($primary, 0.1);
  border-radius: $radius-lg;
  font-size: $font-size-sm;
  color: $primary;

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
