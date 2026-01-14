<template>
  <BaseModal
    :model-value="modelValue"
    title="Синхронизация товаров из 1С"
    size="lg"
    :closable="!isRunning"
    :close-on-overlay="!isRunning"
    :close-on-esc="!isRunning"
    @update:model-value="handleClose"
  >
    <div class="sync-progress">
      <!-- Статус -->
      <div class="sync-progress__status" :class="`sync-progress__status--${status}`">
        <div class="sync-progress__status-icon">
          <svg v-if="status === 'running'" class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="30 70" />
          </svg>
          <svg v-else-if="status === 'complete'" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="status === 'error'" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="status === 'cancelled'" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="sync-progress__status-text">
          {{ statusMessage }}
        </div>
      </div>

      <!-- Прогресс бар -->
      <div v-if="total > 0" class="sync-progress__bar-container">
        <div class="sync-progress__bar">
          <div
            class="sync-progress__bar-fill"
            :class="`sync-progress__bar-fill--${status}`"
            :style="{ width: `${percent}%` }"
          />
        </div>
        <div class="sync-progress__bar-text">
          {{ current }} / {{ total }} ({{ percent }}%)
        </div>
      </div>

      <!-- Статистика -->
      <div v-if="total > 0" class="sync-progress__stats">
        <div class="sync-progress__stat sync-progress__stat--created">
          <span class="sync-progress__stat-value">{{ results.created }}</span>
          <span class="sync-progress__stat-label">Создано</span>
        </div>
        <div class="sync-progress__stat sync-progress__stat--updated">
          <span class="sync-progress__stat-value">{{ results.updated }}</span>
          <span class="sync-progress__stat-label">Обновлено</span>
        </div>
        <div class="sync-progress__stat sync-progress__stat--failed">
          <span class="sync-progress__stat-value">{{ results.failed }}</span>
          <span class="sync-progress__stat-label">Ошибки</span>
        </div>
      </div>

      <!-- Лог -->
      <div class="sync-progress__log" ref="logContainer">
        <div
          v-for="(entry, index) in logEntries"
          :key="index"
          class="sync-progress__log-entry"
          :class="`sync-progress__log-entry--${entry.type}`"
        >
          <span class="sync-progress__log-time">{{ entry.time }}</span>
          <span class="sync-progress__log-icon">
            <template v-if="entry.type === 'created'">+</template>
            <template v-else-if="entry.type === 'updated'">~</template>
            <template v-else-if="entry.type === 'failed'">!</template>
            <template v-else>*</template>
          </span>
          <span class="sync-progress__log-message">{{ entry.message }}</span>
        </div>
      </div>

      <!-- Время -->
      <div v-if="duration" class="sync-progress__duration">
        Время выполнения: {{ duration }}
      </div>
    </div>

    <template #footer>
      <button
        v-if="isRunning"
        class="btn btn--danger"
        @click="cancelSync"
      >
        Отменить синхронизацию
      </button>
      <button
        v-else
        class="btn btn--primary"
        @click="handleClose(false)"
      >
        Закрыть
      </button>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue';
import BaseModal from '~/components/common/BaseModal.vue';

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'sync-complete': [results: any];
}>();

const { $api } = useNuxtApp();
const config = useRuntimeConfig();

// State
const status = ref<'idle' | 'running' | 'complete' | 'error' | 'cancelled'>('idle');
const syncId = ref<string | null>(null);
const total = ref(0);
const current = ref(0);
const percent = ref(0);
const results = ref({ created: 0, updated: 0, failed: 0 });
const logEntries = ref<Array<{ time: string; type: string; message: string }>>([]);
const duration = ref<string | null>(null);
const logContainer = ref<HTMLElement | null>(null);
let eventSource: EventSource | null = null;

const isRunning = computed(() => status.value === 'running');

const statusMessage = computed(() => {
  switch (status.value) {
    case 'idle':
      return 'Подготовка к синхронизации...';
    case 'running':
      return 'Синхронизация в процессе...';
    case 'complete':
      return 'Синхронизация завершена успешно';
    case 'error':
      return 'Произошла ошибка';
    case 'cancelled':
      return 'Синхронизация отменена';
    default:
      return '';
  }
});

// Добавить запись в лог
const addLog = (type: string, message: string) => {
  const now = new Date();
  const time = now.toLocaleTimeString('ru-RU');
  logEntries.value.push({ time, type, message });

  // Автопрокрутка вниз
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  });
};

// Начать синхронизацию
const startSync = async () => {
  // Сброс состояния
  status.value = 'running';
  total.value = 0;
  current.value = 0;
  percent.value = 0;
  results.value = { created: 0, updated: 0, failed: 0 };
  logEntries.value = [];
  duration.value = null;

  addLog('info', 'Начинаем синхронизацию...');

  try {
    // Получаем токен
    const token = useCookie('token').value;
    if (!token) {
      throw new Error('Не авторизован');
    }

    // Создаём SSE соединение
    const apiUrl = config.public.apiUrl || '';
    const url = `${apiUrl}/integration/1c/sync/products/stream`;

    eventSource = new EventSource(`${url}?token=${token}`, {
      withCredentials: true,
    });

    // Workaround: EventSource не поддерживает заголовки, используем fetch с token в query
    // Альтернатива - использовать fetch с ReadableStream
    eventSource.close();

    // Используем fetch для SSE с авторизацией
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'text/event-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Не удалось создать reader');
    }

    let buffer = '';

    const processLine = (line: string) => {
      if (line.startsWith('event: ')) {
        // Сохраняем тип события
        buffer = line.substring(7);
      } else if (line.startsWith('data: ')) {
        const eventType = buffer;
        const data = JSON.parse(line.substring(6));
        handleEvent(eventType, data);
        buffer = '';
      }
    };

    const readStream = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.trim()) {
            processLine(line);
          }
        }
      }
    };

    await readStream();

  } catch (error: any) {
    status.value = 'error';
    addLog('error', `Ошибка: ${error.message}`);
  }
};

