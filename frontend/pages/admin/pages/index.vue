<template>
  <div class="admin-pages">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Управление страницами</h1>
        <p class="page-subtitle">Редактирование контента статических страниц сайта</p>
      </div>
    </div>

    <!-- Pages Grid -->
    <div class="pages-grid">
      <div
        v-for="page in pages"
        :key="page.id"
        class="page-card"
        @click="openEditor(page)"
      >
        <div class="page-card__icon">
          <component :is="page.icon" />
        </div>
        <div class="page-card__content">
          <h3 class="page-card__title">{{ page.name }}</h3>
          <p class="page-card__description">{{ page.description }}</p>
        </div>
        <div class="page-card__arrow">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Editor Modal -->
    <div v-if="selectedPage" class="modal-overlay" @click="closeEditor">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Редактирование: {{ selectedPage.name }}</h2>
          <button class="close-btn" @click="closeEditor">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Loading -->
          <div v-if="loadingContent" class="loading-state">
            <div class="spinner"></div>
            <span>Загрузка контента...</span>
          </div>

          <!-- Editor Form -->
          <form v-else @submit.prevent="savePageContent" class="editor-form">
            <!-- Основной контент -->
            <div class="form-section">
              <h3 class="section-title">Основной контент</h3>

              <div class="form-group">
                <label class="form-label">Заголовок страницы</label>
                <input
                  v-model="pageContent.title"
                  type="text"
                  class="form-input"
                  placeholder="Заголовок страницы"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Подзаголовок</label>
                <input
                  v-model="pageContent.subtitle"
                  type="text"
                  class="form-input"
                  placeholder="Краткое описание"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Контент (HTML)</label>
                <textarea
                  v-model="pageContent.content"
                  class="form-textarea"
                  rows="15"
                  placeholder="Введите контент страницы. Поддерживается HTML."
                ></textarea>
                <span class="form-hint">Поддерживаются HTML теги: p, h1-h6, ul, ol, li, a, strong, em, br</span>
              </div>
            </div>

            <!-- Секции для главной страницы -->
            <div v-if="selectedPage.id === 'home'" class="form-section">
              <h3 class="section-title">Секции главной страницы</h3>

              <div class="form-group">
                <label class="form-label">Hero заголовок</label>
                <input
                  v-model="pageContent.heroTitle"
                  type="text"
                  class="form-input"
                  placeholder="Главный заголовок на баннере"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Hero подзаголовок</label>
                <input
                  v-model="pageContent.heroSubtitle"
                  type="text"
                  class="form-input"
                  placeholder="Подзаголовок на баннере"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Преимущества (JSON)</label>
                <textarea
                  v-model="pageContent.advantagesJson"
                  class="form-textarea"
                  rows="8"
                  placeholder='[{"title": "Преимущество 1", "description": "Описание", "icon": "shield"}]'
                ></textarea>
                <span class="form-hint">Формат: массив объектов с полями title, description, icon</span>
              </div>
            </div>

            <!-- Контакты для страницы Контакты -->
            <div v-if="selectedPage.id === 'contacts'" class="form-section">
              <h3 class="section-title">Карта</h3>

              <div class="form-group">
                <label class="form-label">Координаты карты (lat, lng)</label>
                <input
                  v-model="pageContent.mapCoords"
                  type="text"
                  class="form-input"
                  placeholder="56.0184, 92.8672"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Zoom карты</label>
                <input
                  v-model.number="pageContent.mapZoom"
                  type="number"
                  class="form-input"
                  placeholder="15"
                  min="1"
                  max="20"
                />
              </div>
            </div>

            <!-- Доставка -->
            <div v-if="selectedPage.id === 'delivery'" class="form-section">
              <h3 class="section-title">Информация о доставке</h3>

              <div class="form-group">
                <label class="form-label">Способы доставки (JSON)</label>
                <textarea
                  v-model="pageContent.deliveryMethodsJson"
                  class="form-textarea"
                  rows="10"
                  placeholder='[{"name": "Самовывоз", "description": "Бесплатно", "price": "0 ₽"}]'
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Зоны доставки (JSON)</label>
                <textarea
                  v-model="pageContent.deliveryZonesJson"
                  class="form-textarea"
                  rows="8"
                  placeholder='[{"zone": "Красноярск", "price": "500 ₽", "time": "1-2 дня"}]'
                ></textarea>
              </div>
            </div>

            <!-- SEO -->
            <div class="form-section">
              <h3 class="section-title">SEO настройки</h3>

              <div class="form-group">
                <label class="form-label">Meta Title</label>
                <input
                  v-model="pageContent.seoTitle"
                  type="text"
                  class="form-input"
                  placeholder="Заголовок для поисковых систем"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Meta Description</label>
                <textarea
                  v-model="pageContent.seoDescription"
                  class="form-textarea"
                  rows="3"
                  placeholder="Описание для поисковых систем"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Keywords</label>
                <input
                  v-model="pageContent.seoKeywords"
                  type="text"
                  class="form-input"
                  placeholder="ключевые, слова, через, запятую"
                />
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeEditor">Отмена</button>
          <button class="btn btn-primary" @click="savePageContent" :disabled="saving">
            {{ saving ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '~/composables/useToast';
import { useApi } from '~/composables/useApi';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { success: showSuccess, error: showError } = useToast();
const { apiFetch } = useApi();

// Icons
const IconHome = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>`
};

const IconTruck = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>`
};

const IconPhone = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>`
};

const IconShield = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>`
};

