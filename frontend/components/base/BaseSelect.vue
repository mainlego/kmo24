<template>
  <div class="base-select" :class="{ 'base-select--error': error }">
    <label v-if="label" :for="selectId" class="base-select__label">
      {{ label }}
      <span v-if="required" class="base-select__required">*</span>
    </label>

    <div class="base-select__wrapper">
      <select
        :id="selectId"
        class="base-select__field"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        @change="handleChange"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <span v-if="error" class="base-select__error">{{ error }}</span>
    <span v-else-if="hint" class="base-select__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  options: Option[];
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  required: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  change: [event: Event];
}>();

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
  emit('change', event);
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-select {
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
    position: relative;
    border: 1px solid $gray-300;
    border-radius: $radius-md;
    background: $white;
    transition: all $transition-base $transition-ease;

    &::after {
      content: '';
      position: absolute;
      right: $spacing-md;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid $gray-500;
      pointer-events: none;
    }

    &:focus-within {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }
  }

  &__field {
    width: 100%;
    padding: $spacing-sm $spacing-md;
    padding-right: $spacing-xl;
    border: none;
    outline: none;
    font-family: $font-family-base;
    font-size: $font-size-base;
    color: $gray-900;
    background: transparent;
    cursor: pointer;
    appearance: none;

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
