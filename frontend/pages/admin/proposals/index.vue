<template>
  <div class="admin-proposals">
    <div class="page-header">
      <h1>Коммерческие предложения</h1>
      <p class="page-description">Формирование КП для клиентов</p>
    </div>

    <div class="proposals-content">
      <!-- Product Selection -->
      <div class="proposal-builder">
        <div class="builder-section">
          <h2>1. Выбор товаров</h2>

          <!-- Search Products -->
          <div class="product-search">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск товаров..."
              @input="searchProducts"
            />
          </div>

          <!-- Product Results -->
          <div v-if="searchResults.length" class="search-results">
            <div
              v-for="product in searchResults"
              :key="product._id"
              class="search-result-item"
              @click="addProduct(product)"
            >
              <img :src="getProductImageUrl(product.images?.[0]?.url)" :alt="product.name" />
              <div class="result-info">
                <span class="result-name">{{ product.name }}</span>
                <span class="result-sku">{{ product.sku }}</span>
              </div>
              <span class="result-price">{{ formatPrice(product.price) }}</span>
              <button type="button" class="add-btn">+</button>
            </div>
          </div>

          <!-- Selected Products -->
          <div class="selected-products">
            <h3>Выбранные товары ({{ selectedProducts.length }})</h3>
            <div v-if="selectedProducts.length === 0" class="empty-selection">
              Товары не выбраны
            </div>
            <div v-else class="selected-list">
              <div
                v-for="item in selectedProducts"
                :key="item.product._id"
                class="selected-item"
              >
                <img :src="getProductImageUrl(item.product.images?.[0]?.url)" :alt="item.product.name" />
                <div class="selected-info">
                  <span class="selected-name">{{ item.product.name }}</span>
                  <span class="selected-sku">{{ item.product.sku }}</span>
                </div>
                <div class="quantity-control">
                  <button @click="decreaseQuantity(item)">-</button>
                  <input v-model.number="item.quantity" type="number" min="1" />
                  <button @click="increaseQuantity(item)">+</button>
                </div>
                <span class="selected-total">{{ formatPrice(item.product.price * item.quantity) }}</span>
                <button @click="removeProduct(item)" class="remove-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="selectedProducts.length" class="selected-total-amount">
              <span>Итого:</span>
              <strong>{{ formatPrice(totalAmount) }}</strong>
            </div>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="builder-section">
          <h2>2. Данные получателя</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Наименование организации *</label>
              <input v-model="customerInfo.companyName" type="text" required />
            </div>
            <div class="form-group">
              <label>ИНН</label>
              <input v-model="customerInfo.companyInn" type="text" />
            </div>
            <div class="form-group">
              <label>Контактное лицо *</label>
              <input v-model="customerInfo.contactPerson" type="text" required />
            </div>
            <div class="form-group">
              <label>Телефон *</label>
              <input v-model="customerInfo.phone" type="tel" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="customerInfo.email" type="email" />
            </div>
            <div class="form-group full-width">
              <label>Срок действия КП</label>
              <input v-model="validUntilDays" type="number" min="1" max="90" />
              <span class="helper-text">дней с момента формирования</span>
            </div>
            <div class="form-group full-width">
              <label>Примечания</label>
              <textarea v-model="customerInfo.notes" rows="3"></textarea>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="builder-actions">
          <button
            type="button"
            class="btn-primary"
            @click="generateProposal"
            :disabled="!canGenerate"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Сформировать КП
          </button>

          <button
            type="button"
            class="btn-print"
            @click="generateAndPrint"
            :disabled="!canGenerate"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Печать КП
          </button>

          <button type="button" class="btn-secondary" @click="clearAll">
            Очистить
          </button>
        </div>
      </div>

      <!-- Generated Proposals History -->
      <div class="proposals-history">
        <h2>История КП</h2>
        <div v-if="proposalsHistory.length === 0" class="empty-history">
          Сформированные КП будут отображаться здесь
        </div>
        <div v-else class="history-list">
          <div v-for="proposal in proposalsHistory" :key="proposal.number" class="history-item">
            <div class="history-info">
              <span class="history-number">{{ proposal.number }}</span>
              <span class="history-date">{{ formatDate(proposal.date) }}</span>
              <span class="history-company">{{ proposal.companyName }}</span>
            </div>
            <div class="history-amount">{{ formatPrice(proposal.amount) }}</div>
            <div class="history-actions">
              <button @click="viewProposal(proposal)" title="Просмотр">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              <button @click="printProposalFromHistory(proposal)" title="Печать">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <div v-if="showPreviewModal" class="modal-overlay" @click.self="closePreviewModal">
        <div class="modal-content preview-modal">
          <div class="modal-header">
            <h3>Коммерческое предложение {{ previewProposalNumber }}</h3>
            <button class="modal-close" @click="closePreviewModal">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <iframe
              v-if="previewUrl"
              :src="previewUrl"
              class="preview-iframe"
              title="Превью КП"
            />
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="closePreviewModal">
              Закрыть
            </button>
            <button class="btn-download" @click="downloadCurrentProposal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Скачать
            </button>
            <button class="btn-print-modal" @click="printCurrentProposal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <rect x="6" y="14" width="12" height="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Печать
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Product } from '~/types'
import {
  generateProposalPDF,
  generateProposalHTML,
  generateProposalNumber,
  printProposal,
  type ProposalData,
} from '~/utils/commercialProposal'
import { useMediaUrl } from '../../../composables/useMediaUrl'

