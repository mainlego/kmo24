<template>
  <section v-if="recentlyViewed.length > 0" class="recently-viewed">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Недавно просмотренные</h2>
        <button class="clear-btn" @click="handleClear">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 7L5 7M10 11V17M14 11V17M3 7H21L19 21H5L3 7ZM9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Очистить
        </button>
      </div>

      <div class="products-scroll">
        <div class="products-track" ref="scrollTrack">
          <NuxtLink
            v-for="product in recentlyViewed"
            :key="product.id"
            :to="`/products/${product.slug}`"
            class="product-card"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <div class="product-overlay">
                <span class="view-text">Посмотреть</span>
              </div>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">{{ formatPrice(product.price) }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Scroll buttons -->
      <button
        v-if="canScrollLeft"
        class="scroll-btn scroll-btn--left"
        @click="scroll('left')"
        aria-label="Пролистать влево"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button
        v-if="canScrollRight"
        class="scroll-btn scroll-btn--right"
        @click="scroll('right')"
        aria-label="Пролистать вправо"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRecentlyViewed } from '~/composables/useRecentlyViewed';

const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

const scrollTrack = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(price);
};

const handleClear = () => {
  if (confirm('Удалить все недавно просмотренные товары?')) {
    clearRecentlyViewed();
  }
};

const checkScroll = () => {
  if (!scrollTrack.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = scrollTrack.value;
  canScrollLeft.value = scrollLeft > 0;
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10;
};

const scroll = (direction: 'left' | 'right') => {
  if (!scrollTrack.value) return;

  const scrollAmount = 300;
  const currentScroll = scrollTrack.value.scrollLeft;

  scrollTrack.value.scrollTo({
    left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
    behavior: 'smooth'
  });
};

onMounted(() => {
  if (scrollTrack.value) {
    scrollTrack.value.addEventListener('scroll', checkScroll);
    checkScroll();
  }

  // Check on resize
  window.addEventListener('resize', checkScroll);
});

onUnmounted(() => {
  if (scrollTrack.value) {
    scrollTrack.value.removeEventListener('scroll', checkScroll);
  }
  window.removeEventListener('resize', checkScroll);
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.recently-viewed {
  padding: $spacing-3xl 0;
  background: $gray-50;
  position: relative;
  overflow-x: hidden;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-2xl 0;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-xl;

  @media (max-width: $breakpoint-sm) {
    margin-bottom: $spacing-lg;
  }
}

.section-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin: 0;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-xl;
  }

  @media (max-width: $breakpoint-sm) {
    font-size: $font-size-lg;
  }
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-sm $spacing-md;
  background: transparent;
  border: 1px solid $gray-300;
  border-radius: $radius-lg;
  color: $gray-600;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-xs;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  &:hover {
    background: $error;
    border-color: $error;
    color: $white;
    transform: translateY(-2px);
    box-shadow: $shadow-sm;
  }
}

.products-scroll {
  position: relative;
  overflow: hidden;
}

.products-track {
  display: flex;
  gap: $spacing-lg;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: $spacing-sm 0;

  // Hide scrollbar
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: $breakpoint-md) {
    gap: $spacing-md;
  }
}

.product-card {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  background: $white;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;

  @media (max-width: $breakpoint-md) {
    flex: 0 0 240px;
  }

  @media (max-width: $breakpoint-sm) {
    flex: 0 0 200px;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-xl;

    .product-overlay {
      opacity: 1;
    }

    .product-image img {
      transform: scale(1.1);
    }
  }
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background: $gray-100;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba($gray-900, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}

.view-text {
  color: $white;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  padding: $spacing-sm $spacing-lg;
  background: $gradient-primary;
  border-radius: $radius-full;
  box-shadow: $shadow-colored;
}

.product-info {
  padding: $spacing-md;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-sm;
  }
}

.product-name {
  font-size: $font-size-base;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: $breakpoint-sm) {
    font-size: $font-size-sm;
  }
}

.product-price {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $primary;
  margin: 0;

  @media (max-width: $breakpoint-sm) {
    font-size: $font-size-base;
  }
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: $radius-full;
  background: $white;
  border: 1px solid $gray-200;
  box-shadow: $shadow-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  color: $gray-700;

  @media (max-width: $breakpoint-md) {
    width: 40px;
    height: 40px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: $breakpoint-sm) {
    display: none;
  }

  &:hover {
    background: $gradient-primary;
    border-color: transparent;
    color: $white;
    transform: translateY(-50%) scale(1.1);
  }

  &--left {
    left: $spacing-sm;

    @media (max-width: $breakpoint-lg) {
      left: 0;
    }
  }

  &--right {
    right: $spacing-sm;

    @media (max-width: $breakpoint-lg) {
      right: 0;
    }
  }
}
</style>
