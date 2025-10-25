<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-page__header">
        <NuxtLink to="/account" class="profile-page__back">
          ← Назад в личный кабинет
        </NuxtLink>
        <h1>Профиль</h1>
      </div>

      <div class="profile-page__content">
        <!-- Avatar Section -->
        <div class="profile-page__avatar-section">
          <div class="profile-page__avatar">
            <svg v-if="!profile.avatar" width="80" height="80" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
            <img v-else :src="profile.avatar" :alt="profile.name" />
          </div>
          <BaseButton variant="outline" size="sm" @click="uploadAvatar">
            Изменить фото
          </BaseButton>
        </div>

        <!-- Profile Form -->
        <form class="profile-page__form" @submit.prevent="saveProfile">
          <div class="profile-page__form-row">
            <BaseInput
              v-model="profile.firstName"
              label="Имя"
              placeholder="Введите ваше имя"
              required
            />
            <BaseInput
              v-model="profile.lastName"
              label="Фамилия"
              placeholder="Введите вашу фамилию"
              required
            />
          </div>

          <BaseInput
            v-model="profile.email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            required
          />

          <BaseInput
            v-model="profile.phone"
            type="tel"
            label="Телефон"
            placeholder="+7 (999) 123-45-67"
          />

          <div class="profile-page__form-row">
            <BaseInput
              v-model="profile.birthDate"
              type="date"
              label="Дата рождения"
            />
            <BaseSelect
              v-model="profile.gender"
              label="Пол"
              :options="genderOptions"
            />
          </div>

          <div class="profile-page__divider"></div>

          <h3>Изменить пароль</h3>

          <BaseInput
            v-model="passwordForm.currentPassword"
            type="password"
            label="Текущий пароль"
            placeholder="Введите текущий пароль"
          />

          <div class="profile-page__form-row">
            <BaseInput
              v-model="passwordForm.newPassword"
              type="password"
              label="Новый пароль"
              placeholder="Минимум 8 символов"
            />
            <BaseInput
              v-model="passwordForm.confirmPassword"
              type="password"
              label="Подтвердите пароль"
              placeholder="Повторите новый пароль"
            />
          </div>

          <div class="profile-page__form-actions">
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="isSaving"
              fullWidth
            >
              Сохранить изменения
            </BaseButton>
            <BaseButton
              type="button"
              variant="outline"
              size="lg"
              @click="resetForm"
              fullWidth
            >
              Отменить
            </BaseButton>
          </div>
        </form>

        <!-- Danger Zone -->
        <div class="profile-page__danger-zone">
          <h3>Опасная зона</h3>
          <p>Удаление аккаунта необратимо. Все ваши данные будут удалены.</p>
          <BaseButton variant="danger" size="sm" @click="deleteAccount">
            Удалить аккаунт
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const profile = reactive({
  firstName: 'Иван',
  lastName: 'Иванов',
  email: 'ivan@example.com',
  phone: '+7 (999) 123-45-67',
  birthDate: '1990-01-15',
  gender: 'male',
  avatar: '',
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const isSaving = ref(false);

const genderOptions = [
  { value: '', label: 'Не указан' },
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
  { value: 'other', label: 'Другой' },
];

const uploadAvatar = () => {
  // TODO: Implement avatar upload
  console.log('Upload avatar');
};

const saveProfile = async () => {
  isSaving.value = true;

  try {
    // Validate password if changing
    if (passwordForm.newPassword) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
      if (passwordForm.newPassword.length < 8) {
        alert('Пароль должен содержать минимум 8 символов');
        return;
      }
    }

    // TODO: API call to save profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Profile saved:', profile);
    alert('Профиль успешно обновлен!');

    // Clear password fields
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Ошибка при сохранении профиля');
  } finally {
    isSaving.value = false;
  }
};

const resetForm = () => {
  // TODO: Reset to original values from API
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
};

const deleteAccount = () => {
  if (!confirm('Вы уверены, что хотите удалить аккаунт? Это действие необратимо.')) return;

  // TODO: API call to delete account
  console.log('Delete account');
};

// SEO
useHead({
  title: 'Профиль - Онлайн Магазин',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.profile-page {
  min-height: calc(100vh - 200px);
  padding: $spacing-xl 0;
  background: $gray-50;

  &__header {
    margin-bottom: $spacing-xl;

    h1 {
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
      color: $gray-900;
      margin: $spacing-md 0 0 0;
    }
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    color: $primary;
    text-decoration: none;
    font-size: $font-size-sm;
    transition: color $transition-base;

    &:hover {
      color: darken($primary, 10%);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
  }

  &__avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-xl;
    background: $white;
    border-radius: $radius-xl;
    box-shadow: $shadow-sm;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border-radius: $radius-full;
    background: linear-gradient(135deg, rgba($primary, 0.1) 0%, rgba($secondary, 0.1) 100%);
    color: $primary;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    padding: $spacing-xl;
    background: $white;
    border-radius: $radius-xl;
    box-shadow: $shadow-sm;

    h3 {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0;
    }
  }

  &__form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;

    @media (max-width: $breakpoint-sm) {
      grid-template-columns: 1fr;
    }
  }

  &__divider {
    height: 1px;
    background: $gray-200;
    margin: $spacing-lg 0;
  }

  &__form-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-md;
    margin-top: $spacing-md;

    @media (max-width: $breakpoint-sm) {
      grid-template-columns: 1fr;
    }
  }

  &__danger-zone {
    padding: $spacing-xl;
    background: $white;
    border: 2px solid $error;
    border-radius: $radius-xl;
    box-shadow: $shadow-sm;

    h3 {
      font-size: $font-size-xl;
      font-weight: $font-weight-semibold;
      color: $error;
      margin: 0 0 $spacing-sm 0;
    }

    p {
      font-size: $font-size-sm;
      color: $gray-600;
      margin: 0 0 $spacing-md 0;
    }
  }
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
