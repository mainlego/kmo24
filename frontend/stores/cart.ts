import { defineStore } from 'pinia';
import type { Product } from '~/types';

interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    isLoading: false,
  }),

  getters: {
    totalItems: (state): number => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    subtotal: (state): number => {
      return state.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);
    },

    total: (state): number => {
      return state.items.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
      }, 0);
    },

    isEmpty: (state): boolean => {
      return state.items.length === 0;
    },

    hasItem: (state) => (productId: string): boolean => {
      return state.items.some(item => item.productId === productId);
    },

    getItemQuantity: (state) => (productId: string): number => {
      const item = state.items.find(item => item.productId === productId);
      return item?.quantity || 0;
    },
  },

  actions: {
    async fetchCart() {
      this.isLoading = true;

      try {
        // Load from localStorage
        this.loadFromLocalStorage();
        console.log('✅ Cart loaded:', this.items.length, 'items');
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async addItem(productId: string, quantity: number = 1) {
      try {
        // Fetch product from API
        const { apiFetch } = useApi();
        const response = await apiFetch<{ success: boolean; data: Product }>(
          `/products/${productId}`
        );

        if (!response.success || !response.data) {
          throw new Error('Product not found');
        }

        const product = response.data;

        // Check if product already in cart
        const existingItemIndex = this.items.findIndex(item => item.productId === productId);

        if (existingItemIndex !== -1) {
          // Product already in cart (only 1 item allowed)
          alert('Товар уже в корзине');
          return;
        }

        // Add new item (always quantity = 1)
        if (product.stock.available < 1) {
          alert('Товар закончился');
          return;
        }

        this.items.push({
          productId,
          product,
          quantity: 1, // Always 1 item
        });

        // Save to localStorage
        this.saveToLocalStorage();

        console.log('✅ Added to cart:', product.name);
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
    },

    async removeItem(productId: string) {
      try {
        const itemIndex = this.items.findIndex(item => item.productId === productId);

        if (itemIndex !== -1) {
          const item = this.items[itemIndex];
          this.items.splice(itemIndex, 1);

          // Save to localStorage
          this.saveToLocalStorage();

          console.log('✅ Removed from cart:', item.product.name);
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
      }
    },

    async clearCart() {
      try {
        this.items = [];

        // Clear localStorage
        this.saveToLocalStorage();

        console.log('✅ Cart cleared');
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }
    },

    saveToLocalStorage() {
      if (process.client) {
        try {
          // Save only productId, quantity always 1
          const cartData = this.items.map(item => ({
            productId: item.productId,
            quantity: 1, // Always save as 1
          }));
          localStorage.setItem('cart', JSON.stringify(cartData));
        } catch (error) {
          console.error('Error saving cart to localStorage:', error);
        }
      }
    },

    async loadFromLocalStorage() {
      if (process.client) {
        try {
          const stored = localStorage.getItem('cart');
          if (stored) {
            const cartData = JSON.parse(stored);
            const { apiFetch } = useApi();

            // Fetch product data for each cart item from API
            const itemPromises = cartData.map(async (item: { productId: string; quantity: number }) => {
              try {
                const response = await apiFetch<{ success: boolean; data: Product }>(
                  `/products/${item.productId}`
                );

                if (!response.success || !response.data) return null;

                return {
                  productId: item.productId,
                  product: response.data,
                  quantity: 1, // Always 1 item
                };
              } catch (error) {
                console.error(`Error loading product ${item.productId}:`, error);
                return null;
              }
            });

            const items = await Promise.all(itemPromises);
            this.items = items.filter(Boolean) as CartItem[];
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          this.items = [];
        }
      }
    },
  },
});
