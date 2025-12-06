<template>
  <div class="home-page">
    <!-- Premium Hero Section with Video Background -->
    <section ref="heroSection" class="hero">
      <!-- Background with Video -->
      <div class="hero-background">
        <video
          autoplay
          muted
          loop
          playsinline
          class="hero-bg-video"
        >
          <source src="/assets/backgrounds/hero_bg.webm" type="video/webm">
        </video>
        <!-- Dark Overlay -->
        <div class="hero-overlay"></div>
        <!-- Animated Gradient Mesh -->
        <div class="gradient-mesh"></div>
      </div>

      <div class="container">
        <div class="hero-wrapper">
          <!-- Main Content -->
          <div class="hero-content">
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

          <!-- Action Cards (Right Column) -->
          <div class="hero-actions-grid animate-fade-in delay-5" :class="{ 'is-visible': isVisible }">
            <div class="action-card action-buy" @click="$router.push('/products')">
              <div class="action-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M9 20C9 21.1 8.1 22 7 22C5.9 22 5 21.1 5 20C5 18.9 5.9 18 7 18C8.1 18 9 18.9 9 20ZM17 18C15.9 18 15 18.9 15 20C15 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18ZM7.2 14.8V14.7L8.1 13H15.5C16.2 13 16.9 12.6 17.2 12L21 5H6.2L5 2H2V4H4L7.6 11.6L6.2 14.2C5.5 15.4 6.2 17 7.7 17H19V15H7.7C7.6 15 7.5 14.9 7.5 14.8L7.2 14.8Z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="action-content">
                <h3 class="action-title">Купить оборудование</h3>
                <p class="action-desc">Большой выбор проверенной техники для вашего бизнеса</p>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="action-card action-sell" @click="showSellForm = true">
              <div class="action-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="action-content">
                <h3 class="action-title">Продать оборудование</h3>
                <p class="action-desc">Выкупим вашу технику по выгодной цене</p>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="action-card action-consult" @click="showConsultForm = true">
              <div class="action-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="action-content">
                <h3 class="action-title">Получить консультацию</h3>
                <p class="action-desc">Поможем подобрать оборудование под ваши задачи</p>
                <div class="action-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14m0 0l-7-7m7 7l-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
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
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="advantage-content">
                <div class="advantage-title">Широкий ассортимент</div>
                <div class="advantage-desc">Более 300 единиц техники</div>
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
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="advantage-content">
                <div class="advantage-title">Выгодные цены</div>
                <div class="advantage-desc">Экономия до 70%</div>
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

    <!-- Minimal CTA Section -->
    <section class="minimal-cta">
      <div class="cta-overlay"></div>
      <div class="container">
        <div class="minimal-cta-content">
          <h2 class="minimal-cta-title">Ищете надежное оборудование?</h2>
          <p class="minimal-cta-subtitle">Более 300 единиц техники с экономией до 70%</p>
          <div class="cta-actions">
            <NuxtLink to="/products" class="btn btn-white">
              <span>Смотреть каталог</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </NuxtLink>
            <NuxtLink to="/contacts" class="btn btn-glass">
              <span>Связаться с нами</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Sell Equipment Modal -->
    <Teleport to="body">
      <div v-if="showSellForm" class="modal-overlay" @click.self="showSellForm = false">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Продать оборудование</h2>
            <button @click="showSellForm = false" class="modal-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="submitSellForm" class="modal-form">
            <div class="form-group">
              <label>Тип оборудования *</label>
              <input type="text" v-model="sellForm.equipmentType" required placeholder="Например: Холодильник, печь, фритюрница">
            </div>
            <div class="form-group">
              <label>Марка и модель</label>
              <input type="text" v-model="sellForm.brand" placeholder="Например: Rational SCC 61">
            </div>
            <div class="form-group">
              <label>Состояние *</label>
              <select v-model="sellForm.condition" required>
                <option value="">Выберите состояние</option>
                <option value="excellent">Отличное</option>
                <option value="good">Хорошее</option>
                <option value="normal">Нормальное</option>
                <option value="repair">Требует ремонта</option>
              </select>
            </div>
            <div class="form-group">
              <label>Год выпуска</label>
              <input type="number" v-model="sellForm.year" placeholder="2020" min="1990" :max="new Date().getFullYear()">
            </div>
            <div class="form-group">
              <label>Описание</label>
              <textarea v-model="sellForm.description" rows="3" placeholder="Опишите состояние оборудования, особенности, комплектацию"></textarea>
            </div>
            <div class="form-group">
              <label>Ваше имя *</label>
              <input type="text" v-model="sellForm.name" required placeholder="Иван">
            </div>
            <div class="form-group">
              <label>Телефон *</label>
              <input type="tel" v-model="sellForm.phone" required placeholder="+7 (999) 123-45-67">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="sellForm.email" placeholder="email@example.com">
            </div>
            <div class="form-actions">
              <button type="button" @click="showSellForm = false" class="btn-secondary">Отмена</button>
              <button type="submit" class="btn-primary">Отправить заявку</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Consultation Modal -->
    <Teleport to="body">
      <div v-if="showConsultForm" class="modal-overlay" @click.self="showConsultForm = false">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Получить консультацию</h2>
            <button @click="showConsultForm = false" class="modal-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="submitConsultForm" class="modal-form">
            <div class="form-group">
              <label>Тема консультации *</label>
              <select v-model="consultForm.subject" required>
                <option value="">Выберите тему</option>
                <option value="equipment-selection">Подбор оборудования</option>
                <option value="technical">Технические вопросы</option>
                <option value="delivery">Доставка и оплата</option>
                <option value="warranty">Гарантия и сервис</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ваш вопрос *</label>
              <textarea v-model="consultForm.question" rows="4" required placeholder="Опишите, что вас интересует"></textarea>
            </div>
            <div class="form-group">
              <label>Ваше имя *</label>
              <input type="text" v-model="consultForm.name" required placeholder="Иван">
            </div>
            <div class="form-group">
              <label>Телефон *</label>
              <input type="tel" v-model="consultForm.phone" required placeholder="+7 (999) 123-45-67">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="consultForm.email" placeholder="email@example.com">
            </div>
            <div class="form-group">
              <label>Удобное время для звонка</label>
              <input type="text" v-model="consultForm.callTime" placeholder="Например: с 10:00 до 18:00">
            </div>
            <div class="form-actions">
              <button type="button" @click="showConsultForm = false" class="btn-secondary">Отмена</button>
              <button type="submit" class="btn-primary">Отправить заявку</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// SEO metadata

