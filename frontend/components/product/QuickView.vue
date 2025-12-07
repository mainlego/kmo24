<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="quick-view-overlay" @click="handleOverlayClick">
        <div class="quick-view-modal" @click.stop>
          <!-- Close button -->
          <button class="close-btn" @click="close" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <div v-if="product" class="quick-view-content">
            <!-- Left: Image Gallery -->
            <div class="gallery-section">
              <div class="main-image">
                <img :src="selectedImage" :alt="product.name" />
              </div>
              <div v-if="product.images && product.images.length > 1" class="thumbnails">
                <button
                  v-for="(image, index) in product.images"
                  :key="index"
                  class="thumbnail"
                  :class="{ active: selectedImage === getProductImageUrl(image.url) }"
                  @click="selectedImage = getProductImageUrl(image.url)"
                >
                  <img :src="getProductImageUrl(image.url)" :alt="`${product.name} - ${index + 1}`" />
                </button>
              </div>
            </div>

            <!-- Right: Product Info -->
            <div class="info-section">
              <div class="product-header">
                <h2 class="product-title">{{ product.name }}</h2>
                <div v-if="product.category" class="product-category">
                  {{ product.category.name }}
                </div>
              </div>

              <!-- Price -->
              <div class="price-section">
                <div class="current-price">{{ formatPrice(product.price) }}</div>
                <div v-if="product.oldPrice" class="old-price">
                  {{ formatPrice(product.oldPrice) }}
                </div>
              </div>

              <!-- Stock status -->
              <div class="stock-status" :class="stockStatusClass">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                  <path v-if="product.stock > 0" d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ stockStatusText }}</span>
              </div>

              <!-- Short description -->
              <div v-if="product.description" class="description">
                <p>{{ shortDescription }}</p>
              </div>

              <!-- Features -->
              <div v-if="product.features && product.features.length > 0" class="features">
                <h3 class="features-title">Характеристики:</h3>
                <ul class="features-list">
                  <li v-for="(feature, index) in product.features.slice(0, 4)" :key="index">
                    <strong>{{ feature.name }}:</strong> {{ feature.value }}
                  </li>
                </ul>
              </div>

              <!-- Quantity selector -->
              <div class="quantity-section">
                <label class="quantity-label">Количество:</label>
                <div class="quantity-control">
                  <button
                    class="quantity-btn"
                    @click="decreaseQuantity"
                    :disabled="quantity <= 1"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                  <input
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    :max="product.stock"
                    class="quantity-input"
                  />
                  <button
                    class="quantity-btn"
                    @click="increaseQuantity"
                    :disabled="quantity >= product.stock"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="action-buttons">
                <button
                  class="add-to-cart-btn"
                  @click="handleAddToCart"
                  :disabled="product.stock === 0"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 2L7.17 4M15 2L16.83 4M9 11V15M12 11V15M15 11V15M3 6H21M19 6L18.1 19.1C18.0448 19.6116 17.8014 20.0843 17.4186 20.4279C17.0357 20.7715 16.5398 20.9623 16.027 21H7.973C7.46024 20.9623 6.96428 20.7715 6.58145 20.4279C6.19862 20.0843 5.95519 19.6116 5.9 19.1L5 6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ product.stock > 0 ? 'Добавить в корзину' : 'Нет в наличии' }}
                </button>

                <NuxtLink
                  :to="`/products/${product.slug}`"
                  class="view-details-btn"
                  @click="close"
                >
                  Подробнее о товаре
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useToast } from '~/composables/useToast';

const { getProductImageUrl } = useMediaUrl();

interface Product {
  _id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  stock: number;
  description?: {
    short?: string;
    full?: string;
  };
  category?: {
    name: string;
  };
  images?: Array<{ url: string; alt?: string }>;
  features?: Array<{ name: string; value: string }>;
}

interface Props {
  isOpen: boolean;
  product: Product | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['close']);

const cartStore = useCartStore();
const { showToast } = useToast();

const quantity = ref(1);
const selectedImage = ref('');

// Initialize selected image when product changes
watch(() => props.product, (newProduct) => {
  if (newProduct && newProduct.images && newProduct.images.length > 0) {
    selectedImage.value = getProductImageUrl(newProduct.images[0].url);
  }
  quantity.value = 1;
}, { immediate: true });

// Close on Escape key
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleEscape);
    document.body.style.overflow = '';
  }
});

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close();
  }
};

const close = () => {
  emit('close');
};

const handleOverlayClick = () => {
  close();
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(price);
};

const shortDescription = computed(() => {
  if (!props.product?.description) return '';

  // description is an object with short and full properties
  const desc = props.product.description.short || props.product.description.full || '';
  const maxLength = 200;

  if (desc.length <= maxLength) {
    return desc;
  }
  return desc.substring(0, maxLength) + '...';
});

