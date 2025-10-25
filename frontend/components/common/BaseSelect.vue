<template>
  <div
    class="base-select"
    :class="{ 'base-select--error': error, 'base-select--disabled': disabled }"
  >
    <label v-if="label" :for="selectId" class="base-select__label">
      {{ label }}
      <span v-if="required" class="base-select__required">*</span>
    </label>

    <div class="base-select__wrapper">
      <select
        :id="selectId"
        v-model="localValue"
        :disabled="disabled"
        :required="required"
        class="base-select__field"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled selected>
          {{ placeholder }}
        </option>

        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
          :disabled="option.disabled"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>

      <span class="base-select__icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </div>

    <p v-if="error" class="base-select__error">{{ error }}</p>
    <p v-else-if="hint" class="base-select__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type OptionValue = string | number;

interface Option {
  label: string;
  value: OptionValue;
  disabled?: boolean;
}

interface Props {
  modelValue: OptionValue;
  options: Option[] | OptionValue[];
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  valueKey?: string;
  labelKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  valueKey: 'value',
  labelKey: 'label',
});

const emit = defineEmits<{
  'update:modelValue': [value: OptionValue];
  change: [value: OptionValue];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
}>();

const selectId = `select-${Math.random().toString(36).substr(2, 9)}`;

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const getOptionValue = (option: Option | OptionValue): OptionValue => {
  if (typeof option === 'object') {
    return option[props.valueKey as keyof Option] as OptionValue;
  }
  return option;
};

const getOptionLabel = (option: Option | OptionValue): string => {
  if (typeof option === 'object') {
    return String(option[props.labelKey as keyof Option]);
  }
  return String(option);
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  emit('change', value);
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

.base-select {
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
    align-items: center;
  }

  &__field {
    flex: 1;
    appearance: none;
    padding: $spacing-md;
    padding-right: $spacing-xl * 2;
    border: 1px solid $gray-300;
    border-radius: $radius-lg;
    font-family: $font-family-base;
    font-size: $font-size-base;
    color: $gray-900;
    background: $white;
    cursor: pointer;
    transition: all $transition-base $transition-ease;

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

    // Placeholder option
    option[value=''][disabled] {
      color: $gray-400;
    }

    option:disabled {
      color: $gray-400;
    }
  }

  &__icon {
    position: absolute;
    right: $spacing-md;
    display: flex;
    align-items: center;
    pointer-events: none;
    color: $gray-500;
    transition: transform $transition-base $transition-ease;
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

  &--disabled &__icon {
    opacity: 0.6;
  }

  // Focus state animation for icon
  &__field:focus ~ &__icon {
    transform: rotate(180deg);
  }
}
</style>
