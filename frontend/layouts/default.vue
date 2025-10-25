<template>
  <div class="layout-default">
    <!-- Premium Header -->
    <header class="header" :class="{ 'header--scrolled': isScrolled }">
      <div class="header-background"></div>
      <div class="container">
        <nav class="navbar">
          <NuxtLink to="/" class="logo">
            <div class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="logo-text">
              КМО<span class="logo-accent">24</span>
            </span>
          </NuxtLink>

          <div class="nav-menu">
            <NuxtLink to="/products" class="nav-link">
              <span class="nav-link-text">Каталог</span>
              <span class="nav-link-underline"></span>
            </NuxtLink>
            <NuxtLink to="/about" class="nav-link">
              <span class="nav-link-text">О нас</span>
              <span class="nav-link-underline"></span>
            </NuxtLink>
            <NuxtLink to="/delivery" class="nav-link">
              <span class="nav-link-text">Доставка</span>
              <span class="nav-link-underline"></span>
            </NuxtLink>
            <NuxtLink to="/contacts" class="nav-link">
              <span class="nav-link-text">Контакты</span>
              <span class="nav-link-underline"></span>
            </NuxtLink>
          </div>

          <div class="nav-actions">
            <button class="nav-icon" aria-label="Поиск" @click="isSearchOpen = true">
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
            </button>

            <NuxtLink to="/account" class="nav-icon" aria-label="Профиль">
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </NuxtLink>

            <NuxtLink to="/cart" class="nav-icon nav-icon--cart" aria-label="Корзина">
              <div class="nav-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 2L7 6M17 2L19 6M3.5 6H20.5L19 20H5L3.5 6ZM10 11V17M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="badge" v-if="cartCount > 0">{{ cartCount }}</span>
              </div>
            </NuxtLink>
          </div>
        </nav>
      </div>
    </header>

    <!-- Search Modal -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isSearchOpen" class="search-modal" @click="closeSearchModal">
          <div class="search-modal__content" @click.stop>
            <button class="search-modal__close" @click="closeSearchModal" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <SmartSearch @close="closeSearchModal" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Premium Footer -->
    <footer class="footer">
      <div class="footer-gradient"></div>
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="footer-logo">
              <div class="logo-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="logo-text">КМО<span class="logo-accent">24</span></span>
            </div>
            <p class="footer-description">
              Комиссионный магазин оборудования для кафе и ресторанов. Реализация б/у пищевого и хлебопекарного оборудования.
            </p>
            <div class="footer-social">
              <a href="#" class="social-link" aria-label="VK">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.45 14.8h-1.58c-.87 0-1.13-.69-2.69-2.25-1.35-1.33-1.95-1.51-2.29-1.51-.47 0-.6.13-.6.75v2.05c0 .55-.18.88-1.61.88-2.39 0-5.03-1.45-6.89-4.15-2.8-3.98-3.56-6.96-3.56-7.57 0-.34.13-.66.75-.66h1.59c.56 0 .77.26 1 .86.99 2.84 2.66 5.33 3.35 5.33.26 0 .38-.12.38-.78V8.97c-.09-1.43-.83-1.55-.83-2.06 0-.27.22-.54.58-.54h2.48c.47 0 .64.25.64.81v4.37c0 .47.21.64.35.64.26 0 .47-.17.95-.65 1.45-1.63 2.49-4.15 2.49-4.15.14-.29.39-.57.98-.57h1.59c.67 0 .82.35.67.82-.23 1.05-2.86 4.44-2.86 4.44-.22.36-.3.52 0 .93.2.3.87.85 1.32 1.37.81.9 1.43 1.65 1.6 2.18.16.52-.09.79-.67.79z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Telegram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-links-group">
            <div class="footer-section">
              <h3 class="footer-title">Покупателям</h3>
              <ul class="footer-links">
                <li><NuxtLink to="/products">Каталог</NuxtLink></li>
                <li><NuxtLink to="/about">О компании</NuxtLink></li>
                <li><NuxtLink to="/delivery">Доставка</NuxtLink></li>
                <li><NuxtLink to="/return">Возврат товара</NuxtLink></li>
              </ul>
            </div>

            <div class="footer-section">
              <h3 class="footer-title">Информация</h3>
              <ul class="footer-links">
                <li><NuxtLink to="/account">Личный кабинет</NuxtLink></li>
                <li><NuxtLink to="/account/orders">Мои заказы</NuxtLink></li>
                <li><NuxtLink to="/account/favorites">Избранное</NuxtLink></li>
                <li><NuxtLink to="/contacts">Контакты</NuxtLink></li>
              </ul>
            </div>

            <div class="footer-section">
              <h3 class="footer-title">Контакты</h3>
              <ul class="footer-contacts">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <div>
                    <div>+7 (902) 923-97-04</div>
                    <div>+7 (967) 612-35-64</div>
                  </div>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>kmo24@mail.ru</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>г. Красноярск, ул. Полигонная 11Д, пом. 8</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <div>
                    <div>пн-пт: 9:00-17:30</div>
                    <div>сб-вс: по договоренности</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="footer-copyright">
            &copy; {{ new Date().getFullYear() }} КМО24 - ИП Нижник Виталий Робертович. Все права защищены.
          </p>
          <div class="footer-bottom-links">
            <NuxtLink to="/privacy">Политика конфиденциальности</NuxtLink>
            <NuxtLink to="/terms">Условия использования</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useCartStore } from '~/stores/cart';

