<template>
  <div class="reset-page">
    <div class="reset-container">
      <div class="reset-card">
        <div class="reset-header">
          <h1 class="reset-title">Сброс пароля</h1>
          <p class="reset-subtitle">Введите новый пароль для вашего аккаунта</p>
        </div>

        <!-- Форма сброса пароля -->
        <form v-if="!success && !tokenError" @submit.prevent="handleResetPassword" class="reset-form">
          <div class="form-group">
            <label for="password" class="form-label">Новый пароль</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="form-input"
              placeholder="Минимум 6 символов"
              required
              minlength="6"
              autocomplete="new-password"
            />
          </div>

          <div class="form-group">
            <label for="confirmPassword" class="form-label">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              class="form-input"
              placeholder="Повторите пароль"
              required
              minlength="6"
              autocomplete="new-password"
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="reset-button" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить новый пароль' }}
          </button>
        </form>

        <!-- Успешное сообщение -->
        <div v-else-if="success" class="success-state">
          <div class="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2>Пароль изменен!</h2>
          <p>Теперь вы можете войти с новым паролем</p>
          <NuxtLink to="/login" class="login-link">
            Перейти на страницу входа
          </NuxtLink>
        </div>

        <!-- Ошибка токена -->
        <div v-else-if="tokenError" class="error-state">
          <div class="error-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2>Ссылка недействительна</h2>
          <p>{{ tokenError }}</p>
          <button @click="navigateTo('/')" class="home-link">
            Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: false,
});

const route = useRoute();
const { resetPassword } = useAuth();

const form = ref({
  password: '',
  confirmPassword: '',
});

const token = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);
const tokenError = ref('');

onMounted(() => {
  // Получаем токен из query параметра
  const queryToken = route.query.token as string;

  if (!queryToken) {
    tokenError.value = 'Токен сброса пароля не найден. Запросите новую ссылку для восстановления.';
    return;
  }

  token.value = queryToken;
});

const handleResetPassword = async () => {
  error.value = '';

  // Проверка совпадения паролей
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Пароли не совпадают';
    return;
  }

  // Проверка минимальной длины
  if (form.value.password.length < 6) {
    error.value = 'Пароль должен содержать минимум 6 символов';
    return;
  }

  loading.value = true;

  try {
    await resetPassword(token.value, form.value.password);
    success.value = true;
  } catch (err: any) {
    if (err.message?.includes('истек') || err.message?.includes('недействителен')) {
      tokenError.value = err.message;
    } else {
      error.value = err.message || 'Ошибка при сбросе пароля. Попробуйте снова.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.reset-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.reset-container {
  width: 100%;
  max-width: 450px;
}

.reset-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.reset-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.reset-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.reset-subtitle {
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.9;
}

.reset-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.reset-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  margin-top: 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -10px rgba(102, 126, 234, 0.5);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.success-state,
.error-state {
  padding: 3rem 2rem;
  text-align: center;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #374151;
    margin: 1.5rem 0 0.5rem 0;
  }

  p {
    color: #6b7280;
    margin: 0 0 2rem 0;
  }
}

.success-icon {
  color: #10b981;
}

.error-icon {
  color: #ef4444;
}

.login-link,
.home-link {
  display: inline-block;
  padding: 0.875rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 0.5rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -10px rgba(102, 126, 234, 0.5);
  }
}
</style>
