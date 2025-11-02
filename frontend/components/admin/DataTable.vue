<template>
  <div class="data-table">
    <!-- Table Header with Actions -->
    <div v-if="$slots.header || searchable" class="table-header">
      <div class="header-left">
        <slot name="header" />
      </div>
      <div v-if="searchable" class="header-right">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск..."
            class="search-input"
            @input="handleSearch"
          />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th v-if="selectable" class="checkbox-cell">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate="someSelected"
                @change="toggleAll"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                column.align ? `text-${column.align}` : '',
                column.sortable ? 'sortable' : '',
                currentSort === column.key ? 'sorted' : '',
              ]"
              :style="column.width ? { width: column.width } : {}"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="th-content">
                <span>{{ column.label }}</span>
                <svg
                  v-if="column.sortable"
                  class="sort-icon"
                  :class="{ active: currentSort === column.key }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    v-if="currentSort === column.key && sortOrder === 'asc'"
                    d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"
                  />
                  <path
                    v-else-if="currentSort === column.key && sortOrder === 'desc'"
                    d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"
                  />
                  <path
                    v-else
                    d="M5 12a1 1 0 102 0V6.414l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L5 6.414V12zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"
                  />
                </svg>
              </div>
            </th>
            <th v-if="$slots.actions" class="actions-cell">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="loading-row">
            <td :colspan="totalColumns" class="loading-cell">
              <div class="loading-spinner">
                <svg class="spinner" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" stroke-width="4" />
                </svg>
                <span>Загрузка...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="!items.length" class="empty-row">
            <td :colspan="totalColumns" class="empty-cell">
              <slot name="empty">
                <div class="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p>Нет данных для отображения</p>
                </div>
              </slot>
            </td>
          </tr>
          <tr
            v-else
            v-for="(item, index) in items"
            :key="getRowKey(item, index)"
            class="data-row"
            :class="{ selected: selectedItems.includes(getRowKey(item, index)) }"
          >
            <td v-if="selectable" class="checkbox-cell">
              <input
                type="checkbox"
                :checked="selectedItems.includes(getRowKey(item, index))"
                @change="toggleRow(item, index)"
              />
            </td>
            <td
              v-for="column in columns"
              :key="column.key"
              :class="column.align ? `text-${column.align}` : ''"
            >
              <slot :name="`cell-${column.key}`" :item="item" :value="getNestedValue(item, column.key)">
                {{ formatValue(item, column) }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="actions-cell">
              <slot name="actions" :item="item" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && totalPages > 1" class="table-footer">
      <div class="pagination-info">
        Показано {{ startItem }}-{{ endItem }} из {{ total }}
      </div>
      <div class="pagination">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          class="pagination-btn"
          :class="{ active: page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  format?: (value: any, item: any) => string;
}

interface Props {
  columns: Column[];
  items: any[];
  loading?: boolean;
  selectable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  currentPage?: number;
  perPage?: number;
  total?: number;
  rowKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectable: false,
  searchable: false,
  pagination: true,
  currentPage: 1,
  perPage: 10,
  rowKey: 'id',
});

const emit = defineEmits(['update:currentPage', 'sort', 'search', 'selection-change']);

const searchQuery = ref('');
const currentSort = ref('');
const sortOrder = ref<'asc' | 'desc'>('asc');
const selectedItems = ref<any[]>([]);

const totalColumns = computed(() => {
  let count = props.columns.length;
  if (props.selectable) count++;
  if (!!slots.actions) count++;
  return count;
});

const totalPages = computed(() => Math.ceil(props.total / props.perPage));
const startItem = computed(() => (props.currentPage - 1) * props.perPage + 1);
const endItem = computed(() => Math.min(props.currentPage * props.perPage, props.total));

const allSelected = computed(() => {
  return props.items.length > 0 && selectedItems.value.length === props.items.length;
});

const someSelected = computed(() => {
  return selectedItems.value.length > 0 && selectedItems.value.length < props.items.length;
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const slots = useSlots();

const getRowKey = (item: any, index: number) => {
  return item[props.rowKey] || index;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((value, key) => value?.[key], obj);
};

const formatValue = (item: any, column: Column) => {
  const value = getNestedValue(item, column.key);
  if (column.format) {
    return column.format(value, item);
  }
  return value ?? '-';
};

const handleSort = (key: string) => {
  if (currentSort.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.value = key;
    sortOrder.value = 'asc';
  }
  emit('sort', { key, order: sortOrder.value });
};

const handleSearch = () => {
  emit('search', searchQuery.value);
};

const toggleAll = () => {
  if (allSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = props.items.map((item, index) => getRowKey(item, index));
  }
  emit('selection-change', selectedItems.value);
};

const toggleRow = (item: any, index: number) => {
  const key = getRowKey(item, index);
  const idx = selectedItems.value.indexOf(key);
  if (idx > -1) {
    selectedItems.value.splice(idx, 1);
  } else {
    selectedItems.value.push(key);
  }
  emit('selection-change', selectedItems.value);
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page);
  }
};
</script>

<style scoped lang="scss">
.data-table {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  .search-box {
    position: relative;
    width: 300px;

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.25rem;
      height: 1.25rem;
      color: #9ca3af;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 0.75rem 0.5rem 2.5rem;
      font-size: 0.875rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
  }
}

.table-wrapper {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;

    th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;

      &.sortable {
        cursor: pointer;
        user-select: none;

        &:hover {
          background: #f3f4f6;
        }
      }

      &.text-center {
        text-align: center;
      }

      &.text-right {
        text-align: right;
      }
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #e5e7eb;
      transition: background 0.2s;

      &:hover {
        background: #f9fafb;
      }

      &.selected {
        background: #eff6ff;
      }

      td {
        padding: 1rem;
        font-size: 0.875rem;
        color: #111827;

        &.text-center {
          text-align: center;
        }

        &.text-right {
          text-align: right;
        }
      }
    }
  }

  .checkbox-cell {
    width: 3rem;
    text-align: center;

    input[type="checkbox"] {
      cursor: pointer;
    }
  }

  .actions-cell {
    width: 8rem;
    text-align: right;
  }
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .sort-icon {
    width: 1rem;
    height: 1rem;
    color: #d1d5db;
    transition: color 0.2s;

    &.active {
      color: #3b82f6;
    }
  }
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 3rem 1rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #6b7280;

  .spinner {
    width: 2.5rem;
    height: 2.5rem;
    animation: spin 1s linear infinite;

    circle {
      stroke: currentColor;
      stroke-dasharray: 80, 200;
      stroke-dashoffset: 0;
      animation: dash 1.5s ease-in-out infinite;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #9ca3af;

  svg {
    width: 3rem;
    height: 3rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
}

.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;

  .pagination-info {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .pagination {
    display: flex;
    gap: 0.5rem;

    .pagination-btn {
      min-width: 2rem;
      height: 2rem;
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: #f9fafb;
        border-color: #3b82f6;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.active {
        background: #3b82f6;
        border-color: #3b82f6;
        color: white;
      }

      svg {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -35px;
  }
  100% {
    stroke-dasharray: 90, 200;
    stroke-dashoffset: -125px;
  }
}
</style>