// Обработка событий SSE
const handleEvent = (eventType: string, data: any) => {
  switch (eventType) {
    case 'start':
      syncId.value = data.syncId;
      addLog('info', data.message);
      break;

    case 'progress':
      if (data.phase === 'fetch') {
        addLog('info', data.message);
      } else {
        total.value = data.total || total.value;
        current.value = data.current || current.value;
        percent.value = data.percent || percent.value;
        results.value.created = data.created || results.value.created;
        results.value.updated = data.updated || results.value.updated;
        results.value.failed = data.failed || results.value.failed;
      }
      break;

    case 'item':
      if (data.action === 'created') {
        addLog('created', `Создан: ${data.name} (${data.sku})`);
      } else if (data.action === 'updated') {
        addLog('updated', `Обновлен: ${data.name} (${data.sku})`);
      } else if (data.action === 'failed') {
        addLog('failed', `Ошибка: ${data.name} - ${data.error}`);
      }
      break;

    case 'complete':
      status.value = 'complete';
      duration.value = data.duration;
      addLog('info', `Синхронизация завершена: создано ${data.results.created}, обновлено ${data.results.updated}, ошибок ${data.results.failed}`);
      emit('sync-complete', data.results);
      break;

    case 'error':
      status.value = 'error';
      addLog('error', `Ошибка: ${data.message}`);
      break;

    case 'cancelled':
      status.value = 'cancelled';
      addLog('info', data.message);
      break;
  }
};

// Отменить синхронизацию
const cancelSync = async () => {
  if (!syncId.value) return;

  try {
    await $api(`/integration/1c/sync/cancel/${syncId.value}`, {
      method: 'POST',
    });
    addLog('info', 'Запрос на отмену отправлен...');
  } catch (error: any) {
    addLog('error', `Не удалось отменить: ${error.message}`);
  }
};

// Закрытие модального окна
const handleClose = (value: boolean) => {
  if (isRunning.value) {
    return; // Не закрываем во время синхронизации
  }
  emit('update:modelValue', value);
};

// Запуск синхронизации при открытии
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && status.value === 'idle') {
    startSync();
  }
  if (!isOpen) {
    // Сброс при закрытии
    status.value = 'idle';
    eventSource?.close();
    eventSource = null;
  }
});

onUnmounted(() => {
  eventSource?.close();
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.sync-progress {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;

  &__status {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-md $spacing-lg;
    border-radius: $radius-lg;
    background: $gray-100;

    &--running {
      background: $primary-50;
      color: $primary-700;
    }

    &--complete {
      background: $success-50;
      color: $success-700;
    }

    &--error {
      background: $danger-50;
      color: $danger-700;
    }

    &--cancelled {
      background: $warning-50;
      color: $warning-700;
    }
  }

  &__status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__status-text {
    font-weight: $font-weight-medium;
    font-size: $font-size-base;
  }

  &__bar-container {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__bar {
    height: 8px;
    background: $gray-200;
    border-radius: $radius-full;
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    background: $primary-500;
    border-radius: $radius-full;
    transition: width 0.3s ease;

    &--complete {
      background: $success-500;
    }

    &--error {
      background: $danger-500;
    }

    &--cancelled {
      background: $warning-500;
    }
  }

  &__bar-text {
    font-size: $font-size-sm;
    color: $gray-600;
    text-align: right;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $spacing-md;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-md;
    border-radius: $radius-lg;
    background: $gray-50;

    &--created {
      background: $success-50;

      .sync-progress__stat-value {
        color: $success-600;
      }
    }

    &--updated {
      background: $primary-50;

      .sync-progress__stat-value {
        color: $primary-600;
      }
    }

    &--failed {
      background: $danger-50;

      .sync-progress__stat-value {
        color: $danger-600;
      }
    }
  }

  &__stat-value {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
  }

  &__stat-label {
    font-size: $font-size-sm;
    color: $gray-600;
  }

  &__log {
    max-height: 300px;
    overflow-y: auto;
    background: $gray-900;
    border-radius: $radius-lg;
    padding: $spacing-md;
    font-family: monospace;
    font-size: $font-size-sm;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: $gray-800;
    }

    &::-webkit-scrollbar-thumb {
      background: $gray-600;
      border-radius: $radius-full;
    }
  }

  &__log-entry {
    display: flex;
    gap: $spacing-sm;
    padding: $spacing-xs 0;
    color: $gray-300;

    &--created {
      color: $success-400;
    }

    &--updated {
      color: $primary-400;
    }

    &--failed {
      color: $danger-400;
    }

    &--info {
      color: $gray-400;
    }

    &--error {
      color: $danger-400;
    }
  }

  &__log-time {
    color: $gray-500;
    flex-shrink: 0;
  }

  &__log-icon {
    flex-shrink: 0;
    width: 16px;
    text-align: center;
  }

  &__log-message {
    word-break: break-word;
  }

  &__duration {
    text-align: center;
    font-size: $font-size-sm;
    color: $gray-600;
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

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-sm $spacing-lg;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  border-radius: $radius-lg;
  border: none;
  cursor: pointer;
  transition: all $transition-base;

  &--primary {
    background: $primary-500;
    color: $white;

    &:hover {
      background: $primary-600;
    }
  }

  &--danger {
    background: $danger-500;
    color: $white;

    &:hover {
      background: $danger-600;
    }
  }
}
</style>