const isScrolled = ref(false);
const isSearchOpen = ref(false);
const cartStore = useCartStore();

// Get cart count from store
const cartCount = computed(() => cartStore.totalItems);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const closeSearchModal = () => {
  isSearchOpen.value = false;
};

// Prevent body scroll when modal is open
watch(isSearchOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// Close modal on Escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isSearchOpen.value) {
    closeSearchModal();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('keydown', handleEscape);
  document.body.style.overflow = '';
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.layout-default {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

// Premium Header
.header {
  position: sticky;
  top: 0;
  z-index: $z-index-sticky;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba($white, 0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba($gray-200, 0.5);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &--scrolled {
    &::before {
      background: rgba($white, 0.95);
      box-shadow: $shadow-lg;
      border-bottom-color: $gray-200;
    }
  }
}

.header-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: -1;
}

.navbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg 0;
  gap: $spacing-xl;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-md 0;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);

    .logo-icon {
      transform: rotate(5deg);
    }
  }
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: $radius-lg;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: $white;
  transition: transform 0.3s ease;

  svg {
    width: 24px;
    height: 24px;
  }
}

.logo-text {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $gray-900;

  .logo-accent {
    background: linear-gradient(135deg, #f59e0b, #ea580c);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  flex: 1;
  justify-content: center;

  @media (max-width: $breakpoint-md) {
    display: none;
  }
}

.nav-link {
  position: relative;
  padding: $spacing-sm $spacing-lg;
  color: $gray-700;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  &-text {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  &-underline {
    height: 2px;
    width: 0;
    background: $gradient-primary;
    border-radius: $radius-full;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    color: $primary;
    transform: translateY(-2px);

    .nav-link-text {
      transform: scale(1.05);
    }

    .nav-link-underline {
      width: 100%;
    }
  }

  &.router-link-active {
    color: $primary;

    .nav-link-underline {
      width: 100%;
      box-shadow: 0 0 8px rgba($primary, 0.4);
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
}

.nav-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: $gray-700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: $radius-xl;
    background: rgba($gray-100, 0.5);
    border: 2px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    color: $primary;
    transform: translateY(-2px);

    .nav-icon-wrapper {
      background: linear-gradient($white, $white) padding-box,
                  $gradient-primary border-box;
      box-shadow: $shadow-colored;
    }
  }

  &.nav-icon--cart:hover {
    .badge {
      transform: scale(1.15) rotate(-5deg);
    }
  }

  .badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: $gradient-primary;
    color: $white;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    padding: 0 6px;
    border-radius: $radius-full;
    box-shadow: 0 2px 12px rgba($primary, 0.4);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 2px 12px rgba($primary, 0.4);
    }
    50% {
      box-shadow: 0 2px 20px rgba($primary, 0.6);
    }
  }
}

// Main Content
.main-content {
  flex: 1;
}

// Premium Footer
.footer {
  position: relative;
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: $gray-300;
  padding: 4rem 0 2rem;
  margin-top: auto;
  overflow: hidden;
}

.footer-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, $primary, $secondary, transparent);
  opacity: 0.5;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 2fr;
  gap: $spacing-3xl;
  margin-bottom: $spacing-3xl;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
    gap: $spacing-2xl;
  }
}

