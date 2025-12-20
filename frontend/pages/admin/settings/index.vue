<template>
  <div class="admin-settings">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Настройки</h1>
        <p class="page-subtitle">Управление настройками системы</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="tab-icon" />
        {{ tab.name }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Загрузка настроек...</span>
    </div>

    <!-- Content -->
    <div v-else class="settings-content">
      <!-- Password Tab -->
      <div v-if="activeTab === 'password'" class="settings-section">
        <h2 class="section-title">Изменение пароля</h2>
        <p class="section-description">Изменить пароль вашей учетной записи администратора</p>

        <form @submit.prevent="changePassword" class="form">
          <div class="form-group">
            <label class="form-label">Текущий пароль *</label>
            <input
              v-model="passwordForm.currentPassword"
              type="password"
              class="form-input"
              placeholder="Введите текущий пароль"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Новый пароль *</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="form-input"
              placeholder="Минимум 6 символов"
              required
              minlength="6"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Подтвердите пароль *</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="form-input"
              placeholder="Повторите новый пароль"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="savingPassword">
            {{ savingPassword ? 'Сохранение...' : 'Изменить пароль' }}
          </button>
        </form>
      </div>

      <!-- Contacts Tab -->
      <div v-if="activeTab === 'contacts'" class="settings-section">
        <h2 class="section-title">Контактная информация</h2>
        <p class="section-description">Телефоны, email и адрес, отображаемые на сайте</p>

        <form @submit.prevent="saveContacts" class="form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Основной телефон</label>
              <input
                v-model="contacts.phone_main"
                type="tel"
                class="form-input"
                placeholder="+7 (391) 123-45-67"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Телефон отдела продаж</label>
              <input
                v-model="contacts.phone_sales"
                type="tel"
                class="form-input"
                placeholder="+7 (391) 987-65-43"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Основной Email</label>
              <input
                v-model="contacts.email_main"
                type="email"
                class="form-input"
                placeholder="info@kmo24.ru"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email для заказов</label>
              <input
                v-model="contacts.email_orders"
                type="email"
                class="form-input"
                placeholder="orders@kmo24.ru"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Адрес</label>
            <input
              v-model="contacts.address"
              type="text"
              class="form-input"
              placeholder="г. Красноярск, ул. Примерная, д. 1"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Часы работы</label>
            <input
              v-model="contacts.work_hours"
              type="text"
              class="form-input"
              placeholder="Пн-Пт: 9:00-18:00, Сб: 10:00-15:00"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">WhatsApp</label>
              <input
                v-model="contacts.whatsapp"
                type="tel"
                class="form-input"
                placeholder="+79001234567"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Telegram</label>
              <input
                v-model="contacts.telegram"
                type="text"
                class="form-input"
                placeholder="@kmo24"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="savingContacts">
            {{ savingContacts ? 'Сохранение...' : 'Сохранить контакты' }}
          </button>
        </form>
      </div>

      <!-- SEO Tab -->
      <div v-if="activeTab === 'seo'" class="settings-section">
        <h2 class="section-title">SEO настройки</h2>
        <p class="section-description">Meta теги и настройки для поисковых систем</p>

        <form @submit.prevent="saveSeo" class="form">
          <div class="form-group">
            <label class="form-label">Название сайта</label>
            <input
              v-model="seo.site_name"
              type="text"
              class="form-input"
              placeholder="КМО24"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Meta Title</label>
            <input
              v-model="seo.meta_title"
              type="text"
              class="form-input"
              placeholder="КМО24 - Комиссионное медицинское оборудование в Красноярске"
            />
            <span class="form-hint">Рекомендуемая длина: до 60 символов</span>
          </div>

          <div class="form-group">
            <label class="form-label">Meta Description</label>
            <textarea
              v-model="seo.meta_description"
              class="form-textarea"
              rows="3"
              placeholder="Продажа и покупка медицинского оборудования б/у в Красноярске"
            ></textarea>
            <span class="form-hint">Рекомендуемая длина: 120-160 символов</span>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="savingSeo">
            {{ savingSeo ? 'Сохранение...' : 'Сохранить SEO' }}
          </button>
        </form>
      </div>

      <!-- General Tab -->
      <div v-if="activeTab === 'general'" class="settings-section">
        <h2 class="section-title">Общие настройки</h2>
        <p class="section-description">Основные настройки сайта</p>

        <form @submit.prevent="saveGeneral" class="form">
          <div class="form-group">
            <label class="form-label">Название сайта</label>
            <input
              v-model="general.site_name"
              type="text"
              class="form-input"
              placeholder="КМО24"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Описание сайта</label>
            <textarea
              v-model="general.site_description"
              class="form-textarea"
              rows="3"
              placeholder="Комиссионное медицинское оборудование"
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="savingGeneral">
            {{ savingGeneral ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </form>
      </div>

      <!-- 1C Integration Tab -->
      <div v-if="activeTab === 'integration'" class="settings-section">
        <h2 class="section-title">Интеграция с 1С</h2>
        <p class="section-description">Настройки подключения к 1С для синхронизации товаров</p>

        <!-- Connection Status -->
        <div class="integration-status" :class="{ connected: integration1c.connected, checking: integration1c.checking }">
          <div class="status-header">
            <div class="status-indicator">
              <span class="status-dot"></span>
              <span class="status-text">
                {{ integration1c.checking ? 'Проверка подключения...' : (integration1c.connected ? 'Подключено' : 'Не подключено') }}
              </span>
            </div>
            <button
              type="button"
              class="btn btn-outline btn-sm"
              @click="checkConnection"
              :disabled="integration1c.checking"
            >
              {{ integration1c.checking ? 'Проверка...' : 'Проверить подключение' }}
            </button>
          </div>

          <div v-if="integration1c.lastCheck" class="status-details">
            <div class="status-row">
              <span class="status-label">HTTP-сервис:</span>
              <span class="status-value" :class="{ success: integration1c.httpService?.success, error: !integration1c.httpService?.success }">
                {{ integration1c.httpService?.message || 'Не проверено' }}
                <span v-if="integration1c.httpService?.responseTime" class="response-time">({{ integration1c.httpService.responseTime }})</span>
              </span>
            </div>
            <div class="status-row">
              <span class="status-label">OData:</span>
              <span class="status-value" :class="{ success: integration1c.odata?.success, error: !integration1c.odata?.success }">
                {{ integration1c.odata?.message || 'Не проверено' }}
                <span v-if="integration1c.odata?.responseTime" class="response-time">({{ integration1c.odata.responseTime }})</span>
              </span>
            </div>
            <div v-if="integration1c.odata?.entities?.length > 0" class="status-row">
              <span class="status-label">Сущности OData:</span>
              <span class="status-value entities-list">
                {{ integration1c.odata.entities.slice(0, 5).join(', ') }}
                <span v-if="integration1c.odata.entities.length > 5">и еще {{ integration1c.odata.entities.length - 5 }}</span>
              </span>
            </div>
            <div class="status-row">
              <span class="status-label">Последняя проверка:</span>
              <span class="status-value">{{ formatDate(integration1c.lastCheck) }}</span>
            </div>
          </div>
        </div>

        <!-- Sync Actions -->
        <div class="sync-actions">
          <h3 class="subsection-title">Синхронизация</h3>

          <div class="action-buttons">
            <button
              type="button"
              class="btn btn-secondary"
              @click="syncCategories"
              :disabled="syncing.categories || !integration1c.connected"
            >
              <component :is="IconRefresh" class="btn-icon" :class="{ spinning: syncing.categories }" />
              {{ syncing.categories ? 'Синхронизация...' : 'Синхронизировать категории' }}
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              @click="syncProducts"
              :disabled="syncing.products || !integration1c.connected"
            >
              <component :is="IconRefresh" class="btn-icon" :class="{ spinning: syncing.products }" />
              {{ syncing.products ? 'Синхронизация...' : 'Синхронизировать товары' }}
            </button>

            <button
              type="button"
              class="btn btn-primary"
              @click="fullSync"
              :disabled="syncing.full || !integration1c.connected"
            >
              <component :is="IconRefresh" class="btn-icon" :class="{ spinning: syncing.full }" />
              {{ syncing.full ? 'Синхронизация...' : 'Полная синхронизация' }}
            </button>
          </div>

          <div v-if="syncResult" class="sync-result" :class="{ success: syncResult.success, error: !syncResult.success }">
            <strong>{{ syncResult.success ? 'Успешно' : 'Ошибка' }}:</strong>
            {{ syncResult.message }}
            <div v-if="syncResult.stats" class="sync-stats">
              <span v-if="syncResult.stats.created">Создано: {{ syncResult.stats.created }}</span>
              <span v-if="syncResult.stats.updated">Обновлено: {{ syncResult.stats.updated }}</span>
              <span v-if="syncResult.stats.errors">Ошибок: {{ syncResult.stats.errors }}</span>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="integration-info">
          <h3 class="subsection-title">Информация</h3>
          <p class="info-text">
            Для настройки интеграции с 1С необходимо указать переменные окружения на сервере:
          </p>
          <ul class="info-list">
            <li><code>INTEGRATION_1C_ENABLED</code> - включить интеграцию (true/false)</li>
            <li><code>INTEGRATION_1C_URL</code> - URL HTTP-сервиса 1С</li>
            <li><code>INTEGRATION_1C_USER</code> - имя пользователя</li>
            <li><code>INTEGRATION_1C_PASSWORD</code> - пароль</li>
            <li><code>INTEGRATION_1C_TIMEOUT</code> - таймаут запросов (мс)</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from '~/composables/useToast';
import { useApi } from '~/composables/useApi';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { success: showSuccess, error: showError } = useToast();
const { apiFetch } = useApi();

// Icons as inline components
const IconLock = {
  template: `<svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>`
};

const IconPhone = {
  template: `<svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>`
};

const IconSearch = {
  template: `<svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>`
};

const IconCog = {
  template: `<svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>`
};

const IconDatabase = {
  template: `<svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>`
};

const IconRefresh = {
  template: `<svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>`
};

// Tabs
const tabs = [
  { id: 'password', name: 'Пароль', icon: IconLock },
  { id: 'contacts', name: 'Контакты', icon: IconPhone },
  { id: 'seo', name: 'SEO', icon: IconSearch },
  { id: 'general', name: 'Общие', icon: IconCog },
  { id: 'integration', name: '1С', icon: IconDatabase },
];

const activeTab = ref('password');
const loading = ref(true);

// Form states
const savingPassword = ref(false);
const savingContacts = ref(false);
const savingSeo = ref(false);
const savingGeneral = ref(false);

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Settings data
const contacts = ref<Record<string, string>>({});
const seo = ref<Record<string, string>>({});
const general = ref<Record<string, string>>({});

// 1C Integration state
const integration1c = ref({
  checking: false,
  connected: false,
  lastCheck: null as Date | null,
  httpService: null as any,
  odata: null as any,
});

const syncing = ref({
  categories: false,
  products: false,
  full: false,
});

const syncResult = ref<{
  success: boolean;
  message: string;
  stats?: { created?: number; updated?: number; errors?: number };
} | null>(null);

// Fetch settings
const fetchSettings = async () => {
  loading.value = true;
  try {
    const response = await apiFetch<any>('/settings');
    if (response.success && response.data) {
      contacts.value = response.data.contacts || {};
      seo.value = response.data.seo || {};
      general.value = response.data.general || {};
    }
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    // Инициализируем дефолтные настройки если их нет
    try {
      await apiFetch('/settings/init', { method: 'POST' });
      // Повторно загружаем
      const response = await apiFetch<any>('/settings');
      if (response.success && response.data) {
        contacts.value = response.data.contacts || {};
        seo.value = response.data.seo || {};
        general.value = response.data.general || {};
      }
    } catch (initError) {
      console.error('Error initializing settings:', initError);
    }
  } finally {
    loading.value = false;
  }
};

// Change password
const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    showError('Пароли не совпадают');
    return;
  }

  if (passwordForm.value.newPassword.length < 6) {
    showError('Пароль должен содержать минимум 6 символов');
    return;
  }

  savingPassword.value = true;
  try {
    await apiFetch('/settings/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      },
    });

    showSuccess('Пароль успешно изменен');
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  } catch (error: any) {
    showError(error.message || 'Ошибка при изменении пароля');
  } finally {
    savingPassword.value = false;
  }
};

