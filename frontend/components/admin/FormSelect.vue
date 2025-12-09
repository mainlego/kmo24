<template>
  <div class="form-group" :class="{ 'has-error': error }">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="select-wrapper">
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        class="form-select"
        @change="handleChange"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      <div class="select-icon">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-else-if="hint" class="hint-message">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

interface SelectOption {
  value: string | number;
  label: string;
  [key: string]: any;
}

interface Props {
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  options: SelectOption[] | string[] | number[];
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  valueKey?: string;
  labelKey?: string;
}

const props = withDefaults(defineProps<Props>(), {
  valueKey: 'value',
  labelKey: 'label',
});

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus']);

const generatedId = useId();
const id = computed(() => props.id || generatedId);

const getOptionValue = (option: any) => {
  if (typeof option === 'object') {
    return option[props.valueKey];
  }
  return option;
};

const getOptionLabel = (option: any) => {
  if (typeof option === 'object') {
    return option[props.labelKey];
  }
  return option;
};

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;

  // Попытка преобразовать в число, если исходное значение было числом
  const numValue = Number(value);
  const finalValue = !isNaN(numValue) && typeof props.modelValue === 'number'
    ? numValue
    : value;

  emit('update:modelValue', finalValue);
  emit('change', finalValue);
};
</script>

<style scoped lang="scss">
.form-group {
  margin-bottom: 1.5rem;

  &.has-error {
    .form-select {
      border-color: #ef4444;

      &:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    }
  }
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;

  .required {
    color: #ef4444;
    margin-left: 0.25rem;
  }
}

.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 0.625rem 2.5rem 0.625rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #111827;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  appearance: none;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }

  option {
    padding: 0.5rem;
  }
}

.select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.error-message {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: #ef4444;
}

.hint-message {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: #6b7280;
}
</style>
