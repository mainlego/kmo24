<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isOpen" class="auth-modal-overlay" @click="handleClose">
        <div class="auth-modal" @click.stop>
          <!-- Close Button -->
          <button class="close-btn" @click="handleClose">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <!-- Tabs -->
          <div class="auth-tabs">
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'login' }"
              @click="activeTab = 'login'"
            >
              Вход
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'register' }"
              @click="activeTab = 'register'"
            >
              Регистрация
            </button>
          </div>

          <!-- Login Form -->
          <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
            <h2 class="form-title">Добро пожаловать!</h2>
            <p class="form-subtitle">Войдите в свой аккаунт</p>

            <div class="form-group">
              <label for="login-email" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </label>
              <input
                id="login-email"
                v-model="loginForm.email"
                type="email"
                class="form-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="login-password" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Пароль
              </label>
              <div class="password-wrapper">
                <input
                  id="login-password"
                  v-model="loginForm.password"
                  :type="showLoginPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showLoginPassword = !showLoginPassword"
                >
                  <svg v-if="showLoginPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input v-model="loginForm.rememberMe" type="checkbox" />
                <span>Запомнить меня</span>
              </label>
              <button type="button" class="forgot-link" @click="activeTab = 'forgot'">
                Забыли пароль?
              </button>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <svg v-if="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span v-else>Войти</span>
            </button>

            <!-- Telegram Login -->
            <div class="divider">
              <span>или</span>
            </div>

            <div class="telegram-login-wrapper">
              <TelegramLoginButton @auth="handleTelegramAuth" />
            </div>
          </form>

          <!-- Register Form -->
          <form v-else-if="activeTab === 'register'" @submit.prevent="handleRegister" class="auth-form">
            <h2 class="form-title">Создать аккаунт</h2>
            <p class="form-subtitle">Присоединяйтесь к нам!</p>

            <div class="form-row">
              <div class="form-group">
                <label for="register-firstname" class="form-label">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Имя
                </label>
                <input
                  id="register-firstname"
                  v-model="registerForm.firstName"
                  type="text"
                  class="form-input"
                  placeholder="Иван"
                  required
                />
              </div>

              <div class="form-group">
                <label for="register-lastname" class="form-label">
                  Фамилия
                </label>
                <input
                  id="register-lastname"
                  v-model="registerForm.lastName"
                  type="text"
                  class="form-input"
                  placeholder="Иванов"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="register-email" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </label>
              <input
                id="register-email"
                v-model="registerForm.email"
                type="email"
                class="form-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div class="form-group">
              <label for="register-phone" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Телефон <span class="optional-label">(необязательно)</span>
              </label>
              <input
                id="register-phone"
                v-model="registerForm.phone"
                type="tel"
                class="form-input"
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div class="form-group">
              <label for="register-password" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Пароль
              </label>
              <div class="password-wrapper">
                <input
                  id="register-password"
                  v-model="registerForm.password"
                  :type="showRegisterPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Минимум 6 символов"
                  minlength="6"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showRegisterPassword = !showRegisterPassword"
                >
                  <svg v-if="showRegisterPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-label">
                <input v-model="registerForm.agree" type="checkbox" required />
                <span>Я согласен с <a href="/terms" target="_blank">условиями использования</a></span>
              </label>
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <svg v-if="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span v-else>Зарегистрироваться</span>
            </button>
          </form>

          <!-- Forgot Password Form -->
          <form v-else-if="activeTab === 'forgot'" @submit.prevent="handleForgotPassword" class="auth-form">
            <h2 class="form-title">Восстановление пароля</h2>
            <p class="form-subtitle">Введите email для получения инструкций</p>

            <div class="form-group">
              <label for="forgot-email" class="form-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </label>
              <input
                id="forgot-email"
                v-model="forgotForm.email"
                type="email"
                class="form-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <button type="submit" class="submit-btn" :disabled="loading">
              <svg v-if="loading" class="spinner" width="20" height="20" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span v-else>Отправить инструкции</span>
            </button>

            <button type="button" class="back-to-login" @click="activeTab = 'login'">
              ← Вернуться к входу
            </button>
          </form>

          <!-- Success/Error Messages -->
          <div v-if="message" class="message" :class="messageType">
            <svg v-if="messageType === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ message }}</span>
          </div>
        </div>
      </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useAuthStore } from '~/stores/auth';

const props = defineProps<{
  modelValue: boolean;
  initialTab?: 'login' | 'register' | 'forgot';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'close': [];
  'success': [];
}>();

const { login, register } = useAuth();
const authStore = useAuthStore();

const isOpen = ref(props.modelValue);
const activeTab = ref(props.initialTab || 'login');
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

// Form data
const loginForm = ref({
  email: '',
  password: '',
  rememberMe: false,
});

const registerForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  agree: false,
});

const forgotForm = ref({
  email: '',
});

const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);

// Watch props
watch(() => props.modelValue, (value) => {
  isOpen.value = value;
});

watch(() => props.initialTab, (value) => {
  if (value) activeTab.value = value;
});

