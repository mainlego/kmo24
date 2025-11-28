<template>
  <nav class="breadcrumbs" aria-label="Хлебные крошки">
    <div class="breadcrumbs__container">
      <ul class="breadcrumbs__list">
        <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumbs__item">
          <NuxtLink
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.path"
            class="breadcrumbs__link"
          >
            <svg v-if="index === 0" class="breadcrumbs__home-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ crumb.label }}</span>
          </NuxtLink>
          <span v-else class="breadcrumbs__current">
            {{ crumb.label }}
          </span>

          <svg v-if="index < breadcrumbs.length - 1" class="breadcrumbs__separator" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface Breadcrumb {
  label: string;
  path: string;
}

interface Props {
  breadcrumbs: Breadcrumb[];
}

defineProps<Props>();
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.breadcrumbs {
  padding: $spacing-md 0;
  background: linear-gradient(135deg, $gray-50 0%, $white 100%);
  border-bottom: 1px solid rgba($gray-200, 0.5);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);

  &__container {
    max-width: $container-max-width;
    margin: 0 auto;
    padding: 0 $spacing-lg;

    @media (max-width: $breakpoint-md) {
      padding: 0 $spacing-md;
    }
  }

  &__list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: $spacing-xs;
  }

  &__item {
    display: flex;
    align-items: center;
    font-size: 13px;
    line-height: 1.5;

    @media (max-width: $breakpoint-sm) {
      font-size: 12px;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    color: $gray-600;
    text-decoration: none;
    padding: 4px 8px;
    border-radius: $radius-md;
    transition: all 0.2s ease;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, $primary-100 0%, $secondary-100 100%);
      border-radius: $radius-md;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover {
      color: $primary-600;

      &::before {
        opacity: 1;
      }

      span {
        position: relative;
        z-index: 1;
      }

      .breadcrumbs__home-icon {
        position: relative;
        z-index: 1;
        transform: translateY(-1px);
      }
    }
  }

  &__current {
    color: $gray-900;
    font-weight: $font-weight-medium;
    padding: 4px 8px;
    background: linear-gradient(135deg, rgba($primary-500, 0.1) 0%, rgba($secondary-500, 0.1) 100%);
    border-radius: $radius-md;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: $breakpoint-sm) {
      max-width: 150px;
    }
  }

  &__home-icon {
    flex-shrink: 0;
    color: inherit;
    transition: transform 0.2s ease;
  }

  &__separator {
    margin: 0 2px;
    color: $gray-400;
    flex-shrink: 0;
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .breadcrumbs {
    background: linear-gradient(135deg, $gray-900 0%, $gray-800 100%);
    border-bottom-color: rgba($gray-700, 0.5);

    &__link {
      color: $gray-400;

      &:hover {
        color: $primary-400;
      }
    }

    &__current {
      color: $white;
      background: linear-gradient(135deg, rgba($primary-500, 0.2) 0%, rgba($secondary-500, 0.2) 100%);
    }

    &__separator {
      color: $gray-600;
    }
  }
}
</style>