// Save contacts
const saveContacts = async () => {
  savingContacts.value = true;
  try {
    await apiFetch('/settings/group/contacts', {
      method: 'PUT',
      body: contacts.value,
    });
    showSuccess('Контакты сохранены');
  } catch (error: any) {
    showError(error.message || 'Ошибка при сохранении контактов');
  } finally {
    savingContacts.value = false;
  }
};

// Save SEO
const saveSeo = async () => {
  savingSeo.value = true;
  try {
    await apiFetch('/settings/group/seo', {
      method: 'PUT',
      body: seo.value,
    });
    showSuccess('SEO настройки сохранены');
  } catch (error: any) {
    showError(error.message || 'Ошибка при сохранении SEO');
  } finally {
    savingSeo.value = false;
  }
};

// Save general
const saveGeneral = async () => {
  savingGeneral.value = true;
  try {
    await apiFetch('/settings/group/general', {
      method: 'PUT',
      body: general.value,
    });
    showSuccess('Настройки сохранены');
  } catch (error: any) {
    showError(error.message || 'Ошибка при сохранении настроек');
  } finally {
    savingGeneral.value = false;
  }
};

// 1C Integration functions
const checkConnection = async () => {
  integration1c.value.checking = true;
  syncResult.value = null;
  try {
    const response = await apiFetch<any>('/integration/1c/status');
    if (response.success && response.data) {
      integration1c.value.connected = response.data.success;
      integration1c.value.httpService = response.data.httpService;
      integration1c.value.odata = response.data.odata;
      integration1c.value.lastCheck = new Date();
    }
  } catch (error: any) {
    integration1c.value.connected = false;
    showError(error.message || 'Ошибка проверки подключения');
  } finally {
    integration1c.value.checking = false;
  }
};

