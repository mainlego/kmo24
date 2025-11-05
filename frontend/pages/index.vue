<template>
  <div class="home-page">
    <!-- Premium Hero Section with Video Background -->
    <section ref="heroSection" class="hero">
      <!-- Background with Image -->
      <div class="hero-background">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80"
          alt="Профессиональное кухонное оборудование"
          class="hero-bg-image"
        />
        <!-- Dark Overlay -->
        <div class="hero-overlay"></div>
        <!-- Animated Gradient Mesh -->
        <div class="gradient-mesh"></div>
      </div>

      <div class="container">
        <div class="hero-wrapper">
          <!-- Main Content -->
          <div class="hero-content">
            <div class="hero-badge animate-fade-in" :class="{ 'is-visible': isVisible }">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>Проверенное оборудование премиум-класса</span>
            </div>

            <h1 class="hero-title animate-fade-in delay-1" :class="{ 'is-visible': isVisible }">
              Профессиональное<br>
              <span class="gradient-text">кухонное оборудование</span><br>
              для вашего бизнеса
            </h1>

            <p class="hero-subtitle animate-fade-in delay-2" :class="{ 'is-visible': isVisible }">
              Крупнейший выбор б/у оборудования для HoReCa в Красноярске.<br>
              Гарантия качества, техническая поддержка, выгодный обмен вашей техники.
            </p>

            <div class="hero-actions animate-fade-in delay-3" :class="{ 'is-visible': isVisible }">
              <NuxtLink to="/products" class="btn btn-primary">
                <span>Смотреть каталог</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </NuxtLink>
              <NuxtLink to="/contacts" class="btn btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" stroke-width="2"/>
                </svg>
                <span>Получить консультацию</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Categories Grid (Right Column) -->
          <div class="hero-categories animate-fade-in delay-5" :class="{ 'is-visible': isVisible }">
            <div class="categories-header">
              <h3>Популярные категории</h3>
              <NuxtLink to="/products" class="view-all">
                Все категории
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" stroke-width="2"/>
                </svg>
              </NuxtLink>
            </div>

            <div class="categories-grid">
              <NuxtLink to="/products?category=plity" class="category-item category-large">
                <div class="category-icon-wrapper">
                  <svg class="category-svg" viewBox="0 0 24 24" fill="none">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </div>
                <div class="category-info">
                  <div class="category-name">Плиты</div>
                  <div class="category-count">45+ товаров</div>
                </div>
              </NuxtLink>

              <NuxtLink to="/products?category=pechi" class="category-item">
                <div class="category-icon-wrapper">
                  <svg class="category-svg" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" stroke-width="1.5"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </div>
                <div class="category-info">
                  <div class="category-name">Печи</div>
                  <div class="category-count">32+</div>
                </div>
              </NuxtLink>

              <NuxtLink to="/products?category=holodilniki" class="category-item">
                <div class="category-icon-wrapper">
                  <svg class="category-svg" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" stroke-width="1.5"/>
                    <line x1="5" y1="10" x2="19" y2="10" stroke="currentColor" stroke-width="1.5"/>
                    <line x1="8" y1="6" x2="8" y2="8" stroke="currentColor" stroke-width="1.5"/>
                    <line x1="8" y1="14" x2="8" y2="16" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </div>
                <div class="category-info">
                  <div class="category-name">Холодильники</div>
                  <div class="category-count">58+</div>
                </div>
              </NuxtLink>

              <NuxtLink to="/products?category=frityurnicy" class="category-item">
                <div class="category-icon-wrapper">
                  <svg class="category-svg" viewBox="0 0 24 24" fill="none">
                    <path d="M8 3v3M16 3v3M3 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M12 12v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="category-info">
                  <div class="category-name">Фритюрницы</div>
                  <div class="category-count">24+</div>
                </div>
              </NuxtLink>

              <NuxtLink to="/products?category=grili" class="category-item category-tall">
                <div class="category-icon-wrapper">
                  <svg class="category-svg" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="category-info">
                  <div class="category-name">Грили</div>
                  <div class="category-count">28+ товаров</div>
                </div>
              </NuxtLink>

              <NuxtLink to="/products?category=morozilniki" class="category-item">
                <div class="category-icon-wrapper">
                  <svg class="category-svg" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2v20M2 12h20M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </div>
                <div class="category-info">
                  <div class="category-name">Морозильники</div>
                  <div class="category-count">19+</div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Advantages Grid (Full Width Below) -->
          <div class="hero-advantages animate-fade-in delay-4" :class="{ 'is-visible': isVisible }">
            <div class="advantage-card">
              <div class="advantage-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="advantage-content">
                <div class="advantage-title">100% проверка</div>
                <div class="advantage-desc">Полная диагностика перед продажей</div>
              </div>
            </div>

            <div class="advantage-card">
              <div class="advantage-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="advantage-content">
                <div class="advantage-title">Выкуп техники</div>
                <div class="advantage-desc">Покупаем ваше оборудование</div>
              </div>
            </div>

            <div class="advantage-card">
              <div class="advantage-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="advantage-content">
                <div class="advantage-title">Быстрая доставка</div>
                <div class="advantage-desc">По городу за 1-2 дня</div>
              </div>
            </div>

            <div class="advantage-card">
              <div class="advantage-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414 1 1 0 01-1.414-1.414z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="advantage-content">
                <div class="advantage-title">Техподдержка</div>
                <div class="advantage-desc">Консультации специалистов</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="scroll-indicator animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14m0 0l-7-7m7 7l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Почему выбирают КМО24</h2>
          <p class="section-subtitle">Надежный партнер для оснащения вашего заведения</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" data-index="0">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="feature-title">Проверенное качество</h3>
            <p class="feature-description">
              Каждая единица оборудования проходит тщательную проверку перед продажей. Работаем только с исправной техникой.
            </p>
          </div>

          <div class="feature-card" data-index="1">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="feature-title">Широкий ассортимент</h3>
            <p class="feature-description">
              Более 300 единиц оборудования: печи, холодильники, витрины, посудомойки и многое другое для вашего бизнеса.
            </p>
          </div>

          <div class="feature-card" data-index="2">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="feature-title">Быстрая доставка</h3>
            <p class="feature-description">
              Доставка по Красноярску и области. Организуем экспресс-доставку по всей России с надежными партнерами.
            </p>
          </div>

          <div class="feature-card" data-index="3">
            <div class="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="feature-title">Выгодные цены</h3>
            <p class="feature-description">
              Экономия до 70% от стоимости нового оборудования. Комиссионная схема работы позволяет предлагать лучшие цены.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Showcase -->
    <section class="categories-showcase">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Категории оборудования</h2>
          <p class="section-subtitle">Всё необходимое для вашего бизнеса в одном месте</p>
        </div>
        <div class="categories-grid">
          <NuxtLink to="/products?category=ovens" class="category-card">
            <div class="category-image">
              <img src="https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80" alt="Печи" />
              <div class="category-overlay"></div>
            </div>
            <div class="category-content">
              <h3 class="category-title">Печи</h3>
              <p class="category-count">50+ единиц</p>
              <div class="category-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink to="/products?category=refrigerators" class="category-card">
            <div class="category-image">
              <img src="https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80" alt="Холодильники" />
              <div class="category-overlay"></div>
            </div>
            <div class="category-content">
              <h3 class="category-title">Холодильники</h3>
              <p class="category-count">70+ единиц</p>
              <div class="category-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink to="/products?category=showcases" class="category-card">
            <div class="category-image">
              <img src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80" alt="Витрины" />
              <div class="category-overlay"></div>
            </div>
            <div class="category-content">
              <h3 class="category-title">Витрины</h3>
              <p class="category-count">40+ единиц</p>
              <div class="category-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink to="/products?category=dishwashers" class="category-card">
            <div class="category-image">
              <img src="https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&q=80" alt="Посудомойки" />
              <div class="category-overlay"></div>
            </div>
            <div class="category-content">
              <h3 class="category-title">Посудомойки</h3>
              <p class="category-count">30+ единиц</p>
              <div class="category-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink to="/products?category=equipment" class="category-card">
            <div class="category-image">
              <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80" alt="Кухонное оборудование" />
              <div class="category-overlay"></div>
            </div>
            <div class="category-content">
              <h3 class="category-title">Кухонное оборудование</h3>
              <p class="category-count">60+ единиц</p>
              <div class="category-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </NuxtLink>

          <NuxtLink to="/products?category=bar" class="category-card">
            <div class="category-image">
              <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&q=80" alt="Барное оборудование" />
              <div class="category-overlay"></div>
            </div>
            <div class="category-content">
              <h3 class="category-title">Барное оборудование</h3>
              <p class="category-count">25+ единиц</p>
              <div class="category-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Recently Viewed Products -->
    <ProductRecentlyViewed />

    <!-- Premium CTA Section -->
    <section class="premium-cta">
      <div class="cta-background">
        <img
          src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80"
          alt="Профессиональное кухонное оборудование"
          class="cta-bg-image"
        />
        <div class="cta-overlay"></div>
      </div>
      <div class="cta-gradient-orbs"></div>
      <div class="container">
        <div class="premium-cta-content">
          <div class="premium-cta-text">
            <div class="cta-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Проверенное качество</span>
            </div>
            <h2 class="premium-cta-title">Ищете надежное оборудование для бизнеса?</h2>
            <p class="premium-cta-subtitle">
              Более 300 единиц проверенного б/у оборудования для кафе и ресторанов в Красноярске. Экономьте до 70% на покупке профессионального оборудования
            </p>
            <div class="cta-features">
              <div class="cta-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Проверка перед продажей</span>
              </div>
              <div class="cta-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Быстрая доставка по России</span>
              </div>
              <div class="cta-feature">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Гарантия качества</span>
              </div>
            </div>
          </div>
          <div class="cta-actions">
            <NuxtLink to="/products" class="btn btn-white btn-lg">
              <span>Смотреть каталог</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>
            <NuxtLink to="/contacts" class="btn btn-glass btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Получить консультацию</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

