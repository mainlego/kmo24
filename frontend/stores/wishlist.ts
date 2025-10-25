import { defineStore } from 'pinia';
import type { Product } from '~/types';

interface WishlistState {
  items: Product[];
  isLoading: boolean;
}

export const useWishlistStore = defineStore('wishlist', {
  state: (): WishlistState => ({
    items: [],
    isLoading: false,
  }),

  getters: {
    count: (state) => state.items.length,

    hasItem: (state) => (productId: string) => {
      return state.items.some(item => item._id === productId);
    },

    isEmpty: (state) => state.items.length === 0,
  },

  actions: {
    async addItem(product: Product) {
      // Check if already in wishlist
      if (this.hasItem(product._id)) {
        console.log('Product already in wishlist');
        return;
      }

      try {
        // TODO: API call to add to wishlist
        this.items.push(product);

        // Save to localStorage
        this.saveToLocalStorage();

        console.log('✅ Added to wishlist:', product.name);
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
      }
    },

    async removeItem(productId: string) {
      try {
        // TODO: API call to remove from wishlist
        const index = this.items.findIndex(item => item._id === productId);

        if (index !== -1) {
          const product = this.items[index];
          this.items.splice(index, 1);

          // Save to localStorage
          this.saveToLocalStorage();

          console.log('✅ Removed from wishlist:', product.name);
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
      }
    },

    async toggleItem(product: Product) {
      if (this.hasItem(product._id)) {
        await this.removeItem(product._id);
      } else {
        await this.addItem(product);
      }
    },

    async clearWishlist() {
      try {
        // TODO: API call to clear wishlist
        this.items = [];

        // Clear localStorage
        this.saveToLocalStorage();

        console.log('✅ Wishlist cleared');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        throw error;
      }
    },

    async fetchWishlist() {
      this.isLoading = true;

      try {
        // TODO: API call to fetch wishlist
        // For now, load from localStorage
        this.loadFromLocalStorage();

        console.log('✅ Wishlist loaded:', this.items.length, 'items');
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    saveToLocalStorage() {
      if (process.client) {
        try {
          localStorage.setItem('wishlist', JSON.stringify(this.items));
        } catch (error) {
          console.error('Error saving wishlist to localStorage:', error);
        }
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        try {
          const stored = localStorage.getItem('wishlist');
          if (stored) {
            this.items = JSON.parse(stored);
          }
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
          this.items = [];
        }
      }
    },
  },
});
