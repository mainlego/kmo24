<template>
  <div
    class="base-radio"
    :class="{ 'base-radio--disabled': disabled, 'base-radio--error': error }"
  >
    <label :for="radioId" class="base-radio__label">
      <input
        :id="radioId"
        v-model="localValue"
        type="radio"
        :value="value"
        :name="name"
        :disabled="disabled"
        :required="required"
        class="base-radio__input"
        @change="handleChange"
      />

      <span class="base-radio__circle">
        <span v-if="isChecked" class="base-radio__dot" />
      </span>

      <span v-if="$slots.default || label" class="base-radio__text">
        <slot>{{ label }}</slot>
      </span>
    </label>

    <p v-if="error" class="base-radio__error">{{ error }}</p>
    <p v-else-if="hint" class="base-radio__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: unknown;
  value: unknown;
  name?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: unknown];
  change: [value: unknown];
}>();

const radioId = `radio-${Math.random().toString(36).substr(2, 9)}`;

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isChecked = computed(() => {
  return props.modelValue === props.value;
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    emit('change', props.value);
  }
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-radio {
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

  &__circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border: 2px solid $gray-300;
    border-radius: $radius-full;
    background: $white;
    transition: all $transition-base $transition-ease;
    margin-top: 2px;

    .base-radio__input:checked ~ & {
      border-color: $primary;
      background: $white;
    }

    .base-radio__input:focus ~ & {
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }

    .base-radio__input:hover:not(:disabled) ~ & {
      border-color: $primary;
    }

    .base-radio__input:disabled ~ & {
      background: $gray-100;
      border-color: $gray-300;
      opacity: 0.6;
    }
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: $radius-full;
    background: $primary;
    transition: all $transition-base $transition-ease;

    .base-radio__input:disabled ~ .base-radio__circle & {
      background: $gray-400;
    }
  }

  &__text {
    flex: 1;
    font-size: $font-size-base;
    color: $gray-700;
    line-height: 1.5;

    .base-radio__input:disabled ~ & {
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

  &--error &__circle {
    border-color: $error;

    .base-radio__input:checked ~ & {
      border-color: $error;
    }

    .base-radio__input:focus ~ & {
      box-shadow: 0 0 0 3px rgba($error, 0.1);
    }
  }

  &--error &__dot {
    background: $error;
  }

  &--disabled &__label {
    cursor: not-allowed;
  }
}
</style>
