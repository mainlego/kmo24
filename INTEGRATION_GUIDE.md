# 🔌 Руководство по интеграации Frontend с Backend API

## 📚 Содержание

1. [Быстрый старт](#быстрый-старт)
2. [Доступные Composables](#доступные-composables)
3. [Примеры интеграции](#примеры-интеграции)
4. [Middleware](#middleware)
5. [Типы данных](#типы-данных)

---

## 🚀 Быстрый старт

### 1. Установка зависимостей

Все composables уже готовы к использованию. Не требуется дополнительная установка.

### 2. Автоматическая авторизация

Plugin `/plugins/auth.client.ts` автоматически восстанавливает сессию пользователя при загрузке приложения.

### 3. Использование в компонентах

```vue
<script setup lang="ts">
// Импорт composable
const { getProducts, deleteProduct } = useProducts();
const { success, error } = useToast();

// Загрузка данных
const { data, pending, error: loadError } = await useLazyAsyncData(
  'products',
  () => getProducts({ page: 1, limit: 10 })
);

// Или использование ref
const products = ref([]);
const loading = ref(false);

const loadProducts = async () => {
  loading.value = true;
  try {
    const response = await getProducts({ page: 1, limit: 10 });
    products.value = response.data;
  } catch (err) {
    error('Ошибка при загрузке товаров');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});
</script>
```

---

## 📦 Доступные Composables

### 1. `useAuth()` - Аутентификация

```typescript
const {
  user,              // computed<User | null> - текущий пользователь
  isAuthenticated,   // computed<boolean> - авторизован ли
  isAdmin,          // computed<boolean> - админ или менеджер
  login,            // (credentials) => Promise - вход
  register,         // (data) => Promise - регистрация
  logout,           // () => Promise - выход
  fetchCurrentUser, // () => Promise<User> - получить текущего
  updateProfile,    // (updates) => Promise - обновить профиль
  changePassword,   // (old, new) => Promise - изменить пароль
} = useAuth();
```

**Пример:**

```typescript
// Вход
await login({
  email: 'user@example.com',
  password: 'password123',
});

// Проверка роли
if (isAdmin.value) {
  console.log('Пользователь - администратор');
}

// Получение текущего пользователя
const currentUser = user.value;
console.log(currentUser.firstName, currentUser.email);
```

### 2. `useProducts()` - Товары

```typescript
const {
  getProducts,           // (filters) => Promise<ProductsResponse>
  getProductById,        // (id) => Promise<Product>
  getProductBySlug,      // (slug) => Promise<Product>
  createProduct,         // (data) => Promise<Product>
  updateProduct,         // (id, data) => Promise<Product>
  deleteProduct,         // (id) => Promise<void>
  bulkUpdateProducts,    // (ids, updates) => Promise<void>
  bulkDeleteProducts,    // (ids) => Promise<void>
  uploadProductImages,   // (id, files) => Promise<Product>
  deleteProductImage,    // (id, imageUrl) => Promise<Product>
  getProductStats,       // () => Promise<Stats>
} = useProducts();
```

**Фильтры для getProducts:**

```typescript
interface ProductFilters {
  search?: string;        // Поиск по названию/артикулу
  category?: string;      // ID категории
  status?: string;        // available | out_of_stock | on_order | discontinued
  isActive?: boolean;     // Активен ли товар
  isFeatured?: boolean;   // Рекомендуемый
  isNew?: boolean;        // Новинка
  minPrice?: number;      // Мин. цена
  maxPrice?: number;      // Макс. цена
  page?: number;          // Страница (default: 1)
  limit?: number;         // Кол-во на странице (default: 10)
  sort?: string;          // Сортировка (price, -price, name, createdAt)
}
```

**Примеры:**

```typescript
// Получить все товары
const response = await getProducts({ page: 1, limit: 20 });
console.log(response.data); // Product[]
console.log(response.pagination.total); // Общее кол-во

// Фильтрация
const filtered = await getProducts({
  category: '507f1f77bcf86cd799439011',
  status: 'available',
  minPrice: 1000,
  maxPrice: 50000,
  sort: '-price', // От дорогих к дешевым
});

// Поиск
const searched = await getProducts({
  search: 'фрезерный станок',
});

// Получить товар по slug
const product = await getProductBySlug('frezernyy-stanok-haas-vf-2');

// Создать товар
const newProduct = await createProduct({
  name: 'Новый товар',
  sku: 'SKU-001',
  price: 10000,
  category: '507f1f77bcf86cd799439011',
  description: {
    short: 'Краткое описание',
    full: 'Полное описание товара',
  },
  stock: {
    quantity: 10,
  },
});

// Обновить товар
await updateProduct(product._id, {
  price: 12000,
  stock: { quantity: 15 },
});

// Удалить товар
await deleteProduct(product._id);

// Массовое обновление
await bulkUpdateProducts(
  ['id1', 'id2', 'id3'],
  { isActive: false }
);

// Загрузить изображения
const files = [file1, file2]; // File[]
await uploadProductImages(product._id, files);

// Статистика
const stats = await getProductStats();
console.log(stats.total, stats.active, stats.outOfStock);
```

### 3. `useOrders()` - Заказы

```typescript
const {
  getOrders,           // (filters) => Promise<OrdersResponse>
  getOrderById,        // (id) => Promise<Order>
  createOrder,         // (data) => Promise<Order>
  updateOrder,         // (id, data) => Promise<Order>
  updateOrderStatus,   // (id, status, comment?) => Promise<Order>
  cancelOrder,         // (id, comment?) => Promise<Order>
  confirmPayment,      // (id, transactionId?) => Promise<Order>
  getOrderStats,       // () => Promise<Stats>
  getMyOrders,         // (filters) => Promise<OrdersResponse>
} = useOrders();
```

**Примеры:**

```typescript
// Получить все заказы (admin)
const orders = await getOrders({
  status: 'pending',
  page: 1,
  limit: 20,
});

// Получить мои заказы (user)
const myOrders = await getMyOrders();

// Создать заказ
const order = await createOrder({
  customer: {
    firstName: 'Иван',
    lastName: 'Иванов',
    email: 'ivan@example.com',
    phone: '+79991234567',
  },
  items: [
    {
      product: '507f1f77bcf86cd799439011',
      quantity: 2,
      price: 10000,
      total: 20000,
    },
  ],
  shippingAddress: {
    city: 'Москва',
    street: 'Ленина',
    building: '10',
  },
  shipping: {
    method: 'dellin',
    cost: 1000,
  },
  payment: {
    method: 'online',
  },
  pricing: {
    subtotal: 20000,
    discount: 0,
    shipping: 1000,
    total: 21000,
  },
});

// Обновить статус
await updateOrderStatus(order._id, 'confirmed', 'Заказ подтвержден');

// Подтвердить оплату
await confirmPayment(order._id, 'TRANS-123456');

// Отменить заказ
await cancelOrder(order._id, 'По просьбе клиента');

// Статистика
const stats = await getOrderStats();
console.log(stats.total, stats.pending, stats.totalRevenue);
```

### 4. `useCart()` - Корзина

```typescript
const {
  getCart,            // () => Promise<Cart>
  addToCart,          // (productId, quantity, variant?) => Promise<Cart>
  updateCartItem,     // (itemId, quantity) => Promise<Cart>
  removeFromCart,     // (itemId) => Promise<Cart>
  clearCart,          // () => Promise<Cart>
  applyPromoCode,     // (code) => Promise<Cart>
  removePromoCode,    // () => Promise<Cart>
  mergeCart,          // () => Promise<Cart> - автоматически вызывается после login
} = useCart();
```

**Примеры:**

```typescript
// Получить корзину
const cart = await getCart();
console.log(cart.items, cart.totals.total);

// Добавить товар
await addToCart('507f1f77bcf86cd799439011', 2);

// С вариантом
await addToCart('507f1f77bcf86cd799439011', 1, {
  name: 'Размер',
  value: 'XL',
});

// Обновить количество
await updateCartItem(cart.items[0]._id, 5);

// Удалить товар
await removeFromCart(cart.items[0]._id);

// Применить промокод
await applyPromoCode('SALE2024');

// Удалить промокод
await removePromoCode();

// Очистить корзину
await clearCart();
```

### 5. `useCategories()` - Категории

```typescript
const {
  getCategories,       // (includeInactive?) => Promise<Category[]>
  getCategoryById,     // (id) => Promise<Category>
  getCategoryBySlug,   // (slug) => Promise<Category>
  createCategory,      // (data) => Promise<Category>
  updateCategory,      // (id, data) => Promise<Category>
  deleteCategory,      // (id) => Promise<void>
} = useCategories();
```

**Примеры:**

```typescript
// Получить все активные категории
const categories = await getCategories();

// Получить все категории (включая неактивные)
const allCategories = await getCategories(true);

// Создать категорию
const category = await createCategory({
  name: 'ЧПУ станки',
  slug: 'cnc-machines',
  description: 'Станки с числовым программным управлением',
  sortOrder: 1,
  isActive: true,
});

// Обновить категорию
await updateCategory(category._id, {
  name: 'ЧПУ оборудование',
});
```

### 6. `useUsers()` - Пользователи (Admin)

```typescript
const {
  getUsers,          // (filters) => Promise<UsersResponse>
  getUserById,       // (id) => Promise<User>
  createUser,        // (data) => Promise<User>
  updateUser,        // (id, data) => Promise<User>
  deleteUser,        // (id) => Promise<void>
  getUserStats,      // () => Promise<Stats>
} = useUsers();
```

**Примеры:**

```typescript
// Получить всех пользователей
const users = await getUsers({ page: 1, limit: 20 });

// Фильтр по роли
const admins = await getUsers({ role: 'admin' });

// Создать пользователя
const user = await createUser({
  email: 'new@example.com',
  password: 'password123',
  firstName: 'Иван',
  lastName: 'Иванов',
  role: 'manager',
});

// Обновить пользователя
await updateUser(user._id, {
  role: 'admin',
  isActive: true,
});

// Статистика
const stats = await getUserStats();
console.log(stats.total, stats.admins, stats.active);
```

### 7. `useReviews()` - Отзывы

```typescript
const {
  getReviews,         // (filters) => Promise<ReviewsResponse>
  getReviewById,      // (id) => Promise<Review>
  createReview,       // (data) => Promise<Review>
  updateReview,       // (id, data) => Promise<Review>
  deleteReview,       // (id) => Promise<void>
  approveReview,      // (id) => Promise<Review>
  rejectReview,       // (id) => Promise<Review>
  addAdminReply,      // (id, text) => Promise<Review>
  markHelpful,        // (id) => Promise<Review>
  markUnhelpful,      // (id) => Promise<Review>
} = useReviews();
```

**Примеры:**

```typescript
// Получить отзывы для товара
const reviews = await getReviews({
  product: '507f1f77bcf86cd799439011',
  isApproved: true,
});

// Создать отзыв
const review = await createReview({
  product: '507f1f77bcf86cd799439011',
  rating: 5,
  title: 'Отличный товар!',
  comment: 'Очень доволен покупкой',
  pros: 'Качество, цена',
  cons: 'Долгая доставка',
});

// Одобрить отзыв (admin)
await approveReview(review._id);

// Добавить ответ администратора
await addAdminReply(review._id, 'Спасибо за отзыв!');

// Пометить как полезный
await markHelpful(review._id);
```

### 8. `useNews()` - Новости

```typescript
const {
  getNews,            // (filters) => Promise<NewsResponse>
  getNewsById,        // (id) => Promise<NewsArticle>
  getNewsBySlug,      // (slug) => Promise<NewsArticle>
  createNews,         // (data) => Promise<NewsArticle>
  updateNews,         // (id, data) => Promise<NewsArticle>
  deleteNews,         // (id) => Promise<void>
  publishNews,        // (id) => Promise<NewsArticle>
  unpublishNews,      // (id) => Promise<NewsArticle>
} = useNews();
```

**Примеры:**

```typescript
// Получить опубликованные новости
const news = await getNews({
  isPublished: true,
  page: 1,
  limit: 10,
});

// Создать новость
const article = await createNews({
  title: 'Новое поступление',
  slug: 'novoe-postuplenie',
  excerpt: 'Краткое описание',
  content: 'Полный текст новости',
  tags: ['новости', 'поступления'],
});

// Опубликовать
await publishNews(article._id);
```

---

## 🛡️ Middleware

### Защита маршрутов

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'auth', // Требует авторизации
});
</script>
```

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin'], // Требует админа
});
</script>
```

```vue
<script setup lang="ts">
definePageMeta({
  middleware: 'guest', // Только для неавторизованных
});
</script>
```

---

## 💡 Примеры интеграции страниц

### Страница списка товаров (Admin)

```vue
<script setup lang="ts">
import type { Product } from '~/composables/useProducts';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { getProducts, deleteProduct, getProductStats } = useProducts();
const { success, error } = useToast();

// State
const products = ref<Product[]>([]);
const loading = ref(false);
const stats = ref({ total: 0, active: 0, outOfStock: 0, lowStock: 0 });
const pagination = ref({ page: 1, limit: 20, total: 0, pages: 0 });

// Filters
const filters = ref({
  search: '',
  category: '',
  status: '',
  page: 1,
  limit: 20,
});

// Load products
const loadProducts = async () => {
  loading.value = true;
  try {
    const response = await getProducts(filters.value);
    products.value = response.data;
    pagination.value = response.pagination;
  } catch (err) {
    error('Ошибка при загрузке товаров');
  } finally {
    loading.value = false;
  }
};

// Load stats
const loadStats = async () => {
  try {
    stats.value = await getProductStats();
  } catch (err) {
    console.error('Failed to load stats');
  }
};

// Delete product
const handleDelete = async (id: string) => {
  if (!confirm('Удалить товар?')) return;

  try {
    await deleteProduct(id);
    await loadProducts();
    await loadStats();
  } catch (err) {
    error('Ошибка при удалении товара');
  }
};

// Watch filters
watch(filters, () => {
  loadProducts();
}, { deep: true });

// Initial load
onMounted(() => {
  loadProducts();
  loadStats();
});
</script>

<template>
  <div class="admin-products">
    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">Всего товаров</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.active }}</div>
        <div class="stat-label">Активных</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.outOfStock }}</div>
        <div class="stat-label">Нет в наличии</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <input v-model="filters.search" placeholder="Поиск..." />
      <!-- Другие фильтры -->
    </div>

    <!-- Loading -->
    <div v-if="loading">Загрузка...</div>

    <!-- Products table -->
    <table v-else>
      <tbody>
        <tr v-for="product in products" :key="product._id">
          <td>{{ product.name }}</td>
          <td>{{ product.sku }}</td>
          <td>{{ product.price }} ₽</td>
          <td>{{ product.stock.quantity }}</td>
          <td>
            <button @click="handleDelete(product._id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button
        @click="filters.page--"
        :disabled="filters.page === 1"
      >
        Назад
      </button>
      <span>{{ filters.page }} / {{ pagination.pages }}</span>
      <button
        @click="filters.page++"
        :disabled="filters.page >= pagination.pages"
      >
        Вперед
      </button>
    </div>
  </div>
</template>
```

### Страница корзины (User)

```vue
<script setup lang="ts">
const { getCart, updateCartItem, removeFromCart, applyPromoCode } = useCart();
const { success, error } = useToast();

const cart = ref(null);
const loading = ref(false);
const promoCode = ref('');

const loadCart = async () => {
  loading.value = true;
  try {
    cart.value = await getCart();
  } catch (err) {
    error('Ошибка при загрузке корзины');
  } finally {
    loading.value = false;
  }
};

const updateQuantity = async (itemId: string, quantity: number) => {
  try {
    cart.value = await updateCartItem(itemId, quantity);
  } catch (err) {
    error('Ошибка при обновлении');
  }
};

const removeItem = async (itemId: string) => {
  try {
    cart.value = await removeFromCart(itemId);
  } catch (err) {
    error('Ошибка при удалении');
  }
};

const applyPromo = async () => {
  try {
    cart.value = await applyPromoCode(promoCode.value);
    promoCode.value = '';
  } catch (err) {
    error('Неверный промокод');
  }
};

onMounted(() => {
  loadCart();
});
</script>

<template>
  <div class="cart-page">
    <h1>Корзина</h1>

    <div v-if="loading">Загрузка...</div>

    <div v-else-if="cart && cart.items.length > 0">
      <!-- Cart items -->
      <div v-for="item in cart.items" :key="item._id" class="cart-item">
        <img :src="item.product.images[0]?.url" />
        <div>
          <h3>{{ item.product.name }}</h3>
          <p>{{ item.price }} ₽</p>
          <input
            type="number"
            :value="item.quantity"
            @change="updateQuantity(item._id, $event.target.value)"
          />
          <button @click="removeItem(item._id)">Удалить</button>
        </div>
      </div>

      <!-- Promo code -->
      <div class="promo">
        <input v-model="promoCode" placeholder="Промокод" />
        <button @click="applyPromo">Применить</button>
      </div>

      <!-- Totals -->
      <div class="totals">
        <div>Подытог: {{ cart.totals.subtotal }} ₽</div>
        <div v-if="cart.totals.discount > 0">
          Скидка: -{{ cart.totals.discount }} ₽
        </div>
        <div>Доставка: {{ cart.totals.shipping }} ₽</div>
        <div class="total">Итого: {{ cart.totals.total }} ₽</div>
      </div>

      <button @click="navigateTo('/checkout')">Оформить заказ</button>
    </div>

    <div v-else>
      <p>Корзина пуста</p>
      <button @click="navigateTo('/products')">В каталог</button>
    </div>
  </div>
</template>
```

---

## 🎨 Toast уведомления

Все composables автоматически показывают toast уведомления при успехе или ошибке.

Вы также можете использовать их напрямую:

```typescript
const { success, error, info, warning } = useToast();

success('Товар добавлен в корзину');
error('Произошла ошибка');
info('Информационное сообщение');
warning('Предупреждение');
```

---

## 🔧 Дополнительные утилиты

### Форматирование цены

```typescript
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};
```

### Форматирование даты

```typescript
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
```

---

## ❓ FAQ

### Как обработать ошибки?

Все composables показывают toast уведомления автоматически. Но вы можете обрабатывать ошибки вручную:

```typescript
try {
  const product = await getProductById('invalid-id');
} catch (err) {
  console.error(err);
  // Ваша обработка
}
```

### Как работает авторизация?

1. При логине токены сохраняются в `localStorage`
2. Plugin автоматически восстанавливает сессию при загрузке
3. Middleware проверяют авторизацию на защищенных страницах
4. Токены автоматически добавляются ко всем запросам

### Как работает гостевая корзина?

1. Для гостей генерируется `sessionId`
2. Корзина привязана к `sessionId`
3. После авторизации корзины автоматически сливаются
4. `sessionId` удаляется после слияния

---

## 🚀 Готово к использованию!

Все composables полностью готовы к продакшн использованию:

✅ Полная типизация TypeScript
✅ Обработка ошибок
✅ Toast уведомления
✅ Пагинация
✅ Фильтрация
✅ Авторизация
✅ Middleware
✅ SSR-совместимость

Начните интегрировать прямо сейчас!
