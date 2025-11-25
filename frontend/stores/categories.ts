import { defineStore } from 'pinia';

interface Category {
  _id: string;
  name: string;
  slug: string;
  level: number;
  sortOrder: number;
  isActive: boolean;
}

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    categories: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    activeCategories: (state): Category[] => {
      return state.categories.filter((c) => c.isActive);
    },
  },

  actions: {
    async fetchCategories() {
      this.isLoading = true;
      this.error = null;

      try {
        const { apiFetch } = useApi();

        const response = await apiFetch<{ success: boolean; data: Category[] }>(
          '/categories'
        );

        if (response.success && response.data) {
          this.categories = response.data;
          return { success: true, data: response.data };
        }

        throw new Error('Не удалось загрузить категории');
      } catch (error: any) {
        this.error = error.message || 'Ошибка загрузки категорий';
        console.error('Fetch categories error:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
