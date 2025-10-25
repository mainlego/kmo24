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

      <!-- Product Content -->
      <div v-else-if="product" class="product-detail__content">
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
              >
                {{ isInStock ? 'Добавить в корзину' : 'Нет в наличии' }}
              </BaseButton>

              <BaseButton
                variant="outline"
                size="lg"
                @click="toggleFavorite"
                fullWidth
              >
                {{ isFavorite ? '❤️ В избранном' : '🤍 В избранное' }}
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

        <!-- Related Products -->
        <div v-if="relatedProducts?.length" class="product-detail__related">
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

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  // TODO: Implement wishlist functionality
  console.log('Toggle favorite:', product.value?._id);
};

onMounted(async () => {
  try {
    isLoading.value = true;

    console.log('🔍 Loading product with slug:', slug.value);
    console.log('📦 Available products:', mockProducts.length);

    // Try to fetch from store/API
    // await productsStore.fetchProduct(slug.value);
    // product.value = productsStore.currentProduct;

    // For now, use mock data - find product by slug
    const foundProduct = mockProducts.find(p => p.slug === slug.value);

    if (foundProduct) {
      product.value = foundProduct;
      console.log('✅ Product found:', foundProduct.name);
      console.log('🖼️ Product images:', foundProduct.images);

      // Get related products from the same category (excluding current product)
      relatedProducts.value = mockProducts
        .filter(p => p.category._id === foundProduct.category._id && p._id !== foundProduct._id)
        .slice(0, 4); // Maximum 4 related products

      console.log('🔗 Related products:', relatedProducts.value.length);
    } else {
      error.value = 'Товар не найден';
      console.error('❌ Product not found with slug:', slug.value);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (err: any) {
    error.value = err.message || 'Не удалось загрузить товар';
    console.error('Error loading product:', err);
  } finally {
    isLoading.value = false;
  }
});

// SEO
useHead({
  title: computed(() => product.value?.name || 'Товар'),
  meta: [
    {
      name: 'description',
      content: computed(() => product.value?.description?.short || ''),
    },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.product-detail {
  min-height: calc(100vh - 200px);
  padding: $spacing-xl 0;
  background: $gray-50;

  &__breadcrumbs {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-xl;
    font-size: $font-size-sm;
    color: $gray-600;

    a {
      color: $primary;
      text-decoration: none;
      transition: color $transition-base;

      &:hover {
        color: darken($primary, 10%);
      }
    }

    span:last-child {
      color: $gray-900;
      font-weight: $font-weight-medium;
    }
  }

  &__loading,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: $spacing-lg;
  }

  &__main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-2xl;
    margin-bottom: $spacing-2xl;

    @media (max-width: $breakpoint-md) {
      grid-template-columns: 1fr;
      gap: $spacing-xl;
    }
  }

  &__gallery {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
  }

  &__main-image {
    position: relative;
    width: 100%;
    padding-top: 100%;
    background: $white;
    border-radius: $radius-xl;
    overflow: hidden;
    box-shadow: $shadow-md;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__discount-badge {
    position: absolute;
    top: $spacing-lg;
    right: $spacing-lg;
    padding: $spacing-sm $spacing-md;
    background: $error;
    color: $white;
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    border-radius: $radius-full;
  }

  &__thumbnails {
    display: flex;
    gap: $spacing-sm;
    overflow-x: auto;
  }

  &__thumbnail {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    padding: 0;
    border: 2px solid transparent;
    border-radius: $radius-md;
    overflow: hidden;
    cursor: pointer;
    transition: all $transition-base;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover {
      border-color: $primary;
    }

    &--active {
      border-color: $primary;
      box-shadow: 0 0 0 2px rgba($primary, 0.2);
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
    background: $white;
    padding: $spacing-xl;
    border-radius: $radius-xl;
    box-shadow: $shadow-sm;
  }

  &__title {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin: 0;
    line-height: 1.2;
  }

  &__rating {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
  }

  &__stars {
    display: flex;
    gap: 2px;
  }

  &__star {
    color: $gray-300;

    &--filled {
      color: $warning;
    }
  }

  &__rating-text {
    font-size: $font-size-sm;
    color: $gray-600;
  }

  &__price-block {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding: $spacing-lg;
    background: $gray-50;
    border-radius: $radius-lg;
  }

  &__price {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__old-price {
    font-size: $font-size-xl;
    color: $gray-500;
    text-decoration: line-through;
  }

  &__current-price {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $primary;
  }

  &__short-description {
    font-size: $font-size-base;
    color: $gray-700;
    line-height: 1.6;
    margin: 0;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
    padding-top: $spacing-lg;
    border-top: 1px solid $gray-200;
  }

  &__quantity {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    label {
      font-weight: $font-weight-medium;
      color: $gray-700;
    }
  }

  &__quantity-controls {
    display: flex;
    align-items: center;
    border: 1px solid $gray-300;
    border-radius: $radius-lg;
    overflow: hidden;

    button {
      width: 40px;
      height: 40px;
      border: none;
      background: $gray-100;
      color: $gray-700;
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      cursor: pointer;
      transition: all $transition-base;

      &:hover:not(:disabled) {
        background: $gray-200;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    input {
      width: 60px;
      height: 40px;
      border: none;
      text-align: center;
      font-size: $font-size-base;
      font-weight: $font-weight-medium;
      outline: none;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }

  &__features {
    h3 {
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0 0 $spacing-md 0;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;

      li {
        padding-left: $spacing-lg;
        position: relative;
        color: $gray-700;

        &::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: $success;
          font-weight: $font-weight-bold;
        }
      }
    }
  }

  &__tabs {
    background: $white;
    border-radius: $radius-xl;
    box-shadow: $shadow-sm;
    overflow: hidden;
    margin-bottom: $spacing-2xl;
  }

  &__tabs-header {
    display: flex;
    border-bottom: 1px solid $gray-200;
  }

  &__tab {
    flex: 1;
    padding: $spacing-lg;
    border: none;
    background: transparent;
    color: $gray-600;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    cursor: pointer;
    transition: all $transition-base;
    position: relative;

    &:hover {
      color: $primary;
      background: $gray-50;
    }

    &--active {
      color: $primary;

      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 2px;
        background: $primary;
      }
    }
  }

  &__tabs-content {
    padding: $spacing-xl;
  }

  &__tab-panel {
    h2 {
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0 0 $spacing-lg 0;
    }

    p {
      color: $gray-700;
      line-height: 1.6;
    }
  }

  &__specs-table {
    width: 100%;
    border-collapse: collapse;

    tr {
      border-bottom: 1px solid $gray-200;

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: $spacing-md 0;
    }
  }

  &__spec-name {
    font-weight: $font-weight-medium;
    color: $gray-700;
    width: 40%;
  }

  &__spec-value {
    color: $gray-900;
  }

  &__related {
    h2 {
      font-size: $font-size-2xl;
      font-weight: $font-weight-semibold;
      color: $gray-900;
      margin: 0 0 $spacing-xl 0;
    }
  }

  &__related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: $spacing-xl;
  }
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
