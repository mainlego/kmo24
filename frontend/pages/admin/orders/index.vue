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
        <AdminFormInput
          v-model="filters.search"
          placeholder="Поиск по номеру, клиенту, товарам..."
          :clearable="true"
        >
          <template #prefix>
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </AdminFormInput>

        <AdminFormSelect
          v-model="filters.status"
          :options="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="Все статусы"
        />

        <AdminFormSelect
          v-model="filters.paymentStatus"
          :options="paymentStatusOptions"
          value-key="value"
          label-key="label"
          placeholder="Все статусы оплаты"
        />

        <AdminFormSelect
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
    <AdminDataTable
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
          <div class="name">{{ item.customer.firstName }} {{ item.customer.lastName }}</div>
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
          {{ formatPrice(item.pricing?.total || 0) }}
        </div>
      </template>

      <template #cell-status="{ item }">
        <span class="status-badge" :class="`status-${item.status}`">
          {{ getStatusLabel(item.status) }}
        </span>
      </template>

      <template #cell-paymentStatus="{ item }">
        <span class="payment-badge" :class="`payment-${item.payment?.status}`">
          {{ getPaymentStatusLabel(item.payment?.status) }}
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
          <button class="btn-icon" @click.stop="printInvoice(item._id)" title="Печать">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      </template>
    </AdminDataTable>

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
                <span class="info-value">{{ selectedOrder.customer.firstName }} {{ selectedOrder.customer.lastName }}</span>
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
                  <img v-if="item.image" :src="getProductImageUrl(item.image)" :alt="item.name" />
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
                <span>{{ formatPrice(selectedOrder.pricing?.subtotal || 0) }}</span>
              </div>
              <div class="summary-row">
                <span>Доставка:</span>
                <span>{{ formatPrice(selectedOrder.pricing?.shipping || 0) }}</span>
              </div>
              <div v-if="selectedOrder.pricing?.discount" class="summary-row discount">
                <span>Скидка:</span>
                <span>-{{ formatPrice(selectedOrder.pricing.discount) }}</span>
              </div>
              <div class="summary-row total">
                <span>Итого:</span>
                <span>{{ formatPrice(selectedOrder.pricing?.total || 0) }}</span>
              </div>
            </div>
          </div>

          <!-- Status Update -->
          <div class="info-section">
            <h3 class="info-title">Управление заказом</h3>
            <div class="form-row">
              <AdminFormSelect
                v-model="selectedOrder.status"
                label="Статус заказа"
                :options="statusOptions"
                value-key="value"
                label-key="label"
              />
              <AdminFormSelect
                v-model="selectedOrder.payment.status"
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
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from '../../../composables/useToast';
import { useOrders } from '../../../composables/useOrders';
import { useMediaUrl } from '../../../composables/useMediaUrl';

const { getProductImageUrl } = useMediaUrl();
import type { Order } from '../../../composables/useOrders';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

// Composables
const { success: showSuccess, error: showError } = useToast();
const { getOrders, updateOrder, getOrderStats } = useOrders();

// Data
const loading = ref(false);
const selectedOrder = ref<Order | null>(null);
const orders = ref<Order[]>([]);
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
});

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
  pending: 0,
  processing: 0,
  shipped: 0,
  revenue: 0,
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

// Functions for fetching data
const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await getOrders({
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...filters.value,
    });

    if (response.success && response.data) {
      orders.value = response.data;
      // Обновляем только total и pages, не трогая page чтобы избежать цикла watch
      const newPagination = response.pagination || {
        page: pagination.value.page,
        limit: 20,
        total: response.data.length,
        pages: Math.ceil(response.data.length / 20),
      };
      pagination.value.total = newPagination.total;
      pagination.value.pages = newPagination.pages;
      pagination.value.limit = newPagination.limit;
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    showError('Ошибка при загрузке заказов');
  } finally {
    loading.value = false;
  }
};

const fetchStats = async () => {
  try {
    const response = await getOrderStats();
    console.log('Order stats response:', response);

    // Обрабатываем разные форматы ответа
    const data = response?.data || response;

    if (data) {
      stats.value = {
        pending: data.pending || data.pendingOrders || 0,
        processing: data.processing || data.processingOrders || 0,
        shipped: data.shipped || data.shippedOrders || 0,
        revenue: data.revenue || data.totalRevenue || 0,
      };
      console.log('Updated stats:', stats.value);
    }
  } catch (error) {
    console.error('Error fetching order stats:', error);
  }
};

