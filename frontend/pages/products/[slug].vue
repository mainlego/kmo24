<template>
  <div class="product-detail">
    <!-- New Breadcrumbs Component -->
    <Breadcrumbs />

    <div class="container">

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

      <!-- Product Content - Ultra Minimalist -->
      <div v-else-if="product" class="product-compact">
        <!-- Main Grid Layout -->
        <div class="product-compact__grid">
          <!-- Gallery Column -->
          <div class="product-compact__gallery">
            <div class="gallery-main" @click="toggleLightbox">
              <img :src="currentImage.url" :alt="product.name" />
              <div v-if="hasDiscount" class="gallery-badge">-{{ discountPercent }}%</div>
            </div>
            <div v-if="product.images.length > 1" class="gallery-thumbs">
              <button
                v-for="(image, index) in product.images.slice(0, 4)"
                :key="index"
                :class="['gallery-thumb', { 'active': currentImageIndex === index }]"
                @click="selectImage(index)"
              >
                <img :src="getProductImageUrl(image.url)" :alt="`${product.name} ${index + 1}`" />
              </button>
            </div>
          </div>

          <!-- Info Column -->
          <div class="product-compact__info">
            <h1 class="info-title">{{ product.name }}</h1>

            <!-- Price and Stock in one line -->
            <div class="info-price-row">
              <div class="price-block">
                <span class="price-current">{{ formatPrice(product.price) }}</span>
                <span v-if="hasNewPrice" class="price-new-ref">Новый: {{ formatPrice(product.oldPrice) }}</span>
                <span v-if="hasNewPrice && savingsPercent >= 20" class="savings-badge">Выгода {{ savingsPercent }}%</span>
              </div>
              <span v-if="isInStock" class="stock-badge">В наличии</span>
              <span v-else class="stock-badge stock-badge--out">Нет в наличии</span>
            </div>

            <!-- Quick Actions -->
            <div class="info-actions">
              <button
                class="btn-buy"
                :disabled="!isInStock"
                @click="handleAddToCart"
              >
                {{ isInStock ? 'В корзину' : 'Нет в наличии' }}
              </button>
              <button class="btn-fav" @click="toggleFavorite">
                {{ isFavorite ? '❤️' : '🤍' }}
              </button>
            </div>

            <!-- Compact Description -->
            <div class="info-desc">
              <p>{{ product.description?.short || 'Описание отсутствует' }}</p>
            </div>

            <!-- Features Grid -->
            <div v-if="product.features?.length" class="info-features">
              <span v-for="(feature, index) in product.features.slice(0, 3)" :key="index" class="feature-tag">
                {{ feature }}
              </span>
            </div>

            <!-- Delivery Calculator -->
            <ProductDeliveryCalculator
              :product="{
                _id: product._id,
                name: product.name,
                price: product.price,
                dimensions: product.dimensions
              }"
            />
          </div>

          <!-- Specs Column -->
          <div class="product-compact__specs">
            <h3>Характеристики</h3>
            <div v-if="product.specifications?.length" class="specs-list">
              <div v-for="(spec, index) in product.specifications.slice(0, 8)" :key="index" class="spec-item">
                <span class="spec-name">{{ spec.name }}</span>
                <span class="spec-value">{{ spec.value }}</span>
              </div>
            </div>
            <p v-else class="specs-empty">Характеристики не указаны</p>
          </div>
        </div>

        <!-- Bottom: Related Products Grid -->
        <div v-if="relatedProducts?.length" class="product-compact__related">
          <h3>Похожие товары</h3>
          <div class="related-carousel">
            <div
              v-for="item in relatedProducts.slice(0, 6)"
              :key="item._id"
              class="related-item"
              @click="navigateTo(`/products/${item.slug}`)"
            >
              <img
                :src="getProductImageUrl(item.images[0]?.url)"
                :alt="item.name"
              />
              <div class="related-content">
                <h4>{{ item.name }}</h4>
                <span class="related-price">{{ formatPrice(item.price) }}</span>
              </div>
            </div>
          </div>
        </div>
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

const { getProductImageUrl } = useMediaUrl();

