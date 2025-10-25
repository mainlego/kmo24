<template>
  <div class="addresses-page">
    <div class="container">
      <div class="addresses-page__header">
        <NuxtLink to="/account" class="addresses-page__back">
          ← Назад в личный кабинет
        </NuxtLink>
        <div class="addresses-page__header-content">
          <h1>Адреса доставки</h1>
          <BaseButton variant="primary" @click="openAddModal">
            + Добавить адрес
          </BaseButton>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="addresses-page__loading">
        <BaseSpinner size="lg" text="Загрузка адресов..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="addresses.length === 0" class="addresses-page__empty">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          <path
            d="M17.657 16.657L13.414 20.9C13.039 21.275 12.5303 21.4854 12 21.4854C11.4697 21.4854 10.961 21.275 10.586 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3 12 3C13.5822 3 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657Z"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
        <h2>У вас пока нет сохраненных адресов</h2>
        <p>Добавьте адрес доставки для быстрого оформления заказов</p>
        <BaseButton variant="primary" @click="openAddModal">
          Добавить адрес
        </BaseButton>
      </div>

      <!-- Addresses Grid -->
      <div v-else class="addresses-page__grid">
        <div
          v-for="address in addresses"
          :key="address._id"
          class="addresses-page__card"
          :class="{ 'addresses-page__card--default': address.isDefault }"
        >
          <div v-if="address.isDefault" class="addresses-page__card-badge">
            <BaseBadge variant="success" size="sm">По умолчанию</BaseBadge>
          </div>

          <div class="addresses-page__card-content">
            <h3>{{ address.label }}</h3>

            <div class="addresses-page__card-info">
              <p class="addresses-page__card-name">{{ address.recipientName }}</p>
              <p class="addresses-page__card-phone">{{ address.phone }}</p>
              <p class="addresses-page__card-address">
                {{ formatAddress(address) }}
              </p>
            </div>
          </div>

          <div class="addresses-page__card-actions">
            <BaseButton
              v-if="!address.isDefault"
              variant="outline"
              size="sm"
              @click="setDefault(address._id)"
            >
              Сделать основным
            </BaseButton>
            <BaseButton
              variant="outline"
              size="sm"
              @click="editAddress(address)"
            >
              Редактировать
            </BaseButton>
            <BaseButton
              variant="danger"
              size="sm"
              @click="deleteAddress(address._id)"
            >
              Удалить
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div v-if="showModal" class="addresses-page__modal" @click.self="closeModal">
        <div class="addresses-page__modal-content">
          <div class="addresses-page__modal-header">
            <h2>{{ editingAddress ? 'Редактировать адрес' : 'Новый адрес' }}</h2>
            <button @click="closeModal" class="addresses-page__modal-close">×</button>
          </div>

          <form @submit.prevent="saveAddress" class="addresses-page__modal-form">
            <BaseInput
              v-model="form.label"
              label="Название адреса"
              placeholder="Например: Дом, Работа"
              required
            />

            <BaseInput
              v-model="form.recipientName"
              label="Получатель"
              placeholder="ФИО получателя"
              required
            />

            <BaseInput
              v-model="form.phone"
              type="tel"
              label="Телефон"
              placeholder="+7 (999) 123-45-67"
              required
            />

            <div class="addresses-page__modal-row">
              <BaseInput
                v-model="form.city"
                label="Город"
                placeholder="Москва"
                required
              />
              <BaseInput
                v-model="form.postalCode"
                label="Индекс"
                placeholder="123456"
                required
              />
            </div>

            <BaseInput
              v-model="form.street"
              label="Улица"
              placeholder="Улица Ленина"
              required
            />

            <div class="addresses-page__modal-row">
              <BaseInput
                v-model="form.building"
                label="Дом"
                placeholder="12"
                required
              />
              <BaseInput
                v-model="form.apartment"
                label="Квартира"
                placeholder="45"
              />
            </div>

            <BaseInput
              v-model="form.entrance"
              label="Подъезд"
              placeholder="3"
            />

            <BaseInput
              v-model="form.floor"
              label="Этаж"
              placeholder="5"
            />

            <BaseInput
              v-model="form.notes"
              label="Комментарий"
              placeholder="Например: код домофона 1234"
            />

            <div class="addresses-page__modal-checkbox">
              <BaseCheckbox
                v-model="form.isDefault"
                label="Сделать основным адресом"
              />
            </div>

            <div class="addresses-page__modal-actions">
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                :loading="isSaving"
                fullWidth
              >
                {{ editingAddress ? 'Сохранить' : 'Добавить адрес' }}
              </BaseButton>
              <BaseButton
                type="button"
                variant="outline"
                size="lg"
                @click="closeModal"
                fullWidth
              >
                Отмена
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface Address {
  _id: string;
  label: string;
  recipientName: string;
  phone: string;
  city: string;
  postalCode: string;
  street: string;
  building: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  notes?: string;
  isDefault: boolean;
}

const addresses = ref<Address[]>([]);
const isLoading = ref(true);
const showModal = ref(false);
const editingAddress = ref<Address | null>(null);
const isSaving = ref(false);

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
  isDefault: false,
});

// Mock data
const mockAddresses: Address[] = [
  {
    _id: '1',
    label: 'Дом',
    recipientName: 'Иван Иванов',
    phone: '+7 (999) 123-45-67',
    city: 'Москва',
    postalCode: '123456',
    street: 'Ленина',
    building: '12',
    apartment: '45',
    entrance: '3',
    floor: '5',
    notes: 'Код домофона: 1234',
    isDefault: true,
  },
  {
    _id: '2',
    label: 'Работа',
    recipientName: 'Иван Иванов',
    phone: '+7 (999) 123-45-67',
    city: 'Москва',
    postalCode: '654321',
    street: 'Пушкина',
    building: '5',
    apartment: '101',
    entrance: '1',
    floor: '3',
    isDefault: false,
  },
];