// Methods
const handleClose = () => {
  isOpen.value = false;
  emit('update:modelValue', false);
  emit('close');
  message.value = '';

  // Reset forms
  loginForm.value = { email: '', password: '', rememberMe: false };
  registerForm.value = { firstName: '', lastName: '', email: '', phone: '', password: '', agree: false };
  forgotForm.value = { email: '' };
};

const handleLogin = async () => {
  loading.value = true;
  message.value = '';

  try {
    await login({
      email: loginForm.value.email,
      password: loginForm.value.password,
    });

    message.value = 'Вход выполнен успешно!';
    messageType.value = 'success';

    emit('success');

    setTimeout(() => {
      handleClose();
      // Перезагрузить страницу или обновить состояние
      window.location.reload();
    }, 1000);
  } catch (error: any) {
    message.value = error.message || 'Ошибка при входе';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  loading.value = true;
  message.value = '';

  try {
    const registerData: Record<string, string> = {
      firstName: registerForm.value.firstName,
      lastName: registerForm.value.lastName,
      email: registerForm.value.email,
      password: registerForm.value.password,
    };

    // Добавляем телефон только если он заполнен
    if (registerForm.value.phone && registerForm.value.phone.trim()) {
      registerData.phone = registerForm.value.phone;
    }

    await register(registerData);

    message.value = 'Регистрация успешна! Теперь вы можете войти.';
    messageType.value = 'success';

    setTimeout(() => {
      activeTab.value = 'login';
      registerForm.value = { firstName: '', lastName: '', email: '', phone: '', password: '', agree: false };
    }, 2000);
  } catch (error: any) {
    message.value = error.message || 'Ошибка при регистрации';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = async () => {
  loading.value = true;
  message.value = '';

  try {
    // TODO: Implement password reset API
    await new Promise(resolve => setTimeout(resolve, 1500));

    message.value = `Инструкции отправлены на ${forgotForm.value.email}`;
    messageType.value = 'success';

    setTimeout(() => {
      activeTab.value = 'login';
      forgotForm.value = { email: '' };
    }, 2000);
  } catch (error: any) {
    message.value = error.message || 'Ошибка при восстановлении пароля';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const handleTelegramAuth = async (telegramUser: any) => {
  loading.value = true;
  message.value = '';

  // Debug: логируем данные от Telegram
  console.log('Telegram auth data received:', telegramUser);
  console.log('Fields:', {
    id: telegramUser?.id,
    first_name: telegramUser?.first_name,
    auth_date: telegramUser?.auth_date,
    hash: telegramUser?.hash ? 'present' : 'missing'
  });

  try {
    const { loginWithTelegram } = useAuth();
    await loginWithTelegram(telegramUser);

    message.value = 'Вход через Telegram выполнен успешно!';
    messageType.value = 'success';

    emit('success');

    setTimeout(() => {
      handleClose();
      window.location.reload();
    }, 1000);
  } catch (error: any) {
    message.value = error.message || 'Ошибка при входе через Telegram';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
@import '~/assets/scss/variables';

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;

  .auth-modal {
    transform: scale(0.9);
  }
}

.modal-leave-to {
  opacity: 0;

  .auth-modal {
    transform: scale(0.9);
  }
}

.auth-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.auth-modal {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: $gray-500;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background: $gray-100;
    color: $gray-700;
  }
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid $gray-200;

  .tab-btn {
    flex: 1;
    padding: 1.25rem 1rem;
    background: none;
    border: none;
    font-size: 0.9375rem;
    font-weight: 500;
    color: $gray-500;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;

    &:hover {
      color: $gray-700;
    }

    &.active {
      color: #f59e0b;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #f59e0b;
      }
    }
  }
}

.auth-form {
  padding: 2rem;

  .form-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: $gray-900;
    margin-bottom: 0.5rem;
  }

  .form-subtitle {
    color: $gray-600;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: $gray-700;
    margin-bottom: 0.5rem;

    svg {
      color: #f59e0b;
    }

    .optional-label {
      font-weight: 400;
      color: $gray-400;
      font-size: 0.75rem;
    }
  }

  .form-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid $gray-300;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
    }

    &::placeholder {
      color: $gray-400;
    }
  }

  .password-wrapper {
    position: relative;

    .password-toggle {
      position: absolute;
      right: 0.625rem;
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

  .form-options {
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
      accent-color: #f59e0b;
    }

    a {
      color: #f59e0b;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .forgot-link {
    background: none;
    border: none;
    color: #f59e0b;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }

  .submit-btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
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
      box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      animation: spin 1s linear infinite;
    }
  }

  .back-to-login {
    width: 100%;
    margin-top: 1rem;
    background: none;
    border: none;
    color: $gray-600;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem;

    &:hover {
      color: $gray-800;
    }
  }
}

.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: $gray-200;
  }

  span {
    position: relative;
    background: white;
    padding: 0 1rem;
    color: $gray-500;
    font-size: 0.875rem;
  }
}

.telegram-login-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.message {
  margin: 0 2rem 2rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;

  &.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  &.error {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>