import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import logger from '../utils/logger.js';

dotenv.config();

// Подключение к MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onlineshop');
    logger.info('MongoDB connected for seeding');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Данные категорий
const categories = [
  { name: 'Тепловое оборудование', slug: 'teplovoe', level: 1, sortOrder: 1, isActive: true },
  { name: 'Хлебопекарное оборудование', slug: 'hlebopekarnoe', level: 1, sortOrder: 2, isActive: true },
  { name: 'Мясопереработка', slug: 'myasopererabotka', level: 1, sortOrder: 3, isActive: true },
  { name: 'Холодильное оборудование', slug: 'holodilnoe', level: 1, sortOrder: 4, isActive: true },
  { name: 'Посудомоечное оборудование', slug: 'posudomoechnoe', level: 1, sortOrder: 5, isActive: true },
  { name: 'Нейтральное оборудование', slug: 'neitralnoe', level: 1, sortOrder: 6, isActive: true },
  { name: 'Оборудование для фаст-фуда', slug: 'fast-food', level: 1, sortOrder: 7, isActive: true },
];

// Функция для создания товаров
const seedData = async () => {
  try {
    // Очистка существующих данных
    logger.info('Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Создание категорий
    logger.info('Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    logger.info(`Created ${createdCategories.length} categories`);

    // Маппинг категорий для удобства
    const catMap = {
      thermal: createdCategories[0]._id,
      bakery: createdCategories[1]._id,
      meat: createdCategories[2]._id,
      refrigeration: createdCategories[3]._id,
      dishwashing: createdCategories[4]._id,
      neutral: createdCategories[5]._id,
      fastfood: createdCategories[6]._id,
    };

    // Данные товаров
    const products = [
      {
        name: 'Печь конвекционная Unox XBC 805E',
        slug: 'pech-konvekcionnaya-unox-xbc-805e',
        sku: 'UNOX-XBC-805E',
        description: {
          short: 'Профессиональная конвекционная печь для хлебопекарни',
          full: 'Конвекционная печь Unox XBC 805E - это профессиональное решение для хлебопекарни. Равномерная конвекция, точный контроль температуры и надежная конструкция. Б/у оборудование в отличном состоянии.',
        },
        category: catMap.bakery,
        price: 289000,
        oldPrice: 350000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop', alt: 'Печь конвекционная Unox XBC 805E', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=600&fit=crop', alt: 'Печь конвекционная Unox XBC 805E внутри', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'Unox', group: 'Общие' },
          { name: 'Модель', value: 'XBC 805E', group: 'Общие' },
          { name: 'Тип', value: 'Конвекционная печь', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Количество уровней', value: '8', group: 'Характеристики' },
          { name: 'Размер противней', value: '600x400 мм', group: 'Характеристики' },
        ],
        dimensions: { length: 120, width: 80, height: 180, weight: 150 },
        isFeatured: true,
        isNew: false,
        isActive: true,
      },
      {
        name: 'Шкаф шоковой заморозки Abat ШОК-20-1/1',
        slug: 'shkaf-shokovoy-zamorozki-abat-shok-20',
        sku: 'ABAT-SHOK-20',
        description: {
          short: 'Шкаф шоковой заморозки для быстрого охлаждения продуктов',
          full: 'Профессиональный шкаф шоковой заморозки Abat ШОК-20-1/1 позволяет быстро охлаждать и замораживать продукты, сохраняя их качество и свежесть. Идеально подходит для ресторанов и кондитерских.',
        },
        category: catMap.refrigeration,
        price: 400000,
        oldPrice: 480000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=600&fit=crop', alt: 'Шкаф шоковой заморозки Abat', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&h=600&fit=crop', alt: 'Шкаф шоковой заморозки Abat открытый', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'Abat', group: 'Общие' },
          { name: 'Модель', value: 'ШОК-20-1/1', group: 'Общие' },
          { name: 'Тип', value: 'Шкаф шоковой заморозки', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Вместимость', value: '20 кг', group: 'Характеристики' },
          { name: 'Размер противней', value: 'GN 1/1', group: 'Характеристики' },
        ],
        dimensions: { length: 75, width: 80, height: 200, weight: 120 },
        isFeatured: true,
        isNew: false,
        isActive: true,
      },
      {
        name: 'Тестоделитель Восход ТД-4',
        slug: 'testodelitel-voshod-td-4',
        sku: 'VOSHOD-TD-4',
        description: {
          short: 'Автоматический тестоделитель для хлебопекарни',
          full: 'Профессиональный тестоделитель Восход ТД-4 предназначен для автоматического деления теста на равные порции. Высокая производительность и точность деления. Незаменимое оборудование для промышленных хлебопекарен.',
        },
        category: catMap.bakery,
        price: 900000,
        oldPrice: 1100000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=600&h=600&fit=crop', alt: 'Тестоделитель Восход ТД-4', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&h=600&fit=crop', alt: 'Тестоделитель в работе', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'Восход', group: 'Общие' },
          { name: 'Модель', value: 'ТД-4', group: 'Общие' },
          { name: 'Тип', value: 'Тестоделитель', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Производительность', value: 'до 1500 шт/час', group: 'Характеристики' },
          { name: 'Количество делений', value: '4', group: 'Характеристики' },
        ],
        dimensions: { length: 200, width: 100, height: 150, weight: 350 },
        isFeatured: true,
        isNew: false,
        isActive: true,
      },
      {
        name: 'Куттер Л5-ФКМ-125',
        slug: 'kutter-l5-fkm-125',
        sku: 'L5-FKM-125',
        description: {
          short: 'Профессиональный куттер для мясопереработки',
          full: 'Куттер Л5-ФКМ-125 предназначен для тонкого измельчения и перемешивания мясного фарша. Высокая производительность, надежная конструкция. Идеально подходит для колбасного производства.',
        },
        category: catMap.meat,
        price: 499000,
        oldPrice: 600000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=600&fit=crop', alt: 'Куттер Л5-ФКМ-125', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=600&fit=crop', alt: 'Куттер детально', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Модель', value: 'Л5-ФКМ-125', group: 'Общие' },
          { name: 'Тип', value: 'Куттер', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Объем чаши', value: '125 л', group: 'Характеристики' },
          { name: 'Производительность', value: 'до 1500 кг/час', group: 'Характеристики' },
        ],
        dimensions: { length: 180, width: 120, height: 140, weight: 450 },
        isFeatured: false,
        isNew: false,
        isActive: true,
      },
      {
        name: 'Фритюрница напольная IZO FR-16/FR-24',
        slug: 'frityurnica-napolnaya-izo-fr-16',
        sku: 'IZO-FR-16-24',
        description: {
          short: 'Профессиональная фритюрница для пончиков и берлинеров',
          full: 'Специализированная фритюрница IZO FR-16/FR-24 для приготовления берлинеров (пончиков с начинкой). Равномерный прогрев масла, высокая производительность. Идеально для пекарен и кондитерских.',
        },
        category: catMap.fastfood,
        price: 150000,
        oldPrice: 185000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop', alt: 'Фритюрница IZO', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&h=600&fit=crop', alt: 'Фритюрница в работе', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'IZO', group: 'Общие' },
          { name: 'Модель', value: 'FR-16/FR-24', group: 'Общие' },
          { name: 'Тип', value: 'Фритюрница напольная', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Назначение', value: 'Для пончиков', group: 'Характеристики' },
          { name: 'Объем', value: '16-24 л', group: 'Характеристики' },
        ],
        dimensions: { length: 80, width: 70, height: 100, weight: 65 },
        isFeatured: true,
        isNew: false,
        isActive: true,
      },
      {
        name: 'Пила электрическая Koneteollisuus KT 210',
        slug: 'pila-elektricheskaya-kt-210',
        sku: 'KT-210',
        description: {
          short: 'Профессиональная пила для мяса',
          full: 'Электрическая пила для мяса Koneteollisuus KT 210 финского производства. Высокая мощность, точный распил, надежная конструкция. Идеально для мясных цехов и мясоперерабатывающих производств.',
        },
        category: catMap.meat,
        price: 140000,
        oldPrice: 170000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1588348818534-a8e0c4c92da3?w=600&h=600&fit=crop', alt: 'Пила для мяса KT 210', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop', alt: 'Пила для мяса в работе', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'Koneteollisuus (KT)', group: 'Общие' },
          { name: 'Модель', value: 'KT 210', group: 'Общие' },
          { name: 'Тип', value: 'Пила для мяса', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Страна производства', value: 'Финляндия', group: 'Общие' },
          { name: 'Длина полотна', value: '210 мм', group: 'Характеристики' },
        ],
        dimensions: { length: 90, width: 60, height: 120, weight: 85 },
        isFeatured: true,
        isNew: false,
        isActive: true,
      },
      {
        name: 'Шкаф расстоечный Bongard BFC 1115×800',
        slug: 'shkaf-rastoechnyy-bongard-bfc',
        sku: 'BONGARD-BFC-1115',
        description: {
          short: 'Профессиональный расстоечный шкаф для теста',
          full: 'Расстоечный шкаф Bongard BFC 1115×800 2CE 2CH 2PF французского производства. Точный контроль температуры и влажности для идеальной расстойки теста. Высокое качество и надежность.',
        },
        category: catMap.bakery,
        price: 320000,
        oldPrice: 390000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&h=600&fit=crop', alt: 'Шкаф расстоечный Bongard', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=600&fit=crop', alt: 'Шкаф расстоечный открытый', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'Bongard', group: 'Общие' },
          { name: 'Модель', value: 'BFC 1115×800 2CE 2CH 2PF', group: 'Общие' },
          { name: 'Тип', value: 'Шкаф расстоечный', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Размеры', value: '1115×800 мм', group: 'Характеристики' },
          { name: 'Страна производства', value: 'Франция', group: 'Общие' },
        ],
        dimensions: { length: 80, width: 111.5, height: 200, weight: 180 },
        isFeatured: false,
        isNew: false,
        isActive: true,
      },
      {
        name: 'Сковорода электрическая Kogast EKP-T7/40SL',
        slug: 'skovoroda-elektricheskaya-kogast',
        sku: 'KOGAST-EKP-T7-40SL',
        description: {
          short: 'Профессиональная электрическая сковорода',
          full: 'Электрическая сковорода Kogast EKP-T7/40SL с наклоняющейся чашей. Идеально подходит для приготовления больших объемов блюд. Нержавеющая сталь, равномерный нагрев.',
        },
        category: catMap.thermal,
        price: 49000,
        oldPrice: 62000,
        stock: { quantity: 2, reserved: 0, available: 2 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&h=600&fit=crop', alt: 'Сковорода Kogast', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=600&fit=crop', alt: 'Сковорода в работе', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'Kogast', group: 'Общие' },
          { name: 'Модель', value: 'EKP-T7/40SL', group: 'Общие' },
          { name: 'Тип', value: 'Сковорода электрическая', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Материал', value: 'Нержавеющая сталь', group: 'Характеристики' },
          { name: 'Объем', value: '40 л', group: 'Характеристики' },
        ],
        dimensions: { length: 80, width: 90, height: 50, weight: 50 },
        isFeatured: false,
        isNew: true,
        isActive: true,
      },
      {
        name: 'Плита электрическая Atesy ЭПШЧ-9-6-24-05',
        slug: 'plita-elektricheskaya-atesy',
        sku: 'ATESY-EPSHCH-9-6-24-05',
        description: {
          short: '6-конфорочная электрическая плита для кухни',
          full: 'Профессиональная 6-конфорочная электрическая плита Atesy ЭПШЧ-9-6-24-05. Мощные конфорки, надежная конструкция, простота в обслуживании. Идеально для ресторанов и столовых.',
        },
        category: catMap.thermal,
        price: 79000,
        oldPrice: 95000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&h=600&fit=crop', alt: 'Плита Atesy', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=600&fit=crop', alt: 'Плита сверху', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'Atesy', group: 'Общие' },
          { name: 'Модель', value: 'ЭПШЧ-9-6-24-05', group: 'Общие' },
          { name: 'Тип', value: 'Плита электрическая', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Количество конфорок', value: '6', group: 'Характеристики' },
          { name: 'Материал', value: 'Нержавеющая сталь', group: 'Характеристики' },
        ],
        dimensions: { length: 120, width: 80, height: 90, weight: 110 },
        isFeatured: false,
        isNew: true,
        isActive: true,
      },
      {
        name: 'Печь для пиццы OEM DM4.30M-1',
        slug: 'pech-dlya-pizzy-oem-dm4',
        sku: 'OEM-DM4-30M-1',
        description: {
          short: 'Профессиональная печь для пиццы',
          full: 'Электрическая печь для пиццы OEM DM4.30M-1. Равномерный прогрев, каменный под, идеальный результат. Компактные размеры при высокой производительности.',
        },
        category: catMap.thermal,
        price: 65000,
        oldPrice: 78000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop', alt: 'Печь для пиццы OEM', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop', alt: 'Печь для пиццы открытая', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'OEM', group: 'Общие' },
          { name: 'Модель', value: 'DM4.30M-1', group: 'Общие' },
          { name: 'Тип', value: 'Печь для пиццы', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Количество ярусов', value: '1', group: 'Характеристики' },
          { name: 'Диаметр пиццы', value: 'до 30 см', group: 'Характеристики' },
        ],
        dimensions: { length: 105, width: 90, height: 75, weight: 80 },
        isFeatured: false,
        isNew: true,
        isActive: true,
      },
      {
        name: 'Миксер планетарный Sinmag SM-201',
        slug: 'mikser-planetarnyy-sinmag',
        sku: 'SINMAG-SM-201',
        description: {
          short: 'Профессиональный планетарный миксер для теста',
          full: 'Планетарный миксер Sinmag SM-201 для замеса теста и взбивания кремов. Три насадки в комплекте, надежный двигатель, простое управление. Идеально для кондитерских и пекарен.',
        },
        category: catMap.bakery,
        price: 109000,
        oldPrice: 135000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=600&fit=crop', alt: 'Миксер Sinmag', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&h=600&fit=crop', alt: 'Миксер в работе', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'Sinmag', group: 'Общие' },
          { name: 'Модель', value: 'SM-201', group: 'Общие' },
          { name: 'Тип', value: 'Миксер планетарный', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Объем чаши', value: '20 л', group: 'Характеристики' },
          { name: 'Количество насадок', value: '3', group: 'Характеристики' },
        ],
        dimensions: { length: 50, width: 60, height: 90, weight: 75 },
        isFeatured: false,
        isNew: false,
        isActive: true,
      },
      {
        name: 'Посудомоечная машина Elettrobar Niagara 2150',
        slug: 'posudomoechnaya-mashina-elettrobar',
        sku: 'ELETTROBAR-NIAGARA-2150',
        description: {
          short: 'Тоннельная посудомоечная машина для больших объемов',
          full: 'Профессиональная тоннельная посудомоечная машина Elettrobar Niagara 2150 GL280EBDY. Высокая производительность, экономичный расход воды и электроэнергии. Идеально для крупных ресторанов и отелей.',
        },
        category: catMap.dishwashing,
        price: 389000,
        oldPrice: 480000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&h=600&fit=crop', alt: 'Посудомоечная машина Elettrobar', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=600&fit=crop', alt: 'Посудомоечная машина внутри', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'Elettrobar', group: 'Общие' },
          { name: 'Модель', value: 'Niagara 2150 GL280EBDY', group: 'Общие' },
          { name: 'Тип', value: 'Посудомоечная машина тоннельная', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Производительность', value: 'до 2150 тарелок/час', group: 'Характеристики' },
          { name: 'Страна производства', value: 'Италия', group: 'Общие' },
        ],
        dimensions: { length: 450, width: 100, height: 200, weight: 800 },
        isFeatured: false,
        isNew: false,
        isActive: true,
      },
      {
        name: 'Мясорубка МИМ-600',
        slug: 'myasorubka-mim-600',
        sku: 'MIM-600',
        description: {
          short: 'Профессиональная мясорубка для производства',
          full: 'Мясорубка МИМ-600 для мясопереработки. Высокая производительность, надежный двигатель, простота в обслуживании. Идеально для мясных цехов и колбасных производств.',
        },
        category: catMap.meat,
        price: 55000,
        oldPrice: 68000,
        stock: { quantity: 2, reserved: 0, available: 2 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=600&fit=crop', alt: 'Мясорубка МИМ-600', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=600&fit=crop', alt: 'Мясорубка детально', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'МИМ', group: 'Общие' },
          { name: 'Модель', value: '600', group: 'Общие' },
          { name: 'Тип', value: 'Мясорубка', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Производительность', value: 'до 600 кг/час', group: 'Характеристики' },
          { name: 'Материал', value: 'Нержавеющая сталь', group: 'Характеристики' },
        ],
        dimensions: { length: 70, width: 40, height: 90, weight: 95 },
        isFeatured: false,
        isNew: true,
        isActive: true,
      },
      {
        name: 'Стол тепловой HICOLD TS T 12 GN',
        slug: 'stol-teplovoy-hicold',
        sku: 'HICOLD-TS-T-12-GN',
        description: {
          short: 'Тепловой стол для поддержания температуры блюд',
          full: 'Тепловой стол HICOLD TS T 12 GN из нержавеющей стали для поддержания температуры готовых блюд. Равномерный прогрев, простое управление. Идеально для линий раздачи.',
        },
        category: catMap.thermal,
        price: 15000,
        oldPrice: 19000,
        stock: { quantity: 3, reserved: 0, available: 3 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&h=600&fit=crop', alt: 'Стол тепловой HICOLD', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=600&fit=crop', alt: 'Стол тепловой сверху', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'HICOLD', group: 'Общие' },
          { name: 'Модель', value: 'TS T 12 GN', group: 'Общие' },
          { name: 'Тип', value: 'Стол тепловой', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Материал', value: 'Нержавеющая сталь', group: 'Характеристики' },
          { name: 'Размер емкостей', value: 'GN 1/2', group: 'Характеристики' },
        ],
        dimensions: { length: 120, width: 70, height: 85, weight: 45 },
        isFeatured: false,
        isNew: true,
        isActive: true,
      },
      {
        name: 'Камера холодного копчения Ижица-1200М4',
        slug: 'kamera-holodnogo-kopcheniya-ijitsa',
        sku: 'IJITSA-1200M4',
        description: {
          short: 'Профессиональная камера для холодного копчения',
          full: 'Камера холодного копчения Ижица-1200М4 для производства копченых мясных и рыбных деликатесов. Точный контроль температуры и дымообразования, равномерная обработка продукта.',
        },
        category: catMap.meat,
        price: 300000,
        oldPrice: 360000,
        stock: { quantity: 1, reserved: 0, available: 1 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop', alt: 'Камера копчения Ижица', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=600&fit=crop', alt: 'Камера копчения внутри', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Бренд', value: 'Ижица', group: 'Общие' },
          { name: 'Модель', value: '1200М4', group: 'Общие' },
          { name: 'Тип', value: 'Камера холодного копчения', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Вместимость', value: '1200 кг', group: 'Характеристики' },
          { name: 'Материал', value: 'Нержавеющая сталь', group: 'Характеристики' },
        ],
        dimensions: { length: 200, width: 180, height: 250, weight: 600 },
        isFeatured: false,
        isNew: false,
        isActive: true,
      },
      {
        name: 'Стол-тумба с баком для мусора',
        slug: 'stol-tumba-s-bakom',
        sku: 'STOL-TUMBA-600',
        description: {
          short: 'Стол-тумба из нержавейки с встроенным мусорным баком',
          full: 'Стол-тумба из нержавеющей стали размером 600×600×850 мм со встроенным баком для мусора. Удобное и гигиеничное решение для кухонь. Прочная конструкция, легкая уборка.',
        },
        category: catMap.neutral,
        price: 12000,
        oldPrice: 15000,
        stock: { quantity: 5, reserved: 0, available: 5 },
        status: 'available',
        images: [
          { url: 'https://images.unsplash.com/photo-1595428773965-fc5d6c8aa7ff?w=600&h=600&fit=crop', alt: 'Стол-тумба с баком', isPrimary: true, sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&h=600&fit=crop', alt: 'Стол-тумба детально', isPrimary: false, sortOrder: 2 },
        ],
        specifications: [
          { name: 'Тип', value: 'Стол-тумба', group: 'Общие' },
          { name: 'Состояние', value: 'Б/у', group: 'Общие' },
          { name: 'Материал', value: 'Нержавеющая сталь', group: 'Характеристики' },
          { name: 'Размеры', value: '600×600×850 мм', group: 'Характеристики' },
          { name: 'Особенность', value: 'Со встроенным баком для мусора', group: 'Характеристики' },
        ],
        dimensions: { length: 60, width: 60, height: 85, weight: 30 },
        isFeatured: false,
        isNew: true,
        isActive: true,
      },
    ];

    // Создание товаров
    logger.info('Creating products...');
    const createdProducts = await Product.insertMany(products);
    logger.info(`Created ${createdProducts.length} products`);

    logger.info('✅ Seed completed successfully!');
    logger.info(`Total categories: ${createdCategories.length}`);
    logger.info(`Total products: ${createdProducts.length}`);
  } catch (error) {
    logger.error('Seed error:', error);
    throw error;
  }
};

// Запуск скрипта
const run = async () => {
  try {
    await connectDB();
    await seedData();
    logger.info('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    logger.info('✅ All done!');
    process.exit(0);
  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
};

run();
