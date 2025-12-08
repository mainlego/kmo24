export interface CartItem {
  _id?: string;
  product: string | {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: Array<{ url: string }>;
  };
  quantity: number;
  price: number;
  variant?: {
    name: string;
    value: string;
  };
}

export interface Cart {
  _id?: string;
  user?: string;
  sessionId?: string;
  items: CartItem[];
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  promoCode?: {
    code: string;
    discount: number;
  };
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
}

export const useCart = () => {
  const { apiFetch } = useApi();
  const { error: showError, success: showSuccess } = useToast();

  // Генерировать session ID для гостей
  const getOrCreateSessionId = (): string => {
    if (!process.client) return '';

    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  // Получить заголовки с session ID
  const getSessionHeaders = (): Record<string, string> => {
    const sessionId = getOrCreateSessionId();
    return sessionId ? { 'X-Session-ID': sessionId } : {};
  };

  /**
   * Получить корзину
   */
  const getCart = async () => {
    try {
      const response = await apiFetch<CartResponse>('/cart', {
        headers: getSessionHeaders(),
      });
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке корзины');
      throw err;
    }
  };

  /**
   * Добавить товар в корзину
   */
  const addToCart = async (productId: string, quantity: number = 1, variant?: { name: string; value: string }) => {
    try {
      const response = await apiFetch<CartResponse>('/cart/items', {
        method: 'POST',
        headers: getSessionHeaders(),
        body: {
          productId,
          quantity,
          variant,
        },
      });
      showSuccess('Товар добавлен в корзину');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при добавлении товара');
      throw err;
    }
  };

  /**
   * Удалить товар из корзины
   */
  const removeFromCart = async (itemId: string) => {
    try {
      const response = await apiFetch<CartResponse>(`/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: getSessionHeaders(),
      });
      showSuccess('Товар удален из корзины');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при удалении товара');
      throw err;
    }
  };

  /**
   * Обновить количество товара в корзине
   */
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const response = await apiFetch<CartResponse>(`/cart/items/${itemId}`, {
        method: 'PUT',
        headers: getSessionHeaders(),
        body: { quantity },
      });
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при обновлении количества');
      throw err;
    }
  };

  /**
   * Очистить корзину
   */
  const clearCart = async () => {
    try {
      const response = await apiFetch<CartResponse>('/cart', {
        method: 'DELETE',
        headers: getSessionHeaders(),
      });
      showSuccess('Корзина очищена');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при очистке корзины');
      throw err;
    }
  };

  /**
   * Применить промокод
   */
  const applyPromoCode = async (code: string) => {
    try {
      const response = await apiFetch<CartResponse>('/cart/promo', {
        method: 'POST',
        headers: getSessionHeaders(),
        body: { code },
      });
      showSuccess('Промокод применен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Неверный промокод');
      throw err;
    }
  };

  /**
   * Удалить промокод
   */
  const removePromoCode = async () => {
    try {
      const response = await apiFetch<CartResponse>('/cart/promo', {
        method: 'DELETE',
        headers: getSessionHeaders(),
      });
      showSuccess('Промокод удален');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при удалении промокода');
      throw err;
    }
  };

  /**
   * Слияние корзины гостя с корзиной пользователя после авторизации
   */
  const mergeCart = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        const response = await apiFetch<CartResponse>('/cart/merge', {
          method: 'POST',
          body: { sessionId },
        });
        localStorage.removeItem('sessionId');
        return response.data;
      }
    } catch (err: any) {
      console.error('Cart merge error:', err);
      // Не показываем ошибку пользователю - это фоновая операция
    }
  };

  return {
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
    mergeCart,
  };
};
