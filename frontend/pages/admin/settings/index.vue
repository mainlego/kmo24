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

// Tabs
const tabs = [
  { id: 'password', name: 'Пароль', icon: IconLock },
  { id: 'contacts', name: 'Контакты', icon: IconPhone },
  { id: 'seo', name: 'SEO', icon: IconSearch },
  { id: 'general', name: 'Общие', icon: IconCog },
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
}
</style>
