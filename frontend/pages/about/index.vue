<template>
  <div class="about-page">
    <PageHeader
      title="О компании КМО24"
      description="Комиссионный магазин профессионального оборудования для кафе и ресторанов"
      background-image="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&h=400&fit=crop"
      :breadcrumbs="[{ text: 'О компании' }]"
    />

    <!-- Story Section -->
    <section class="story-section">
      <div class="container">
        <div class="story-grid">
          <div class="story-content">
            <h2 class="section-title">Наша история</h2>
            <p class="story-text">
              КМО24 - комиссионный магазин оборудования для кафе и ресторанов в Красноярске.
              Мы специализируемся на реализации б/у пищевого и хлебопекарного оборудования высокого качества.
            </p>
            <p class="story-text">
              ИП Нижник Виталий Робертович предлагает широкий ассортимент профессионального оборудования:
              от тепловых плит и печей до мясоперерабатывающих машин и холодильного оборудования.
              Мы помогаем ресторанам и кафе экономить, предлагая качественное оборудование по доступным ценам.
            </p>
            <div class="story-features">
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>Проверенное б/у оборудование</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <span>Выгодные цены</span>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <span>Работаем пн-пт 9:00-17:30</span>
              </div>
            </div>
          </div>
          <div class="story-image">
            <div class="image-card">
              <div class="image-placeholder">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                  <rect width="200" height="200" rx="20" fill="url(#gradient1)"/>
                  <path d="M100 60L60 90L100 120L140 90L100 60Z" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M60 130L100 160L140 130" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M60 110L100 140L140 110" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                  <defs>
                    <linearGradient id="gradient1" x1="0" y1="0" x2="200" y2="200">
                      <stop offset="0%" stop-color="#f59e0b"/>
                      <stop offset="100%" stop-color="#ea580c"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">300+</div>
            <div class="stat-label">Единиц оборудования</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">7</div>
            <div class="stat-label">Категорий товаров</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">100%</div>
            <div class="stat-label">Проверенное оборудование</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">9-20</div>
            <div class="stat-label">Часы работы ежедневно</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="container">
        <h2 class="section-title text-center">Наши ценности</h2>
        <p class="section-subtitle text-center">
          Принципы, которыми мы руководствуемся в работе
        </p>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="value-title">Качество</h3>
            <p class="value-description">
              Мы тщательно отбираем каждый товар, чтобы гарантировать высочайшее качество и подлинность.
            </p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="value-title">Надежность</h3>
            <p class="value-description">
              Мы всегда выполняем свои обещания и обеспечиваем надежное обслуживание на каждом этапе.
            </p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="value-title">Забота</h3>
            <p class="value-description">
              Мы ставим потребности наших клиентов на первое место и стремимся превзойти ожидания.
            </p>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="value-title">Инновации</h3>
            <p class="value-description">
              Мы постоянно совершенствуемся и внедряем новые технологии для улучшения вашего опыта.
            </p>
          </div>
        </div>
      </div>
    </section>


    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Готовы начать покупки?</h2>
          <p class="cta-subtitle">
            Присоединяйтесь к тысячам довольных клиентов
          </p>
          <NuxtLink to="/products" class="btn btn-primary btn-lg">
            <span>Перейти в каталог</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'О компании - КМО24',
  meta: [
    {
      name: 'description',
      content: 'КМО24 - комиссионный магазин оборудования для кафе и ресторанов в Красноярске. Б/у пищевое и хлебопекарное оборудование по выгодным ценам.',
    },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.about-page {
  min-height: 100vh;
}

// Story Section
.story-section {
  padding: 6rem 0;

  @media (max-width: $breakpoint-md) {
    padding: 4rem 0;
  }
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-3xl;
  align-items: center;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
    gap: $spacing-2xl;
  }
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-lg;

  &.text-center {
    text-align: center;
  }
}

.story-text {
  font-size: $font-size-lg;
  color: $gray-600;
  line-height: $line-height-relaxed;
  margin-bottom: $spacing-lg;
}

.story-features {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
  margin-top: $spacing-xl;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  font-weight: $font-weight-medium;
  color: $gray-700;

  .feature-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: $radius-lg;
    background: rgba($primary, 0.1);
    color: $primary;
    flex-shrink: 0;
  }
}

.story-image {
  display: flex;
  justify-content: center;
}

.image-card {
  position: relative;
  border-radius: $radius-2xl;
  padding: $spacing-2xl;
  background: $gray-50;
  box-shadow: $shadow-xl;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Stats Section
.stats-section {
  padding: 6rem 0;
  background: $gradient-cosmic;
  position: relative;

  @media (max-width: $breakpoint-md) {
    padding: 4rem 0;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: $spacing-2xl;
}

.stat-card {
  text-align: center;
  padding: $spacing-xl;
  background: rgba($white, 0.1);
  backdrop-filter: blur(10px);
  border-radius: $radius-2xl;
  border: 1px solid rgba($white, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
}

.stat-number {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: $font-weight-bold;
  color: $white;
  margin-bottom: $spacing-sm;
}

.stat-label {
  font-size: $font-size-lg;
  color: rgba($white, 0.9);
}

// Values Section
.values-section {
  padding: 6rem 0;
  background: $gray-50;

  @media (max-width: $breakpoint-md) {
    padding: 4rem 0;
  }
}

.section-subtitle {
  font-size: $font-size-lg;
  color: $gray-600;
  margin-bottom: $spacing-3xl;

  &.text-center {
    text-align: center;
  }
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-2xl;
}

.value-card {
  padding: $spacing-2xl;
  background: $white;
  border-radius: $radius-2xl;
  box-shadow: $shadow-md;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-colored;
  }
}

.value-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: $radius-2xl;
  background: $gradient-primary;
  color: $white;
  margin-bottom: $spacing-lg;
}

.value-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: $spacing-md;
}

.value-description {
  color: $gray-600;
  line-height: $line-height-relaxed;
}

// Team Section
.team-section {
  padding: 6rem 0;

  @media (max-width: $breakpoint-md) {
    padding: 4rem 0;
  }
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-2xl;
}

.team-card {
  text-align: center;
  padding: $spacing-2xl;
  background: $white;
  border-radius: $radius-2xl;
  box-shadow: $shadow-md;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-lg;
  }
}

.team-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: $spacing-lg;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: $gradient-primary;
  color: $white;
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
}

.team-name {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: $spacing-sm;
}

.team-role {
  color: $gray-600;
  font-size: $font-size-base;
}

// CTA Section
.cta-section {
  padding: 6rem 0;
  background: $gradient-primary;
  position: relative;

  @media (max-width: $breakpoint-md) {
    padding: 4rem 0;
  }
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: $font-weight-bold;
  color: $white;
  margin-bottom: $spacing-md;
}

.cta-subtitle {
  font-size: $font-size-xl;
  color: rgba($white, 0.9);
  margin-bottom: $spacing-2xl;
}

// Button
.btn {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-lg $spacing-2xl;
  border-radius: $radius-full;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  font-size: $font-size-lg;

  &.btn-primary {
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

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
}

.container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $container-padding;
}
</style>