// Define Product type locally since ~/types might not exist
interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: {
    short?: string;
    full?: string;
  };
  price: number;
  oldPrice?: number;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  category: string;
  subcategory?: string;
  brand?: string;
  stock: {
    quantity: number;
    reserved: number;
  };
  features?: string[];
  specifications?: Array<{
    name: string;
    value: string;
  }>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  isActive: boolean;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const route = useRoute();
const router = useRouter();
const { addToCart } = useCart();
const productsStore = useProductsStore();

const slug = computed(() => route.params.slug as string);

const isLoading = ref(true);
const error = ref('');
const product = ref<Product | null>(null);
const relatedProducts = ref<Product[]>([]);
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
  const img = product.value?.images[currentImageIndex.value] || product.value?.images[0];
  if (img) {
    return { ...img, url: getProductImageUrl(img.url) };
  }
  return img;
});

const isInStock = computed(() => {
  return product.value && product.value.stock.quantity > 0 && product.value.isActive;
});

// oldPrice теперь используется как "Цена нового"
const hasNewPrice = computed(() => {
  return product.value?.oldPrice && product.value.oldPrice > product.value.price;
});

// Процент экономии по сравнению с ценой нового
const savingsPercent = computed(() => {
  if (!hasNewPrice.value || !product.value?.oldPrice) return 0;
  return Math.round(((product.value.oldPrice - product.value.price) / product.value.oldPrice) * 100);
});

// Для обратной совместимости
const hasDiscount = hasNewPrice;
const discountPercent = savingsPercent;

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price);
};

const handleAddToCart = async () => {
  if (!product.value || !isInStock.value || isAddingToCart.value) return;

  isAddingToCart.value = true;
  try {
    await addToCart(product.value._id, 1);
  } catch {
    // Error adding to cart
  } finally {
    isAddingToCart.value = false;
  }
};

const quickAddToCart = async (item: Product) => {
  try {
    await addToCart(item._id, 1);
  } catch {
    // Error adding to cart
  }
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
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

// =====================================================
// ULTRA MINIMALIST PRODUCT DETAIL
// =====================================================

.product-detail {
  min-height: 100vh;
  padding-top: 60px; // Account for breadcrumbs
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 12px;
}

// Loading & Error States
.product-detail__loading,
.product-detail__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;
  text-align: center;

  h2 {
    font-size: 20px;
    font-weight: 600;
    color: $gray-900;
  }

  p {
    font-size: 14px;
    color: $gray-600;
  }
}

// =====================================================
// ULTRA COMPACT LAYOUT
// =====================================================

