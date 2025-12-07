import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ['string', 'number', 'boolean', 'json', 'array'],
      default: 'string',
    },
    group: {
      type: String,
      enum: ['general', 'contacts', 'pages', 'seo', 'integrations'],
      default: 'general',
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Статический метод для получения настройки по ключу
settingsSchema.statics.getValue = async function (key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Статический метод для установки настройки
settingsSchema.statics.setValue = async function (key, value, options = {}) {
  const { type = 'string', group = 'general', description } = options;

  return this.findOneAndUpdate(
    { key },
    { value, type, group, description },
    { upsert: true, new: true }
  );
};

// Статический метод для получения всех настроек группы
settingsSchema.statics.getByGroup = async function (group) {
  const settings = await this.find({ group });
  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {});
};

// Статический метод для получения всех настроек
settingsSchema.statics.getAll = async function () {
  const settings = await this.find();
  return settings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = {};
    }
    acc[setting.group][setting.key] = setting.value;
    return acc;
  }, {});
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
