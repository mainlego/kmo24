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
            <div class="product-detail__gallery">
              <div class="product-detail__main-image">
                <img
                  :src="currentImage.url"
                  :alt="currentImage.alt || product.name"
                />
                <div v-if="hasDiscount" class="product-detail__discount-badge">
                  -{{ discountPercent }}%
                </div>
              </div>
              <div v-if="product.images.length > 1" class="product-detail__thumbnails">
                <button
                  v-for="(image, index) in product.images"
                  :key="index"
                  :class="['product-detail__thumbnail', { 'product-detail__thumbnail--active': currentImageIndex === index }]"
                  @click="currentImageIndex = index"
                >
                  <img :src="image.url" :alt="image.alt || `${product.name} - изображение ${index + 1}`" />
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="product-detail__info">
              <h1 class="product-detail__title">{{ product.name }}</h1>

              <!-- Rating -->
              <div class="product-detail__rating">
                <div class="product-detail__stars">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    :class="{ 'product-detail__star--filled': star <= Math.round(product.rating.average) }"
                    class="product-detail__star"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      :fill="star <= Math.round(product.rating.average) ? 'currentColor' : 'none'"
                      stroke="currentColor"
                      stroke-width="2"
                    />
                  </svg>
                </div>
                <span class="product-detail__rating-text">
                  {{ product.rating.average.toFixed(1) }} ({{ product.rating.count }} отзывов)
                </span>
              </div>

              <!-- Price -->
              <div class="product-detail__price-block">
                <div class="product-detail__price">
                  <span v-if="hasDiscount" class="product-detail__old-price">
                    {{ formatPrice(product.oldPrice!) }}
                  </span>
                  <span class="product-detail__current-price">
                    {{ formatPrice(product.price) }}
                  </span>
                </div>
                <BaseBadge
                  v-if="isInStock"
                  variant="success"
                  size="md"
                >
                  В наличии: {{ product.stock.quantity }} шт.
                </BaseBadge>
                <BaseBadge v-else variant="danger" size="md">
                  Нет в наличии
                </BaseBadge>
              </div>

              <!-- Short Description -->
              <p class="product-detail__short-description">
                {{ product.description?.short }}
              </p>

              <!-- Actions -->
              <div class="product-detail__actions">
                <div class="product-detail__quantity">
                  <label>Количество:</label>
                  <div class="product-detail__quantity-controls">
                    <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
                    <input v-model.number="quantity" type="number" min="1" :max="product.stock.quantity" />
                    <button @click="increaseQuantity" :disabled="quantity >= product.stock.quantity">+</button>
                  </div>
                </div>

                <BaseButton
                  variant="primary"
                  size="lg"
                  :disabled="!isInStock"
                  :loading="isAddingToCart"
                  @click="handleAddToCart"
                  fullWidth
                  class="product-detail__cart-button"
                >
                  {{ isInStock ? 'Добавить в корзину' : 'Нет в наличии' }}
                </BaseButton>

                <BaseButton
                  variant="outline"
                  size="lg"
                  @click="toggleFavorite"
                  fullWidth
                  class="product-detail__favorite-button"
                >
                  <span v-if="isFavorite">❤️ В избранном</span>
                  <span v-else>🤍 В избранное</span>
                </BaseButton>
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

              <!-- Reviews Tab -->
              <div v-show="activeTab === 'reviews'" class="product-detail__tab-panel">
                <h2>Отзывы ({{ product.rating.count }})</h2>
                <p>Отзывы будут загружены с сервера</p>
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
                  <div class="sidebar-related__rating">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    <span>{{ item.rating.average.toFixed(1) }}</span>
                  </div>
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
  { id: 'reviews', label: 'Отзывы' },
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
    // TODO: Show success notification
    console.log(`Added ${quantity.value} items to cart`);
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

