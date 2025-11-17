<template>
  <div class="page-header">
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

        <div class="page-header__underline"></div>
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

withDefaults(defineProps<Props>(), {
  description: '',
  backgroundImage: '',
  breadcrumbs: () => [],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.page-header {
  background: $white;
  padding: 5.5rem 0 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid $gray-100;

  @media (max-width: $breakpoint-md) {
    padding: 4.5rem 0 0.75rem;
    margin-bottom: 1.5rem;
  }
}

.container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $container-padding;
}

.page-header__content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.page-header__breadcrumbs {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-xs;
  margin-bottom: $spacing-md;
  font-size: $font-size-xs;
  opacity: 0.8;

  .breadcrumb-item {
    color: $gray-500;
    text-decoration: none;
    transition: all 0.2s ease;
    font-weight: $font-weight-medium;

    &:hover:not(.breadcrumb-item--active) {
      color: $primary-500;
    }

    &--active {
      color: $gray-700;
      font-weight: $font-weight-semibold;
    }
  }

  .breadcrumb-separator {
    color: $gray-300;
    margin: 0 2px;
  }
}

.page-header__title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin: 0 0 $spacing-xs;
  line-height: $line-height-tight;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.4s ease-out;
}

.page-header__description {
  font-size: $font-size-sm;
  color: $gray-500;
  margin: 0 0 $spacing-md;
  line-height: $line-height-relaxed;
  animation: fadeInUp 0.4s ease-out 0.05s backwards;
}

.page-header__underline {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, $primary-500, $primary-light);
  margin: 0 auto;
  border-radius: 2px;
  animation: scaleIn 0.3s ease-out 0.1s backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scaleX(0);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}
</style>