const syncCategories = async () => {
  syncing.value.categories = true;
  syncResult.value = null;
  try {
    const response = await apiFetch<any>('/integration/1c/sync/categories', { method: 'POST' });
    syncResult.value = {
      success: response.success,
      message: response.message || 'Категории синхронизированы',
      stats: response.data?.stats,
    };
    if (response.success) showSuccess('Категории синхронизированы');
  } catch (error: any) {
    syncResult.value = { success: false, message: error.message || 'Ошибка синхронизации' };
    showError(error.message || 'Ошибка синхронизации категорий');
  } finally {
    syncing.value.categories = false;
  }
};

const syncProducts = async () => {
  syncing.value.products = true;
  syncResult.value = null;
  try {
    const response = await apiFetch<any>('/integration/1c/sync/products', { method: 'POST' });
    syncResult.value = {
      success: response.success,
      message: response.message || 'Товары синхронизированы',
      stats: response.data?.stats,
    };
    if (response.success) showSuccess('Товары синхронизированы');
  } catch (error: any) {
    syncResult.value = { success: false, message: error.message || 'Ошибка синхронизации' };
    showError(error.message || 'Ошибка синхронизации товаров');
  } finally {
    syncing.value.products = false;
  }
};

const fullSync = async () => {
  syncing.value.full = true;
  syncResult.value = null;
  try {
    const response = await apiFetch<any>('/integration/1c/sync/full', { method: 'POST' });
    syncResult.value = {
      success: response.success,
      message: response.message || 'Полная синхронизация завершена',
      stats: response.data?.stats,
    };
    if (response.success) showSuccess('Полная синхронизация завершена');
  } catch (error: any) {
    syncResult.value = { success: false, message: error.message || 'Ошибка синхронизации' };
    showError(error.message || 'Ошибка полной синхронизации');
  } finally {
    syncing.value.full = false;
  }
};

