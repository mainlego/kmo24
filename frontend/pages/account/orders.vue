<template>
  <div class="orders-page">
    <div class="container">
      <div class="orders-page__header">
        <NuxtLink to="/account" class="orders-page__back">
          ← Назад в личный кабинет
        </NuxtLink>
        <h1>Мои заказы</h1>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="orders-page__loading">
        <BaseSpinner size="lg" text="Загрузка заказов..." />
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="orders-page__empty">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
          <path
            d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h2>У вас пока нет заказов</h2>
        <p>Начните покупки в нашем каталоге</p>
        <BaseButton variant="primary" @click="navigateTo('/products')">
          Перейти в каталог
        </BaseButton>
      </div>

      <!-- Orders List -->
      <div v-else class="orders-page__list">
        <div
          v-for="order in orders"
          :key="order._id"
          class="orders-page__order"
        >
          <div class="orders-page__order-header">
            <div class="orders-page__order-info">
              <div class="orders-page__order-number">
                Заказ #{{ order.orderNumber }}
              </div>
              <div class="orders-page__order-date">
                {{ formatDate(order.createdAt) }}
              </div>
            </div>
            <BaseBadge :variant="getStatusVariant(order.status)" size="md">
              {{ getStatusText(order.status) }}
            </BaseBadge>
          </div>

          <div class="orders-page__order-items">
            <div
              v-for="item in order.items"
              :key="item._id"
              class="orders-page__order-item"
            >
              <img
                :src="item.product.images?.[0]?.url || 'https://via.placeholder.com/60'"
                :alt="item.product.name"
                class="orders-page__order-item-image"
              />
              <div class="orders-page__order-item-info">
                <div class="orders-page__order-item-name">{{ item.product.name }}</div>
                <div class="orders-page__order-item-quantity">{{ item.quantity }} шт.</div>
              </div>
              <div class="orders-page__order-item-price">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>

          <div class="orders-page__order-footer">
            <div class="orders-page__order-total">
              Итого: <strong>{{ formatPrice(order.total) }}</strong>
            </div>
            <div class="orders-page__order-actions">
              <BaseButton
                variant="outline"
                size="sm"
                @click="viewOrder(order._id)"
              >
                Подробнее
              </BaseButton>
              <BaseButton
                v-if="order.status === 'pending'"
                variant="danger"
                size="sm"
                @click="cancelOrder(order._id)"
              >
                Отменить
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  items: any[];
  total: number;
  createdAt: string;
}

const orders = ref<Order[]>([]);
const isLoading = ref(true);

// Mock data
const mockOrders: Order[] = [
  {
    _id: '1',
    orderNumber: '123456',
    status: 'delivered',
    items: [
      {
        _id: '1',
        product: {
          name: 'Смартфон XYZ Premium',
          images: [{ url: 'https://via.placeholder.com/60/3b82f6/ffffff?text=Phone' }],
        },
        quantity: 1,
        price: 79990,
      },
    ],
    total: 80490,
    createdAt: '2025-10-20T10:00:00Z',
  },
  {
    _id: '2',
    orderNumber: '123457',
    status: 'processing',
    items: [
      {
        _id: '2',
        product: {
          name: 'Наушники Wireless Pro',
          images: [{ url: 'https://via.placeholder.com/60/8b5cf6/ffffff?text=Headphones' }],
        },
        quantity: 2,
        price: 15990,
      },
    ],
    total: 31980,
    createdAt: '2025-10-22T14:30:00Z',
  },
  {
    _id: '3',
    orderNumber: '123458',
    status: 'pending',
    items: [
      {
        _id: '3',
        product: {
          name: 'Умные часы SmartWatch X',
          images: [{ url: 'https://via.placeholder.com/60/ec4899/ffffff?text=Watch' }],
        },
        quantity: 1,
        price: 24990,
      },
    ],
    total: 24990,
    createdAt: '2025-10-24T09:15:00Z',
  },
];

const getStatusVariant = (status: string) => {
  const variants: Record<string, any> = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  };
  return variants[status] || 'neutral';
};

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: 'Ожидает обработки',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
  };
  return texts[status] || status;
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const viewOrder = (orderId: string) => {
  // TODO: Navigate to order detail page
  console.log('View order:', orderId);
};

const cancelOrder = async (orderId: string) => {
  if (!confirm('Вы уверены, что хотите отменить заказ?')) return;

  // TODO: API call to cancel order
  console.log('Cancel order:', orderId);
};

onMounted(async () => {
  try {
    isLoading.value = true;
    // TODO: Fetch orders from API
    await new Promise(resolve => setTimeout(resolve, 1000));
    orders.value = mockOrders;
  } catch (error) {
    console.error('Error loading orders:', error);
  } finally {
    isLoading.value = false;
  }
});

// SEO
useHead({
  title: 'Мои заказы - Онлайн Магазин',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.orders-page {
  min-height: calc(100vh - 200px);
  padding: $spacing-xl 0;
  background: $gray-50;

  &__header {
    margin-bottom: $spacing-xl;

    h1 {
      font-size: $font-size-3xl;
      font-weight: $font-weight-bold;
      color: $gray-900;
      margin: $spacing-md 0 0 0;
    }
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    color: $primary;
    text-decoration: none;
    font-size: $font-size-sm;
    transition: color $transition-base;

    &:hover {
      color: darken($primary, 10%);
    }
  }

  &__loading,
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: $spacing-lg;
    background: $white;
    border-radius: $radius-xl;
    padding: $spacing-2xl;

    svg {
      color: $gray-300;
    }

    h2 {
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0;
    }

    p {
      font-size: $font-size-base;
      color: $gray-600;
      margin: 0;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__order {
    display: flex;
    flex-direction: column;
    background: $white;
    border-radius: $radius-xl;
    overflow: hidden;
    box-shadow: $shadow-sm;
  }

  &__order-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-lg;
    border-bottom: 1px solid $gray-200;
  }

  &__order-info {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__order-number {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-900;
  }

  &__order-date {
    font-size: $font-size-sm;
    color: $gray-600;
  }

  &__order-items {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding: $spacing-lg;
  }

  &__order-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__order-item-image {
    width: 60px;
    height: 60px;
    border-radius: $radius-md;
    object-fit: cover;
    background: $gray-100;
  }

  &__order-item-info {
    flex: 1;
    min-width: 0;
  }

  &__order-item-name {
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    color: $gray-900;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__order-item-quantity {
    font-size: $font-size-sm;
    color: $gray-600;
  }

  &__order-item-price {
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $gray-900;
  }

  &__order-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-lg;
    border-top: 1px solid $gray-200;
    background: $gray-50;

    @media (max-width: $breakpoint-sm) {
      flex-direction: column;
      align-items: stretch;
      gap: $spacing-md;
    }
  }

  &__order-total {
    font-size: $font-size-lg;
    color: $gray-700;

    strong {
      color: $gray-900;
      font-weight: $font-weight-bold;
    }
  }

  &__order-actions {
    display: flex;
    gap: $spacing-sm;

    @media (max-width: $breakpoint-sm) {
      justify-content: stretch;

      button {
        flex: 1;
      }
    }
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
