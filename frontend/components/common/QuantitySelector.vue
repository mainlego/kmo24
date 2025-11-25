<template>
  <div class="quantity-selector" :class="{ 'quantity-selector--compact': compact }">
    <button
      class="quantity-selector__button"
      type="button"
      :disabled="modelValue <= min || disabled"
      @click="decrease"
      aria-label="Уменьшить количество"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>

    <input
      v-model.number="localValue"
      class="quantity-selector__input"
      type="number"
      :min="min"
      :max="max"
      :disabled="disabled"
      @blur="handleBlur"
      @keypress="handleKeypress"
    />

    <button
      class="quantity-selector__button"
      type="button"
      :disabled="modelValue >= max || disabled"
      @click="increase"
      aria-label="Увеличить количество"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 999,
  disabled: false,
  compact: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);

const decrease = () => {
  if (localValue.value > props.min) {
    localValue.value--;
    emit('update:modelValue', localValue.value);
  }
};

const increase = () => {
  if (localValue.value < props.max) {
    localValue.value++;
    emit('update:modelValue', localValue.value);
  }
};

const handleBlur = () => {
  // Validate and correct value on blur
  if (localValue.value < props.min) {
    localValue.value = props.min;
  } else if (localValue.value > props.max) {
    localValue.value = props.max;
  }
  emit('update:modelValue', localValue.value);
};

const handleKeypress = (e: KeyboardEvent) => {
  // Only allow numbers
  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
    e.preventDefault();
  }
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.quantity-selector {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  background: $white;
  border: 1px solid $gray-300;
  border-radius: $radius-md;
  padding: $spacing-xs;
  transition: all $transition-base $transition-ease;

  &:focus-within {
    border-color: $primary-500;
    box-shadow: 0 0 0 3px rgba($primary-500, 0.1);
  }

  &--compact {
    padding: 2px;
    gap: 2px;

    .quantity-selector__button {
      width: 24px;
      height: 24px;
      padding: 2px;

      svg {
        width: 14px;
        height: 14px;
      }
    }

    .quantity-selector__input {
      width: 32px;
      font-size: $font-size-sm;
      padding: 2px 4px;
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: $spacing-xs;
    background: $gray-100;
    border: none;
    border-radius: $radius-sm;
    color: $gray-700;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    flex-shrink: 0;

    svg {
      flex-shrink: 0;
    }

    &:hover:not(:disabled) {
      background: $primary-50;
      color: $primary-600;
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  &__input {
    width: 48px;
    height: 32px;
    padding: $spacing-xs;
    border: none;
    background: transparent;
    text-align: center;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $gray-900;
    outline: none;

    // Remove number input arrows
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type='number'] {
      -moz-appearance: textfield;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
}
</style>