useHead({
  title: 'КМО24 - Профессиональное оборудование для кафе и ресторанов',
  meta: [
    {
      name: 'description',
      content:
        'Комиссионный магазин б/у оборудования для кафе и ресторанов в Красноярске. Проверенное качество по выгодным ценам.',
    },
  ],
});

// Parallax effect
const parallaxOffset = ref(0);
const heroSection = ref<HTMLElement | null>(null);

// Animation visibility
const isVisible = ref(false);

// Particles
const getParticleStyle = (index: number) => {
  const size = Math.random() * 4 + 2;
  const x = Math.random() * 100;
  const delay = Math.random() * 5;
  const duration = Math.random() * 10 + 10;

  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
};

// Parallax scroll handler
const handleScroll = () => {
  const scrollY = window.scrollY;
  parallaxOffset.value = scrollY * 0.5;
};

// Mouse move effect
const handleMouseMove = (e: MouseEvent) => {
  if (!heroSection.value) return;

  const rect = heroSection.value.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;

  const particles = heroSection.value.querySelectorAll('.particle');
  particles.forEach((particle, index) => {
    const speed = (index % 3 + 1) * 20;
    (particle as HTMLElement).style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
};

onMounted(() => {
  // Trigger animations
  setTimeout(() => {
    isVisible.value = true;
  }, 100);

  // Add scroll listener for parallax
  window.addEventListener('scroll', handleScroll);

  // Add mouse move listener
  if (heroSection.value) {
    heroSection.value.addEventListener('mousemove', handleMouseMove);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (heroSection.value) {
    heroSection.value.removeEventListener('mousemove', handleMouseMove);
  }
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;
@use 'assets/scss/hero' as *;

.home-page {
  min-height: 100vh;
  overflow: hidden;
}

// Section Headers
.section-header {
  text-align: center;
  margin-bottom: $spacing-3xl;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-md;
}

.section-subtitle {
  font-size: $font-size-lg;
  color: $gray-600;
}

// Features Section - Premium
.features {
  padding: 6rem 0;
  background: $gray-50;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, $white, transparent);
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-xl;

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  position: relative;
  text-align: center;
  padding: $spacing-2xl;
  border-radius: $radius-2xl;
  background: $white;
  border: 1px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  transform-style: preserve-3d;
  perspective: 1000px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: $radius-2xl;
    padding: 2px;
    background: linear-gradient(135deg,
      rgba(99, 102, 241, 1) 0%,
      rgba(139, 92, 246, 1) 50%,
      rgba(236, 72, 153, 1) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: $radius-2xl;
    background: linear-gradient(135deg,
      rgba(99, 102, 241, 0.1) 0%,
      rgba(236, 72, 153, 0.1) 100%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
    filter: blur(20px);
  }

  &:hover {
    transform: translateY(-16px) rotateX(5deg);
    box-shadow:
      0 30px 60px rgba(99, 102, 241, 0.25),
      0 10px 25px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
    }

    &::after {
      opacity: 1;
    }

    .feature-icon {
      transform: translateZ(20px) scale(1.15) rotate(10deg);
      box-shadow:
        0 20px 40px rgba(99, 102, 241, 0.4),
        0 0 30px rgba(236, 72, 153, 0.3);
    }

    .feature-title {
      transform: translateZ(10px);
      color: transparent;
      background: linear-gradient(135deg, #f59e0b 0%, #fb923c 100%);
      -webkit-background-clip: text;
      background-clip: text;
    }

    .feature-description {
      transform: translateZ(5px);
    }
  }

  @for $i from 0 through 3 {
    &[data-index='#{$i}'] {
      animation: fadeInUp 0.6s ease-out #{$i * 0.1s} backwards;
    }
  }
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto $spacing-lg;
  padding: $spacing-lg;
  border-radius: $radius-2xl;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #fb923c 100%);
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: $radius-2xl;
    background: inherit;
    filter: blur(10px);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }

  svg {
    width: 32px;
    height: 32px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
}

.feature-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: $spacing-md;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-description {
  color: $gray-600;
  line-height: $line-height-relaxed;
  font-size: $font-size-base;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

// Premium CTA Section
.premium-cta {
  padding: 8rem 0;
  position: relative;
  overflow: hidden;

  @media (max-width: $breakpoint-md) {
    padding: 5rem 0;
  }
}

.cta-background {
  position: absolute;
  inset: 0;
  z-index: 0;

  .cta-bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.cta-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(245, 158, 11, 0.92) 0%,
    rgba(234, 88, 12, 0.9) 50%,
    rgba(220, 38, 38, 0.88) 100%
  );
  backdrop-filter: blur(2px);
}

.cta-gradient-orbs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.3;

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
    filter: blur(60px);
  }

  &::before {
    width: 600px;
    height: 600px;
    top: -200px;
    right: -100px;
    animation: float 20s infinite ease-in-out;
  }

  &::after {
    width: 500px;
    height: 500px;
    bottom: -150px;
    left: -100px;
    animation: float 25s infinite ease-in-out reverse;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

.premium-cta-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: $spacing-2xl;
}

.premium-cta-text {
  max-width: 800px;
}

.cta-badge {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: $radius-full;
  color: $white;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-xl;
  animation: fadeInUp 0.8s ease-out backwards;

  svg {
    stroke-width: 2.5;
  }
}

.premium-cta-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: $font-weight-bold;
  color: $white;
  margin-bottom: $spacing-lg;
  line-height: 1.2;
  animation: fadeInUp 0.8s ease-out 0.1s backwards;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.premium-cta-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba($white, 0.95);
  line-height: 1.7;
  margin-bottom: $spacing-2xl;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.cta-features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: $spacing-xl;
  margin-bottom: $spacing-2xl;
  animation: fadeInUp 0.8s ease-out 0.3s backwards;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
  }
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $white;
  font-size: $font-size-base;
  font-weight: $font-weight-medium;
  padding: $spacing-sm $spacing-md;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-xl;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  svg {
    flex-shrink: 0;
    stroke-width: 2;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
}

.cta-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.4s backwards;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    width: 100%;
  }
}

// Buttons - Premium
.btn {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-full;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  font-size: $font-size-base;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  &:hover::before {
    transform: translateX(100%);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }

  &.btn-primary {
    background: $white;
    color: $primary;
    box-shadow: $shadow-lg;

    &:hover {
      transform: translateY(-2px);
      box-shadow: $shadow-xl;
    }
  }

  &.btn-glass {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    color: $white;
    border: 1px solid rgba(255, 255, 255, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }
  }

  &.btn-white {
    background: $white;
    color: $primary;
    box-shadow: $shadow-xl;

    &:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
  }

  &.btn-lg {
    padding: $spacing-lg $spacing-2xl;
    font-size: $font-size-lg;
  }
}

.container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $container-padding;
}

