<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <div class="error-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>

      <h2 class="error-title">Что-то пошло не так</h2>

      <p class="error-message">{{ errorMessage }}</p>

      <div class="error-details" v-if="showDetails && errorDetails">
        <pre>{{ errorDetails }}</pre>
      </div>

      <div class="error-actions">
        <button @click="reload" class="btn-reload">
          Перезагрузить страницу
        </button>

        <button @click="goHome" class="btn-home">
          На главную
        </button>

        <button
          v-if="isDevelopment"
          @click="showDetails = !showDetails"
          class="btn-details"
        >
          {{ showDetails ? 'Скрыть' : 'Показать' }} детали
        </button>
      </div>
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const hasError = ref(false);
const errorMessage = ref('Произошла непредвиденная ошибка');
const errorDetails = ref('');
const showDetails = ref(false);

const isDevelopment = computed(() => process.env.NODE_ENV === 'development');

// Перехват ошибок в дочерних компонентах
onErrorCaptured((error: Error, instance, info) => {
  console.error('Error captured in ErrorBoundary:', error);
  console.error('Component instance:', instance);
  console.error('Error info:', info);

  hasError.value = true;
  errorMessage.value = error.message || 'Произошла непредвиденная ошибка';

  // В режиме разработки сохраняем детали ошибки
  if (isDevelopment.value) {
    errorDetails.value = `${error.stack}\n\nComponent: ${info}`;
  }

  // Предотвращаем дальнейшее распространение ошибки
  return false;
});

// Перезагрузка страницы
const reload = () => {
  window.location.reload();
};

// Переход на главную
const goHome = () => {
  hasError.value = false;
  router.push('/');
};
</script>

<style scoped lang="scss">
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.error-container {
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  margin-bottom: 2rem;

  svg {
    color: white;
  }
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.125rem;
  color: #4a5568;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-details {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0 2rem;
  text-align: left;
  max-height: 300px;
  overflow-y: auto;

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    font-size: 0.875rem;
    color: #2d3748;
    font-family: 'Consolas', 'Monaco', monospace;
  }
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reload {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
}

.btn-home {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;

  &:hover {
    background: #edf2f7;
    border-color: #cbd5e0;
  }
}

.btn-details {
  background: #fed7d7;
  color: #c53030;

  &:hover {
    background: #fc8181;
    color: white;
  }
}

@media (max-width: 640px) {
  .error-container {
    padding: 2rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-message {
    font-size: 1rem;
  }

  .error-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>
