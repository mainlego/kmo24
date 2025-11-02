<template>
  <div class="admin-users">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Пользователи</h1>
        <p class="page-subtitle">Управление пользователями системы</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="openCreateUserModal">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Добавить пользователя
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters-grid">
        <FormInput
          v-model="filters.search"
          placeholder="Поиск по имени, email, телефону..."
          :clearable="true"
        >
          <template #prefix>
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </FormInput>

        <FormSelect
          v-model="filters.role"
          :options="roleOptions"
          value-key="value"
          label-key="label"
          placeholder="Все роли"
        />

        <FormSelect
          v-model="filters.status"
          :options="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="Все статусы"
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
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">Всего пользователей</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.active }}</div>
        <div class="stat-label">Активных</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.customers }}</div>
        <div class="stat-label">Покупателей</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.admins }}</div>
        <div class="stat-label">Администраторов</div>
      </div>
    </div>

    <!-- Table -->
    <DataTable
      :columns="columns"
      :items="filteredUsers"
      :loading="loading"
      @row-click="viewUser"
    >
      <template #cell-user="{ item }">
        <div class="user-cell">
          <div class="avatar">
            <img v-if="item.avatar" :src="item.avatar" :alt="item.name" />
            <div v-else class="avatar-placeholder">
              {{ getInitials(item.name) }}
            </div>
          </div>
          <div class="user-info">
            <div class="name">{{ item.name }}</div>
            <div class="email">{{ item.email }}</div>
          </div>
        </div>
      </template>

      <template #cell-phone="{ item }">
        <span v-if="item.phone">{{ item.phone }}</span>
        <span v-else class="empty">Не указан</span>
      </template>

      <template #cell-role="{ item }">
        <span class="role-badge" :class="`role-${item.role}`">
          {{ getRoleLabel(item.role) }}
        </span>
      </template>

      <template #cell-status="{ item }">
        <div class="status-cell">
          <span class="status-indicator" :class="{ active: item.isActive }"></span>
          <span>{{ item.isActive ? 'Активен' : 'Заблокирован' }}</span>
        </div>
      </template>

      <template #cell-lastLogin="{ item }">
        <span v-if="item.lastLogin">{{ formatDate(item.lastLogin) }}</span>
        <span v-else class="empty">Никогда</span>
      </template>

      <template #cell-actions="{ item }">
        <div class="actions-cell">
          <button class="btn-icon" @click.stop="editUser(item)" title="Редактировать">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            class="btn-icon"
            @click.stop="toggleUserStatus(item)"
            :title="item.isActive ? 'Заблокировать' : 'Активировать'"
          >
            <svg v-if="item.isActive" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <svg v-else class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button class="btn-icon btn-danger" @click.stop="deleteUser(item)" title="Удалить">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </template>
    </DataTable>

    <!-- User Edit Modal -->
    <div v-if="selectedUser" class="modal-overlay" @click="closeUserModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ isNewUser ? 'Новый пользователь' : 'Редактирование пользователя' }}</h2>
          <button class="close-btn" @click="closeUserModal">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-section">
            <h3 class="section-title">Личная информация</h3>

            <FormInput
              v-model="selectedUser.name"
              label="Имя"
              placeholder="Иван Петров"
              :required="true"
              :error="errors.name"
            />

            <FormInput
              v-model="selectedUser.email"
              label="Email"
              type="email"
              placeholder="ivan@example.com"
              :required="true"
              :error="errors.email"
            />

            <FormInput
              v-model="selectedUser.phone"
              label="Телефон"
              type="tel"
              placeholder="+7 (999) 123-45-67"
            />

            <FormInput
              v-if="isNewUser"
              v-model="selectedUser.password"
              label="Пароль"
              type="password"
              placeholder="••••••••"
              :required="isNewUser"
              :error="errors.password"
              hint="Минимум 6 символов"
            />
          </div>

          <div class="form-section">
            <h3 class="section-title">Роль и права</h3>

            <FormSelect
              v-model="selectedUser.role"
              label="Роль"
              :options="roleOptions.filter(r => r.value)"
              value-key="value"
              label-key="label"
              :required="true"
            />

            <div class="checkbox-group">
              <label class="checkbox-label">
                <input v-model="selectedUser.isActive" type="checkbox" />
                <span>Аккаунт активен</span>
              </label>
              <label class="checkbox-label">
                <input v-model="selectedUser.emailVerified" type="checkbox" />
                <span>Email подтвержден</span>
              </label>
            </div>
          </div>

          <div v-if="!isNewUser" class="form-section">
            <h3 class="section-title">Статистика</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Заказов:</span>
                <span class="info-value">{{ selectedUser.ordersCount || 0 }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">На сумму:</span>
                <span class="info-value">{{ formatPrice(selectedUser.totalSpent || 0) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Зарегистрирован:</span>
                <span class="info-value">{{ formatDate(selectedUser.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Последний вход:</span>
                <span class="info-value">
                  {{ selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Никогда' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeUserModal">Отмена</button>
          <button class="btn btn-primary" @click="saveUser" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
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
const selectedUser = ref<any>(null);
const isNewUser = ref(false);
const errors = ref<Record<string, string>>({});

// Filters
const filters = ref({
  search: '',
  role: '',
  status: '',
});

// Filter Options
const roleOptions = ref([
  { value: '', label: 'Все роли' },
  { value: 'customer', label: 'Покупатель' },
  { value: 'manager', label: 'Менеджер' },
  { value: 'admin', label: 'Администратор' },
]);

const statusOptions = ref([
  { value: '', label: 'Все статусы' },
  { value: 'active', label: 'Активные' },
  { value: 'blocked', label: 'Заблокированные' },
]);

// Stats
const stats = ref({
  total: 284,
  active: 268,
  customers: 256,
  admins: 12,
});

// Table columns
const columns = [
  { key: 'user', label: 'Пользователь', sortable: true },
  { key: 'phone', label: 'Телефон', sortable: false },
  { key: 'role', label: 'Роль', sortable: true },
  { key: 'status', label: 'Статус', sortable: true },
  { key: 'lastLogin', label: 'Последний вход', sortable: true },
  { key: 'actions', label: 'Действия', sortable: false, width: '150px' },
];

// Mock users data
const users = ref([
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    avatar: '',
    role: 'admin',
    isActive: true,
    emailVerified: true,
    ordersCount: 15,
    totalSpent: 2500000,
    lastLogin: '2024-01-20T15:30:00',
    createdAt: '2023-01-15T10:00:00',
  },
  {
    id: '2',
    name: 'Анна Смирнова',
    email: 'anna@example.com',
    phone: '+7 (999) 234-56-78',
    avatar: '',
    role: 'customer',
    isActive: true,
    emailVerified: true,
    ordersCount: 8,
    totalSpent: 1250000,
    lastLogin: '2024-01-19T12:15:00',
    createdAt: '2023-03-20T14:30:00',
  },
  {
    id: '3',
    name: 'Сергей Иванов',
    email: 'sergey@example.com',
    phone: '',
    avatar: '',
    role: 'manager',
    isActive: true,
    emailVerified: true,
    ordersCount: 0,
    totalSpent: 0,
    lastLogin: '2024-01-18T09:45:00',
    createdAt: '2023-06-10T11:00:00',
  },
  {
    id: '4',
    name: 'Мария Козлова',
    email: 'maria@example.com',
    phone: '+7 (999) 345-67-89',
    avatar: '',
    role: 'customer',
    isActive: false,
    emailVerified: false,
    ordersCount: 2,
    totalSpent: 450000,
    lastLogin: '2023-12-25T16:20:00',
    createdAt: '2023-08-05T09:15:00',
  },
  {
    id: '5',
    name: 'Дмитрий Волков',
    email: 'dmitry@example.com',
    phone: '+7 (999) 456-78-90',
    avatar: '',
    role: 'customer',
    isActive: true,
    emailVerified: true,
    ordersCount: 12,
    totalSpent: 3200000,
    lastLogin: '2024-01-21T10:00:00',
    createdAt: '2023-02-12T13:45:00',
  },
]);

// Computed
const filteredUsers = computed(() => {
  let result = users.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.phone?.toLowerCase().includes(search)
    );
  }

  if (filters.value.role) {
    result = result.filter((u) => u.role === filters.value.role);
  }

  if (filters.value.status) {
    const isActive = filters.value.status === 'active';
    result = result.filter((u) => u.isActive === isActive);
  }

  return result;
});

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    role: '',
    status: '',
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

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: 'Администратор',
    manager: 'Менеджер',
    customer: 'Покупатель',
  };
  return labels[role] || role;
};

const openCreateUserModal = () => {
  selectedUser.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
    isActive: true,
    emailVerified: false,
  };
  isNewUser.value = true;
  errors.value = {};
};

const viewUser = (user: any) => {
  selectedUser.value = { ...user };
  isNewUser.value = false;
  errors.value = {};
};

const editUser = (user: any) => {
  viewUser(user);
};

const closeUserModal = () => {
  selectedUser.value = null;
  isNewUser.value = false;
  errors.value = {};
};

const validateUser = () => {
  errors.value = {};

  if (!selectedUser.value.name) {
    errors.value.name = 'Имя обязательно';
  }

  if (!selectedUser.value.email) {
    errors.value.email = 'Email обязателен';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedUser.value.email)) {
    errors.value.email = 'Некорректный email';
  }

  if (isNewUser.value && (!selectedUser.value.password || selectedUser.value.password.length < 6)) {
    errors.value.password = 'Пароль должен содержать минимум 6 символов';
  }

  return Object.keys(errors.value).length === 0;
};

const saveUser = async () => {
  if (!validateUser()) {
    error('Пожалуйста, заполните все обязательные поля');
    return;
  }

  try {
    loading.value = true;

    // TODO: API call to save user
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (isNewUser.value) {
      users.value.push({
        ...selectedUser.value,
        id: String(users.value.length + 1),
        ordersCount: 0,
        totalSpent: 0,
        lastLogin: null,
        createdAt: new Date().toISOString(),
      });
      success('Пользователь успешно создан');
    } else {
      const index = users.value.findIndex((u) => u.id === selectedUser.value.id);
      if (index !== -1) {
        users.value[index] = { ...selectedUser.value };
      }
      success('Пользователь успешно обновлен');
    }

    closeUserModal();
  } catch (err) {
    error('Ошибка при сохранении пользователя');
  } finally {
    loading.value = false;
  }
};

const toggleUserStatus = async (user: any) => {
  try {
    loading.value = true;

    // TODO: API call to toggle user status
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = users.value.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users.value[index].isActive = !users.value[index].isActive;
    }

    success(user.isActive ? 'Пользователь заблокирован' : 'Пользователь активирован');
  } catch (err) {
    error('Ошибка при изменении статуса пользователя');
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (user: any) => {
  if (!confirm(`Вы уверены, что хотите удалить пользователя "${user.name}"?`)) return;

  try {
    loading.value = true;

    // TODO: API call to delete user
    await new Promise((resolve) => setTimeout(resolve, 500));

    users.value = users.value.filter((u) => u.id !== user.id);
    success('Пользователь успешно удален');
  } catch (err) {
    error('Ошибка при удалении пользователя');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // TODO: Fetch users from API
});
</script>

<style scoped lang="scss">
.admin-users {
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
  grid-template-columns: 2fr 1fr 1fr auto;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info {
  flex: 1;
  min-width: 0;

  .name {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .email {
    font-size: 0.75rem;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.empty {
  color: #9ca3af;
  font-style: italic;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;

  &.role-admin {
    background: #fee2e2;
    color: #991b1b;
  }

  &.role-manager {
    background: #dbeafe;
    color: #1e40af;
  }

  &.role-customer {
    background: #f3f4f6;
    color: #374151;
  }
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
  background: #ef4444;

  &.active {
    background: #10b981;
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
  max-width: 600px;
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

.form-section {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  input[type='checkbox'] {
    width: 1.125rem;
    height: 1.125rem;
    cursor: pointer;
  }

  span {
    font-size: 0.875rem;
    color: #374151;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.btn-primary {
    background: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background: #2563eb;
    }
  }

  &.btn-secondary {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover:not(:disabled) {
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

  &.btn-danger {
    &:hover {
      background: #fee2e2;
      color: #dc2626;
    }
  }
}
</style>