.footer-brand {
  .footer-logo {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-lg;

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: $radius-xl;
      background: linear-gradient(135deg, #f59e0b, #ea580c);
      color: $white;

      svg {
        width: 28px;
        height: 28px;
      }
    }

    .logo-text {
      font-size: $font-size-2xl;
      font-weight: $font-weight-bold;
      color: $white;

      .logo-accent {
        background: linear-gradient(135deg, #fbbf24, #f59e0b);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}

.footer-description {
  color: $gray-400;
  line-height: $line-height-relaxed;
  margin-bottom: $spacing-xl;
  max-width: 400px;
}

.footer-social {
  display: flex;
  gap: $spacing-sm;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: $radius-lg;
  background: rgba($white, 0.05);
  color: $gray-400;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba($white, 0.1);

  &:hover {
    background: $gradient-primary;
    color: $white;
    border-color: transparent;
    transform: translateY(-4px);
    box-shadow: $shadow-glow;
  }
}

.footer-links-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-2xl;

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
    gap: $spacing-xl;
  }
}

.footer-section {
  .footer-title {
    color: $white;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    margin-bottom: $spacing-lg;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 30px;
      height: 2px;
      background: $gradient-primary;
      border-radius: $radius-full;
    }
  }
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: $spacing-sm;

    a {
      color: $gray-400;
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: $spacing-xs;

      &::before {
        content: '→';
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.3s ease;
      }

      &:hover {
        color: $white;
        padding-left: $spacing-sm;

        &::before {
          opacity: 1;
          transform: translateX(0);
        }
      }
    }
  }
}

.footer-contacts {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    color: $gray-400;
    margin-bottom: $spacing-md;
    transition: color 0.3s ease;

    svg {
      color: $primary;
      flex-shrink: 0;
    }

    &:hover {
      color: $white;
    }
  }
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: $spacing-xl;
  border-top: 1px solid rgba($white, 0.1);
  gap: $spacing-lg;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
    text-align: center;
  }
}

.footer-copyright {
  color: $gray-500;
  font-size: $font-size-sm;
  margin: 0;
}

.footer-bottom-links {
  display: flex;
  gap: $spacing-lg;
  font-size: $font-size-sm;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    gap: $spacing-sm;
  }

  a {
    color: $gray-500;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: $white;
    }
  }
}

.container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $container-padding;
}

// Search Modal
.search-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba($gray-900, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: $spacing-2xl;
  overflow-y: auto;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-md;
    align-items: center;
  }

  &__content {
    position: relative;
    width: 100%;
    max-width: 700px;
    margin-top: 10vh;
    background: $white;
    border-radius: $radius-2xl;
    padding: $spacing-2xl;
    box-shadow: $shadow-2xl;
    animation: slideDown 0.3s ease-out;

    @media (max-width: $breakpoint-md) {
      margin-top: 0;
      padding: $spacing-lg;
      max-width: 100%;
    }
  }

  &__close {
    position: absolute;
    top: $spacing-lg;
    right: $spacing-lg;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba($gray-100, 0.8);
    border: none;
    border-radius: $radius-full;
    color: $gray-600;
    cursor: pointer;
    transition: all $transition-base $transition-ease;
    z-index: 10;

    &:hover {
      background: $gray-200;
      color: $gray-900;
      transform: scale(1.1);
    }

    @media (max-width: $breakpoint-md) {
      top: $spacing-sm;
      right: $spacing-sm;
    }
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
