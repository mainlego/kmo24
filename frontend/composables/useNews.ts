export interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string | {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
  tags?: string[];
  isPublished: boolean;
  publishedAt?: string;
  views: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  success: boolean;
  data: NewsArticle[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface NewsArticleResponse {
  success: boolean;
  data: NewsArticle;
}

export interface NewsFilters {
  search?: string;
  tag?: string;
  isPublished?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export const useNews = () => {
  const { apiFetch } = useApi();
  const { error: showError, success: showSuccess } = useToast();

  const getNews = async (filters: NewsFilters = {}) => {
    try {
      const query = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });

      const response = await apiFetch<NewsResponse>(`/news?${query.toString()}`);
      return response;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке новостей');
      throw err;
    }
  };

  const getNewsById = async (id: string) => {
    try {
      const response = await apiFetch<NewsArticleResponse>(`/news/${id}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке новости');
      throw err;
    }
  };

  const getNewsBySlug = async (slug: string) => {
    try {
      const response = await apiFetch<NewsArticleResponse>(`/news/slug/${slug}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Новость не найдена');
      throw err;
    }
  };

  const createNews = async (newsData: Partial<NewsArticle>) => {
    try {
      const response = await apiFetch<NewsArticleResponse>('/news', {
        method: 'POST',
        body: newsData,
      });
      showSuccess('Новость успешно создана');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при создании новости');
      throw err;
    }
  };

  const updateNews = async (id: string, newsData: Partial<NewsArticle>) => {
    try {
      const response = await apiFetch<NewsArticleResponse>(`/news/${id}`, {
        method: 'PUT',
        body: newsData,
      });
      showSuccess('Новость успешно обновлена');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при обновлении новости');
      throw err;
    }
  };

  const deleteNews = async (id: string) => {
    try {
      await apiFetch(`/news/${id}`, {
        method: 'DELETE',
      });
      showSuccess('Новость успешно удалена');
    } catch (err: any) {
      showError(err.message || 'Ошибка при удалении новости');
      throw err;
    }
  };

  const publishNews = async (id: string) => {
    try {
      const response = await apiFetch<NewsArticleResponse>(`/news/${id}/publish`, {
        method: 'POST',
      });
      showSuccess('Новость опубликована');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при публикации новости');
      throw err;
    }
  };

  const unpublishNews = async (id: string) => {
    try {
      const response = await apiFetch<NewsArticleResponse>(`/news/${id}/unpublish`, {
        method: 'POST',
      });
      showSuccess('Новость снята с публикации');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при снятии публикации');
      throw err;
    }
  };

  return {
    getNews,
    getNewsById,
    getNewsBySlug,
    createNews,
    updateNews,
    deleteNews,
    publishNews,
    unpublishNews,
  };
};
