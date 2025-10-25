<template>
  <div class="home-page">
    <!-- Hero Section with Image Background -->
    <section ref="heroSection" class="hero">
      <!-- Background Image with Parallax -->
      <div class="hero-background" :style="{ transform: `translateY(${parallaxOffset}px)` }">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&q=80"
          alt="Профессиональное оборудование для кафе и ресторанов"
          class="hero-bg-image"
        />
        <!-- Gradient Overlay with Blur -->
        <div class="hero-overlay"></div>
        <!-- Animated Particles -->
        <div class="particles">
          <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>

      <div class="container">
        <div class="hero-content">
          <div class="hero-badge animate-fade-in-up" :class="{ 'is-visible': isVisible }">
            <span class="badge-icon">🔥</span>
            <span>Б/У оборудование премиум качества</span>
          </div>
          <h1 class="hero-title animate-fade-in-up delay-1" :class="{ 'is-visible': isVisible }">
            Профессиональное оборудование
            <span class="gradient-text">для вашего бизнеса</span>
          </h1>
          <p class="hero-subtitle animate-fade-in-up delay-2" :class="{ 'is-visible': isVisible }">
            КМО24 - комиссионный магазин проверенного оборудования для кафе и ресторанов в Красноярске
          </p>
          <div class="hero-actions animate-fade-in-up delay-3" :class="{ 'is-visible': isVisible }">
            <NuxtLink to="/products" class="btn btn-primary btn-glow">
              <span>Каталог оборудования</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>
            <NuxtLink to="/contacts" class="btn btn-glass">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Связаться с нами</span>
            </NuxtLink>
          </div>
          <div class="hero-stats animate-fade-in-up delay-4" :class="{ 'is-visible': isVisible }">
            <div class="stat-item">
              <div class="stat-number" ref="stat1">300+</div>
              <div class="stat-label">Единиц оборудования</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number" ref="stat2">7</div>
              <div class="stat-label">Категорий</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number" ref="stat3">100%</div>
              <div class="stat-label">Проверенное</div>
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

    <!-- Premium CTA Section -->
    <section class="premium-cta">
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

.home-page {
  min-height: 100vh;
  overflow: hidden;
}

// Hero Section - Premium with Image
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  text-align: center;
  padding: $spacing-3xl 0;
  overflow: hidden;

  @media (max-width: $breakpoint-md) {
    min-height: 80vh;
    padding: 6rem 0 $spacing-3xl;
  }
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: -1;
  will-change: transform;
  transform-origin: center;
  transition: transform 0.1s ease-out;
}

.hero-bg-image {
  width: 100%;
  height: 120%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.7);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.85) 0%,
    rgba(234, 88, 12, 0.75) 50%,
    rgba(124, 58, 237, 0.7) 100%
  );
  backdrop-filter: blur(2px);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  }
}

// Animated Particles
.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float-particle linear infinite;
  will-change: transform;
  transition: transform 0.3s ease-out;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

// Fade in up animations
.animate-fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  &.delay-1 {
    transition-delay: 0.1s;
  }
  &.delay-2 {
    transition-delay: 0.2s;
  }
  &.delay-3 {
    transition-delay: 0.3s;
  }
  &.delay-4 {
    transition-delay: 0.4s;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $radius-full;
  color: $white;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  margin-bottom: $spacing-xl;
  animation: slideDown 1s ease-out 0.2s backwards;

  .badge-icon {
    font-size: 1.2em;
    animation: sparkle 2s infinite;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes sparkle {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(15deg);
  }
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: $font-weight-bold;
  color: $white;
  margin-bottom: $spacing-lg;
  line-height: 1.2;
  animation: fadeInUp 1s ease-out 0.3s backwards;

  .gradient-text {
    display: inline-block;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
}

@keyframes shimmer {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba($white, 0.9);
  margin-bottom: $spacing-2xl;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  animation: fadeInUp 1s ease-out 0.4s backwards;
}

.hero-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: $spacing-3xl;

  .btn {
    padding: $spacing-md $spacing-xl;
    border-radius: $radius-xl;
    font-weight: $font-weight-semibold;
    font-size: $font-size-lg;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;

    svg {
      transition: transform 0.3s ease;
    }

    &:hover svg {
      transform: translateX(4px);
    }
  }

  .btn-primary {
    background: $gradient-primary;
    color: $white;
    box-shadow: 0 10px 40px rgba(245, 158, 11, 0.4);

    &:hover {
      box-shadow: 0 15px 50px rgba(245, 158, 11, 0.5);
      transform: translateY(-3px);
    }

    &.btn-glow {
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        transform: rotate(45deg);
        animation: shine 3s infinite;
      }
    }
  }

  .btn-glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: $white;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-3px);
    }
  }
}

@keyframes shine {
  0% {
    left: -50%;
    top: -50%;
  }
  100% {
    left: 150%;
    top: 150%;
  }
}

// Scroll Indicator
.scroll-indicator {
  position: absolute;
  bottom: $spacing-2xl;
  left: 50%;
  transform: translateX(-50%);
  color: rgba($white, 0.8);
  cursor: pointer;
  z-index: 10;

  svg {
    width: 32px;
    height: 32px;
  }

  &.animate-bounce {
    animation: bounce 2s infinite;
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xl;
  padding: $spacing-xl;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $radius-2xl;
  max-width: 600px;
  margin: 0 auto;
  animation: fadeInUp 1s ease-out 0.6s backwards;

  @media (max-width: $breakpoint-sm) {
    gap: $spacing-md;
    padding: $spacing-md;
  }
}

.stat-item {
  text-align: center;
  color: $white;
}

.stat-number {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  margin-bottom: $spacing-xs;

  @media (max-width: $breakpoint-sm) {
    font-size: $font-size-2xl;
  }
}

.stat-label {
  font-size: $font-size-sm;
  color: rgba($white, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba($white, 0.3);

  @media (max-width: $breakpoint-sm) {
    height: 30px;
  }
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

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: $radius-2xl;
    padding: 2px;
    background: linear-gradient(135deg, $primary, $secondary);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: $shadow-colored;

    &::before {
      opacity: 1;
    }

    .feature-icon {
      transform: scale(1.1) rotate(5deg);
      box-shadow: $shadow-glow;
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
  background: $gradient-primary;
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  svg {
    width: 32px;
    height: 32px;
  }
}

.feature-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: $spacing-md;
}

.feature-description {
  color: $gray-600;
  line-height: $line-height-relaxed;
  font-size: $font-size-base;
}

// Premium CTA Section
.premium-cta {
  padding: 8rem 0;
  background: linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%);
  position: relative;
  overflow: hidden;

  @media (max-width: $breakpoint-md) {
    padding: 5rem 0;
  }
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
</style>