// Parallax effect
const parallaxOffset = ref(0);
const heroSection = ref<HTMLElement | null>(null);

// Animation visibility
const isVisible = ref(false);

// Modal states
const showSellForm = ref(false);
const showConsultForm = ref(false);

// Form data
const sellForm = ref({
  equipmentType: '',
  brand: '',
  condition: '',
  year: '',
  description: '',
  name: '',
  phone: '',
  email: ''
});

const consultForm = ref({
  subject: '',
  question: '',
  name: '',
  phone: '',
  email: '',
  callTime: ''
});

// Form submissions
const submitSellForm = async () => {
  try {
    // For now, just show success message - API endpoint will be added later
    alert('Заявка на продажу оборудования отправлена! Мы свяжемся с вами в ближайшее время.');
    showSellForm.value = false;
    // Reset form
    sellForm.value = {
      equipmentType: '',
      brand: '',
      condition: '',
      year: '',
      description: '',
      name: '',
      phone: '',
      email: ''
    };
  } catch (error) {
    alert('Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
  }
};

const submitConsultForm = async () => {
  try {
    // For now, just show success message - API endpoint will be added later
    alert('Заявка на консультацию отправлена! Наш специалист свяжется с вами в ближайшее время.');
    showConsultForm.value = false;
    // Reset form
    consultForm.value = {
      subject: '',
      question: '',
      name: '',
      phone: '',
      email: '',
      callTime: ''
    };
  } catch (error) {
    alert('Ошибка при отправке заявки. Пожалуйста, попробуйте позже.');
  }
};

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

// Minimal CTA Section
.minimal-cta {
  padding: 4rem 0;
  position: relative;
  overflow: hidden;
  background: $gradient-primary;

  @media (max-width: $breakpoint-md) {
    padding: 3rem 0;
  }
}

.minimal-cta .cta-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.05) 100%
  );
}

.minimal-cta-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-xl;
  flex-wrap: wrap;
  text-align: center;

  @media (max-width: $breakpoint-md) {
    flex-direction: column;
    gap: $spacing-lg;
  }
}

.minimal-cta-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $white;
  margin: 0;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-xl;
  }
}