const { getProductImageUrl } = useMediaUrl()

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
})

useHead({
  title: 'Коммерческие предложения - Админ-панель',
})

interface SelectedProduct {
  product: Product
  quantity: number
}

interface ProposalHistoryItem {
  number: string
  date: Date
  companyName: string
  amount: number
  url: string
}

// Search
const searchQuery = ref('')
const searchResults = ref<Product[]>([])
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Selected Products
const selectedProducts = ref<SelectedProduct[]>([])

// Customer Info
const customerInfo = ref({
  companyName: '',
  companyInn: '',
  contactPerson: '',
  phone: '',
  email: '',
  notes: '',
})

const validUntilDays = ref(14)

// History
const proposalsHistory = ref<ProposalHistoryItem[]>([])

// Preview Modal
const showPreviewModal = ref(false)
const previewUrl = ref('')
const previewProposalNumber = ref('')
const previewHtml = ref('')

// Computed
const totalAmount = computed(() => {
  return selectedProducts.value.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)
})

const canGenerate = computed(() => {
  return (
    selectedProducts.value.length > 0 &&
    customerInfo.value.companyName &&
    customerInfo.value.contactPerson &&
    customerInfo.value.phone
  )
})

const { apiFetch } = useApi()

// Methods
const searchProducts = async () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const response = await apiFetch<{ success: boolean; data: any[] }>('/products', {
        params: { search: searchQuery.value, limit: 10 }
      })

      if (response.success && response.data) {
        searchResults.value = response.data.map(p => ({
          _id: p._id,
          name: p.name,
          slug: p.slug,
          sku: p.sku || '',
          price: p.price,
          oldPrice: p.oldPrice || null,
          description: p.description || { short: '', full: '' },
          images: p.images || [],
          category: p.category || '',
          stock: p.stock || { quantity: 0, lowStockThreshold: 1 },
          rating: p.rating || { average: 0, count: 0 },
          isActive: p.isActive,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }))
      }
    } catch {
      searchResults.value = []
    }
  }, 300)
}

const addProduct = (product: Product) => {
  const existing = selectedProducts.value.find(p => p.product._id === product._id)
  if (existing) {
    existing.quantity++
  } else {
    selectedProducts.value.push({
      product,
      quantity: 1,
    })
  }
  searchResults.value = []
  searchQuery.value = ''
}

const removeProduct = (item: SelectedProduct) => {
  const index = selectedProducts.value.indexOf(item)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  }
}

const increaseQuantity = (item: SelectedProduct) => {
  item.quantity++
}

const decreaseQuantity = (item: SelectedProduct) => {
  if (item.quantity > 1) {
    item.quantity--
  }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const generateProposal = async () => {
  if (!canGenerate.value) return

  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + validUntilDays.value)

  const proposalData: ProposalData = {
    companyName: customerInfo.value.companyName,
    companyInn: customerInfo.value.companyInn,
    contactPerson: customerInfo.value.contactPerson,
    phone: customerInfo.value.phone,
    email: customerInfo.value.email,
    products: selectedProducts.value,
    validUntil,
    notes: customerInfo.value.notes,
  }

  try {
    const result = await generateProposalPDF(proposalData)

    // Add to history
    proposalsHistory.value.unshift({
      number: result.proposalNumber,
      date: new Date(),
      companyName: customerInfo.value.companyName,
      amount: totalAmount.value,
      url: result.pdfUrl,
    })

    // Save history to localStorage
    saveHistory()

    // Open the proposal
    window.open(result.pdfUrl, '_blank')

    alert(`КП ${result.proposalNumber} успешно сформировано!`)
  } catch {
    alert('Ошибка при формировании КП')
  }
}

