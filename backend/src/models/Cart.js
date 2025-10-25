import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    // Пользователь (опционально для гостей)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      sparse: true,
    },

    // Сессия для гостевых корзин
    sessionId: {
      type: String,
      sparse: true,
    },

    // Товары в корзине
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Количество не может быть меньше 1'],
          default: 1,
        },
        variant: {
          name: String,
          value: String,
        },
        price: {
          type: Number,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Промокод
    promoCode: {
      code: String,
      discount: Number,
      expiresAt: Date,
    },

    // Срок действия корзины
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Индексы
cartSchema.index({ user: 1 }, { unique: true, sparse: true });
cartSchema.index({ sessionId: 1 }, { unique: true, sparse: true });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL индекс

// Виртуальное поле для подсчета общего количества товаров
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Виртуальное поле для подсчета общей суммы
cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
});

// Виртуальное поле для подсчета суммы со скидкой
cartSchema.virtual('total').get(function () {
  const subtotal = this.subtotal;
  const discount = this.promoCode?.discount || 0;
  return Math.max(0, subtotal - discount);
});

// Метод для добавления товара в корзину
cartSchema.methods.addItem = async function (productId, quantity = 1, variant = null, price) {
  const existingItemIndex = this.items.findIndex(
    (item) =>
      item.product.toString() === productId.toString() &&
      (!variant || item.variant?.value === variant?.value)
  );

  if (existingItemIndex > -1) {
    // Товар уже есть в корзине, увеличиваем количество
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Добавляем новый товар
    this.items.push({
      product: productId,
      quantity,
      variant,
      price,
    });
  }

  // Продлеваем срок действия корзины
  this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await this.save();
  return this;
};

// Метод для обновления количества товара
cartSchema.methods.updateItemQuantity = async function (productId, quantity, variant = null) {
  const itemIndex = this.items.findIndex(
    (item) =>
      item.product.toString() === productId.toString() &&
      (!variant || item.variant?.value === variant?.value)
  );

  if (itemIndex === -1) {
    throw new Error('Товар не найден в корзине');
  }

  if (quantity <= 0) {
    // Удаляем товар если количество <= 0
    this.items.splice(itemIndex, 1);
  } else {
    this.items[itemIndex].quantity = quantity;
  }

  await this.save();
  return this;
};

// Метод для удаления товара из корзины
cartSchema.methods.removeItem = async function (productId, variant = null) {
  this.items = this.items.filter(
    (item) =>
      !(
        item.product.toString() === productId.toString() &&
        (!variant || item.variant?.value === variant?.value)
      )
  );

  await this.save();
  return this;
};

// Метод для очистки корзины
cartSchema.methods.clear = async function () {
  this.items = [];
  this.promoCode = undefined;
  await this.save();
  return this;
};

// Метод для применения промокода
cartSchema.methods.applyPromoCode = async function (code, discount, expiresAt) {
  this.promoCode = {
    code,
    discount,
    expiresAt,
  };

  await this.save();
  return this;
};

// Метод для удаления промокода
cartSchema.methods.removePromoCode = async function () {
  this.promoCode = undefined;
  await this.save();
  return this;
};

// Метод для проверки и обновления цен товаров
cartSchema.methods.updatePrices = async function () {
  const Product = mongoose.model('Product');

  for (const item of this.items) {
    const product = await Product.findById(item.product);
    if (product) {
      item.price = product.price;
    }
  }

  await this.save();
  return this;
};

// Метод для валидации наличия товаров
cartSchema.methods.validateAvailability = async function () {
  const Product = mongoose.model('Product');
  const unavailableItems = [];

  for (const item of this.items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      unavailableItems.push({
        item,
        reason: 'Товар не найден или неактивен',
      });
    } else if (product.stock.available < item.quantity) {
      unavailableItems.push({
        item,
        reason: `Недостаточно товара на складе (доступно: ${product.stock.available})`,
      });
    }
  }

  return unavailableItems;
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
