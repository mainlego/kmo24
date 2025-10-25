<template>
  <button
    class="base-button"
    :class="[
      `base-button--${variant}`,
      `base-button--${size}`,
      {
        'base-button--loading': loading,
        'base-button--disabled': disabled,
        'base-button--full-width': fullWidth,
      },
    ]"
    :type="type"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__spinner">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    </span>
    <span v-if="!loading" class="base-button__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
  fullWidth: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  font-family: $font-family-base;
  font-weight: $font-weight-medium;
  border: none;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-base $transition-ease;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba($primary, 0.2);
  }

  // Variants
  &--primary {
    background: $primary;
    color: $white;

    &:hover:not(:disabled) {
      background: $primary-dark;
    }
  }

  &--secondary {
    background: $secondary;
    color: $white;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }

  &--outline {
    background: transparent;
    color: $primary;
    border: 2px solid $primary;

    &:hover:not(:disabled) {
      background: $primary;
      color: $white;
    }
  }

  &--text {
    background: transparent;
    color: $primary;

    &:hover:not(:disabled) {
      background: rgba($primary, 0.1);
    }
  }

  &--danger {
    background: $error;
    color: $white;

    &:hover:not(:disabled) {
      background: darken($error, 10%);
    }
  }

  // Sizes
  &--sm {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-sm;
  }

  &--md {
    padding: $spacing-sm $spacing-lg;
    font-size: $font-size-base;
  }

  &--lg {
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-lg;
  }

  // States
  &--loading {
    cursor: wait;
    opacity: 0.7;
  }

  &--disabled,
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--full-width {
    width: 100%;
  }

  &__spinner {
    display: inline-flex;
    width: 1em;
    height: 1em;
  }
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 100%;
  height: 100%;

  .path {
    stroke: currentColor;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
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
