<template>
  <component
    :is="tag"
    class="base-card"
    :class="[
      `base-card--${variant}`,
      {
        'base-card--hoverable': hoverable,
        'base-card--clickable': clickable,
        'base-card--bordered': bordered,
        'base-card--shadow': shadow,
      },
    ]"
    @click="handleClick"
  >
    <div v-if="$slots.image || image" class="base-card__image">
      <slot name="image">
        <img v-if="image" :src="image" :alt="imageAlt" />
      </slot>
    </div>

    <div v-if="$slots.badge" class="base-card__badge">
      <slot name="badge" />
    </div>

    <div class="base-card__content">
      <div v-if="$slots.header || title" class="base-card__header">
        <slot name="header">
          <h3 v-if="title" class="base-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="base-card__subtitle">{{ subtitle }}</p>
        </slot>
      </div>

      <div v-if="$slots.default" class="base-card__body">
        <slot />
      </div>

      <div v-if="$slots.footer" class="base-card__footer">
        <slot name="footer" />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
interface Props {
  tag?: string;
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  hoverable?: boolean;
  clickable?: boolean;
  bordered?: boolean;
  shadow?: boolean;
  to?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  variant: 'default',
  hoverable: false,
  clickable: false,
  bordered: true,
  shadow: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event);
  }
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-card {
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-base $transition-ease;
  position: relative;

  // Variants
  &--default {
    border: 1px solid $gray-200;
  }

  &--outlined {
    border: 2px solid $gray-300;
  }

  &--elevated {
    border: none;
    box-shadow: $shadow-md;
  }

  &--flat {
    border: none;
    background: transparent;
  }

  // States
  &--bordered {
    border: 1px solid $gray-200;
  }

  &--shadow {
    box-shadow: $shadow-sm;
  }

  &--hoverable {
    cursor: default;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-lg;
    }
  }

  &--clickable {
    cursor: pointer;

    &:hover {
      border-color: $primary;
      box-shadow: $shadow-md;
    }

    &:active {
      transform: translateY(0);
      box-shadow: $shadow-sm;
    }
  }

  // Image
  &__image {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: $gray-100;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  // Badge
  &__badge {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
    z-index: 1;
  }

  // Content
  &__content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: $spacing-lg;
    gap: $spacing-md;
  }

  // Header
  &__header {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0;
    line-height: 1.4;
  }

  &__subtitle {
    font-size: $font-size-sm;
    color: $gray-600;
    margin: 0;
    line-height: 1.5;
  }

  // Body
  &__body {
    flex: 1;
    font-size: $font-size-base;
    color: $gray-700;
    line-height: 1.6;
  }

  // Footer
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $spacing-md;
    padding-top: $spacing-md;
    border-top: 1px solid $gray-200;
    margin-top: auto;
  }

  // Responsive
  @media (max-width: $breakpoint-sm) {
    &__content {
      padding: $spacing-md;
    }

    &__title {
      font-size: $font-size-base;
    }

    &__subtitle {
      font-size: $font-size-xs;
    }
  }
}
</style>
