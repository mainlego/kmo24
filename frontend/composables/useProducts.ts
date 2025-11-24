import type { Ref } from 'vue';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description: {
    short?: string;
    full?: string;
  };
  category: string | {
    _id: string;
    name: string;
    slug: string;
  };
  price: number;
  oldPrice?: number;
  discountPercent: number;
  stock: {
    quantity: number;
    reserved: number;
    available: number;
  };
  status: 'available' | 'out_of_stock' | 'on_order' | 'discontinued';
  images: Array<{
    url: string;
    alt?: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  videos?: Array<{
    url: string;
    title?: string;
    thumbnail?: string;
  }>;
  specifications?: Array<{
    name: string;
    value: string;
    unit?: string;
    group?: string;
  }>;
  variants?: Array<{
    name: string;
    options: Array<{
      value: string;
      sku?: string;
      price?: number;
      stock?: number;
      image?: string;
    }>;
  }>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  relatedProducts?: Array<{
    product: string;
    type: 'cross_sell' | 'up_sell' | 'similar' | 'accessories';
  }>;
  rating: {
    average: number;
    count: number;
  };
  stats: {
    views: number;
    purchases: number;
    addedToCart: number;
    addedToWishlist: number;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  isFeatured: boolean;
  isNew: boolean;
  isActive: boolean;
  externalId?: string;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export const useProducts = () => {
  const { apiFetch } = useApi();
  const { error: showError, success: showSuccess } = useToast();

  /**
   * Получить список товаров с фильтрами
   */
  const getProducts = async (filters: ProductFilters = {}) => {
    try {
      const query = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });

      const response = await apiFetch<ProductsResponse>(`/products?${query.toString()}`);
      return response;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке товаров');
      throw err;
    }
  };

  /**
   * Получить товар по ID
   */
  const getProductById = async (id: string) => {
    try {
      const response = await apiFetch<ProductResponse>(`/products/${id}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке товара');
      throw err;
    }
  };

  /**
   * Получить товар по slug
   */
  const getProductBySlug = async (slug: string) => {
    try {
      const response = await apiFetch<ProductResponse>(`/products/slug/${slug}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Товар не найден');
      throw err;
    }
  };

  /**
   * Создать новый товар (admin)
   */
  const createProduct = async (productData: Partial<Product>) => {
    try {
      const response = await apiFetch<ProductResponse>('/products', {
        method: 'POST',
        body: productData,
      });
      showSuccess('Товар успешно создан');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при создании товара');
      throw err;
    }
  };

  /**
   * Обновить товар (admin)
   */
  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await apiFetch<ProductResponse>(`/products/${id}`, {
        method: 'PUT',
        body: productData,
      });
      showSuccess('Товар успешно обновлен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при обновлении товара');
      throw err;
    }
  };

  /**
   * Удалить товар (admin)
   */
  const deleteProduct = async (id: string) => {
    try {
      await apiFetch(`/products/${id}`, {
        method: 'DELETE',
      });
      showSuccess('Товар успешно удален');
    } catch (err: any) {
      showError(err.message || 'Ошибка при удалении товара');
      throw err;
    }
  };

  /**
   * Массовое обновление товаров (admin)
   */
  const bulkUpdateProducts = async (ids: string[], updates: Partial<Product>) => {
    try {
      await apiFetch('/products/bulk-update', {
        method: 'PATCH',
        body: { ids, updates },
      });
      showSuccess(`Обновлено товаров: ${ids.length}`);
    } catch (err: any) {
      showError(err.message || 'Ошибка при массовом обновлении');
      throw err;
    }
  };

  /**
   * Массовое удаление товаров (admin)
   */
  const bulkDeleteProducts = async (ids: string[]) => {
    try {
      await apiFetch('/products/bulk-delete', {
        method: 'DELETE',
        body: { ids },
      });
      showSuccess(`Удалено товаров: ${ids.length}`);
    } catch (err: any) {
      showError(err.message || 'Ошибка при массовом удалении');
      throw err;
    }
  };

  /**
   * Загрузить изображения товара
   */
  const uploadProductImages = async (productId: string, files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await apiFetch<ProductResponse>(`/products/${productId}/images`, {
        method: 'POST',
        body: formData,
      });
      showSuccess('Изображения успешно загружены');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке изображений');
      throw err;
    }
  };

  /**
   * Удалить изображение товара
   */
  const deleteProductImage = async (productId: string, imageUrl: string) => {
    try {
      const response = await apiFetch<ProductResponse>(`/products/${productId}/images`, {
        method: 'DELETE',
        body: { imageUrl },
      });
      showSuccess('Изображение удалено');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при удалении изображения');
      throw err;
    }
  };

  /**
   * Получить статистику товаров (admin)
   */
  const getProductStats = async () => {
    try {
      const response = await apiFetch<{
        success: boolean;
        data: {
          total: number;
          active: number;
          inactive: number;
          outOfStock: number;
          lowStock: number;
          featured: number;
          new: number;
        };
      }>('/products/stats');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке статистики');
      throw err;
    }
  };

  return {
    getProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts,
    bulkDeleteProducts,
    uploadProductImages,
    deleteProductImage,
    getProductStats,
  };
};
