<template>
  <div class="base-checkbox">
    <input
      :id="checkboxId"
      type="checkbox"
      class="base-checkbox__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="handleChange"
    />
    <label :for="checkboxId" class="base-checkbox__label">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: boolean;
  label?: string;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [event: Event];
}>();

const checkboxId = computed(() => `checkbox-${Math.random().toString(36).substr(2, 9)}`);

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.checked);
  emit('change', event);
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-checkbox {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  cursor: pointer;

  &__input {
    width: 18px;
    height: 18px;
    border: 2px solid $gray-300;
    border-radius: $radius-sm;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    appearance: none;
    background: $white;
    position: relative;

    &:checked {
      background: $primary;
      border-color: $primary;

      &::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 2px;
        width: 4px;
        height: 8px;
        border: solid $white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba($primary, 0.2);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__label {
    font-size: $font-size-base;
    color: $gray-700;
    cursor: pointer;
    user-select: none;
  }
}
</style>
