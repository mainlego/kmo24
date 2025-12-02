<template>
  <div class="product-form-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <button class="back-button" @click="navigateTo('/admin/products')">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Назад к списку
        </button>
        <h1 class="page-title">{{ isNew ? 'Добавить товар' : 'Редактировать товар' }}</h1>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="saveDraft">Сохранить черновик</button>
        <button class="btn btn-primary" @click="saveProduct" :disabled="loading">
          {{ loading ? 'Сохранение...' : 'Опубликовать' }}
        </button>
      </div>
    </div>

    <div class="form-layout">
      <!-- Main Content -->
      <div class="main-content">
        <!-- Basic Info -->
        <div class="form-section">
          <h2 class="section-title">Основная информация</h2>

          <AdminFormInput
            v-model="form.name"
            label="Название товара"
            placeholder="Например: Фрезерный станок с ЧПУ HAAS VF-2"
            :required="true"
            :error="errors.name"
          />

          <AdminFormInput
            v-model="form.sku"
            label="Артикул"
            placeholder="CNC-001"
            :required="true"
            :error="errors.sku"
            hint="Уникальный код товара"
          />

          <div class="form-row">
            <AdminFormSelect
              v-model="form.category"
              label="Категория"
              :options="categories"
              value-key="value"
              label-key="label"
              :required="true"
              :error="errors.category"
            />

            <AdminFormSelect
              v-model="form.manufacturer"
              label="Производитель"
              :options="manufacturers"
              value-key="value"
              label-key="label"
            />
          </div>

          <div class="form-row">
            <AdminFormInput
              v-model="form.model"
              label="Модель"
              placeholder="VF-2"
            />

            <AdminFormInput
              v-model="form.year"
              label="Год выпуска"
              type="number"
              placeholder="2020"
            />
          </div>

          <AdminFormTextarea
            v-model="form.description"
            label="Краткое описание"
            placeholder="Краткое описание товара для карточки..."
            :rows="3"
            :maxlength="200"
            hint="Максимум 200 символов"
          />

          <AdminFormTextarea
            v-model="form.fullDescription"
            label="Полное описание"
            placeholder="Подробное описание товара со всеми характеристиками..."
            :rows="8"
          />
        </div>

        <!-- Pricing -->
        <div class="form-section">
          <h2 class="section-title">Цены и наличие</h2>

          <div class="form-row">
            <AdminFormInput
              v-model.number="form.price"
              label="Цена"
              type="number"
              placeholder="0"
              :required="true"
              :error="errors.price"
            >
              <template #suffix>₽</template>
            </AdminFormInput>

            <AdminFormInput
              v-model.number="form.oldPrice"
              label="Старая цена"
              type="number"
              placeholder="0"
              hint="Для отображения скидки"
            >
              <template #suffix>₽</template>
            </AdminFormInput>
          </div>

          <div class="form-row">
            <AdminFormInput
              v-model.number="form.stock"
              label="Остаток на складе"
              type="number"
              placeholder="0"
              :required="true"
              :error="errors.stock"
            />

            <AdminFormSelect
              v-model="form.condition"
              label="Состояние"
              :options="conditionOptions"
              value-key="value"
              label-key="label"
              :required="true"
            />
          </div>

          <AdminFormInput
            v-model="form.location"
            label="Местоположение"
            placeholder="Москва, склад №1"
            hint="Где находится товар"
          />
        </div>

        <!-- Technical Specs -->
        <div class="form-section">
          <h2 class="section-title">Технические характеристики</h2>

          <div class="specs-list">
            <div v-for="(spec, index) in form.specifications" :key="index" class="spec-item">
              <AdminFormInput
                v-model="spec.name"
                placeholder="Название характеристики"
              />
              <AdminFormInput
                v-model="spec.value"
                placeholder="Значение"
              />
              <button class="btn-icon btn-danger" @click="removeSpec(index)">
                <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <button class="btn btn-secondary" @click="addSpec">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Добавить характеристику
          </button>
        </div>

        <!-- Images -->
        <div class="form-section">
          <h2 class="section-title">Изображения</h2>

          <div class="images-grid">
            <div v-for="(image, index) in form.images" :key="index" class="image-item">
              <img :src="image" :alt="`Image ${index + 1}`" />
              <button class="remove-image" @click="removeImage(index)">
                <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div v-if="index === 0" class="main-badge">Главное</div>
            </div>

            <div class="upload-box" @click="triggerFileUpload">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                multiple
                @change="handleFileUpload"
                style="display: none"
              />
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Загрузить фото</span>
            </div>
          </div>

          <p class="hint">Первое изображение будет отображаться как главное. Перетаскивайте для изменения порядка.</p>
        </div>

        <!-- Documents -->
        <div class="form-section">
          <h2 class="section-title">Документы</h2>

          <div class="documents-list">
            <div v-for="(doc, index) in form.documents" :key="index" class="document-item">
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{{ doc.name }}</span>
              <button class="btn-icon btn-danger" @click="removeDocument(index)">
                <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <button class="btn btn-secondary" @click="triggerDocumentUpload">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Загрузить документ
          </button>
          <input
            ref="documentInput"
            type="file"
            accept=".pdf,.doc,.docx"
            @change="handleDocumentUpload"
            style="display: none"
          />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Status -->
        <div class="sidebar-section">
          <h3 class="sidebar-title">Статус</h3>
          <AdminFormSelect
            v-model="form.status"
            :options="statusOptions"
            value-key="value"
            label-key="label"
          />
        </div>

        <!-- Visibility -->
        <div class="sidebar-section">
          <h3 class="sidebar-title">Видимость</h3>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input v-model="form.featured" type="checkbox" />
              <span>Рекомендуемый</span>
            </label>
            <label class="checkbox-label">
              <input v-model="form.onSale" type="checkbox" />
              <span>Распродажа</span>
            </label>
            <label class="checkbox-label">
              <input v-model="form.newArrival" type="checkbox" />
              <span>Новинка</span>
            </label>
          </div>
        </div>

        <!-- SEO -->
        <div class="sidebar-section">
          <h3 class="sidebar-title">SEO</h3>
          <AdminFormInput
            v-model="form.metaTitle"
            label="Meta Title"
            placeholder="SEO заголовок"
            :maxlength="60"
          />
          <AdminFormTextarea
            v-model="form.metaDescription"
            label="Meta Description"
            placeholder="SEO описание"
            :rows="3"
            :maxlength="160"
          />
          <AdminFormInput
            v-model="form.slug"
            label="URL (slug)"
            placeholder="frezernyy-stanok-haas-vf-2"
            hint="Будет сгенерирован автоматически"
          />
        </div>

        <!-- Tags -->
        <div class="sidebar-section">
          <h3 class="sidebar-title">Теги</h3>
          <div class="tags-input">
            <div class="tags-list">
              <span v-for="(tag, index) in form.tags" :key="index" class="tag">
                {{ tag }}
                <button @click="removeTag(index)">
                  <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </div>
            <input
              v-model="tagInput"
              @keydown.enter.prevent="addTag"
              placeholder="Добавить тег..."
              class="tag-input"
            />
          </div>
        </div>

        <!-- Dates -->
        <div v-if="!isNew" class="sidebar-section">
          <h3 class="sidebar-title">Информация</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="info-label">Создан:</span>
              <span class="info-value">{{ formatDate(form.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Обновлен:</span>
              <span class="info-value">{{ formatDate(form.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const route = useRoute();
const { success, error } = useToast();

// State
const loading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const documentInput = ref<HTMLInputElement | null>(null);
const tagInput = ref('');

const isNew = computed(() => route.params.id === 'create');

// Form data
const form = ref({
  name: '',
  sku: '',
  category: '',
  manufacturer: '',
  model: '',
  year: '',
  description: '',
  fullDescription: '',
  price: 0,
  oldPrice: 0,
  stock: 0,
  condition: 'good',
  location: '',
  status: 'draft',
  featured: false,
  onSale: false,
  newArrival: false,
  metaTitle: '',
  metaDescription: '',
  slug: '',
  tags: [] as string[],
  specifications: [] as Array<{ name: string; value: string }>,
  images: [] as string[],
  documents: [] as Array<{ name: string; url: string }>,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const errors = ref<Record<string, string>>({});

// Options
const categories = ref<Array<{ value: string; label: string }>>([]);
const manufacturers = ref<Array<{ value: string; label: string }>>([]);

// Загрузка категорий из API
const loadCategories = async () => {
  try {
    const { apiFetch } = useApi();
    const response = await apiFetch<{ success: boolean; data: any[] }>('/categories');
    if (response.success && response.data) {
      categories.value = response.data.map(cat => ({
        value: cat._id,
        label: cat.name,
      }));
    }
  } catch {
    // Fallback к пустому списку
  }
};

// Загрузка уникальных производителей из товаров
const loadManufacturers = async () => {
  try {
    const { apiFetch } = useApi();
    const response = await apiFetch<{ success: boolean; data: any[] }>('/products?limit=1000');
    if (response.success && response.data) {
      const uniqueManufacturers = [...new Set(
        response.data
          .map((p: any) => p.manufacturer as string)
          .filter((m): m is string => Boolean(m))
      )];
      manufacturers.value = uniqueManufacturers.map((m: string) => ({
        value: m,
        label: m,
      }));
      // Добавляем "Другой" в конец
      manufacturers.value.push({ value: 'other', label: 'Другой' });
    }
  } catch {
    manufacturers.value = [{ value: 'other', label: 'Другой' }];
  }
};

const conditionOptions = ref([
  { value: 'new', label: 'Новое' },
  { value: 'excellent', label: 'Отличное' },
  { value: 'good', label: 'Хорошее' },
  { value: 'fair', label: 'Удовлетворительное' },
]);

const statusOptions = ref([
  { value: 'active', label: 'Активен' },
  { value: 'draft', label: 'Черновик' },
  { value: 'archived', label: 'Архив' },
]);

// Methods
const validateForm = () => {
  errors.value = {};

  if (!form.value.name) {
    errors.value.name = 'Название обязательно';
  }

  if (!form.value.sku) {
    errors.value.sku = 'Артикул обязателен';
  }

  if (!form.value.category) {
    errors.value.category = 'Категория обязательна';
  }

  if (!form.value.price || form.value.price <= 0) {
    errors.value.price = 'Укажите корректную цену';
  }

  if (form.value.stock < 0) {
    errors.value.stock = 'Остаток не может быть отрицательным';
  }

  return Object.keys(errors.value).length === 0;
};

const saveProduct = async () => {
  if (!validateForm()) {
    error('Пожалуйста, заполните все обязательные поля');
    return;
  }

  try {
    loading.value = true;
    const { apiFetch } = useApi();

    const productData = {
      name: form.value.name,
      sku: form.value.sku,
      slug: form.value.slug || form.value.name.toLowerCase().replace(/\s+/g, '-'),
      category: form.value.category,
      manufacturer: form.value.manufacturer,
      model: form.value.model,
      year: form.value.year ? parseInt(form.value.year) : undefined,
      description: form.value.description,
      fullDescription: form.value.fullDescription,
      price: form.value.price,
      oldPrice: form.value.oldPrice || undefined,
      stock: {
        quantity: form.value.stock || 0,
        reserved: 0,
      },
      condition: form.value.condition,
      location: form.value.location,
      isActive: true,
      isFeatured: form.value.featured,
      tags: form.value.tags,
      specifications: form.value.specifications,
      images: form.value.images.map((url: string, index: number) => ({
        url,
        alt: form.value.name,
        isMain: index === 0,
        order: index,
      })),
      seo: {
        metaTitle: form.value.metaTitle,
        metaDescription: form.value.metaDescription,
      },
    };

    if (isNew.value) {
      await apiFetch('/products', {
        method: 'POST',
        body: productData,
      });
    } else {
      await apiFetch(`/products/${route.params.id}`, {
        method: 'PUT',
        body: productData,
      });
    }

    success(isNew.value ? 'Товар успешно создан' : 'Товар успешно обновлен');
    navigateTo('/admin/products');
  } catch {
    error('Ошибка при сохранении товара');
  } finally {
    loading.value = false;
  }
};

const saveDraft = async () => {
  try {
    loading.value = true;
    const { apiFetch } = useApi();

    const productData = {
      name: form.value.name || 'Черновик',
      sku: form.value.sku || `DRAFT-${Date.now()}`,
      slug: form.value.slug || `draft-${Date.now()}`,
      category: form.value.category,
      description: form.value.description,
      price: form.value.price || 0,
      stock: { quantity: form.value.stock || 0, reserved: 0 },
      isActive: false, // Draft is inactive
    };

    if (isNew.value) {
      await apiFetch('/products', {
        method: 'POST',
        body: productData,
      });
    } else {
      await apiFetch(`/products/${route.params.id}`, {
        method: 'PUT',
        body: { ...productData, isActive: false },
      });
    }

    success('Черновик сохранен');
  } catch {
    error('Ошибка при сохранении черновика');
  } finally {
    loading.value = false;
  }
};

const addSpec = () => {
  form.value.specifications.push({ name: '', value: '' });
};

const removeSpec = (index: number) => {
  form.value.specifications.splice(index, 1);
};

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) return;

  const config = useRuntimeConfig();
  const apiBase = config.public.apiBaseUrl as string;

  loading.value = true;

  try {
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('image', file);

      // Загружаем через fetch напрямую (для FormData)
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${apiBase}/uploads/image`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();

      if (result.success && result.data) {
        form.value.images.push(result.data.url);
      } else {
        throw new Error(result.message || 'Ошибка загрузки');
      }
    }

    success(`Загружено изображений: ${files.length}`);
  } catch (err: any) {
    error(err.message || 'Ошибка при загрузке изображений');
  } finally {
    loading.value = false;
    // Сбрасываем input для повторной загрузки
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const removeImage = (index: number) => {
  form.value.images.splice(index, 1);
};

const triggerDocumentUpload = () => {
  documentInput.value?.click();
};

const handleDocumentUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files || files.length === 0) return;

  const config = useRuntimeConfig();
  const apiBase = config.public.apiBaseUrl as string;

  loading.value = true;

  try {
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('document', file);

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${apiBase}/uploads/document`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const result = await response.json();

      if (result.success && result.data) {
        form.value.documents.push({
          name: result.data.originalname,
          url: result.data.url,
        });
      } else {
        throw new Error(result.message || 'Ошибка загрузки');
      }
    }

    success(`Загружено документов: ${files.length}`);
  } catch (err: any) {
    error(err.message || 'Ошибка при загрузке документов');
  } finally {
    loading.value = false;
    if (documentInput.value) {
      documentInput.value.value = '';
    }
  }
};

const removeDocument = (index: number) => {
  form.value.documents.splice(index, 1);
};

const addTag = () => {
  if (tagInput.value.trim() && !form.value.tags.includes(tagInput.value.trim())) {
    form.value.tags.push(tagInput.value.trim());
    tagInput.value = '';
  }
};

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1);
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

onMounted(async () => {
  // Загружаем категории и производителей
  await Promise.all([loadCategories(), loadManufacturers()]);

  if (!isNew.value) {
    try {
      loading.value = true;
      const { apiFetch } = useApi();
      const response = await apiFetch<{ success: boolean; data: any }>(`/products/${route.params.id}`);

      if (response.success && response.data) {
        const product = response.data;
        form.value = {
          name: product.name || '',
          sku: product.sku || '',
          category: product.category?._id || product.category || '',
          manufacturer: product.manufacturer || '',
          model: product.model || '',
          year: product.year?.toString() || '',
          description: product.description || '',
          fullDescription: product.fullDescription || '',
          price: product.price || 0,
          oldPrice: product.oldPrice || 0,
          stock: product.stock?.quantity || 0,
          condition: product.condition || 'good',
          location: product.location || '',
          status: product.isActive ? 'active' : 'draft',
          featured: product.isFeatured || false,
          onSale: product.oldPrice > product.price,
          newArrival: false,
          metaTitle: product.seo?.metaTitle || '',
          metaDescription: product.seo?.metaDescription || '',
          slug: product.slug || '',
          tags: product.tags || [],
          specifications: product.specifications || [],
          images: product.images?.map((img: any) => img.url) || [],
          documents: product.documents || [],
          createdAt: product.createdAt || '',
          updatedAt: product.updatedAt || '',
        };
      }
    } catch {
      error('Ошибка загрузки товара');
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped lang="scss">
.product-form-page {
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

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
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
  margin: 0;
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

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.specs-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.spec-item {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.75rem;
  align-items: center;

  :deep(.form-group) {
    margin-bottom: 0;
  }
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f3f4f6;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-image {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    border: none;
    border-radius: 0.375rem;
    color: white;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;

    .icon {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  &:hover .remove-image {
    opacity: 1;
  }

  .main-badge {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: #3b82f6;
    color: white;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
  }
}

.upload-box {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #eff6ff;
  }

  .icon {
    width: 2rem;
    height: 2rem;
  }

  span {
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;

  .icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #6b7280;
    flex-shrink: 0;
  }

  span {
    flex: 1;
    font-size: 0.875rem;
    color: #374151;
  }
}

.hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-section {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
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

.tags-input {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #3b82f6;

    .icon {
      width: 0.875rem;
      height: 0.875rem;
    }
  }
}

.tag-input {
  width: 100%;
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
    color: #374151;
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
