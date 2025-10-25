<template>
  <div class="base-input" :class="{ 'base-input--error': error, 'base-input--disabled': disabled }">
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
        v-model="localValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :pattern="pattern"
        :autocomplete="autocomplete"
        class="base-input__field"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <span v-if="$slots.suffix" class="base-input__suffix">
        <slot name="suffix" />
      </span>
    </div>

    <p v-if="error" class="base-input__error">{{ error }}</p>
    <p v-else-if="hint" class="base-input__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-input {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;

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
    position: relative;
  }

  &__prefix,
  &__suffix {
    display: flex;
    align-items: center;
    color: $gray-500;
  }

  &__field {
    flex: 1;
    padding: $spacing-md;
    border: 1px solid $gray-300;
    border-radius: $radius-lg;
    font-family: $font-family-base;
    font-size: $font-size-base;
    color: $gray-900;
    background: $white;
    transition: all $transition-base $transition-ease;

    &::placeholder {
      color: $gray-400;
    }

    &:hover:not(:disabled) {
      border-color: $gray-400;
    }

    &:focus {
      outline: none;
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }

    &:disabled {
      background: $gray-100;
      cursor: not-allowed;
      opacity: 0.6;
    }

    &:read-only {
      background: $gray-50;
      cursor: default;
    }
  }

  &__error {
    font-size: $font-size-sm;
    color: $error;
    margin: 0;
  }

  &__hint {
    font-size: $font-size-sm;
    color: $gray-500;
    margin: 0;
  }

  &--error &__field {
    border-color: $error;

    &:focus {
      box-shadow: 0 0 0 3px rgba($error, 0.1);
    }
  }
}
</style>
