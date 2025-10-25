<template>
  <span
    class="base-badge"
    :class="[
      `base-badge--${variant}`,
      `base-badge--${size}`,
      { 'base-badge--rounded': rounded, 'base-badge--outline': outline },
    ]"
  >
    <span v-if="$slots.icon || icon" class="base-badge__icon">
      <slot name="icon">
        <component :is="icon" v-if="icon" />
      </slot>
    </span>

    <span class="base-badge__text">
      <slot />
    </span>

    <button
      v-if="closable"
      type="button"
      class="base-badge__close"
      @click="handleClose"
      aria-label="Закрыть"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  outline?: boolean;
  closable?: boolean;
  icon?: unknown;
}

withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  size: 'md',
  rounded: false,
  outline: false,
  closable: false,
});

const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => {
  emit('close');
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-badge {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  font-weight: $font-weight-medium;
  line-height: 1;
  white-space: nowrap;
  border-radius: $radius-md;
  transition: all $transition-base $transition-ease;

  // Sizes
  &--sm {
    padding: 4px 8px;
    font-size: $font-size-xs;
  }

  &--md {
    padding: 6px 12px;
    font-size: $font-size-sm;
  }

  &--lg {
    padding: 8px 16px;
    font-size: $font-size-base;
  }

  // Rounded
  &--rounded {
    border-radius: $radius-full;
  }

  // Variants - Solid
  &--primary {
    background: $primary;
    color: $white;
  }

  &--secondary {
    background: $gray-200;
    color: $gray-700;
  }

  &--success {
    background: $success;
    color: $white;
  }

  &--warning {
    background: $warning;
    color: $gray-900;
  }

  &--danger {
    background: $error;
    color: $white;
  }

  &--info {
    background: #3b82f6;
    color: $white;
  }

  &--neutral {
    background: $gray-100;
    color: $gray-700;
  }

  // Outline variants
  &--outline {
    background: transparent;

    &.base-badge--primary {
      border: 1px solid $primary;
      color: $primary;
    }

    &.base-badge--secondary {
      border: 1px solid $gray-300;
      color: $gray-700;
    }

    &.base-badge--success {
      border: 1px solid $success;
      color: $success;
    }

    &.base-badge--warning {
      border: 1px solid $warning;
      color: darken($warning, 20%);
    }

    &.base-badge--danger {
      border: 1px solid $error;
      color: $error;
    }

    &.base-badge--info {
      border: 1px solid #3b82f6;
      color: #3b82f6;
    }

    &.base-badge--neutral {
      border: 1px solid $gray-300;
      color: $gray-600;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 1em;
      height: 1em;
    }
  }

  &__text {
    display: inline-flex;
    align-items: center;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: $spacing-xs;
    border: none;
    background: transparent;
    color: currentColor;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity $transition-base $transition-ease;

    &:hover {
      opacity: 1;
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }
}
</style>
