<template>
  <div class="change-history">
    <div class="history-header">
      <h3 class="history-title">
        <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        История изменений
      </h3>
      <div class="history-actions">
        <button v-if="showFilter" class="btn-filter" @click="toggleFilter">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Фильтр
        </button>
        <button v-if="showExport" class="btn-export" @click="exportHistory">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Экспорт
        </button>
      </div>
    </div>

    <!-- Filter Panel -->
    <div v-if="filterVisible" class="filter-panel">
      <div class="filter-row">
        <select v-model="filterAction" class="filter-select">
          <option value="">Все действия</option>
          <option value="create">Создание</option>
          <option value="update">Изменение</option>
          <option value="delete">Удаление</option>
          <option value="restore">Восстановление</option>
        </select>

        <select v-model="filterUser" class="filter-select">
          <option value="">Все пользователи</option>
          <option v-for="user in uniqueUsers" :key="user" :value="user">
            {{ user }}
          </option>
        </select>

        <input
          v-model="filterDate"
          type="date"
          class="filter-input"
          placeholder="Дата"
        />

        <button class="btn-reset" @click="resetFilters">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Сбросить
        </button>
      </div>
    </div>

    <!-- Timeline -->
    <div v-if="!loading && filteredHistory.length > 0" class="timeline">
      <div
        v-for="(entry, index) in paginatedHistory"
        :key="entry.id"
        class="timeline-item"
        :class="`action-${entry.action}`"
      >
        <div class="timeline-marker">
          <div class="timeline-icon" :class="`icon-${entry.action}`">
            <svg v-if="entry.action === 'create'" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <svg v-else-if="entry.action === 'update'" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <svg v-else-if="entry.action === 'delete'" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <svg v-else class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        </div>

        <div class="timeline-content">
          <div class="entry-header">
            <div class="entry-info">
              <span class="entry-action">{{ getActionLabel(entry.action) }}</span>
              <span class="entry-user">{{ entry.user }}</span>
              <span class="entry-time">{{ formatTime(entry.timestamp) }}</span>
            </div>
            <button
              v-if="entry.changes && entry.changes.length > 0"
              class="toggle-details"
              @click="toggleDetails(entry.id)"
            >
              <svg
                class="icon"
                :class="{ rotated: expandedItems.includes(entry.id) }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div class="entry-description">
            {{ entry.description }}
          </div>

          <!-- Changes Details -->
          <transition name="expand">
            <div
              v-if="expandedItems.includes(entry.id) && entry.changes"
              class="entry-changes"
            >
              <div v-for="(change, idx) in entry.changes" :key="idx" class="change-item">
                <div class="change-field">{{ change.field }}:</div>
                <div class="change-values">
                  <span v-if="change.oldValue !== undefined" class="old-value">
                    {{ formatValue(change.oldValue) }}
                  </span>
                  <svg class="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span class="new-value">{{ formatValue(change.newValue) }}</span>
                </div>
              </div>
            </div>
          </transition>

          <!-- Metadata -->
          <div v-if="entry.metadata" class="entry-metadata">
            <span v-if="entry.metadata.ip" class="metadata-item">
              IP: {{ entry.metadata.ip }}
            </span>
            <span v-if="entry.metadata.userAgent" class="metadata-item">
              {{ getBrowserInfo(entry.metadata.userAgent) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && filteredHistory.length === 0" class="empty-state">
      <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p>История изменений пуста</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Загрузка истории...</p>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        Назад
      </button>
      <span class="page-info">
        Страница {{ currentPage }} из {{ totalPages }}
      </span>
      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        Вперёд
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { exportToCSV } from '~/utils/export';

interface HistoryChange {
  field: string;
  oldValue?: any;
  newValue: any;
}

interface HistoryEntry {
  id: string;
  action: 'create' | 'update' | 'delete' | 'restore';
  user: string;
  userId?: string;
  timestamp: string;
  description: string;
  changes?: HistoryChange[];
  metadata?: {
    ip?: string;
    userAgent?: string;
    [key: string]: any;
  };
}

interface Props {
  entityType: string;
  entityId: string;
  showFilter?: boolean;
  showExport?: boolean;
  perPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  showFilter: true,
  showExport: true,
  perPage: 10,
});

// State
const history = ref<HistoryEntry[]>([]);
const loading = ref(false);
const filterVisible = ref(false);
const expandedItems = ref<string[]>([]);
const currentPage = ref(1);

// Filters
const filterAction = ref('');
const filterUser = ref('');
const filterDate = ref('');

// Computed
const filteredHistory = computed(() => {
  let result = history.value;

  if (filterAction.value) {
    result = result.filter(entry => entry.action === filterAction.value);
  }

  if (filterUser.value) {
    result = result.filter(entry => entry.user === filterUser.value);
  }

  if (filterDate.value) {
    result = result.filter(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === filterDate.value;
    });
  }

  return result;
});

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * props.perPage;
  const end = start + props.perPage;
  return filteredHistory.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredHistory.value.length / props.perPage);
});

