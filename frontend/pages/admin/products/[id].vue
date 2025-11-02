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

          <FormInput
            v-model="form.name"
            label="Название товара"
            placeholder="Например: Фрезерный станок с ЧПУ HAAS VF-2"
            :required="true"
            :error="errors.name"
          />

          <FormInput
            v-model="form.sku"
            label="Артикул"
            placeholder="CNC-001"
            :required="true"
            :error="errors.sku"
            hint="Уникальный код товара"
          />

          <div class="form-row">
            <FormSelect
              v-model="form.category"
              label="Категория"
              :options="categories"
              value-key="value"
              label-key="label"
              :required="true"
              :error="errors.category"
            />

            <FormSelect
              v-model="form.manufacturer"
              label="Производитель"
              :options="manufacturers"
              value-key="value"
              label-key="label"
            />
          </div>

          <div class="form-row">
            <FormInput
              v-model="form.model"
              label="Модель"
              placeholder="VF-2"
            />

            <FormInput
              v-model="form.year"
              label="Год выпуска"
              type="number"
              placeholder="2020"
            />
          </div>

          <FormTextarea
            v-model="form.description"
            label="Краткое описание"
            placeholder="Краткое описание товара для карточки..."
            :rows="3"
            :maxlength="200"
            hint="Максимум 200 символов"
          />

          <FormTextarea
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
            <FormInput
              v-model.number="form.price"
              label="Цена"
              type="number"
              placeholder="0"
              :required="true"
              :error="errors.price"
            >
              <template #suffix>₽</template>
            </FormInput>

            <FormInput
              v-model.number="form.oldPrice"
              label="Старая цена"
              type="number"
              placeholder="0"
              hint="Для отображения скидки"
            >
              <template #suffix>₽</template>
            </FormInput>
          </div>

          <div class="form-row">
            <FormInput
              v-model.number="form.stock"
              label="Остаток на складе"
              type="number"
              placeholder="0"
              :required="true"
              :error="errors.stock"
            />

            <FormSelect
              v-model="form.condition"
              label="Состояние"
              :options="conditionOptions"
              value-key="value"
              label-key="label"
              :required="true"
            />
          </div>

          <FormInput
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
              <FormInput
                v-model="spec.name"
                placeholder="Название характеристики"
              />
              <FormInput
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
          <FormSelect
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
          <FormInput
            v-model="form.metaTitle"
            label="Meta Title"
            placeholder="SEO заголовок"
            :maxlength="60"
          />
          <FormTextarea
            v-model="form.metaDescription"
            label="Meta Description"
            placeholder="SEO описание"
            :rows="3"
            :maxlength="160"
          />
          <FormInput
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
const categories = ref([
  { value: 'cnc-machines', label: 'ЧПУ станки' },
  { value: 'metalworking', label: 'Металлообработка' },
  { value: 'woodworking', label: 'Деревообработка' },
  { value: 'welding', label: 'Сварочное оборудование' },
  { value: 'measuring', label: 'Измерительное оборудование' },
]);

const manufacturers = ref([
  { value: 'haas', label: 'HAAS' },
  { value: 'dmg-mori', label: 'DMG MORI' },
  { value: 'mazak', label: 'Mazak' },
  { value: 'okuma', label: 'Okuma' },
  { value: 'makino', label: 'Makino' },
  { value: 'other', label: 'Другой' },
]);

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
    form.value.status = 'active';

    // TODO: API call to save product
    await new Promise((resolve) => setTimeout(resolve, 1000));

    success(isNew.value ? 'Товар успешно создан' : 'Товар успешно обновлен');
    navigateTo('/admin/products');
  } catch (err) {
    error('Ошибка при сохранении товара');
  } finally {
    loading.value = false;
  }
};

const saveDraft = async () => {
  try {
    loading.value = true;
    form.value.status = 'draft';

    // TODO: API call to save product as draft
    await new Promise((resolve) => setTimeout(resolve, 1000));

    success('Черновик сохранен');
  } catch (err) {
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

  if (!files) return;

  // TODO: Upload files to server
  for (const file of Array.from(files)) {
    // Mock URL - в реальности нужно загрузить на сервер
    const mockUrl = URL.createObjectURL(file);
    form.value.images.push(mockUrl);
  }

  success(`Загружено изображений: ${files.length}`);
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

  if (!files) return;

  // TODO: Upload documents to server
  for (const file of Array.from(files)) {
    form.value.documents.push({
      name: file.name,
      url: '#', // Mock URL
    });
  }

  success(`Загружено документов: ${files.length}`);
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

onMounted(() => {
  if (!isNew.value) {
    // TODO: Fetch product data from API
    // Mock data for editing
    form.value = {
      name: 'Фрезерный станок с ЧПУ HAAS VF-2',
      sku: 'CNC-001',
      category: 'cnc-machines',
      manufacturer: 'haas',
      model: 'VF-2',
      year: '2018',
      description: 'Профессиональный фрезерный станок с ЧПУ в отличном состоянии',
      fullDescription: 'Фрезерный станок с ЧПУ HAAS VF-2 - это высокопроизводительное оборудование для точной обработки металлов. Станок был приобретен в 2018 году и использовался на производстве с соблюдением всех регламентов обслуживания.',
      price: 2500000,
      oldPrice: 2800000,
      stock: 2,
      condition: 'excellent',
      location: 'Москва, склад №1',
      status: 'active',
      featured: true,
      onSale: true,
      newArrival: false,
      metaTitle: 'Купить фрезерный станок HAAS VF-2 б/у',
      metaDescription: 'Профессиональный фрезерный станок HAAS VF-2 в отличном состоянии. Доставка по России.',
      slug: 'frezernyy-stanok-haas-vf-2',
      tags: ['ЧПУ', 'фрезерный', 'HAAS', 'металлообработка'],
      specifications: [
        { name: 'Рабочая зона X/Y/Z', value: '660 x 510 x 635 мм' },
        { name: 'Скорость шпинделя', value: '8100 об/мин' },
        { name: 'Мощность шпинделя', value: '22 кВт' },
        { name: 'Количество инструментов', value: '24' },
      ],
      images: [
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300',
        'https://via.placeholder.com/400x300',
      ],
      documents: [
        { name: 'Паспорт оборудования.pdf', url: '#' },
        { name: 'Сертификат.pdf', url: '#' },
      ],
      createdAt: '2024-01-15T10:30:00',
      updatedAt: '2024-01-20T14:45:00',
    };
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
  align-items: end;
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