const formatDate = (date: Date | null) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

onMounted(() => {
  fetchSettings();
});
</script>

<style scoped lang="scss">
.admin-settings {
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.page-header {
  margin-bottom: 2rem;
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

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0;
  overflow-x: auto;

  @media (max-width: 640px) {
    gap: 0;
  }
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    color: #111827;
  }

  &.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .tab-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem;
  color: #6b7280;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.settings-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.settings-section {
  padding: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.section-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

.form {
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-hint {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

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
    background: #f3f4f6;
    color: #374151;

    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  }

  &.btn-outline {
    background: transparent;
    border: 1px solid #d1d5db;
    color: #374151;

    &:hover:not(:disabled) {
      background: #f9fafb;
    }
  }

  &.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }

  .btn-icon {
    width: 1rem;
    height: 1rem;

    &.spinning {
      animation: spin 1s linear infinite;
    }
  }
}

// 1C Integration styles
.integration-status {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 2rem;

  &.connected {
    background: #f0fdf4;
    border-color: #bbf7d0;
  }

  &.checking {
    background: #fefce8;
    border-color: #fef08a;
  }
}

.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #ef4444;

  .connected & {
    background: #22c55e;
  }

  .checking & {
    background: #eab308;
    animation: pulse 1s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-weight: 500;
  color: #991b1b;

  .connected & {
    color: #166534;
  }

  .checking & {
    color: #854d0e;
  }
}

.status-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.status-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.status-label {
  color: #6b7280;
  min-width: 120px;
}

.status-value {
  color: #374151;

  &.success {
    color: #166534;
  }

  &.error {
    color: #991b1b;
  }

  .response-time {
    color: #6b7280;
    font-size: 0.75rem;
  }
}

.entities-list {
  font-size: 0.8125rem;
  color: #6b7280;
}

.sync-actions {
  margin-bottom: 2rem;
}

.subsection-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.sync-result {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &.success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  }

  &.error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
  }
}

.sync-stats {
  margin-top: 0.5rem;
  display: flex;
  gap: 1rem;
  font-size: 0.8125rem;
}

.integration-info {
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.25rem;
}

.info-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
}

.info-list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.875rem;
  color: #374151;

  li {
    margin-bottom: 0.375rem;
  }

  code {
    background: #e5e7eb;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.8125rem;
  }
}
</style>
