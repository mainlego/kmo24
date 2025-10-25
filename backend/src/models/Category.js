import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Название категории обязательно'],
      trim: true,
      maxlength: [100, 'Название не может быть длиннее 100 символов'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Описание не может быть длиннее 500 символов'],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // SEO поля
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    // ID из 1С
    externalId: {
      type: String,
      sparse: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Индексы
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ externalId: 1 });
categorySchema.index({ sortOrder: 1 });

// Виртуальное поле для подкатегорий
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

// Виртуальное поле для товаров
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
});

// Метод для получения полного пути категории
categorySchema.methods.getPath = async function () {
  const path = [this];
  let current = this;

  while (current.parent) {
    current = await mongoose.model('Category').findById(current.parent);
    if (current) {
      path.unshift(current);
    } else {
      break;
    }
  }

  return path;
};

// Метод для получения всех потомков
categorySchema.methods.getDescendants = async function () {
  const descendants = [];

  const findChildren = async (categoryId) => {
    const children = await mongoose.model('Category').find({ parent: categoryId });

    for (const child of children) {
      descendants.push(child);
      await findChildren(child._id);
    }
  };

  await findChildren(this._id);
  return descendants;
};

// Перед удалением проверяем наличие потомков
categorySchema.pre('remove', async function (next) {
  const childrenCount = await mongoose.model('Category').countDocuments({
    parent: this._id,
  });

  if (childrenCount > 0) {
    throw new Error('Невозможно удалить категорию с подкатегориями');
  }

  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