// Categories Showcase Section
.categories-showcase {
  padding: 6rem 0;
  background: linear-gradient(180deg, $white 0%, #f8f9fa 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    left: 50%;
    transform: translateX(-50%);
    width: 1000px;
    height: 1000px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  @media (max-width: $breakpoint-md) {
    padding: 4rem 0;
  }
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-xl;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }
}

.category-card {
  position: relative;
  height: 320px;
  border-radius: $radius-2xl;
  overflow: hidden;
  text-decoration: none;
  display: block;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);

    &::before {
      opacity: 1;
    }

    .category-image {
      img {
        transform: scale(1.15);
        filter: brightness(0.6);
      }

      .category-overlay {
        opacity: 0.9;
      }
    }

    .category-content {
      transform: translateY(-10px);
    }

    .category-arrow {
      transform: translateX(8px) scale(1.2);
      opacity: 1;
    }

    .category-title {
      color: $white;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }
  }
}

.category-image {
  position: absolute;
  inset: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    filter: brightness(0.75);
  }

  .category-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.8) 100%
    );
    opacity: 0.8;
    transition: opacity 0.5s ease;
  }
}

.category-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-xl;
  z-index: 3;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.category-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $white;
  margin-bottom: $spacing-xs;
  transition: all 0.3s ease;
}

