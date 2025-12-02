import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

// Загружаем переменные окружения
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

// Модель пользователя
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'manager', 'admin'],
    default: 'customer',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

// Функция для запроса данных у пользователя
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Валидация email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Валидация пароля (минимум 8 символов)
function isValidPassword(password) {
  return password && password.length >= 8;
}

async function createAdmin() {
  try {
    // Проверяем наличие MONGODB_URI
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('❌ Ошибка: MONGODB_URI не задан в .env файле');
      process.exit(1);
    }

    // Получаем данные из переменных окружения или запрашиваем у пользователя
    let adminEmail = process.env.ADMIN_EMAIL;
    let adminPassword = process.env.ADMIN_PASSWORD;
    let adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
    let adminLastName = process.env.ADMIN_LAST_NAME || 'КМО24';

    // Если данные не заданы в env, запрашиваем интерактивно
    if (!adminEmail || !adminPassword) {
      console.log('\n📧 Создание администратора');
      console.log('─'.repeat(40));

      if (!adminEmail) {
        adminEmail = await prompt('Email администратора: ');
        if (!isValidEmail(adminEmail)) {
          console.error('❌ Некорректный email');
          process.exit(1);
        }
      }

      if (!adminPassword) {
        adminPassword = await prompt('Пароль (мин. 8 символов): ');
        if (!isValidPassword(adminPassword)) {
          console.error('❌ Пароль должен содержать минимум 8 символов');
          process.exit(1);
        }
      }
    }

    console.log('\n🔄 Подключение к MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Подключено к MongoDB');

    // Данные администратора
    const adminData = {
      email: adminEmail.toLowerCase().trim(),
      password: adminPassword,
      firstName: adminFirstName,
      lastName: adminLastName,
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
    };

    // Проверяем существует ли уже админ
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('⚠️  Пользователь с таким email уже существует');

      // Обновляем пароль и роль существующего пользователя
      existingAdmin.password = await bcrypt.hash(adminData.password, 10);
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      existingAdmin.isEmailVerified = true;
      await existingAdmin.save();

      console.log('✅ Пароль и роль администратора обновлены');
    } else {
      // Хэшируем пароль
      adminData.password = await bcrypt.hash(adminData.password, 10);

      // Создаем админа
      await User.create(adminData);
      console.log('✅ Администратор создан успешно');
    }

    console.log(`\n📧 Email: ${adminData.email}`);
    console.log('🔐 Пароль: [скрыт]');

    // Показываем статистику
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    console.log(`\n📊 Статистика:`);
    console.log(`   Всего пользователей: ${totalUsers}`);
    console.log(`   Администраторов: ${totalAdmins}`);

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  } finally {
    // Отключаемся от MongoDB
    await mongoose.disconnect();
    console.log('\n✅ Отключено от MongoDB');
    process.exit(0);
  }
}

// Запускаем скрипт
createAdmin();
