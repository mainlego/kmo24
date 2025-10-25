import Joi from 'joi';

/**
 * Middleware для валидации запросов
 * @param {object} schema - Joi схема
 * @param {string} property - Свойство для валидации (body, query, params)
 */
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation error',
        errors,
      });
    }

    req[property] = value;
    next();
  };
};

// ===== СХЕМЫ ВАЛИДАЦИИ =====

// Аутентификация
export const authSchemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Некорректный email',
      'any.required': 'Email обязателен',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Пароль должен содержать минимум 6 символов',
      'any.required': 'Пароль обязателен',
    }),
    firstName: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Имя должно содержать минимум 2 символа',
      'string.max': 'Имя не может быть длиннее 50 символов',
      'any.required': 'Имя обязательно',
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
      'string.min': 'Фамилия должна содержать минимум 2 символа',
      'string.max': 'Фамилия не может быть длиннее 50 символов',
      'any.required': 'Фамилия обязательна',
    }),
    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Некорректный номер телефона',
      }),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Некорректный email',
      'any.required': 'Email обязателен',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Пароль обязателен',
    }),
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Refresh token обязателен',
    }),
  }),
};

// Пагинация
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().optional(),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

// Продукты
export const productSchemas = {
  create: Joi.object({
    name: Joi.string().min(3).max(200).required(),
    slug: Joi.string().lowercase().required(),
    sku: Joi.string().uppercase().required(),
    description: Joi.object({
      short: Joi.string().max(500).optional(),
      full: Joi.string().max(5000).optional(),
    }).optional(),
    category: Joi.string().hex().length(24).required(),
    price: Joi.number().min(0).required(),
    oldPrice: Joi.number().min(0).optional(),
    stock: Joi.object({
      quantity: Joi.number().integer().min(0).required(),
    }).required(),
  }),

  update: Joi.object({
    name: Joi.string().min(3).max(200).optional(),
    slug: Joi.string().lowercase().optional(),
    description: Joi.object({
      short: Joi.string().max(500).optional(),
      full: Joi.string().max(5000).optional(),
    }).optional(),
    category: Joi.string().hex().length(24).optional(),
    price: Joi.number().min(0).optional(),
    oldPrice: Joi.number().min(0).optional(),
    stock: Joi.object({
      quantity: Joi.number().integer().min(0).optional(),
    }).optional(),
    isActive: Joi.boolean().optional(),
  }),

  query: paginationSchema.keys({
    category: Joi.string().hex().length(24).optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    search: Joi.string().optional(),
    inStock: Joi.boolean().optional(),
  }),
};

// Категории
export const categorySchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    slug: Joi.string().lowercase().required(),
    description: Joi.string().max(500).optional(),
    parent: Joi.string().hex().length(24).optional().allow(null),
    sortOrder: Joi.number().integer().default(0),
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    slug: Joi.string().lowercase().optional(),
    description: Joi.string().max(500).optional(),
    parent: Joi.string().hex().length(24).optional().allow(null),
    sortOrder: Joi.number().integer().optional(),
    isActive: Joi.boolean().optional(),
  }),
};

// Корзина
export const cartSchemas = {
  addItem: Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().min(1).required(),
    variant: Joi.object({
      name: Joi.string().optional(),
      value: Joi.string().optional(),
    }).optional(),
  }),

  updateItem: Joi.object({
    quantity: Joi.number().integer().min(1).required(),
  }),

  applyPromoCode: Joi.object({
    code: Joi.string().required(),
  }),
};

// Заказы
export const orderSchemas = {
  create: Joi.object({
    customer: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
    }).required(),
    shippingAddress: Joi.object({
      city: Joi.string().required(),
      street: Joi.string().optional(),
      building: Joi.string().optional(),
      apartment: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      comment: Joi.string().optional(),
    }).required(),
    shipping: Joi.object({
      method: Joi.string().valid('pickup', 'dellin', 'pek', 'courier').required(),
      terminal: Joi.object({
        id: Joi.string().optional(),
        address: Joi.string().optional(),
      }).optional(),
    }).required(),
    payment: Joi.object({
      method: Joi.string().valid('cash', 'card', 'online', 'bank_transfer').required(),
    }).required(),
    customerComment: Joi.string().max(500).optional(),
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid(
        'pending',
        'confirmed',
        'processing',
        'packed',
        'shipped',
        'delivered',
        'cancelled',
        'refunded'
      )
      .required(),
    comment: Joi.string().optional(),
  }),
};

// Отзывы
export const reviewSchemas = {
  create: Joi.object({
    product: Joi.string().hex().length(24).required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    title: Joi.string().max(100).optional(),
    comment: Joi.string().min(10).max(1000).required(),
    pros: Joi.string().max(500).optional(),
    cons: Joi.string().max(500).optional(),
  }),
};

// MongoDB ObjectId
export const objectIdSchema = Joi.string().hex().length(24);

export default {
  validate,
  authSchemas,
  paginationSchema,
  productSchemas,
  categorySchemas,
  cartSchemas,
  orderSchemas,
  reviewSchemas,
  objectIdSchema,
};
