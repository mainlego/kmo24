<template>
  <Teleport to="body">
    <Transition name="notification">
      <div
        v-if="currentNotification"
        class="social-proof-notification"
        :class="`social-proof-notification--${currentNotification.type}`"
        @click="handleClick"
      >
        <div class="notification-icon">
          <svg v-if="currentNotification.type === 'purchase'" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 2L7.17 4M15 2L16.83 4M9 11V15M12 11V15M15 11V15M3 6H21M19 6L18.1 19.1C18.0448 19.6116 17.8014 20.0843 17.4186 20.4279C17.0357 20.7715 16.5398 20.9623 16.027 21H7.973C7.46024 20.9623 6.96428 20.7715 6.58145 20.4279C5.19862 20.0843 5.95519 19.6116 5.9 19.1L5 6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="currentNotification.type === 'viewing'" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else-if="currentNotification.type === 'review'" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="notification-content">
          <p class="notification-message">{{ currentNotification.message }}</p>
          <p v-if="currentNotification.submessage" class="notification-submessage">
            {{ currentNotification.submessage }}
          </p>
        </div>

        <button class="notification-close" @click.stop="closeNotification" aria-label="Закрыть">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface SocialProofNotification {
  id: number;
  type: 'purchase' | 'viewing' | 'review' | 'stock';
  message: string;
  submessage?: string;
  productSlug?: string;
}

interface Props {
  enabled?: boolean;
  interval?: number; // Time between notifications in ms
  duration?: number; // Time notification is shown in ms
}

const props = withDefaults(defineProps<Props>(), {
  enabled: true,
  interval: 15000, // 15 seconds
  duration: 5000,  // 5 seconds
});

const currentNotification = ref<SocialProofNotification | null>(null);
let notificationTimer: NodeJS.Timeout | null = null;
let intervalTimer: NodeJS.Timeout | null = null;

// Sample notifications - in real app, these would come from API
const notifications: SocialProofNotification[] = [
  {
    id: 1,
    type: 'purchase',
    message: 'Кто-то только что купил',
    submessage: '2 часа назад в Москве',
    productSlug: 'industrial-oven'
  },
  {
    id: 2,
    type: 'viewing',
    message: '5 человек сейчас смотрят этот товар',
    submessage: 'Успейте заказать!',
  },
  {
    id: 3,
    type: 'purchase',
    message: 'Новый заказ оформлен',
    submessage: '30 минут назад в Санкт-Петербурге',
  },
  {
    id: 4,
    type: 'review',
    message: 'Новый отзыв на товар',
    submessage: 'Оценка: 5 звезд',
  },
  {
    id: 5,
    type: 'stock',
    message: 'Товар скоро закончится',
    submessage: 'Осталось всего 3 шт.',
  },
  {
    id: 6,
    type: 'purchase',
    message: 'Популярный товар!',
    submessage: '12 продаж за последнюю неделю',
  },
  {
    id: 7,
    type: 'viewing',
    message: '3 человека добавили в корзину',
    submessage: 'За последний час',
  },
  {
    id: 8,
    type: 'purchase',
    message: 'Оформлен заказ',
    submessage: '1 час назад в Казани',
  },
];

let usedNotifications = new Set<number>();

const getRandomNotification = (): SocialProofNotification => {
  // Reset if all notifications have been used
  if (usedNotifications.size >= notifications.length) {
    usedNotifications.clear();
  }

  // Get available notifications
  const available = notifications.filter(n => !usedNotifications.has(n.id));

  // Pick random one
  const notification = available[Math.floor(Math.random() * available.length)];
  usedNotifications.add(notification.id);

  return notification;
};

const showNotification = () => {
  if (!props.enabled) return;

  const notification = getRandomNotification();
  currentNotification.value = notification;

  // Auto-hide after duration
  if (notificationTimer) clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => {
    closeNotification();
  }, props.duration);
};

const closeNotification = () => {
  currentNotification.value = null;
  if (notificationTimer) {
    clearTimeout(notificationTimer);
    notificationTimer = null;
  }
};

const handleClick = () => {
  // If notification has productSlug, navigate to product
  if (currentNotification.value?.productSlug) {
    navigateTo(`/products/${currentNotification.value.productSlug}`);
    closeNotification();
  }
};

onMounted(() => {
  if (!props.enabled) return;

  // Show first notification after 5 seconds
  setTimeout(() => {
    showNotification();
  }, 5000);

  // Then show at intervals
  intervalTimer = setInterval(() => {
    showNotification();
  }, props.interval);
});

onUnmounted(() => {
  if (notificationTimer) clearTimeout(notificationTimer);
  if (intervalTimer) clearInterval(intervalTimer);
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.social-proof-notification {
  position: fixed;
  bottom: $spacing-xl;
  left: $spacing-xl;
  max-width: 360px;
  min-width: 300px;
  padding: $spacing-md $spacing-lg;
  background: $white;
  border-radius: $radius-xl;
  box-shadow: $shadow-2xl;
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 9998;
  border-left: 4px solid $primary;

  @media (max-width: $breakpoint-md) {
    bottom: $spacing-lg;
    left: $spacing-md;
    right: $spacing-md;
    max-width: none;
    min-width: auto;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-2xl, $shadow-colored;
  }

  &--purchase {
    border-left-color: $success;

    .notification-icon {
      background: rgba($success, 0.1);
      color: $success;
    }
  }

  &--viewing {
    border-left-color: $info;

    .notification-icon {
      background: rgba($info, 0.1);
      color: $info;
    }
  }

  &--review {
    border-left-color: $warning;

    .notification-icon {
      background: rgba($warning, 0.1);
      color: $warning;
    }
  }

  &--stock {
    border-left-color: $error;

    .notification-icon {
      background: rgba($error, 0.1);
      color: $error;
    }
  }
}

.notification-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: $radius-lg;
  background: rgba($primary, 0.1);
  color: $primary;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  .social-proof-notification:hover & {
    transform: scale(1.1);
  }
}

.notification-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.notification-message {
  margin: 0;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  line-height: 1.4;
}

.notification-submessage {
  margin: 0;
  font-size: $font-size-sm;
  color: $gray-600;
  line-height: 1.4;
}

.notification-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: $gray-400;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-sm;

  &:hover {
    background: $gray-100;
    color: $gray-700;
  }
}

// Notification transitions
.notification-enter-active {
  animation: slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-leave-active {
  animation: slideOutLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutLeft {
  from {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100%) translateY(0);
  }
}
</style>
