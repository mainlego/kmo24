<template>
  <div class="cart-page">
    <div class="container">
      <h1>Корзина</h1>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        Загрузка...
      </div>

      <!-- Empty Cart -->
      <div v-else-if="!cart || cart.items.length === 0" class="empty-cart">
        <h2>Корзина пуста</h2>
        <p>Добавьте товары в корзину, чтобы оформить заказ</p>
        <button class="btn-primary" @click="navigateTo('/products')">
          Перейти в каталог
        </button>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <div
            v-for="item in cart.items"
            :key="item._id"
            class="cart-item"
          >
            <img
              v-if="getProductImage(item.product)"
              :src="getProductImage(item.product)"
              :alt="getProductName(item.product)"
              class="item-image"
            />
            <div v-else class="item-image-placeholder">Нет фото</div>

            <div class="item-details">
              <h3>{{ getProductName(item.product) }}</h3>
              <p class="item-price">{{ formatPrice(item.price) }}</p>
              <p v-if="item.variant" class="item-variant">
                {{ item.variant.name }}: {{ item.variant.value }}
              </p>
            </div>

            <div class="item-quantity">
              <button
                class="quantity-btn"
                @click="updateQuantity(item._id!, item.quantity - 1)"
                :disabled="item.quantity <= 1"
              >
                -
              </button>
              <input
                type="number"
                :value="item.quantity"
                @change="updateQuantity(item._id!, parseInt(($event.target as HTMLInputElement).value))"
                min="1"
                class="quantity-input"
              />
              <button
                class="quantity-btn"
                @click="updateQuantity(item._id!, item.quantity + 1)"
              >
                +
              </button>
            </div>

            <div class="item-total">
              <p class="total-label">Итого:</p>
              <p class="total-price">{{ formatPrice(item.price * item.quantity) }}</p>
            </div>

            <button
              class="remove-btn"
              @click="removeItem(item._id!)"
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        </div>

        <div class="cart-sidebar">
          <!-- Promo Code -->
          <div class="promo-section">
            <h3>Промокод</h3>
            <div v-if="cart.promoCode" class="promo-applied">
              <span>{{ cart.promoCode.code }}</span>
              <span class="promo-discount">-{{ formatPrice(cart.promoCode.discount) }}</span>
              <button class="remove-promo" @click="removePromo">✕</button>
            </div>
            <div v-else class="promo-input">
              <input
                v-model="promoCode"
                type="text"
                placeholder="Введите промокод"
              />
              <button class="btn-secondary" @click="applyPromo">
                Применить
              </button>
            </div>
          </div>

          <!-- Totals -->
          <div class="totals-section">
            <h3>Итого</h3>
            <div class="total-row">
              <span>Подытог:</span>
              <span>{{ formatPrice(cart.totals.subtotal) }}</span>
            </div>
            <div v-if="cart.totals.discount > 0" class="total-row discount">
              <span>Скидка:</span>
              <span>-{{ formatPrice(cart.totals.discount) }}</span>
            </div>
            <div class="total-row">
              <span>Доставка:</span>
              <span>{{ cart.totals.shipping > 0 ? formatPrice(cart.totals.shipping) : 'Рассчитается при оформлении' }}</span>
            </div>
            <div class="total-row final">
              <span>Всего:</span>
              <span>{{ formatPrice(cart.totals.total) }}</span>
            </div>

            <button class="btn-primary btn-checkout" @click="navigateTo('/checkout')">
              Оформить заказ
            </button>

            <button class="btn-link" @click="handleClearCart">
              Очистить корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cart } from '~/composables/useCart';

const { getCart, updateCartItem, removeFromCart, clearCart, applyPromoCode, removePromoCode } = useCart();
const { success, error } = useToast();

// State
const loading = ref(false);
const cart = ref<Cart | null>(null);
const promoCode = ref('');

// Methods
const loadCart = async () => {
  loading.value = true;
  try {
    cart.value = await getCart();
  } catch (err: any) {
    error(err.message || 'Ошибка при загрузке корзины');
  } finally {
    loading.value = false;
  }
};

const updateQuantity = async (itemId: string, quantity: number) => {
  if (quantity < 1) return;

  try {
    cart.value = await updateCartItem(itemId, quantity);
  } catch (err: any) {
    error(err.message || 'Ошибка при обновлении корзины');
  }
};

const removeItem = async (itemId: string) => {
  if (!confirm('Удалить товар из корзины?')) return;

  try {
    cart.value = await removeFromCart(itemId);
  } catch (err: any) {
    error(err.message || 'Ошибка при удалении товара');
  }
};

const handleClearCart = async () => {
  if (!confirm('Вы уверены, что хотите очистить корзину?')) return;

  try {
    cart.value = await clearCart();
  } catch (err: any) {
    error(err.message || 'Ошибка при очистке корзины');
  }
};

const applyPromo = async () => {
  if (!promoCode.value.trim()) return;

  try {
    cart.value = await applyPromoCode(promoCode.value);
    promoCode.value = '';
  } catch (err: any) {
    error(err.message || 'Неверный промокод');
  }
};

const removePromo = async () => {
  try {
    cart.value = await removePromoCode();
  } catch (err: any) {
    error(err.message || 'Ошибка при удалении промокода');
  }
};

// Helpers
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};

const getProductName = (product: any): string => {
  return typeof product === 'object' ? product.name : 'Товар';
};

const getProductImage = (product: any): string | null => {
  if (typeof product === 'object' && product.images && product.images.length > 0) {
    return product.images[0].url;
  }
  return null;
};

// Initial load
onMounted(() => {
  loadCart();
});
</script>

<style scoped>
.cart-page {
  padding: 2rem 0;
  min-height: 70vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.loading,
.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-cart h2 {
  margin-bottom: 1rem;
}

.empty-cart p {
  color: #666;
  margin-bottom: 2rem;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  align-items: center;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }

  .item-quantity,
  .item-total {
    grid-column: 1 / -1;
  }
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.item-image-placeholder {
  width: 100px;
  height: 100px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #9ca3af;
  font-size: 0.875rem;
}

.item-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
}

.item-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.item-variant {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.25rem;
}

.quantity-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  height: 32px;
  text-align: center;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.item-total {
  text-align: right;
}

.total-label {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
}

.total-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;
  opacity: 0.6;
}

.remove-btn:hover {
  opacity: 1;
}

.cart-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.promo-section,
.totals-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.promo-section h3,
.totals-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
}

.promo-input {
  display: flex;
  gap: 0.5rem;
}

.promo-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.promo-applied {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #d1fae5;
  border-radius: 4px;
}

.promo-discount {
  margin-left: auto;
  font-weight: 600;
  color: #065f46;
}

.remove-promo {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  opacity: 0.6;
}

.remove-promo:hover {
  opacity: 1;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.total-row.discount {
  color: #10b981;
}

.total-row.final {
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: none;
  padding-top: 1rem;
}

.btn-primary,
.btn-secondary,
.btn-link {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  margin-top: 1rem;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-link {
  background: none;
  color: #6b7280;
  margin-top: 0.5rem;
}

.btn-link:hover {
  color: #374151;
}

.btn-checkout {
  font-size: 1.125rem;
}
</style>
