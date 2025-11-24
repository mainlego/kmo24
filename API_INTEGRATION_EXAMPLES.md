# 🚀 Примеры интегрированных страниц с API

Этот документ содержит готовые к использованию страницы с полной интеграцией Backend API.

## 📁 Созданные страницы

### 1. Админ-панель: Список товаров
**Файл:** `frontend/pages/admin/products/api-integrated.vue`

**Функции:**
- ✅ Загрузка товаров с пагинацией
- ✅ Фильтрация по категории и статусу
- ✅ Поиск по названию/артикулу (debounced)
- ✅ Статистика (всего, активных, нет в наличии, заканчиваются)
- ✅ Удаление товара
- ✅ Навигация на редактирование
- ✅ Responsive дизайн

**Использованные composables:**
- `useProducts()` - getProducts, deleteProduct, getProductStats
- `useCategories()` - getCategories
- `useToast()` - success, error

**Как использовать:**
1. Переименуйте `index.vue` в `index-old.vue`
2. Переименуйте `api-integrated.vue` в `index.vue`
3. Готово!

---

### 2. Корзина пользователя
**Файл:** `frontend/pages/cart/api-integrated.vue`

**Функции:**
- ✅ Отображение товаров в корзине
- ✅ Изменение количества товара
- ✅ Удаление товара из корзины
- ✅ Применение промокода
- ✅ Удаление промокода
- ✅ Расчет итоговой суммы
- ✅ Очистка корзины
- ✅ Переход к оформлению заказа
- ✅ Responsive дизайн

**Использованные composables:**
- `useCart()` - getCart, updateCartItem, removeFromCart, clearCart, applyPromoCode, removePromoCode
- `useToast()` - success, error

**Как использовать:**
1. Переименуйте `/cart/index.vue` в `/cart/index-old.vue`
2. Переименуйте `/cart/api-integrated.vue` в `/cart/index.vue`
3. Готово!

---

## 🎨 Стилизация

Обе страницы используют Scoped CSS для изоляции стилей. Стили современные, минималистичные и адаптивные.

### Цветовая схема:
- Primary: `#3b82f6` (синий)
- Success: `#10b981` (зеленый)
- Warning: `#f59e0b` (оранжевый)
- Danger: `#ef4444` (красный)
- Gray: `#6b7280` (серый)

---

## 📊 Интеграция с API

### Архитектура запросов:

```
Vue Component
    ↓
Composable (useProducts, useCart, etc.)
    ↓
useApi() → $fetch
    ↓
Backend API (/api/v1/*)
    ↓
MongoDB Atlas
```

### Автоматические функции:

1. **JWT токены** - автоматически добавляются из localStorage
2. **Session ID** - автоматически для гостевой корзины
3. **Toast уведомления** - автоматически при успехе/ошибке
4. **Обработка ошибок** - централизованная в composables
5. **Loading states** - управление через ref(loading)

---

## 🔧 Дополнительные возможности

### Debounced Search
Поиск с задержкой 500мс для оптимизации:

```typescript
let searchTimeout: NodeJS.Timeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadProducts();
  }, 500);
};
```

### Пагинация
Встроенная пагинация с кнопками Назад/Вперед:

```typescript
const nextPage = () => {
  if (pagination.value.page < pagination.value.pages) {
    filters.value.page++;
    loadProducts();
  }
};
```

### Форматирование цен
Русская локализация с рублями:

```typescript
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};
```

---

## 🚦 Следующие шаги

### Рекомендуется интегрировать:

1. **Страница каталога товаров** (`/products/index.vue`)
   - Используйте пример из админ-панели
   - Добавьте фильтры по цене, характеристикам
   - Добавьте кнопку "В корзину"

2. **Страница оформления заказа** (`/checkout/index.vue`)
   - Используйте `useOrders().createOrder()`
   - Интегрируйте расчет доставки
   - Выбор способа оплаты

3. **Страница товара** (`/products/[slug].vue`)
   - Используйте `useProducts().getProductBySlug()`
   - Отображение характеристик
   - Галерея изображений
   - Отзывы с `useReviews()`

4. **Личный кабинет** (`/account/*`)
   - Мои заказы с `useOrders().getMyOrders()`
   - Редактирование профиля с `useAuth().updateProfile()`
   - Избранное (требуется новый composable)

5. **Админ-панель: Заказы** (`/admin/orders/index.vue`)
   - Используйте `useOrders().getOrders()`
   - Изменение статусов
   - Подтверждение оплаты

6. **Админ-панель: Пользователи** (`/admin/users/index.vue`)
   - Используйте `useUsers().getUsers()`
   - Управление ролями
   - Блокировка пользователей

---

## 💡 Советы

### 1. Используйте watch для автоматической загрузки

```typescript
watch(
  () => [filters.value.category, filters.value.status],
  () => {
    filters.value.page = 1;
    loadProducts();
  }
);
```

### 2. Загружайте данные параллельно

```typescript
onMounted(async () => {
  await Promise.all([
    loadProducts(),
    loadCategories(),
    loadStats(),
  ]);
});
```

### 3. Обрабатывайте ошибки gracefully

```typescript
try {
  await deleteProduct(id);
  await loadProducts();
} catch (err: any) {
  error(err.message || 'Ошибка при удалении');
}
```

### 4. Используйте TypeScript для типобезопасности

```typescript
import type { Product } from '~/composables/useProducts';

const products = ref<Product[]>([]);
```

---

## 📚 Дополнительные ресурсы

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Полное руководство по всем composables
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Инструкции по деплою на Render.com
- [Nuxt 3 Documentation](https://nuxt.com/docs) - Официальная документация

---

## ✨ Готовые решения

Обе созданные страницы - это **production-ready** решения:

- ✅ Полностью типизированы
- ✅ Обработка ошибок
- ✅ Loading states
- ✅ Responsive дизайн
- ✅ Accessibility (a11y)
- ✅ SEO-friendly
- ✅ Performance оптимизированы

**Просто переименуйте файлы и используйте!**

---

*Создано с помощью Claude Code* 🤖