// Computed
const filteredOrders = computed(() => {
  let result = orders.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(search) ||
        `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(search) ||
        o.customer.email.toLowerCase().includes(search) ||
        o.items.some((i) => {
          // Check if product is populated object or just ID string
          if (!i.product || typeof i.product === 'string') return false;
          // Now TypeScript knows i.product is an object
          const product = i.product as any;
          if ('name' in product) {
            return product.name.toLowerCase().includes(search);
          }
          return false;
        })
    );
  }

  if (filters.value.status) {
    result = result.filter((o) => o.status === filters.value.status);
  }

  if (filters.value.paymentStatus) {
    result = result.filter((o) => o.payment.status === filters.value.paymentStatus);
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
    const { apiFetch } = useApi();

    // Update order status
    await apiFetch(`/orders/${selectedOrder.value._id}/status`, {
      method: 'PATCH',
      body: { status: selectedOrder.value.status },
    });

    // Update payment status if changed
    await apiFetch(`/orders/${selectedOrder.value._id}/payment`, {
      method: 'PATCH',
      body: { status: selectedOrder.value.payment.status },
    });

    // Update local data
    const index = orders.value.findIndex((o) => o._id === selectedOrder.value._id);
    if (index !== -1) {
      orders.value[index] = { ...selectedOrder.value };
    }

    showSuccess('Заказ успешно обновлен');
    closeOrderModal();
  } catch {
    showError('Ошибка при обновлении заказа');
  } finally {
    loading.value = false;
  }
};

const updateStatus = (order: any) => {
  viewOrder(order);
};

const printInvoice = async (orderId: string) => {
  // Находим заказ по ID
  const order = orders.value.find(o => o._id === orderId);
  if (!order) {
    showError('Заказ не найден');
    return;
  }

  // Формируем HTML для печати
  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Заказ #${order.orderNumber}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #f59e0b; }
        .logo span { color: #333; }
        .order-info { text-align: right; }
        .order-number { font-size: 24px; font-weight: bold; color: #333; }
        .order-date { color: #666; margin-top: 5px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .info-block p { margin: 5px 0; }
        .info-block strong { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #dee2e6; }
        td { padding: 12px; border-bottom: 1px solid #eee; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .summary { margin-top: 20px; margin-left: auto; width: 300px; }
        .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .summary-row.total { font-size: 18px; font-weight: bold; border-bottom: none; border-top: 2px solid #333; margin-top: 10px; padding-top: 15px; }
        .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-confirmed { background: #d1fae5; color: #065f46; }
        .status-processing { background: #dbeafe; color: #1e40af; }
        .status-shipped { background: #e0e7ff; color: #3730a3; }
        .status-delivered { background: #d1fae5; color: #065f46; }
        .status-cancelled { background: #fee2e2; color: #991b1b; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">КМО<span>24</span></div>
        <div class="order-info">
          <div class="order-number">Заказ #${order.orderNumber}</div>
          <div class="order-date">${formatDate(order.createdAt)}</div>
          <div style="margin-top: 10px;">
            <span class="status status-${order.status}">${getStatusLabel(order.status)}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Информация о заказе</div>
        <div class="info-grid">
          <div class="info-block">
            <p><strong>Покупатель:</strong></p>
            <p>${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</p>
            <p>${order.customer?.email || ''}</p>
            <p>${order.customer?.phone || ''}</p>
          </div>
          <div class="info-block">
            <p><strong>Адрес доставки:</strong></p>
            <p>${formatAddress(order.shippingAddress)}</p>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Товары</div>
        <table>
          <thead>
            <tr>
              <th>Наименование</th>
              <th>Артикул</th>
              <th class="text-center">Кол-во</th>
              <th class="text-right">Цена</th>
              <th class="text-right">Сумма</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map((item: any) => `
              <tr>
                <td>${item.name || 'Товар'}</td>
                <td>${item.sku || '—'}</td>
                <td class="text-center">${item.quantity || 1}</td>
                <td class="text-right">${formatPrice(item.price || 0)}</td>
                <td class="text-right">${formatPrice((item.price || 0) * (item.quantity || 1))}</td>
              </tr>
            `).join('') || ''}
          </tbody>
        </table>
      </div>

      <div class="summary">
        <div class="summary-row">
          <span>Сумма товаров:</span>
          <span>${formatPrice(order.pricing?.subtotal || 0)}</span>
        </div>
        <div class="summary-row">
          <span>Доставка:</span>
          <span>${formatPrice(order.pricing?.shipping || order.shipping?.cost || 0)}</span>
        </div>
        ${order.pricing?.discount ? `
          <div class="summary-row">
            <span>Скидка:</span>
            <span>-${formatPrice(order.pricing.discount)}</span>
          </div>
        ` : ''}
        <div class="summary-row total">
          <span>Итого к оплате:</span>
          <span>${formatPrice(order.pricing?.total || 0)}</span>
        </div>
      </div>

      <div class="footer">
        <p>Документ сформирован ${new Date().toLocaleString('ru-RU')}</p>
        <p>КМО24 - Промышленное оборудование | kmo24.ru</p>
      </div>
    </body>
    </html>
  `;

  // Открываем окно печати
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  } else {
    showError('Не удалось открыть окно печати. Проверьте блокировщик всплывающих окон.');
  }
};

const exportOrders = async () => {
  try {
    // Экспорт заказов в CSV
    const csvContent = orders.value.map(order => {
      return [
        order.orderNumber,
        `${order.customer.firstName} ${order.customer.lastName}`,
        order.customer.email,
        order.items.reduce((sum: number, item: any) => sum + item.total, 0),
        getStatusLabel(order.status),
        formatDate(order.createdAt),
      ].join(',');
    });

    const header = 'Номер,Клиент,Email,Сумма,Статус,Дата';
    const csv = [header, ...csvContent].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showSuccess('Заказы экспортированы');
  } catch {
    showError('Ошибка при экспорте заказов');
  }
};

onMounted(async () => {
  await Promise.all([
    fetchOrders(),
    fetchStats(),
  ]);
});

// Watch for filter changes
watch(
  [
    () => filters.value.search,
    () => filters.value.status,
    () => filters.value.paymentStatus,
    () => filters.value.dateRange,
  ],
  () => {
    // При изменении фильтров сбрасываем на первую страницу
    pagination.value.page = 1;
    fetchOrders();
  }
);

// Watch for page changes
watch(
  () => pagination.value.page,
  (newPage, oldPage) => {
    if (newPage !== oldPage) {
      fetchOrders();
    }
  }
);
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
    background: linear-gradient(135deg, #f59e0be6 0%, #d97706 100%);
  }

  &.processing {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  }

  &.shipped {
    background: linear-gradient(135deg, #f59e0be6 0%, #fbbf24 100%);
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
    color: #fbbf24;
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
