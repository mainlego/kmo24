<template>
  <div class="admin-news">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Новости</h1>
        <p class="page-subtitle">Управление новостями и статьями</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-secondary" @click="showTelegramSettings = true">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Telegram
        </button>
        <button class="btn btn-primary" @click="navigateTo('/admin/news/create')">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Добавить новость
        </button>
      </div>
    </div>

    <!-- Telegram Settings Modal -->
    <div v-if="showTelegramSettings" class="modal-overlay" @click="showTelegramSettings = false">
      <div class="modal telegram-modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">
            <svg class="icon telegram-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            Интеграция с Telegram
          </h2>
          <button class="close-btn" @click="showTelegramSettings = false">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Status -->
          <div class="telegram-status" :class="{ active: telegramSettings.isConfigured }">
            <div class="status-indicator"></div>
            <span>{{ telegramSettings.isConfigured ? 'Подключено' : 'Не настроено' }}</span>
          </div>

          <!-- Info -->
          <div class="telegram-info">
            <h3>Как настроить:</h3>
            <ol>
              <li>Создайте бота через <a href="https://t.me/BotFather" target="_blank">@BotFather</a></li>
              <li>Добавьте бота администратором в ваш канал</li>
              <li>Укажите переменные окружения на сервере:
                <ul>
                  <li><code>TELEGRAM_BOT_TOKEN</code> - токен бота</li>
                  <li><code>TELEGRAM_CHANNEL_ID</code> - ID канала</li>
                </ul>
              </li>
              <li>Нажмите "Установить Webhook"</li>
            </ol>
          </div>

          <!-- Channel ID -->
          <div v-if="telegramSettings.channelId" class="info-row">
            <span class="info-label">ID канала:</span>
            <span class="info-value">{{ telegramSettings.channelId }}</span>
          </div>

          <!-- Webhook URL -->
          <div class="info-row">
            <span class="info-label">Webhook URL:</span>
            <span class="info-value code">{{ telegramSettings.webhookUrl || 'Не настроен' }}</span>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn btn-secondary"
            @click="syncFromTelegram"
            :disabled="syncing || !telegramSettings.isConfigured"
          >
            <svg v-if="syncing" class="icon animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <svg v-else class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ syncing ? 'Синхронизация...' : 'Синхронизировать' }}
          </button>
          <button
            class="btn btn-primary"
            @click="setupWebhook"
            :disabled="settingWebhook || !telegramSettings.isConfigured"
          >
            <svg v-if="settingWebhook" class="icon animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ settingWebhook ? 'Настройка...' : 'Установить Webhook' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        class="tab"
        :class="{ active: activeTab === 'all' }"
        @click="activeTab = 'all'"
      >
        <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        Все новости
        <span class="tab-count">{{ stats.total }}</span>
      </button>
      <button
        class="tab"
        :class="{ active: activeTab === 'telegram' }"
        @click="activeTab = 'telegram'"
      >
        <svg class="icon telegram-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
        Из Telegram
        <span class="tab-count">{{ telegramNewsCount }}</span>
      </button>
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
      <div class="stat-card telegram-stat">
        <div class="stat-value">{{ telegramNewsCount }}</div>
        <div class="stat-label">Из Telegram</div>
      </div>
    </div>

    <!-- DataTable with news -->
    <AdminDataTable
      :columns="columns"
      :items="filteredNews"
      :loading="loading"
      @row-click="(item) => navigateTo(`/admin/news/${item.id}`)"
    >
      <template #cell-title="{ item }">
        <div class="news-title-cell">
          <div class="title">{{ item.title }}</div>
          <div class="excerpt">{{ item.excerpt }}</div>
        </div>
      </template>

      <template #cell-source="{ item }">
        <span v-if="item.telegramMessageId" class="source-badge telegram">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
          Telegram
        </span>
        <span v-else class="source-badge manual">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Вручную
        </span>
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
    </AdminDataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { apiFetch } = useApi();
const { success, error } = useToast();

const loading = ref(false);
const news = ref<any[]>([]);
const activeTab = ref<'all' | 'telegram'>('all');

// Telegram settings
const showTelegramSettings = ref(false);
const syncing = ref(false);
const settingWebhook = ref(false);
const telegramSettings = ref({
  isConfigured: false,
  channelId: null as string | null,
  syncInterval: 900000,
  webhookUrl: '',
});

const fetchTelegramSettings = async () => {
  try {
    const response = await apiFetch<{ success: boolean; data: typeof telegramSettings.value }>('/news/telegram/settings');
    if (response.success && response.data) {
      telegramSettings.value = response.data;
    }
  } catch (err) {
    console.error('Error fetching telegram settings:', err);
  }
};

const syncFromTelegram = async () => {
  syncing.value = true;
  try {
    const response = await apiFetch<{ success: boolean; data: any; message: string }>('/news/sync/telegram', { method: 'POST' });
    if (response.success) {
      // Показываем основное сообщение
      if (response.data?.message) {
        success(response.data.message);
      } else {
        success(response.message || 'Синхронизация завершена');
      }
      // Если есть созданные новости, обновляем список
      if (response.data?.created > 0) {
        await fetchNews();
      }
    }
  } catch (err: any) {
    error(err.message || 'Ошибка синхронизации');
  } finally {
    syncing.value = false;
  }
};

