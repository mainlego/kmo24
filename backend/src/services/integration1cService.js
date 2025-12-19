/**
 * Сервис интеграции с 1С
 * Выполняет запросы к HTTP-сервису 1С для получения товаров, категорий и отправки заказов
 */

import logger from '../utils/logger.js';

class Integration1CService {
  constructor() {
    this.baseUrl = process.env.INTEGRATION_1C_URL || '';
    this.username = process.env.INTEGRATION_1C_USER || '';
    this.password = process.env.INTEGRATION_1C_PASSWORD || '';
    this.enabled = process.env.INTEGRATION_1C_ENABLED === 'true';
    this.timeout = parseInt(process.env.INTEGRATION_1C_TIMEOUT) || 30000;
  }

  /**
   * Создание заголовков авторизации
   */
  getAuthHeaders() {
    const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json',
    };
  }

  /**
   * Выполнение HTTP запроса к 1С
   */
  async request(endpoint, options = {}) {
    if (!this.enabled) {
      throw new Error('Интеграция с 1С отключена');
    }

    if (!this.baseUrl) {
      throw new Error('URL для 1С не настроен');
    }

    const url = `${this.baseUrl}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      logger.info(`1C API Request: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`1C API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      logger.info(`1C API Response: ${response.status}, items: ${data.data?.length || 0}`);

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Timeout при подключении к 1С (${this.timeout}ms)`);
      }

      logger.error('1C API Error:', error.message);
      throw error;
    }
  }

  /**
   * Проверка доступности 1С
   */
  async checkConnection() {
    try {
      const startTime = Date.now();

      // Пробуем простой запрос
      const response = await this.request('/ping', { method: 'GET' });

      const duration = Date.now() - startTime;

      return {
        success: true,
        message: 'Подключение к 1С успешно',
        responseTime: `${duration}ms`,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        error: error.toString(),
      };
    }
  }

  /**
   * Получение списка товаров из 1С
   */
  async getProducts(options = {}) {
    const params = new URLSearchParams();

    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.modifiedAfter) params.append('modified_after', options.modifiedAfter);
    if (options.categoryId) params.append('category_id', options.categoryId);

    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * Получение одного товара по ID из 1С
   */
  async getProduct(productId) {
    return this.request(`/products/${productId}`, { method: 'GET' });
  }

  /**
   * Получение категорий из 1С
   */
  async getCategories() {
    return this.request('/categories', { method: 'GET' });
  }

  /**
   * Получение остатков товаров из 1С
   */
  async getStock(productIds = []) {
    if (productIds.length > 0) {
      return this.request('/stock', {
        method: 'POST',
        body: JSON.stringify({ productIds }),
      });
    }
    return this.request('/stock', { method: 'GET' });
  }

  /**
   * Отправка заказа в 1С
   */
  async sendOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  /**
   * Получение статуса заказа из 1С
   */
  async getOrderStatus(orderId) {
    return this.request(`/orders/${orderId}`, { method: 'GET' });
  }

  /**
   * Получение изображения товара из 1С
   */
  getImageUrl(imageId) {
    if (!imageId) return null;
    return `${this.baseUrl}/files/${imageId}`;
  }

  /**
   * Преобразование товара из формата 1С в формат сайта
   */
  transformProduct(product1C) {
    return {
      name: product1C.name || '',
      sku: product1C.sku || product1C.id || '',
      slug: this.generateSlug(product1C.name),
      price: product1C.price || 0,
      oldPrice: product1C.oldPrice || null,
      description: {
        short: product1C.description?.short || product1C.description || '',
        full: product1C.description?.full || '',
      },
      category: product1C.category?.id || null,
      manufacturer: product1C.manufacturer || '',
      model: product1C.model || '',
      year: product1C.year || null,
      condition: product1C.condition || 'good',
      location: product1C.location || '',
      isActive: product1C.isActive !== false,
      isFeatured: product1C.isFeatured || false,
      isNew: product1C.isNew || false,
      stock: {
        quantity: product1C.stock?.quantity || product1C.stock || 0,
        reserved: product1C.stock?.reserved || 0,
      },
      specifications: product1C.specifications || [],
      images: (product1C.images || []).map((img, index) => ({
        url: typeof img === 'string' ? img : (img.url || this.getImageUrl(img.id)),
        alt: product1C.name,
        isPrimary: index === 0,
        sortOrder: index,
      })),
      documents: product1C.documents || [],
      seo: {
        title: product1C.seo?.title || product1C.name,
        description: product1C.seo?.description || product1C.description?.short || '',
      },
      metadata: {
        externalId: product1C.id,
        source: '1c',
        lastSyncAt: new Date(),
      },
    };
  }

  /**
   * Преобразование категории из формата 1С в формат сайта
   */
  transformCategory(category1C) {
    return {
      name: category1C.name || '',
      slug: this.generateSlug(category1C.name),
      description: category1C.description || '',
      parentId: category1C.parentId || null,
      isActive: category1C.isActive !== false,
      sortOrder: category1C.sortOrder || 0,
      metadata: {
        externalId: category1C.id,
        source: '1c',
        lastSyncAt: new Date(),
      },
    };
  }

  /**
   * Преобразование заказа в формат 1С
   */
  transformOrderFor1C(order) {
    return {
      orderNumber: order.orderNumber,
      date: order.createdAt,
      customer: {
        firstName: order.customer?.firstName || '',
        lastName: order.customer?.lastName || '',
        email: order.customer?.email || '',
        phone: order.customer?.phone || '',
        company: order.customer?.company || '',
      },
      items: (order.items || []).map(item => ({
        productId: item.product?.metadata?.externalId || item.product?._id?.toString(),
        sku: item.sku || '',
        name: item.name || '',
        quantity: item.quantity || 1,
        price: item.price || 0,
        total: (item.price || 0) * (item.quantity || 1),
      })),
      shippingAddress: {
        country: order.shippingAddress?.country || 'Россия',
        city: order.shippingAddress?.city || '',
        street: order.shippingAddress?.street || '',
        building: order.shippingAddress?.building || '',
        apartment: order.shippingAddress?.apartment || '',
        postalCode: order.shippingAddress?.postalCode || '',
      },
      shipping: {
        method: order.shipping?.method || '',
        cost: order.shipping?.cost || 0,
      },
      payment: {
        method: order.payment?.method || '',
        status: order.payment?.status || 'pending',
      },
      pricing: {
        subtotal: order.pricing?.subtotal || 0,
        shipping: order.pricing?.shipping || 0,
        discount: order.pricing?.discount || 0,
        total: order.pricing?.total || 0,
      },
      notes: order.notes || '',
      status: order.status || 'pending',
    };
  }

  /**
   * Генерация slug из названия
   */
  generateSlug(name) {
    if (!name) return '';

    const translitMap = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
      'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    };

    return name.toLowerCase()
      .split('')
      .map(char => translitMap[char] || char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Статус интеграции
   */
  getStatus() {
    return {
      enabled: this.enabled,
      configured: !!(this.baseUrl && this.username && this.password),
      baseUrl: this.baseUrl ? this.baseUrl.replace(/\/\/.*@/, '//***@') : null,
      timeout: this.timeout,
    };
  }
}

// Singleton instance
const integration1CService = new Integration1CService();

export default integration1CService;