const clearAll = () => {
  selectedProducts.value = []
  customerInfo.value = {
    companyName: '',
    companyInn: '',
    contactPerson: '',
    phone: '',
    email: '',
    notes: '',
  }
  validUntilDays.value = 14
}

const viewProposal = (proposal: ProposalHistoryItem) => {
  window.open(proposal.url, '_blank')
}

const printProposalFromHistory = (proposal: ProposalHistoryItem) => {
  printProposal(proposal.url)
}

// Генерация и сразу печать КП
const generateAndPrint = async () => {
  if (!canGenerate.value) return

  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + validUntilDays.value)

  const proposalData: ProposalData = {
    companyName: customerInfo.value.companyName,
    companyInn: customerInfo.value.companyInn,
    contactPerson: customerInfo.value.contactPerson,
    phone: customerInfo.value.phone,
    email: customerInfo.value.email,
    products: selectedProducts.value,
    validUntil,
    notes: customerInfo.value.notes,
  }

  try {
    const result = await generateProposalPDF(proposalData)
    const html = generateProposalHTML(proposalData, result.proposalNumber)

    // Сохраняем данные для превью
    previewUrl.value = result.pdfUrl
    previewProposalNumber.value = result.proposalNumber
    previewHtml.value = html

    // Add to history
    proposalsHistory.value.unshift({
      number: result.proposalNumber,
      date: new Date(),
      companyName: customerInfo.value.companyName,
      amount: totalAmount.value,
      url: result.pdfUrl,
    })
    saveHistory()

    // Показываем модальное окно с превью
    showPreviewModal.value = true
  } catch {
    alert('Ошибка при формировании КП')
  }
}

// Закрытие модального окна превью
const closePreviewModal = () => {
  showPreviewModal.value = false
}

// Печать текущего КП из модального окна
const printCurrentProposal = () => {
  if (previewUrl.value) {
    printProposal(previewUrl.value)
  }
}

// Скачать текущий КП
const downloadCurrentProposal = () => {
  if (previewHtml.value && previewProposalNumber.value) {
    const blob = new Blob([previewHtml.value], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${previewProposalNumber.value}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

const saveHistory = () => {
  localStorage.setItem('proposalsHistory', JSON.stringify(proposalsHistory.value))
}

const loadHistory = () => {
  const saved = localStorage.getItem('proposalsHistory')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      proposalsHistory.value = parsed.map((item: any) => ({
        ...item,
        date: new Date(item.date),
      }))
    } catch {
      // Ignore parse errors
    }
  }
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.admin-proposals {
  padding: $spacing-xl;
}

.page-header {
  margin-bottom: $spacing-xl;

  h1 {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin: 0 0 $spacing-xs;
  }

  .page-description {
    color: $gray-600;
    margin: 0;
  }
}

.proposals-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: $spacing-xl;
  align-items: start;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }
}

.proposal-builder {
  background: $white;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
  overflow: hidden;
}

.builder-section {
  padding: $spacing-lg;
  border-bottom: 2px solid $gray-100;

  &:last-of-type {
    border-bottom: none;
  }

  h2 {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0 0 $spacing-lg;
  }
}

.product-search {
  margin-bottom: $spacing-md;

  input {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    border: 2px solid $gray-200;
    border-radius: $radius-lg;
    font-size: $font-size-base;

    &:focus {
      outline: none;
      border-color: $primary-500;
    }
  }
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
  border: 2px solid $gray-200;
  border-radius: $radius-lg;
  margin-bottom: $spacing-lg;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm;
  cursor: pointer;
  transition: background $transition-fast;

  &:hover {
    background: $gray-50;
  }

  &:not(:last-child) {
    border-bottom: 1px solid $gray-100;
  }

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: $radius-md;
  }

  .result-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .result-name {
    font-weight: $font-weight-medium;
    color: $gray-900;
  }

  .result-sku {
    font-size: $font-size-xs;
    color: $gray-500;
  }

  .result-price {
    font-weight: $font-weight-semibold;
    color: $primary-600;
  }

  .add-btn {
    width: 32px;
    height: 32px;
    background: $primary-500;
    border: none;
    border-radius: $radius-md;
    color: $white;
    font-size: $font-size-lg;
    cursor: pointer;

    &:hover {
      background: $primary-600;
    }
  }
}

.selected-products {
  h3 {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $gray-700;
    margin: 0 0 $spacing-md;
  }
}

