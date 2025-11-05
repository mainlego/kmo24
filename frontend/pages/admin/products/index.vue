<template>
  <div class="admin-products">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Товары</h1>
        <p class="page-subtitle">Управление товарами интернет-магазина</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="navigateTo('/admin/products/create')">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Добавить товар
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters-grid">
        <FormInput
          v-model="filters.search"
          placeholder="Поиск по названию, артикулу, описанию..."
          :clearable="true"
        >
          <template #prefix>
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </FormInput>

        <FormSelect
          v-model="filters.category"
          :options="categories"
          value-key="value"
          label-key="label"
          placeholder="Все категории"
        />

        <FormSelect
          v-model="filters.condition"
          :options="conditionOptions"
          value-key="value"
          label-key="label"
          placeholder="Любое состояние"
        />

        <FormSelect
          v-model="filters.status"
          :options="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="Любой статус"
        />

        <FormSelect
          v-model="filters.availability"
          :options="availabilityOptions"
          value-key="value"
          label-key="label"
          placeholder="Любая доступность"
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
        <div class="stat-label">Всего товаров</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.active }}</div>
        <div class="stat-label">Активных</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.outOfStock }}</div>
        <div class="stat-label">Нет в наличии</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.draft }}</div>
        <div class="stat-label">Черновики</div>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedProducts.length > 0" class="bulk-actions">
      <div class="bulk-info">
        Выбрано товаров: <strong>{{ selectedProducts.length }}</strong>
      </div>
      <div class="bulk-buttons">
        <button class="btn btn-secondary" @click="bulkActivate">Активировать</button>
        <button class="btn btn-secondary" @click="bulkDeactivate">Деактивировать</button>
        <button class="btn btn-danger" @click="bulkDelete">Удалить</button>
      </div>
    </div>

    <!-- Table -->
    <DataTable
      :columns="columns"
      :items="filteredProducts"
      :loading="loading"
      :selectable="true"
      :searchable="false"
      v-model:selected="selectedProducts"
      @row-click="handleRowClick"
    >
      <template #cell-image="{ item }">
        <div class="product-image">
          <img v-if="item.images?.[0]" :src="item.images[0]" :alt="item.name" />
          <div v-else class="no-image">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </template>

      <template #cell-name="{ item }">
        <div class="product-name">
          <div class="name">{{ item.name }}</div>
          <div class="sku">Артикул: {{ item.sku }}</div>
        </div>
      </template>

      <template #cell-category="{ item }">
        <span class="category-badge">{{ item.category }}</span>
      </template>

      <template #cell-price="{ item }">
        <div class="price-cell">
          <div class="price">{{ formatPrice(item.price) }}</div>
          <div v-if="item.oldPrice" class="old-price">{{ formatPrice(item.oldPrice) }}</div>
        </div>
      </template>

      <template #cell-stock="{ item }">
        <div class="stock-cell" :class="getStockClass(item.stock)">
          <div class="stock-value">{{ item.stock }}</div>
          <div class="stock-label">{{ getStockLabel(item.stock) }}</div>
        </div>
      </template>

      <template #cell-condition="{ item }">
        <span class="condition-badge" :class="`condition-${item.condition}`">
          {{ getConditionLabel(item.condition) }}
        </span>
      </template>

      <template #cell-status="{ item }">
        <span class="status-badge" :class="`status-${item.status}`">
          {{ getStatusLabel(item.status) }}
        </span>
      </template>

      <template #cell-actions="{ item }">
        <div class="actions-cell">
          <button class="btn-icon" @click.stop="editProduct(item.id)" title="Редактировать">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button class="btn-icon" @click.stop="duplicateProduct(item.id)" title="Дублировать">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button class="btn-icon btn-danger" @click.stop="deleteProduct(item.id)" title="Удалить">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </template>
    </DataTable>
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
const selectedProducts = ref<string[]>([]);

// Filters
const filters = ref({
  search: '',
  category: '',
  condition: '',
  status: '',
  availability: '',
});

// Filter Options
const categories = ref([
  { value: '', label: 'Все категории' },
  { value: 'cnc-machines', label: 'ЧПУ станки' },
  { value: 'metalworking', label: 'Металлообработка' },
  { value: 'woodworking', label: 'Деревообработка' },
  { value: 'welding', label: 'Сварочное оборудование' },
  { value: 'measuring', label: 'Измерительное оборудование' },
]);

