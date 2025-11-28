<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-card">
        <!-- Logo and Header -->
        <div class="login-header">
          <div class="logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="10" fill="#f59e0b"/>
              <path d="M14 24L20 30L34 16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="login-title">Панель администратора</h1>
          <p class="login-subtitle">Войдите для доступа к системе управления</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="credentials.email"
              type="email"
              class="form-input"
              placeholder="admin@example.com"
              required
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Пароль</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="••••••••"
                required
                autocomplete="current-password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
              >
                <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-footer">
            <label class="checkbox-label">
              <input v-model="rememberMe" type="checkbox" />
              <span>Запомнить меня</span>
            </label>
            <NuxtLink to="/forgot-password" class="forgot-link">
              Забыли пароль?
            </NuxtLink>
          </div>

          <button
            type="submit"
            class="submit-btn"
            :disabled="loading"
          >
            <svg v-if="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span v-else>Войти в систему</span>
          </button>
        </form>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Back to Site -->
        <div class="back-link">
          <NuxtLink to="/">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Вернуться на сайт
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '~/composables/useAuth';

// Отключаем layout для страницы входа
definePageMeta({
  layout: false,
});

const { login } = useAuth();
const router = useRouter();

const credentials = ref({
  email: '',
  password: '',
});
const rememberMe = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const response = await login(credentials.value.email, credentials.value.password);

    // Проверяем, является ли пользователь админом или менеджером
    if (response.user.role === 'admin' || response.user.role === 'manager') {
      // Редирект в админ-панель
      await router.push('/admin');
    } else {
      // Обычный пользователь не может войти через админ-форму
      error.value = 'У вас нет прав доступа к панели администратора';
      // Выход из системы
      await logout();
    }
  } catch (err: any) {
    error.value = err.message || 'Неверный email или пароль';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';

.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 420px;
  z-index: 10;
  position: relative;
}

.login-card {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

  @media (max-width: 640px) {
    padding: 2rem;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: inline-flex;
  margin-bottom: 1rem;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: $gray-900;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: $gray-600;
  font-size: 0.875rem;
}

.login-form {
  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: $gray-700;
    margin-bottom: 0.5rem;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid $gray-300;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &::placeholder {
      color: $gray-400;
    }
  }

  .password-input-wrapper {
    position: relative;

    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: $gray-500;
      cursor: pointer;
      padding: 0.25rem;

      &:hover {
        color: $gray-700;
      }
    }
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: $gray-600;

    input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }
  }

  .forgot-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  .submit-btn {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      animation: spin 1s linear infinite;
    }
  }
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-link {
  margin-top: 1.5rem;
  text-align: center;

  a {
    color: $gray-600;
    text-decoration: none;
    font-size: 0.875rem;
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    transition: color 0.2s;

    &:hover {
      color: $gray-800;
    }
  }
}

.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  .bg-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 20s infinite ease-in-out;
  }

  .bg-circle-1 {
    width: 400px;
    height: 400px;
    top: -100px;
    right: -100px;
  }

  .bg-circle-2 {
    width: 300px;
    height: 300px;
    bottom: -50px;
    left: -50px;
    animation-delay: -5s;
  }

  .bg-circle-3 {
    width: 200px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: -10s;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}
</style>