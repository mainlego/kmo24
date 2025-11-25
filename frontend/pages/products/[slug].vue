<template>
  <div class="product-detail">
    <div class="container">
      <!-- Breadcrumbs -->
      <nav class="product-detail__breadcrumbs">
        <NuxtLink to="/">Главная</NuxtLink>
        <span>/</span>
        <NuxtLink to="/products">Каталог</NuxtLink>
        <span>/</span>
        <span>{{ product?.name || 'Товар' }}</span>
      </nav>

      <!-- Loading State -->
      <div v-if="isLoading" class="product-detail__loading">
        <BaseSpinner size="xl" text="Загрузка товара..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="product-detail__error">
        <h2>Товар не найден</h2>
        <p>{{ error }}</p>
        <BaseButton variant="primary" @click="navigateTo('/products')">
          Вернуться к каталогу
        </BaseButton>
      </div>

      <!-- Product Content with New Layout -->
      <div v-else-if="product" class="product-detail__wrapper">
        <!-- Left Side: Main Content -->
        <div class="product-detail__content">
          <!-- Main Section -->
          <div class="product-detail__main">
            <!-- Gallery with Interactive Features -->
            <div class="product-gallery">
              <div class="product-gallery__main-image" @click="toggleLightbox">
                <img
                  :src="currentImage.url"
                  :alt="currentImage.alt || product.name"
                  :class="{ 'zoomed': isImageZoomed }"
                  @mouseenter="isImageHovered = true"
                  @mouseleave="isImageHovered = false; isImageZoomed = false"
                  @mousemove="handleImageZoom"
                />
                <div v-if="hasDiscount" class="discount-badge animate-pulse">
                  <svg class="discount-badge__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  -{{ discountPercent }}%
                </div>
                <div class="zoom-hint" v-if="isImageHovered && !isLightboxOpen">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                    <path d="M11 8v6M8 11h6"/>
                  </svg>
                  Нажмите для увеличения
                </div>
              </div>
              <div v-if="product.images.length > 1" class="product-gallery__thumbnails">
                <button
                  v-for="(image, index) in product.images"
                  :key="index"
                  :class="['product-gallery__thumb', { 'active': currentImageIndex === index }]"
                  @click="selectImage(index)"
                >
                  <img :src="image.url" :alt="image.alt || `${product.name} - изображение ${index + 1}`" />
                  <div class="thumb-overlay"></div>
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="product-info">
              <div class="product-info__header">
                <h1 class="product-info__title">{{ product.name }}</h1>
                <p class="product-info__subtitle">{{ typeof product.description === 'object' ? product.description.short : product.description }}</p>

                <!-- Tags -->
                <div class="product-info__tags">
                  <span class="tag">Гарантия качества</span>
                  <span class="tag">Быстрая доставка</span>
                  <span class="tag" v-if="product.stock.quantity > 0">В наличии</span>
                </div>
              </div>

              <!-- Price -->
              <div class="product-price">
                <span class="product-price__current">
                  {{ formatPrice(product.price) }}
                </span>
                <span v-if="hasDiscount" class="product-price__old">
                  {{ formatPrice(product.oldPrice!) }}
                </span>
                <span v-if="hasDiscount" class="product-price__discount">
                  -{{ Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100) }}%
                </span>
              </div>

              <!-- Stock Status -->
              <div v-if="isInStock" class="product-info__tags">
                <span class="tag">В наличии: {{ product.stock.quantity }} шт.</span>
              </div>
              <div v-else class="product-info__tags">
                <span class="tag" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">Нет в наличии</span>
              </div>

              <!-- Short Description -->
              <p class="product-detail__short-description">
                {{ product.description?.short }}
              </p>

              <!-- Actions -->
              <div class="product-actions">
                <QuantitySelector
                  v-if="isInStock"
                  v-model="quantity"
                  :min="1"
                  :max="product.stock.quantity"
                  class="product-actions__quantity"
                />
                <button
                  class="product-actions__buy"
                  :class="{ 'product-actions__buy--full': !isInStock }"
                  :disabled="!isInStock"
                  @click="handleAddToCart"
                >
                  {{ isInStock ? 'Добавить в корзину' : 'Нет в наличии' }}
                </button>
              </div>

              <!-- Favorite Button -->
              <div class="product-info__tags" style="margin-top: 1rem;">
                <button
                  @click="toggleFavorite"
                  class="tag"
                  style="cursor: pointer; border: none; font-size: 14px;"
                >
                  <span v-if="isFavorite">❤️ В избранном</span>
                  <span v-else>🤍 В избранное</span>
                </button>
              </div>

              <!-- Features -->
              <div v-if="product.features?.length" class="product-detail__features">
                <h3>Особенности:</h3>
                <ul>
                  <li v-for="(feature, index) in product.features" :key="index">
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Tabs Section -->
          <div class="product-detail__tabs">
            <div class="product-detail__tabs-header">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                :class="['product-detail__tab', { 'product-detail__tab--active': activeTab === tab.id }]"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </button>
            </div>

            <div class="product-detail__tabs-content">
              <!-- Description Tab -->
              <div v-show="activeTab === 'description'" class="product-detail__tab-panel">
                <h2>Описание товара</h2>
                <div v-html="product.description?.full || product.description?.short"></div>
              </div>

              <!-- Specifications Tab -->
              <div v-show="activeTab === 'specifications'" class="product-detail__tab-panel">
                <h2>Характеристики</h2>
                <table v-if="product.specifications?.length" class="product-detail__specs-table">
                  <tbody>
                    <tr v-for="(spec, index) in product.specifications" :key="index">
                      <td class="product-detail__spec-name">{{ spec.name }}</td>
                      <td class="product-detail__spec-value">{{ spec.value }}</td>
                    </tr>
                  </tbody>
                </table>
                <p v-else>Характеристики не указаны</p>
              </div>
            </div>
          </div>

          <!-- Mobile Related Products -->
          <div v-if="relatedProducts?.length" class="product-detail__related-mobile">
            <h2>Похожие товары</h2>
            <div class="product-detail__related-grid">
              <ProductCard
                v-for="relatedProduct in relatedProducts"
                :key="relatedProduct._id"
                :product="relatedProduct"
              />
            </div>
          </div>
        </div>

        <!-- Right Side: Related Products Sidebar -->
        <aside class="product-detail__sidebar">
          <div class="sidebar-related">
            <div class="sidebar-related__header">
              <h3>Похожие товары</h3>
              <span class="sidebar-related__badge">{{ relatedProducts.length }}</span>
            </div>

            <div class="sidebar-related__list">
              <div
                v-for="item in relatedProducts"
                :key="item._id"
                class="sidebar-related__item"
                @click="navigateTo(`/products/${item.slug}`)"
              >
                <!-- Image -->
                <div class="sidebar-related__image">
                  <img :src="item.images[0]?.url" :alt="item.name" />
                  <div v-if="item.oldPrice" class="sidebar-related__discount">
                    -{{ Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) }}%
                  </div>
                </div>

                <!-- Content -->
                <div class="sidebar-related__content">
                  <h4 class="sidebar-related__title">{{ item.name }}</h4>
                  <div class="sidebar-related__price">
                    <span v-if="item.oldPrice" class="sidebar-related__old-price">
                      {{ formatPrice(item.oldPrice) }}
                    </span>
                    <span class="sidebar-related__current-price">
                      {{ formatPrice(item.price) }}
                    </span>
                  </div>
                </div>

                <!-- Quick Actions -->
                <div class="sidebar-related__actions">
                  <button
                    class="sidebar-related__quick-add"
                    @click.stop="quickAddToCart(item)"
                    :title="'Добавить ' + item.name + ' в корзину'"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
                      <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
                      <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- View All Button -->
            <NuxtLink
              to="/products"
              class="sidebar-related__view-all"
            >
              Смотреть все товары
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12H19M19 12L12 5M19 12L12 19"/>
              </svg>
            </NuxtLink>
          </div>

          <!-- Sticky Info Block -->
          <div class="sidebar-sticky">
            <div class="sidebar-sticky__content">
              <h4>Нужна консультация?</h4>
              <p>Наши специалисты помогут выбрать подходящее оборудование</p>
              <button class="sidebar-sticky__call">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                </svg>
                Позвонить
              </button>
            </div>
          </div>
        </aside>
      </div>

      <!-- Sticky Add to Cart -->
      <ProductStickyAddToCart
        v-if="product"
        :product="{
          _id: product._id,
          name: product.name,
          price: product.price,
          oldPrice: product.oldPrice,
          stock: product.stock.quantity,
          images: product.images
        }"
        :scroll-threshold="400"
      />

      <!-- Lightbox Modal -->
      <Transition name="lightbox">
        <div v-if="isLightboxOpen" class="lightbox" @click="closeLightbox">
          <button class="lightbox__close" @click="closeLightbox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <button v-if="product.images.length > 1" class="lightbox__prev" @click.stop="previousImage">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button v-if="product.images.length > 1" class="lightbox__next" @click.stop="nextImage">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          <div class="lightbox__content" @click.stop>
            <img :src="currentImage.url" :alt="currentImage.alt || product.name" />
            <div class="lightbox__counter">{{ currentImageIndex + 1 }} / {{ product.images.length }}</div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Product } from '~/types';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const productsStore = useProductsStore();

