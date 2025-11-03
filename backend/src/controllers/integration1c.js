const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const IntegrationLog = require('../models/IntegrationLog');

/**
 * Sync products from 1C
 * POST /api/integration/1c/products/sync
 *
 * Expected body: { products: [...] }
 */
exports.syncProducts = async (req, res) => {
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
          'metadata.externalId': productData.externalId
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
          'metadata.externalId': productData.externalId,
          'metadata.lastSyncAt': new Date(),
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
exports.syncCategories = async (req, res) => {
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
exports.updateStock = async (req, res) => {
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
          'metadata.externalId': item.externalId
        });

        if (!product) {
          results.notFound++;
          continue;
        }

        product.stock = item.stock;
        product.isAvailable = item.stock > 0;
        product.metadata.lastStockUpdate = new Date();

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
exports.updatePrices = async (req, res) => {
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
          'metadata.externalId': item.externalId
        });

        if (!product) {
          results.notFound++;
          continue;
        }

        product.price = item.price;
        if (item.compareAtPrice) {
          product.compareAtPrice = item.compareAtPrice;
        }
        product.metadata.lastPriceUpdate = new Date();

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
exports.getNewOrders = async (req, res) => {
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
exports.updateOrderStatus = async (req, res) => {
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
exports.markOrdersAsExported = async (req, res) => {
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
exports.healthCheck = async (req, res) => {
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
exports.getStats = async (req, res) => {
  try {
    const stats = {
      products: {
        total: await Product.countDocuments(),
        synced: await Product.countDocuments({ 'metadata.externalId': { $exists: true } }),
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
