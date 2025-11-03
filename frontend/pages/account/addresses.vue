<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Back Button -->
      <NuxtLink
        to="/account"
        class="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group transition-all"
      >
        <svg
          class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Назад в личный кабинет
      </NuxtLink>

      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Адреса доставки
          </h1>
          <p class="text-gray-600">Управляйте адресами для быстрого оформления заказов</p>
        </div>
        <button
          @click="openAddModal"
          class="premium-button whitespace-nowrap"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Добавить адрес
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
          <p class="text-gray-600">Загрузка адресов...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="addresses.length === 0" class="glass-card p-12 text-center animate-fade-in-up">
        <div class="max-w-md mx-auto">
          <!-- Animated Icon -->
          <div class="relative mb-8">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
            </div>
            <svg class="relative w-32 h-32 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>

          <h2 class="text-2xl font-bold text-gray-900 mb-3">
            У вас пока нет сохраненных адресов
          </h2>
          <p class="text-gray-600 mb-8">
            Добавьте адрес доставки для быстрого оформления заказов и удобной доставки
          </p>
          <button
            @click="openAddModal"
            class="premium-button"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Добавить первый адрес
          </button>
        </div>
      </div>

      <!-- Addresses Grid -->
      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(address, index) in addresses"
          :key="address._id"
          class="address-card group"
          :class="{ 'address-card--default': address.isDefault }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- Default Badge -->
          <div v-if="address.isDefault" class="absolute -top-2 -right-2 z-10">
            <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              По умолчанию
            </div>
          </div>

          <!-- Icon -->
          <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 mb-3 flex items-center">
              {{ address.label }}
            </h3>

            <div class="space-y-2 mb-4">
              <div class="flex items-start text-sm">
                <svg class="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span class="text-gray-700 font-medium">{{ address.recipientName }}</span>
              </div>

              <div class="flex items-start text-sm">
                <svg class="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span class="text-gray-600">{{ address.phone }}</span>
              </div>

              <div class="flex items-start text-sm">
                <svg class="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-gray-600">{{ formatAddress(address) }}</span>
              </div>

              <div v-if="address.notes" class="flex items-start text-sm">
                <svg class="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-gray-500">{{ address.notes }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            <button
              v-if="!address.isDefault"
              @click="setDefault(address._id)"
              class="action-button action-button--primary flex-1"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Основной
            </button>
            <button
              @click="editAddress(address)"
              class="action-button action-button--secondary"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button
              @click="deleteAddress(address._id)"
              class="action-button action-button--danger"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content" @click.stop>
              <!-- Modal Header -->
              <div class="modal-header">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">
                    {{ editingAddress ? 'Редактировать адрес' : 'Новый адрес' }}
                  </h2>
                  <p class="text-sm text-gray-600 mt-1">Заполните все обязательные поля</p>
                </div>
                <button @click="closeModal" class="modal-close">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <!-- Modal Form -->
              <form @submit.prevent="saveAddress" class="modal-form">
                <div class="form-group">
                  <label class="form-label">
                    Название адреса
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.label"
                    type="text"
                    class="form-input"
                    placeholder="Например: Дом, Работа, Офис"
                    required
                  />
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                  <div class="form-group">
                    <label class="form-label">
                      Получатель
                      <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.recipientName"
                      type="text"
                      class="form-input"
                      placeholder="ФИО получателя"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      Телефон
                      <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      class="form-input"
                      placeholder="+7 (999) 123-45-67"
                      required
                    />
                  </div>
                </div>

                <div class="grid md:grid-cols-3 gap-4">
                  <div class="form-group md:col-span-2">
                    <label class="form-label">
                      Город
                      <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.city"
                      type="text"
                      class="form-input"
                      placeholder="Москва"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">
                      Индекс
                      <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.postalCode"
                      type="text"
                      class="form-input"
                      placeholder="123456"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    Улица
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.street"
                    type="text"
                    class="form-input"
                    placeholder="Улица Ленина"
                    required
                  />
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div class="form-group">
                    <label class="form-label">
                      Дом
                      <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.building"
                      type="text"
                      class="form-input"
                      placeholder="12"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Квартира</label>
                    <input
                      v-model="form.apartment"
                      type="text"
                      class="form-input"
                      placeholder="45"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Подъезд</label>
                    <input
                      v-model="form.entrance"
                      type="text"
                      class="form-input"
                      placeholder="3"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Этаж</label>
                    <input
                      v-model="form.floor"
                      type="text"
                      class="form-input"
                      placeholder="5"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Комментарий</label>
                  <textarea
                    v-model="form.notes"
                    class="form-input"
                    rows="3"
                    placeholder="Например: код домофона, особенности доставки"
                  ></textarea>
                </div>

                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    v-model="form.isDefault"
                    class="checkbox-input"
                  />
                  <span class="checkbox-custom"></span>
                  <span class="checkbox-text">Сделать основным адресом доставки</span>
                </label>

                <!-- Modal Actions -->
                <div class="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    :disabled="isSaving"
                    class="flex-1 premium-button"
                  >
                    <svg v-if="!isSaving" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isSaving ? 'Сохранение...' : (editingAddress ? 'Сохранить изменения' : 'Добавить адрес') }}
                  </button>
                  <button
                    type="button"
                    @click="closeModal"
                    class="flex-1 sm:flex-initial premium-button-outline"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

