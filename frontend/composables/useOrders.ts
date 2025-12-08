export interface OrderItem {
  product: string;
  name: string;
  sku: string;
  image?: string;
  variant?: {
    name: string;
    value: string;
  };
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: {
    country?: string;
    city: string;
    street?: string;
    building?: string;
    apartment?: string;
    postalCode?: string;
    comment?: string;
  };
  shipping: {
    method: 'pickup' | 'dellin' | 'pek' | 'courier';
    company?: string;
    trackingNumber?: string;
    cost: number;
    estimatedDelivery?: string;
    actualDelivery?: string;
    terminal?: {
      id: string;
      address: string;
    };
  };
  payment: {
    method: 'cash' | 'card' | 'online' | 'bank_transfer';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    paidAt?: string;
    transactionId?: string;
  };
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  promoCode?: {
    code: string;
    discount: number;
  };
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  statusHistory: Array<{
    status: string;
    comment?: string;
    createdAt: string;
    updatedBy?: string;
  }>;
  customerComment?: string;
  adminComment?: string;
  isPaid: boolean;
  isGuest: boolean;
  externalId?: string;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export const useOrders = () => {
  const { apiFetch } = useApi();
  const { error: showError, success: showSuccess } = useToast();

  /**
   * Получить список всех заказов (admin)
   */
  const getOrders = async (filters: OrderFilters = {}) => {
    try {
      const query = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });

      const response = await apiFetch<OrdersResponse>(`/orders/all/list?${query.toString()}`);
      return response;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке заказов');
      throw err;
    }
  };

  /**
   * Получить заказ по ID
   */
  const getOrderById = async (id: string) => {
    try {
      const response = await apiFetch<OrderResponse>(`/orders/${id}`);
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке заказа');
      throw err;
    }
  };

  /**
   * Создать новый заказ
   */
  const createOrder = async (orderData: Partial<Order>) => {
    try {
      const response = await apiFetch<OrderResponse>('/orders', {
        method: 'POST',
        body: orderData,
      });
      showSuccess('Заказ успешно создан');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при создании заказа');
      throw err;
    }
  };

  /**
   * Обновить заказ (admin)
   */
  const updateOrder = async (id: string, orderData: Partial<Order>) => {
    try {
      const response = await apiFetch<OrderResponse>(`/orders/${id}`, {
        method: 'PUT',
        body: orderData,
      });
      showSuccess('Заказ успешно обновлен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при обновлении заказа');
      throw err;
    }
  };

  /**
   * Обновить статус заказа (admin)
   */
  const updateOrderStatus = async (id: string, status: Order['status'], comment?: string) => {
    try {
      const response = await apiFetch<OrderResponse>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: { status, comment },
      });
      showSuccess('Статус заказа обновлен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при обновлении статуса');
      throw err;
    }
  };

  /**
   * Отменить заказ
   */
  const cancelOrder = async (id: string, comment?: string) => {
    try {
      const response = await apiFetch<OrderResponse>(`/orders/${id}/cancel`, {
        method: 'POST',
        body: { comment },
      });
      showSuccess('Заказ отменен');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при отмене заказа');
      throw err;
    }
  };

  /**
   * Подтвердить оплату (admin)
   */
  const confirmPayment = async (id: string, transactionId?: string) => {
    try {
      const response = await apiFetch<OrderResponse>(`/orders/${id}/payment/confirm`, {
        method: 'POST',
        body: { transactionId },
      });
      showSuccess('Оплата подтверждена');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при подтверждении оплаты');
      throw err;
    }
  };

  /**
   * Получить статистику заказов (admin)
   */
  const getOrderStats = async () => {
    try {
      const response = await apiFetch<{
        success: boolean;
        data: {
          total: number;
          pending: number;
          confirmed: number;
          processing: number;
          shipped: number;
          delivered: number;
          cancelled: number;
          totalRevenue: number;
          avgOrderValue: number;
        };
      }>('/orders/stats');
      return response.data;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке статистики');
      throw err;
    }
  };

  /**
   * Получить мои заказы (пользователь)
   */
  const getMyOrders = async (filters: OrderFilters = {}) => {
    try {
      const query = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });

      const response = await apiFetch<OrdersResponse>(`/orders/my?${query.toString()}`);
      return response;
    } catch (err: any) {
      showError(err.message || 'Ошибка при загрузке заказов');
      throw err;
    }
  };

  return {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    updateOrderStatus,
    cancelOrder,
    confirmPayment,
    getOrderStats,
    getMyOrders,
  };
};
