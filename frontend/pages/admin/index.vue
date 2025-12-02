<template>
  <div class="dashboard">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.id" class="stat-card" :class="`stat-${stat.color}`">
        <div class="stat-icon">
          <component :is="stat.icon" />
        </div>
        <div class="stat-content">
          <p class="stat-label">{{ stat.label }}</p>
          <h3 class="stat-value">{{ stat.value }}</h3>
          <div class="stat-change" :class="stat.change >= 0 ? 'positive' : 'negative'">
            <svg v-if="stat.change >= 0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 13.586V6a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <span>{{ Math.abs(stat.change) }}%</span>
            <span class="stat-period">vs прошлый месяц</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts and Recent Activity -->
    <div class="content-grid">
      <!-- Revenue Chart -->
      <div class="card chart-card">
        <div class="card-header">
          <h3>Продажи за последние 30 дней</h3>
          <select v-model="chartPeriod" class="period-select">
            <option value="7">7 дней</option>
            <option value="30">30 дней</option>
            <option value="90">90 дней</option>
          </select>
        </div>
        <div class="card-body">
          <div class="chart-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p>График продаж</p>
            <p v-if="ordersStats" class="chart-stats">
              Всего заказов: {{ ordersStats.totalOrders || 0 }} |
              Сумма: {{ formatPrice(ordersStats.totalRevenue || 0) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="card">
        <div class="card-header">
          <h3>Последние заказы</h3>
          <NuxtLink to="/admin/orders" class="view-all-link">
            Все заказы
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>
        <div class="card-body">
          <div v-if="loadingOrders" class="loading-state">
            <div class="spinner"></div>
            <p>Загрузка...</p>
          </div>
          <div v-else-if="recentOrders.length === 0" class="empty-state">
            <p>Нет недавних заказов</p>
          </div>
          <div v-else class="orders-list">
            <div v-for="order in recentOrders" :key="order._id" class="order-item">
              <div class="order-info">
                <p class="order-number">#{{ order.orderNumber }}</p>
                <p class="order-customer">
                  {{ order.customer?.name || order.customer?.email || 'Гость' }}
                </p>
              </div>
              <div class="order-meta">
                <span class="order-amount">{{ formatPrice(order.totalAmount || 0) }}</span>
                <span class="order-status" :class="`status-${order.status}`">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CRM Section -->
    <div class="crm-section">
      <div class="card">
        <div class="card-header">
          <h3>Воронка продаж CRM</h3>
          <NuxtLink to="/admin/crm/kanban" class="view-all-link">
            Открыть Канбан
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>
        <div class="card-body">
          <div class="funnel-stages">
            <div
              v-for="(stage, index) in crmStore.salesFunnel"
              :key="stage.id"
              class="funnel-stage-mini"
              :class="`stage-${index + 1}`"
            >
              <div class="stage-label">{{ stage.name }}</div>
              <div class="stage-stats">
                <span class="stage-count">{{ stage.count }}</span>
                <span class="stage-value">{{ formatPrice(stage.value) }}</span>
              </div>
              <div class="stage-bar" :style="{ width: `${(stage.count / Math.max(crmStore.salesFunnel[0]?.count || 1, 1)) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Недавние лиды</h3>
          <NuxtLink to="/admin/crm" class="view-all-link">
            Все лиды
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>
        <div class="card-body">
          <div v-if="recentLeads.length === 0" class="empty-state">
            <p>Нет активных лидов</p>
          </div>
          <div v-else class="leads-list">
            <div v-for="lead in recentLeads" :key="lead.id" class="lead-item">
              <div class="lead-info">
                <div class="lead-avatar">{{ getInitials(lead.name) }}</div>
                <div class="lead-details">
                  <p class="lead-name">{{ lead.name }}</p>
                  <p class="lead-company">{{ lead.company }}</p>
                </div>
              </div>
              <div class="lead-meta">
                <span class="lead-value">{{ formatPrice(lead.dealValue) }}</span>
                <span class="lead-status" :class="`status-${lead.status}`">
                  {{ getLeadStatusLabel(lead.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Products and Reviews -->
    <div class="content-grid">
      <!-- Top Products -->
      <div class="card">
        <div class="card-header">
          <h3>Популярные товары</h3>
          <NuxtLink to="/admin/products" class="view-all-link">
            Все товары
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>
        <div class="card-body">
          <div v-if="loadingProducts" class="loading-state">
            <div class="spinner"></div>
            <p>Загрузка...</p>
          </div>
          <div v-else-if="topProducts.length === 0" class="empty-state">
            <p>Нет товаров</p>
          </div>
          <div v-else class="products-list">
            <div v-for="product in topProducts" :key="product._id" class="product-item">
              <img
                :src="product.images?.[0]?.url || 'https://via.placeholder.com/50'"
                :alt="product.name"
                class="product-image"
              />
              <div class="product-info">
                <p class="product-name">{{ product.name }}</p>
                <p class="product-meta">В наличии: {{ product.stock?.quantity || 0 }}</p>
              </div>
              <div class="product-price">{{ formatPrice(product.price) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card">
        <div class="card-header">
          <h3>Быстрые действия</h3>
        </div>
        <div class="card-body">
          <div class="quick-actions">
            <NuxtLink to="/admin/products/create" class="quick-action">
              <div class="action-icon" style="background: #10b981;">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span>Добавить товар</span>
            </NuxtLink>
            <NuxtLink to="/admin/orders" class="quick-action">
              <div class="action-icon" style="background: #f59e0b;">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span>Заказы</span>
            </NuxtLink>
            <NuxtLink to="/admin/crm" class="quick-action">
              <div class="action-icon" style="background: #3b82f6;">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span>CRM</span>
            </NuxtLink>
            <NuxtLink to="/admin/categories" class="quick-action">
              <div class="action-icon" style="background: #8b5cf6;">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <span>Категории</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCRMStore } from '../../stores/crm';
import { useOrders } from '../../composables/useOrders';
import { useProducts } from '../../composables/useProducts';
import { useUsers } from '../../composables/useUsers';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

useHead({
  title: 'Dashboard - КМО24 Admin',
});

const chartPeriod = ref('30');

// Loading states
const loadingOrders = ref(false);
const loadingProducts = ref(false);
const loadingReviews = ref(false);
const loadingStats = ref(false);

// Data from API
const recentOrders = ref<any[]>([]);
const topProducts = ref<any[]>([]);
const recentReviews = ref<any[]>([]);
const ordersStats = ref<any>(null);
const usersStats = ref<any>(null);
const productsStats = ref<any>(null);

// Import CRM store
const crmStore = useCRMStore();

// Composables
const { getOrders, getOrderStats } = useOrders();
const { getProducts, getProductStats } = useProducts();
const { getUserStats } = useUsers();

// Stats with real data
const stats = computed(() => {
  const orderStats = ordersStats.value || {};
  const userStats = usersStats.value || {};
  const productStats = productsStats.value || {};

  return [
    {
      id: 1,
      label: 'Всего заказов',
      value: String(orderStats.totalOrders || 0),
      change: orderStats.monthlyGrowth || 0,
      color: 'orange',
      icon: 'IconOrders',
    },
    {
      id: 2,
      label: 'Выручка',
      value: formatShortPrice(orderStats.totalRevenue || 0),
      change: orderStats.revenueGrowth || 0,
      color: 'green',
      icon: 'IconRevenue',
    },
    {
      id: 3,
      label: 'Пользователи',
      value: String(userStats.totalUsers || 0),
      change: userStats.monthlyGrowth || 0,
      color: 'blue',
      icon: 'IconUsers',
    },
    {
      id: 4,
      label: 'Товары',
      value: String(productStats.totalProducts || 0),
      change: productStats.activeGrowth || 0,
      color: 'purple',
      icon: 'IconProducts',
    },
  ];
});

// Recent leads from CRM
const recentLeads = computed(() => {
  return [...crmStore.leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    fetchOrders(),
    fetchProducts(),
    fetchReviews(),
    fetchStats(),
  ]);
});

// Fetch functions
async function fetchOrders() {
  loadingOrders.value = true;
  try {
    const response = await getOrders({
      page: 1,
      limit: 5,
      sort: '-createdAt', // Using '-' for descending sort
    });

    if (response.success && response.data) {
      recentOrders.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loadingOrders.value = false;
  }
}

async function fetchProducts() {
  loadingProducts.value = true;
  try {
    const response = await getProducts({
      page: 1,
      limit: 4,
      sort: '-createdAt',
      isActive: true,
    });

    if (response.success && response.data) {
      topProducts.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loadingProducts.value = false;
  }
}

// Reviews module removed - функция оставлена для обратной совместимости
async function fetchReviews() {
  loadingReviews.value = false;
  recentReviews.value = [];
}

async function fetchStats() {
  loadingStats.value = true;
  try {
    const [ordersStatsRes, usersStatsRes, productsStatsRes] = await Promise.all([
      getOrderStats(),
      getUserStats(),
      getProductStats(),
    ]);

    if (ordersStatsRes.success) {
      ordersStats.value = ordersStatsRes.data;
    }

    if (usersStatsRes.success) {
      usersStats.value = usersStatsRes.data;
    }

    if (productsStatsRes.success) {
      productsStats.value = productsStatsRes.data;
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  } finally {
    loadingStats.value = false;
  }
}

// Helper functions
function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
}

function formatShortPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M ₽`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K ₽`;
  }
  return formatPrice(price);
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'Ожидает',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    completed: 'Завершен',
    cancelled: 'Отменен',
  };
  return labels[status] || status;
}

function getLeadStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: 'Новый',
    contacted: 'Контакт',
    qualified: 'Квалифицирован',
    proposal: 'Предложение',
    negotiation: 'Переговоры',
    won: 'Успешно',
    lost: 'Потерян',
  };
  return labels[status] || status;
}

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
</script>

<style scoped lang="scss">
.dashboard {
  padding: $spacing-md;
}

// Stats Grid
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

.stat-card {
  background: $white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  gap: $spacing-md;
  transition: all $transition-base;
  border: 1px solid $gray-200;

  &:hover {
    box-shadow: $shadow-lg;
    transform: translateY(-2px);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &.stat-orange .stat-icon {
    background: rgba($warning, 0.1);
    color: $warning;
  }

  &.stat-green .stat-icon {
    background: rgba($success, 0.1);
    color: $success;
  }

  &.stat-blue .stat-icon {
    background: rgba($primary, 0.1);
    color: $primary;
  }

  &.stat-purple .stat-icon {
    background: rgba($info, 0.1);
    color: $info;
  }

  .stat-content {
    flex: 1;

    .stat-label {
      font-size: $font-size-sm;
      color: $gray-600;
      margin-bottom: $spacing-xs;
    }

    .stat-value {
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
      color: $gray-900;
      margin: 0 0 $spacing-xs;
    }

    .stat-change {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      font-size: $font-size-sm;

      &.positive {
        color: $success;
      }

      &.negative {
        color: $danger;
      }

      svg {
        width: 16px;
        height: 16px;
      }

      .stat-period {
        color: $gray-500;
        margin-left: $spacing-xs;
      }
    }
  }
}

// Content Grid
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

// Card Component
.card {
  background: $white;
  border-radius: $radius-lg;
  border: 1px solid $gray-200;
  overflow: hidden;

  .card-header {
    padding: $spacing-lg;
    border-bottom: 1px solid $gray-200;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0;
    }

    .view-all-link {
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      color: $primary;
      text-decoration: none;
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      transition: color $transition-base;

      &:hover {
        color: darken($primary, 10%);
      }

      svg {
        width: 16px;
        height: 16px;
      }
    }

    .period-select {
      padding: $spacing-xs $spacing-sm;
      border: 1px solid $gray-300;
      border-radius: $radius-md;
      font-size: $font-size-sm;
      color: $gray-700;
      background: $white;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: $primary;
      }
    }
  }

  .card-body {
    padding: $spacing-lg;
  }
}

// Chart Card
.chart-card {
  grid-column: span 2;

  @media (max-width: 900px) {
    grid-column: span 1;
  }
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  color: $gray-400;

  svg {
    width: 48px;
    height: 48px;
  }

  p {
    margin: 0;
    font-size: $font-size-sm;
  }

  .chart-stats {
    color: $gray-600;
    font-weight: $font-weight-medium;
  }
}

// Loading & Empty States
.loading-state,
.empty-state {
  padding: $spacing-xl;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  color: $gray-500;

  p {
    margin: 0;
    font-size: $font-size-sm;
  }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid $gray-300;
  border-top-color: $primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Orders List
.orders-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  background: $gray-50;
  border-radius: $radius-md;
  transition: background $transition-base;

  &:hover {
    background: $gray-100;
  }

  .order-info {
    .order-number {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0 0 $spacing-xs;
    }

    .order-customer {
      font-size: $font-size-sm;
      color: $gray-600;
      margin: 0;
    }
  }

  .order-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-xs;

    .order-amount {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $gray-900;
    }

    .order-status {
      padding: 2px 8px;
      border-radius: $radius-sm;
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;

      &.status-pending {
        background: rgba($warning, 0.1);
        color: $warning;
      }

      &.status-processing {
        background: rgba($info, 0.1);
        color: $info;
      }

      &.status-shipped {
        background: rgba($info, 0.1);
        color: $info;
      }

      &.status-delivered,
      &.status-completed {
        background: rgba($success, 0.1);
        color: $success;
      }

      &.status-cancelled {
        background: rgba($danger, 0.1);
        color: $danger;
      }
    }
  }
}