const conditionOptions = ref([
  { value: '', label: 'Любое состояние' },
  { value: 'new', label: 'Новое' },
  { value: 'excellent', label: 'Отличное' },
  { value: 'good', label: 'Хорошее' },
  { value: 'fair', label: 'Удовлетворительное' },
]);

const statusOptions = ref([
  { value: '', label: 'Любой статус' },
  { value: 'active', label: 'Активен' },
  { value: 'draft', label: 'Черновик' },
  { value: 'archived', label: 'Архив' },
]);

const availabilityOptions = ref([
  { value: '', label: 'Любая доступность' },
  { value: 'in-stock', label: 'В наличии' },
  { value: 'low-stock', label: 'Мало на складе' },
  { value: 'out-of-stock', label: 'Нет в наличии' },
]);

// Stats
const stats = ref({
  total: 284,
  active: 256,
  outOfStock: 12,
  draft: 16,
});

// Table columns
const columns = [
  { key: 'image', label: 'Фото', sortable: false, width: '80px' },
  { key: 'name', label: 'Название', sortable: true },
  { key: 'category', label: 'Категория', sortable: true },
  { key: 'price', label: 'Цена', sortable: true, align: 'right' as const },
  { key: 'stock', label: 'Остаток', sortable: true, align: 'center' as const },
  { key: 'condition', label: 'Состояние', sortable: true },
  { key: 'status', label: 'Статус', sortable: true },
  { key: 'actions', label: 'Действия', sortable: false, width: '150px' },
];

// Mock products data
const products = ref([
  {
    id: '1',
    name: 'Фрезерный станок с ЧПУ HAAS VF-2',
    sku: 'CNC-001',
    category: 'ЧПУ станки',
    price: 2500000,
    oldPrice: 2800000,
    stock: 2,
    condition: 'excellent',
    status: 'active',
    images: ['https://via.placeholder.com/100'],
  },
  {
    id: '2',
    name: 'Токарный станок 16К20',
    sku: 'LAT-001',
    category: 'Металлообработка',
    price: 450000,
    oldPrice: null,
    stock: 5,
    condition: 'good',
    status: 'active',
    images: [],
  },
  {
    id: '3',
    name: 'Сверлильный станок 2С132',
    sku: 'DRL-001',
    category: 'Металлообработка',
    price: 120000,
    oldPrice: null,
    stock: 0,
    condition: 'fair',
    status: 'active',
    images: ['https://via.placeholder.com/100'],
  },
  {
    id: '4',
    name: 'Координатно-расточной станок 2А450',
    sku: 'CRD-001',
    category: 'Металлообработка',
    price: 850000,
    oldPrice: null,
    stock: 1,
    condition: 'good',
    status: 'draft',
    images: [],
  },
  {
    id: '5',
    name: 'Деревообрабатывающий станок JET JWP-15DH',
    sku: 'WOD-001',
    category: 'Деревообработка',
    price: 95000,
    oldPrice: 110000,
    stock: 8,
    condition: 'new',
    status: 'active',
    images: ['https://via.placeholder.com/100'],
  },
]);

// Computed
const filteredProducts = computed(() => {
  let result = products.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.sku.toLowerCase().includes(search)
    );
  }

  if (filters.value.category) {
    result = result.filter((p) => p.category === filters.value.category);
  }

  if (filters.value.condition) {
    result = result.filter((p) => p.condition === filters.value.condition);
  }

  if (filters.value.status) {
    result = result.filter((p) => p.status === filters.value.status);
  }

  if (filters.value.availability) {
    result = result.filter((p) => {
      if (filters.value.availability === 'in-stock') return p.stock > 5;
      if (filters.value.availability === 'low-stock') return p.stock > 0 && p.stock <= 5;
      if (filters.value.availability === 'out-of-stock') return p.stock === 0;
      return true;
    });
  }

  return result;
});

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    condition: '',
    status: '',
    availability: '',
  };
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};

const getStockClass = (stock: number) => {
  if (stock === 0) return 'out-of-stock';
  if (stock <= 5) return 'low-stock';
  return 'in-stock';
};

const getStockLabel = (stock: number) => {
  if (stock === 0) return 'Нет в наличии';
  if (stock <= 5) return 'Мало';
  return 'В наличии';
};

const getConditionLabel = (condition: string) => {
  const labels: Record<string, string> = {
    new: 'Новое',
    excellent: 'Отличное',
    good: 'Хорошее',
    fair: 'Удовлетворительное',
  };
  return labels[condition] || condition;
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Активен',
    draft: 'Черновик',
    archived: 'Архив',
  };
  return labels[status] || status;
};

