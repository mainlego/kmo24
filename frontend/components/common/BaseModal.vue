<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="base-modal" @click.self="handleOverlayClick">
        <div class="base-modal__overlay" />

        <div
          class="base-modal__wrapper"
          :class="[
            `base-modal__wrapper--${size}`,
            { 'base-modal__wrapper--fullscreen': fullscreen },
          ]"
        >
          <div class="base-modal__container">
            <!-- Header -->
            <div v-if="$slots.header || title || closable" class="base-modal__header">
              <slot name="header">
                <h3 v-if="title" class="base-modal__title">{{ title }}</h3>
              </slot>

              <button
                v-if="closable"
                class="base-modal__close"
                type="button"
                @click="close"
                aria-label="Закрыть"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="base-modal__body">
              <slot />
            </div>

            <!-- Footer -->
            <div v-if="$slots.footer" class="base-modal__footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
  fullscreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnOverlay: true,
  closeOnEsc: true,
  fullscreen: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
  open: [];
}>();

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close();
  }
};

const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEsc && props.modelValue) {
    close();
  }
};

// Lock body scroll when modal is open
watch(
  () => props.modelValue,
  (isOpen) => {
    if (process.client) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        emit('open');
      } else {
        document.body.style.overflow = '';
      }
    }
  }
);

onMounted(() => {
  if (process.client) {
    document.addEventListener('keydown', handleEscKey);
  }
});

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('keydown', handleEscKey);
    document.body.style.overflow = '';
  }
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-lg;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba($gray-900, 0.75);
    backdrop-filter: blur(4px);
  }

  &__wrapper {
    position: relative;
    width: 100%;
    max-height: calc(100vh - #{$spacing-lg * 2});
    background: $white;
    border-radius: $radius-xl;
    box-shadow: $shadow-xl;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    // Sizes
    &--sm {
      max-width: 400px;
    }

    &--md {
      max-width: 600px;
    }

    &--lg {
      max-width: 800px;
    }

    &--xl {
      max-width: 1200px;
    }

    &--fullscreen {
      max-width: 100%;
      max-height: 100vh;
      height: 100%;
      border-radius: 0;
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-lg $spacing-xl;
    border-bottom: 1px solid $gray-200;
    flex-shrink: 0;
  }

  &__title {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    background: transparent;
    color: $gray-500;
    cursor: pointer;
    border-radius: $radius-md;
    transition: all $transition-base $transition-ease;
    flex-shrink: 0;

    &:hover {
      background: $gray-100;
      color: $gray-700;
    }

    &:active {
      background: $gray-200;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }

  &__body {
    flex: 1;
    padding: $spacing-xl;
    overflow-y: auto;

    // Custom scrollbar
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: $gray-100;
    }

    &::-webkit-scrollbar-thumb {
      background: $gray-300;
      border-radius: $radius-full;

      &:hover {
        background: $gray-400;
      }
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: $spacing-md;
    padding: $spacing-lg $spacing-xl;
    border-top: 1px solid $gray-200;
    flex-shrink: 0;
  }

  // Responsive
  @media (max-width: $breakpoint-sm) {
    padding: 0;

    &__wrapper {
      max-width: 100%;
      max-height: 100vh;
      border-radius: 0;

      &--sm,
      &--md,
      &--lg,
      &--xl {
        max-width: 100%;
      }
    }

    &__header,
    &__body,
    &__footer {
      padding-left: $spacing-lg;
      padding-right: $spacing-lg;
    }
  }
}

// Transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity $transition-slow $transition-ease;

  .base-modal__wrapper {
    transition: transform $transition-slow $transition-ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .base-modal__wrapper {
    transform: scale(0.95) translateY(-20px);
  }
}
</style>
