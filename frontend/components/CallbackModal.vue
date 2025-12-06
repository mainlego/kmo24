<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="callback-modal" @click.self="close">
        <div class="callback-modal__content">
          <button class="callback-modal__close" @click="close" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <div class="callback-modal__header">
            <div class="callback-modal__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="callback-modal__title">Заказать звонок</h2>
            <p class="callback-modal__subtitle">Оставьте заявку и мы перезвоним вам в ближайшее время</p>
          </div>

          <!-- Success State -->
          <div v-if="isSuccess" class="callback-modal__success">
            <div class="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="success-title">Заявка отправлена!</h3>
            <p class="success-text">Мы свяжемся с вами в ближайшее время</p>
            <button class="callback-modal__submit" @click="close">Закрыть</button>
          </div>

          <!-- Form -->
          <form v-else class="callback-modal__form" @submit.prevent="submitForm">
            <div class="form-group">
              <label for="callback-name" class="form-label">Ваше имя *</label>
              <input
                id="callback-name"
                v-model="form.name"
                type="text"
                class="form-input"
                :class="{ 'form-input--error': errors.name }"
                placeholder="Введите ваше имя"
                required
              />
              <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="callback-phone" class="form-label">Телефон *</label>
              <input
                id="callback-phone"
                v-model="form.phone"
                type="tel"
                class="form-input"
                :class="{ 'form-input--error': errors.phone }"
                placeholder="+7 (___) ___-__-__"
                required
                @input="formatPhone"
              />
              <span v-if="errors.phone" class="form-error">{{ errors.phone }}</span>
            </div>

            <div class="form-group">
              <label for="callback-message" class="form-label">Сообщение (необязательно)</label>
              <textarea
                id="callback-message"
                v-model="form.message"
                class="form-input form-textarea"
                placeholder="Опишите ваш вопрос..."
                rows="3"
              ></textarea>
            </div>

            <div v-if="serverError" class="form-server-error">
              {{ serverError }}
            </div>

            <button
              type="submit"
              class="callback-modal__submit"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="loading-spinner"></span>
              <span v-else>Отправить заявку</span>
            </button>

            <p class="callback-modal__privacy">
              Нажимая на кнопку, вы соглашаетесь с
              <NuxtLink to="/privacy" @click="close">политикой конфиденциальности</NuxtLink>
            </p>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const config = useRuntimeConfig()
const apiBase = config.public.apiBaseUrl

const form = reactive({
  name: '',
  phone: '',
  message: '',
})

const errors = reactive({
  name: '',
  phone: '',
})

const isLoading = ref(false)
const isSuccess = ref(false)
const serverError = ref('')

const close = () => {
  emit('update:modelValue', false)
}

// Reset form when modal opens
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    form.name = ''
    form.phone = ''
    form.message = ''
    errors.name = ''
    errors.phone = ''
    serverError.value = ''
    isSuccess.value = false
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '')

  // Ensure it starts with 7
  if (value.length > 0 && value[0] !== '7') {
    if (value[0] === '8') {
      value = '7' + value.slice(1)
    } else {
      value = '7' + value
    }
  }

  // Format: +7 (XXX) XXX-XX-XX
  let formatted = ''
  if (value.length > 0) {
    formatted = '+7'
    if (value.length > 1) {
      formatted += ' (' + value.slice(1, 4)
      if (value.length > 4) {
        formatted += ') ' + value.slice(4, 7)
        if (value.length > 7) {
          formatted += '-' + value.slice(7, 9)
          if (value.length > 9) {
            formatted += '-' + value.slice(9, 11)
          }
        }
      }
    }
  }

  form.phone = formatted
}

const validateForm = (): boolean => {
  let isValid = true
  errors.name = ''
  errors.phone = ''

  if (!form.name.trim()) {
    errors.name = 'Введите ваше имя'
    isValid = false
  }

  const phoneDigits = form.phone.replace(/\D/g, '')
  if (phoneDigits.length < 11) {
    errors.phone = 'Введите корректный номер телефона'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) return

  isLoading.value = true
  serverError.value = ''

  try {
    const response = await fetch(`${apiBase}/leads/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
      }),
    })

    const data = await response.json()

    if (data.success) {
      isSuccess.value = true
    } else {
      serverError.value = data.message || 'Произошла ошибка. Попробуйте позже.'
    }
  } catch (error) {
    console.error('Callback request error:', error)
    serverError.value = 'Ошибка соединения. Попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.callback-modal {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba($gray-900, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;

  &__content {
    position: relative;
    width: 100%;
    max-width: 440px;
    background: $white;
    border-radius: $radius-2xl;
    padding: $spacing-2xl;
    box-shadow: $shadow-2xl;
    animation: slideUp 0.3s ease-out;

    @media (max-width: $breakpoint-sm) {
      padding: $spacing-xl;
      max-width: 100%;
    }
  }

  &__close {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $gray-100;
    border: none;
    border-radius: $radius-full;
    color: $gray-600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $gray-200;
      color: $gray-900;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: $spacing-xl;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: $gradient-primary;
    border-radius: $radius-full;
    color: $white;
    margin-bottom: $spacing-md;
  }

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin: 0 0 $spacing-xs;
  }

  &__subtitle {
    font-size: $font-size-sm;
    color: $gray-500;
    margin: 0;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__submit {
    width: 100%;
    padding: $spacing-md $spacing-xl;
    background: $gradient-primary;
    border: none;
    border-radius: $radius-lg;
    color: $white;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: $shadow-colored;
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  &__privacy {
    font-size: $font-size-xs;
    color: $gray-500;
    text-align: center;
    margin: 0;

    a {
      color: $primary;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__success {
    text-align: center;
    padding: $spacing-xl 0;
  }
}

// Form styles
.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.form-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-700;
}

.form-input {
  width: 100%;
  padding: $spacing-sm $spacing-md;
  background: $gray-50;
  border: 2px solid $gray-200;
  border-radius: $radius-lg;
  font-size: $font-size-base;
  color: $gray-900;
  transition: all 0.2s ease;

  &::placeholder {
    color: $gray-400;
  }

  &:focus {
    outline: none;
    border-color: $primary;
    background: $white;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }

  &--error {
    border-color: $error;

    &:focus {
      box-shadow: 0 0 0 3px rgba($error, 0.1);
    }
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-error {
  font-size: $font-size-xs;
  color: $error;
}

.form-server-error {
  padding: $spacing-sm $spacing-md;
  background: $error-light;
  border: 1px solid rgba($error, 0.2);
  border-radius: $radius-md;
  color: $error;
  font-size: $font-size-sm;
  text-align: center;
}

// Success state
.success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: $success-light;
  border-radius: $radius-full;
  color: $success;
  margin-bottom: $spacing-lg;
}

.success-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin: 0 0 $spacing-xs;
}

.success-text {
  font-size: $font-size-sm;
  color: $gray-500;
  margin: 0 0 $spacing-xl;
}

// Loading spinner
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba($white, 0.3);
  border-top-color: $white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Modal animation
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
