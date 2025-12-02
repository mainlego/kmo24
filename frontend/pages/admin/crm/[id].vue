<template>
  <div class="lead-detail-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <button class="back-button" @click="navigateTo('/admin/crm')">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Назад к списку
        </button>
        <h1 class="page-title">{{ lead?.name || 'Загрузка...' }}</h1>
        <p v-if="lead" class="page-subtitle">
          <span class="status-badge" :class="`status-${lead.status}`">
            {{ getStatusLabel(lead.status) }}
          </span>
          <span class="priority-badge" :class="`priority-${lead.priority}`">
            {{ getPriorityLabel(lead.priority) }}
          </span>
        </p>
      </div>
      <div v-if="lead" class="header-actions">
        <button class="btn btn-secondary" @click="showEditModal = true">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Редактировать
        </button>
        <select v-model="lead.status" @change="updateLeadStatus" class="status-select">
          <option value="new">Новый</option>
          <option value="contacted">Контакт установлен</option>
          <option value="qualified">Квалифицирован</option>
          <option value="negotiation">Переговоры</option>
          <option value="won">Успех</option>
          <option value="lost">Проигран</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>

    <div v-else-if="!lead" class="error-state">
      <p>Лид не найден</p>
      <button class="btn btn-primary" @click="navigateTo('/admin/crm')">
        Вернуться к списку
      </button>
    </div>

    <div v-else class="lead-content">
      <!-- Main Info -->
      <div class="content-grid">
        <!-- Left Column - Lead Info -->
        <div class="info-column">
          <!-- Contact Info Card -->
          <div class="info-card">
            <h2 class="card-title">Контактная информация</h2>
            <div class="info-list">
              <div class="info-item">
                <svg class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div class="info-content">
                  <span class="info-label">Имя</span>
                  <span class="info-value">{{ lead.name }}</span>
                </div>
              </div>
              <div v-if="lead.phone" class="info-item">
                <svg class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div class="info-content">
                  <span class="info-label">Телефон</span>
                  <a :href="`tel:${lead.phone}`" class="info-value info-link">{{ lead.phone }}</a>
                </div>
              </div>
              <div v-if="lead.email" class="info-item">
                <svg class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div class="info-content">
                  <span class="info-label">Email</span>
                  <a :href="`mailto:${lead.email}`" class="info-value info-link">{{ lead.email }}</a>
                </div>
              </div>
              <div v-if="lead.company" class="info-item">
                <svg class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div class="info-content">
                  <span class="info-label">Компания</span>
                  <span class="info-value">{{ lead.company }}</span>
                </div>
              </div>
              <div v-if="lead.position" class="info-item">
                <svg class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div class="info-content">
                  <span class="info-label">Должность</span>
                  <span class="info-value">{{ lead.position }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Deal Info Card -->
          <div class="info-card">
            <h2 class="card-title">Информация о сделке</h2>
            <div class="info-list">
              <div class="info-item">
                <svg class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="info-content">
                  <span class="info-label">Бюджет</span>
                  <span class="info-value deal-value">{{ formatCurrency(lead.budget || 0) }}</span>
                </div>
              </div>
              <div class="info-item">
                <svg class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div class="info-content">
                  <span class="info-label">Источник</span>
                  <span class="info-value">{{ getSourceLabel(lead.source) }}</span>
                </div>
              </div>
              <div v-if="lead.product" class="info-item">
                <svg class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <div class="info-content">
                  <span class="info-label">Интересующий товар</span>
                  <NuxtLink :to="`/products/${lead.product.slug}`" class="info-value info-link">
                    {{ lead.product.name }}
                  </NuxtLink>
                </div>
              </div>
              <div v-if="lead.nextContactDate" class="info-item">
                <svg class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div class="info-content">
                  <span class="info-label">Следующий контакт</span>
                  <span class="info-value" :class="{ 'overdue': isOverdue(lead.nextContactDate) }">
                    {{ formatDate(lead.nextContactDate) }}
                  </span>
                </div>
              </div>
              <div v-if="lead.assignedTo" class="info-item">
                <svg class="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="info-content">
                  <span class="info-label">Ответственный</span>
                  <span class="info-value">
                    {{ lead.assignedTo.firstName }} {{ lead.assignedTo.lastName }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Message Card -->
          <div v-if="lead.message" class="info-card">
            <h2 class="card-title">Сообщение клиента</h2>
            <p class="message-text">{{ lead.message }}</p>
          </div>

          <!-- Tags Card -->
          <div v-if="lead.tags?.length" class="info-card">
            <h2 class="card-title">Теги</h2>
            <div class="tags-list">
              <span v-for="tag in lead.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>

          <!-- Dates Card -->
          <div class="info-card">
            <h2 class="card-title">Даты</h2>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Создан:</span>
                <span class="info-value">{{ formatDateTime(lead.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Обновлен:</span>
                <span class="info-value">{{ formatDateTime(lead.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Interactions -->
        <div class="interactions-column">
          <div class="interactions-card">
            <div class="interactions-header">
              <h2 class="card-title">История взаимодействий</h2>
              <button class="btn btn-primary btn-sm" @click="showAddInteraction = true">
                <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Добавить
              </button>
            </div>

            <!-- Add Interaction Form -->
            <div v-if="showAddInteraction" class="add-interaction-form">
              <div class="form-group">
                <label>Тип взаимодействия</label>
                <select v-model="newInteraction.type" class="form-select">
                  <option value="call">Звонок</option>
                  <option value="email">Email</option>
                  <option value="meeting">Встреча</option>
                  <option value="note">Заметка</option>
                </select>
              </div>
              <div class="form-group">
                <label>Описание</label>
                <textarea
                  v-model="newInteraction.description"
                  class="form-textarea"
                  rows="3"
                  placeholder="Опишите взаимодействие..."
                ></textarea>
              </div>
              <div class="form-actions">
                <button class="btn btn-secondary btn-sm" @click="showAddInteraction = false">
                  Отмена
                </button>
                <button
                  class="btn btn-primary btn-sm"
                  @click="addNewInteraction"
                  :disabled="!newInteraction.description.trim()"
                >
                  Сохранить
                </button>
              </div>
            </div>

            <!-- Interactions Timeline -->
            <div v-if="lead.interactions?.length" class="interactions-timeline">
              <div
                v-for="(interaction, index) in sortedInteractions"
                :key="index"
                class="timeline-item"
              >
                <div class="timeline-icon" :class="`icon-${interaction.type}`">
                  <svg v-if="interaction.type === 'call'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <svg v-else-if="interaction.type === 'email'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <svg v-else-if="interaction.type === 'meeting'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <span class="timeline-type">{{ getInteractionTypeLabel(interaction.type) }}</span>
                    <span class="timeline-date">{{ formatDateTime(interaction.date) }}</span>
                  </div>
                  <p class="timeline-description">{{ interaction.description }}</p>
                  <span v-if="interaction.user" class="timeline-user">
                    {{ interaction.user.firstName }} {{ interaction.user.lastName }}
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="empty-interactions">
              <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>Нет записей о взаимодействиях</p>
              <button class="btn btn-secondary btn-sm" @click="showAddInteraction = true">
                Добавить первое взаимодействие
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useLeads, type Lead, type LeadInteraction } from '~/composables/useLeads';
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const route = useRoute();
const { getLeadById, updateLead, addInteraction } = useLeads();
const { success, error } = useToast();

const loading = ref(true);
const lead = ref<Lead | null>(null);
const showEditModal = ref(false);
const showAddInteraction = ref(false);

const newInteraction = ref({
  type: 'note' as 'call' | 'email' | 'meeting' | 'note',
  description: '',
});

const sortedInteractions = computed(() => {
  if (!lead.value?.interactions) return [];
  return [...lead.value.interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

const fetchLead = async () => {
  const id = route.params.id as string;
  if (!id) return;

  try {
    loading.value = true;
    lead.value = await getLeadById(id);
  } catch {
    lead.value = null;
  } finally {
    loading.value = false;
  }
};

const updateLeadStatus = async () => {
  if (!lead.value) return;

  try {
    await updateLead(lead.value._id, { status: lead.value.status });
    success('Статус обновлен');
  } catch {
    // Ошибка показывается в useLeads
  }
};

const addNewInteraction = async () => {
  if (!lead.value || !newInteraction.value.description.trim()) return;

  try {
    const updated = await addInteraction(lead.value._id, {
      type: newInteraction.value.type,
      description: newInteraction.value.description,
    });
    lead.value = updated;
    newInteraction.value = { type: 'note', description: '' };
    showAddInteraction.value = false;
  } catch {
    // Ошибка показывается в useLeads
  }
};

// Formatting helpers
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

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const isOverdue = (date: string) => {
  return new Date(date) < new Date();
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    new: 'Новый',
    contacted: 'Контакт',
    qualified: 'Квалифицирован',
    negotiation: 'Переговоры',
    won: 'Успех',
    lost: 'Проигран',
  };
  return labels[status] || status;
};

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
    urgent: 'Срочный',
  };
  return labels[priority] || priority;
};

const getSourceLabel = (source: string) => {
  const labels: Record<string, string> = {
    website: 'Сайт',
    phone: 'Телефон',
    email: 'Email',
    social: 'Соцсети',
    referral: 'Рекомендация',
    other: 'Другое',
  };
  return labels[source] || source;
};

const getInteractionTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    call: 'Звонок',
    email: 'Email',
    meeting: 'Встреча',
    note: 'Заметка',
  };
  return labels[type] || type;
};

onMounted(fetchLead);
</script>

<style scoped lang="scss">
.lead-detail-page {
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
  flex-wrap: wrap;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #111827;
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0.5rem 0 0.5rem 0;
}

.page-subtitle {
  display: flex;
  gap: 0.5rem;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.status-select {
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  background: white;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
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

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }

  &.btn-primary {
    background: #f59e0b;
    color: white;

    &:hover:not(:disabled) {
      background: #d97706;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;

  &.status-new { background: #fef3c7; color: #92400e; }
  &.status-contacted { background: #dbeafe; color: #1e40af; }
  &.status-qualified { background: #d1fae5; color: #065f46; }
  &.status-negotiation { background: #e0e7ff; color: #3730a3; }
  &.status-won { background: #d1fae5; color: #065f46; }
  &.status-lost { background: #fee2e2; color: #991b1b; }
}

.priority-badge {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;

  &.priority-low { background: #f3f4f6; color: #6b7280; }
  &.priority-medium { background: #fef3c7; color: #92400e; }
  &.priority-high { background: #fed7aa; color: #c2410c; }
  &.priority-urgent { background: #fee2e2; color: #991b1b; }
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
  text-align: center;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top-color: #f59e0b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.info-card,
.interactions-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.25rem 0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.9375rem;
  color: #111827;
  font-weight: 500;

  &.info-link {
    color: #f59e0b;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &.deal-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #f59e0b;
  }

  &.overdue {
    color: #dc2626;
  }
}

.message-text {
  font-size: 0.9375rem;
  color: #374151;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: #374151;
}

.interactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;

  .card-title {
    margin: 0;
  }
}

.add-interaction-form {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
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
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.interactions-timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
  position: relative;

  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 1rem;
    top: 2.5rem;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
  }
}

.timeline-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #f3f4f6;
  color: #6b7280;

  svg {
    width: 1rem;
    height: 1rem;
  }

  &.icon-call { background: #dbeafe; color: #1e40af; }
  &.icon-email { background: #fef3c7; color: #92400e; }
  &.icon-meeting { background: #d1fae5; color: #065f46; }
  &.icon-note { background: #f3f4f6; color: #374151; }
}

.timeline-content {
  flex: 1;
  min-width: 0;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.timeline-type {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.timeline-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.timeline-description {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
  margin: 0 0 0.25rem 0;
  white-space: pre-wrap;
}

.timeline-user {
  font-size: 0.75rem;
  color: #9ca3af;
}

.empty-interactions {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  color: #9ca3af;

  .empty-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
  }

  p {
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
  }
}
</style>
