<template>
  <div class="form-group" :class="{ 'has-error': error }">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="input-wrapper">
      <div v-if="$slots.prefix || icon" class="input-prefix">
        <slot name="prefix">
          <component v-if="icon" :is="icon" class="input-icon" />
        </slot>
      </div>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :autocomplete="autocomplete"
        class="form-input"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <div v-if="$slots.suffix || clearable" class="input-suffix">
        <button
          v-if="clearable && modelValue"
          type="button"
          class="clear-btn"
          @click="handleClear"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
        <slot name="suffix" />
      </div>
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-else-if="hint" class="hint-message">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';

interface Props {
  modelValue?: string | number;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  clearable?: boolean;
  icon?: any;
  id?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  autocomplete?: string;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  autocomplete: 'off',
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

const isFocused = ref(false);
const generatedId = useId();

const id = computed(() => props.id || generatedId);

const inputClasses = computed(() => ({
  'has-prefix': !!props.icon,
  'has-suffix': props.clearable,
  [`input-${props.size}`]: true,
}));

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleClear = () => {
  emit('update:modelValue', '');
};
</script>

<style scoped lang="scss">
.form-group {
  margin-bottom: 1.5rem;

  &.has-error {
    .form-input {
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

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix,
.input-suffix {
  position: absolute;
  display: flex;
  align-items: center;
  color: #6b7280;
  z-index: 1;
}

.input-prefix {
  left: 0.75rem;

  .input-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.input-suffix {
  right: 0.75rem;

  .clear-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #9ca3af;
    transition: color 0.2s;

    &:hover {
      color: #6b7280;
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #111827;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s;

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

  &::placeholder {
    color: #9ca3af;
  }

  &.has-prefix {
    padding-left: 2.75rem;
  }

  &.has-suffix {
    padding-right: 2.75rem;
  }

  &.input-sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }

  &.input-lg {
    padding: 0.75rem 1rem;
    font-size: 1rem;
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