// Products List
.products-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.product-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm;
  border-radius: $radius-md;
  transition: background $transition-base;

  &:hover {
    background: $gray-50;
  }

  .product-image {
    width: 40px;
    height: 40px;
    border-radius: $radius-sm;
    object-fit: cover;
    background: $gray-100;
  }

  .product-info {
    flex: 1;

    .product-name {
      font-size: $font-size-sm;
      font-weight: $font-weight-medium;
      color: $gray-900;
      margin: 0 0 2px;
    }

    .product-meta {
      font-size: $font-size-xs;
      color: $gray-600;
      margin: 0;
    }
  }

  .product-price {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $primary;
  }
}

// CRM Section
.crm-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
}

// Funnel Stages
.funnel-stages {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.funnel-stage-mini {
  position: relative;
  padding: $spacing-md;
  background: $gray-50;
  border-radius: $radius-md;

  .stage-label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-700;
    margin-bottom: $spacing-xs;
  }

  .stage-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;

    .stage-count {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $gray-900;
    }

    .stage-value {
      font-size: $font-size-sm;
      color: $gray-600;
    }
  }

  .stage-bar {
    height: 4px;
    background: $primary;
    border-radius: 2px;
    transition: width $transition-base;
  }

  &.stage-1 .stage-bar {
    background: $info;
  }

  &.stage-2 .stage-bar {
    background: $info;
  }

  &.stage-3 .stage-bar {
    background: $warning;
  }

  &.stage-4 .stage-bar {
    background: $success;
  }
}

