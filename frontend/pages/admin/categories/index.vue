<template>
  <div class="admin-categories">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Категории</h1>
        <p class="page-subtitle">Управление иерархией категорий товаров</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="openCreateCategoryModal">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Добавить категорию
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">Всего категорий</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.active }}</div>
        <div class="stat-label">Активных</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.withProducts }}</div>
        <div class="stat-label">С товарами</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.root }}</div>
        <div class="stat-label">Корневых</div>
      </div>
    </div>

    <!-- Categories Tree -->
    <div class="categories-card">
      <div class="card-header">
        <h2 class="card-title">Иерархия категорий</h2>
        <FormInput
          v-model="searchQuery"
          placeholder="Поиск категорий..."
          :clearable="true"
        >
          <template #prefix>
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </FormInput>
      </div>

      <div class="categories-tree">
        <CategoryTreeItem
          v-for="category in filteredCategories"
          :key="category._id"
          :category="category"
          :level="0"
          @edit="editCategory"
          @delete="deleteCategory"
          @toggle="toggleCategory"
        />

        <div v-if="filteredCategories.length === 0" class="empty-state">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>{{ searchQuery ? 'Категории не найдены' : 'Нет категорий' }}</p>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="selectedCategory" class="modal-overlay" @click="closeCategoryModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ isNewCategory ? 'Новая категория' : 'Редактирование категории' }}</h2>
          <button class="close-btn" @click="closeCategoryModal">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="form-section">
            <h3 class="section-title">Основная информация</h3>

            <FormInput
              v-model="selectedCategory.name"
              label="Название"
              placeholder="Например: ЧПУ станки"
              :required="true"
              :error="errors.name"
            />

            <FormSelect
              v-model="selectedCategory.parentId"
              label="Родительская категория"
              :options="parentCategoryOptions"
              value-key="value"
              label-key="label"
              placeholder="Корневая категория"
            />

            <FormTextarea
              v-model="selectedCategory.description"
              label="Описание"
              placeholder="Описание категории..."
              :rows="3"
            />

            <FormInput
              v-model="selectedCategory.icon"
              label="Иконка"
              placeholder="IconName"
              hint="Название SVG иконки"
            />

            <div class="form-row">
              <FormInput
                v-model.number="selectedCategory.order"
                label="Порядок сортировки"
                type="number"
                placeholder="0"
              />

              <div class="checkbox-wrapper">
                <label class="checkbox-label">
                  <input v-model="selectedCategory.isActive" type="checkbox" />
                  <span>Активна</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-title">SEO</h3>

            <FormInput
              v-model="selectedCategory.slug"
              label="URL (slug)"
              placeholder="chpu-stanki"
              hint="Будет сгенерирован автоматически из названия"
            />

            <FormInput
              v-model="selectedCategory.metaTitle"
              label="Meta Title"
              placeholder="SEO заголовок"
              :maxlength="60"
            />

            <FormTextarea
              v-model="selectedCategory.metaDescription"
              label="Meta Description"
              placeholder="SEO описание"
              :rows="3"
              :maxlength="160"
            />
          </div>

          <div v-if="!isNewCategory" class="form-section">
            <h3 class="section-title">Статистика</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Товаров:</span>
                <span class="info-value">{{ selectedCategory.productsCount || 0 }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Подкатегорий:</span>
                <span class="info-value">{{ selectedCategory.childrenCount || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeCategoryModal">Отмена</button>
          <button class="btn btn-primary" @click="saveCategory" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from '../../../composables/useToast';
import { useCategories } from '../../../composables/useCategories';
import type { Category } from '../../../composables/useCategories';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { success: showSuccess, error: showError } = useToast();
const {
  getCategories,
  getCategoryById,
  createCategory: createCategoryApi,
  updateCategory: updateCategoryApi,
  deleteCategory: deleteCategoryApi
} = useCategories();

// Data
const loading = ref(false);
const selectedCategory = ref<any>(null);
const isNewCategory = ref(false);
const errors = ref<Record<string, string>>({});
const searchQuery = ref('');

// Stats
const stats = ref({
  total: 24,
  active: 22,
  withProducts: 18,
  root: 6,
});

// Categories data
const categories = ref<Category[]>([]);

// Computed
const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return categories.value;
  }

  const search = searchQuery.value.toLowerCase();
  const filterRecursive = (cats: any[]): any[] => {
    return cats.filter((cat) => {
      const matches = cat.name.toLowerCase().includes(search);
      if (cat.children && cat.children.length > 0) {
        cat.children = filterRecursive(cat.children);
        return matches || cat.children.length > 0;
      }
      return matches;
    });
  };

  return filterRecursive(JSON.parse(JSON.stringify(categories.value)));
});

const parentCategoryOptions = computed(() => {
  const options: any[] = [{ value: null, label: 'Корневая категория' }];

  const flattenCategories = (cats: Category[], level = 0) => {
    cats.forEach((cat) => {
      // Don't show self as parent option
      if (selectedCategory.value && cat._id === selectedCategory.value._id) {
        return;
      }

      options.push({
        value: cat._id,
        label: '  '.repeat(level) + cat.name,
      });

      if (cat.children && cat.children.length > 0) {
        flattenCategories(cat.children, level + 1);
      }
    });
  };

  flattenCategories(categories.value);
  return options;
});

