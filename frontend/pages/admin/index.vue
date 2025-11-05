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
            <p>График продаж (интеграция с Chart.js)</p>
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
            <div v-for="order in recentOrders" :key="order.id" class="order-item">
              <div class="order-info">
                <p class="order-number">#{{ order.orderNumber }}</p>
                <p class="order-customer">{{ order.customer }}</p>
              </div>
              <div class="order-meta">
                <span class="order-amount">{{ formatPrice(order.total) }}</span>
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
              <div class="stage-bar" :style="{ width: `${(stage.count / crmStore.salesFunnel[0].count) * 100}%` }"></div>
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
          <div class="leads-list">
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
          <div class="products-list">
            <div v-for="product in topProducts" :key="product.id" class="product-item">
              <img :src="product.image" :alt="product.name" class="product-image" />
              <div class="product-info">
                <p class="product-name">{{ product.name }}</p>
                <p class="product-meta">{{ product.sales }} продаж</p>
              </div>
              <div class="product-price">{{ formatPrice(product.price) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reviews -->
      <div class="card">
        <div class="card-header">
          <h3>Недавние отзывы</h3>
          <NuxtLink to="/admin/reviews" class="view-all-link">
            Все отзывы
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </NuxtLink>
        </div>
        <div class="card-body">
          <div class="reviews-list">
            <div v-for="review in recentReviews" :key="review.id" class="review-item">
              <div class="review-header">
                <div class="review-author">
                  <div class="author-avatar">{{ getInitials(review.author) }}</div>
                  <div>
                    <p class="author-name">{{ review.author }}</p>
                    <div class="review-rating">
                      <svg
                        v-for="star in 5"
                        :key="star"
                        :class="{ filled: star <= review.rating }"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <span class="review-status" :class="`status-${review.status}`">
                  {{ review.status === 'pending' ? 'На модерации' : 'Одобрен' }}
                </span>
              </div>
              <p class="review-text">{{ review.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCRMStore } from '~/stores/crm';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

useHead({
  title: 'Dashboard - КМО24 Admin',
});

const chartPeriod = ref('30');
const loadingOrders = ref(false);

// Import CRM store
const crmStore = useCRMStore();

// Stats with CRM data
const stats = computed(() => [
  {
    id: 1,
    label: 'Активные сделки',
    value: String(crmStore.activeDeals),
    change: 12.5,
    color: 'blue',
    icon: 'IconOrders',
  },
  {
    id: 2,
    label: 'Сумма сделок',
    value: formatPrice(crmStore.totalValue),
    change: 23.0,
    color: 'green',
    icon: 'IconRevenue',
  },
  {
    id: 3,
    label: 'Всего лидов',
    value: String(crmStore.totalLeads),
    change: 15.2,
    color: 'purple',
    icon: 'IconUsers',
  },
  {
    id: 4,
    label: 'Конверсия',
    value: `${crmStore.conversionRate}%`,
    change: 5.0,
    color: 'orange',
    icon: 'IconProducts',
  },
]);

const recentOrders = ref([
  { id: 1, orderNumber: 'ORD-2024-001', customer: 'Иван Петров', total: 125000, status: 'pending' },
  { id: 2, orderNumber: 'ORD-2024-002', customer: 'Мария Сидорова', total: 89500, status: 'processing' },
  { id: 3, orderNumber: 'ORD-2024-003', customer: 'Алексей Иванов', total: 245000, status: 'completed' },
  { id: 4, orderNumber: 'ORD-2024-004', customer: 'Елена Смирнова', total: 67000, status: 'pending' },
  { id: 5, orderNumber: 'ORD-2024-005', customer: 'Дмитрий Козлов', total: 156000, status: 'shipped' },
]);

const topProducts = ref([
  { id: 1, name: 'Печь конвекционная', image: 'https://via.placeholder.com/50', sales: 45, price: 125000 },
  { id: 2, name: 'Холодильник витринный', image: 'https://via.placeholder.com/50', sales: 38, price: 89000 },
  { id: 3, name: 'Тестомес спиральный', image: 'https://via.placeholder.com/50', sales: 32, price: 215000 },
  { id: 4, name: 'Плита индукционная', image: 'https://via.placeholder.com/50', sales: 28, price: 67000 },
]);

const recentReviews = ref([
  { id: 1, author: 'Иван Петров', rating: 5, text: 'Отличное оборудование! Работает как новое.', status: 'approved' },
  { id: 2, author: 'Мария Сидорова', rating: 4, text: 'Хорошее качество, быстрая доставка.', status: 'pending' },
  { id: 3, author: 'Алексей Иванов', rating: 5, text: 'Рекомендую! Профессиональный подход.', status: 'approved' },
]);

// Recent leads from CRM
const recentLeads = computed(() => {
  return [...crmStore.leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
});

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Ожидает',
    processing: 'В обработке',
    completed: 'Выполнен',
    shipped: 'Отправлен',
    cancelled: 'Отменен',
  };
  return labels[status] || status;
};

const getLeadStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    new: 'Новый',
    contacted: 'Контакт',
    qualified: 'Квалифицирован',
    proposal: 'Предложение',
    negotiation: 'Переговоры',
    won: 'Успех',
    lost: 'Проигран',
  };
  return labels[status] || status;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
</script>

<style scoped lang="scss">
.dashboard {
  max-width: 1600px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  border-left: 4px solid;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  &.stat-blue {
    border-left-color: #3b82f6;
    .stat-icon {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }
  }

  &.stat-green {
    border-left-color: #10b981;
    .stat-icon {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }
  }

  &.stat-purple {
    border-left-color: #f59e0be6;
    .stat-icon {
      background: rgba(139, 92, 246, 0.1);
      color: #f59e0be6;
    }
  }

  &.stat-orange {
    border-left-color: #f59e0be6;
    .stat-icon {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0be6;
    }
  }
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }

  .stat-period {
    color: #6b7280;
    margin-left: 0.25rem;
  }
}