// Leads List
.leads-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.lead-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-md;
  background: $gray-50;
  border-radius: $radius-md;
  transition: background $transition-base;

  &:hover {
    background: $gray-100;
  }

  .lead-info {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    .lead-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, $primary, $secondary);
      color: $white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-sm;
      font-weight: $font-weight-bold;
    }

    .lead-details {
      .lead-name {
        font-size: $font-size-sm;
        font-weight: $font-weight-medium;
        color: $gray-900;
        margin: 0 0 2px;
      }

      .lead-company {
        font-size: $font-size-xs;
        color: $gray-600;
        margin: 0;
      }
    }
  }

  .lead-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: $spacing-xs;

    .lead-value {
      font-size: $font-size-sm;
      font-weight: $font-weight-semibold;
      color: $gray-900;
    }

    .lead-status {
      padding: 2px 8px;
      border-radius: $radius-sm;
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;

      &.status-new {
        background: rgba($info, 0.1);
        color: $info;
      }

      &.status-contacted,
      &.status-qualified {
        background: rgba($info, 0.1);
        color: $info;
      }

      &.status-proposal,
      &.status-negotiation {
        background: rgba($warning, 0.1);
        color: $warning;
      }

      &.status-won {
        background: rgba($success, 0.1);
        color: $success;
      }

      &.status-lost {
        background: rgba($danger, 0.1);
        color: $danger;
      }
    }
  }
}

// Quick Actions
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.quick-action {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $gray-50;
  border-radius: $radius-md;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: $gray-100;
    transform: translateY(-2px);
  }

  .action-icon {
    width: 40px;
    height: 40px;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
      color: $white;
    }
  }

  span {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-900;
  }
}
</style>