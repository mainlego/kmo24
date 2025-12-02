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
        return;
      }

      try {
        // TODO: API call to add to wishlist
        this.items.push(product);

        // Save to localStorage
        this.saveToLocalStorage();
      } catch (error) {
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
        }
      } catch (error) {
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
      } catch (error) {
        throw error;
      }
    },

    async fetchWishlist() {
      this.isLoading = true;

      try {
        // TODO: API call to fetch wishlist
        // For now, load from localStorage
        this.loadFromLocalStorage();
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    saveToLocalStorage() {
      if (process.client) {
        try {
          localStorage.setItem('wishlist', JSON.stringify(this.items));
        } catch {
          // Error saving wishlist
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
        } catch {
          this.items = [];
        }
      }
    },
  },
});