const uniqueUsers = computed(() => {
  return [...new Set(history.value.map(entry => entry.user))];
});

// Methods
const toggleFilter = () => {
  filterVisible.value = !filterVisible.value;
};

const resetFilters = () => {
  filterAction.value = '';
  filterUser.value = '';
  filterDate.value = '';
  currentPage.value = 1;
};

const toggleDetails = (id: string) => {
  const index = expandedItems.value.indexOf(id);
  if (index > -1) {
    expandedItems.value.splice(index, 1);
  } else {
    expandedItems.value.push(id);
  }
};

const getActionLabel = (action: string): string => {
  const labels: Record<string, string> = {
    create: 'Создание',
    update: 'Изменение',
    delete: 'Удаление',
    restore: 'Восстановление',
  };
  return labels[action] || action;
};

const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  if (hours < 24) return `${hours} ч назад`;
  if (days < 7) return `${days} дн назад`;

  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatValue = (value: any): string => {
  if (value === null || value === undefined) return 'не задано';
  if (typeof value === 'boolean') return value ? 'да' : 'нет';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const getBrowserInfo = (userAgent: string): string => {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Другой браузер';
};

const exportHistory = () => {
  const data = filteredHistory.value.map(entry => ({
    'Дата': new Date(entry.timestamp).toLocaleString('ru-RU'),
    'Действие': getActionLabel(entry.action),
    'Пользователь': entry.user,
    'Описание': entry.description,
  }));

  exportToCSV(data, `history-${props.entityType}-${props.entityId}`);
};

const loadHistory = async () => {
  loading.value = true;

  try {
    // TODO: API call to fetch history
    // Временные mock данные
    await new Promise(resolve => setTimeout(resolve, 1000));

    history.value = [
      {
        id: '1',
        action: 'create',
        user: 'Иван Петров',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        description: 'Создан новый товар',
        metadata: {
          ip: '192.168.1.1',
          userAgent: 'Chrome',
        },
      },
      {
        id: '2',
        action: 'update',
        user: 'Анна Смирнова',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        description: 'Обновлена цена товара',
        changes: [
          { field: 'Цена', oldValue: '100000', newValue: '95000' },
          { field: 'Старая цена', oldValue: null, newValue: '100000' },
        ],
        metadata: {
          ip: '192.168.1.2',
        },
      },
      {
        id: '3',
        action: 'update',
        user: 'Сергей Иванов',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        description: 'Обновлено описание товара',
        changes: [
          {
            field: 'Описание',
            oldValue: 'Старое описание',
            newValue: 'Новое подробное описание товара',
          },
        ],
      },
    ];
  } catch (error) {
    console.error('Failed to load history:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadHistory();
});
</script>

<style scoped lang="scss">
.change-history {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.history-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;

  .icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #3b82f6;
  }
}

.history-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-filter,
.btn-export {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  .icon {
    width: 1rem;
    height: 1rem;
  }
}

.filter-panel {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  align-items: center;
}

.filter-select,
.filter-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #6b7280;
  cursor: pointer;
  white-space: nowrap;

  .icon {
    width: 1rem;
    height: 1rem;
  }

  &:hover {
    background: #f9fafb;
  }
}

.timeline {
  position: relative;
  padding-left: 2rem;

  &::before {
    content: '';
    position: absolute;
    left: 0.875rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
  }
}

.timeline-item {
  position: relative;
  padding-bottom: 2rem;

  &:last-child {
    padding-bottom: 0;
  }
}

.timeline-marker {
  position: absolute;
  left: -2rem;
  top: 0;
}

.timeline-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: white;
  border: 2px solid;

  .icon {
    width: 1rem;
    height: 1rem;
  }

  &.icon-create {
    border-color: #10b981;
    color: #10b981;
  }

  &.icon-update {
    border-color: #3b82f6;
    color: #3b82f6;
  }

  &.icon-delete {
    border-color: #ef4444;
    color: #ef4444;
  }

  &.icon-restore {
    border-color: #f59e0be6;
    color: #f59e0be6;
  }
}

.timeline-content {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.entry-info {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.entry-action {
  font-weight: 600;
  color: #111827;
}

.entry-user {
  font-size: 0.875rem;
  color: #6b7280;

  &::before {
    content: '•';
    margin-right: 0.5rem;
  }
}

.entry-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.toggle-details {
  padding: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;

  &:hover {
    color: #111827;
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.2s;

    &.rotated {
      transform: rotate(180deg);
    }
  }
}

.entry-description {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.entry-changes {
  margin-top: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.change-item {
  padding: 0.5rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
}

.change-field {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.change-values {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.old-value {
  color: #ef4444;
  text-decoration: line-through;
}

.arrow-icon {
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.new-value {
  color: #10b981;
  font-weight: 500;
}

.entry-metadata {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.metadata-item {
  font-size: 0.75rem;
  color: #9ca3af;
}

.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #9ca3af;

  .icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.page-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