const formatAddress = (address: Address): string => {
  const parts = [
    address.city,
    address.street,
    `д. ${address.building}`,
  ];

  if (address.apartment) parts.push(`кв. ${address.apartment}`);

  return parts.join(', ');
};

const openAddModal = () => {
  editingAddress.value = null;
  resetForm();
  showModal.value = true;
};

const editAddress = (address: Address) => {
  editingAddress.value = address;
  Object.assign(form, address);
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingAddress.value = null;
  resetForm();
};

const resetForm = () => {
  form.label = '';
  form.recipientName = '';
  form.phone = '';
  form.city = '';
  form.postalCode = '';
  form.street = '';
  form.building = '';
  form.apartment = '';
  form.entrance = '';
  form.floor = '';
  form.notes = '';
  form.isDefault = false;
};

const saveAddress = async () => {
  isSaving.value = true;

  try {
    // TODO: API call to save address
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (editingAddress.value) {
      // Update existing
      const index = addresses.value.findIndex(a => a._id === editingAddress.value!._id);
      if (index !== -1) {
        addresses.value[index] = { ...editingAddress.value, ...form };
      }
    } else {
      // Add new
      addresses.value.push({
        _id: Date.now().toString(),
        ...form,
      });
    }

    // If set as default, unset others
    if (form.isDefault) {
      addresses.value.forEach(addr => {
        if (addr._id !== editingAddress.value?._id) {
          addr.isDefault = false;
        }
      });
    }

    closeModal();
    alert('Адрес успешно сохранен!');
  } catch (error) {
    console.error('Error saving address:', error);
    alert('Ошибка при сохранении адреса');
  } finally {
    isSaving.value = false;
  }
};

const setDefault = async (addressId: string) => {
  try {
    // TODO: API call to set default address
    addresses.value.forEach(addr => {
      addr.isDefault = addr._id === addressId;
    });
    alert('Адрес установлен как основной');
  } catch (error) {
    console.error('Error setting default address:', error);
  }
};

const deleteAddress = async (addressId: string) => {
  if (!confirm('Вы уверены, что хотите удалить этот адрес?')) return;

  try {
    // TODO: API call to delete address
    const index = addresses.value.findIndex(a => a._id === addressId);
    if (index !== -1) {
      addresses.value.splice(index, 1);
      alert('Адрес удален');
    }
  } catch (error) {
    console.error('Error deleting address:', error);
    alert('Ошибка при удалении адреса');
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    // TODO: Fetch addresses from API
    await new Promise(resolve => setTimeout(resolve, 800));
    addresses.value = mockAddresses;
  } catch (error) {
    console.error('Error loading addresses:', error);
  } finally {
    isLoading.value = false;
  }
});

// SEO
useHead({
  title: 'Адреса доставки - Онлайн Магазин',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.addresses-page {
  min-height: calc(100vh - 200px);
  padding: $spacing-xl 0;
  background: $gray-50;

  &__header {
    margin-bottom: $spacing-xl;
  }

  &__header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: $spacing-md;

    h1 {
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
      color: $gray-900;
      margin: 0;
    }

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
      align-items: stretch;
      gap: $spacing-md;
    }
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    color: $primary;
    text-decoration: none;
    font-size: $font-size-sm;
    transition: color $transition-base;

    &:hover {
      color: darken($primary, 10%);
    }
  }

  &__loading,
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

    svg {
      color: $gray-300;
    }

    h2 {
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0;
    }

    p {
      font-size: $font-size-base;
      color: $gray-600;
      margin: 0;
      text-align: center;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: $spacing-lg;
  }

  &__card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding: $spacing-xl;
    background: $white;
    border: 2px solid $gray-200;
    border-radius: $radius-xl;
    box-shadow: $shadow-sm;
    transition: all $transition-base;

    &:hover {
      border-color: $primary;
      box-shadow: $shadow-md;
    }

    &--default {
      border-color: $success;
    }
  }

  &__card-badge {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
  }

  &__card-content {
    flex: 1;

    h3 {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0 0 $spacing-md 0;
    }
  }

  &__card-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    p {
      margin: 0;
      line-height: 1.5;
    }
  }

  &__card-name {
    font-weight: $font-weight-medium;
    color: $gray-900;
  }

  &__card-phone {
    font-size: $font-size-sm;
    color: $gray-600;
  }

  &__card-address {
    font-size: $font-size-sm;
    color: $gray-700;
  }

  &__card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    padding-top: $spacing-md;
    border-top: 1px solid $gray-200;
  }

  // Modal styles
  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($black, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: $spacing-lg;
  }

  &__modal-content {
    background: $white;
    border-radius: $radius-xl;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  &__modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-xl;
    border-bottom: 1px solid $gray-200;

    h2 {
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0;
    }
  }

  &__modal-close {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    font-size: $font-size-3xl;
    color: $gray-500;
    cursor: pointer;
    border-radius: $radius-md;
    transition: all $transition-base;

    &:hover {
      background: $gray-100;
      color: $gray-900;
    }
  }

  &__modal-form {
    padding: $spacing-xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__modal-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;

    @media (max-width: $breakpoint-sm) {
      grid-template-columns: 1fr;
    }
  }

  &__modal-checkbox {
    padding: $spacing-md 0;
  }

  &__modal-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;
    margin-top: $spacing-md;

    @media (max-width: $breakpoint-sm) {
      grid-template-columns: 1fr;
    }
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
