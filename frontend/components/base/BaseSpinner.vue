<template>
  <div class="base-spinner" :class="`base-spinner--${size}`">
    <div class="base-spinner__circle">
      <svg viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="4"></circle>
      </svg>
    </div>
    <p v-if="text" class="base-spinner__text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;

  &--sm {
    .base-spinner__circle {
      width: 24px;
      height: 24px;
    }
  }

  &--md {
    .base-spinner__circle {
      width: 40px;
      height: 40px;
    }
  }

  &--lg {
    .base-spinner__circle {
      width: 64px;
      height: 64px;
    }
  }

  &__circle {
    animation: rotate 2s linear infinite;

    svg {
      width: 100%;
      height: 100%;
    }

    .path {
      stroke: $primary;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
  }

  &__text {
    margin: 0;
    font-size: $font-size-sm;
    color: $gray-600;
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