.minimal-cta-subtitle {
  font-size: $font-size-base;
  color: rgba($white, 0.9);
  margin: 0;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-sm;
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

// Container is defined globally in main.scss

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
    background: radial-gradient(circle, rgba($primary-500, 0.05) 0%, transparent 70%);
    pointer-events: none;

    @media (max-width: $breakpoint-md) {
      width: 600px;
      height: 600px;
      top: -50px;
    }
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
    background: linear-gradient(135deg, rgba($primary-500, 0.1) 0%, rgba($primary-light, 0.1) 100%);
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
      radial-gradient(ellipse at 30% 20%, rgba($primary-500, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 80%, rgba($primary-light, 0.08) 0%, transparent 50%);
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
    color: rgba($primary-500, 0.1);
    line-height: 1;
    font-family: Georgia, serif;
  }

  &:hover {
    border-color: rgba($primary-500, 0.3);
    transform: translateY(-8px);
    box-shadow:
      0 20px 40px rgba($primary-500, 0.15),
      0 0 0 1px rgba($primary-500, 0.1);

    .avatar-circle {
      transform: scale(1.1) rotate(5deg);
      box-shadow: 0 8px 16px rgba($primary-500, 0.3);
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
  background: linear-gradient(135deg, #f59e0be6 0%, #fbbf24 50%, #fbbf24 100%);
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: $font-weight-bold;
  font-size: $font-size-lg;
  box-shadow: 0 4px 12px rgba($primary-500, 0.2);
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
  color: #f59e0be6;

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
    rgba($primary-500, 0.05) 0%,
    rgba($primary-light, 0.05) 100%
  );
  border-radius: $radius-2xl;
  border: 2px solid rgba($primary-500, 0.1);
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
      rgba($primary-500, 0.3) 50%,
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
  background: linear-gradient(135deg, #f59e0be6 0%, #fbbf24 50%, #fbbf24 100%);
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
    box-shadow: 0 8px 16px rgba($primary-500, 0.3);
  }
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  background: linear-gradient(135deg, #f59e0be6 0%, #fbbf24 100%);
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

// Action Cards Grid
.hero-actions-grid {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: $spacing-lg;
  min-width: 380px;

  @media (max-width: $breakpoint-lg) {
    min-width: unset;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
  }

  @media (max-width: $breakpoint-md) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
    max-width: 400px;
    margin: 0 auto;
  }
}

.action-card {
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  padding: $spacing-xl;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: $radius-2xl;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateX(-10px);
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

    &::before {
      transform: translateX(100%);
    }

    .action-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .action-arrow {
      transform: translateX(5px);
      opacity: 1;
    }
  }

  &.action-buy {
    .action-icon {
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    }
  }

  &.action-sell {
    .action-icon {
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
    }
  }

  &.action-consult {
    .action-icon {
      background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    }
  }
}

.action-icon {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-xl;
  color: $white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

  svg {
    width: 32px;
    height: 32px;
  }
}

.action-content {
  flex: 1;
  position: relative;
}

.action-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $white;
  margin-bottom: $spacing-xs;
}

.action-desc {
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
}

.action-arrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  opacity: 0;
  transition: all 0.3s ease;
}

// Modal Styles
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: $spacing-xl;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

.modal-container {
  background: $white;
  border-radius: $radius-2xl;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-xl;
  border-bottom: 1px solid $gray-200;

  h2 {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $gray-900;
    margin: 0;
  }
}

.modal-close {
  background: none;
  border: none;
  padding: $spacing-sm;
  cursor: pointer;
  color: $gray-500;
  transition: all 0.2s ease;
  border-radius: $radius-lg;

  &:hover {
    background: $gray-100;
    color: $gray-700;
  }
}

.modal-form {
  padding: $spacing-xl;
}

.form-group {
  margin-bottom: $spacing-lg;

  label {
    display: block;
    margin-bottom: $spacing-sm;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $gray-700;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: $spacing-md;
    border: 2px solid $gray-200;
    border-radius: $radius-lg;
    font-size: $font-size-base;
    transition: all 0.2s ease;
    background: $white;

    &:focus {
      outline: none;
      border-color: $primary-500;
      box-shadow: 0 0 0 3px rgba($primary-500, 0.1);
    }

    &::placeholder {
      color: $gray-400;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
}

.form-actions {
  display: flex;
  gap: $spacing-md;
  justify-content: flex-end;
  margin-top: $spacing-2xl;
  padding-top: $spacing-xl;
  border-top: 1px solid $gray-200;

  button {
    padding: $spacing-md $spacing-xl;
    border-radius: $radius-lg;
    font-weight: $font-weight-semibold;
    transition: all 0.2s ease;
    cursor: pointer;

    &.btn-primary {
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
      color: $white;
      border: none;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba($primary-500, 0.3);
      }
    }

    &.btn-secondary {
      background: $white;
      color: $gray-700;
      border: 2px solid $gray-300;

      &:hover {
        background: $gray-50;
        border-color: $gray-400;
      }
    }
  }
}
</style>