const setupWebhook = async () => {
  settingWebhook.value = true;
  try {
    const response = await apiFetch<{ success: boolean; data: any; message: string }>('/news/telegram/setup-webhook', { method: 'POST' });
    if (response.success) {
      success(response.message || 'Webhook установлен');
      await fetchTelegramSettings();
    }
  } catch (err: any) {
    error(err.message || 'Ошибка установки webhook');
  } finally {
    settingWebhook.value = false;
  }
};

const stats = computed(() => {
  const total = news.value.length;
  const published = news.value.filter(n => n.isPublished).length;
  const draft = total - published;
  const views = news.value.reduce((sum, n) => sum + (n.stats?.views || n.views || 0), 0);
  return { total, published, draft, views };
});

const telegramNewsCount = computed(() => {
  return news.value.filter(n => n.telegramMessageId).length;
});

const filteredNews = computed(() => {
  if (activeTab.value === 'telegram') {
    return news.value.filter(n => n.telegramMessageId);
  }
  return news.value;
});

const columns = [
  { key: 'title', label: 'Заголовок', sortable: true },
  { key: 'source', label: 'Источник', sortable: true, width: '130px' },
  { key: 'status', label: 'Статус', sortable: true },
  { key: 'publishedAt', label: 'Дата публикации', sortable: true },
  { key: 'actions', label: 'Действия', sortable: false, width: '100px' },
];

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

const fetchNews = async () => {
  try {
    loading.value = true;
    // Для админов запрашиваем все новости включая неопубликованные
    const response = await apiFetch<{ success: boolean; data: any[] }>('/news?isPublished=all&limit=100');
    if (response.success && response.data) {
      news.value = response.data.map(item => ({
        ...item,
        id: item._id,
        status: item.isPublished ? 'published' : 'draft',
        excerpt: item.content?.substring(0, 100) + '...' || '',
        telegramMessageId: item.telegramMessageId,
        telegramUrl: item.telegramUrl,
      }));
    }
  } catch {
    error('Ошибка загрузки новостей');
  } finally {
    loading.value = false;
  }
};

const togglePublish = async (item: any) => {
  try {
    const newsId = item._id || item.id;
    await apiFetch(`/news/${newsId}/publish`, { method: 'PATCH' });
    await fetchNews();
    success(item.isPublished ? 'Новость снята с публикации' : 'Новость опубликована');
  } catch {
    error('Ошибка при изменении статуса');
  }
};

const deleteNews = async (item: any) => {
  if (!confirm(`Удалить новость "${item.title}"?`)) return;

  try {
    loading.value = true;
    const newsId = item._id || item.id;
    await apiFetch(`/news/${newsId}`, { method: 'DELETE' });
    news.value = news.value.filter((n: any) => (n._id || n.id) !== newsId);
    success('Новость удалена');
  } catch {
    error('Ошибка при удалении новости');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchNews();
  fetchTelegramSettings();
});
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

// Tabs
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
  margin-bottom: -1px;

  &:hover {
    color: #374151;
  }

  &.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .telegram-icon {
    color: #0088cc;
  }
}

.tab-count {
  background: #f3f4f6;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;

  .active & {
    background: #dbeafe;
    color: #3b82f6;
  }
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

.telegram-stat {
  .stat-value {
    color: #0088cc;
  }
}

// Source badge
.source-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;

  .icon {
    width: 0.875rem;
    height: 0.875rem;
  }

  &.telegram {
    background: #e0f2fe;
    color: #0284c7;

    .icon {
      color: #0088cc;
    }
  }

  &.manual {
    background: #f3f4f6;
    color: #6b7280;
  }
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

  &.btn-secondary {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover {
      background: #f9fafb;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  max-width: 500px;
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
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.telegram-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #0088cc;
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
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.telegram-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  color: #991b1b;
  font-weight: 500;

  .status-indicator {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 9999px;
    background: #ef4444;
  }

  &.active {
    background: #ecfdf5;
    color: #065f46;

    .status-indicator {
      background: #10b981;
    }
  }
}

.telegram-info {
  margin-bottom: 1.5rem;

  h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.75rem 0;
  }

  ol {
    margin: 0;
    padding-left: 1.25rem;
    font-size: 0.875rem;
    color: #6b7280;

    li {
      margin-bottom: 0.5rem;
    }

    ul {
      margin-top: 0.5rem;
      padding-left: 1rem;
    }
  }

  a {
    color: #0088cc;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  code {
    background: #f3f4f6;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-family: monospace;
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid #e5e7eb;

  .info-label {
    font-size: 0.875rem;
    color: #6b7280;
  }

  .info-value {
    font-size: 0.875rem;
    color: #111827;
    font-weight: 500;

    &.code {
      font-family: monospace;
      font-size: 0.75rem;
      background: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
