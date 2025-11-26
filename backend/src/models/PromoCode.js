import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema(
  {
    // Код промокода
    code: {
      type: String,
      required: [true, 'Код промокода обязателен'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, 'Промокод должен содержать минимум 3 символа'],
      maxlength: [20, 'Промокод не может быть длиннее 20 символов'],
      match: [/^[A-Z0-9]+$/, 'Промокод может содержать только буквы и цифры'],
    },

    // Описание
    description: {
      type: String,
      required: [true, 'Описание обязательно'],
      maxlength: [200, 'Описание не может быть длиннее 200 символов'],
    },

    // Тип скидки
    discountType: {
      type: String,
      enum: ['fixed', 'percentage'],
      required: [true, 'Тип скидки обязателен'],
    },

    // Размер скидки
    discountValue: {
      type: Number,
      required: [true, 'Размер скидки обязателен'],
      min: [0, 'Скидка не может быть отрицательной'],
      validate: {
        validator: function(value) {
          if (this.discountType === 'percentage') {
            return value >= 0 && value <= 100;
          }
          return value >= 0;
        },
        message: 'Процентная скидка должна быть от 0 до 100',
      },
    },

    // Минимальная сумма заказа
    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: [0, 'Минимальная сумма не может быть отрицательной'],
    },

    // Максимальная скидка (для процентных промокодов)
    maximumDiscount: {
      type: Number,
      min: [0, 'Максимальная скидка не может быть отрицательной'],
    },

    // Даты действия
    validFrom: {
      type: Date,
      default: Date.now,
    },

    validUntil: {
      type: Date,
      required: [true, 'Дата окончания действия обязательна'],
      validate: {
        validator: function(value) {
          return value > this.validFrom;
        },
        message: 'Дата окончания должна быть позже даты начала',
      },
    },

    // Ограничения использования
    usageLimit: {
      type: Number,
      min: [0, 'Лимит использования не может быть отрицательным'],
    },

    usageCount: {
      type: Number,
      default: 0,
      min: [0, 'Счетчик использования не может быть отрицательным'],
    },

    // Лимит на пользователя
    perUserLimit: {
      type: Number,
      default: 1,
      min: [1, 'Лимит на пользователя должен быть минимум 1'],
    },

    // История использования
    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        email: String,
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        discountAmount: Number,
      },
    ],

    // Категории товаров, к которым применим промокод
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],

    // Конкретные товары, к которым применим промокод
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    // Исключенные товары
    excludedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    // Статус
    isActive: {
      type: Boolean,
      default: true,
    },

    // Только для новых пользователей
    firstOrderOnly: {
      type: Boolean,
      default: false,
    },

    // Только для определенных пользователей
    restrictedToUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Создатель
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Индексы
promoCodeSchema.index({ code: 1 });
promoCodeSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });
promoCodeSchema.index({ usedBy: 1 });

// Виртуальное поле для проверки валидности
promoCodeSchema.virtual('isValid').get(function() {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (!this.usageLimit || this.usageCount < this.usageLimit)
  );
});

// Метод для валидации промокода
promoCodeSchema.methods.validate = async function(userId, email, cartItems, cartTotal) {
  const now = new Date();

  // Проверка активности
  if (!this.isActive) {
    throw new Error('Промокод неактивен');
  }

  // Проверка дат
  if (now < this.validFrom) {
    throw new Error('Промокод еще не активен');
  }

  if (now > this.validUntil) {
    throw new Error('Срок действия промокода истек');
  }

  // Проверка общего лимита использования
  if (this.usageLimit && this.usageCount >= this.usageLimit) {
    throw new Error('Промокод больше не действителен');
  }

  // Проверка минимальной суммы заказа
  if (this.minimumOrderAmount && cartTotal < this.minimumOrderAmount) {
    throw new Error(`Минимальная сумма заказа для применения промокода: ${this.minimumOrderAmount} руб.`);
  }

  // Проверка для конкретных пользователей
  if (this.restrictedToUsers?.length > 0 && userId) {
    const allowed = this.restrictedToUsers.some(id => id.toString() === userId.toString());
    if (!allowed) {
      throw new Error('Промокод недоступен для вашего аккаунта');
    }
  }

  // Проверка лимита на пользователя
  if (userId || email) {
    const userUsage = this.usedBy.filter(usage => {
      if (userId && usage.user) {
        return usage.user.toString() === userId.toString();
      }
      if (email && usage.email) {
        return usage.email.toLowerCase() === email.toLowerCase();
      }
      return false;
    });

    if (userUsage.length >= this.perUserLimit) {
      throw new Error('Вы уже использовали этот промокод');
    }
  }

  // Проверка для первого заказа
  if (this.firstOrderOnly && userId) {
    const Order = mongoose.model('Order');
    const previousOrders = await Order.countDocuments({
      user: userId,
      status: { $ne: 'cancelled' }
    });

    if (previousOrders > 0) {
      throw new Error('Промокод доступен только для первого заказа');
    }
  }

  // Проверка применимости к товарам
  if (cartItems && cartItems.length > 0) {
    if (this.applicableProducts?.length > 0) {
      const hasApplicableProduct = cartItems.some(item =>
        this.applicableProducts.some(productId =>
          productId.toString() === item.product.toString()
        )
      );

      if (!hasApplicableProduct) {
        throw new Error('Промокод не применим к товарам в корзине');
      }
    }

    if (this.applicableCategories?.length > 0) {
      const Product = mongoose.model('Product');
      let hasApplicableCategory = false;

      for (const item of cartItems) {
        const product = await Product.findById(item.product);
        if (product && product.category) {
          const applicable = this.applicableCategories.some(catId =>
            catId.toString() === product.category.toString()
          );
          if (applicable) {
            hasApplicableCategory = true;
            break;
          }
        }
      }

      if (!hasApplicableCategory) {
        throw new Error('Промокод не применим к категориям товаров в корзине');
      }
    }

    if (this.excludedProducts?.length > 0) {
      const hasExcludedProduct = cartItems.some(item =>
        this.excludedProducts.some(productId =>
          productId.toString() === item.product.toString()
        )
      );

      if (hasExcludedProduct) {
        throw new Error('Промокод не применим к некоторым товарам в корзине');
      }
    }
  }

  return true;
};

// Метод для расчета скидки
promoCodeSchema.methods.calculateDiscount = function(cartTotal, applicableTotal = cartTotal) {
  let discount = 0;

  if (this.discountType === 'fixed') {
    discount = Math.min(this.discountValue, applicableTotal);
  } else if (this.discountType === 'percentage') {
    discount = applicableTotal * (this.discountValue / 100);

    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }
  }

  return Math.round(discount);
};

// Метод для применения промокода
promoCodeSchema.methods.apply = async function(userId, email, orderId, discountAmount) {
  this.usageCount += 1;
  this.usedBy.push({
    user: userId,
    email: email,
    order: orderId,
    usedAt: new Date(),
    discountAmount: discountAmount,
  });

  await this.save();
};

// Статический метод для поиска и валидации промокода
promoCodeSchema.statics.findAndValidate = async function(code, userId, email, cartItems, cartTotal) {
  const promoCode = await this.findOne({
    code: code.toUpperCase(),
    isActive: true
  });

  if (!promoCode) {
    throw new Error('Промокод не найден');
  }

  await promoCode.validate(userId, email, cartItems, cartTotal);

  return promoCode;
};

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode;