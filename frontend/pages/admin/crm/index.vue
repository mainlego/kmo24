<template>
  <div class="crm-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">CRM - Управление клиентами</h1>
        <p class="page-subtitle">Отслеживание лидов и сделок</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="openLeadModal">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Новый лид
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="view-tabs">
      <NuxtLink to="/admin/crm/kanban" class="tab-btn">
        <svg class="tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        Канбан
      </NuxtLink>
      <NuxtLink to="/admin/crm?view=table" class="tab-btn active">
        <svg class="tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Таблица
      </NuxtLink>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card stat-orange">
        <div class="stat-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalLeads }}</div>
          <div class="stat-label">Всего лидов</div>
        </div>
      </div>

      <div class="stat-card stat-orange">
        <div class="stat-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.activeDeals }}</div>
          <div class="stat-label">Активные сделки</div>
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
        </div>
      </div>

      <div class="stat-card stat-orange">
        <div class="stat-icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.conversionRate }}%</div>
          <div class="stat-label">Конверсия</div>
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
            <tr v-for="lead in filteredLeads" :key="lead._id || lead.id" class="lead-row" @click="openLeadDetails(lead)">
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
                <div class="company-name">{{ lead.company || '-' }}</div>
                <div class="company-type">{{ lead.companyType || '' }}</div>
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
                <div v-if="lead.dealValue || lead.budget" class="deal-value">{{ formatCurrency(lead.dealValue || lead.budget) }}</div>
                <div v-else class="deal-callback">Заявка на звонок</div>
              </td>
              <td>
                <span class="status-badge" :class="`status-${lead.status}`">
                  {{ getStatusLabel(lead.status) }}
                </span>
              </td>
              <td>
                <div class="manager-info">
                  <div class="manager-avatar">{{ getInitials(lead.manager || 'НН') }}</div>
                  <span class="manager-name">{{ lead.manager || 'Не назначен' }}</span>
                </div>
              </td>
              <td>
                <div class="date-info">
                  <div class="date">{{ formatDate(lead.createdAt) }}</div>
                  <div class="time-ago">{{ getTimeAgo(lead.createdAt) }}</div>
                </div>
              </td>
              <td>
                <div class="actions" @click.stop>
                  <button class="action-btn" @click="editLead(lead)" title="Редактировать">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
        <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="pagination-info">
          Страница {{ currentPage }} из {{ totalPages || 1 }}
        </div>
        <button class="pagination-btn" :disabled="currentPage >= totalPages" @click="currentPage++">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Lead Edit Modal -->
    <Teleport to="body">
      <div v-if="showLeadModal" class="modal-overlay" @click.self="closeLeadModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ editingLead ? 'Редактировать лид' : 'Новый лид' }}</h3>
            <button class="modal-close" @click="closeLeadModal">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Имя *</label>
              <input v-model="leadForm.name" type="text" placeholder="Иван Иванов" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email</label>
                <input v-model="leadForm.email" type="email" placeholder="email@example.com" />
              </div>
              <div class="form-group">
                <label>Телефон *</label>
                <input v-model="leadForm.phone" type="tel" placeholder="+7 (999) 123-45-67" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Компания</label>
                <input v-model="leadForm.company" type="text" placeholder="ООО Компания" />
              </div>
              <div class="form-group">
                <label>Бюджет</label>
                <input v-model.number="leadForm.budget" type="number" placeholder="100000" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Статус</label>
                <select v-model="leadForm.status">
                  <option value="new">Новый</option>
                  <option value="contacted">Контакт установлен</option>
                  <option value="qualified">Квалифицирован</option>
                  <option value="negotiation">Переговоры</option>
                  <option value="won">Успех</option>
                  <option value="lost">Проигран</option>
                </select>
              </div>
              <div class="form-group">
                <label>Приоритет</label>
                <select v-model="leadForm.priority">
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                  <option value="urgent">Срочный</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Заметки</label>
              <textarea v-model="leadForm.notes" rows="3" placeholder="Дополнительная информация..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeLeadModal">Отмена</button>
            <button class="btn btn-primary" @click="saveLead">
              {{ editingLead ? 'Сохранить' : 'Создать' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCRMStore, type Lead } from '~/stores/crm';
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const route = useRoute();
const crmStore = useCRMStore();
const { success, error } = useToast();

// Data
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;
const loading = ref(false);

onMounted(async () => {
  // Если нет query параметра view=table, редиректим на kanban
  if (!route.query.view) {
    await navigateTo('/admin/crm/kanban', { replace: true });
    return;
  }

  loading.value = true;
  try {
    await Promise.all([
      crmStore.fetchLeads(),
      crmStore.fetchStats(),
    ]);
  } catch (err: any) {
    error(err.message || 'Ошибка при загрузке данных');
  } finally {
    loading.value = false;
  }
});

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
        lead.name?.toLowerCase().includes(query) ||
        lead.company?.toLowerCase().includes(query) ||
        lead.phone?.includes(query) ||
        lead.email?.toLowerCase().includes(query)
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
  if (!value) return '0 ₽';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getTimeAgo = (date: string) => {
  if (!date) return '';
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
  if (!name) return '?';
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

// Modal state
const showLeadModal = ref(false);
const editingLead = ref<Lead | null>(null);
const leadForm = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  budget: 0,
  status: 'new' as Lead['status'],
  priority: 'medium' as Lead['priority'],
  notes: '',
});