// Methods
const openCreateCategoryModal = () => {
  selectedCategory.value = {
    _id: '',
    name: '',
    slug: '',
    description: '',
    icon: '',
    parent: null,
    parentId: null,  // For form binding
    sortOrder: 0,
    order: 0,  // Alias for sortOrder
    isActive: true,
    metaTitle: '',
    metaDescription: '',
  };
  isNewCategory.value = true;
  errors.value = {};
};

const editCategory = (category: Category) => {
  selectedCategory.value = {
    ...category,
    parentId: typeof category.parent === 'string' ? category.parent : category.parent?._id || null,
    order: category.sortOrder || 0,
    metaTitle: category.seo?.title || '',
    metaDescription: category.seo?.description || '',
  };
  isNewCategory.value = false;
  errors.value = {};
};

const closeCategoryModal = () => {
  selectedCategory.value = null;
  isNewCategory.value = false;
  errors.value = {};
};

const validateCategory = () => {
  errors.value = {};

  if (!selectedCategory.value.name) {
    errors.value.name = 'Название обязательно';
  }

  return Object.keys(errors.value).length === 0;
};

const saveCategory = async () => {
  if (!validateCategory()) {
    showError('Пожалуйста, заполните все обязательные поля');
    return;
  }

  try {
    loading.value = true;

    // Auto-generate slug from name if not provided
    if (!selectedCategory.value.slug) {
      selectedCategory.value.slug = selectedCategory.value.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    // Prepare category data for API
    const categoryData: Partial<Category> = {
      name: selectedCategory.value.name,
      slug: selectedCategory.value.slug,
      description: selectedCategory.value.description,
      parent: selectedCategory.value.parentId || null,
      icon: selectedCategory.value.icon,
      sortOrder: selectedCategory.value.order || 0,
      isActive: selectedCategory.value.isActive,
      seo: {
        title: selectedCategory.value.metaTitle,
        description: selectedCategory.value.metaDescription,
      },
    };

    if (isNewCategory.value) {
      // Create new category via API
      await createCategoryApi(categoryData);
      showSuccess('Категория успешно создана');
    } else {
      // Update existing category via API
      await updateCategoryApi(selectedCategory.value._id, categoryData);
      showSuccess('Категория успешно обновлена');
    }

    // Refresh categories list
    await fetchCategories();
    closeCategoryModal();
  } catch (err) {
    console.error('Error saving category:', err);
    // Error message already shown by API
  } finally {
    loading.value = false;
  }
};

const toggleCategory = async (category: Category) => {
  try {
    loading.value = true;

    // Toggle category status via API
    await updateCategoryApi(category._id, { isActive: !category.isActive });

    showSuccess(!category.isActive ? 'Категория активирована' : 'Категория деактивирована');

    // Refresh categories list
    await fetchCategories();
  } catch (err) {
    console.error('Error toggling category:', err);
    // Error message already shown by API
  } finally {
    loading.value = false;
  }
};

const deleteCategory = async (category: Category) => {
  // Check if category has children
  if (category.children && category.children.length > 0) {
    showError('Нельзя удалить категорию с подкатегориями');
    return;
  }

  // TODO: Check if category has products when products API is available

  if (!confirm(`Вы уверены, что хотите удалить категорию "${category.name}"?`)) return;

  try {
    loading.value = true;

    // Delete category via API
    await deleteCategoryApi(category._id);

    showSuccess('Категория успешно удалена');

    // Refresh categories list
    await fetchCategories();
  } catch {
    // Error message already shown by API
  } finally {
    loading.value = false;
  }
};

// Функция для построения иерархического дерева категорий
const buildCategoryTree = (cats: Category[]): Category[] => {
  const categoryMap = new Map<string, Category>();
  const rootCategories: Category[] = [];

  // Создаем карту всех категорий
  cats.forEach(cat => {
    categoryMap.set(cat._id, { ...cat, children: [] });
  });

  // Строим дерево
  cats.forEach(cat => {
    const mappedCat = categoryMap.get(cat._id)!;
    if (cat.parent) {
      const parentId = typeof cat.parent === 'string' ? cat.parent : cat.parent._id;
      const parentCat = categoryMap.get(parentId);
      if (parentCat) {
        if (!parentCat.children) parentCat.children = [];
        parentCat.children.push(mappedCat);
      } else {
        rootCategories.push(mappedCat);
      }
    } else {
      rootCategories.push(mappedCat);
    }
  });

  return rootCategories;
};

// Функция для подсчета статистики
const calculateStats = (cats: Category[]) => {
  let total = 0;
  let active = 0;
  let withProducts = 0;
  let root = 0;

  const countCategories = (catList: Category[]) => {
    catList.forEach(cat => {
      total++;
      if (cat.isActive) active++;
      // TODO: добавить подсчет товаров когда будет API
      if (!cat.parent) root++;
      if (cat.children && cat.children.length > 0) {
        countCategories(cat.children);
      }
    });
  };

  countCategories(cats);

  stats.value = { total, active, withProducts, root };
};

// Fetch categories from API
const fetchCategories = async () => {
  try {
    loading.value = true;
    const data = await getCategories(true); // include inactive
    categories.value = buildCategoryTree(data);
    calculateStats(categories.value);
  } catch (err) {
    console.error('Error fetching categories:', err);
    showError('Ошибка при загрузке категорий');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped lang="scss">
.admin-categories {
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

.categories-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.categories-tree {
  padding: 1rem 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #9ca3af;

  .icon {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: end;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.checkbox-wrapper {
  padding: 0.5rem 0;
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
</style>
