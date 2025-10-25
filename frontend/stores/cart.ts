import { defineStore } from 'pinia';
import type { Product } from '~/types';
import { mockProducts } from '~/mocks/products';

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
        // Find product in mock data
        const product = mockProducts.find(p => p._id === productId);

        if (!product) {
          throw new Error('Product not found');
        }

        // Check if product already in cart
        const existingItemIndex = this.items.findIndex(item => item.productId === productId);

        if (existingItemIndex !== -1) {
          // Update quantity
          const newQuantity = this.items[existingItemIndex].quantity + quantity;

          // Check stock
          if (newQuantity > product.stock.available) {
            alert(`Доступно только ${product.stock.available} шт.`);
            return;
          }

          this.items[existingItemIndex].quantity = newQuantity;
        } else {
          // Add new item
          if (quantity > product.stock.available) {
            alert(`Доступно только ${product.stock.available} шт.`);
            return;
          }

          this.items.push({
            productId,
            product,
            quantity,
          });
        }

        // Save to localStorage
        this.saveToLocalStorage();

        console.log('✅ Added to cart:', product.name, 'x', quantity);

        // Show success message (you can replace with toast notification)
        // For now using console
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
    },

    async updateQuantity(productId: string, quantity: number) {
      try {
        const itemIndex = this.items.findIndex(item => item.productId === productId);

        if (itemIndex === -1) {
          throw new Error('Item not found in cart');
        }

        const item = this.items[itemIndex];

        // Check stock
        if (quantity > item.product.stock.available) {
          alert(`Доступно только ${item.product.stock.available} шт.`);
          return;
        }

        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          await this.removeItem(productId);
          return;
        }

        // Update quantity
        this.items[itemIndex].quantity = quantity;

        // Save to localStorage
        this.saveToLocalStorage();

        console.log('✅ Updated quantity:', item.product.name, 'to', quantity);
      } catch (error) {
        console.error('Error updating quantity:', error);
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
          // Save only productId and quantity, not the whole product object
          const cartData = this.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          }));
          localStorage.setItem('cart', JSON.stringify(cartData));
        } catch (error) {
          console.error('Error saving cart to localStorage:', error);
        }
      }
    },

    loadFromLocalStorage() {
      if (process.client) {
        try {
          const stored = localStorage.getItem('cart');
          if (stored) {
            const cartData = JSON.parse(stored);

            // Reconstruct cart items with current product data
            this.items = cartData
              .map((item: { productId: string; quantity: number }) => {
                const product = mockProducts.find(p => p._id === item.productId);
                if (!product) return null;

                return {
                  productId: item.productId,
                  product,
                  quantity: item.quantity,
                };
              })
              .filter(Boolean) as CartItem[];
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          this.items = [];
        }
      }
    },
  },
});
