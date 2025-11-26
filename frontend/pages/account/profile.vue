<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Back Button -->
      <NuxtLink
        to="/account"
        class="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 group transition-all"
      >
        <svg
          class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Назад в личный кабинет
      </NuxtLink>

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-primary-light bg-clip-text text-transparent">
          Профиль
        </h1>
        <p class="text-gray-600">Управляйте вашей личной информацией</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center min-h-[400px]">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
          <p class="text-gray-600">Загрузка профиля...</p>
        </div>
      </div>

      <!-- Avatar Section -->
      <div v-else class="glass-card p-8 mb-6 animate-fade-in-up">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <!-- Avatar -->
          <div class="relative group">
            <div class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary-100 group-hover:ring-primary-300 transition-all">
              <div v-if="!profile.avatar" class="w-full h-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center">
                <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <img v-else :src="profile.avatar" :alt="profile.firstName" class="w-full h-full object-cover" />
            </div>

            <!-- Upload Overlay -->
            <div class="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" @click="uploadAvatar">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>

            <!-- Status Badge -->
            <div class="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full border-4 border-white flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>

          <!-- User Info -->
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl font-bold text-gray-900">{{ profile.firstName }} {{ profile.lastName }}</h2>
            <p class="text-gray-600">{{ profile.email }}</p>
            <div class="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                Email подтвержден
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                Аккаунт активен
              </span>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex flex-col gap-2">
            <button @click="uploadAvatar" class="premium-button-small">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
              Загрузить фото
            </button>
          </div>
        </div>
      </div>

      <!-- Profile Form -->
      <form @submit.prevent="saveProfile" class="space-y-6">
        <!-- Personal Information -->
        <div class="glass-card p-8 animate-fade-in-up animation-delay-1">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-light rounded-xl flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Личная информация</h3>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="form-group">
              <label class="form-label">Имя</label>
              <input
                v-model="profile.firstName"
                type="text"
                class="form-input"
                placeholder="Введите ваше имя"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Фамилия</label>
              <input
                v-model="profile.lastName"
                type="text"
                class="form-input"
                placeholder="Введите вашу фамилию"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <input
                  v-model="profile.email"
                  type="email"
                  class="form-input pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Телефон</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <input
                  v-model="profile.phone"
                  type="tel"
                  class="form-input pl-10"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Дата рождения</label>
              <input
                v-model="profile.birthDate"
                type="date"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Пол</label>
              <select v-model="profile.gender" class="form-select">
                <option value="">Не указан</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
                <option value="other">Другой</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Security Section -->
        <div class="glass-card p-8 animate-fade-in-up animation-delay-2">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-400 rounded-xl flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Безопасность</h3>
          </div>

          <div class="space-y-6">
            <div class="form-group">
              <label class="form-label">Текущий пароль</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                  </svg>
                </div>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="form-input pl-10"
                  placeholder="Введите текущий пароль"
                />
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="form-group">
                <label class="form-label">Новый пароль</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="form-input"
                  placeholder="Минимум 8 символов"
                />
                <p class="text-xs text-gray-500 mt-1">Используйте буквы, цифры и символы</p>
              </div>

              <div class="form-group">
                <label class="form-label">Подтвердите пароль</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="form-input"
                  placeholder="Повторите новый пароль"
                />
              </div>
            </div>

            <!-- Password Strength Indicator -->
            <div v-if="passwordForm.newPassword" class="password-strength">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Надежность пароля:</span>
                <span :class="passwordStrengthClass" class="text-sm font-semibold">{{ passwordStrengthText }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  :class="passwordStrengthBarClass"
                  class="h-2 rounded-full transition-all"
                  :style="{ width: passwordStrengthWidth }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Settings -->
        <div class="glass-card p-8 animate-fade-in-up animation-delay-3">
          <div class="flex items-center mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-light rounded-xl flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Уведомления</h3>
          </div>

          <div class="space-y-4">
            <label class="notification-toggle">
              <input type="checkbox" v-model="profile.notifications.email" class="sr-only">
              <div class="toggle-bg"></div>
              <div class="flex-1">
                <span class="block font-semibold text-gray-900">Email уведомления</span>
                <span class="block text-sm text-gray-600">Получать уведомления о заказах на email</span>
              </div>
            </label>

            <label class="notification-toggle">
              <input type="checkbox" v-model="profile.notifications.sms" class="sr-only">
              <div class="toggle-bg"></div>
              <div class="flex-1">
                <span class="block font-semibold text-gray-900">SMS уведомления</span>
                <span class="block text-sm text-gray-600">Получать SMS о статусе заказа</span>
              </div>
            </label>

            <label class="notification-toggle">
              <input type="checkbox" v-model="profile.notifications.newsletter" class="sr-only">
              <div class="toggle-bg"></div>
              <div class="flex-1">
                <span class="block font-semibold text-gray-900">Новости и акции</span>
                <span class="block text-sm text-gray-600">Получать информацию о новинках и спецпредложениях</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            :disabled="isSaving"
            class="flex-1 premium-button"
          >
            <svg v-if="!isSaving" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSaving ? 'Сохранение...' : 'Сохранить изменения' }}
          </button>

          <button
            type="button"
            @click="resetForm"
            class="flex-1 sm:flex-initial premium-button-outline"
          >
            Отменить
          </button>
        </div>
      </form>

      <!-- Danger Zone -->
      <div class="danger-zone animate-fade-in-up animation-delay-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-lg font-semibold text-red-600 mb-1">Опасная зона</h3>
            <p class="text-sm text-gray-600 mb-4">
              Удаление аккаунта необратимо. Все ваши данные, включая историю заказов, будут безвозвратно удалены.
            </p>
            <button
              @click="deleteAccount"
              class="danger-button"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Удалить аккаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

