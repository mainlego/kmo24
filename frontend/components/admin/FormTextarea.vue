<template>
  <div class="form-group" :class="{ 'has-error': error }">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :maxlength="maxlength"
      class="form-textarea"
      @input="handleInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    <div v-if="maxlength" class="character-count">
      {{ characterCount }} / {{ maxlength }}
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-else-if="hint" class="hint-message">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

interface Props {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  maxlength?: number;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  rows: 4,
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus']);

const generatedId = useId();
const id = computed(() => props.id || generatedId);

const characterCount = computed(() => (props.modelValue || '').length);

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};
</script>

<style scoped lang="scss">
.form-group {
  margin-bottom: 1.5rem;

  &.has-error {
    .form-textarea {
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

.form-textarea {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #111827;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
    resize: none;
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.character-count {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
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
