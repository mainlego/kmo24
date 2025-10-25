<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :to="to"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-if="icon && !loading" class="icon" :class="{ 'icon-only': !$slots.default }">
      {{ icon }}
    </span>
    <span v-if="$slots.default && !loading" class="button-content">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  to?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const tag = computed(() => (props.to ? resolveComponent('NuxtLink') : 'button'));

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--disabled': props.disabled,
    'base-button--loading': props.loading,
    'base-button--full-width': props.fullWidth,
  },
]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  border: none;
  border-radius: $radius-lg;
  font-family: $font-family-base;
  font-weight: $font-weight-medium;
  font-size: $font-size-base;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: all $transition-base $transition-ease;
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid $primary;
    outline-offset: 2px;
  }

  // Variants
  &--primary {
    background: $gradient-primary;
    color: $white;
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);

    &:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
      transform: translateY(-2px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
    }
  }

  &--secondary {
    background: $gray-600;
    color: $white;

    &:hover:not(:disabled) {
      background: darken($gray-600, 10%);
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

  &--ghost {
    background: transparent;
    color: $gray-700;

    &:hover:not(:disabled) {
      background: $gray-100;
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
    padding: $spacing-sm $spacing-md;
    font-size: $font-size-sm;
  }

  &--md {
    padding: $spacing-md $spacing-xl;
    font-size: $font-size-base;
  }

  &--lg {
    padding: $spacing-lg $spacing-2xl;
    font-size: $font-size-lg;
  }

  // States
  &--disabled,
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  &--loading {
    pointer-events: none;
  }

  &--full-width {
    width: 100%;
  }

  // Elements
  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;

    &-only {
      margin: 0;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
