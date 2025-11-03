import { ref, computed } from 'vue';

export interface RecentlyViewedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  viewedAt: number;
}

const STORAGE_KEY = 'kmo24_recently_viewed';
const MAX_ITEMS = 10;

// Reactive state
const recentlyViewed = ref<RecentlyViewedProduct[]>([]);

// Initialize from localStorage
if (process.client) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      recentlyViewed.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading recently viewed:', error);
  }
}

export const useRecentlyViewed = () => {
  // Add product to recently viewed
  const addToRecentlyViewed = (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => {
    // Remove if already exists
    recentlyViewed.value = recentlyViewed.value.filter(p => p.id !== product.id);

    // Add to beginning
    recentlyViewed.value.unshift({
      ...product,
      viewedAt: Date.now()
    });

    // Limit to MAX_ITEMS
    if (recentlyViewed.value.length > MAX_ITEMS) {
      recentlyViewed.value = recentlyViewed.value.slice(0, MAX_ITEMS);
    }

    // Save to localStorage
    if (process.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed.value));
      } catch (error) {
        console.error('Error saving recently viewed:', error);
      }
    }
  };

  // Clear all
  const clearRecentlyViewed = () => {
    recentlyViewed.value = [];
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Remove specific item
  const removeFromRecentlyViewed = (productId: string) => {
    recentlyViewed.value = recentlyViewed.value.filter(p => p.id !== productId);
    if (process.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed.value));
    }
  };

  return {
    recentlyViewed: computed(() => recentlyViewed.value),
    addToRecentlyViewed,
    clearRecentlyViewed,
    removeFromRecentlyViewed
  };
};
