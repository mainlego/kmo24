<template>
  <div class="crm-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">CRM - Управление клиентами</h1>
        <p class="page-subtitle">Отслеживание лидов и сделок</p>
      </div>
      <div class="header-actions">
        <NuxtLink to="/admin/crm/kanban" class="btn btn-secondary">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          Канбан
        </NuxtLink>
        <button class="btn btn-primary" @click="openLeadModal">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Новый лид
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card stat-blue">
        <div class="stat-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalLeads }}</div>
          <div class="stat-label">Всего лидов</div>
          <div class="stat-trend positive">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            +12% за месяц
          </div>
        </div>
      </div>

      <div class="stat-card stat-green">
        <div class="stat-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.activeDeals }}</div>
          <div class="stat-label">Активные сделки</div>
          <div class="stat-trend positive">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            +8% за месяц
          </div>
        </div>
      </div>

      <div class="stat-card stat-yellow">
        <div class="stat-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatCurrency(stats.totalValue) }}</div>
          <div class="stat-label">Сумма сделок</div>
          <div class="stat-trend positive">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            +23% за месяц
          </div>
        </div>
      </div>

      <div class="stat-card stat-purple">
        <div class="stat-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.conversionRate }}%</div>
          <div class="stat-label">Конверсия</div>
          <div class="stat-trend positive">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            +5% за месяц
          </div>
        </div>
      </div>
    </div>

    <!-- Sales Funnel -->
    <div class="funnel-section">
      <h2 class="section-title">Воронка продаж</h2>
      <div class="funnel-container">
        <div
          v-for="(stage, index) in salesFunnel"
          :key="stage.id"
          class="funnel-stage"
          :class="`stage-${index + 1}`"
          :style="{ width: `${100 - index * 15}%` }"
        >
          <div class="stage-header">
            <div class="stage-info">
              <h3 class="stage-name">{{ stage.name }}</h3>
              <p class="stage-count">{{ stage.count }} лидов</p>
            </div>
            <div class="stage-value">{{ formatCurrency(stage.value) }}</div>
          </div>
          <div class="stage-progress">
            <div
              class="stage-progress-bar"
              :style="{ width: `${(stage.count / salesFunnel[0].count) * 100}%` }"
            ></div>
          </div>
          <div class="stage-conversion">
            Конверсия: {{ index > 0 ? Math.round((stage.count / salesFunnel[index - 1].count) * 100) : 100 }}%
          </div>
        </div>
      </div>
    </div>

    <!-- Leads Table -->
    <div class="leads-section">
      <div class="section-header">
        <h2 class="section-title">Лиды</h2>
        <div class="section-controls">
          <div class="search-box">
            <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по имени, компании, телефону..."
              class="search-input"
            />
          </div>
          <select v-model="statusFilter" class="status-filter">
            <option value="">Все статусы</option>
            <option value="new">Новый</option>
            <option value="contacted">Контакт установлен</option>
            <option value="qualified">Квалифицирован</option>
            <option value="proposal">Предложение</option>
            <option value="negotiation">Переговоры</option>
            <option value="won">Успех</option>
            <option value="lost">Проигран</option>
          </select>
        </div>
      </div>

      <div class="leads-table-container">
        <table class="leads-table">
          <thead>
            <tr>
              <th>Клиент</th>
              <th>Компания</th>
              <th>Контакты</th>
              <th>Сумма сделки</th>
              <th>Статус</th>
              <th>Ответственный</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in filteredLeads" :key="lead.id" class="lead-row">
              <td>
                <div class="lead-client">
                  <div class="client-avatar">{{ getInitials(lead.name) }}</div>
                  <div class="client-info">
                    <div class="client-name">{{ lead.name }}</div>
                    <div class="client-email">{{ lead.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="company-name">{{ lead.company }}</div>
                <div class="company-type">{{ lead.companyType }}</div>
              </td>
              <td>
                <div class="contact-info">
                  <div class="contact-item">
                    <svg class="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {{ lead.phone }}
                  </div>
                </div>
              </td>
              <td>
                <div class="deal-value">{{ formatCurrency(lead.dealValue) }}</div>
              </td>
              <td>
                <span class="status-badge" :class="`status-${lead.status}`">
                  {{ getStatusLabel(lead.status) }}
                </span>
              </td>
              <td>
                <div class="manager-info">
                  <div class="manager-avatar">{{ getInitials(lead.manager) }}</div>
                  <span class="manager-name">{{ lead.manager }}</span>
                </div>
              </td>
              <td>
                <div class="date-info">
                  <div class="date">{{ formatDate(lead.createdAt) }}</div>
                  <div class="time-ago">{{ getTimeAgo(lead.createdAt) }}</div>
                </div>
              </td>
              <td>
                <div class="actions">
                  <button class="action-btn" @click="editLead(lead)" title="Редактировать">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button class="action-btn" @click="viewLeadDetails(lead)" title="Подробнее">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button class="action-btn action-danger" @click="deleteLead(lead)" title="Удалить">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredLeads.length === 0" class="empty-state">
          <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>Лиды не найдены</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button class="pagination-btn" :disabled="currentPage === 1">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="pagination-info">
          Страница {{ currentPage }} из {{ totalPages }}
        </div>
        <button class="pagination-btn" :disabled="currentPage === totalPages">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCRMStore } from '~/stores/crm';
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const crmStore = useCRMStore();
const { success, error } = useToast();

// Data
const searchQuery = ref('');
const statusFilter = ref('');
const showFilters = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

// Stats from store
const stats = computed(() => ({
  totalLeads: crmStore.totalLeads,
  activeDeals: crmStore.activeDeals,
  totalValue: crmStore.totalValue,
  conversionRate: crmStore.conversionRate,
}));

// Sales Funnel from store
const salesFunnel = computed(() => crmStore.salesFunnel);

// Computed
const filteredLeads = computed(() => {
  let result = [...crmStore.leads];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (lead) =>
        lead.name.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        lead.email.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    result = result.filter((lead) => lead.status === statusFilter.value);
  }

  return result;
});

