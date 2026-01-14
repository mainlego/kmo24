/**
 * Сервис интеграции с 1С
 * Выполняет запросы к HTTP-сервису 1С или OData для получения товаров, категорий и отправки заказов
 */

import logger from '../utils/logger.js';

class Integration1CService {
  constructor() {
    // Базовый URL 1C (без /hs/ или /odata/)
    this.baseUrl = (process.env.INTEGRATION_1C_URL || '').replace(/\/(hs|odata).*$/, '');
    this.username = process.env.INTEGRATION_1C_USER || '';
    this.password = process.env.INTEGRATION_1C_PASSWORD || '';
    this.enabled = process.env.INTEGRATION_1C_ENABLED === 'true';
    this.timeout = parseInt(process.env.INTEGRATION_1C_TIMEOUT) || 120000; // 2 минуты на запрос
    // URL для OData
    this.odataUrl = this.baseUrl + '/odata/standard.odata';
    // URL для HTTP-сервиса (стандартный путь /hs/{корневой_url})
    this.hsUrl = this.baseUrl + '/hs/api';
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
   * Выполнение HTTP запроса к 1С (HTTP-сервис)
   */
  async request(endpoint, options = {}) {
    if (!this.enabled) {
      throw new Error('Интеграция с 1С отключена');
    }

    if (!this.hsUrl) {
      throw new Error('URL для 1С не настроен');
    }

    const url = `${this.hsUrl}${endpoint}`;

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
   * Выполнение OData запроса к 1С
   */
  async odataRequest(entity, options = {}) {
    if (!this.enabled) {
      throw new Error('Интеграция с 1С отключена');
    }

    const params = new URLSearchParams();
    params.append('$format', 'json');
    if (options.top) params.append('$top', options.top);
    if (options.skip) params.append('$skip', options.skip);
    if (options.filter) params.append('$filter', options.filter);
    if (options.select) params.append('$select', options.select);
    if (options.orderby) params.append('$orderby', options.orderby);

    const url = `${this.odataUrl}/${entity}?${params.toString()}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      logger.info(`1C OData Request: GET ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`1C OData Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      logger.info(`1C OData Response: ${response.status}, items: ${data.value?.length || 0}`);

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new Error(`Timeout при подключении к 1С (${this.timeout}ms)`);
      }

      throw error;
    }
  }

  /**
   * Проверка доступности 1С (проверяет HTTP-сервис и OData)
   */
  async checkConnection() {
    const results = {
      httpService: { success: false, message: '', responseTime: null },
      odata: { success: false, message: '', responseTime: null, entities: [] },
    };

    // Проверка HTTP-сервиса
    try {
      const startTime = Date.now();
      const response = await this.request('/ping', { method: 'GET' });
      results.httpService = {
        success: true,
        message: 'HTTP-сервис доступен',
        responseTime: `${Date.now() - startTime}ms`,
        data: response,
      };
    } catch (error) {
      results.httpService = {
        success: false,
        message: error.message,
        responseTime: null,
      };
    }

    // Проверка OData
    try {
      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.odataUrl + '/', {
        method: 'GET',
        headers: this.getAuthHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = `${Date.now() - startTime}ms`;

      if (response.ok) {
        // Попробуем получить список сущностей из metadata
        try {
          const metaResponse = await fetch(this.odataUrl + '/$metadata', {
            method: 'GET',
            headers: this.getAuthHeaders(),
          });
          if (metaResponse.ok) {
            const metaText = await metaResponse.text();
            // Извлекаем имена EntitySet из XML
            const entitySets = metaText.match(/EntitySet Name="([^"]+)"/g) || [];
            results.odata.entities = entitySets.map(e => e.match(/Name="([^"]+)"/)[1]);
          }
        } catch (e) {
          // Игнорируем ошибки получения метаданных
        }

        results.odata = {
          success: true,
          message: 'OData доступен',
          responseTime,
          entities: results.odata.entities,
        };
      } else {
        results.odata = {
          success: false,
          message: `OData вернул ${response.status}`,
          responseTime,
          entities: [],
        };
      }
    } catch (error) {
      results.odata = {
        success: false,
        message: error.name === 'AbortError' ? 'Timeout' : error.message,
        responseTime: null,
        entities: [],
      };
    }

    return {
      success: results.httpService.success || results.odata.success,
      httpService: results.httpService,
      odata: results.odata,
      config: {
        baseUrl: this.baseUrl ? this.baseUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : null,
        odataUrl: this.odataUrl ? this.odataUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : null,
        timeout: this.timeout,
      },
    };
  }

  /**
   * Получение списка товаров из 1С
   * Сначала пробует HTTP-сервис, если не работает - OData
   */
  async getProducts(options = {}) {
    // Пробуем HTTP-сервис
    try {
      const params = new URLSearchParams();
      // Поддержка разных форматов пагинации
      if (options.offset !== undefined) params.append('offset', options.offset);
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.modifiedAfter) params.append('modified_after', options.modifiedAfter);
      if (options.categoryId) params.append('category_id', options.categoryId);

      const queryString = params.toString();
      const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

      const result = await this.request(endpoint, { method: 'GET' });

      // Логируем информацию о полученных данных
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const withImages = result.data.filter(p => p.images && p.images.length > 0);
        logger.info(`1C returned ${result.data.length} products, ${withImages.length} with images`);

        // Логируем первый товар целиком для диагностики структуры данных
        const firstProduct = result.data[0];
        logger.info(`Sample product keys from 1C: ${Object.keys(firstProduct).join(', ')}`);
        logger.info(`Sample product from 1C: ${JSON.stringify(firstProduct).substring(0, 1500)}`);

        // Логируем первый товар с изображениями для диагностики
        if (withImages.length > 0) {
          logger.info(`Sample product with images: ${JSON.stringify(withImages[0].images).substring(0, 500)}`);
        }
      }

      return result;
    } catch (httpError) {
      logger.info('HTTP-сервис недоступен, пробуем OData...');

      // Fallback на OData
      try {
        const odataResult = await this.getProductsViaOData(options);
        return { success: true, data: odataResult };
      } catch (odataError) {
        // Возвращаем оригинальную ошибку HTTP
        throw httpError;
      }
    }
  }

  /**
   * Получение товаров через OData
   */
  async getProductsViaOData(options = {}) {
    const limit = options.limit || 100;

    // Пробуем разные названия справочника номенклатуры
    const possibleEntities = [
      'Catalog_Номенклатура',
      'Catalog_Товары',
      'Catalog_Products',
    ];

    for (const entity of possibleEntities) {
      try {
        const result = await this.odataRequest(entity, {
          top: limit,
          skip: options.page ? (options.page - 1) * limit : 0,
        });

        if (result.value) {
          return result.value.map(item => this.transformODataProduct(item));
        }
      } catch (e) {
        logger.debug(`OData entity ${entity} not found, trying next...`);
      }
    }

    throw new Error('Не удалось получить товары через OData. Проверьте публикацию справочников.');
  }

  /**
   * Преобразование товара из формата OData в формат сайта
   */
  transformODataProduct(odataItem) {
    return {
      id: odataItem.Ref_Key || odataItem.Ссылка,
      sku: odataItem.Артикул || odataItem.Code || odataItem.Код || '',
      name: odataItem.Description || odataItem.Наименование || '',
      description: {
        short: odataItem.Описание || odataItem.Description || '',
        full: odataItem.ПолноеОписание || odataItem.FullDescription || '',
      },
      price: odataItem.Цена || odataItem.Price || 0,
      isActive: !odataItem.DeletionMark && !odataItem.ПометкаУдаления,
      category: {
        id: odataItem.ВидНоменклатуры_Key || odataItem.Категория_Key || null,
      },
    };
  }

  /**
   * Получение одного товара по ID из 1С
   */
  async getProduct(productId) {
    return this.request(`/products/${productId}`, { method: 'GET' });
  }

  /**
   * Получение категорий из 1С
   * Сначала пробует HTTP-сервис, если не работает - OData
   */
  async getCategories() {
    // Пробуем HTTP-сервис
    try {
      return await this.request('/categories', { method: 'GET' });
    } catch (httpError) {
      logger.info('HTTP-сервис недоступен для категорий, пробуем OData...');

      // Fallback на OData
      try {
        const odataResult = await this.getCategoriesViaOData();
        return { success: true, data: odataResult };
      } catch (odataError) {
        throw httpError;
      }
    }
  }

  /**
   * Получение категорий через OData
   */
  async getCategoriesViaOData() {
    // Пробуем разные названия справочника категорий
    const possibleEntities = [
      'Catalog_ВидыНоменклатуры',
      'Catalog_КатегорииНоменклатуры',
      'Catalog_Categories',
      'Catalog_ГруппыНоменклатуры',
    ];

    for (const entity of possibleEntities) {
      try {
        const result = await this.odataRequest(entity, { top: 1000 });

        if (result.value) {
          return result.value.map(item => this.transformODataCategory(item));
        }
      } catch (e) {
        logger.debug(`OData entity ${entity} not found, trying next...`);
      }
    }

    throw new Error('Не удалось получить категории через OData. Проверьте публикацию справочников.');
  }

  /**
   * Преобразование категории из формата OData в формат сайта
   */
  transformODataCategory(odataItem) {
    return {
      id: odataItem.Ref_Key || odataItem.Ссылка,
      name: odataItem.Description || odataItem.Наименование || '',
      description: odataItem.Описание || '',
      parentId: odataItem.Parent_Key || odataItem.Родитель_Key || null,
      isActive: !odataItem.DeletionMark && !odataItem.ПометкаУдаления,
    };
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
    // Логируем данные изображений от 1С для диагностики
    if (product1C.images && product1C.images.length > 0) {
      logger.info(`Product ${product1C.name} has ${product1C.images.length} images from 1C`);
    }

    // Добавляем часть id к slug для уникальности
    const idSuffix = product1C.id ? '-' + product1C.id.substring(0, 8) : '';
    return {
      name: product1C.name || '',
      sku: product1C.sku || product1C.id || '',
      slug: this.generateSlug(product1C.name) + idSuffix,
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
      externalId: product1C.id,
      lastSyncedAt: new Date(),
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
      externalParentId: category1C.parentId || null,
      isActive: category1C.isActive !== false,
      sortOrder: category1C.sortOrder || 0,
      externalId: category1C.id,
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
