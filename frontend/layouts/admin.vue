<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ 'sidebar-open': sidebarOpen, 'sidebar-closed': !sidebarOpen }">
      <div class="sidebar-header">
        <NuxtLink to="/admin" class="logo">
          <img src="/assets/logo.png" alt="КМО24 Admin" class="logo-image-admin" />
        </NuxtLink>
        <button class="sidebar-close" @click="toggleSidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
          <span class="nav-text">{{ item.label }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar">
            <img v-if="user?.avatar" :src="user.avatar" :alt="user.fullName" />
            <span v-else>{{ userInitials }}</span>
          </div>
          <div class="user-details">
            <p class="user-name">{{ user?.fullName || 'Admin' }}</p>
            <p class="user-role">{{ user?.role === 'admin' ? 'Администратор' : 'Менеджер' }}</p>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Выйти</span>
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
      v-if="sidebarOpen && isMobile"
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

const sidebarOpen = ref(false); // Changed: open/closed state for mobile
const showNotifications = ref(false);
const isMobile = ref(false);
const notificationCount = ref(0);

// Счетчики для бейджей
const leadsCount = ref(0);
const pendingOrdersCount = ref(0);

const user = computed(() => authStore.user);

// Загрузка счетчиков для бейджей
const loadBadgeCounts = async () => {
  try {
    const { apiFetch } = useApi();

    // Загружаем количество новых лидов
    const leadsResponse = await apiFetch<{ success: boolean; data: any[]; pagination?: { total: number } }>('/leads?status=new&limit=1');
    if (leadsResponse.success) {
      leadsCount.value = leadsResponse.pagination?.total || 0;
    }

    // Загружаем количество заказов в ожидании
    const ordersResponse = await apiFetch<{ success: boolean; data: any[]; pagination?: { total: number } }>('/orders/all/list?status=pending&limit=1');
    if (ordersResponse.success) {
      pendingOrdersCount.value = ordersResponse.pagination?.total || 0;
    }
  } catch {
    // Игнорируем ошибки - просто не показываем бейджи
  }
};

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
  if (path.includes('/proposals')) return 'Коммерческие предложения';
  if (path.includes('/users')) return 'Пользователи';
  if (path.includes('/categories')) return 'Категории';
  if (path.includes('/news')) return 'Новости';
  if (path.includes('/settings')) return 'Настройки';
  return 'Админ-панель';
});

const navigation = computed(() => [
  {
    label: 'Дашборд',
    path: '/admin',
    icon: 'IconDashboard',
  },
  {
    label: 'CRM',
    path: '/admin/crm',
    icon: 'IconCRM',
    badge: leadsCount.value > 0 ? String(leadsCount.value) : null,
  },
  {
    label: 'Товары',
    path: '/admin/products',
    icon: 'IconProducts',
  },
  {
    label: 'Заказы',
    path: '/admin/orders',
    icon: 'IconOrders',
    badge: pendingOrdersCount.value > 0 ? String(pendingOrdersCount.value) : null,
  },
  {
    label: 'КП',
    path: '/admin/proposals',
    icon: 'IconProposals',
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
    label: 'Новости',
    path: '/admin/news',
    icon: 'IconNews',
  },
  {
    label: 'Настройки',
    path: '/admin/settings',
    icon: 'IconSettings',
  },
]);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
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
    isMobile.value = window.innerWidth < 1024;
    if (isMobile.value) {
      sidebarOpen.value = false;
    } else {
      sidebarOpen.value = true;
    }
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // Загружаем счетчики для бейджей
  loadBadgeCounts();

  // Close sidebar when clicking on nav item on mobile
  watch(() => route.path, () => {
    if (isMobile.value) {
      sidebarOpen.value = false;
    }
  });

  onUnmounted(() => window.removeEventListener('resize', checkMobile));
});
</script>

<style scoped lang="scss">
// Animations
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fc;
}