const stockStatusClass = computed(() => {
  if (!props.product) return '';
  if (props.product.stock > 10) return 'in-stock';
  if (props.product.stock > 0) return 'low-stock';
  return 'out-of-stock';
});

const stockStatusText = computed(() => {
  if (!props.product) return '';
  if (props.product.stock > 10) return 'В наличии';
  if (props.product.stock > 0) return `Осталось ${props.product.stock} шт.`;
  return 'Нет в наличии';
});

const increaseQuantity = () => {
  if (props.product && quantity.value < props.product.stock) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = async () => {
  if (!props.product) return;

  try {
    await cartStore.addItem(props.product._id, quantity.value);

    showToast({
      message: `${props.product.name} добавлен в корзину`,
      type: 'success'
    });

    close();
  } catch (error) {
    showToast({
      message: 'Ошибка при добавлении в корзину',
      type: 'error'
    });
    console.error('Error adding to cart:', error);
  }
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.quick-view-overlay {
  position: fixed;
  inset: 0;
  background: rgba($gray-900, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: $spacing-lg;
  overflow-y: auto;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-md;
    align-items: flex-start;
  }
}

.quick-view-modal {
  background: $white;
  border-radius: $radius-2xl;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: $shadow-2xl;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: $breakpoint-md) {
    max-height: calc(100vh - 2rem);
    border-radius: $radius-xl;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: $spacing-lg;
  right: $spacing-lg;
  width: 40px;
  height: 40px;
  border-radius: $radius-full;
  background: $white;
  border: 1px solid $gray-200;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  color: $gray-600;

  @media (max-width: $breakpoint-md) {
    top: $spacing-md;
    right: $spacing-md;
    width: 36px;
    height: 36px;
  }

  &:hover {
    background: $error;
    border-color: $error;
    color: $white;
    transform: rotate(90deg);
  }
}

.quick-view-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-2xl;
  padding: $spacing-2xl;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
    gap: $spacing-xl;
    padding: $spacing-xl;
  }

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-lg;
  }
}

.gallery-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: $radius-xl;
  overflow: hidden;
  background: $gray-100;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.thumbnails {
  display: flex;
  gap: $spacing-sm;
  overflow-x: auto;
  padding: $spacing-xs 0;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: $gray-300;
    border-radius: $radius-full;
  }
}

.thumbnail {
  flex: 0 0 80px;
  height: 80px;
  border-radius: $radius-lg;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  background: $gray-100;

  @media (max-width: $breakpoint-sm) {
    flex: 0 0 60px;
    height: 60px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &.active {
    border-color: $primary;
    box-shadow: $shadow-colored;
  }

  &:hover:not(.active) {
    border-color: $gray-300;
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.product-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin: 0;
  line-height: 1.2;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-xl;
  }
}

.product-category {
  display: inline-flex;
  align-self: flex-start;
  padding: $spacing-xs $spacing-md;
  background: $gradient-primary;
  color: $white;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
}

.price-section {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.current-price {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: $primary;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-2xl;
  }
}

.old-price {
  font-size: $font-size-lg;
  color: $gray-500;
  text-decoration: line-through;
}

.stock-status {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-lg;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  align-self: flex-start;

  &.in-stock {
    background: rgba($primary, 0.1);
    color: $primary;
  }

  &.low-stock {
    background: rgba($warning, 0.1);
    color: $warning;
  }

  &.out-of-stock {
    background: rgba($error, 0.1);
    color: $error;
  }
}

.description {
  p {
    margin: 0;
    color: $gray-700;
    line-height: 1.6;
    font-size: $font-size-base;
  }
}

.features {
  padding: $spacing-md;
  background: $gray-50;
  border-radius: $radius-lg;
}

.features-title {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin: 0 0 $spacing-sm;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  li {
    font-size: $font-size-sm;
    color: $gray-700;

    strong {
      color: $gray-900;
      font-weight: $font-weight-medium;
    }
  }
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.quantity-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-700;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  align-self: flex-start;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border-radius: $radius-lg;
  border: 1px solid $gray-300;
  background: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: $gray-700;

  &:hover:not(:disabled) {
    background: $gradient-primary;
    border-color: transparent;
    color: $white;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.quantity-input {
  width: 80px;
  height: 40px;
  border: 1px solid $gray-300;
  border-radius: $radius-lg;
  text-align: center;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-900;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-top: $spacing-md;
}

.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  background: $gradient-primary;
  color: $white;
  border: none;
  border-radius: $radius-lg;
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: $shadow-colored;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: $shadow-2xl, $shadow-colored;
  }

  &:disabled {
    background: $gray-300;
    color: $gray-600;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
}

.view-details-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-lg;
  background: transparent;
  color: $primary;
  border: 1px solid $primary;
  border-radius: $radius-lg;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: $primary;
    color: $white;
    transform: translateX(4px);
  }
}

// Modal transitions
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