// Защита страницы авторизацией
definePageMeta({
  middleware: 'auth'
})

// SEO
useHead({
  title: 'Профиль - КМО24',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const { apiFetch } = useApi()
const toast = useToast()
const router = useRouter()

const profile = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '',
  avatar: '',
  notifications: {
    email: true,
    sms: true,
    newsletter: false
  }
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const isSaving = ref(false)
const isLoading = ref(true)
const originalProfile = ref(null)

// Password Strength
const passwordStrength = computed(() => {
  const password = passwordForm.newPassword
  if (!password) return 0

  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  return strength
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return ''
  if (strength <= 2) return 'Слабый'
  if (strength <= 3) return 'Средний'
  if (strength <= 4) return 'Хороший'
  return 'Отличный'
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'text-red-600'
  if (strength <= 3) return 'text-orange-600'
  if (strength <= 4) return 'text-yellow-600'
  return 'text-orange-600'
})

const passwordStrengthBarClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'bg-red-500'
  if (strength <= 3) return 'bg-orange-500'
  if (strength <= 4) return 'bg-yellow-500'
  return 'bg-orange-500'
})

const passwordStrengthWidth = computed(() => {
  return `${(passwordStrength.value / 5) * 100}%`
})

// Загрузка данных пользователя
const loadProfile = async () => {
  try {
    isLoading.value = true
    const response = await apiFetch('/auth/me')

    if (response.data) {
      const userData = response.data
      profile.firstName = userData.firstName || ''
      profile.lastName = userData.lastName || ''
      profile.email = userData.email || ''
      profile.phone = userData.phone || ''
      profile.birthDate = userData.birthDate ? userData.birthDate.split('T')[0] : ''
      profile.gender = userData.gender || ''
      profile.avatar = userData.avatar || ''
      profile.notifications = {
        email: userData.notifications?.email !== undefined ? userData.notifications.email : true,
        sms: userData.notifications?.sms !== undefined ? userData.notifications.sms : true,
        newsletter: userData.notifications?.newsletter !== undefined ? userData.notifications.newsletter : false
      }

      // Сохраняем оригинальные данные
      originalProfile.value = JSON.parse(JSON.stringify(profile))
    }
  } catch (error) {
    console.error('Error loading profile:', error)
    toast.error('Ошибка загрузки профиля')
  } finally {
    isLoading.value = false
  }
}

const uploadAvatar = () => {
  // TODO: Implement avatar upload
  toast.info('Функция загрузки аватара будет добавлена позже')
}

