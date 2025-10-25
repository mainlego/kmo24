<template>
  <div class="base-input" :class="{ 'base-input--error': error }">
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>

    <div class="base-input__wrapper">
      <span v-if="$slots.prefix" class="base-input__prefix">
        <slot name="prefix" />
      </span>

      <input
        :id="inputId"
        class="base-input__field"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :min="min"
        :max="max"
        @input="handleInput"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
      />

      <span v-if="$slots.suffix" class="base-input__suffix">
        <slot name="suffix" />
      </span>
    </div>

    <span v-if="error" class="base-input__error">{{ error }}</span>
    <span v-else-if="hint" class="base-input__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
  input: [event: Event];
}>();

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('input', event);
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-input {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-700;
  }

  &__required {
    color: $error;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    border: 1px solid $gray-300;
    border-radius: $radius-md;
    background: $white;
    transition: all $transition-base $transition-ease;

    &:focus-within {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }
  }

  &__prefix,
  &__suffix {
    display: flex;
    align-items: center;
    padding: 0 $spacing-sm;
    color: $gray-500;
  }

  &__field {
    flex: 1;
    padding: $spacing-sm $spacing-md;
    border: none;
    outline: none;
    font-family: $font-family-base;
    font-size: $font-size-base;
    color: $gray-900;
    background: transparent;

    &::placeholder {
      color: $gray-400;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &__error {
    font-size: $font-size-sm;
    color: $error;
  }

  &__hint {
    font-size: $font-size-sm;
    color: $gray-500;
  }

  &--error &__wrapper {
    border-color: $error;

    &:focus-within {
      box-shadow: 0 0 0 3px rgba($error, 0.1);
    }
  }
}
</style>
