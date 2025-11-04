<template>
  <div class="admin-orders">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Заказы</h1>
        <p class="page-subtitle">Управление заказами покупателей</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="exportOrders">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Экспорт
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters-grid">
        <FormInput
          v-model="filters.search"
          placeholder="Поиск по номеру, клиенту, товарам..."
          :clearable="true"
        >
          <template #prefix>
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </FormInput>

        <FormSelect
          v-model="filters.status"
          :options="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="Все статусы"
        />

        <FormSelect
          v-model="filters.paymentStatus"
          :options="paymentStatusOptions"
          value-key="value"
          label-key="label"
          placeholder="Все статусы оплаты"
        />

        <FormSelect
          v-model="filters.dateRange"
          :options="dateRangeOptions"
          value-key="value"
          label-key="label"
          placeholder="За всё время"
        />

        <button class="btn btn-secondary" @click="resetFilters">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Сбросить
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon pending">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">Ожидают обработки</div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon processing">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.processing }}</div>
            <div class="stat-label">В обработке</div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon shipped">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.shipped }}</div>
            <div class="stat-label">Отправлены</div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon revenue">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ formatPrice(stats.revenue) }}</div>
            <div class="stat-label">Выручка за месяц</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <DataTable
      :columns="columns"
      :items="filteredOrders"
      :loading="loading"
      @row-click="viewOrder"
    >
      <template #cell-orderNumber="{ item }">
        <div class="order-number">
          <div class="number">#{{ item.orderNumber }}</div>
          <div class="date">{{ formatDate(item.createdAt) }}</div>
        </div>
      </template>

      <template #cell-customer="{ item }">
        <div class="customer-cell">
          <div class="name">{{ item.customer.name }}</div>
          <div class="email">{{ item.customer.email }}</div>
          <div v-if="item.customer.phone" class="phone">{{ item.customer.phone }}</div>
        </div>
      </template>

      <template #cell-items="{ item }">
        <div class="items-cell">
          <div class="items-count">{{ item.items.length }} товар(ов)</div>
          <div class="items-preview">
            {{ item.items.slice(0, 2).map(i => i.name).join(', ') }}
            <span v-if="item.items.length > 2">...</span>
          </div>
        </div>
      </template>

      <template #cell-total="{ item }">
        <div class="total-cell">
          {{ formatPrice(item.total) }}
        </div>
      </template>

      <template #cell-status="{ item }">
        <span class="status-badge" :class="`status-${item.status}`">
          {{ getStatusLabel(item.status) }}
        </span>
      </template>

      <template #cell-paymentStatus="{ item }">
        <span class="payment-badge" :class="`payment-${item.paymentStatus}`">
          {{ getPaymentStatusLabel(item.paymentStatus) }}
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="actions-cell">
          <button class="btn-icon" @click.stop="viewOrder(item)" title="Просмотр">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button class="btn-icon" @click.stop="updateStatus(item)" title="Изменить статус">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button class="btn-icon" @click.stop="printInvoice(item.id)" title="Печать">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      </template>
    </DataTable>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click="closeOrderModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Заказ #{{ selectedOrder.orderNumber }}</h2>
          <button class="close-btn" @click="closeOrderModal">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Customer Info -->
          <div class="info-section">
            <h3 class="info-title">Информация о клиенте</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Имя:</span>
                <span class="info-value">{{ selectedOrder.customer.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ selectedOrder.customer.email }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Телефон:</span>
                <span class="info-value">{{ selectedOrder.customer.phone }}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="info-section">
            <h3 class="info-title">Адрес доставки</h3>
            <p class="address">{{ formatAddress(selectedOrder.shippingAddress) }}</p>
          </div>

          <!-- Order Items -->
          <div class="info-section">
            <h3 class="info-title">Товары</h3>
            <div class="order-items">
              <div v-for="item in selectedOrder.items" :key="item.id" class="order-item">
                <div class="item-image">
                  <img v-if="item.image" :src="item.image" :alt="item.name" />
                  <div v-else class="no-image">
                    <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div class="item-details">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-sku">Артикул: {{ item.sku }}</div>
                </div>
                <div class="item-quantity">
                  {{ item.quantity }} шт
                </div>
                <div class="item-price">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="info-section">
            <div class="order-summary">
              <div class="summary-row">
                <span>Сумма товаров:</span>
                <span>{{ formatPrice(selectedOrder.subtotal) }}</span>
              </div>
              <div class="summary-row">
                <span>Доставка:</span>
                <span>{{ formatPrice(selectedOrder.deliveryPrice) }}</span>
              </div>
              <div v-if="selectedOrder.discount" class="summary-row discount">
                <span>Скидка:</span>
                <span>-{{ formatPrice(selectedOrder.discount) }}</span>
              </div>
              <div class="summary-row total">
                <span>Итого:</span>
                <span>{{ formatPrice(selectedOrder.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Status Update -->
          <div class="info-section">
            <h3 class="info-title">Управление заказом</h3>
            <div class="form-row">
              <FormSelect
                v-model="selectedOrder.status"
                label="Статус заказа"
                :options="statusOptions"
                value-key="value"
                label-key="label"
              />
              <FormSelect
                v-model="selectedOrder.paymentStatus"
                label="Статус оплаты"
                :options="paymentStatusOptions"
                value-key="value"
                label-key="label"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeOrderModal">Закрыть</button>
          <button class="btn btn-primary" @click="saveOrderChanges">Сохранить изменения</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { success, error } = useToast();

// Data
const loading = ref(false);
const selectedOrder = ref<any>(null);

// Filters
const filters = ref({
  search: '',
  status: '',
  paymentStatus: '',
  dateRange: '',
});

// Filter Options
const statusOptions = ref([
  { value: '', label: 'Все статусы' },
  { value: 'pending', label: 'Ожидает обработки' },
  { value: 'confirmed', label: 'Подтвержден' },
  { value: 'processing', label: 'В обработке' },
  { value: 'shipped', label: 'Отправлен' },
  { value: 'delivered', label: 'Доставлен' },
  { value: 'cancelled', label: 'Отменен' },
]);

const paymentStatusOptions = ref([
  { value: '', label: 'Все статусы оплаты' },
  { value: 'pending', label: 'Ожидает оплаты' },
  { value: 'paid', label: 'Оплачен' },
  { value: 'failed', label: 'Ошибка оплаты' },
  { value: 'refunded', label: 'Возврат' },
]);

const dateRangeOptions = ref([
  { value: '', label: 'За всё время' },
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'quarter', label: 'Квартал' },
  { value: 'year', label: 'Год' },
]);

// Stats
const stats = ref({
  pending: 12,
  processing: 8,
  shipped: 15,
  revenue: 1245000,
});

// Table columns
const columns = [
  { key: 'orderNumber', label: 'Номер заказа', sortable: true },
  { key: 'customer', label: 'Клиент', sortable: false },
  { key: 'items', label: 'Товары', sortable: false },
  { key: 'total', label: 'Сумма', sortable: true, align: 'right' as const },
  { key: 'status', label: 'Статус', sortable: true },
  { key: 'paymentStatus', label: 'Оплата', sortable: true },
  { key: 'actions', label: 'Действия', sortable: false, width: '150px' },
];

// Mock orders data
const orders = ref([
  {
    id: '1',
    orderNumber: '2024-001',
    createdAt: '2024-01-20T10:30:00',
    customer: {
      name: 'Иван Петров',
      email: 'ivan@example.com',
      phone: '+7 (999) 123-45-67',
    },
    items: [
      { id: '1', name: 'Фрезерный станок HAAS VF-2', sku: 'CNC-001', quantity: 1, price: 2500000, image: 'https://via.placeholder.com/60' },
    ],
    subtotal: 2500000,
    deliveryPrice: 50000,
    discount: 0,
    total: 2550000,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: {
      city: 'Москва',
      street: 'ул. Ленина',
      building: '10',
      apartment: '5',
      postalCode: '101000',
    },
  },
  {
    id: '2',
    orderNumber: '2024-002',
    createdAt: '2024-01-21T14:15:00',
    customer: {
      name: 'Анна Смирнова',
      email: 'anna@example.com',
      phone: '+7 (999) 234-56-78',
    },
    items: [
      { id: '2', name: 'Токарный станок 16К20', sku: 'LAT-001', quantity: 1, price: 450000, image: '' },
      { id: '3', name: 'Сверлильный станок 2С132', sku: 'DRL-001', quantity: 1, price: 120000, image: '' },
    ],
    subtotal: 570000,
    deliveryPrice: 30000,
    discount: 10000,
    total: 590000,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      city: 'Санкт-Петербург',
      street: 'Невский проспект',
      building: '25',
      apartment: '',
      postalCode: '190000',
    },
  },
  {
    id: '3',
    orderNumber: '2024-003',
    createdAt: '2024-01-22T09:00:00',
    customer: {
      name: 'ООО "Технопром"',
      email: 'info@tehnoprom.ru',
      phone: '+7 (495) 123-45-67',
    },
    items: [
      { id: '5', name: 'Деревообрабатывающий станок JET', sku: 'WOD-001', quantity: 2, price: 95000, image: '' },
    ],
    subtotal: 190000,
    deliveryPrice: 15000,
    discount: 5000,
    total: 200000,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      city: 'Казань',
      street: 'ул. Баумана',
      building: '15',
      apartment: '',
      postalCode: '420000',
    },
  },
]);

// Computed
const filteredOrders = computed(() => {
  let result = orders.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(search) ||
        o.customer.name.toLowerCase().includes(search) ||
        o.customer.email.toLowerCase().includes(search) ||
        o.items.some((i) => i.name.toLowerCase().includes(search))
    );
  }

  if (filters.value.status) {
    result = result.filter((o) => o.status === filters.value.status);
  }

  if (filters.value.paymentStatus) {
    result = result.filter((o) => o.paymentStatus === filters.value.paymentStatus);
  }

  return result;
});

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    paymentStatus: '',
    dateRange: '',
  };
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const formatAddress = (address: any) => {
  return `${address.postalCode}, ${address.city}, ${address.street}, д. ${address.building}${address.apartment ? ', кв. ' + address.apartment : ''}`;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Ожидает',
    confirmed: 'Подтвержден',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
  };
  return labels[status] || status;
};

const getPaymentStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Ожидает',
    paid: 'Оплачен',
    failed: 'Ошибка',
    refunded: 'Возврат',
  };
  return labels[status] || status;
};

const viewOrder = (order: any) => {
  selectedOrder.value = { ...order };
};

const closeOrderModal = () => {
  selectedOrder.value = null;
};

const saveOrderChanges = async () => {
  try {
    loading.value = true;
    // TODO: API call to update order
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update local data
    const index = orders.value.findIndex((o) => o.id === selectedOrder.value.id);
    if (index !== -1) {
      orders.value[index] = { ...selectedOrder.value };
    }

    success('Заказ успешно обновлен');
    closeOrderModal();
  } catch (err) {
    error('Ошибка при обновлении заказа');
  } finally {
    loading.value = false;
  }
};

const updateStatus = (order: any) => {
  viewOrder(order);
};

const printInvoice = async (orderId: string) => {
  try {
    // TODO: Generate and print invoice
    success('Накладная отправлена на печать');
  } catch (err) {
    error('Ошибка при печати накладной');
  }
};

const exportOrders = async () => {
  try {
    // TODO: Export orders to CSV/Excel
    success('Заказы экспортированы');
  } catch (err) {
    error('Ошибка при экспорте заказов');
  }
};

onMounted(() => {
  // TODO: Fetch orders from API
});
</script>

