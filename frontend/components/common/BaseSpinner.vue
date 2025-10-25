<template>
  <div class="base-spinner" :class="[`base-spinner--${size}`, `base-spinner--${variant}`]">
    <svg
      class="base-spinner__svg"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="base-spinner__circle"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="5"
      />
    </svg>

    <span v-if="$slots.default || text" class="base-spinner__text">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  text?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-spinner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;

  // Sizes
  &--sm {
    .base-spinner__svg {
      width: 20px;
      height: 20px;
    }

    .base-spinner__text {
      font-size: $font-size-sm;
    }
  }

  &--md {
    .base-spinner__svg {
      width: 32px;
      height: 32px;
    }

    .base-spinner__text {
      font-size: $font-size-base;
    }
  }

  &--lg {
    .base-spinner__svg {
      width: 48px;
      height: 48px;
    }

    .base-spinner__text {
      font-size: $font-size-lg;
    }
  }

  &--xl {
    .base-spinner__svg {
      width: 64px;
      height: 64px;
    }

    .base-spinner__text {
      font-size: $font-size-xl;
    }
  }

  &__svg {
    animation: rotate 2s linear infinite;
  }

  &__circle {
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  // Variants
  &--primary &__circle {
    stroke: $primary;
  }

  &--secondary &__circle {
    stroke: $gray-500;
  }

  &--white &__circle {
    stroke: $white;
  }

  &__text {
    color: $gray-700;
    font-weight: $font-weight-medium;
  }

  &--white &__text {
    color: $white;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
