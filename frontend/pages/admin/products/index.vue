<template>
  <div class="admin-products">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Товары</h1>
        <p class="page-subtitle">Управление товарами интернет-магазина</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="sync1CProducts" :disabled="syncing">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ syncing ? 'Синхронизация...' : 'Синхр. с 1С' }}
        </button>
        <button class="btn btn-primary" @click="navigateTo('/admin/products/create')">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Добавить товар
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        Все товары
        <span class="tab-count">{{ stats.total }}</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === '1c' }"
        @click="activeTab = '1c'"
      >
        Из 1С
        <span class="tab-count">{{ stats1C.total }}</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'manual' }"
        @click="activeTab = 'manual'"
      >
        Добавлены вручную
        <span class="tab-count">{{ stats.total - stats1C.total }}</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters-grid">
        <AdminFormInput
          v-model="filters.search"
          placeholder="Поиск по названию, артикулу, описанию..."
          :clearable="true"
        >
          <template #prefix>
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </AdminFormInput>

        <AdminFormSelect
          v-model="filters.category"
          :options="categories"
          value-key="value"
          label-key="label"
          placeholder="Все категории"
        />

        <AdminFormSelect
          v-model="filters.condition"
          :options="conditionOptions"
          value-key="value"
          label-key="label"
          placeholder="Любое состояние"
        />

        <AdminFormSelect
          v-model="filters.status"
          :options="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="Любой статус"
        />

        <AdminFormSelect
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
    <AdminDataTable
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
          <img v-if="item.images?.[0]?.url" :src="getProductImageUrl(item.images[0].url)" :alt="item.name" />
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
        <span class="category-badge">
          {{ typeof item.category === 'string' ? item.category : item.category?.name }}
        </span>
      </template>

      <template #cell-price="{ item }">
        <div class="price-cell">
          <div class="price">{{ formatPrice(item.price) }}</div>
          <div v-if="item.oldPrice" class="old-price">{{ formatPrice(item.oldPrice) }}</div>
        </div>
      </template>

      <template #cell-stock="{ item }">
        <div class="stock-cell" :class="getStockClass(item.stock?.available || 0)">
          <div class="stock-value">{{ item.stock?.available || 0 }}</div>
          <div class="stock-label">{{ getStockLabel(item.stock?.available || 0) }}</div>
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
          <button class="btn-icon" @click.stop="editProduct(item._id)" title="Редактировать">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button class="btn-icon" @click.stop="duplicateProduct(item._id)" title="Дублировать">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button class="btn-icon btn-danger" @click.stop="deleteProduct(item._id)" title="Удалить">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </template>
    </AdminDataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from '../../../composables/useToast';
import { useProducts } from '../../../composables/useProducts';
import { useCategories } from '../../../composables/useCategories';
import { useMediaUrl } from '../../../composables/useMediaUrl';
import type { Product } from '../../../composables/useProducts';

const { getProductImageUrl } = useMediaUrl();

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { success, error } = useToast();
const {
  getProducts,
  createProduct,
  deleteProduct: deleteProductApi,
  bulkDeleteProducts,
  bulkUpdateProducts,
  getProductStats
} = useProducts();
const { getCategories } = useCategories();

// Data
const loading = ref(false);
const syncing = ref(false);
const activeTab = ref<'all' | '1c' | 'manual'>('all');
const selectedProducts = ref<string[]>([]);
const products = ref<Product[]>([]);
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
});

// Статистика товаров из 1С
const stats1C = ref({
  total: 0,
});

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
]);

const statusOptions = ref([
  { value: '', label: 'Любой статус' },
  { value: 'available', label: 'В наличии' },
  { value: 'out_of_stock', label: 'Нет в наличии' },
  { value: 'on_order', label: 'Под заказ' },
  { value: 'discontinued', label: 'Снято с производства' },
]);

const availabilityOptions = ref([
  { value: '', label: 'Любая доступность' },
  { value: 'in-stock', label: 'В наличии' },
  { value: 'low-stock', label: 'Мало на складе' },
  { value: 'out-of-stock', label: 'Нет в наличии' },
]);

// Для обратной совместимости с UI
const conditionOptions = ref([
  { value: '', label: 'Любое состояние' },
  { value: 'new', label: 'Новое' },
  { value: 'excellent', label: 'Отличное' },
  { value: 'good', label: 'Хорошее' },
  { value: 'fair', label: 'Удовлетворительное' },
]);

