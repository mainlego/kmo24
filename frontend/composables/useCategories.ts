export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string | Category;
  children?: Category[];
  image?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  data: Category;
}

export const useCategories = () => {
  const { apiFetch } = useApi();
  const { error: showError, success: showSuccess } = useToast();

  const getCategories = async (includeInactive = false) => {
    try {
      const query = includeInactive ? '?includeInactive=true' : '';
      const response = await apiFetch<CategoriesResponse>(`/categories${query}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке категорий');
      throw err;
    }
  };

  const getCategoryById = async (id: string) => {
    try {
      const response = await apiFetch<CategoryResponse>(`/categories/${id}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке категории');
      throw err;
    }
  };

  const getCategoryBySlug = async (slug: string) => {
    try {
      const response = await apiFetch<CategoryResponse>(`/categories/slug/${slug}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Категория не найдена');
      throw err;
    }
  };

  const createCategory = async (categoryData: Partial<Category>) => {
    try {
      const response = await apiFetch<CategoryResponse>('/categories', {
        method: 'POST',
        body: categoryData,
      });
      showSuccess('Категория успешно создана');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при создании категории');
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const response = await apiFetch<CategoryResponse>(`/categories/${id}`, {
        method: 'PUT',
        body: categoryData,
      });
      showSuccess('Категория успешно обновлена');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при обновлении категории');
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await apiFetch(`/categories/${id}`, {
        method: 'DELETE',
      });
      showSuccess('Категория успешно удалена');
    } catch (err: any) {
      showError(err.message || 'Ошибка при удалении категории');
      throw err;
    }
  };

  return {
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