.admin-sidebar {
  width: 280px;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // Premium gradient background with animation
  background: linear-gradient(135deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #764ba2 75%,
    #667eea 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;

  // Glassmorphism overlay
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(17, 24, 39, 0.85);
    backdrop-filter: blur(20px);
    z-index: 1;
  }

  // Decorative elements
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
    pointer-events: none;
    z-index: 2;
    animation: float 6s ease-in-out infinite;
  }

  // All content above overlays
  > * {
    position: relative;
    z-index: 3;
  }

  // Mobile: sidebar is hidden by default, shown when open
  @media (max-width: 1023px) {
    transform: translateX(-100%);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);

    &.sidebar-open {
      transform: translateX(0);
    }
  }

  // Desktop: sidebar always visible
  @media (min-width: 1024px) {
    transform: translateX(0);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .logo {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    text-decoration: none;
    color: white;
    font-weight: 700;
    font-size: 1.25rem;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);

      .logo-image-admin {
        filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.6));
      }
    }
  }

  .logo-image-admin {
    height: 40px;
    width: auto;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
  }

  .logo {
    &-icon {
      width: 2.25rem;
      height: 2.25rem;
      flex-shrink: 0;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      transition: all 0.3s ease;
    }

    &-text {
      background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      white-space: nowrap;
      transition: all 0.3s ease;
    }
  }

  .sidebar-close {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: white;
    cursor: pointer;
    padding: 0.625rem;
    border-radius: 0.625rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 68, 68, 0.3);
      transform: rotate(90deg);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
      display: block;
    }

    @media (min-width: 1024px) {
      display: none;
    }
  }
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0.75rem;
  overflow-y: auto;
  overflow-x: hidden;

  // Custom scrollbar
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 1rem;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    border-radius: 0.75rem;
    overflow: hidden;
    font-size: 0.9375rem;

    // Hover glow effect
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg,
        rgba(102, 126, 234, 0.2) 0%,
        rgba(118, 75, 162, 0.2) 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      color: white;
      transform: translateX(4px);

      &::before {
        opacity: 1;
      }

      .nav-icon {
        filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.8));
        transform: scale(1.1);
      }
    }

    &.active {
      color: white;
      background: linear-gradient(135deg,
        rgba(102, 126, 234, 0.3) 0%,
        rgba(118, 75, 162, 0.3) 100%
      );
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4),
                  inset 0 1px 2px rgba(255, 255, 255, 0.1);

      // Animated left border
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 20%;
        bottom: 20%;
        width: 4px;
        background: linear-gradient(180deg,
          #667eea 0%,
          #f093fb 100%
        );
        border-radius: 0 4px 4px 0;
        box-shadow: 0 0 12px rgba(102, 126, 234, 0.6);
        animation: glow 2s ease-in-out infinite;
      }

      .nav-icon {
        filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
        animation: float 3s ease-in-out infinite;
      }
    }

    .nav-icon {
      width: 1.375rem;
      height: 1.375rem;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .nav-text {
      flex: 1;
      font-weight: 500;
      white-space: nowrap;
      transition: all 0.3s ease;
    }

    .nav-badge {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      font-size: 0.6875rem;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
      animation: float 2s ease-in-out infinite;
      transition: all 0.3s ease;
      white-space: nowrap;
    }
  }
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.25rem;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .user-avatar {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9375rem;
      overflow: hidden;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4),
                  inset 0 2px 4px rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-details {
      flex: 1;
      min-width: 0;
      transition: all 0.3s ease;

      .user-name {
        font-size: 0.9375rem;
        font-weight: 600;
        margin: 0 0 0.125rem 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: white;
      }

      .user-role {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
        font-weight: 500;
      }
    }
  }

  .logout-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.875rem;
    background: linear-gradient(135deg,
      rgba(239, 68, 68, 0.2) 0%,
      rgba(220, 38, 38, 0.2) 100%
    );
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 0.75rem;
    color: #fca5a5;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9375rem;
    font-weight: 600;
    backdrop-filter: blur(10px);

    &:hover {
      background: linear-gradient(135deg,
        rgba(239, 68, 68, 0.3) 0%,
        rgba(220, 38, 38, 0.3) 100%
      );
      border-color: rgba(239, 68, 68, 0.5);
      color: #fee2e2;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
    }

    svg {
      width: 1.25rem;
      height: 1.25rem;
      transition: transform 0.3s ease;
    }

    &:hover svg {
      transform: translateX(3px);
    }

    span {
      transition: all 0.3s ease;
    }
  }
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (min-width: 1024px) {
    margin-left: 280px;
  }

  @media (max-width: 1023px) {
    margin-left: 0;
  }
}

.admin-header {
  background: white;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 30;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1.25rem;

    .mobile-menu-btn {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border: 1px solid #d1d5db;
      cursor: pointer;
      padding: 0.625rem;
      border-radius: 0.625rem;
      transition: all 0.3s ease;
      color: #374151;

      &:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      svg {
        width: 1.5rem;
        height: 1.5rem;
        display: block;
      }

      @media (min-width: 1024px) {
        display: none;
      }
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;

      @media (max-width: 640px) {
        font-size: 1.25rem;
      }

      @media (max-width: 480px) {
        font-size: 1.125rem;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 640px) {
      gap: 0.375rem;
    }

    .header-btn {
      position: relative;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      cursor: pointer;
      padding: 0.625rem;
      border-radius: 0.625rem;
      transition: all 0.3s ease;
      color: #6b7280;

      @media (max-width: 640px) {
        padding: 0.5rem;
      }

      &:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

        .badge {
          transform: scale(1.1);
        }
      }

      svg {
        width: 1.5rem;
        height: 1.5rem;
        display: block;

        @media (max-width: 640px) {
          width: 1.25rem;
          height: 1.25rem;
        }
      }

      .badge {
        position: absolute;
        top: 0;
        right: 0;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        font-size: 0.625rem;
        padding: 0.25rem 0.4rem;
        border-radius: 9999px;
        font-weight: 700;
        box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
        border: 2px solid white;
        transition: transform 0.3s ease;
        min-width: 1.25rem;
        text-align: center;
      }
    }
  }
}

.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: #f8f9fc;

  @media (max-width: 1023px) {
    padding: 1.5rem;
  }

  @media (max-width: 640px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
  }

  // Custom scrollbar
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f3f5;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;

    &:hover {
      background: linear-gradient(180deg, #764ba2 0%, #667eea 100%);
    }
  }
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 30;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (min-width: 1024px) {
    display: none;
  }
}
</style>
