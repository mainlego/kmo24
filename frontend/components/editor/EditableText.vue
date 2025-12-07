<template>
  <component
    :is="tag"
    ref="elementRef"
    :class="[
      'editable-text',
      { 'editable-text--active': isEditMode && !isEditing },
      { 'editable-text--editing': isEditing },
      { 'editable-text--selected': isSelected },
    ]"
    :contenteditable="isEditing"
    @click="handleClick"
    @blur="handleBlur"
    @input="handleInput"
    @keydown.enter.prevent="handleEnter"
    @keydown.escape="handleEscape"
    v-html="displayValue"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';

const props = withDefaults(defineProps<{
  elementId: string;
  defaultValue?: string;
  tag?: string;
  multiline?: boolean;
}>(), {
  defaultValue: '',
  tag: 'span',
  multiline: false,
});

const emit = defineEmits<{
  (e: 'update', value: string): void;
}>();

const { isEditMode, getElementValue, updateElement, selectedElement, selectElement } = usePageEditor();

const elementRef = ref<HTMLElement | null>(null);
const isEditing = ref(false);
const localValue = ref('');

const displayValue = computed(() => {
  if (isEditing.value) {
    return localValue.value;
  }
  return getElementValue(props.elementId, props.defaultValue);
});

const isSelected = computed(() => selectedElement.value === props.elementId);

const handleClick = (e: MouseEvent) => {
  if (!isEditMode.value) return;

  e.stopPropagation();
  selectElement(props.elementId);

  // Start editing on double-click or if already selected
  if (e.detail === 2 || isSelected.value) {
    startEditing();
  }
};

const startEditing = () => {
  isEditing.value = true;
  localValue.value = getElementValue(props.elementId, props.defaultValue);

  nextTick(() => {
    if (elementRef.value) {
      elementRef.value.focus();

      // Select all text
      const range = document.createRange();
      range.selectNodeContents(elementRef.value);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  });
};

const handleBlur = () => {
  if (isEditing.value) {
    finishEditing();
  }
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLElement;
  localValue.value = target.innerText;
};

const handleEnter = () => {
  if (!props.multiline) {
    finishEditing();
  }
};

const handleEscape = () => {
  isEditing.value = false;
  localValue.value = '';
  selectElement(null);
};

const finishEditing = () => {
  if (localValue.value !== getElementValue(props.elementId, props.defaultValue)) {
    updateElement(props.elementId, localValue.value);
    emit('update', localValue.value);
  }
  isEditing.value = false;
};

// Stop editing when edit mode is disabled
watch(isEditMode, (value) => {
  if (!value && isEditing.value) {
    finishEditing();
  }
});
</script>

<style scoped lang="scss">
.editable-text {
  transition: all 0.2s ease;
  position: relative;

  &--active {
    cursor: pointer;
    outline: 2px dashed transparent;
    outline-offset: 4px;

    &:hover {
      outline-color: rgba(59, 130, 246, 0.5);
      background: rgba(59, 130, 246, 0.05);
    }
  }

  &--selected {
    outline: 2px solid #3b82f6 !important;
    outline-offset: 4px;
    background: rgba(59, 130, 246, 0.1);
  }

  &--editing {
    outline: 2px solid #10b981 !important;
    outline-offset: 4px;
    background: rgba(16, 185, 129, 0.1);
    cursor: text;

    &:focus {
      outline: 2px solid #10b981 !important;
    }
  }
}
</style>
