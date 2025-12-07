<template>
  <div class="news-form-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <button class="back-button" @click="navigateTo('/admin/news')">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Назад к списку
        </button>
        <h1 class="page-title">{{ isNew ? 'Добавить новость' : 'Редактировать новость' }}</h1>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="saveDraft" :disabled="loading">
          Сохранить черновик
        </button>
        <button class="btn btn-primary" @click="saveAndPublish" :disabled="loading">
          {{ loading ? 'Сохранение...' : 'Опубликовать' }}
        </button>
      </div>
    </div>

    <div class="form-layout">
      <!-- Main Content -->
      <div class="main-content">
        <div class="form-section">
          <h2 class="section-title">Основная информация</h2>

          <AdminFormInput
            v-model="form.title"
            label="Заголовок"
            placeholder="Введите заголовок новости"
            :required="true"
            :error="errors.title"
          />

          <AdminFormInput
            v-model="form.slug"
            label="URL (slug)"
            placeholder="novost-url"
            hint="Оставьте пустым для автогенерации"
          />

          <AdminFormTextarea
            v-model="form.excerpt"
            label="Краткое описание"
            placeholder="Краткое описание для превью..."
            :rows="3"
            :maxlength="300"
          />

          <AdminFormTextarea
            v-model="form.content"
            label="Содержание"
            placeholder="Полный текст новости..."
            :rows="15"
            :required="true"
            :error="errors.content"
          />
        </div>

        <!-- SEO -->
        <div class="form-section">
          <h2 class="section-title">SEO настройки</h2>

          <AdminFormInput
            v-model="form.metaTitle"
            label="Meta Title"
            placeholder="SEO заголовок"
          />

          <AdminFormTextarea
            v-model="form.metaDescription"
            label="Meta Description"
            placeholder="SEO описание"
            :rows="3"
            :maxlength="160"
          />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Cover Image -->
        <div class="form-section">
          <h3 class="section-title">Обложка</h3>
          <div class="cover-upload">
            <div v-if="form.coverImage" class="cover-preview">
              <img :src="getMediaUrl(form.coverImage)" alt="Cover" />
              <button class="remove-cover" @click="form.coverImage = ''">
                <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div v-else class="upload-placeholder">
              <AdminFormInput
                v-model="form.coverImage"
                label="URL изображения"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="form-section">
          <h3 class="section-title">Теги</h3>
          <div class="tags-input">
            <div class="tags-list">
              <span v-for="(tag, index) in form.tags" :key="index" class="tag">
                {{ tag }}
                <button @click="removeTag(index)" class="tag-remove">×</button>
              </span>
            </div>
            <div class="tag-add">
              <input
                v-model="tagInput"
                type="text"
                placeholder="Добавить тег"
                @keydown.enter.prevent="addTag"
              />
              <button @click="addTag" class="btn-add-tag">+</button>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div v-if="!isNew" class="form-section">
          <h3 class="section-title">Информация</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Создано:</span>
              <span class="info-value">{{ formatDate(form.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Обновлено:</span>
              <span class="info-value">{{ formatDate(form.updatedAt) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Просмотров:</span>
              <span class="info-value">{{ form.views || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from '~/composables/useToast';
import { useMediaUrl } from '../../../composables/useMediaUrl';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const route = useRoute();
const { apiFetch } = useApi();
const { success, error } = useToast();
const { getMediaUrl } = useMediaUrl();

const loading = ref(false);
const tagInput = ref('');

const isNew = computed(() => route.params.id === 'create');

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: [] as string[],
  metaTitle: '',
  metaDescription: '',
  isPublished: false,
  views: 0,
  createdAt: '',
  updatedAt: '',
});

const errors = ref<Record<string, string>>({});

const validateForm = () => {
  errors.value = {};

  if (!form.value.title.trim()) {
    errors.value.title = 'Заголовок обязателен';
  }

  if (!form.value.content.trim()) {
    errors.value.content = 'Содержание обязательно';
  }

  return Object.keys(errors.value).length === 0;
};

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const saveNews = async (publish: boolean) => {
  if (!validateForm()) {
    error('Пожалуйста, заполните обязательные поля');
    return;
  }

  try {
    loading.value = true;

    const newsData = {
      title: form.value.title,
      slug: form.value.slug || generateSlug(form.value.title),
      excerpt: form.value.excerpt,
      content: form.value.content,
      coverImage: form.value.coverImage,
      tags: form.value.tags,
      isPublished: publish,
      seo: {
        metaTitle: form.value.metaTitle || form.value.title,
        metaDescription: form.value.metaDescription || form.value.excerpt,
      },
    };

    if (isNew.value) {
      await apiFetch('/news', {
        method: 'POST',
        body: newsData,
      });
      success('Новость создана');
    } else {
      await apiFetch(`/news/${route.params.id}`, {
        method: 'PUT',
        body: newsData,
      });
      success('Новость обновлена');
    }

    navigateTo('/admin/news');
  } catch {
    error('Ошибка при сохранении новости');
  } finally {
    loading.value = false;
  }
};

const saveDraft = () => saveNews(false);
const saveAndPublish = () => saveNews(true);

const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag);
    tagInput.value = '';
  }
};

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1);
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

onMounted(async () => {
  if (!isNew.value) {
    try {
      loading.value = true;
      const response = await apiFetch<{ success: boolean; data: any }>(`/news/${route.params.id}`);
      if (response.success && response.data) {
        const news = response.data;
        form.value = {
          title: news.title || '',
          slug: news.slug || '',
          excerpt: news.excerpt || '',
          content: news.content || '',
          coverImage: news.coverImage || '',
          tags: news.tags || [],
          metaTitle: news.seo?.metaTitle || '',
          metaDescription: news.seo?.metaDescription || '',
          isPublished: news.isPublished || false,
          views: news.views || 0,
          createdAt: news.createdAt || '',
          updatedAt: news.updatedAt || '',
        };
      }
    } catch {
      error('Ошибка загрузки новости');
      navigateTo('/admin/news');
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped lang="scss">
.news-form-page {
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
  margin: 0.5rem 0 0 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.form-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.form-section {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.25rem 0;
}

.sidebar {
  .section-title {
    font-size: 0.875rem;
  }
}

.cover-upload {
  .cover-preview {
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;

    img {
      width: 100%;
      height: 180px;
      object-fit: cover;
    }

    .remove-cover {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      border-radius: 0.375rem;
      color: white;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: rgba(0, 0, 0, 0.7);
      }

      .icon {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }
}

.tags-input {
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    background: #e5e7eb;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    color: #374151;

    .tag-remove {
      background: none;
      border: none;
      padding: 0;
      color: #6b7280;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;

      &:hover {
        color: #dc2626;
      }
    }
  }

  .tag-add {
    display: flex;
    gap: 0.5rem;

    input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;

      &:focus {
        outline: none;
        border-color: #3b82f6;
      }
    }

    .btn-add-tag {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 1.25rem;
      cursor: pointer;

      &:hover {
        background: #2563eb;
      }
    }
  }
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;

  .info-label {
    color: #6b7280;
  }

  .info-value {
    color: #111827;
    font-weight: 500;
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
