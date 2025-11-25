import { defineStore } from 'pinia';
import type { Product, PaginatedResponse, ProductFilters } from '~/types';

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  relatedProducts: Product[];
  filters: ProductFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  isLoading: boolean;
  error: string | null;
}

export const useProductsStore = defineStore('products', {
  state: (): ProductsState => ({
    products: [],
    currentProduct: null,
    relatedProducts: [],
    filters: {
      page: 1,
      limit: 12,
      sort: '-createdAt',
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    isLoading: false,
    error: null,
  }),

  getters: {
    /**
     * Получить товар по ID
     */
    getProductById: (state) => (id: string): Product | undefined => {
      return state.products.find((p) => p._id === id);
    },

    /**
     * Получить товары в наличии
     */
    availableProducts: (state): Product[] => {
      return state.products.filter((p) => p.status === 'available' && p.stock.available > 0);
    },

    /**
     * Получить новые товары
     */
    newProducts: (state): Product[] => {
      return state.products.filter((p) => p.isNew);
    },

    /**
     * Получить товары со скидкой
     */
    discountedProducts: (state): Product[] => {
      return state.products.filter((p) => p.oldPrice && p.oldPrice > p.price);
    },
  },

  actions: {
    /**
     * Получение списка товаров из API
     */
    async fetchProducts(filters?: ProductFilters) {
      this.isLoading = true;
      this.error = null;

      // Обновляем фильтры
      if (filters) {
        this.filters = { ...this.filters, ...filters };
      }

      try {
        const { apiFetch } = useApi();

        // Формируем query параметры
        const params = new URLSearchParams();
        if (this.filters.page) params.append('page', String(this.filters.page));
        if (this.filters.limit) params.append('limit', String(this.filters.limit));
        if (this.filters.sort) params.append('sort', this.filters.sort);
        if (this.filters.category) params.append('category', this.filters.category);
        if (this.filters.minPrice) params.append('minPrice', String(this.filters.minPrice));
        if (this.filters.maxPrice) params.append('maxPrice', String(this.filters.maxPrice));
        if (this.filters.inStock) params.append('inStock', 'true');
        if (this.filters.search) params.append('search', this.filters.search);

        const response = await apiFetch<PaginatedResponse<Product>>(
          `/products?${params.toString()}`
        );

        if (response.success && response.data) {
          this.products = response.data;

          if (response.pagination) {
            this.pagination = {
              currentPage: response.pagination.currentPage,
              totalPages: response.pagination.totalPages,
              totalItems: response.pagination.totalItems,
              hasNextPage: response.pagination.hasNextPage,
              hasPrevPage: response.pagination.hasPrevPage,
            };
          }

          return {
            success: true,
            data: response.data,
            pagination: this.pagination,
          };
        }

        throw new Error('Не удалось загрузить товары');
      } catch (error: any) {
        this.error = error.message || 'Ошибка загрузки товаров';
        console.error('Fetch products error:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Получение одного товара из API
     */
    async fetchProduct(idOrSlug: string) {
      this.isLoading = true;
      this.error = null;

      try {
        const { apiFetch } = useApi();

        const response = await apiFetch<{ success: boolean; data: Product }>(
          `/products/${idOrSlug}`
        );

        if (response.success && response.data) {
          this.currentProduct = response.data;

          // Загружаем похожие товары
          await this.fetchRelatedProducts(response.data._id);

          return { success: true, data: response.data };
        }

        throw new Error('Товар не найден');
      } catch (error: any) {
        this.error = error.message || 'Товар не найден';
        console.error('Fetch product error:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Получение похожих товаров
     */
    async fetchRelatedProducts(productId: string, limit: number = 4) {
      try {
        const { apiFetch } = useApi();
        const response = await apiFetch<{ success: boolean; data: Product[] }>(
          `/products/${productId}/related?limit=${limit}`
        );

        if (response.success && response.data) {
          this.relatedProducts = response.data;
        }

        return response;
      } catch (error: any) {
        console.error('Fetch related products error:', error);
        throw error;
      }
    },

    /**
     * Поиск товаров
     */
    async searchProducts(query: string) {
      return await this.fetchProducts({
        ...this.filters,
        search: query,
        page: 1,
      });
    },

    /**
     * Фильтрация по категории
     */
    async filterByCategory(categoryId: string) {
      return await this.fetchProducts({
        ...this.filters,
        category: categoryId,
        page: 1,
      });
    },

    /**
     * Фильтрация по цене
     */
    async filterByPrice(minPrice: number, maxPrice: number) {
      return await this.fetchProducts({
        ...this.filters,
        minPrice,
        maxPrice,
        page: 1,
      });
    },

    /**
     * Фильтрация только товары в наличии
     */
    async filterInStock(inStock: boolean) {
      return await this.fetchProducts({
        ...this.filters,
        inStock,
        page: 1,
      });
    },

    /**
     * Сортировка
     */
    async sortProducts(sort: string) {
      return await this.fetchProducts({
        ...this.filters,
        sort,
        page: 1,
      });
    },

    /**
     * Переход на следующую страницу
     */
    async nextPage() {
      if (this.pagination.hasNextPage) {
        return await this.fetchProducts({
          ...this.filters,
          page: this.pagination.currentPage + 1,
        });
      }
    },

    /**
     * Переход на предыдущую страницу
     */
    async prevPage() {
      if (this.pagination.hasPrevPage) {
        return await this.fetchProducts({
          ...this.filters,
          page: this.pagination.currentPage - 1,
        });
      }
    },

    /**
     * Переход на конкретную страницу
     */
    async goToPage(page: number) {
      return await this.fetchProducts({
        ...this.filters,
        page,
      });
    },

    /**
     * Сброс фильтров
     */
    resetFilters() {
      this.filters = {
        page: 1,
        limit: 12,
        sort: '-createdAt',
      };
    },

    /**
     * Очистка текущего товара
     */
    clearCurrentProduct() {
      this.currentProduct = null;
      this.relatedProducts = [];
    },
  },
});