interface Address {
  _id: string
  label: string
  recipientName: string
  phone: string
  city: string
  postalCode: string
  street: string
  building: string
  apartment?: string
  entrance?: string
  floor?: string
  notes?: string
  isDefault: boolean
}

// SEO
useHead({
  title: 'Адреса доставки - КМО24',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const addresses = ref<Address[]>([])
const isLoading = ref(true)
const showModal = ref(false)
const editingAddress = ref<Address | null>(null)
const isSaving = ref(false)

const form = reactive({
  label: '',
  recipientName: '',
  phone: '',
  city: '',
  postalCode: '',
  street: '',
  building: '',
  apartment: '',
  entrance: '',
  floor: '',
  notes: '',
  isDefault: false
})

// Mock data
const mockAddresses: Address[] = [
  {
    _id: '1',
    label: 'Дом',
    recipientName: 'Иван Иванов',
    phone: '+7 (999) 123-45-67',
    city: 'Москва',
    postalCode: '123456',
    street: 'ул. Ленина',
    building: '12',
    apartment: '45',
    entrance: '3',
    floor: '5',
    notes: 'Код домофона: 1234',
    isDefault: true
  },
  {
    _id: '2',
    label: 'Работа',
    recipientName: 'Иван Иванов',
    phone: '+7 (999) 123-45-67',
    city: 'Москва',
    postalCode: '654321',
    street: 'ул. Пушкина',
    building: '5',
    apartment: '101',
    entrance: '1',
    floor: '3',
    isDefault: false
  }
]

const formatAddress = (address: Address): string => {
  const parts = [
    address.city,
    address.street,
    `д. ${address.building}`
  ]

  if (address.apartment) parts.push(`кв. ${address.apartment}`)

  return parts.join(', ')
}

const openAddModal = () => {
  editingAddress.value = null
  resetForm()
  showModal.value = true
}

const editAddress = (address: Address) => {
  editingAddress.value = address
  Object.assign(form, address)
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingAddress.value = null
  resetForm()
}

const resetForm = () => {
  form.label = ''
  form.recipientName = ''
  form.phone = ''
  form.city = ''
  form.postalCode = ''
  form.street = ''
  form.building = ''
  form.apartment = ''
  form.entrance = ''
  form.floor = ''
  form.notes = ''
  form.isDefault = false
}

const saveAddress = async () => {
  isSaving.value = true

  try {
    // TODO: API call to save address
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingAddress.value) {
      // Update existing
      const index = addresses.value.findIndex(a => a._id === editingAddress.value!._id)
      if (index !== -1) {
        addresses.value[index] = { ...editingAddress.value, ...form }
      }
    } else {
      // Add new
      addresses.value.push({
        _id: Date.now().toString(),
        ...form
      })
    }

    // If set as default, unset others
    if (form.isDefault) {
      addresses.value.forEach(addr => {
        if (addr._id !== editingAddress.value?._id) {
          addr.isDefault = false
        }
      })
    }

    closeModal()
    alert('Адрес успешно сохранен!')
  } catch (error) {
    console.error('Error saving address:', error)
    alert('Ошибка при сохранении адреса')
  } finally {
    isSaving.value = false
  }
}

const setDefault = async (addressId: string) => {
  try {
    // TODO: API call to set default address
    addresses.value.forEach(addr => {
      addr.isDefault = addr._id === addressId
    })
    alert('Адрес установлен как основной')
  } catch (error) {
    console.error('Error setting default address:', error)
  }
}

const deleteAddress = async (addressId: string) => {
  if (!confirm('Вы уверены, что хотите удалить этот адрес?')) return

  try {
    // TODO: API call to delete address
    const index = addresses.value.findIndex(a => a._id === addressId)
    if (index !== -1) {
      addresses.value.splice(index, 1)
      alert('Адрес удален')
    }
  } catch (error) {
    console.error('Error deleting address:', error)
    alert('Ошибка при удалении адреса')
  }
}

onMounted(async () => {
  try {
    isLoading.value = true
    // TODO: Fetch addresses from API
    await new Promise(resolve => setTimeout(resolve, 800))
    addresses.value = mockAddresses
  } catch (error) {
    console.error('Error loading addresses:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Glass Card */
.glass-card {
  @apply bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100;
}

/* Address Card */
.address-card {
  @apply relative flex flex-col p-6 bg-white rounded-2xl shadow-md border-2 border-gray-200;
  @apply transition-all duration-300;
  @apply hover:shadow-xl hover:-translate-y-1;
  opacity: 0;
  animation: fade-in-up 0.6s ease forwards;
}

.address-card--default {
  @apply border-green-300 bg-gradient-to-br from-green-50 to-white;
}

.address-card:hover {
  @apply border-blue-300;
}

/* Action Buttons */
.action-button {
  @apply inline-flex items-center justify-center px-3 py-2 text-sm font-semibold rounded-lg;
  @apply transition-all duration-200;
}

.action-button--primary {
  @apply bg-blue-50 text-blue-700 hover:bg-blue-100;
}

.action-button--secondary {
  @apply bg-gray-50 text-gray-700 hover:bg-gray-100;
}

.action-button--danger {
  @apply bg-red-50 text-red-700 hover:bg-red-100;
}

/* Premium Button */
.premium-button {
  @apply inline-flex items-center justify-center px-6 py-3;
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
  @apply text-white font-bold rounded-xl;
  @apply hover:from-blue-700 hover:to-purple-700;
  @apply transition-all duration-300 hover:scale-105;
  @apply shadow-lg hover:shadow-xl;
  @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100;
}

.premium-button-outline {
  @apply inline-flex items-center justify-center px-6 py-3;
  @apply bg-transparent text-gray-700 font-bold rounded-xl;
  @apply border-2 border-gray-300 hover:bg-gray-50;
  @apply transition-all duration-300;
}

/* Modal */
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4;
  @apply bg-black/50 backdrop-blur-sm;
}

.modal-content {
  @apply bg-white rounded-2xl shadow-2xl;
  @apply w-full max-w-2xl max-h-[90vh] overflow-y-auto;
}

.modal-header {
  @apply flex items-start justify-between p-6 border-b border-gray-200;
}

.modal-close {
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors;
}

.modal-form {
  @apply p-6 space-y-4;
}

/* Form Elements */
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-semibold text-gray-700;
}

.form-input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-xl;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  @apply transition-all duration-200;
  @apply text-gray-900 placeholder-gray-400;
}

.form-input:focus {
  @apply outline-none;
}

/* Checkbox */
.checkbox-label {
  @apply flex items-center gap-3 p-4 rounded-xl cursor-pointer;
  @apply hover:bg-gray-50 transition-colors;
  @apply border border-gray-200;
}

.checkbox-input {
  @apply sr-only;
}

.checkbox-custom {
  @apply relative w-5 h-5 border-2 border-gray-300 rounded flex-shrink-0;
  @apply transition-all duration-200;
}

.checkbox-input:checked ~ .checkbox-custom {
  @apply bg-blue-600 border-blue-600;
}

.checkbox-input:checked ~ .checkbox-custom::after {
  content: '';
  @apply absolute inset-0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M5 13l4 4L19 7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px;
}

.checkbox-text {
  @apply text-sm font-medium text-gray-900;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

/* Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease forwards;
}
</style>