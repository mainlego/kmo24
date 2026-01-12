<template>
  <div class="telegram-login">
    <div v-if="error" class="telegram-error">
      {{ error }}
    </div>

    <!-- Loading индикатор пока виджет загружается -->
    <div v-else-if="isLoading" class="telegram-loading">
      <span class="loading-spinner"></span>
      <span>Загрузка...</span>
    </div>

    <!-- Контейнер для Telegram виджета (показываем только когда загрузился) -->
    <div
      v-show="!isLoading && !showFallback && !error"
      ref="telegramContainer"
      class="telegram-button-container"
    ></div>

    <!-- Fallback кнопка если виджет не загрузился -->
    <button
      v-if="showFallback && !isLoading && !error"
      type="button"
      class="telegram-fallback-btn"
      @click="openTelegramBot"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
      Войти через Telegram
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits<{
  auth: [user: TelegramUser];
}>();

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const config = useRuntimeConfig();
const telegramContainer = ref<HTMLDivElement | null>(null);
const showFallback = ref(false);
const isLoading = ref(true);
const error = ref('');

// Telegram Bot username из конфига
const botUsername = config.public.telegramBotUsername || 'kmo24_bot';

// Callback для Telegram Login Widget
const handleTelegramAuth = (user: TelegramUser) => {
  console.log('TelegramLoginButton: received user data:', JSON.stringify(user));
  emit('auth', user);
};

// Делаем callback глобально доступным
// Используем уникальное имя чтобы избежать конфликтов
if (process.client) {
  (window as any).onTelegramAuth = (user: TelegramUser) => {
    console.log('Global onTelegramAuth called with:', JSON.stringify(user));
    handleTelegramAuth(user);
  };
}

const loadTelegramWidget = () => {
  if (!process.client || !telegramContainer.value) return;

  // Создаем скрипт Telegram Login Widget
  const script = document.createElement('script');
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.setAttribute('data-telegram-login', botUsername);
  script.setAttribute('data-size', 'large');
  script.setAttribute('data-radius', '8');
  script.setAttribute('data-onauth', 'window.onTelegramAuth(user)');
  script.setAttribute('data-request-access', 'write');
  script.async = true;

  script.onload = () => {
    // Проверяем, появился ли iframe виджета
    setTimeout(() => {
      isLoading.value = false;
      const iframe = telegramContainer.value?.querySelector('iframe');
      if (!iframe) {
        // Виджет не загрузился - показываем fallback
        showFallback.value = true;
      }
    }, 1500);
  };

  script.onerror = () => {
    console.error('Failed to load Telegram widget');
    isLoading.value = false;
    showFallback.value = true;
  };

  telegramContainer.value.appendChild(script);
};

// Открыть бота в Telegram
const openTelegramBot = () => {
  window.open(`https://t.me/${botUsername}`, '_blank');
};

onMounted(() => {
  loadTelegramWidget();
});

onUnmounted(() => {
  if (process.client) {
    delete (window as any).onTelegramAuth;
  }
});
</script>

<style scoped lang="scss">
.telegram-login {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}

.telegram-button-container {
  display: flex;
  justify-content: center;
  min-height: 40px;
}

.telegram-error {
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.5rem;
}

.telegram-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  min-height: 40px;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #e5e7eb;
  border-top-color: #0088cc;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.telegram-fallback-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #0088cc;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #0077b5;
    transform: translateY(-1px);
  }

  svg {
    flex-shrink: 0;
  }
}
</style>