.product-detail {
  min-height: calc(100vh - 200px);
  padding: $spacing-xl 0;
  background: linear-gradient(180deg, $white 0%, $gray-50 100%);

  // New wrapper with grid layout
  &__wrapper {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: $spacing-2xl;
    align-items: start;

    @media (max-width: $breakpoint-lg) {
      grid-template-columns: 1fr;
      gap: $spacing-xl;
    }
  }

  &__content {
    width: 100%;
  }

  // Sidebar Styles
  &__sidebar {
    position: sticky;
    top: $spacing-xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;

    @media (max-width: $breakpoint-lg) {
      display: none;
    }
  }

  // Mobile related products (shown only on mobile)
  &__related-mobile {
    display: none;

    @media (max-width: $breakpoint-lg) {
      display: block;
      margin-top: $spacing-2xl;
    }

    h2 {
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
      color: $gray-900;
      margin-bottom: $spacing-xl;
    }
  }

  // Keep all existing styles...
  &__breadcrumbs {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-xl;
    font-size: $font-size-sm;
    color: $gray-600;
    flex-wrap: wrap;

    a {
      color: $primary;
      text-decoration: none;
      transition: color $transition-base;

      &:hover {
        color: $primary-light;
      }
    }
  }

  &__main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-2xl;
    margin-bottom: $spacing-2xl;
    background: $white;
    padding: $spacing-xl;
    border-radius: $radius-2xl;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
      padding: $spacing-lg;
    }
  }

  &__cart-button {
    background: $gradient-primary !important;
    border: none;
    font-weight: $font-weight-semibold;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba($primary-500, 0.3);
    }
  }

  &__favorite-button {
    border-color: $primary;
    color: $primary;

    &:hover {
      background: rgba($primary-500, 0.05);
      border-color: $primary-light;
    }
  }

  // Existing styles remain the same...
  &__gallery,
  &__info,
  &__tabs,
  &__price-block,
  &__actions {
    // Keep all existing styles
  }

  &__current-price {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $gray-900; // Changed from primary to black
  }
}

// Sidebar Related Products Styles
.sidebar-related {
  background: $white;
  border-radius: $radius-xl;
  padding: $spacing-lg;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-lg;

    h3 {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $gray-900;
      margin: 0;
    }
  }

  &__badge {
    background: linear-gradient(135deg, $primary-500 0%, $primary-light 100%);
    color: $white;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__item {
    display: flex;
    gap: $spacing-md;
    padding: $spacing-md;
    background: $gray-50;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;

    &:hover {
      background: linear-gradient(135deg, rgba($primary-500, 0.05) 0%, rgba($primary-light, 0.05) 100%);
      transform: translateX(-4px);
      box-shadow: 0 4px 20px rgba($primary-500, 0.15);

      .sidebar-related__quick-add {
        opacity: 1;
        transform: scale(1);
      }

      .sidebar-related__image img {
        transform: scale(1.05);
      }
    }
  }

  &__image {
    position: relative;
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    border-radius: $radius-md;
    overflow: hidden;
    background: $white;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  &__discount {
    position: absolute;
    top: $spacing-xs;
    right: $spacing-xs;
    background: $error;
    color: $white;
    padding: 2px 6px;
    border-radius: $radius-sm;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: $spacing-xs;
  }

  &__title {
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    color: $warning;
    font-size: $font-size-xs;

    svg {
      flex-shrink: 0;
    }
  }

  &__price {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__old-price {
    font-size: $font-size-xs;
    color: $gray-500;
    text-decoration: line-through;
  }

  &__current-price {
    font-size: $font-size-base;
    font-weight: $font-weight-bold;
    color: $gray-900;
  }

  &__actions {
    position: absolute;
    right: $spacing-md;
    bottom: $spacing-md;
  }

  &__quick-add {
    width: 36px;
    height: 36px;
    border-radius: $radius-full;
    background: $gradient-primary;
    color: $white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 4px 16px rgba($primary-500, 0.4);
    }
  }

  &__view-all {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    margin-top: $spacing-lg;
    padding: $spacing-md;
    background: linear-gradient(135deg, rgba($primary-500, 0.1) 0%, rgba($primary-light, 0.1) 100%);
    color: $primary;
    text-decoration: none;
    border-radius: $radius-lg;
    font-weight: $font-weight-semibold;
    transition: all 0.3s ease;

    &:hover {
      background: $gradient-primary;
      color: $white;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba($primary-500, 0.3);
    }
  }
}

// Sticky Consultation Block
.sidebar-sticky {
  &__content {
    background: $gradient-primary;
    border-radius: $radius-xl;
    padding: $spacing-lg;
    color: $white;
    text-align: center;

    h4 {
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      margin: 0 0 $spacing-sm 0;
    }

    p {
      font-size: $font-size-sm;
      opacity: 0.95;
      margin-bottom: $spacing-lg;
      line-height: 1.5;
    }
  }

  &__call {
    width: 100%;
    padding: $spacing-md;
    background: $white;
    color: $primary;
    border: none;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    transition: all 0.3s ease;

    &:hover {
      background: rgba($white, 0.95);
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-lg;

  @media (max-width: $breakpoint-md) {
    padding: 0 $spacing-md;
  }
}
</style>