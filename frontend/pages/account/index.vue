<template>
  <div class="account-page">
    <div class="container">
      <h1 class="account-page__title">Личный кабинет</h1>

      <div class="account-page__grid">
        <NuxtLink to="/account/orders" class="account-page__card">
          <div class="account-page__card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3>Мои заказы</h3>
          <p>История заказов и отслеживание доставки</p>
        </NuxtLink>

        <NuxtLink to="/account/profile" class="account-page__card">
          <div class="account-page__card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3>Профиль</h3>
          <p>Личная информация и настройки</p>
        </NuxtLink>

        <NuxtLink to="/account/addresses" class="account-page__card">
          <div class="account-page__card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M17.657 16.657L13.414 20.9C13.039 21.275 12.5303 21.4854 12 21.4854C11.4697 21.4854 10.961 21.275 10.586 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3 12 3C13.5822 3 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3>Адреса доставки</h3>
          <p>Управление адресами доставки</p>
        </NuxtLink>

        <NuxtLink to="/account/favorites" class="account-page__card">
          <div class="account-page__card-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61C20.3292 4.09944 19.7228 3.69541 19.0554 3.4211C18.3879 3.14679 17.6725 3.00731 16.95 3.00731C16.2275 3.00731 15.5121 3.14679 14.8446 3.4211C14.1772 3.69541 13.5708 4.09944 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.57831 8.50903 3.00022 7.05 3.00022C5.59096 3.00022 4.19169 3.57831 3.16 4.61C2.1283 5.64169 1.55022 7.04096 1.55022 8.5C1.55022 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.3506 11.8792 21.7546 11.2728 22.0289 10.6054C22.3032 9.93789 22.4427 9.22249 22.4427 8.5C22.4427 7.77751 22.3032 7.0621 22.0289 6.39461C21.7546 5.72711 21.3506 5.12075 20.84 4.61Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3>Избранное</h3>
          <p>Товары, которые вам понравились</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO
useHead({
  title: 'Личный кабинет - Онлайн Магазин',
  meta: [
    {
      name: 'description',
      content: 'Управляйте вашими заказами, профилем и настройками',
    },
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.account-page {
  min-height: calc(100vh - 200px);
  padding: $spacing-xl 0;
  background: $gray-50;

  &__title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin: 0 0 $spacing-xl 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-xl;
  }

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-2xl;
    background: $white;
    border: 2px solid $gray-200;
    border-radius: $radius-xl;
    text-align: center;
    text-decoration: none;
    transition: all $transition-base;

    &:hover {
      border-color: $primary;
      transform: translateY(-4px);
      box-shadow: $shadow-lg;

      .account-page__card-icon {
        background: $primary;
        color: $white;
      }
    }
  }

  &__card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: $radius-full;
    background: rgba($primary, 0.1);
    color: $primary;
    transition: all $transition-base;
  }

  h3 {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0;
  }

  p {
    font-size: $font-size-sm;
    color: $gray-600;
    margin: 0;
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
