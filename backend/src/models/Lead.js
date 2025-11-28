import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  // Основная информация
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Телефон обязателен'],
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Некорректный email'],
  },

  // Источник лида
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'social', 'referral', 'other'],
    default: 'website',
  },

  // Статус лида
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost'],
    default: 'new',
  },

  // Информация о запросе
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  message: {
    type: String,
    trim: true,
  },

  // Менеджер
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // История взаимодействий
  interactions: [{
    type: {
      type: String,
      enum: ['call', 'email', 'meeting', 'note'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],

  // Дополнительные поля
  company: {
    type: String,
    trim: true,
  },
  position: {
    type: String,
    trim: true,
  },
  budget: {
    type: Number,
    min: 0,
  },

  // Теги для категоризации
  tags: [{
    type: String,
    trim: true,
  }],

  // Приоритет
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },

  // Планируемая дата контакта
  nextContactDate: {
    type: Date,
  },

  // Результат (для закрытых лидов)
  result: {
    dealAmount: {
      type: Number,
      min: 0,
    },
    lostReason: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },

  // Флаги
  isArchived: {
    type: Boolean,
    default: false,
  },

  // UTM метки для отслеживания
  utm: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String,
  },
}, {
  timestamps: true,
});

// Индексы для оптимизации поиска
leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ assignedTo: 1, status: 1 });
leadSchema.index({ phone: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ nextContactDate: 1 });

// Виртуальные поля
leadSchema.virtual('isOverdue').get(function() {
  if (!this.nextContactDate) return false;
  return new Date() > this.nextContactDate;
});

// Методы
leadSchema.methods.addInteraction = function(interaction) {
  this.interactions.push(interaction);
  return this.save();
};

leadSchema.methods.changeStatus = function(newStatus, userId) {
  const oldStatus = this.status;
  this.status = newStatus;

  // Добавляем запись об изменении статуса
  this.interactions.push({
    type: 'note',
    description: `Статус изменен с "${oldStatus}" на "${newStatus}"`,
    user: userId,
  });

  return this.save();
};

// Статические методы
leadSchema.statics.getStats = async function(filter = {}) {
  const pipeline = [
    { $match: { isArchived: false, ...filter } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalBudget: { $sum: '$budget' },
      },
    },
  ];

  const stats = await this.aggregate(pipeline);

  // Также получаем общую статистику
  const totalLeads = await this.countDocuments({ isArchived: false, ...filter });
  const newLeads = await this.countDocuments({
    isArchived: false,
    status: 'new',
    ...filter
  });
  const wonLeads = await this.countDocuments({
    isArchived: false,
    status: 'won',
    ...filter
  });
  const totalDeals = await this.aggregate([
    { $match: { isArchived: false, status: 'won', ...filter } },
    { $group: { _id: null, total: { $sum: '$result.dealAmount' } } },
  ]);

  return {
    total: totalLeads,
    new: newLeads,
    won: wonLeads,
    totalDeals: totalDeals[0]?.total || 0,
    byStatus: stats,
  };
};

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;