const totalPages = computed(() => Math.ceil(filteredLeads.value.length / itemsPerPage));

// Methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Сегодня';
  if (diffInDays === 1) return 'Вчера';
  if (diffInDays < 7) return `${diffInDays} дн. назад`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} нед. назад`;
  return `${Math.floor(diffInDays / 30)} мес. назад`;
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getStatusLabel = (status: string) => {
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

const openLeadModal = () => {
  success('Открытие формы создания лида');
};

const editLead = (lead: any) => {
  success(`Редактирование лида: ${lead.name}`);
};

const viewLeadDetails = (lead: any) => {
  success(`Просмотр деталей лида: ${lead.name}`);
};

const deleteLead = (lead: any) => {
  if (confirm(`Удалить лида "${lead.name}"?`)) {
    crmStore.deleteLead(lead.id);
    success('Лид успешно удален');
  }
};
</script>

<style scoped lang="scss">
.crm-page {
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

// Stats Grid
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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.stat-blue .stat-icon {
    background: #dbeafe;
    color: #3b82f6;
  }

  &.stat-green .stat-icon {
    background: #d1fae5;
    color: #10b981;
  }

  &.stat-yellow .stat-icon {
    background: #fef3c7;
    color: #f59e0be6;
  }

  &.stat-purple .stat-icon {
    background: #e9d5ff;
    color: #a855f7;
  }
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 1.75rem;
    height: 1.75rem;
  }
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;

  svg {
    width: 1rem;
    height: 1rem;
  }

  &.positive {
    color: #10b981;
  }

  &.negative {
    color: #ef4444;
  }
}

// Sales Funnel
.funnel-section {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.funnel-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.funnel-stage {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.5rem;
  padding: 1.25rem;
  color: white;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  }

  &.stage-1 {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.stage-2 {
    background: linear-gradient(135deg, #667eea 10%, #764ba2 100%);
  }

  &.stage-3 {
    background: linear-gradient(135deg, #667eea 20%, #764ba2 100%);
  }

  &.stage-4 {
    background: linear-gradient(135deg, #667eea 30%, #764ba2 100%);
  }

  &.stage-5 {
    background: linear-gradient(135deg, #667eea 40%, #764ba2 100%);
  }

  &.stage-6 {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.stage-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.stage-count {
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0;
}

.stage-value {
  font-size: 1.125rem;
  font-weight: 700;
}

.stage-progress {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  height: 0.5rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.stage-progress-bar {
  background: white;
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.stage-conversion {
  font-size: 0.75rem;
  opacity: 0.8;
  text-align: right;
}

// Leads Section
.leads-section {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.section-controls {
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.search-box {
  position: relative;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.status-filter {
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.leads-table-container {
  overflow-x: auto;
}

.leads-table {
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 1rem;
    background: #f9fafb;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    white-space: nowrap;
  }

  td {
    padding: 1rem;
    border-top: 1px solid #f3f4f6;
  }
}

.lead-row {
  transition: background 0.2s;

  &:hover {
    background: #f9fafb;
  }
}

.lead-client {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.client-avatar {
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

.client-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
}

.client-email {
  font-size: 0.75rem;
  color: #6b7280;
}

.company-name {
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
}

.company-type {
  font-size: 0.75rem;
  color: #6b7280;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
}

.contact-icon {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
}

.deal-value {
  font-weight: 600;
  color: #111827;
  font-size: 0.9375rem;
}

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;

  &.status-new {
    background: #dbeafe;
    color: #1e40af;
  }

  &.status-contacted {
    background: #e0e7ff;
    color: #4338ca;
  }

  &.status-qualified {
    background: #fef3c7;
    color: #92400e;
  }

  &.status-proposal {
    background: #fce7f3;
    color: #9f1239;
  }

  &.status-negotiation {
    background: #f3e8ff;
    color: #6b21a8;
  }

  &.status-won {
    background: #d1fae5;
    color: #065f46;
  }

  &.status-lost {
    background: #fee2e2;
    color: #991b1b;
  }
}

.manager-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.manager-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: #e5e7eb;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.manager-name {
  font-size: 0.875rem;
  color: #374151;
  white-space: nowrap;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.date {
  font-size: 0.875rem;
  color: #111827;
}

.time-ago {
  font-size: 0.75rem;
  color: #6b7280;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }

  &.action-danger:hover {
    background: #fee2e2;
    color: #dc2626;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #9ca3af;

  .empty-icon {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover:not(:disabled) {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
