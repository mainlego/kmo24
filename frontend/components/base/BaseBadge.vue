<template>
  <span
    class="base-badge"
    :class="[
      `base-badge--${variant}`,
      `base-badge--${size}`,
      {
        'base-badge--rounded': rounded,
        'base-badge--closable': closable,
      },
    ]"
  >
    <span class="base-badge__content">
      <slot />
    </span>
    <button
      v-if="closable"
      class="base-badge__close"
      type="button"
      @click="emit('close')"
    >
      ×
    </button>
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  closable?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  rounded: false,
  closable: false,
});

const emit = defineEmits<{
  close: [];
}>();
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-badge {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  font-weight: $font-weight-medium;
  border-radius: $radius-sm;
  white-space: nowrap;

  // Variants
  &--primary {
    background: rgba($primary, 0.1);
    color: $primary;
  }

  &--secondary {
    background: rgba($secondary, 0.1);
    color: $secondary;
  }

  &--success {
    background: rgba($success, 0.1);
    color: $success;
  }

  &--warning {
    background: rgba($warning, 0.1);
    color: $warning;
  }

  &--danger {
    background: rgba($error, 0.1);
    color: $error;
  }

  &--info {
    background: rgba($info, 0.1);
    color: $info;
  }

  // Sizes
  &--sm {
    padding: 2px $spacing-xs;
    font-size: $font-size-xs;
  }

  &--md {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-sm;
  }

  &--lg {
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-base;
  }

  &--rounded {
    border-radius: $radius-full;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    padding: 0;
    border: none;
    background: transparent;
    color: currentColor;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity $transition-base $transition-ease;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
