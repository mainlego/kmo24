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
          :key="category.id"
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
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { success, error } = useToast();

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

// Mock categories data (hierarchical)
const categories = ref([
  {
    id: '1',
    name: 'ЧПУ станки',
    slug: 'chpu-stanki',
    description: 'Станки с числовым программным управлением',
    icon: 'IconCNC',
    parentId: null,
    order: 1,
    isActive: true,
    productsCount: 45,
    childrenCount: 3,
    metaTitle: 'Купить ЧПУ станки б/у',
    metaDescription: 'Продажа б/у станков с ЧПУ в отличном состоянии',
    children: [
      {
        id: '1-1',
        name: 'Фрезерные',
        slug: 'frezernye-chpu',
        description: 'Фрезерные станки с ЧПУ',
        icon: '',
        parentId: '1',
        order: 1,
        isActive: true,
        productsCount: 15,
        childrenCount: 0,
        children: [],
      },
      {
        id: '1-2',
        name: 'Токарные',
        slug: 'tokarnye-chpu',
        description: 'Токарные станки с ЧПУ',
        icon: '',
        parentId: '1',
        order: 2,
        isActive: true,
        productsCount: 20,
        childrenCount: 0,
        children: [],
      },
      {
        id: '1-3',
        name: 'Лазерные',
        slug: 'lazernye-chpu',
        description: 'Лазерные станки с ЧПУ',
        icon: '',
        parentId: '1',
        order: 3,
        isActive: true,
        productsCount: 10,
        childrenCount: 0,
        children: [],
      },
    ],
  },
  {
    id: '2',
    name: 'Металлообработка',
    slug: 'metalloobrabotka',
    description: 'Станки для обработки металла',
    icon: 'IconMetal',
    parentId: null,
    order: 2,
    isActive: true,
    productsCount: 78,
    childrenCount: 2,
    children: [
      {
        id: '2-1',
        name: 'Токарные станки',
        slug: 'tokarnye-stanki',
        description: 'Универсальные токарные станки',
        icon: '',
        parentId: '2',
        order: 1,
        isActive: true,
        productsCount: 45,
        childrenCount: 0,
        children: [],
      },
      {
        id: '2-2',
        name: 'Сверлильные станки',
        slug: 'sverlilnye-stanki',
        description: 'Сверлильные и расточные станки',
        icon: '',
        parentId: '2',
        order: 2,
        isActive: true,
        productsCount: 33,
        childrenCount: 0,
        children: [],
      },
    ],
  },
  {
    id: '3',
    name: 'Деревообработка',
    slug: 'derevoobrabotka',
    description: 'Станки для обработки дерева',
    icon: 'IconWood',
    parentId: null,
    order: 3,
    isActive: true,
    productsCount: 32,
    childrenCount: 0,
    children: [],
  },
  {
    id: '4',
    name: 'Сварочное оборудование',
    slug: 'svarochnoe-oborudovanie',
    description: 'Сварочные аппараты и оборудование',
    icon: 'IconWelding',
    parentId: null,
    order: 4,
    isActive: true,
    productsCount: 25,
    childrenCount: 0,
    children: [],
  },
  {
    id: '5',
    name: 'Измерительное оборудование',
    slug: 'izmeritelnoe-oborudovanie',
    description: 'Измерительные приборы и инструменты',
    icon: 'IconMeasure',
    parentId: null,
    order: 5,
    isActive: true,
    productsCount: 18,
    childrenCount: 0,
    children: [],
  },
  {
    id: '6',
    name: 'Прессы',
    slug: 'pressy',
    description: 'Гидравлические и механические прессы',
    icon: 'IconPress',
    parentId: null,
    order: 6,
    isActive: false,
    productsCount: 0,
    childrenCount: 0,
    children: [],
  },
]);

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

  const flattenCategories = (cats: any[], level = 0) => {
    cats.forEach((cat) => {
      // Don't show self as parent option
      if (selectedCategory.value && cat.id === selectedCategory.value.id) {
        return;
      }

      options.push({
        value: cat.id,
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
    name: '',
    slug: '',
    description: '',
    icon: '',
    parentId: null,
    order: 0,
    isActive: true,
    metaTitle: '',
    metaDescription: '',
  };
  isNewCategory.value = true;
  errors.value = {};
};

const editCategory = (category: any) => {
  selectedCategory.value = { ...category };
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
    error('Пожалуйста, заполните все обязательные поля');
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

    // TODO: API call to save category
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (isNewCategory.value) {
      // Add new category
      const newCategory = {
        ...selectedCategory.value,
        id: String(Date.now()),
        productsCount: 0,
        childrenCount: 0,
        children: [],
      };

      if (selectedCategory.value.parentId) {
        // Add as child
        const addToParent = (cats: any[]): boolean => {
          for (const cat of cats) {
            if (cat.id === selectedCategory.value.parentId) {
              if (!cat.children) cat.children = [];
              cat.children.push(newCategory);
              cat.childrenCount++;
              return true;
            }
            if (cat.children && cat.children.length > 0) {
              if (addToParent(cat.children)) return true;
            }
          }
          return false;
        };
        addToParent(categories.value);
      } else {
        // Add as root
        categories.value.push(newCategory);
      }

      success('Категория успешно создана');
    } else {
      // Update existing category
      const updateCategory = (cats: any[]): boolean => {
        for (let i = 0; i < cats.length; i++) {
          if (cats[i].id === selectedCategory.value.id) {
            cats[i] = { ...cats[i], ...selectedCategory.value };
            return true;
          }
          if (cats[i].children && cats[i].children.length > 0) {
            if (updateCategory(cats[i].children)) return true;
          }
        }
        return false;
      };
      updateCategory(categories.value);

      success('Категория успешно обновлена');
    }

    closeCategoryModal();
  } catch (err) {
    error('Ошибка при сохранении категории');
  } finally {
    loading.value = false;
  }
};

const toggleCategory = async (category: any) => {
  try {
    loading.value = true;

    // TODO: API call to toggle category status
    await new Promise((resolve) => setTimeout(resolve, 300));

    const updateStatus = (cats: any[]): boolean => {
      for (const cat of cats) {
        if (cat.id === category.id) {
          cat.isActive = !cat.isActive;
          return true;
        }
        if (cat.children && cat.children.length > 0) {
          if (updateStatus(cat.children)) return true;
        }
      }
      return false;
    };
    updateStatus(categories.value);

    success(category.isActive ? 'Категория деактивирована' : 'Категория активирована');
  } catch (err) {
    error('Ошибка при изменении статуса категории');
  } finally {
    loading.value = false;
  }
};

const deleteCategory = async (category: any) => {
  if (category.productsCount > 0) {
    error('Нельзя удалить категорию с товарами');
    return;
  }

  if (category.childrenCount > 0) {
    error('Нельзя удалить категорию с подкатегориями');
    return;
  }

  if (!confirm(`Вы уверены, что хотите удалить категорию "${category.name}"?`)) return;

  try {
    loading.value = true;

    // TODO: API call to delete category
    await new Promise((resolve) => setTimeout(resolve, 500));

    const removeCategory = (cats: any[]): boolean => {
      for (let i = 0; i < cats.length; i++) {
        if (cats[i].id === category.id) {
          cats.splice(i, 1);
          return true;
        }
        if (cats[i].children && cats[i].children.length > 0) {
          if (removeCategory(cats[i].children)) {
            cats[i].childrenCount--;
            return true;
          }
        }
      }
      return false;
    };
    removeCategory(categories.value);

    success('Категория успешно удалена');
  } catch (err) {
    error('Ошибка при удалении категории');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // TODO: Fetch categories from API
});
</script>

<script lang="ts">
// Category Tree Item Component
export default {
  name: 'CategoryTreeItem',
};
</script>

<script setup lang="ts">
const props = defineProps<{
  category: any;
  level: number;
}>();

const emit = defineEmits<{
  edit: [category: any];
  delete: [category: any];
  toggle: [category: any];
}>();

const expanded = ref(true);
</script>

<template>
  <div class="tree-item" :style="{ paddingLeft: `${level * 2}rem` }">
    <div class="tree-item-content">
      <button
        v-if="category.children && category.children.length > 0"
        class="expand-btn"
        @click="expanded = !expanded"
      >
        <svg
          class="icon"
          :class="{ expanded }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div v-else class="expand-placeholder"></div>

      <div class="category-info">
        <div class="category-header">
          <span class="category-name">{{ category.name }}</span>
          <span class="category-count">{{ category.productsCount }} товаров</span>
          <span class="status-indicator" :class="{ active: category.isActive }"></span>
        </div>
        <div v-if="category.description" class="category-description">
          {{ category.description }}
        </div>
      </div>

      <div class="tree-item-actions">
        <button class="btn-icon" @click="emit('edit', category)" title="Редактировать">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          class="btn-icon"
          @click="emit('toggle', category)"
          :title="category.isActive ? 'Деактивировать' : 'Активировать'"
        >
          <svg v-if="category.isActive" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        </button>
        <button class="btn-icon btn-danger" @click="emit('delete', category)" title="Удалить">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <transition name="expand">
      <div v-if="expanded && category.children && category.children.length > 0" class="tree-children">
        <CategoryTreeItem
          v-for="child in category.children"
          :key="child.id"
          :category="child"
          :level="level + 1"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
          @toggle="emit('toggle', $event)"
        />
      </div>
    </transition>
  </div>
</template>

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

.tree-item {
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
}

.tree-item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  transition: background-color 0.2s;

  &:hover {
    background: #f9fafb;
  }
}

.expand-btn {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.25rem;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #111827;
  }

  .icon {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s;

    &.expanded {
      transform: rotate(90deg);
    }
  }
}

.expand-placeholder {
  width: 1.5rem;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.category-name {
  font-weight: 600;
  color: #111827;
  font-size: 0.9375rem;
}

.category-count {
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0.125rem 0.5rem;
  background: #f3f4f6;
  border-radius: 9999px;
}

.status-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: #ef4444;
  flex-shrink: 0;

  &.active {
    background: #10b981;
  }
}

.category-description {
  font-size: 0.8125rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-item-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.tree-children {
  overflow: hidden;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
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