.product-compact {
  padding: 12px 0;

  &__grid {
    display: grid;
    grid-template-columns: 400px 1fr 280px;
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 1200px) {
      grid-template-columns: 350px 1fr;

      .product-compact__specs {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }

  // Gallery Section
  &__gallery {
    .gallery-main {
      position: relative;
      aspect-ratio: 1;
      background: $gray-50;
      border-radius: 8px;
      overflow: hidden;
      cursor: zoom-in;
      border: 1px solid $gray-200;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      &:hover img {
        transform: scale(1.05);
      }

      .gallery-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        background: #ff4747;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
      }
    }

    .gallery-thumbs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 8px;

      .gallery-thumb {
        aspect-ratio: 1;
        border-radius: 4px;
        overflow: hidden;
        border: 2px solid transparent;
        cursor: pointer;
        background: $gray-50;
        transition: all 0.2s ease;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:hover {
          border-color: $primary-300;
        }

        &.active {
          border-color: $primary-500;
        }
      }
    }
  }

  // Info Section
  &__info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow: visible; // Allow delivery calculator dropdown to overflow

    .info-title {
      font-size: 20px;
      font-weight: 600;
      color: $gray-900;
      line-height: 1.3;
      margin: 0;
    }

    .info-price-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;

      .price-block {
        display: flex;
        align-items: baseline;
        gap: 8px;

        .price-current {
          font-size: 24px;
          font-weight: 700;
          color: $primary-600;
        }

        .price-old {
          font-size: 16px;
          color: $gray-500;
          text-decoration: line-through;
        }

        .price-new-ref {
          font-size: 13px;
          color: $gray-500;
          font-weight: 400;
        }

        .savings-badge {
          padding: 2px 8px;
          background: rgba($success-500, 0.15);
          color: $success-700;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
      }

      .stock-badge {
        padding: 4px 8px;
        background: rgba($success-500, 0.1);
        color: $success-700;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;

        &--out {
          background: rgba($danger-500, 0.1);
          color: $danger-700;
        }
      }
    }

    .info-actions {
      display: flex;
      gap: 8px;

      .btn-buy {
        flex: 1;
        height: 36px;
        background: $primary-500;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: $primary-600;
        }

        &:disabled {
          background: $gray-300;
          color: $gray-500;
          cursor: not-allowed;
        }
      }

      .btn-fav {
        width: 36px;
        height: 36px;
        background: $gray-100;
        border: 1px solid $gray-300;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 16px;

        &:hover {
          background: $gray-200;
        }
      }
    }

    .info-desc {
      p {
        margin: 0;
        font-size: 13px;
        color: $gray-700;
        line-height: 1.5;
        max-height: 60px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }

    .info-features {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      .feature-tag {
        padding: 4px 8px;
        background: $gray-100;
        border-radius: 4px;
        font-size: 11px;
        color: $gray-700;
      }
    }
  }

  // Specs Section
  &__specs {
    h3 {
      font-size: 14px;
      font-weight: 600;
      color: $gray-900;
      margin: 0 0 12px 0;
    }

    .specs-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .spec-item {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        padding-bottom: 6px;
        border-bottom: 1px solid $gray-100;

        .spec-name {
          color: $gray-600;
        }

        .spec-value {
          color: $gray-900;
          font-weight: 500;
          text-align: right;
        }
      }
    }

    .specs-empty {
      font-size: 12px;
      color: $gray-500;
    }
  }

  // Related Products - Fixed Height Cards
  &__related {
    padding-top: 16px;
    border-top: 1px solid $gray-200;

    h3 {
      font-size: 16px;
      font-weight: 600;
      color: $gray-900;
      margin: 0 0 12px 0;
    }

    .related-carousel {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;
      padding-bottom: 8px;

      @media (max-width: 1200px) {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      }

      @media (max-width: 768px) {
        display: flex;
        overflow-x: auto;
        scrollbar-width: thin;
        scrollbar-color: $gray-300 $gray-100;

        &::-webkit-scrollbar {
          height: 4px;
        }

        &::-webkit-scrollbar-track {
          background: $gray-100;
          border-radius: 2px;
        }

        &::-webkit-scrollbar-thumb {
          background: $gray-300;
          border-radius: 2px;

          &:hover {
            background: $gray-400;
          }
        }
      }

      .related-item {
        cursor: pointer;
        transition: transform 0.2s ease;
        background: $white;
        border: 1px solid $gray-200;
        border-radius: 8px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        height: 100%; // Ensure full height

        @media (max-width: 768px) {
          flex: 0 0 160px;
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        img {
          width: 100%;
          aspect-ratio: 1; // Square images
          object-fit: cover;
          border-radius: 4px;
          background: $gray-50;
          margin-bottom: 8px;
        }

        .related-content {
          flex: 1; // Take remaining space
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 50px; // Minimum content height

          h4 {
            font-size: 13px;
            font-weight: 500;
            color: $gray-900;
            margin: 0 0 6px 0;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2; // Max 2 lines
            -webkit-box-orient: vertical;
            overflow: hidden;
            min-height: 32px; // Reserve space for 2 lines
          }

          .related-price {
            font-size: 14px;
            font-weight: 600;
            color: $primary-600;
            margin-top: auto; // Push to bottom
          }
        }
      }
    }
  }
}

// =====================================================
// LIGHTBOX (Keep simple)
// =====================================================

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  &__content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;

    img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
    }
  }

  &__counter {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 12px;
  }

  &__close,
  &__prev,
  &__next {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &__close {
    top: 20px;
    right: 20px;
  }

  &__prev {
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
  }

  &__next {
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

// Mobile Responsive
@media (max-width: 768px) {
  .product-compact {
    &__gallery {
      .gallery-main {
        aspect-ratio: 4/3;
      }
    }

    &__info {
      .info-title {
        font-size: 18px;
      }

      .info-price-row {
        .price-block {
          .price-current {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
