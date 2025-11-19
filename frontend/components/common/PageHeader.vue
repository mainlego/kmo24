<template>
  <div class="page-header">
    <div class="container">
      <div class="page-header__content">
        <nav class="page-header__breadcrumbs" v-if="breadcrumbs && breadcrumbs.length" aria-label="Навигационная цепочка">
          <div class="breadcrumb-wrapper">
            <NuxtLink to="/" class="breadcrumb-item">
              <svg class="breadcrumb-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Главная</span>
            </NuxtLink>
            <span class="breadcrumb-separator">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
            <template v-for="(crumb, index) in breadcrumbs" :key="index">
              <NuxtLink
                v-if="crumb.to"
                :to="crumb.to"
                class="breadcrumb-item"
              >
                <span>{{ crumb.text }}</span>
              </NuxtLink>
              <span v-else class="breadcrumb-item breadcrumb-item--active">
                <span>{{ crumb.text }}</span>
              </span>
              <span
                v-if="index < breadcrumbs.length - 1"
                class="breadcrumb-separator"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </span>
            </template>
          </div>
        </nav>

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

// Container is defined globally in main.scss

.page-header__content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

// =====================================================
// PREMIUM BREADCRUMBS
// =====================================================

.page-header__breadcrumbs {
  margin-bottom: $spacing-lg;
  animation: fadeInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: $breakpoint-sm) {
    margin-bottom: $spacing-md;
  }
}

.breadcrumb-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background: linear-gradient(135deg, rgba($primary-500, 0.04), rgba($primary-light, 0.04));
  border: 1px solid rgba($primary-500, 0.1);
  border-radius: $radius-full;
  backdrop-filter: blur(10px);
  width: fit-content;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba($primary-500, 0.08), rgba($primary-light, 0.08));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-xs $spacing-sm;
    gap: 4px;
  }
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: $gray-600;
  text-decoration: none;
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  padding: 4px 8px;
  border-radius: $radius-md;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;

  @media (max-width: $breakpoint-sm) {
    padding: 2px 6px;
    font-size: 10px;
    gap: 4px;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba($primary-500, 0.1), rgba($primary-light, 0.1));
    border-radius: $radius-md;
    opacity: 0;
    transform: scale(0.9);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover:not(.breadcrumb-item--active) {
    color: $primary-600;
    transform: translateY(-1px);

    &::before {
      opacity: 1;
      transform: scale(1);
    }

    .breadcrumb-icon {
      transform: scale(1.15) rotate(-5deg);
      stroke: $primary-500;
    }

    span {
      transform: translateX(2px);
    }
  }

  &:active:not(.breadcrumb-item--active) {
    transform: translateY(0);
  }

  &--active {
    color: $primary-600;
    font-weight: $font-weight-semibold;
    background: linear-gradient(135deg, rgba($primary-500, 0.15), rgba($primary-light, 0.15));
    box-shadow: 0 2px 8px rgba($primary-500, 0.15);
    pointer-events: none;

    span {
      background: linear-gradient(135deg, $primary-600, darken($primary-500, 5%));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  span {
    position: relative;
    z-index: 1;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.breadcrumb-icon {
  flex-shrink: 0;
  stroke: currentColor;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;

  @media (max-width: $breakpoint-sm) {
    width: 12px;
    height: 12px;
  }
}

.breadcrumb-separator {
  display: inline-flex;
  align-items: center;
  color: $gray-400;
  margin: 0 2px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  svg {
    stroke: currentColor;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover svg {
    color: $primary-500;
    transform: translateX(2px);
  }

  @media (max-width: $breakpoint-sm) {
    margin: 0;

    svg {
      width: 10px;
      height: 10px;
    }
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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
