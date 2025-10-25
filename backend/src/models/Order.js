import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    // Номер заказа
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // Пользователь
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Может быть гостевой заказ
    },

    // Контактная информация
    customer: {
      firstName: {
        type: String,
        required: [true, 'Имя обязательно'],
      },
      lastName: {
        type: String,
        required: [true, 'Фамилия обязательна'],
      },
      email: {
        type: String,
        required: [true, 'Email обязателен'],
      },
      phone: {
        type: String,
        required: [true, 'Телефон обязателен'],
      },
    },

    // Товары в заказе
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        sku: String,
        image: String,
        variant: {
          name: String,
          value: String,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        total: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    // Адрес доставки
    shippingAddress: {
      country: String,
      city: {
        type: String,
        required: true,
      },
      street: String,
      building: String,
      apartment: String,
      postalCode: String,
      comment: String,
    },

    // Доставка
    shipping: {
      method: {
        type: String,
        enum: ['pickup', 'dellin', 'pek', 'courier'],
        required: true,
      },
      company: String,
      trackingNumber: String,
      cost: {
        type: Number,
        default: 0,
        min: 0,
      },
      estimatedDelivery: Date,
      actualDelivery: Date,
      terminal: {
        id: String,
        address: String,
      },
    },

    // Оплата
    payment: {
      method: {
        type: String,
        enum: ['cash', 'card', 'online', 'bank_transfer'],
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      paidAt: Date,
      transactionId: String,
    },

    // Суммы
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
      },
      shipping: {
        type: Number,
        default: 0,
        min: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    // Промокод
    promoCode: {
      code: String,
      discount: Number,
    },

    // Статус заказа
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'packed',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
    },

    // История статусов
    statusHistory: [
      {
        status: String,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],

    // Комментарии
    customerComment: String,
    adminComment: String,

    // ID из 1С
    externalId: {
      type: String,
      sparse: true,
      unique: true,
    },
    lastSyncedAt: Date,

    // Флаги
    isPaid: {
      type: Boolean,
      default: false,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Индексы
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ externalId: 1 });
orderSchema.index({ isPaid: 1 });

// Генерация номера заказа перед сохранением
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Находим последний заказ за сегодня
    const lastOrder = await mongoose.model('Order').findOne(
      {
        createdAt: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999)),
        },
      },
      { orderNumber: 1 },
      { sort: { createdAt: -1 } }
    );

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4), 10);
      sequence = lastSequence + 1;
    }

    this.orderNumber = `${year}${month}${day}-${String(sequence).padStart(4, '0')}`;
  }

  // Добавляем в историю статусов при изменении
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      createdAt: new Date(),
    });
  }

  // Вычисляем итоговую сумму
  if (this.isModified('items') || this.isModified('pricing')) {
    this.pricing.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.pricing.total =
      this.pricing.subtotal - this.pricing.discount + this.pricing.shipping;
  }

  next();
});

// Метод для отмены заказа
orderSchema.methods.cancel = async function (comment, userId) {
  if (['delivered', 'cancelled', 'refunded'].includes(this.status)) {
    throw new Error('Невозможно отменить заказ с данным статусом');
  }

  this.status = 'cancelled';
  this.statusHistory.push({
    status: 'cancelled',
    comment: comment || 'Заказ отменен',
    updatedBy: userId,
  });

  // Освобождаем резерв товаров
  const Product = mongoose.model('Product');
  for (const item of this.items) {
    const product = await Product.findById(item.product);
    if (product) {
      await product.releaseReserve(item.quantity);
    }
  }

  await this.save();
};

// Метод для подтверждения оплаты
orderSchema.methods.confirmPayment = async function (transactionId) {
  this.payment.status = 'paid';
  this.payment.paidAt = new Date();
  this.payment.transactionId = transactionId;
  this.isPaid = true;

  if (this.status === 'pending') {
    this.status = 'confirmed';
  }

  await this.save();
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
