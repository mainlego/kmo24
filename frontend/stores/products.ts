import { defineStore } from 'pinia';
import type { Product, PaginatedResponse, ProductFilters } from '~/types';
import { mockProducts } from '~/mocks/products';

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
     * Получение списка товаров (с mock данными)
     */
    async fetchProducts(filters?: ProductFilters) {
      this.isLoading = true;
      this.error = null;

      // Обновляем фильтры
      if (filters) {
        this.filters = { ...this.filters, ...filters };
      }

      try {
        // Имитация задержки сети
        await new Promise((resolve) => setTimeout(resolve, 300));

        console.log('📦 Loading mock products:', mockProducts.length);
        console.log('🖼️ First product images:', mockProducts[0]?.images);

        let filteredProducts = [...mockProducts];

        // Фильтрация по категории
        if (this.filters.category) {
          filteredProducts = filteredProducts.filter(
            (p) => p.category._id === this.filters.category
          );
        }

        // Фильтрация по цене
        if (this.filters.minPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price >= this.filters.minPrice!
          );
        }
        if (this.filters.maxPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price <= this.filters.maxPrice!
          );
        }

        // Фильтрация по наличию
        if (this.filters.inStock) {
          filteredProducts = filteredProducts.filter(
            (p) => p.stock.available > 0
          );
        }

        // Поиск
        if (this.filters.search) {
          const searchLower = this.filters.search.toLowerCase();
          filteredProducts = filteredProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(searchLower) ||
              (p.description && p.description.toLowerCase().includes(searchLower))
          );
        }

        // Сортировка
        if (this.filters.sort) {
          const sortField = this.filters.sort.replace('-', '');
          const isDesc = this.filters.sort.startsWith('-');

          filteredProducts.sort((a, b) => {
            let aVal: any, bVal: any;

            if (sortField === 'price') {
              aVal = a.price;
              bVal = b.price;
            } else if (sortField === 'name') {
              aVal = a.name;
              bVal = b.name;
            } else if (sortField === 'rating') {
              aVal = a.rating.average;
              bVal = b.rating.average;
            } else {
              return 0;
            }

            if (aVal < bVal) return isDesc ? 1 : -1;
            if (aVal > bVal) return isDesc ? -1 : 1;
            return 0;
          });
        }

        // Пагинация
        const limit = this.filters.limit || 12;
        const page = this.filters.page || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        this.products = paginatedProducts;
        this.pagination = {
          currentPage: page,
          totalPages: Math.ceil(filteredProducts.length / limit),
          totalItems: filteredProducts.length,
          hasNextPage: endIndex < filteredProducts.length,
          hasPrevPage: page > 1,
        };

        return {
          success: true,
          data: paginatedProducts,
          pagination: this.pagination,
        };
      } catch (error: any) {
        this.error = error.message || 'Ошибка загрузки товаров';
        console.error('Fetch products error:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Получение одного товара (с mock данными)
     */
    async fetchProduct(idOrSlug: string) {
      this.isLoading = true;
      this.error = null;

      try {
        // Имитация задержки сети
        await new Promise((resolve) => setTimeout(resolve, 200));

        const product = mockProducts.find(
          (p) => p._id === idOrSlug || p.slug === idOrSlug
        );

        if (!product) {
          throw new Error('Товар не найден');
        }

        this.currentProduct = product;

        // Загружаем похожие товары
        const related = mockProducts
          .filter((p) => p.category._id === product.category._id && p._id !== product._id)
          .slice(0, 4);
        this.relatedProducts = related;

        return { success: true, data: product };
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
