/**
 * Composable для управления правами доступа (ACL)
 */

import { computed, readonly } from 'vue';

// Типы ролей
export type UserRole = 'admin' | 'manager' | 'customer';

// Типы разрешений
export type Permission =
  // Товары
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'products.publish'
  // Заказы
  | 'orders.view'
  | 'orders.viewAll'
  | 'orders.edit'
  | 'orders.cancel'
  | 'orders.updateStatus'
  // Пользователи
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'users.changeRole'
  // Категории
  | 'categories.view'
  | 'categories.create'
  | 'categories.edit'
  | 'categories.delete'
  // Новости
  | 'news.view'
  | 'news.create'
  | 'news.edit'
  | 'news.delete'
  | 'news.publish'
  // Настройки
  | 'settings.view'
  | 'settings.edit'
  // Статистика
  | 'analytics.view'
  | 'analytics.export'
  // Система
  | 'system.logs'
  | 'system.backup';

// Матрица прав доступа
const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    // Полный доступ ко всему
    'products.view',
    'products.create',
    'products.edit',
    'products.delete',
    'products.publish',
    'orders.view',
    'orders.viewAll',
    'orders.edit',
    'orders.cancel',
    'orders.updateStatus',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'users.changeRole',
    'categories.view',
    'categories.create',
    'categories.edit',
    'categories.delete',
    'news.view',
    'news.create',
    'news.edit',
    'news.delete',
    'news.publish',
    'settings.view',
    'settings.edit',
    'analytics.view',
    'analytics.export',
    'system.logs',
    'system.backup',
  ],

  manager: [
    // Товары
    'products.view',
    'products.create',
    'products.edit',
    // Заказы
    'orders.view',
    'orders.viewAll',
    'orders.edit',
    'orders.updateStatus',
    // Категории
    'categories.view',
    'categories.create',
    'categories.edit',
    // Новости
    'news.view',
    'news.create',
    'news.edit',
    // Статистика
    'analytics.view',
  ],

  customer: [
    // Только свои заказы
    'orders.view',
    // Просмотр товаров и категорий
    'products.view',
    'categories.view',
    'news.view',
  ],
};

export const usePermissions = () => {
  const { user } = useAuth();

  // Маппинг ролей из API к типам UserRole
  const currentUser = computed<{ role: UserRole } | null>(() => {
    if (!user.value) return null;
    const role = user.value.role as UserRole;
    // Если роль 'user' из API, маппим на 'customer'
    if (role === 'user' as any) {
      return { role: 'customer' as UserRole };
    }
    return { role };
  });

  /**
   * Проверка наличия определенного разрешения
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser.value) return false;

    const permissions = rolePermissions[currentUser.value.role];
    return permissions?.includes(permission) ?? false;
  };

  /**
   * Проверка наличия хотя бы одного из разрешений
   */
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  /**
   * Проверка наличия всех разрешений
   */
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  /**
   * Проверка роли пользователя
   */
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!currentUser.value) return false;

    if (Array.isArray(role)) {
      return role.includes(currentUser.value.role);
    }

    return currentUser.value.role === role;
  };

  /**
   * Проверка, является ли пользователь администратором
   */
  const isAdmin = computed(() => hasRole('admin'));

  /**
   * Проверка, является ли пользователь менеджером или админом
   */
  const isManager = computed(() => hasRole(['admin', 'manager']));

  /**
   * Получение всех разрешений текущего пользователя
   */
  const userPermissions = computed<Permission[]>(() => {
    if (!currentUser.value) return [];
    return rolePermissions[currentUser.value.role];
  });

  /**
   * Проверка доступа к маршруту
   */
  const canAccessRoute = (routeName: string): boolean => {
    const routePermissions: Record<string, Permission[]> = {
      // Dashboard
      'admin': ['analytics.view'],

      // Товары
      'admin-products': ['products.view'],
      'admin-products-create': ['products.create'],
      'admin-products-edit': ['products.edit'],

      // Заказы
      'admin-orders': ['orders.viewAll'],

      // Пользователи
      'admin-users': ['users.view'],

      // Категории
      'admin-categories': ['categories.view'],

      // Новости
      'admin-news': ['news.view'],
      'admin-news-create': ['news.create'],

      // Настройки
      'admin-settings': ['settings.view'],
    };

    const requiredPermissions = routePermissions[routeName];
    if (!requiredPermissions) return true;

    return hasAnyPermission(requiredPermissions);
  };

  /**
   * Фильтрация меню по правам доступа
   */
  const filterMenuItems = (items: any[]) => {
    return items.filter(item => {
      if (item.permission) {
        return hasPermission(item.permission);
      }
      if (item.permissions) {
        return hasAnyPermission(item.permissions);
      }
      if (item.role) {
        return hasRole(item.role);
      }
      return true;
    });
  };

  return {
    currentUser: readonly(currentUser),
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    isManager,
    userPermissions,
    canAccessRoute,
    filterMenuItems,
  };
};

/**
 * Directive для условного отображения элементов по правам
 *
 * Использование:
 * <button v-permission="'products.create'">Создать</button>
 * <div v-permission="['products.edit', 'products.delete']">...</div>
 */
export const vPermission = {
  mounted(el: HTMLElement, binding: any) {
    const { hasPermission, hasAnyPermission } = usePermissions();
    const permission = binding.value;

    let hasAccess = false;

    if (Array.isArray(permission)) {
      hasAccess = hasAnyPermission(permission);
    } else {
      hasAccess = hasPermission(permission);
    }

    if (!hasAccess) {
      el.style.display = 'none';
    }
  },
};

/**
 * Directive для условного отображения элементов по ролям
 *
 * Использование:
 * <button v-role="'admin'">Админ</button>
 * <div v-role="['admin', 'manager']">...</div>
 */
export const vRole = {
  mounted(el: HTMLElement, binding: any) {
    const { hasRole } = usePermissions();
    const role = binding.value;

    if (!hasRole(role)) {
      el.style.display = 'none';
    }
  },
};

/**
 * Helper для проверки прав в шаблонах
 */
export const can = (permission: Permission): boolean => {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
};

export const canAny = (permissions: Permission[]): boolean => {
  const { hasAnyPermission } = usePermissions();
  return hasAnyPermission(permissions);
};

export const canAll = (permissions: Permission[]): boolean => {
  const { hasAllPermissions } = usePermissions();
  return hasAllPermissions(permissions);
};
