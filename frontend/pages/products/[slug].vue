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
            <!-- Gallery -->
            <div class="product-gallery">
              <div class="product-gallery__main-image">
                <img
                  :src="currentImage.url"
                  :alt="currentImage.alt || product.name"
                />
                <div v-if="hasDiscount" class="discount-badge">
                  -{{ discountPercent }}%
                </div>
              </div>
              <div v-if="product.images.length > 1" class="product-gallery__thumbnails">
                <button
                  v-for="(image, index) in product.images"
                  :key="index"
                  :class="['product-gallery__thumb', { 'active': currentImageIndex === index }]"
                  @click="currentImageIndex = index"
                >
                  <img :src="image.url" :alt="image.alt || `${product.name} - изображение ${index + 1}`" />
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
                <button
                  class="product-actions__buy product-actions__buy--full"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Product } from '~/types';

import { mockProducts } from '~/mocks/products';

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
    await cartStore.addItem(product.value._id, 1);
    // TODO: Show success notification
    console.log('Added 1 item to cart');
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

onMounted(async () => {
  try {
    isLoading.value = true;

    const foundProduct = mockProducts.find(p => p.slug === slug.value);

    if (foundProduct) {
      product.value = foundProduct;

      // Get related products (up to 6 for sidebar)
      relatedProducts.value = mockProducts
        .filter(p => p.category._id === foundProduct.category._id && p._id !== foundProduct._id)
        .slice(0, 6);
    } else {
      error.value = 'Товар не найден';
    }

    await new Promise(resolve => setTimeout(resolve, 300));
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
</style>
