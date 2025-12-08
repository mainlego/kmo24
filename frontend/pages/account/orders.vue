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
                :src="getItemImage(item)"
                :alt="getItemName(item)"
                class="orders-page__order-item-image"
              />
              <div class="orders-page__order-item-info">
                <div class="orders-page__order-item-name">{{ getItemName(item) }}</div>
                <div class="orders-page__order-item-quantity">{{ item.quantity }} шт. × {{ formatPrice(item.price) }}</div>
              </div>
              <div class="orders-page__order-item-price">
                {{ formatPrice(item.total || item.price * item.quantity) }}
              </div>
            </div>
          </div>

          <div class="orders-page__order-footer">
            <div class="orders-page__order-total">
              Итого: <strong>{{ formatPrice(getOrderTotal(order)) }}</strong>
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

    <!-- Order Details Modal -->
    <Teleport to="body">
      <div v-if="showOrderModal && selectedOrder" class="modal-overlay" @click.self="closeOrderModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Заказ #{{ selectedOrder.orderNumber }}</h3>
            <button class="modal-close" @click="closeOrderModal">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="order-detail-section">
              <h4>Статус заказа</h4>
              <BaseBadge :variant="getStatusVariant(selectedOrder.status)" size="md">
                {{ getStatusText(selectedOrder.status) }}
              </BaseBadge>
            </div>

            <div class="order-detail-section">
              <h4>Дата оформления</h4>
              <p>{{ formatDate(selectedOrder.createdAt) }}</p>
            </div>

            <div class="order-detail-section">
              <h4>Товары</h4>
              <div class="order-items-list">
                <div v-for="item in selectedOrder.items" :key="item._id" class="order-item-detail">
                  <img :src="getItemImage(item)" :alt="getItemName(item)" class="item-image" />
                  <div class="item-info">
                    <div class="item-name">{{ getItemName(item) }}</div>
                    <div class="item-meta">{{ item.quantity }} шт. × {{ formatPrice(item.price) }}</div>
                  </div>
                  <div class="item-total">{{ formatPrice(item.total || item.price * item.quantity) }}</div>
                </div>
              </div>
            </div>

            <div class="order-detail-section order-summary">
              <div class="summary-row" v-if="selectedOrder.pricing?.subtotal">
                <span>Подытог:</span>
                <span>{{ formatPrice(selectedOrder.pricing.subtotal) }}</span>
              </div>
              <div class="summary-row" v-if="selectedOrder.pricing?.shipping">
                <span>Доставка:</span>
                <span>{{ formatPrice(selectedOrder.pricing.shipping) }}</span>
              </div>
              <div class="summary-row" v-if="selectedOrder.pricing?.discount">
                <span>Скидка:</span>
                <span>-{{ formatPrice(selectedOrder.pricing.discount) }}</span>
              </div>
              <div class="summary-row summary-total">
                <span>Итого:</span>
                <span>{{ formatPrice(getOrderTotal(selectedOrder)) }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <BaseButton variant="secondary" @click="closeOrderModal">Закрыть</BaseButton>
            <BaseButton
              v-if="selectedOrder.status === 'pending'"
              variant="danger"
              @click="cancelOrder(selectedOrder._id); closeOrderModal()"
            >
              Отменить заказ
            </BaseButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Защита страницы авторизацией
definePageMeta({
  middleware: 'auth'
});

interface OrderItem {
  _id?: string;
  product?: {
    _id?: string;
    name?: string;
    images?: { url: string }[];
  };
  name?: string;
  image?: string;
  quantity: number;
  price: number;
  total?: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  total?: number;
  pricing?: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
  createdAt: string;
}

const orders = ref<Order[]>([]);
const isLoading = ref(true);
const { apiFetch } = useApi();

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

// Вспомогательные функции для получения данных товара
const getItemName = (item: OrderItem): string => {
  return item.name || item.product?.name || 'Товар';
};

const getItemImage = (item: OrderItem): string => {
  // Сначала проверяем прямое поле image
  if (item.image) return item.image;
  // Затем проверяем через product
  if (item.product?.images?.[0]?.url) return item.product.images[0].url;
  // Заглушка
  return '/images/placeholder-product.png';
};

const getOrderTotal = (order: Order): number => {
  // Приоритет: pricing.total > total > сумма items
  if (order.pricing?.total) return order.pricing.total;
  if (order.total) return order.total;
  // Fallback: сумма всех товаров
  return order.items.reduce((sum, item) => sum + (item.total || item.price * item.quantity), 0);
};

// Показываем детали заказа в модальном окне
const selectedOrder = ref<Order | null>(null);
const showOrderModal = ref(false);

const viewOrder = (orderId: string) => {
  const order = orders.value.find(o => o._id === orderId);
  if (order) {
    selectedOrder.value = order;
    showOrderModal.value = true;
  }
};

const closeOrderModal = () => {
  showOrderModal.value = false;
  selectedOrder.value = null;
};

const cancelOrder = async (orderId: string) => {
  if (!confirm('Вы уверены, что хотите отменить заказ?')) return;

  try {
    const response = await apiFetch<{ success: boolean; data: Order }>(`/orders/${orderId}/cancel`, {
      method: 'PATCH',
    });

    if (response.success) {
      // Update order status in local state
      const orderIndex = orders.value.findIndex(o => o._id === orderId);
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = 'cancelled';
      }
    }
  } catch (error: any) {
    console.error('Error canceling order:', error);
    alert(error.message || 'Не удалось отменить заказ');
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;

    // Fetch orders from API
    const response = await apiFetch<{ success: boolean; data: Order[] }>('/orders/my');

    if (response.success && response.data) {
      orders.value = response.data;
    }
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

// Container is defined globally in main.scss

// Modal styles
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
}

.modal-content {
  background: $white;
  border-radius: $radius-xl;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: $shadow-2xl;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1px solid $gray-200;

  h3 {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $gray-900;
  }
}

.modal-close {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: $gray-500;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all 0.2s;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    background: $gray-100;
    color: $gray-900;
  }
}

.modal-body {
  padding: $spacing-lg;
}

.order-detail-section {
  margin-bottom: $spacing-lg;

  h4 {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $gray-500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 $spacing-sm 0;
  }

  p {
    margin: 0;
    color: $gray-900;
  }
}

.order-items-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.order-item-detail {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm;
  background: $gray-50;
  border-radius: $radius-lg;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: $radius-md;
  object-fit: cover;
  background: $white;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: $font-weight-medium;
  color: $gray-900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  font-size: $font-size-sm;
  color: $gray-500;
}

.item-total {
  font-weight: $font-weight-semibold;
  color: $gray-900;
}

.order-summary {
  background: $gray-50;
  padding: $spacing-md;
  border-radius: $radius-lg;
  margin-top: $spacing-lg;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: $spacing-xs 0;
  font-size: $font-size-sm;
  color: $gray-600;

  &.summary-total {
    border-top: 1px solid $gray-200;
    margin-top: $spacing-sm;
    padding-top: $spacing-sm;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $gray-900;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-md;
  padding: $spacing-lg;
  border-top: 1px solid $gray-200;
}
</style>