.category-count {
  font-size: $font-size-sm;
  color: rgba($white, 0.9);
  font-weight: $font-weight-medium;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.category-arrow {
  position: absolute;
  bottom: $spacing-xl;
  right: $spacing-xl;
  color: $white;
  opacity: 0;
  transform: translateX(0);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
}

// Testimonials Section
.testimonials-section {
  padding: 6rem 0;
  background: $white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -20%;
    width: 140%;
    height: 100%;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: $breakpoint-md) {
    padding: 4rem 0;
  }
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-xl;
  margin-bottom: $spacing-3xl;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }
}

.testimonial-card {
  position: relative;
  background: $white;
  padding: $spacing-2xl;
  border-radius: $radius-2xl;
  border: 2px solid $gray-100;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;

  &::before {
    content: '"';
    position: absolute;
    top: -20px;
    left: $spacing-xl;
    font-size: 6rem;
    font-weight: $font-weight-bold;
    color: rgba(99, 102, 241, 0.1);
    line-height: 1;
    font-family: Georgia, serif;
  }

  &:hover {
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-8px);
    box-shadow:
      0 20px 40px rgba(99, 102, 241, 0.15),
      0 0 0 1px rgba(99, 102, 241, 0.1);

    .avatar-circle {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
    }

    .testimonial-rating svg {
      transform: scale(1.1);
    }
  }

  @for $i from 0 through 2 {
    &[data-index='#{$i}'] {
      animation: fadeInUp 0.6s ease-out #{$i * 0.15s} backwards;
    }
  }
}

