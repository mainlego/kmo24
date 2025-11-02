<template>
  <div class="admin-news">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Новости</h1>
        <p class="page-subtitle">Управление новостями и статьями</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="navigateTo('/admin/news/create')">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Добавить новость
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">Всего новостей</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.published }}</div>
        <div class="stat-label">Опубликовано</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.draft }}</div>
        <div class="stat-label">Черновики</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.views }}</div>
        <div class="stat-label">Просмотров</div>
      </div>
    </div>

    <!-- DataTable with news -->
    <DataTable
      :columns="columns"
      :items="news"
      :loading="loading"
      @row-click="(item) => navigateTo(`/admin/news/${item.id}`)"
    >
      <template #cell-title="{ item }">
        <div class="news-title-cell">
          <div class="title">{{ item.title }}</div>
          <div class="excerpt">{{ item.excerpt }}</div>
        </div>
      </template>

      <template #cell-status="{ item }">
        <span class="status-badge" :class="`status-${item.status}`">
          {{ item.status === 'published' ? 'Опубликовано' : 'Черновик' }}
        </span>
      </template>

      <template #cell-publishedAt="{ item }">
        {{ item.publishedAt ? formatDate(item.publishedAt) : '-' }}
      </template>

      <template #cell-actions="{ item }">
        <div class="actions-cell">
          <button class="btn-icon" @click.stop="navigateTo(`/admin/news/${item.id}`)" title="Редактировать">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button class="btn-icon btn-danger" @click.stop="deleteNews(item)" title="Удалить">
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
import { ref } from 'vue';
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { success, error } = useToast();

const loading = ref(false);

const stats = ref({
  total: 45,
  published: 38,
  draft: 7,
  views: 15420,
});

const columns = [
  { key: 'title', label: 'Заголовок', sortable: true },
  { key: 'status', label: 'Статус', sortable: true },
  { key: 'publishedAt', label: 'Дата публикации', sortable: true },
  { key: 'actions', label: 'Действия', sortable: false, width: '100px' },
];

const news = ref([
  {
    id: '1',
    title: 'Поступление новых ЧПУ станков',
    excerpt: 'В наш ассортимент поступила новая партия фрезерных станков с ЧПУ HAAS...',
    status: 'published',
    publishedAt: '2024-01-15T10:00:00',
  },
  {
    id: '2',
    title: 'Акция на токарные станки',
    excerpt: 'Специальное предложение на токарные станки - скидки до 20%...',
    status: 'published',
    publishedAt: '2024-01-18T14:00:00',
  },
  {
    id: '3',
    title: 'Новый склад в Санкт-Петербурге',
    excerpt: 'Мы открыли новый склад в Санкт-Петербурге для более быстрой доставки...',
    status: 'draft',
    publishedAt: null,
  },
]);

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

const deleteNews = async (item: any) => {
  if (!confirm(`Удалить новость "${item.title}"?`)) return;

  try {
    loading.value = true;
    // TODO: API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    news.value = news.value.filter((n) => n.id !== item.id);
    success('Новость удалена');
  } catch (err) {
    error('Ошибка при удалении новости');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.admin-news {
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

.news-title-cell {
  .title {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.25rem;
  }

  .excerpt {
    font-size: 0.75rem;
    color: #6b7280;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;

  &.status-published {
    background: #dcfce7;
    color: #15803d;
  }

  &.status-draft {
    background: #f3f4f6;
    color: #6b7280;
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