const slug = computed(() => route.params.slug as string);

const isLoading = ref(true);
const error = ref('');
const product = ref<Product | null>(null);
const relatedProducts = ref<Product[]>([]);
const quantity = ref(1);
const isAddingToCart = ref(false);
const isFavorite = ref(false);
const currentImageIndex = ref(0);
const activeTab = ref('description');
const isLightboxOpen = ref(false);
const isImageHovered = ref(false);
const isImageZoomed = ref(false);
const zoomX = ref(0);
const zoomY = ref(0);

const tabs = [
  { id: 'description', label: 'Описание' },
  { id: 'specifications', label: 'Характеристики' },
];

const currentImage = computed(() => {
  return product.value?.images[currentImageIndex.value] || product.value?.images[0];
});

const isInStock = computed(() => {
  return product.value && product.value.stock.quantity > 0 && product.value.isActive;
});

const hasDiscount = computed(() => {
  return product.value?.oldPrice && product.value.oldPrice > product.value.price;
});

const discountPercent = computed(() => {
  if (!hasDiscount.value || !product.value?.oldPrice) return 0;
  return Math.round(((product.value.oldPrice - product.value.price) / product.value.oldPrice) * 100);
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock.quantity) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = async () => {
  if (!product.value || !isInStock.value || isAddingToCart.value) return;

  isAddingToCart.value = true;
  try {
    await cartStore.addItem(product.value._id, quantity.value);
    console.log(`Added ${quantity.value} item(s) to cart`);
    // Reset quantity after adding
    quantity.value = 1;
  } catch (err) {
    console.error('Error adding to cart:', err);
  } finally {
    isAddingToCart.value = false;
  }
};

const quickAddToCart = async (item: Product) => {
  try {
    await cartStore.addItem(item._id, 1);
    console.log(`Quick added ${item.name} to cart`);
  } catch (err) {
    console.error('Error adding to cart:', err);
  }
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  console.log('Toggle favorite:', product.value?._id);
};

const selectImage = (index: number) => {
  currentImageIndex.value = index;
};

const toggleLightbox = () => {
  isLightboxOpen.value = !isLightboxOpen.value;
  if (isLightboxOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
  document.body.style.overflow = '';
};

const nextImage = () => {
  if (product.value && currentImageIndex.value < product.value.images.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0;
  }
};

const previousImage = () => {
  if (product.value && currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else if (product.value) {
    currentImageIndex.value = product.value.images.length - 1;
  }
};

const handleImageZoom = (event: MouseEvent) => {
  if (!isImageHovered.value) return;

  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  zoomX.value = x;
  zoomY.value = y;
  isImageZoomed.value = true;
};

onMounted(async () => {
  try {
    isLoading.value = true;

    // Fetch product from store/API
    const result = await productsStore.fetchProduct(slug.value);

    if (result.success && result.data) {
      product.value = result.data;
      relatedProducts.value = productsStore.relatedProducts.slice(0, 6);
    } else {
      error.value = 'Товар не найден';
    }
  } catch (err: any) {
    error.value = err.message || 'Не удалось загрузить товар';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;
@use 'assets/scss/product' as *;

// =====================================================
// PREMIUM INTERACTIVE GALLERY
// =====================================================

.product-gallery__main-image {
  position: relative;
  cursor: zoom-in;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba($primary-500, 0.05), transparent);
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }

  img {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);

    &.zoomed {
      transform: scale(1.5);
      transform-origin: v-bind('zoomX + "% " + zoomY + "%"');
    }
  }
}

.zoom-hint {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  color: $white;
  padding: 0.75rem 1.25rem;
  border-radius: $radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 2;
  animation: slideInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  svg {
    flex-shrink: 0;
  }
}

.discount-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  &__icon {
    animation: rotate 3s linear infinite;
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounceIn {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.product-gallery__thumb {
  position: relative;
  overflow: hidden;

  .thumb-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba($primary-500, 0.2), rgba($primary-light, 0.2));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover .thumb-overlay {
    opacity: 1;
  }

  &.active .thumb-overlay {
    opacity: 0.5;
  }

  &:hover {
    transform: scale(1.05) translateY(-2px);
  }
}

// =====================================================
// LIGHTBOX MODAL
// =====================================================

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  &__content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    animation: zoomIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: $radius-2xl;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
  }

  &__counter {
    position: absolute;
    bottom: -3rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: $white;
    padding: 0.5rem 1.25rem;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
  }

  &__close,
  &__prev,
  &__next {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: $white;
    width: 3rem;
    height: 3rem;
    border-radius: $radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 10;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  &__close {
    top: 2rem;
    right: 2rem;
  }

  &__prev {
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      transform: translateY(-50%) scale(1.1) translateX(-4px);
    }
  }

  &__next {
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      transform: translateY(-50%) scale(1.1) translateX(4px);
    }
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

// Mobile Related Products - Horizontal Carousel
.product-detail__related-mobile {
  margin-top: $spacing-3xl;
  margin-bottom: $spacing-2xl;

  @media (min-width: $breakpoint-lg) {
    display: none; // Hide on desktop (sidebar is shown)
  }

  h2 {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin-bottom: $spacing-lg;
    padding: 0 $spacing-md;
  }
}

.product-detail__related-grid {
  display: flex;
  gap: $spacing-md;
  overflow-x: auto;
  overflow-y: hidden;
  padding: $spacing-sm $spacing-md $spacing-lg;
  margin: 0 (-$spacing-md);
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: $primary-500 $gray-200;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: $gray-200;
    border-radius: $radius-full;
  }

  &::-webkit-scrollbar-thumb {
    background: $primary-500;
    border-radius: $radius-full;

    &:hover {
      background: darken($primary-500, 10%);
    }
  }

  // Each product card
  :deep(.product-card) {
    flex: 0 0 280px;
    scroll-snap-align: start;

    @media (max-width: $breakpoint-sm) {
      flex: 0 0 240px;
    }
  }
}

// Product Actions
.product-actions {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-top: $spacing-lg;

  &__quantity {
    flex-shrink: 0;
  }

  &__buy {
    flex: 1;
    padding: $spacing-md $spacing-xl;
    background: $primary-500;
    color: $white;
    border: none;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:hover:not(:disabled) {
      background: darken($primary-500, 5%);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba($primary-500, 0.3);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      background: $gray-300;
      color: $gray-500;
      cursor: not-allowed;
    }

    &--full {
      flex: 1 1 100%;
    }
  }
}
</style>
