<template>
  <div class="admin-products-page">
    <div class="page-header">
      <div>
        <h1>Товары</h1>
        <p>Управление товарами интернет-магазина</p>
      </div>
      <button class="btn-primary" @click="navigateTo('/admin/products/create')">
        Добавить товар
      </button>
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
        <div class="stat-value">{{ stats.lowStock }}</div>
        <div class="stat-label">Заканчиваются</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <input
        v-model="filters.search"
        type="text"
        placeholder="Поиск по названию или артикулу..."
        class="filter-input"
        @input="debouncedLoadProducts"
      />

      <select v-model="filters.category" class="filter-select" @change="loadProducts">
        <option value="">Все категории</option>
        <option v-for="cat in categories" :key="cat._id" :value="cat._id">
          {{ cat.name }}
        </option>
      </select>

      <select v-model="filters.status" class="filter-select" @change="loadProducts">
        <option value="">Любой статус</option>
        <option value="available">В наличии</option>
        <option value="out_of_stock">Нет в наличии</option>
        <option value="on_order">Под заказ</option>
        <option value="discontinued">Снято с производства</option>
      </select>

      <button class="btn-secondary" @click="resetFilters">
        Сбросить фильтры
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      Загрузка...
    </div>

    <!-- Products Table -->
    <div v-else-if="products.length > 0" class="table-container">
      <table class="products-table">
        <thead>
          <tr>
            <th>Изображение</th>
            <th>Название</th>
            <th>Артикул</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Остаток</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td>
              <img
                v-if="product.images && product.images.length > 0"
                :src="product.images[0].url"
                :alt="product.name"
                class="product-thumb"
              />
              <div v-else class="no-image">Нет фото</div>
            </td>
            <td>
              <strong>{{ product.name }}</strong>
            </td>
            <td>{{ product.sku }}</td>
            <td>
              <span v-if="typeof product.category === 'object'">
                {{ product.category.name }}
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ formatPrice(product.price) }}</td>
            <td>
              <span
                :class="{
                  'stock-ok': product.stock.quantity > 5,
                  'stock-low': product.stock.quantity > 0 && product.stock.quantity <= 5,
                  'stock-out': product.stock.quantity === 0,
                }"
              >
                {{ product.stock.quantity }}
              </span>
            </td>
            <td>
              <span class="badge" :class="`badge-${product.status}`">
                {{ getStatusLabel(product.status) }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button
                  class="btn-icon"
                  title="Редактировать"
                  @click="navigateTo(`/admin/products/${product._id}`)"
                >
                  ✏️
                </button>
                <button
                  class="btn-icon"
                  title="Удалить"
                  @click="handleDelete(product._id)"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination">
        <button
          class="btn-secondary"
          :disabled="pagination.page === 1"
          @click="prevPage"
        >
          ← Назад
        </button>
        <span class="page-info">
          Страница {{ pagination.page }} из {{ pagination.pages }}
          (всего: {{ pagination.total }})
        </span>
        <button
          class="btn-secondary"
          :disabled="pagination.page >= pagination.pages"
          @click="nextPage"
        >
          Вперед →
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>Товары не найдены</p>
      <button class="btn-primary" @click="resetFilters">
        Сбросить фильтры
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts';
import type { Category } from '~/composables/useCategories';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { getProducts, deleteProduct, getProductStats } = useProducts();
const { getCategories } = useCategories();
const { success, error } = useToast();

// State
const loading = ref(false);
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0,
});

const filters = ref({
  search: '',
  category: '',
  status: '',
  page: 1,
  limit: 20,
});

const stats = ref({
  total: 0,
  active: 0,
  outOfStock: 0,
  lowStock: 0,
});

// Methods
const loadProducts = async () => {
  loading.value = true;
  try {
    const response = await getProducts(filters.value);
    products.value = response.data;
    pagination.value = response.pagination;
  } catch (err: any) {
    error(err.message || 'Ошибка при загрузке товаров');
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  try {
    const cats = await getCategories(true);
    categories.value = cats;
  } catch (err) {
    console.error('Failed to load categories:', err);
  }
};

const loadStats = async () => {
  try {
    const statsData = await getProductStats();
    stats.value = statsData;
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
};

const handleDelete = async (id: string) => {
  if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

  try {
    await deleteProduct(id);
    await Promise.all([loadProducts(), loadStats()]);
  } catch (err: any) {
    error(err.message || 'Ошибка при удалении товара');
  }
};

const resetFilters = () => {
  filters.value = {
    search: '',
    category: '',
    status: '',
    page: 1,
    limit: 20,
  };
  loadProducts();
};

const nextPage = () => {
  if (pagination.value.page < pagination.value.pages) {
    filters.value.page++;
    loadProducts();
  }
};

const prevPage = () => {
  if (pagination.value.page > 1) {
    filters.value.page--;
    loadProducts();
  }
};

// Debounced search
let searchTimeout: NodeJS.Timeout;
const debouncedLoadProducts = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filters.value.page = 1;
    loadProducts();
  }, 500);
};

// Helpers
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    available: 'В наличии',
    out_of_stock: 'Нет в наличии',
    on_order: 'Под заказ',
    discontinued: 'Снято',
  };
  return labels[status] || status;
};

// Watch filters
watch(
  () => [filters.value.category, filters.value.status],
  () => {
    filters.value.page = 1;
    loadProducts();
  }
);

// Initial load
onMounted(async () => {
  await Promise.all([
    loadProducts(),
    loadCategories(),
    loadStats(),
  ]);
});
</script>

<style scoped>
.admin-products-page {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
}

.page-header p {
  color: #666;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-label {
  color: #6b7280;
  margin-top: 0.5rem;
}

.filters-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-input,
.filter-select {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.products-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.product-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.no-image {
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #9ca3af;
}

.stock-ok {
  color: #10b981;
  font-weight: 600;
}

.stock-low {
  color: #f59e0b;
  font-weight: 600;
}

.stock-out {
  color: #ef4444;
  font-weight: 600;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-available {
  background: #d1fae5;
  color: #065f46;
}

.badge-out_of_stock {
  background: #fee2e2;
  color: #991b1b;
}

.badge-on_order {
  background: #fef3c7;
  color: #92400e;
}

.badge-discontinued {
  background: #e5e7eb;
  color: #374151;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.25rem;
}

.btn-icon:hover {
  opacity: 0.7;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.page-info {
  color: #6b7280;
}
</style>
