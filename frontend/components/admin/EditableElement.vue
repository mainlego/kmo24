<template>
  <component
    :is="tag"
    :class="[
      'editable-element',
      {
        'editable-element--active': isEditMode,
        'editable-element--selected': isSelected,
        'editable-element--hover': isHovering && isEditMode,
      }
    ]"
    @click="handleClick"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- Edit indicator -->
    <span v-if="isEditMode" class="editable-element__indicator">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </span>
    <!-- Content -->
    <slot>{{ displayValue }}</slot>
  </component>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  elementId: string;
  tag?: string;
  defaultValue?: string;
  type?: 'text' | 'html' | 'image' | 'icon' | 'link' | 'background';
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  defaultValue: '',
  type: 'text',
  label: '',
});

const pageEditor = usePageEditor();
const {
  isEditMode,
  selectedElement,
  selectElement,
  getElementValue,
  registerElement,
  unregisterElement,
} = pageEditor;

const isHovering = ref(false);

const isSelected = computed(() => selectedElement.value === props.elementId);

const displayValue = computed(() => {
  return getElementValue(props.elementId, props.defaultValue);
});

// Register element when mounted
onMounted(() => {
  registerElement({
    id: props.elementId,
    type: props.type,
    defaultValue: props.defaultValue,
    label: props.label || props.elementId,
  });
});

// Unregister when unmounted
onUnmounted(() => {
  unregisterElement(props.elementId);
});

const handleClick = (e: MouseEvent) => {
  if (!isEditMode.value) return;

  e.preventDefault();
  e.stopPropagation();

  selectElement(props.elementId);
};

// Expose value for parent components if needed
defineExpose({
  value: displayValue,
});
</script>

<style lang="scss">
.editable-element {
  position: relative;
  transition: all 0.2s ease;

  &__indicator {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.2s ease;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
    pointer-events: none;
  }

  &--active {
    cursor: pointer !important;

    &:hover {
      outline: 2px dashed #f59e0b;
      outline-offset: 4px;
      background: rgba(245, 158, 11, 0.05);
      border-radius: 4px;

      .editable-element__indicator {
        opacity: 1;
        transform: scale(1);
      }
    }
  }

  &--selected {
    outline: 3px solid #f59e0b !important;
    outline-offset: 4px;
    background: rgba(245, 158, 11, 0.1);
    border-radius: 4px;

    .editable-element__indicator {
      opacity: 1;
      transform: scale(1);
      background: #10b981;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
    }
  }

  &--hover {
    // Additional hover effects if needed
  }
}

// Global edit mode body class for additional styling
body.edit-mode-active {
  // Disable pointer events on links during edit mode to prevent navigation
  a:not(.editable-element) {
    // pointer-events: auto; // Keep links working but editable elements take priority
  }
}
</style>
