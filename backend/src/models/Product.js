import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    // Основная информация
    name: {
      type: String,
      required: [true, 'Название товара обязательно'],
      trim: true,
      maxlength: [200, 'Название не может быть длиннее 200 символов'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'Артикул обязателен'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      short: {
        type: String,
        maxlength: [500, 'Краткое описание не может быть длиннее 500 символов'],
      },
      full: {
        type: String,
        maxlength: [5000, 'Полное описание не может быть длиннее 5000 символов'],
      },
    },

    // Категория
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Категория обязательна'],
    },

    // Цены
    price: {
      type: Number,
      required: [true, 'Цена обязательна'],
      min: [0, 'Цена не может быть отрицательной'],
    },
    oldPrice: {
      type: Number,
      min: [0, 'Старая цена не может быть отрицательной'],
    },
    discountPercent: {
      type: Number,
      min: [0, 'Скидка не может быть отрицательной'],
      max: [100, 'Скидка не может быть больше 100%'],
      default: 0,
    },

    // Остатки и доступность
    stock: {
      quantity: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Остаток не может быть отрицательным'],
      },
      reserved: {
        type: Number,
        default: 0,
        min: [0, 'Резерв не может быть отрицательным'],
      },
      available: {
        type: Number,
        default: 0,
        min: [0, 'Доступно не может быть отрицательным'],
      },
    },
    status: {
      type: String,
      enum: ['available', 'out_of_stock', 'on_order', 'discontinued'],
      default: 'available',
    },

    // Медиа
    images: [
      {
        url: String,
        alt: String,
        isPrimary: { type: Boolean, default: false },
        sortOrder: { type: Number, default: 0 },
      },
    ],
    videos: [
      {
        url: String,
        title: String,
        thumbnail: String,
      },
    ],

    // Характеристики
    specifications: [
      {
        name: String,
        value: String,
        unit: String,
        group: String,
      },
    ],

    // Варианты товара (размеры, цвета и т.д.)
    variants: [
      {
        name: String, // например: "Размер", "Цвет"
        options: [
          {
            value: String, // например: "XL", "Красный"
            sku: String,
            price: Number,
            stock: Number,
            image: String,
          },
        ],
      },
    ],

    // Габариты и вес для расчета доставки
    dimensions: {
      length: { type: Number, min: 0 }, // см
      width: { type: Number, min: 0 }, // см
      height: { type: Number, min: 0 }, // см
      weight: { type: Number, min: 0 }, // кг
    },

    // Связанные товары
    relatedProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        type: {
          type: String,
          enum: ['cross_sell', 'up_sell', 'similar', 'accessories'],
          default: 'similar',
        },
      },
    ],

    // Рейтинг и отзывы
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // Статистика
    stats: {
      views: { type: Number, default: 0 },
      purchases: { type: Number, default: 0 },
      addedToCart: { type: Number, default: 0 },
      addedToWishlist: { type: Number, default: 0 },
    },

    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },

    // Флаги
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ID из 1С
    externalId: {
      type: String,
      sparse: true,
      unique: true,
    },
    lastSyncedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Индексы
productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ externalId: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNew: 1 });

// Текстовый индекс для поиска
productSchema.index({
  name: 'text',
  'description.short': 'text',
  'description.full': 'text',
  sku: 'text',
});

// Виртуальное поле для отзывов
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

// Виртуальное поле для скидки
productSchema.virtual('hasDiscount').get(function () {
  return this.oldPrice && this.oldPrice > this.price;
});

// Вычисление доступного остатка перед сохранением
productSchema.pre('save', function (next) {
  this.stock.available = Math.max(0, this.stock.quantity - this.stock.reserved);

  // Обновление статуса в зависимости от остатка
  if (this.stock.available === 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock') {
    this.status = 'available';
  }

  next();
});

// Метод для резервирования товара
productSchema.methods.reserve = async function (quantity) {
  if (this.stock.available < quantity) {
    throw new Error('Недостаточно товара на складе');
  }

  this.stock.reserved += quantity;
  this.stock.available = this.stock.quantity - this.stock.reserved;
  await this.save();
};

// Метод для освобождения резерва
productSchema.methods.releaseReserve = async function (quantity) {
  this.stock.reserved = Math.max(0, this.stock.reserved - quantity);
  this.stock.available = this.stock.quantity - this.stock.reserved;
  await this.save();
};

// Метод для уменьшения остатка (при продаже)
productSchema.methods.decreaseStock = async function (quantity) {
  if (this.stock.quantity < quantity) {
    throw new Error('Недостаточно товара на складе');
  }

  this.stock.quantity -= quantity;
  this.stock.reserved = Math.max(0, this.stock.reserved - quantity);
  this.stock.available = this.stock.quantity - this.stock.reserved;
  this.stats.purchases += 1;
  await this.save();
};

// Метод для обновления рейтинга
productSchema.methods.updateRating = async function () {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { product: this._id, isApproved: true } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    this.rating.average = Math.round(stats[0].avgRating * 10) / 10;
    this.rating.count = stats[0].count;
  } else {
    this.rating.average = 0;
    this.rating.count = 0;
  }

  await this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;
