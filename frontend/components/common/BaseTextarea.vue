<template>
  <div
    class="base-textarea"
    :class="{ 'base-textarea--error': error, 'base-textarea--disabled': disabled }"
  >
    <label v-if="label" :for="textareaId" class="base-textarea__label">
      {{ label }}
      <span v-if="required" class="base-textarea__required">*</span>
    </label>

    <div class="base-textarea__wrapper">
      <textarea
        :id="textareaId"
        v-model="localValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        class="base-textarea__field"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <span v-if="maxlength && showCounter" class="base-textarea__counter">
        {{ characterCount }} / {{ maxlength }}
      </span>
    </div>

    <p v-if="error" class="base-textarea__error">{{ error }}</p>
    <p v-else-if="hint" class="base-textarea__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  maxlength?: number;
  autocomplete?: string;
  showCounter?: boolean;
  autoResize?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
  showCounter: true,
  autoResize: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  input: [event: Event];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`;

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const characterCount = computed(() => {
  return props.modelValue?.length || 0;
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;

  // Auto-resize functionality
  if (props.autoResize) {
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  }

  emit('input', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-textarea {
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
    position: relative;
    display: flex;
    flex-direction: column;
  }

  &__field {
    width: 100%;
    padding: $spacing-md;
    border: 1px solid $gray-300;
    border-radius: $radius-lg;
    font-family: $font-family-base;
    font-size: $font-size-base;
    color: $gray-900;
    background: $white;
    resize: vertical;
    transition: all $transition-base $transition-ease;
    line-height: 1.5;

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

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: $gray-100;
      border-radius: $radius-full;
    }

    &::-webkit-scrollbar-thumb {
      background: $gray-300;
      border-radius: $radius-full;

      &:hover {
        background: $gray-400;
      }
    }
  }

  &__counter {
    display: flex;
    justify-content: flex-end;
    margin-top: $spacing-xs;
    font-size: $font-size-xs;
    color: $gray-500;
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

  &--error &__counter {
    color: $error;
  }
}
</style>
