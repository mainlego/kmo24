<template>
  <div class="page-header" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="page-header__overlay"></div>
    <div class="container">
      <div class="page-header__content">
        <div class="page-header__breadcrumbs" v-if="breadcrumbs && breadcrumbs.length">
          <NuxtLink to="/" class="breadcrumb-item">Главная</NuxtLink>
          <span class="breadcrumb-separator">/</span>
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <NuxtLink
              v-if="crumb.to"
              :to="crumb.to"
              class="breadcrumb-item"
            >
              {{ crumb.text }}
            </NuxtLink>
            <span v-else class="breadcrumb-item breadcrumb-item--active">
              {{ crumb.text }}
            </span>
            <span
              v-if="index < breadcrumbs.length - 1"
              class="breadcrumb-separator"
            >
              /
            </span>
          </template>
        </div>

        <h1 class="page-header__title">{{ title }}</h1>

        <p v-if="description" class="page-header__description">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Breadcrumb {
  text: string;
  to?: string;
}

interface Props {
  title: string;
  description?: string;
  backgroundImage?: string;
  breadcrumbs?: Breadcrumb[];
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  backgroundImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=400&fit=crop',
  breadcrumbs: () => [],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.page-header {
  position: relative;
  background-size: cover;
  background-position: center;
  padding: 6rem 0 4rem;
  margin-bottom: 3rem;
  overflow: hidden;

  @media (max-width: $breakpoint-md) {
    padding: 4rem 0 3rem;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba($primary, 0.85) 0%,
      rgba($secondary, 0.75) 100%
    );
    z-index: 1;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
    z-index: 2;
  }
}

.container {
  position: relative;
  z-index: 3;
}

.page-header__content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.page-header__breadcrumbs {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-xs;
  margin-bottom: $spacing-lg;
  font-size: $font-size-sm;

  .breadcrumb-item {
    color: rgba($white, 0.9);
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover:not(.breadcrumb-item--active) {
      color: $white;
      text-decoration: underline;
    }

    &--active {
      color: $white;
      font-weight: $font-weight-semibold;
    }
  }

  .breadcrumb-separator {
    color: rgba($white, 0.5);
  }
}

.page-header__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: $font-weight-bold;
  color: $white;
  margin: 0 0 $spacing-lg;
  line-height: $line-height-tight;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.6s ease-out;
}

.page-header__description {
  font-size: clamp($font-size-base, 2vw, $font-size-lg);
  color: rgba($white, 0.95);
  margin: 0;
  line-height: $line-height-relaxed;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.6s ease-out 0.1s backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
