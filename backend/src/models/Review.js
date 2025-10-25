import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    // Товар
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    // Пользователь
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Заказ (опционально, для проверки покупки)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },

    // Рейтинг
    rating: {
      type: Number,
      required: [true, 'Рейтинг обязателен'],
      min: [1, 'Рейтинг не может быть меньше 1'],
      max: [5, 'Рейтинг не может быть больше 5'],
    },

    // Текст отзыва
    title: {
      type: String,
      maxlength: [100, 'Заголовок не может быть длиннее 100 символов'],
    },
    comment: {
      type: String,
      required: [true, 'Текст отзыва обязателен'],
      minlength: [10, 'Текст отзыва должен содержать минимум 10 символов'],
      maxlength: [1000, 'Текст отзыва не может быть длиннее 1000 символов'],
    },

    // Преимущества и недостатки
    pros: {
      type: String,
      maxlength: [500, 'Преимущества не могут быть длиннее 500 символов'],
    },
    cons: {
      type: String,
      maxlength: [500, 'Недостатки не могут быть длиннее 500 символов'],
    },

    // Изображения
    images: [
      {
        url: String,
        alt: String,
      },
    ],

    // Модерация
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,

    // Реакции пользователей
    helpful: {
      type: Number,
      default: 0,
    },
    unhelpful: {
      type: Number,
      default: 0,
    },
    helpfulBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    unhelpfulBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Ответ продавца
    response: {
      text: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Индексы
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });

// Один пользователь может оставить только один отзыв на товар
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Метод для одобрения отзыва
reviewSchema.methods.approve = async function (userId) {
  this.isApproved = true;
  this.approvedBy = userId;
  this.approvedAt = new Date();
  await this.save();

  // Обновляем рейтинг товара
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  if (product) {
    await product.updateRating();
  }
};

// Метод для добавления реакции "Полезно"
reviewSchema.methods.addHelpful = async function (userId) {
  // Удаляем из unhelpful если был там
  this.unhelpfulBy = this.unhelpfulBy.filter((id) => id.toString() !== userId.toString());

  // Добавляем в helpful если еще нет
  if (!this.helpfulBy.some((id) => id.toString() === userId.toString())) {
    this.helpfulBy.push(userId);
  }

  this.helpful = this.helpfulBy.length;
  this.unhelpful = this.unhelpfulBy.length;

  await this.save();
};

// Метод для добавления реакции "Не полезно"
reviewSchema.methods.addUnhelpful = async function (userId) {
  // Удаляем из helpful если был там
  this.helpfulBy = this.helpfulBy.filter((id) => id.toString() !== userId.toString());

  // Добавляем в unhelpful если еще нет
  if (!this.unhelpfulBy.some((id) => id.toString() === userId.toString())) {
    this.unhelpfulBy.push(userId);
  }

  this.helpful = this.helpfulBy.length;
  this.unhelpful = this.unhelpfulBy.length;

  await this.save();
};

// Метод для добавления ответа продавца
reviewSchema.methods.addResponse = async function (text, userId) {
  this.response = {
    text,
    respondedBy: userId,
    respondedAt: new Date(),
  };

  await this.save();
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
