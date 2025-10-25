<template>
  <div class="success-page">
    <div class="container">
      <div class="success-page__content">
        <div class="success-page__icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <h1>Заказ успешно оформлен!</h1>
        <p class="success-page__subtitle">
          Спасибо за ваш заказ. Мы отправили подтверждение на указанный email.
        </p>

        <div class="success-page__order-number">
          Номер заказа: <strong>#{{ orderNumber }}</strong>
        </div>

        <div class="success-page__actions">
          <BaseButton variant="primary" size="lg" @click="navigateTo('/account/orders')">
            Мои заказы
          </BaseButton>
          <BaseButton variant="outline" size="lg" @click="navigateTo('/products')">
            Продолжить покупки
          </BaseButton>
        </div>

        <div class="success-page__info">
          <div class="success-page__info-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Мы отправили подтверждение на ваш email</span>
          </div>
          <div class="success-page__info-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 10H13C14.1046 10 15 10.8954 15 12V21M3 10V18C3 19.1046 3.89543 20 5 20H15M3 10V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V12M15 21V16C15 14.8954 15.8954 14 17 14H21M15 21H17C18.1046 21 19 20.1046 19 19V14M21 12H17C15.8954 12 15 12.8954 15 14H21V12Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Доставка будет осуществлена в течение 1-3 рабочих дней</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const orderNumber = ref(Math.floor(100000 + Math.random() * 900000).toString());

// SEO
useHead({
  title: 'Заказ оформлен - Онлайн Магазин',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.success-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl 0;
  background: $gray-50;

  &__content {
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-lg;
    padding: $spacing-2xl;
    background: $white;
    border-radius: $radius-xl;
    box-shadow: $shadow-lg;
    text-align: center;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 120px;
    border-radius: $radius-full;
    background: rgba($success, 0.1);
    color: $success;

    svg {
      width: 80px;
      height: 80px;
    }
  }

  h1 {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin: 0;
  }

  &__subtitle {
    font-size: $font-size-base;
    color: $gray-600;
    margin: 0;
    line-height: 1.6;
  }

  &__order-number {
    padding: $spacing-md $spacing-xl;
    background: $gray-100;
    border-radius: $radius-lg;
    font-size: $font-size-lg;
    color: $gray-700;

    strong {
      color: $primary;
    }
  }

  &__actions {
    display: flex;
    gap: $spacing-md;
    margin-top: $spacing-lg;

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
      width: 100%;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding-top: $spacing-xl;
    border-top: 1px solid $gray-200;
    margin-top: $spacing-lg;
    width: 100%;
  }

  &__info-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    text-align: left;
    font-size: $font-size-sm;
    color: $gray-700;

    svg {
      color: $primary;
      flex-shrink: 0;
    }
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
