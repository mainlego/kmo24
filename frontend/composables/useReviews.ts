export interface Review {
  _id: string;
  product: string | {
    _id: string;
    name: string;
    slug: string;
  };
  user: string | {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
  rating: number;
  title?: string;
  comment: string;
  pros?: string;
  cons?: string;
  images?: string[];
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  unhelpfulCount: number;
  adminReply?: {
    text: string;
    author: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  success: boolean;
  data: Review[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface ReviewResponse {
  success: boolean;
  data: Review;
}

export interface ReviewFilters {
  product?: string;
  user?: string;
  isApproved?: boolean;
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export const useReviews = () => {
  const { apiFetch } = useApi();
  const { error: showError, success: showSuccess } = useToast();

  const getReviews = async (filters: ReviewFilters = {}) => {
    try {
      const query = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });

      const response = await apiFetch<ReviewsResponse>(`/reviews?${query.toString()}`);
      return response;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке отзывов');
      throw err;
    }
  };

  const getReviewById = async (id: string) => {
    try {
      const response = await apiFetch<ReviewResponse>(`/reviews/${id}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке отзыва');
      throw err;
    }
  };

  const createReview = async (reviewData: Partial<Review>) => {
    try {
      const response = await apiFetch<ReviewResponse>('/reviews', {
        method: 'POST',
        body: reviewData,
      });
      showSuccess('Отзыв успешно отправлен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при создании отзыва');
      throw err;
    }
  };

  const updateReview = async (id: string, reviewData: Partial<Review>) => {
    try {
      const response = await apiFetch<ReviewResponse>(`/reviews/${id}`, {
        method: 'PUT',
        body: reviewData,
      });
      showSuccess('Отзыв успешно обновлен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при обновлении отзыва');
      throw err;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await apiFetch(`/reviews/${id}`, {
        method: 'DELETE',
      });
      showSuccess('Отзыв успешно удален');
    } catch (err: any) {
      showError(err.message || 'Ошибка при удалении отзыва');
      throw err;
    }
  };

  const approveReview = async (id: string) => {
    try {
      const response = await apiFetch<ReviewResponse>(`/reviews/${id}/approve`, {
        method: 'POST',
      });
      showSuccess('Отзыв одобрен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при одобрении отзыва');
      throw err;
    }
  };

  const rejectReview = async (id: string) => {
    try {
      const response = await apiFetch<ReviewResponse>(`/reviews/${id}/reject`, {
        method: 'POST',
      });
      showSuccess('Отзыв отклонен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при отклонении отзыва');
      throw err;
    }
  };

  const addAdminReply = async (id: string, text: string) => {
    try {
      const response = await apiFetch<ReviewResponse>(`/reviews/${id}/reply`, {
        method: 'POST',
        body: { text },
      });
      showSuccess('Ответ добавлен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при добавлении ответа');
      throw err;
    }
  };

  const markHelpful = async (id: string) => {
    try {
      const response = await apiFetch<ReviewResponse>(`/reviews/${id}/helpful`, {
        method: 'POST',
      });
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при оценке отзыва');
      throw err;
    }
  };

  const markUnhelpful = async (id: string) => {
    try {
      const response = await apiFetch<ReviewResponse>(`/reviews/${id}/unhelpful`, {
        method: 'POST',
      });
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при оценке отзыва');
      throw err;
    }
  };

  return {
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    approveReview,
    rejectReview,
    addAdminReply,
    markHelpful,
    markUnhelpful,
  };
};
