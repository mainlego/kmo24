import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

async function createAdmin() {
  try {
    // Подключаемся к MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://omlineadmin:5MOHI036wc4yf3vh@kmo24.e0o4igm.mongodb.net/kmo24?retryWrites=true&w=majority&appName=kmo24';

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Данные администратора
    const adminData = {
      email: 'admin@kmo24.ru',
      password: 'admin123', // В production используйте сложный пароль!
      firstName: 'Admin',
      lastName: 'КМО24',
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
    };

    // Проверяем существует ли уже админ
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('⚠️ Admin user already exists!');

      // Обновляем пароль и роль существующего пользователя
      existingAdmin.password = await bcrypt.hash(adminData.password, 10);
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      existingAdmin.isEmailVerified = true;
      await existingAdmin.save();

      console.log('✅ Admin password and role updated!');
    } else {
      // Хэшируем пароль
      adminData.password = await bcrypt.hash(adminData.password, 10);

      // Создаем админа
      const admin = await User.create(adminData);
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📧 Admin credentials:');
    console.log('Email: admin@kmo24.ru');
    console.log('Password: admin123');
    console.log('\n⚠️ ВАЖНО: Смените пароль после первого входа!');

    // Показываем статистику
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    console.log(`\n📊 Statistics:`);
    console.log(`Total users: ${totalUsers}`);
    console.log(`Total admins: ${totalAdmins}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Отключаемся от MongoDB
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

// Запускаем скрипт
createAdmin();