const IconInfo = {
  template: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`
};

// Pages list
const pages = [
  {
    id: 'home',
    name: 'Главная страница',
    description: 'Hero-секция, преимущества, популярные товары',
    icon: IconHome,
  },
  {
    id: 'delivery',
    name: 'Доставка',
    description: 'Информация о способах и стоимости доставки',
    icon: IconTruck,
  },
  {
    id: 'contacts',
    name: 'Контакты',
    description: 'Контактная информация и карта',
    icon: IconPhone,
  },
  {
    id: 'warranty',
    name: 'Гарантия',
    description: 'Условия гарантии и возврата',
    icon: IconShield,
  },
  {
    id: 'about',
    name: 'О компании',
    description: 'Информация о компании',
    icon: IconInfo,
  },
];

// State
const selectedPage = ref<typeof pages[0] | null>(null);
const loadingContent = ref(false);
const saving = ref(false);

interface PageContent {
  title: string;
  subtitle: string;
  content: string;
  heroTitle?: string;
  heroSubtitle?: string;
  advantagesJson?: string;
  mapCoords?: string;
  mapZoom?: number;
  deliveryMethodsJson?: string;
  deliveryZonesJson?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const pageContent = ref<PageContent>({
  title: '',
  subtitle: '',
  content: '',
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
});

// Open editor
const openEditor = async (page: typeof pages[0]) => {
  selectedPage.value = page;
  loadingContent.value = true;

  try {
    const response = await apiFetch<any>(`/settings/pages/${page.id}`);
    if (response.success && response.data) {
      const data = response.data;
      pageContent.value = {
        title: data.title || '',
        subtitle: data.subtitle || '',
        content: data.content || '',
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        advantagesJson: data.advantages ? JSON.stringify(data.advantages, null, 2) : '',
        mapCoords: data.mapCoords || '',
        mapZoom: data.mapZoom || 15,
        deliveryMethodsJson: data.deliveryMethods ? JSON.stringify(data.deliveryMethods, null, 2) : '',
        deliveryZonesJson: data.deliveryZones ? JSON.stringify(data.deliveryZones, null, 2) : '',
        seoTitle: data.seo?.title || '',
        seoDescription: data.seo?.description || '',
        seoKeywords: data.seo?.keywords || '',
      };
    }
  } catch (error) {
    console.error('Error loading page content:', error);
    // Reset to defaults
    pageContent.value = {
      title: '',
      subtitle: '',
      content: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    };
  } finally {
    loadingContent.value = false;
  }
};

// Close editor
const closeEditor = () => {
  selectedPage.value = null;
};

// Save page content
const savePageContent = async () => {
  if (!selectedPage.value) return;

  saving.value = true;

  try {
    // Parse JSON fields
    let advantages = null;
    let deliveryMethods = null;
    let deliveryZones = null;

    if (pageContent.value.advantagesJson) {
      try {
        advantages = JSON.parse(pageContent.value.advantagesJson);
      } catch (e) {
        showError('Некорректный JSON в поле "Преимущества"');
        saving.value = false;
        return;
      }
    }

    if (pageContent.value.deliveryMethodsJson) {
      try {
        deliveryMethods = JSON.parse(pageContent.value.deliveryMethodsJson);
      } catch (e) {
        showError('Некорректный JSON в поле "Способы доставки"');
        saving.value = false;
        return;
      }
    }

    if (pageContent.value.deliveryZonesJson) {
      try {
        deliveryZones = JSON.parse(pageContent.value.deliveryZonesJson);
      } catch (e) {
        showError('Некорректный JSON в поле "Зоны доставки"');
        saving.value = false;
        return;
      }
    }

    const data: any = {
      title: pageContent.value.title,
      subtitle: pageContent.value.subtitle,
      content: pageContent.value.content,
      seo: {
        title: pageContent.value.seoTitle,
        description: pageContent.value.seoDescription,
        keywords: pageContent.value.seoKeywords,
      },
    };

    // Add page-specific fields
    if (selectedPage.value.id === 'home') {
      data.heroTitle = pageContent.value.heroTitle;
      data.heroSubtitle = pageContent.value.heroSubtitle;
      if (advantages) data.advantages = advantages;
    }

    if (selectedPage.value.id === 'contacts') {
      data.mapCoords = pageContent.value.mapCoords;
      data.mapZoom = pageContent.value.mapZoom;
    }

    if (selectedPage.value.id === 'delivery') {
      if (deliveryMethods) data.deliveryMethods = deliveryMethods;
      if (deliveryZones) data.deliveryZones = deliveryZones;
    }

    await apiFetch(`/settings/pages/${selectedPage.value.id}`, {
      method: 'PUT',
      body: data,
    });

    showSuccess('Страница сохранена');
    closeEditor();
  } catch (error: any) {
    showError(error.message || 'Ошибка при сохранении страницы');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped lang="scss">
.admin-pages {
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

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.page-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &__icon {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eff6ff;
    border-radius: 0.75rem;
    color: #3b82f6;
    flex-shrink: 0;

    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
  }

  &__description {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  &__arrow {
    color: #9ca3af;
    flex-shrink: 0;

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}

// Modal
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
  overflow-y: auto;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  margin: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
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

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.modal-body {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
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

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
}

.form-group {
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
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
  font-family: inherit;
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
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.8125rem;
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
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #f9fafb;
    }
  }
}
</style>