const saveProfile = async () => {
  isSaving.value = true

  try {
    // Сохранение изменений профиля
    const profileData = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone || null,
      birthDate: profile.birthDate || null,
      gender: profile.gender || '',
      notifications: profile.notifications
    }

    await apiFetch('/auth/profile', {
      method: 'PUT',
      body: profileData
    })

    // Если есть пароль для изменения
    if (passwordForm.newPassword) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        toast.error('Пароли не совпадают')
        isSaving.value = false
        return
      }
      if (passwordForm.newPassword.length < 8) {
        toast.error('Пароль должен содержать минимум 8 символов')
        isSaving.value = false
        return
      }
      if (!passwordForm.currentPassword) {
        toast.error('Введите текущий пароль')
        isSaving.value = false
        return
      }

      await apiFetch('/auth/change-password', {
        method: 'PUT',
        body: {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }
      })

      // Очищаем поля пароля
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''

      toast.success('Профиль и пароль успешно обновлены!')
    } else {
      toast.success('Профиль успешно обновлен!')
    }

    // Обновляем оригинальные данные
    originalProfile.value = JSON.parse(JSON.stringify(profile))
  } catch (error: any) {
    console.error('Error saving profile:', error)
    const errorMessage = error?.data?.message || 'Ошибка при сохранении профиля'
    toast.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}

const resetForm = () => {
  if (originalProfile.value) {
    Object.assign(profile, JSON.parse(JSON.stringify(originalProfile.value)))
  }
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  toast.info('Изменения отменены')
}

const deleteAccount = () => {
  if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) return

  // TODO: API call to delete account
  toast.warning('Функция удаления аккаунта будет добавлена позже')
}

// Загружаем профиль при монтировании
onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
/* Glass Card */
.glass-card {
  @apply bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100;
  transition: all 0.3s ease;
}

.glass-card:hover {
  @apply shadow-2xl;
}

/* Form Elements */
.form-group {
  @apply mb-0;
}

.form-label {
  @apply block text-sm font-semibold text-gray-700 mb-2;
}

.form-input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-xl;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  @apply transition-all duration-200;
  @apply text-gray-900 placeholder-gray-400;
}

.form-input:focus {
  @apply outline-none;
}

.form-select {
  @apply w-full px-4 py-3 border border-gray-300 rounded-xl;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  @apply transition-all duration-200;
  @apply text-gray-900 bg-white;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25rem;
  padding-right: 2.5rem;
}

/* Toggle Switch */
.notification-toggle {
  @apply flex items-center gap-4 p-4 rounded-xl;
  @apply hover:bg-gray-50 transition-colors cursor-pointer;
  @apply border border-gray-200;
}

.notification-toggle input:checked ~ .toggle-bg {
  @apply bg-primary-600;
}

.notification-toggle input:checked ~ .toggle-bg::after {
  transform: translateX(1.5rem);
}

.toggle-bg {
  @apply relative inline-block w-12 h-6 bg-gray-300 rounded-full;
  @apply transition-colors duration-200 ease-in-out;
  @apply flex-shrink-0;
}

.toggle-bg::after {
  content: '';
  @apply absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full;
  @apply transition-transform duration-200 ease-in-out;
  @apply shadow-md;
}

/* Premium Buttons */
.premium-button {
  @apply flex items-center justify-center px-8 py-4;
  @apply bg-gradient-to-r from-primary-600 to-primary-light;
  @apply text-white font-bold rounded-xl;
  @apply hover:from-primary-700 hover:to-primary-500;
  @apply transition-all duration-300 hover:scale-105;
  @apply shadow-lg hover:shadow-xl;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.premium-button-small {
  @apply inline-flex items-center px-4 py-2;
  @apply bg-gradient-to-r from-primary-600 to-primary-light;
  @apply text-white font-semibold rounded-lg text-sm;
  @apply hover:from-primary-700 hover:to-primary-500;
  @apply transition-all duration-300 hover:scale-105;
  @apply shadow-md hover:shadow-lg;
}

.premium-button-outline {
  @apply inline-flex items-center justify-center px-8 py-4;
  @apply bg-transparent text-gray-700 font-bold rounded-xl;
  @apply border-2 border-gray-300 hover:bg-gray-50;
  @apply transition-all duration-300;
}

/* Danger Zone */
.danger-zone {
  @apply mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl;
}

.danger-button {
  @apply inline-flex items-center px-4 py-2;
  @apply bg-red-600 text-white font-semibold rounded-lg;
  @apply hover:bg-red-700 transition-all duration-300 hover:scale-105;
  @apply shadow-md hover:shadow-lg;
}

/* Animations */
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease forwards;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animation-delay-1 { animation-delay: 0.1s; }
.animation-delay-2 { animation-delay: 0.2s; }
.animation-delay-3 { animation-delay: 0.3s; }
.animation-delay-4 { animation-delay: 0.4s; }

/* Password Strength */
.password-strength {
  @apply p-4 bg-gray-50 rounded-xl;
}
</style>