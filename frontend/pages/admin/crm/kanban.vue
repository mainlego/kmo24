<template>
  <div class="crm-kanban">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">CRM - Управление клиентами</h1>
        <p class="page-subtitle">Перетаскивайте сделки между этапами</p>
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
      <NuxtLink to="/admin/crm/kanban" class="tab-btn active">
        <svg class="tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        Канбан
      </NuxtLink>
      <NuxtLink to="/admin/crm?view=table" class="tab-btn">
        <svg class="tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Таблица
      </NuxtLink>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <div class="stat-item">
        <div class="stat-label">Всего лидов</div>
        <div class="stat-value">{{ crmStore.totalLeads }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Активные сделки</div>
        <div class="stat-value">{{ crmStore.activeDeals }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Сумма сделок</div>
        <div class="stat-value">{{ formatCurrency(crmStore.totalValue) }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Конверсия</div>
        <div class="stat-value">{{ crmStore.conversionRate }}%</div>
      </div>
    </div>

    <!-- Board Container with Hint -->
    <div class="board-container">
      <Transition name="fade">
        <div v-if="!hasInteractedWithBoard" class="drag-hint">
          <svg class="drag-hint-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>Перетащите доску для навигации</span>
        </div>
      </Transition>

      <!-- Kanban Board -->
      <div
        ref="kanbanBoard"
        class="kanban-board"
        :class="{ 'is-dragging-board': isDraggingBoard }"
        @mousedown="startBoardDrag"
        @mousemove="onBoardDrag"
        @mouseup="stopBoardDrag"
        @mouseleave="stopBoardDrag"
        @touchstart="startBoardDragTouch"
        @touchmove="onBoardDragTouch"
        @touchend="stopBoardDrag"
      >
        <div
          v-for="stage in stages"
          :key="stage.status"
          class="kanban-column"
          :class="`column-${stage.status}`"
        >
          <div class="column-header">
            <h3 class="column-title">{{ stage.name }}</h3>
            <span class="column-count">{{ getLeadsByStatus(stage.status).length }}</span>
          </div>

          <div
            class="column-body"
            @drop="handleDrop($event, stage.status)"
            @dragover.prevent
            @dragenter.prevent="handleDragEnter($event, stage.status)"
            @dragleave="handleDragLeave($event)"
          >
          <div
            v-for="lead in getLeadsByStatus(stage.status)"
            :key="lead._id || lead.id"
            class="lead-card"
            draggable="true"
            @dragstart="handleDragStart($event, lead)"
            @dragend="handleDragEnd"
            @click="openLeadDetails(lead)"
          >
            <div class="card-header">
              <div class="card-client">
                <div class="client-avatar">{{ getInitials(lead.name) }}</div>
                <div class="client-info">
                  <div class="client-name">{{ lead.name }}</div>
                  <div class="company-name">{{ lead.company || lead.phone }}</div>
                </div>
              </div>
              <button class="card-menu" @click.stop="openCardMenu(lead)">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            <!-- Показываем сумму только если она больше 0 -->
            <div v-if="lead.dealValue || lead.budget" class="card-value">{{ formatCurrency(lead.dealValue || lead.budget) }}</div>
            <!-- Для заявок на звонок показываем тип -->
            <div v-else class="card-type">
              <svg class="type-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Заявка на звонок
            </div>

            <div v-if="lead.notes || lead.message" class="card-notes">{{ lead.notes || lead.message }}</div>

            <div class="card-footer">
              <div class="card-manager">
                <div class="manager-avatar">{{ getInitials(lead.manager || 'НН') }}</div>
                <span>{{ lead.manager || 'Не назначен' }}</span>
              </div>
              <div class="card-date">{{ getTimeAgo(lead.createdAt) }}</div>
            </div>
          </div>

          <div v-if="getLeadsByStatus(stage.status).length === 0" class="empty-column">
            <svg class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p>Нет лидов</p>
          </div>
        </div>
      </div>
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

const crmStore = useCRMStore();
const { success, error } = useToast();

// Загружаем лиды при монтировании
onMounted(async () => {
  await crmStore.fetchLeads();
});

const stages = [
  { status: 'new' as Lead['status'], name: 'Новые лиды' },
  { status: 'contacted' as Lead['status'], name: 'Контакт установлен' },
  { status: 'qualified' as Lead['status'], name: 'Квалифицированы' },
  { status: 'negotiation' as Lead['status'], name: 'Переговоры' },
  { status: 'won' as Lead['status'], name: 'Успех' },
  { status: 'lost' as Lead['status'], name: 'Потеряно' },
];

const draggedLead = ref<Lead | null>(null);
const draggedOverColumn = ref<Lead['status'] | null>(null);

// Board drag-to-scroll
const kanbanBoard = ref<HTMLElement | null>(null);
const isDraggingBoard = ref(false);
const boardDragStart = ref({ x: 0, scrollLeft: 0 });
const hasInteractedWithBoard = ref(false);

// Methods
const startBoardDrag = (e: MouseEvent) => {
  // Don't start board drag if we're dragging a card
  if ((e.target as HTMLElement).closest('.lead-card')) {
    return;
  }

  // Don't start if clicking on buttons or interactive elements
  if ((e.target as HTMLElement).closest('button, a, input, select, textarea')) {
    return;
  }

  const board = kanbanBoard.value;
  if (!board) return;

  isDraggingBoard.value = true;
  hasInteractedWithBoard.value = true;
  boardDragStart.value = {
    x: e.pageX,
    scrollLeft: board.scrollLeft,
  };

  e.preventDefault();
};

const onBoardDrag = (e: MouseEvent) => {
  if (!isDraggingBoard.value) return;

  const board = kanbanBoard.value;
  if (!board) return;

  const x = e.pageX;
  const walk = (boardDragStart.value.x - x) * 1.5; // Multiply for faster scroll
  board.scrollLeft = boardDragStart.value.scrollLeft + walk;
};

const stopBoardDrag = () => {
  isDraggingBoard.value = false;
};

// Touch events for mobile
const startBoardDragTouch = (e: TouchEvent) => {
  // Don't start board drag if we're dragging a card
  if ((e.target as HTMLElement).closest('.lead-card')) {
    return;
  }

  const board = kanbanBoard.value;
  if (!board) return;

  const touch = e.touches[0];
  isDraggingBoard.value = true;
  hasInteractedWithBoard.value = true;
  boardDragStart.value = {
    x: touch.pageX,
    scrollLeft: board.scrollLeft,
  };
};

const onBoardDragTouch = (e: TouchEvent) => {
  if (!isDraggingBoard.value) return;

  const board = kanbanBoard.value;
  if (!board) return;

  const touch = e.touches[0];
  const x = touch.pageX;
  const walk = (boardDragStart.value.x - x) * 1.5;
  board.scrollLeft = boardDragStart.value.scrollLeft + walk;

  e.preventDefault();
};

const getLeadsByStatus = (status: Lead['status']) => {
  return crmStore.leadsByStatus(status);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(value);
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
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

// Drag & Drop handlers
const handleDragStart = (event: DragEvent, lead: Lead) => {
  draggedLead.value = lead;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', '');
  }
  (event.target as HTMLElement).classList.add('dragging');
};

const handleDragEnd = (event: DragEvent) => {
  (event.target as HTMLElement).classList.remove('dragging');
  draggedLead.value = null;
  draggedOverColumn.value = null;
};

const handleDragEnter = (event: DragEvent, status: Lead['status']) => {
  draggedOverColumn.value = status;
  (event.currentTarget as HTMLElement).classList.add('drag-over');
};

const handleDragLeave = (event: DragEvent) => {
  (event.currentTarget as HTMLElement).classList.remove('drag-over');
};

const handleDrop = async (event: DragEvent, newStatus: Lead['status']) => {
  event.preventDefault();
  (event.currentTarget as HTMLElement).classList.remove('drag-over');

  if (!draggedLead.value) return;

  const oldStatus = draggedLead.value.status;
  const leadId = draggedLead.value._id || draggedLead.value.id;

  if (oldStatus !== newStatus && leadId) {
    try {
      await crmStore.updateLeadStatus(leadId, newStatus);
      success(`Лид перемещен в "${stages.find(s => s.status === newStatus)?.name}"`);
    } catch (err: any) {
      error(err.message || 'Ошибка при перемещении лида');
    }
  }

  draggedLead.value = null;
  draggedOverColumn.value = null;
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

const openLeadDetails = (lead: Lead) => {
  openLeadModal(lead);
};

const openCardMenu = (lead: Lead) => {
  openLeadModal(lead);
};
</script>

<style scoped lang="scss">
.crm-kanban {
  padding: 2rem;
  height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1rem;
    height: auto;
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-shrink: 0;

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
  flex-shrink: 0;
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

// Stats Row
.stats-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
}

.stat-item {
  flex: 1;
  background: white;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 0;

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 0.5rem);
  }
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

// Board Container
.board-container {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.drag-hint {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.5rem;
  color: #3b82f6;
  font-size: 0.8125rem;
  font-weight: 500;
  z-index: 10;
  pointer-events: none;
  animation: fadeInOut 3s ease-in-out infinite;

  @media (max-width: 768px) {
    display: none;
  }
}

.drag-hint-icon {
  width: 1rem;
  height: 1rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

// Kanban Board
.kanban-board {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
  min-height: 0;
  padding-bottom: 1rem;
  cursor: grab;
  -webkit-overflow-scrolling: touch;

  // Custom scrollbar for better UX
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;

    &:hover {
      background: #9ca3af;
    }
  }

  &.is-dragging-board {
    cursor: grabbing;
    scroll-behavior: auto;

    .lead-card {
      pointer-events: none;
    }
  }

  @media (max-width: 1024px) {
    padding-bottom: 2rem;
    cursor: default; // On mobile, let native scroll behavior work
  }

  // Smooth momentum scrolling on mobile
  @media (max-width: 768px) {
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x proximity;

    .kanban-column {
      scroll-snap-align: start;
    }
  }
}

.kanban-column {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
  border-radius: 0.75rem;
  min-height: 0;

  @media (max-width: 768px) {
    flex: 0 0 280px;
  }

  &.column-new { border-top: 3px solid #3b82f6; }
  &.column-contacted { border-top: 3px solid #f59e0be6; }
  &.column-qualified { border-top: 3px solid #f59e0be6; }
  &.column-negotiation { border-top: 3px solid #a855f7; }
  &.column-won { border-top: 3px solid #10b981; }
  &.column-lost { border-top: 3px solid #ef4444; }
}

.column-header {
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.column-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.column-count {
  background: #e5e7eb;
  color: #6b7280;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.column-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
  transition: background 0.2s;

  &.drag-over {
    background: #e0e7ff;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;

    &:hover {
      background: #9ca3af;
    }
  }
}

// Lead Card
.lead-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
  }

  &.dragging {
    opacity: 0.5;
    cursor: grabbing;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
}

.card-client {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
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

.client-info {
  flex: 1;
  min-width: 0;
}

.client-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.company-name {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-menu {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #9ca3af;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
}

.card-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.5rem;
}

.card-type {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #3b82f6;
  background: #eff6ff;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  width: fit-content;

  .type-icon {
    width: 1rem;
    height: 1rem;
  }
}

.card-notes {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.card-manager {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  flex: 1;
  min-width: 0;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.manager-avatar {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #e5e7eb;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.625rem;
  flex-shrink: 0;
}

.card-date {
  font-size: 0.75rem;
  color: #9ca3af;
  flex-shrink: 0;
}

// Empty Column
.empty-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  color: #d1d5db;
  text-align: center;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 0.5rem;
}

.empty-column p {
  margin: 0;
  font-size: 0.875rem;
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
