import mongoose from 'mongoose';

const commercialOfferSchema = new mongoose.Schema(
  {
    // Номер КП
    number: {
      type: String,
      required: true,
      unique: true,
    },

    // Пользователь (если создано авторизованным)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Информация о клиенте
    customer: {
      companyName: String,
      contactPerson: String,
      email: {
        type: String,
        required: [true, 'Email обязателен'],
      },
      phone: String,
    },

    // Товары в КП
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        sku: String,
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
        comment: String,
      },
    ],

    // Итоговая сумма
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Валюта
    currency: {
      type: String,
      default: 'RUB',
      enum: ['RUB', 'USD', 'EUR'],
    },

    // Срок действия КП
    validUntil: {
      type: Date,
      required: true,
    },

    // Условия
    terms: {
      payment: String,
      delivery: String,
      warranty: String,
    },

    // Комментарий клиента
    customerComment: String,

    // Комментарий менеджера
    managerComment: String,

    // Статус
    status: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'],
      default: 'draft',
    },

    // Путь к сгенерированному PDF
    pdfPath: String,

    // Дата отправки
    sentAt: Date,

    // Дата просмотра клиентом
    viewedAt: Date,

    // История отправок
    emailHistory: [
      {
        sentTo: String,
        sentAt: Date,
        subject: String,
      },
    ],

    // Связанный заказ (если КП конвертировано в заказ)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },

    // Менеджер
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Индексы
commercialOfferSchema.index({ number: 1 });
commercialOfferSchema.index({ user: 1 });
commercialOfferSchema.index({ 'customer.email': 1 });
commercialOfferSchema.index({ status: 1 });
commercialOfferSchema.index({ validUntil: 1 });
commercialOfferSchema.index({ createdAt: -1 });

// Генерация номера КП перед сохранением
commercialOfferSchema.pre('save', async function (next) {
  if (this.isNew && !this.number) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Находим последнее КП за текущий месяц
    const lastOffer = await mongoose.model('CommercialOffer').findOne(
      {
        createdAt: {
          $gte: new Date(year, date.getMonth(), 1),
          $lt: new Date(year, date.getMonth() + 1, 1),
        },
      },
      { number: 1 },
      { sort: { createdAt: -1 } }
    );

    let sequence = 1;
    if (lastOffer) {
      const lastSequence = parseInt(lastOffer.number.split('-').pop(), 10);
      sequence = lastSequence + 1;
    }

    this.number = `КП-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }

  // Вычисляем итоговую сумму
  if (this.isModified('items')) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
  }

  next();
});

// Метод для отметки как отправленное
commercialOfferSchema.methods.markAsSent = async function (email) {
  this.status = 'sent';
  this.sentAt = new Date();

  this.emailHistory.push({
    sentTo: email,
    sentAt: new Date(),
    subject: `Коммерческое предложение ${this.number}`,
  });

  await this.save();
};

// Метод для отметки как просмотренное
commercialOfferSchema.methods.markAsViewed = async function () {
  if (!this.viewedAt) {
    this.viewedAt = new Date();
  }

  if (this.status === 'sent') {
    this.status = 'viewed';
  }

  await this.save();
};

// Метод для проверки истечения срока
commercialOfferSchema.methods.checkExpiration = async function () {
  if (
    this.validUntil < new Date() &&
    !['accepted', 'rejected', 'expired'].includes(this.status)
  ) {
    this.status = 'expired';
    await this.save();
    return true;
  }
  return false;
};

const CommercialOffer = mongoose.model('CommercialOffer', commercialOfferSchema);

export default CommercialOffer;
