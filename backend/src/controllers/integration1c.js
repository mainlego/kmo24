import crypto from 'crypto';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import IntegrationLog from '../models/IntegrationLog.js';
import integration1CService from '../services/integration1cService.js';
import logger from '../utils/logger.js';

/**
 * Создаёт хеш данных товара для определения изменений
 */
const createProductHash = (productData) => {
  const dataToHash = {
    name: productData.name,
    sku: productData.sku,
    price: productData.price,
    description: productData.description,
    images: productData.images,
    isActive: productData.isActive,
  };
  return crypto.createHash('md5').update(JSON.stringify(dataToHash)).digest('hex');
};

/**
 * Получить статус интеграции с 1С
 * GET /api/integration/1c/status
 */
const getIntegrationStatus = async (req, res) => {
  try {
    const status = integration1CService.getStatus();

    // Пробуем подключиться, если интеграция включена
    if (status.enabled && status.configured) {
      const connectionResult = await integration1CService.checkConnection();
      res.json({
        success: true,
        data: {
          ...status,
          ...connectionResult,
        },
      });
    } else {
      res.json({
        success: true,
        data: {
          ...status,
          success: false,
          message: !status.enabled ? 'Интеграция отключена' : 'Интеграция не настроена',
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Синхронизировать товары из 1С (запрос к 1С)
 * POST /api/integration/1c/sync/products
 */
const fetchAndSyncProducts = async (req, res) => {
  const startTime = Date.now();

  try {
    const { modifiedAfter, categoryId, limit = 10000 } = req.body;

    logger.info('Starting product sync from 1C...');

    // Получаем товары из 1С
    const response = await integration1CService.getProducts({
      modifiedAfter,
      categoryId,
      limit,
    });

    if (!response.success || !Array.isArray(response.data)) {
      throw new Error(response.error || 'Некорректный ответ от 1С');
    }

    const products1C = response.data;
    const results = {
      total: products1C.length,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
    };

    // Логируем первые 3 товара для диагностики структуры данных
    if (products1C.length > 0) {
      logger.info('Sample product from 1C:', JSON.stringify(products1C[0], null, 2).substring(0, 1000));
      const withImages = products1C.filter(p => p.images && p.images.length > 0);
      logger.info(`Products with images: ${withImages.length} of ${products1C.length}`);
    }

    // Получаем все категории для маппинга externalId -> MongoDB _id
    const allCategories = await Category.find({ externalId: { $exists: true, $ne: null } });
    const categoryMap = new Map();
    for (const cat of allCategories) {
      categoryMap.set(cat.externalId, cat._id);
    }

    logger.info(`Loaded ${categoryMap.size} categories for mapping`);

    // Обрабатываем каждый товар
    for (const product1C of products1C) {
      try {
        const productData = integration1CService.transformProduct(product1C);

        // Находим MongoDB категорию по externalId из 1С
        const categoryExternalId = product1C.category?.id || product1C.categoryId;
        if (categoryExternalId && categoryMap.has(categoryExternalId)) {
          productData.category = categoryMap.get(categoryExternalId);
        } else {
          productData.category = null;
        }

        // Ищем существующий товар по externalId (ID из 1С)
        let product = await Product.findOne({
          externalId: product1C.id,
        });

        if (product) {
          // Обновляем существующий товар
          Object.assign(product, productData);
          await product.save();
          results.updated++;
        } else {
          // Если не нашли по externalId, ищем по SKU (для миграции старых товаров)
          if (productData.sku) {
            product = await Product.findOne({ sku: productData.sku });
          }

          if (product) {
            // Обновляем найденный по SKU товар и добавляем externalId
            Object.assign(product, productData);
            await product.save();
            results.updated++;
          } else {
            // Создаём новый товар
            try {
              product = await Product.create(productData);
              results.created++;
            } catch (createError) {
              // Если ошибка дублирования SKU - создаём с уникальным SKU
              if (createError.code === 11000 && createError.keyPattern?.sku) {
                productData.sku = `${productData.sku}-${product1C.id.substring(0, 8)}`;
                product = await Product.create(productData);
                results.created++;
                logger.warn(`Created product with modified SKU: ${productData.sku}`);
              } else {
                throw createError;
              }
            }
          }
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          productId: product1C.id,
          name: product1C.name,
          error: error.message,
        });
        logger.error(`Error syncing product ${product1C.id}:`, error.message);
      }
    }

    const duration = Date.now() - startTime;

    logger.info(`Product sync completed: ${results.created} created, ${results.updated} updated, ${results.failed} failed in ${duration}ms`);

    res.json({
      success: true,
      data: results,
      duration: `${duration}ms`,
    });
  } catch (error) {
    logger.error('Product sync failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Синхронизировать категории из 1С
 * POST /api/integration/1c/sync/categories
 */
const fetchAndSyncCategories = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.info('Starting category sync from 1C...');

    const response = await integration1CService.getCategories();

    if (!response.success || !Array.isArray(response.data)) {
      throw new Error(response.error || 'Некорректный ответ от 1С');
    }

    const categories1C = response.data;
    const results = {
      total: categories1C.length,
      created: 0,
      updated: 0,
      failed: 0,
      linked: 0,
      errors: [],
    };

    // Карта externalId -> MongoDB _id для связывания родительских категорий
    const externalIdMap = new Map();

    // Первый проход: создаём/обновляем все категории
    for (const category1C of categories1C) {
      try {
        const categoryData = integration1CService.transformCategory(category1C);

        let category = await Category.findOne({
          externalId: category1C.id,
        });

        if (category) {
          Object.assign(category, categoryData);
          await category.save();
          results.updated++;
        } else {
          category = await Category.create(categoryData);
          results.created++;
        }

        externalIdMap.set(category1C.id, category._id);
      } catch (error) {
        results.failed++;
        results.errors.push({
          categoryId: category1C.id,
          name: category1C.name,
          error: error.message,
        });
      }
    }

    // Второй проход: связываем родительские категории
    for (const category1C of categories1C) {
      if (category1C.parentId) {
        try {
          const parentMongoId = externalIdMap.get(category1C.parentId);
          if (parentMongoId) {
            await Category.updateOne(
              { externalId: category1C.id },
              { parent: parentMongoId, level: 1 }
            );
            results.linked++;
          }
        } catch (e) {
          // Игнорируем ошибки связывания
        }
      }
    }

    const duration = Date.now() - startTime;

    logger.info(`Category sync completed in ${duration}ms`);

    res.json({
      success: true,
      data: results,
      duration: `${duration}ms`,
    });
  } catch (error) {
    logger.error('Category sync failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Полная синхронизация (категории + товары)
 * POST /api/integration/1c/sync/full
 */
const fullSync = async (req, res) => {
  const startTime = Date.now();

  try {
    logger.info('Starting full sync from 1C...');

    const results = {
      categories: null,
      products: null,
    };

    // Карта externalId -> MongoDB _id для связывания
    const categoryMap = new Map();

    // 1. Синхронизируем категории
    try {
      const categoriesResponse = await integration1CService.getCategories();
      if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
        results.categories = { total: categoriesResponse.data.length, created: 0, updated: 0, failed: 0, linked: 0 };

        // Первый проход: создаём/обновляем все категории
        for (const category1C of categoriesResponse.data) {
          try {
            const categoryData = integration1CService.transformCategory(category1C);
            let category = await Category.findOne({ externalId: category1C.id });

            if (category) {
              Object.assign(category, categoryData);
              await category.save();
              results.categories.updated++;
            } else {
              category = await Category.create(categoryData);
              results.categories.created++;
            }
            categoryMap.set(category1C.id, category._id);
          } catch (e) {
            results.categories.failed++;
          }
        }

        // Второй проход: связываем родительские категории
        for (const category1C of categoriesResponse.data) {
          if (category1C.parentId) {
            try {
              const parentMongoId = categoryMap.get(category1C.parentId);
              if (parentMongoId) {
                await Category.updateOne(
                  { externalId: category1C.id },
                  { parent: parentMongoId, level: 1 }
                );
                results.categories.linked++;
              }
            } catch (e) {
              // Игнорируем ошибки связывания
            }
          }
        }
      }
    } catch (error) {
      results.categories = { error: error.message };
    }

    // 2. Синхронизируем товары
    try {
      const productsResponse = await integration1CService.getProducts({ limit: 10000 });
      if (productsResponse.success && Array.isArray(productsResponse.data)) {
        results.products = { total: productsResponse.data.length, created: 0, updated: 0, failed: 0 };

        for (const product1C of productsResponse.data) {
          try {
            const productData = integration1CService.transformProduct(product1C);

            // Находим MongoDB категорию по externalId из 1С
            const categoryExternalId = product1C.category?.id || product1C.categoryId;
            if (categoryExternalId && categoryMap.has(categoryExternalId)) {
              productData.category = categoryMap.get(categoryExternalId);
            } else {
              productData.category = null;
            }

            let product = await Product.findOne({ externalId: product1C.id });

            if (product) {
              Object.assign(product, productData);
              await product.save();
              results.products.updated++;
            } else {
              // Если не нашли по externalId, ищем по SKU
              if (productData.sku) {
                product = await Product.findOne({ sku: productData.sku });
              }

              if (product) {
                Object.assign(product, productData);
                await product.save();
                results.products.updated++;
              } else {
                try {
                  await Product.create(productData);
                  results.products.created++;
                } catch (createError) {
                  // Если ошибка дублирования SKU - создаём с уникальным SKU
                  if (createError.code === 11000 && createError.keyPattern?.sku) {
                    productData.sku = `${productData.sku}-${product1C.id.substring(0, 8)}`;
                    await Product.create(productData);
                    results.products.created++;
                  } else {
                    throw createError;
                  }
                }
              }
            }
          } catch (e) {
            results.products.failed++;
          }
        }
      }
    } catch (error) {
      results.products = { error: error.message };
    }

    const duration = Date.now() - startTime;

    logger.info(`Full sync completed in ${duration}ms`);

    res.json({
      success: true,
      data: results,
      duration: `${duration}ms`,
    });
  } catch (error) {
    logger.error('Full sync failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Отправить заказ в 1С
 * POST /api/integration/1c/orders/:id/send
 */
const sendOrderTo1C = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Заказ не найден',
      });
    }

    // Преобразуем заказ в формат 1С
    const orderData = integration1CService.transformOrderFor1C(order);

    // Отправляем в 1С
    const response = await integration1CService.sendOrder(orderData);

    // Обновляем заказ
    order.metadata = {
      ...order.metadata,
      exportedTo1C: true,
      external1CId: response.data?.orderId || response.orderId,
      lastSyncAt: new Date(),
    };
    await order.save();

    res.json({
      success: true,
      data: {
        orderId: order._id,
        external1CId: order.metadata.external1CId,
        response,
      },
    });
  } catch (error) {
    logger.error('Error sending order to 1C:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Sync products from 1C (webhook - 1С отправляет данные к нам)
 * POST /api/integration/1c/products/sync
 *
 * Expected body: { products: [...] }
 */
const syncProducts = async (req, res) => {
  const startTime = Date.now();
  const { products } = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({
      success: false,
      error: 'Products must be an array',
    });
  }

  const results = {
    total: products.length,
    created: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  try {
    for (const productData of products) {
      try {
        // Validate required fields
        if (!productData.externalId || !productData.name) {
          throw new Error(`Missing required fields for product: ${JSON.stringify(productData)}`);
        }

        // Find existing product by external ID (1C ID)
        let product = await Product.findOne({
          externalId: productData.externalId
        });

        const productFields = {
          name: productData.name,
          description: productData.description || '',
          price: productData.price || 0,
          compareAtPrice: productData.compareAtPrice,
          sku: productData.sku || productData.externalId,
          barcode: productData.barcode,
          category: productData.categoryId, // Category ObjectId
          stock: productData.stock || 0,
          isAvailable: productData.isAvailable !== false,
          weight: productData.weight,
          dimensions: productData.dimensions,
          externalId: productData.externalId,
          lastSyncedAt: new Date(),
        };

        if (product) {
          // Update existing product
          Object.assign(product, productFields);
          await product.save();
          results.updated++;
        } else {
          // Create new product
          product = await Product.create(productFields);
          results.created++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          product: productData.externalId || 'unknown',
          error: error.message,
        });
      }
    }

    const duration = Date.now() - startTime;

    res.json({
      success: true,
      data: results,
      duration: `${duration}ms`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Sync categories from 1C
 * POST /api/integration/1c/categories/sync
 */
const syncCategories = async (req, res) => {
  const { categories } = req.body;

  if (!Array.isArray(categories)) {
    return res.status(400).json({
      success: false,
      error: 'Categories must be an array',
    });
  }

  const results = {
    total: categories.length,
    created: 0,
    updated: 0,
    failed: 0,
    errors: [],
  };

  try {
    for (const categoryData of categories) {
      try {
        if (!categoryData.externalId || !categoryData.name) {
          throw new Error('Missing required fields');
        }

        let category = await Category.findOne({
          externalId: categoryData.externalId
        });

        const categoryFields = {
          name: categoryData.name,
          description: categoryData.description,
          slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
          externalId: categoryData.externalId,
          parentId: categoryData.parentId, // External parent ID
          isActive: categoryData.isActive !== false,
        };

        if (category) {
          Object.assign(category, categoryFields);
          await category.save();
          results.updated++;
        } else {
          category = await Category.create(categoryFields);
          results.created++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          category: categoryData.externalId,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update product stock from 1C
 * POST /api/integration/1c/stock/update
 */
const updateStock = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      error: 'Items must be an array',
    });
  }

  const results = {
    total: items.length,
    updated: 0,
    notFound: 0,
    failed: 0,
  };

  try {
    for (const item of items) {
      try {
        const product = await Product.findOne({
          externalId: item.externalId
        });

        if (!product) {
          results.notFound++;
          continue;
        }

        product.stock = { quantity: item.stock, reserved: 0 };
        product.isAvailable = item.stock > 0;
        product.lastSyncedAt = new Date();

        await product.save();
        results.updated++;
      } catch (error) {
        results.failed++;
      }
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update product prices from 1C
 * POST /api/integration/1c/prices/update
 */
const updatePrices = async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      error: 'Items must be an array',
    });
  }

  const results = {
    total: items.length,
    updated: 0,
    notFound: 0,
    failed: 0,
  };

  try {
    for (const item of items) {
      try {
        const product = await Product.findOne({
          externalId: item.externalId
        });

        if (!product) {
          results.notFound++;
          continue;
        }

        product.price = item.price;
        if (item.compareAtPrice) {
          product.oldPrice = item.compareAtPrice;
        }
        product.lastSyncedAt = new Date();

        await product.save();
        results.updated++;
      } catch (error) {
        results.failed++;
      }
    }

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Get new orders for 1C
 * GET /api/integration/1c/orders/new
 */
const getNewOrders = async (req, res) => {
  try {
    const { since, limit = 100 } = req.query;

    const query = {
      status: 'pending',
      'metadata.exportedTo1C': { $ne: true },
    };

    if (since) {
      query.createdAt = { $gte: new Date(since) };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name sku metadata.externalId')
      .limit(parseInt(limit))
      .sort({ createdAt: 1 });

    // Map to 1C format
    const ordersFor1C = orders.map(order => ({
      orderId: order._id,
      orderNumber: order.orderNumber,
      date: order.createdAt,
      customer: {
        name: order.user?.name || order.shippingAddress?.fullName,
        email: order.user?.email || order.contactEmail,
        phone: order.user?.phone || order.shippingAddress?.phone,
      },
      items: order.items.map(item => ({
        externalId: item.product?.metadata?.externalId,
        productName: item.product?.name,
        sku: item.product?.sku,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      deliveryMethod: order.deliveryMethod,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      notes: order.notes,
    }));

    res.json({
      success: true,
      data: ordersFor1C,
      count: ordersFor1C.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Update order status from 1C
 * POST /api/integration/1c/orders/:id/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status, tracking, notes, external1CId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Update order status
    if (status) {
      order.status = status;
    }

    if (tracking) {
      order.tracking = {
        ...order.tracking,
        ...tracking,
      };
    }

    if (notes) {
      order.notes = (order.notes || '') + '\n[1C] ' + notes;
    }

    // Mark as exported to 1C
    order.metadata = {
      ...order.metadata,
      exportedTo1C: true,
      external1CId,
      lastSyncAt: new Date(),
    };

    await order.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Batch mark orders as exported
 * POST /api/integration/1c/orders/mark-exported
 */
const markOrdersAsExported = async (req, res) => {
  try {
    const { orderIds, external1CIds } = req.body;

    if (!Array.isArray(orderIds)) {
      return res.status(400).json({
        success: false,
        error: 'orderIds must be an array',
      });
    }

    const results = await Order.updateMany(
      { _id: { $in: orderIds } },
      {
        $set: {
          'metadata.exportedTo1C': true,
          'metadata.lastSyncAt': new Date(),
        },
      }
    );

    res.json({
      success: true,
      data: {
        matched: results.matchedCount,
        modified: results.modifiedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

/**
 * Health check endpoint
 * GET /api/integration/1c/health
 */
const healthCheck = async (req, res) => {
  try {
    // Check database connection
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        products: productsCount,
        orders: ordersCount,
      },
      integration: {
        type: req.integration.type,
        name: req.integration.name,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
    });
  }
};

/**
 * Get integration statistics
 * GET /api/integration/1c/stats
 */
const getStats = async (req, res) => {
  try {
    const stats = {
      products: {
        total: await Product.countDocuments(),
        synced: await Product.countDocuments({ externalId: { $exists: true, $ne: null } }),
        available: await Product.countDocuments({ isAvailable: true }),
      },
      orders: {
        total: await Order.countDocuments(),
        pending: await Order.countDocuments({ status: 'pending' }),
        exported: await Order.countDocuments({ 'metadata.exportedTo1C': true }),
        notExported: await Order.countDocuments({
          status: 'pending',
          'metadata.exportedTo1C': { $ne: true },
        }),
      },
      lastSync: await IntegrationLog.findOne({ apiKey: req.apiKey._id })
        .sort({ createdAt: -1 })
        .select('createdAt endpoint status'),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Хранилище активных SSE соединений для синхронизации
const activeSyncConnections = new Map();

// Размер батча для загрузки товаров из 1С
const BATCH_SIZE = 50;

/**
 * Синхронизация товаров с SSE стримингом прогресса
 * Загружает товары порциями по BATCH_SIZE и проверяет изменения
 * GET /api/integration/1c/sync/products/stream
 */
const syncProductsStream = async (req, res) => {
  // Настройка SSE - критично для real-time стриминга
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('Content-Encoding', 'identity');
  res.flushHeaders();

  const syncId = Date.now().toString();
  activeSyncConnections.set(syncId, { res, aborted: false });

  // Отправка события клиенту
  const sendEvent = (event, data) => {
    if (activeSyncConnections.get(syncId)?.aborted) return;
    try {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      res.write(message);
    } catch (e) {
      // Игнорируем ошибки записи при закрытом соединении
    }
  };

  // Обработка отмены соединения
  req.on('close', () => {
    const conn = activeSyncConnections.get(syncId);
    if (conn) {
      conn.aborted = true;
      activeSyncConnections.delete(syncId);
    }
    logger.info(`Sync stream ${syncId} closed by client`);
  });

  const startTime = Date.now();

  // Keep-alive интервал
  const keepAliveInterval = setInterval(() => {
    if (!activeSyncConnections.get(syncId)?.aborted) {
      try {
        res.write(': keep-alive\n\n');
      } catch (e) {}
    }
  }, 10000);

  try {
    sendEvent('start', { message: 'Начинаем синхронизацию...', syncId });

    // Загружаем категории для маппинга
    const allCategories = await Category.find({ externalId: { $exists: true, $ne: null } });
    const categoryMap = new Map();
    for (const cat of allCategories) {
      categoryMap.set(cat.externalId, cat._id);
    }

    const results = {
      total: 0,
      created: 0,
      updated: 0,
      skipped: 0, // Пропущено без изменений
      failed: 0,
    };

    let page = 1;
    let hasMore = true;
    let totalProcessed = 0;

    // Загружаем товары порциями
    while (hasMore && !activeSyncConnections.get(syncId)?.aborted) {
      sendEvent('progress', {
        phase: 'fetch',
        message: `Загрузка товаров из 1С (страница ${page})...`,
        page,
      });

      let products1C = [];

      try {
        const response = await integration1CService.getProducts({
          page,
          limit: BATCH_SIZE,
        });

        if (!response.success || !Array.isArray(response.data)) {
          // Если это не первая страница и нет данных - закончили
          if (page > 1) {
            hasMore = false;
            continue;
          }
          throw new Error(response.error || 'Некорректный ответ от 1С');
        }

        products1C = response.data;

        // Если получили меньше чем запрашивали - это последняя страница
        if (products1C.length < BATCH_SIZE) {
          hasMore = false;
        }

        // Если пустой ответ - закончили
        if (products1C.length === 0) {
          hasMore = false;
          continue;
        }
      } catch (fetchError) {
        // На первой странице ошибка критична
        if (page === 1) {
          throw fetchError;
        }
        // На других страницах просто заканчиваем
        hasMore = false;
        continue;
      }

      results.total += products1C.length;

      sendEvent('progress', {
        phase: 'sync',
        message: `Обработка ${products1C.length} товаров (страница ${page})...`,
        page,
        batchSize: products1C.length,
        totalProcessed,
      });

      // Обрабатываем товары текущей порции
      for (let i = 0; i < products1C.length; i++) {
        if (activeSyncConnections.get(syncId)?.aborted) {
          sendEvent('cancelled', { message: 'Синхронизация отменена', results });
          clearInterval(keepAliveInterval);
          res.end();
          return;
        }

        const product1C = products1C[i];
        totalProcessed++;

        try {
          const productData = integration1CService.transformProduct(product1C);

          // Находим категорию
          const categoryExternalId = product1C.category?.id || product1C.categoryId;
          if (categoryExternalId && categoryMap.has(categoryExternalId)) {
            productData.category = categoryMap.get(categoryExternalId);
          } else {
            productData.category = null;
          }

          // Создаём хеш данных для проверки изменений
          const newHash = createProductHash(productData);

          // Ищем существующий товар
          let product = await Product.findOne({ externalId: product1C.id });
          let action = '';

          if (product) {
            // Проверяем, изменились ли данные
            if (product.syncHash === newHash) {
              // Данные не изменились - пропускаем
              results.skipped++;
              action = 'skipped';
            } else {
              // Данные изменились - обновляем
              Object.assign(product, productData);
              product.syncHash = newHash;
              product.lastSyncedAt = new Date();
              await product.save();
              results.updated++;
              action = 'updated';
            }
          } else {
            // Ищем по SKU (для миграции старых товаров)
            if (productData.sku) {
              product = await Product.findOne({ sku: productData.sku });
            }

            if (product) {
              Object.assign(product, productData);
              product.syncHash = newHash;
              product.lastSyncedAt = new Date();
              await product.save();
              results.updated++;
              action = 'updated';
            } else {
              // Создаём новый товар
              try {
                productData.syncHash = newHash;
                productData.lastSyncedAt = new Date();
                product = await Product.create(productData);
                results.created++;
                action = 'created';
              } catch (createError) {
                if (createError.code === 11000 && createError.keyPattern?.sku) {
                  productData.sku = `${productData.sku}-${product1C.id.substring(0, 8)}`;
                  product = await Product.create(productData);
                  results.created++;
                  action = 'created';
                } else {
                  throw createError;
                }
              }
            }
          }

          // Отправляем информацию о товаре (кроме skipped чтобы не засорять лог)
          if (action !== 'skipped') {
            sendEvent('item', {
              action,
              name: (productData.name || 'Без названия').substring(0, 80),
              sku: productData.sku || '',
              index: totalProcessed,
            });
          }

        } catch (error) {
          results.failed++;
          sendEvent('item', {
            action: 'failed',
            name: (product1C.name || 'Без названия').substring(0, 80),
            sku: product1C.sku || '',
            error: (error.message || 'Ошибка').substring(0, 80),
            index: totalProcessed,
          });
        }
      }

      // Отправляем прогресс после каждой порции
      sendEvent('progress', {
        phase: 'sync',
        message: `Обработано ${totalProcessed} товаров`,
        current: totalProcessed,
        total: results.total,
        created: results.created,
        updated: results.updated,
        skipped: results.skipped,
        failed: results.failed,
        page,
      });

      page++;
    }

    clearInterval(keepAliveInterval);

    const duration = Date.now() - startTime;
    const durationSec = Math.round(duration / 1000);

    sendEvent('complete', {
      message: 'Синхронизация завершена',
      results,
      duration: durationSec > 60 ? `${Math.floor(durationSec / 60)}м ${durationSec % 60}с` : `${durationSec}с`,
    });

    activeSyncConnections.delete(syncId);
    res.end();

  } catch (error) {
    clearInterval(keepAliveInterval);
    logger.error('Product sync stream failed:', error.message);
    sendEvent('error', { message: error.message });
    activeSyncConnections.delete(syncId);
    res.end();
  }
};

/**
 * Отменить активную синхронизацию
 * POST /api/integration/1c/sync/cancel/:syncId
 */
const cancelSync = async (req, res) => {
  const { syncId } = req.params;

  const conn = activeSyncConnections.get(syncId);
  if (conn) {
    conn.aborted = true;
    res.json({ success: true, message: 'Синхронизация отменена' });
  } else {
    res.status(404).json({ success: false, message: 'Синхронизация не найдена' });
  }
};

export default {
  // Новые методы - запрос данных ИЗ 1С
  getIntegrationStatus,
  fetchAndSyncProducts,
  fetchAndSyncCategories,
  fullSync,
  sendOrderTo1C,
  syncProductsStream,
  cancelSync,

  // Старые методы - приём данных ОТ 1С (webhooks)
  syncProducts,
  syncCategories,
  updateStock,
  updatePrices,
  getNewOrders,
  updateOrderStatus,
  markOrdersAsExported,
  healthCheck,
  getStats,
};