// CRM Section
.crm-section {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
}

.funnel-stages {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.funnel-stage-mini {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  border-left: 4px solid;
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.stage-1 { border-left-color: #3b82f6; }
  &.stage-2 { border-left-color: #f59e0be6; }
  &.stage-3 { border-left-color: #f59e0be6; }
  &.stage-4 { border-left-color: #fbbf24; }
  &.stage-5 { border-left-color: #a855f7; }
  &.stage-6 { border-left-color: #10b981; }
}

.stage-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.stage-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stage-count {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.stage-value {
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 600;
}

.stage-bar {
  height: 6px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.leads-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lead-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    transform: translateX(4px);
  }
}

.lead-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.lead-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.lead-details {
  flex: 1;
  min-width: 0;
}

.lead-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
  margin: 0 0 0.125rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lead-company {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lead-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
}

.lead-value {
  font-weight: 700;
  color: #10b981;
  font-size: 0.875rem;
  white-space: nowrap;
}

.lead-status {
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  white-space: nowrap;

  &.status-new { background: #dbeafe; color: #1e40af; }
  &.status-contacted { background: #e0e7ff; color: #4338ca; }
  &.status-qualified { background: #fef3c7; color: #92400e; }
  &.status-proposal { background: #fce7f3; color: #9f1239; }
  &.status-negotiation { background: #f3e8ff; color: #6b21a8; }
  &.status-won { background: #d1fae5; color: #065f46; }
  &.status-lost { background: #fee2e2; color: #991b1b; }
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &.chart-card {
    grid-column: 1 / -1;
  }
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
}

.period-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
}

.card-body {
  padding: 1.5rem;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #9ca3af;

  svg {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
}

.orders-list,
.products-list,
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
}

.order-number {
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.order-customer {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.order-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.order-amount {
  font-weight: 600;
  color: #111827;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  &.status-pending {
    background: #fef3c7;
    color: #92400e;
  }

  &.status-processing {
    background: #dbeafe;
    color: #1e40af;
  }

  &.status-completed {
    background: #d1fae5;
    color: #065f46;
  }

  &.status-shipped {
    background: #e0e7ff;
    color: #3730a3;
  }
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }
}

.product-image {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.product-meta {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.product-price {
  font-weight: 600;
  color: #111827;
}

.review-item {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.author-name {
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.review-rating {
  display: flex;
  gap: 0.125rem;

  svg {
    width: 1rem;
    height: 1rem;
    color: #d1d5db;

    &.filled {
      color: #fbbf24;
    }
  }
}

.review-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  &.status-pending {
    background: #fef3c7;
    color: #92400e;
  }

  &.status-approved {
    background: #d1fae5;
    color: #065f46;
  }
}

.review-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #9ca3af;

  .spinner {
    width: 2rem;
    height: 2rem;
    border: 3px solid #e5e7eb;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
