<template>
  <div
    class="base-card"
    :class="{
      'base-card--hoverable': hoverable,
      'base-card--clickable': clickable,
      'base-card--shadow': shadow,
    }"
    @click="handleClick"
  >
    <div v-if="$slots.image" class="base-card__image">
      <slot name="image" />
    </div>

    <div v-if="$slots.badge" class="base-card__badge">
      <slot name="badge" />
    </div>

    <div class="base-card__body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hoverable?: boolean;
  clickable?: boolean;
  shadow?: boolean;
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
  clickable: false,
  shadow: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.base-card {
  background: $white;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-base $transition-ease;
  display: flex;
  flex-direction: column;
  position: relative;

  &--shadow {
    box-shadow: $shadow-sm;
  }

  &--hoverable:hover {
    box-shadow: $shadow-md;
  }

  &--clickable {
    cursor: pointer;
  }

  &__image {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  &__badge {
    position: absolute;
    top: $spacing-sm;
    left: $spacing-sm;
    z-index: 10;
  }

  &__body {
    padding: $spacing-md;
    flex: 1;
  }

  &__footer {
    padding: $spacing-md;
    padding-top: 0;
    display: flex;
    gap: $spacing-sm;
  }
}
</style>
