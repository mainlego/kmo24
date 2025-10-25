import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    // Заголовок
    title: {
      type: String,
      required: [true, 'Заголовок обязателен'],
      trim: true,
      maxlength: [200, 'Заголовок не может быть длиннее 200 символов'],
    },

    // Slug для URL
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Контент
    content: {
      type: String,
      required: [true, 'Контент обязателен'],
    },

    // Краткое описание
    excerpt: {
      type: String,
      maxlength: [500, 'Краткое описание не может быть длиннее 500 символов'],
    },

    // Изображения
    images: [
      {
        url: String,
        alt: String,
      },
    ],

    // Главное изображение (превью)
    thumbnail: {
      type: String,
    },

    // Хэштеги
    tags: [String],

    // Дата публикации в Telegram
    telegramDate: Date,

    // ID поста в Telegram
    telegramMessageId: Number,

    // Ссылка на пост в Telegram
    telegramUrl: String,

    // Тип новости
    type: {
      type: String,
      enum: ['news', 'promo', 'article', 'announcement'],
      default: 'news',
    },

    // Приоритет
    priority: {
      type: Number,
      default: 0,
    },

    // Видимость
    isPublished: {
      type: Boolean,
      default: true,
    },

    // Дата публикации на сайте
    publishedAt: {
      type: Date,
      default: Date.now,
    },

    // Статистика
    views: {
      type: Number,
      default: 0,
    },

    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Индексы
newsSchema.index({ slug: 1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ isPublished: 1 });
newsSchema.index({ tags: 1 });
newsSchema.index({ telegramMessageId: 1 });
newsSchema.index({ priority: -1 });

// Текстовый индекс для поиска
newsSchema.index({
  title: 'text',
  content: 'text',
  excerpt: 'text',
  tags: 'text',
});

// Метод для увеличения счетчика просмотров
newsSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save();
};

const News = mongoose.model('News', newsSchema);

export default News;