.empty-selection {
  padding: $spacing-xl;
  text-align: center;
  color: $gray-500;
  background: $gray-50;
  border-radius: $radius-lg;
}

.selected-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.selected-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm;
  background: $gray-50;
  border-radius: $radius-lg;

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: $radius-sm;
  }

  .selected-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .selected-name {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-900;
  }

  .selected-sku {
    font-size: $font-size-xs;
    color: $gray-500;
  }

  .quantity-control {
    display: flex;
    align-items: center;
    gap: $spacing-xs;

    button {
      width: 28px;
      height: 28px;
      background: $white;
      border: 1px solid $gray-300;
      border-radius: $radius-sm;
      cursor: pointer;

      &:hover {
        background: $gray-100;
      }
    }

    input {
      width: 50px;
      text-align: center;
      border: 1px solid $gray-300;
      border-radius: $radius-sm;
      padding: $spacing-xs;
    }
  }

  .selected-total {
    font-weight: $font-weight-semibold;
    color: $primary-600;
    min-width: 100px;
    text-align: right;
  }

  .remove-btn {
    padding: $spacing-xs;
    background: transparent;
    border: none;
    color: $gray-400;
    cursor: pointer;

    &:hover {
      color: $error;
    }
  }
}

.selected-total-amount {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: $spacing-md;
  margin-top: $spacing-md;
  padding-top: $spacing-md;
  border-top: 2px solid $gray-200;
  font-size: $font-size-lg;

  strong {
    font-size: $font-size-xl;
    color: $primary-600;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  &.full-width {
    grid-column: 1 / -1;
  }

  label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-700;
  }

  input,
  textarea {
    padding: $spacing-sm;
    border: 2px solid $gray-200;
    border-radius: $radius-lg;
    font-size: $font-size-base;

    &:focus {
      outline: none;
      border-color: $primary-500;
    }
  }

  .helper-text {
    font-size: $font-size-xs;
    color: $gray-500;
  }
}

.builder-actions {
  padding: $spacing-lg;
  background: $gray-50;
  display: flex;
  gap: $spacing-md;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  background: $gradient-primary;
  border: none;
  border-radius: $radius-lg;
  color: $white;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-base;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($primary-500, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-secondary {
  padding: $spacing-md $spacing-xl;
  background: $white;
  border: 2px solid $gray-300;
  border-radius: $radius-lg;
  color: $gray-700;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    border-color: $gray-400;
    background: $gray-50;
  }
}

.btn-print {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: $radius-lg;
  color: $white;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-base;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(#3b82f6, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.proposals-history {
  background: $white;
  border-radius: $radius-xl;
  box-shadow: $shadow-md;
  padding: $spacing-lg;

  h2 {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0 0 $spacing-lg;
  }
}

.empty-history {
  padding: $spacing-xl;
  text-align: center;
  color: $gray-500;
  background: $gray-50;
  border-radius: $radius-lg;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.history-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $gray-50;
  border-radius: $radius-lg;

  .history-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  .history-number {
    font-weight: $font-weight-semibold;
    color: $primary-600;
    font-size: $font-size-sm;
  }

  .history-date {
    font-size: $font-size-xs;
    color: $gray-500;
  }

  .history-company {
    font-size: $font-size-sm;
    color: $gray-700;
  }

  .history-amount {
    font-weight: $font-weight-bold;
    color: $gray-900;
  }

  .history-actions {
    display: flex;
    gap: $spacing-xs;

    button {
      padding: $spacing-xs;
      background: $white;
      border: 1px solid $gray-300;
      border-radius: $radius-sm;
      color: $gray-600;
      cursor: pointer;

      &:hover {
        background: $primary-50;
        border-color: $primary-500;
        color: $primary-600;
      }
    }
  }
}

// Modal Styles
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-lg;
}

.modal-content {
  background: $white;
  border-radius: $radius-xl;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.preview-modal {
  height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1px solid $gray-200;

  h3 {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $gray-900;
  }
}

.modal-close {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: $gray-500;
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    background: $gray-100;
    color: $gray-900;
  }
}

.modal-body {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1px solid $gray-200;
}

.btn-download {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: $white;
  border: 2px solid $gray-300;
  border-radius: $radius-lg;
  color: $gray-700;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    border-color: $primary-500;
    color: $primary-600;
    background: $primary-50;
  }
}

.btn-print-modal {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: $radius-lg;
  color: $white;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(#3b82f6, 0.4);
  }
}
</style>
