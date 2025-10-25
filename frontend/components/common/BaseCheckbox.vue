<template>
  <div
    class="base-checkbox"
    :class="{ 'base-checkbox--disabled': disabled, 'base-checkbox--error': error }"
  >
    <label :for="checkboxId" class="base-checkbox__label">
      <input
        :id="checkboxId"
        v-model="localValue"
        type="checkbox"
        :value="value"
        :disabled="disabled"
        :required="required"
        class="base-checkbox__input"
        @change="handleChange"
      />

      <span class="base-checkbox__box">
        <svg
          v-if="localChecked"
          class="base-checkbox__icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.3333 4L6 11.3333L2.66667 8"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>

      <span v-if="$slots.default || label" class="base-checkbox__text">
        <slot>{{ label }}</slot>
      </span>
    </label>

    <p v-if="error" class="base-checkbox__error">{{ error }}</p>
    <p v-else-if="hint" class="base-checkbox__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean | unknown[];
  value?: unknown;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean | unknown[]];
  change: [checked: boolean];
}>();

const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const localChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value);
  }
  return props.modelValue;
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('change', target.checked);
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-checkbox {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  &__label {
    display: inline-flex;
    align-items: flex-start;
    gap: $spacing-sm;
    cursor: pointer;
    user-select: none;
  }

  &__input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  &__box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border: 2px solid $gray-300;
    border-radius: $radius-sm;
    background: $white;
    transition: all $transition-base $transition-ease;
    margin-top: 2px;

    .base-checkbox__input:checked ~ & {
      background: $primary;
      border-color: $primary;
    }

    .base-checkbox__input:focus ~ & {
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }

    .base-checkbox__input:hover:not(:disabled) ~ & {
      border-color: $primary;
    }

    .base-checkbox__input:disabled ~ & {
      background: $gray-100;
      border-color: $gray-300;
      opacity: 0.6;
    }
  }

  &__icon {
    color: $white;
  }

  &__text {
    flex: 1;
    font-size: $font-size-base;
    color: $gray-700;
    line-height: 1.5;

    .base-checkbox__input:disabled ~ & {
      color: $gray-400;
    }
  }

  &__error {
    font-size: $font-size-sm;
    color: $error;
    margin: 0;
    margin-left: calc(20px + #{$spacing-sm});
  }

  &__hint {
    font-size: $font-size-sm;
    color: $gray-500;
    margin: 0;
    margin-left: calc(20px + #{$spacing-sm});
  }

  &--error &__box {
    border-color: $error;

    .base-checkbox__input:checked ~ & {
      background: $error;
      border-color: $error;
    }

    .base-checkbox__input:focus ~ & {
      box-shadow: 0 0 0 3px rgba($error, 0.1);
    }
  }

  &--disabled &__label {
    cursor: not-allowed;
  }
}
</style>