<style scoped lang="scss">
.admin-orders {
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.filters-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr) auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .icon {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }

  &.pending {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }

  &.processing {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }

  &.shipped {
    background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
  }

  &.revenue {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.order-number {
  .number {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .date {
    font-size: 0.75rem;
    color: #6b7280;
  }
}

.customer-cell {
  .name {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .email,
  .phone {
    font-size: 0.75rem;
    color: #6b7280;
  }
}

.items-cell {
  .items-count {
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .items-preview {
    font-size: 0.75rem;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 300px;
  }
}

.total-cell {
  font-weight: 600;
  color: #111827;
  text-align: right;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;

  &.status-pending {
    background: #fef3c7;
    color: #a16207;
  }

  &.status-confirmed {
    background: #dbeafe;
    color: #1e40af;
  }

  &.status-processing {
    background: #e0e7ff;
    color: #c2410c;
  }

  &.status-shipped {
    background: #e9d5ff;
    color: #ea580c;
  }

  &.status-delivered {
    background: #dcfce7;
    color: #15803d;
  }

  &.status-cancelled {
    background: #fee2e2;
    color: #991b1b;
  }
}

.payment-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;

  &.payment-pending {
    background: #fef3c7;
    color: #a16207;
  }

  &.payment-paid {
    background: #dcfce7;
    color: #15803d;
  }

  &.payment-failed {
    background: #fee2e2;
    color: #991b1b;
  }

  &.payment-refunded {
    background: #f3f4f6;
    color: #6b7280;
  }
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

// Modal styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.close-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.info-section {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .info-label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }

  .info-value {
    font-size: 0.875rem;
    color: #111827;
  }
}

.address {
  font-size: 0.875rem;
  color: #374151;
  margin: 0;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 0.375rem;
  overflow: hidden;
  background: #e5e7eb;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    color: #9ca3af;

    .icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}

.item-details {
  flex: 1;

  .item-name {
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .item-sku {
    font-size: 0.75rem;
    color: #6b7280;
  }
}

.item-quantity {
  font-size: 0.875rem;
  color: #6b7280;
}

.item-price {
  font-weight: 600;
  color: #111827;
  min-width: 120px;
  text-align: right;
}

.order-summary {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: #374151;

  &.discount {
    color: #10b981;
  }

  &.total {
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 2px solid #d1d5db;
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;
  }
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &.btn-primary {
    background: #3b82f6;
    color: white;

    &:hover {
      background: #2563eb;
    }
  }

  &.btn-secondary {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background: #f9fafb;
    }
  }
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
}
</style>