const handleRowClick = (item: any) => {
  navigateTo(`/admin/products/${item.id}`);
};

const editProduct = (id: string) => {
  navigateTo(`/admin/products/${id}`);
};

const duplicateProduct = async (id: string) => {
  try {
    loading.value = true;
    // TODO: API call to duplicate product
    await new Promise((resolve) => setTimeout(resolve, 500));
    success('Товар успешно дублирован');
  } catch (err) {
    error('Ошибка при дублировании товара');
  } finally {
    loading.value = false;
  }
};

const deleteProduct = async (id: string) => {
  if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

  try {
    loading.value = true;
    // TODO: API call to delete product
    await new Promise((resolve) => setTimeout(resolve, 500));
    products.value = products.value.filter((p) => p.id !== id);
    success('Товар успешно удален');
  } catch (err) {
    error('Ошибка при удалении товара');
  } finally {
    loading.value = false;
  }
};

const bulkActivate = async () => {
  try {
    loading.value = true;
    // TODO: API call to activate products
    await new Promise((resolve) => setTimeout(resolve, 500));
    success(`Активировано товаров: ${selectedProducts.value.length}`);
    selectedProducts.value = [];
  } catch (err) {
    error('Ошибка при активации товаров');
  } finally {
    loading.value = false;
  }
};

const bulkDeactivate = async () => {
  try {
    loading.value = true;
    // TODO: API call to deactivate products
    await new Promise((resolve) => setTimeout(resolve, 500));
    success(`Деактивировано товаров: ${selectedProducts.value.length}`);
    selectedProducts.value = [];
  } catch (err) {
    error('Ошибка при деактивации товаров');
  } finally {
    loading.value = false;
  }
};

const bulkDelete = async () => {
  if (!confirm(`Вы уверены, что хотите удалить ${selectedProducts.value.length} товаров?`)) return;

  try {
    loading.value = true;
    // TODO: API call to delete products
    await new Promise((resolve) => setTimeout(resolve, 500));
    products.value = products.value.filter((p) => !selectedProducts.value.includes(p.id));
    success(`Удалено товаров: ${selectedProducts.value.length}`);
    selectedProducts.value = [];
  } catch (err) {
    error('Ошибка при удалении товаров');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // TODO: Fetch products from API
});
</script>

<style scoped lang="scss">
.admin-products {
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
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

.bulk-actions {
  background: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
}

.bulk-info {
  font-size: 0.875rem;
  color: #1e40af;
}

.bulk-buttons {
  display: flex;
  gap: 0.75rem;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 0.375rem;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    color: #9ca3af;

    .icon {
      width: 2rem;
      height: 2rem;
    }
  }
}

.product-name {
  .name {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .sku {
    font-size: 0.75rem;
    color: #6b7280;
  }
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.price-cell {
  text-align: right;

  .price {
    font-weight: 600;
    color: #111827;
  }

  .old-price {
    font-size: 0.75rem;
    color: #9ca3af;
    text-decoration: line-through;
  }
}

.stock-cell {
  text-align: center;

  .stock-value {
    font-weight: 600;
    font-size: 1.125rem;
  }

  .stock-label {
    font-size: 0.75rem;
    margin-top: 0.125rem;
  }

  &.in-stock {
    .stock-value {
      color: #10b981;
    }
    .stock-label {
      color: #059669;
    }
  }

  &.low-stock {
    .stock-value {
      color: #f59e0be6;
    }
    .stock-label {
      color: #d97706;
    }
  }

  &.out-of-stock {
    .stock-value {
      color: #ef4444;
    }
    .stock-label {
      color: #dc2626;
    }
  }
}

.condition-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;

  &.condition-new {
    background: #dcfce7;
    color: #15803d;
  }

  &.condition-excellent {
    background: #dbeafe;
    color: #1e40af;
  }

  &.condition-good {
    background: #fef3c7;
    color: #a16207;
  }

  &.condition-fair {
    background: #fed7aa;
    color: #9a3412;
  }
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;

  &.status-active {
    background: #dcfce7;
    color: #15803d;
  }

  &.status-draft {
    background: #f3f4f6;
    color: #6b7280;
  }

  &.status-archived {
    background: #fee2e2;
    color: #991b1b;
  }
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
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

  &.btn-primary {
    background: #3b82f6;
    color: white;

    &:hover {
      background: #2563eb;
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

  &.btn-danger {
    background: #ef4444;
    color: white;

    &:hover {
      background: #dc2626;
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