const resetForm = () => {
  leadForm.value = {
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: 0,
    status: 'new',
    priority: 'medium',
    notes: '',
  };
};

const openLeadModal = (lead?: Lead) => {
  if (lead) {
    editingLead.value = lead;
    leadForm.value = {
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      budget: lead.budget || lead.dealValue || 0,
      status: lead.status || 'new',
      priority: lead.priority || 'medium',
      notes: lead.notes || lead.message || '',
    };
  } else {
    editingLead.value = null;
    resetForm();
  }
  showLeadModal.value = true;
};

const closeLeadModal = () => {
  showLeadModal.value = false;
  editingLead.value = null;
  resetForm();
};

const saveLead = async () => {
  if (!leadForm.value.name || !leadForm.value.phone) {
    error('Заполните обязательные поля');
    return;
  }

  try {
    if (editingLead.value) {
      await crmStore.updateLead(editingLead.value._id, leadForm.value);
      success('Лид успешно обновлен');
    } else {
      await crmStore.addLead(leadForm.value);
      success('Лид успешно создан');
    }
    closeLeadModal();
    await crmStore.fetchLeads();
  } catch (err: any) {
    error(err.message || 'Ошибка при сохранении лида');
  }
};

const editLead = (lead: Lead) => {
  openLeadModal(lead);
};

const openLeadDetails = (lead: Lead) => {
  openLeadModal(lead);
};

const deleteLead = async (lead: Lead) => {
  if (confirm(`Вы уверены, что хотите удалить лид "${lead.name}"?`)) {
    try {
      await crmStore.deleteLead(lead._id);
      success('Лид успешно удален');
    } catch (err: any) {
      error(err.message || 'Ошибка при удалении лида');
    }
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
  margin-bottom: 1.5rem;
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

// View Tabs
.view-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.5rem;
  width: fit-content;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;

  .tab-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    color: #374151;
    background: rgba(255, 255, 255, 0.5);
  }

  &.active {
    background: white;
    color: #f59e0b;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
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
  text-decoration: none;

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &.btn-primary {
    background: #f59e0b;
    color: white;

    &:hover {
      background: #d97706;
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

  &.stat-orange .stat-icon,
  &.stat-yellow .stat-icon {
    background: #fed7aa;
    color: #f59e0b;
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
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  border-radius: 0.5rem;
  padding: 1.25rem;
  color: white;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
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
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
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
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
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
  cursor: pointer;

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
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
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
  color: #10b981;
  font-size: 0.9375rem;
}

.deal-callback {
  font-size: 0.8125rem;
  color: #3b82f6;
  background: #eff6ff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  display: inline-block;
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
    color: #1d4ed8;
  }

  &.status-contacted {
    background: #fef3c7;
    color: #92400e;
  }

  &.status-qualified {
    background: #d1fae5;
    color: #065f46;
  }

  &.status-negotiation {
    background: #ede9fe;
    color: #5b21b6;
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

// Modal styles
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
}

.modal-close {
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
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.625rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }
  }

  textarea {
    resize: vertical;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
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
</style>