// Stats
const stats = ref({
  total: 0,
  active: 0,
  outOfStock: 0,
  draft: 0,
  lowStock: 0,
  inactive: 0,
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

// Computed
const filteredProducts = computed(() => products.value);

// Methods
const fetchProducts = async () => {
  loading.value = true;
  try {
    // Формируем параметры запроса
    const params: any = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      search: filters.value.search || undefined,
      category: filters.value.category || undefined,
      status: filters.value.status || undefined,
      sort: '-createdAt',
    };

    // Фильтруем по источнику товара
    if (activeTab.value === '1c') {
      params.source = '1c';
    } else if (activeTab.value === 'manual') {
      params.source = 'manual';
    }

    const response = await getProducts(params);

    if (response.success) {
      products.value = response.data || [];
      // Обновляем только total и pages, не трогая page чтобы избежать цикла watch
      if (response.pagination) {
        pagination.value.total = response.pagination.total;
        pagination.value.pages = response.pagination.pages;
        pagination.value.limit = response.pagination.limit;
      }
    }
  } catch {
    error('Ошибка при загрузке товаров');
  } finally {
    loading.value = false;
  }
};

// Синхронизация с 1С
const sync1CProducts = async () => {
  syncing.value = true;
  try {
    const { apiFetch } = useApi();
    // Запрос на синхронизацию - отправляем пустой массив для тестирования соединения
    await apiFetch('/integration/1c/products/sync', {
      method: 'POST',
      body: { products: [] },
    });
    success('Синхронизация запущена. Данные будут обновлены.');
    // Обновляем список товаров
    await fetchProducts();
    await fetch1CStats();
  } catch {
    error('Ошибка синхронизации с 1С. Проверьте настройки интеграции.');
  } finally {
    syncing.value = false;
  }
};

// Загрузка статистики товаров из 1С
const fetch1CStats = async () => {
  try {
    const { apiFetch } = useApi();
    const response = await apiFetch<{ success: boolean; data: any[] }>('/products?source=1c&limit=1');
    if (response.success) {
      // Получаем общее количество из пагинации или считаем
      stats1C.value.total = (response as any).pagination?.total || 0;
    }
  } catch {
    stats1C.value.total = 0;
  }
};

const fetchStats = async () => {
  try {
    const response = await getProductStats();
    if (response.success && response.data) {
      stats.value = {
        total: response.data.totalProducts || 0,
        active: response.data.activeProducts || 0,
        outOfStock: response.data.outOfStock || 0,
        draft: response.data.draftProducts || 0,
        lowStock: response.data.lowStock || 0,
        inactive: response.data.inactiveProducts || 0,
      };
    }
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
};

const fetchCategories = async () => {
  try {
    const response = await getCategories();
    if (response.success && response.data) {
      categories.value = [
        { value: '', label: 'Все категории' },
        ...response.data.map((cat: any) => ({
          value: cat._id,
          label: cat.name,
        })),
      ];
    }
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

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
  navigateTo(`/admin/products/${item._id}`);
};

const editProduct = (id: string) => {
  navigateTo(`/admin/products/${id}`);
};

const duplicateProduct = async (id: string) => {
  try {
    loading.value = true;
    const product = products.value.find(p => p._id === id);
    if (product) {
      const newProduct = { ...product };
      delete (newProduct as any)._id;
      newProduct.name = `${newProduct.name} (копия)`;
      newProduct.sku = `${newProduct.sku}-copy-${Date.now()}`;
      await createProduct(newProduct);
      await fetchProducts();
    }
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
    await deleteProductApi(id);
    await fetchProducts();
  } catch (err) {
    error('Ошибка при удалении товара');
  } finally {
    loading.value = false;
  }
};

const bulkActivate = async () => {
  try {
    loading.value = true;
    await bulkUpdateProducts(selectedProducts.value, { isActive: true });
    await fetchProducts();
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
    await bulkUpdateProducts(selectedProducts.value, { isActive: false });
    await fetchProducts();
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
    await bulkDeleteProducts(selectedProducts.value);
    await fetchProducts();
    selectedProducts.value = [];
  } catch (err) {
    error('Ошибка при удалении товаров');
  } finally {
    loading.value = false;
  }
};

// Watch filters
watch(
  [
    () => filters.value.search,
    () => filters.value.category,
    () => filters.value.condition,
    () => filters.value.status,
    () => filters.value.availability,
  ],
  () => {
    // При изменении фильтров сбрасываем на первую страницу
    pagination.value.page = 1;
    fetchProducts();
  }
);

watch(
  () => pagination.value.page,
  (newPage, oldPage) => {
    if (newPage !== oldPage) {
      fetchProducts();
    }
  }
);

// Перезагружаем товары при смене вкладки
watch(
  () => activeTab.value,
  () => {
    pagination.value.page = 1;
    fetchProducts();
  }
);

onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchStats(),
    fetchCategories(),
    fetch1CStats(),
  ]);
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.tabs-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;

  &:hover {
    color: #374151;
  }

  &.active {
    color: #f59e0b;
    border-bottom-color: #f59e0b;
  }

  .tab-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.25rem;
    padding: 0 0.375rem;
    background: #f3f4f6;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  &.active .tab-count {
    background: #fef3c7;
    color: #92400e;
  }
}
</style>
