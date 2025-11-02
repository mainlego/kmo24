<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <NuxtLink to="/admin" class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span v-if="!sidebarCollapsed" class="logo-text">КМО24 Admin</span>
        </NuxtLink>
        <button class="sidebar-toggle" @click="toggleSidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <NuxtLink
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <component :is="item.icon" class="nav-icon" />
          <span v-if="!sidebarCollapsed" class="nav-text">{{ item.label }}</span>
          <span v-if="item.badge && !sidebarCollapsed" class="nav-badge">{{ item.badge }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <div v-if="!sidebarCollapsed" class="user-info">
          <div class="user-avatar">
            <img v-if="user?.avatar" :src="user.avatar" :alt="user.fullName" />
            <span v-else>{{ userInitials }}</span>
          </div>
          <div class="user-details">
            <p class="user-name">{{ user?.fullName || 'Admin' }}</p>
            <p class="user-role">{{ user?.role === 'admin' ? 'Администратор' : 'Менеджер' }}</p>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout" :title="sidebarCollapsed ? 'Выйти' : ''">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="!sidebarCollapsed">Выйти</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">
      <!-- Header -->
      <header class="admin-header">
        <div class="header-left">
          <button class="mobile-menu-btn" @click="toggleSidebar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>

        <div class="header-right">
          <!-- Notifications -->
          <button class="header-btn" @click="showNotifications = !showNotifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span v-if="notificationCount > 0" class="badge">{{ notificationCount }}</span>
          </button>

          <!-- Quick Actions -->
          <button class="header-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="admin-content">
        <slot />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarCollapsed && isMobile"
      class="mobile-overlay"
      @click="toggleSidebar"
    ></div>

    <!-- Toast Notifications -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const sidebarCollapsed = ref(false);
const showNotifications = ref(false);
const isMobile = ref(false);
const notificationCount = ref(3);

const user = computed(() => authStore.user);

const userInitials = computed(() => {
  if (!user.value?.fullName) return 'A';
  return user.value.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const pageTitle = computed(() => {
  const path = route.path;
  if (path === '/admin') return 'Дашборд';
  if (path.includes('/crm')) return 'CRM';
  if (path.includes('/products')) return 'Товары';
  if (path.includes('/orders')) return 'Заказы';
  if (path.includes('/users')) return 'Пользователи';
  if (path.includes('/categories')) return 'Категории';
  if (path.includes('/reviews')) return 'Отзывы';
  if (path.includes('/news')) return 'Новости';
  if (path.includes('/settings')) return 'Настройки';
  return 'Админ-панель';
});

const navigation = [
  {
    label: 'Дашборд',
    path: '/admin',
    icon: 'IconDashboard',
  },
  {
    label: 'CRM',
    path: '/admin/crm',
    icon: 'IconCRM',
    badge: '38',
  },
  {
    label: 'Товары',
    path: '/admin/products',
    icon: 'IconProducts',
    badge: null,
  },
  {
    label: 'Заказы',
    path: '/admin/orders',
    icon: 'IconOrders',
    badge: '5',
  },
  {
    label: 'Пользователи',
    path: '/admin/users',
    icon: 'IconUsers',
  },
  {
    label: 'Категории',
    path: '/admin/categories',
    icon: 'IconCategories',
  },
  {
    label: 'Отзывы',
    path: '/admin/reviews',
    icon: 'IconReviews',
    badge: '2',
  },
  {
    label: 'Новости',
    path: '/admin/news',
    icon: 'IconNews',
  },
  {
    label: 'Настройки',
    path: '/admin/settings',
    icon: 'IconSettings',
  },
];

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const isActive = (path: string) => {
  if (path === '/admin') {
    return route.path === '/admin';
  }
  return route.path.startsWith(path);
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

// Check mobile
onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
    if (isMobile.value) {
      sidebarCollapsed.value = true;
    }
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  onUnmounted(() => window.removeEventListener('resize', checkMobile));
});
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
}

.admin-sidebar {
  width: 260px;
  background: #1f2937;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 40;
  transition: width 0.3s ease, transform 0.3s ease;

  &.sidebar-collapsed {
    width: 70px;

    @media (max-width: 768px) {
      transform: translateX(-100%);
    }
  }

  @media (max-width: 768px) {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: white;
    font-weight: 600;
    font-size: 1.125rem;

    &-icon {
      width: 2rem;
      height: 2rem;
      flex-shrink: 0;
    }
  }

  .sidebar-toggle {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    @media (min-width: 769px) {
      display: none;
    }
  }
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #d1d5db;
    text-decoration: none;
    transition: all 0.2s;
    position: relative;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: white;
    }

    &.active {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #3b82f6;
      }
    }

    .nav-icon {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    .nav-text {
      flex: 1;
      font-size: 0.875rem;
    }

    .nav-badge {
      background: #ef4444;
      color: white;
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-weight: 600;
    }
  }
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;

    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-details {
      flex: 1;
      min-width: 0;

      .user-name {
        font-size: 0.875rem;
        font-weight: 500;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-role {
        font-size: 0.75rem;
        color: #9ca3af;
        margin: 0;
      }
    }
  }

  .logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.1);
    border: none;
    border-radius: 0.375rem;
    color: #ef4444;
    cursor: pointer;
    transition: background 0.2s;
    font-size: 0.875rem;

    &:hover {
      background: rgba(239, 68, 68, 0.2);
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
}

.admin-main {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;

  .sidebar-collapsed ~ & {
    margin-left: 70px;

    @media (max-width: 768px) {
      margin-left: 0;
    }
  }
}

.admin-header {
  background: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 30;

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;

    .mobile-menu-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.375rem;
      transition: background 0.2s;

      &:hover {
        background: #f3f4f6;
      }

      svg {
        width: 1.5rem;
        height: 1.5rem;
      }

      @media (min-width: 769px) {
        display: none;
      }
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      color: #111827;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .header-btn {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.375rem;
      transition: background 0.2s;
      color: #6b7280;

      &:hover {
        background: #f3f4f6;
        color: #111827;
      }

      svg {
        width: 1.5rem;
        height: 1.5rem;
      }

      .badge {
        position: absolute;
        top: 0;
        right: 0;
        background: #ef4444;
        color: white;
        font-size: 0.625rem;
        padding: 0.125rem 0.375rem;
        border-radius: 9999px;
        font-weight: 600;
      }
    }
  }
}

.admin-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 30;

  @media (min-width: 769px) {
    display: none;
  }
}
</style>
