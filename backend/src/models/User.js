import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/index.js';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: function() {
        // Email не обязателен для пользователей с Telegram авторизацией
        return !this.telegramId;
      },
      unique: true,
      sparse: true, // Позволяет null/undefined значения при unique
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Некорректный email'],
    },
    password: {
      type: String,
      required: function() {
        // Пароль не обязателен для пользователей с Telegram авторизацией
        return !this.telegramId;
      },
      minlength: [6, 'Пароль должен содержать минимум 6 символов'],
      select: false, // Не возвращать по умолчанию
    },
    firstName: {
      type: String,
      required: [true, 'Имя обязательно'],
      trim: true,
      maxlength: [50, 'Имя не может быть длиннее 50 символов'],
    },
    lastName: {
      type: String,
      required: [true, 'Фамилия обязательна'],
      trim: true,
      maxlength: [50, 'Фамилия не может быть длиннее 50 символов'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Некорректный номер телефона'],
    },
    birthDate: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', ''],
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'manager'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: null,
    },
    // Telegram авторизация
    telegramId: {
      type: String,
      unique: true,
      sparse: true, // Позволяет null значения
    },
    telegramUsername: {
      type: String,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshTokens: [
      {
        token: String,
        expires: Date,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    // Адреса доставки
    addresses: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },
        recipientName: {
          type: String,
          required: true,
          trim: true,
        },
        phone: {
          type: String,
          required: true,
          trim: true,
        },
        city: {
          type: String,
          required: true,
          trim: true,
        },
        postalCode: {
          type: String,
          required: true,
          trim: true,
        },
        street: {
          type: String,
          required: true,
          trim: true,
        },
        building: {
          type: String,
          required: true,
          trim: true,
        },
        apartment: String,
        entrance: String,
        floor: String,
        notes: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // Настройки уведомлений
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: true,
      },
      newsletter: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Индексы
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ telegramId: 1 });

// Виртуальные поля
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function (next) {
  // Хешируем пароль только если он был изменен
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(config.security.bcryptRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Метод для проверки пароля
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Ошибка при проверке пароля');
  }
};

// Метод для получения публичных данных пользователя
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    fullName: this.fullName,
    phone: this.phone,
    birthDate: this.birthDate,
    gender: this.gender,
    role: this.role,
    avatar: this.avatar,
    telegramId: this.telegramId,
    telegramUsername: this.telegramUsername,
    isEmailVerified: this.isEmailVerified,
    addresses: this.addresses,
    notifications: this.notifications,
    createdAt: this.createdAt,
  };
};

// Метод для добавления refresh token
userSchema.methods.addRefreshToken = async function (token, expires) {
  this.refreshTokens.push({ token, expires });

  // Удаляем истекшие токены
  this.refreshTokens = this.refreshTokens.filter(
    (rt) => rt.expires > new Date()
  );

  await this.save();
};

// Метод для удаления refresh token
userSchema.methods.removeRefreshToken = async function (token) {
  this.refreshTokens = this.refreshTokens.filter((rt) => rt.token !== token);
  await this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