.testimonial-header {
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;
  margin-bottom: $spacing-lg;
  position: relative;
  z-index: 1;
}

.testimonial-avatar {
  flex-shrink: 0;
}

.avatar-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #fb923c 100%);
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: $font-weight-bold;
  font-size: $font-size-lg;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonial-author {
  flex: 1;
}

.author-name {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin: 0 0 0.25rem 0;
}

.author-position {
  font-size: $font-size-sm;
  color: $gray-600;
  margin: 0;
}

.testimonial-rating {
  display: flex;
  gap: 0.25rem;
  color: #f59e0b;

  svg {
    transition: transform 0.3s ease;
  }
}

.testimonial-text {
  font-size: $font-size-base;
  line-height: $line-height-relaxed;
  color: $gray-700;
  margin: 0;
  font-style: italic;
  position: relative;
  z-index: 1;
}

// Stats Bar
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-xl;
  padding: $spacing-2xl;
  background: linear-gradient(135deg,
    rgba(99, 102, 241, 0.05) 0%,
    rgba(236, 72, 153, 0.05) 100%
  );
  border-radius: $radius-2xl;
  border: 2px solid rgba(99, 102, 241, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      transparent 0%,
      rgba(255, 255, 255, 0.5) 50%,
      transparent 100%
    );
    transform: translateX(-100%);
    transition: transform 0.8s ease;
  }

  &:hover::before {
    transform: translateX(100%);
  }

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  position: relative;
  z-index: 1;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -#{$spacing-xl / 2};
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 60%;
    background: linear-gradient(180deg,
      transparent 0%,
      rgba(99, 102, 241, 0.3) 50%,
      transparent 100%
    );

    @media (max-width: $breakpoint-lg) {
      display: none;
    }
  }
}

.stat-icon {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: $radius-xl;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #fb923c 100%);
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .stat-item:hover & {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
  }
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  background: linear-gradient(135deg, #f59e0b 0%, #fb923c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: $font-size-sm;
  color: $gray-600;
  font-weight: $font-weight-medium;
}
</style>
