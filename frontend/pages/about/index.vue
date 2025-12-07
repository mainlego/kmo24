<template>
  <div class="about-page">
    <PageHeader
      :title="pageEditor.getElementValue('about-header-title', 'О компании КМО24')"
      :description="pageEditor.getElementValue('about-header-description', 'Комиссионный магазин профессионального оборудования для кафе и ресторанов')"
      background-image="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1920&h=400&fit=crop"
      :breadcrumbs="[{ text: 'О компании' }]"
    />

    <!-- Story Section -->
    <section class="story-section">
      <div class="container">
        <div class="story-grid">
          <div class="story-content">
            <AdminEditableElement
              element-id="about-story-title"
              tag="h2"
              type="text"
              label="Заголовок истории"
              class="section-title"
              :default-value="'Наша история'"
            >
              {{ pageEditor.getElementValue('about-story-title', 'Наша история') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="about-story-text1"
              tag="p"
              type="text"
              label="Текст истории (параграф 1)"
              class="story-text"
              :default-value="'КМО24 - комиссионный магазин оборудования для кафе и ресторанов в Красноярске. Мы специализируемся на реализации б/у пищевого и хлебопекарного оборудования высокого качества.'"
            >
              {{ pageEditor.getElementValue('about-story-text1', 'КМО24 - комиссионный магазин оборудования для кафе и ресторанов в Красноярске. Мы специализируемся на реализации б/у пищевого и хлебопекарного оборудования высокого качества.') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="about-story-text2"
              tag="p"
              type="text"
              label="Текст истории (параграф 2)"
              class="story-text"
              :default-value="'ИП Нижник Виталий Робертович предлагает широкий ассортимент профессионального оборудования: от тепловых плит и печей до мясоперерабатывающих машин и холодильного оборудования. Мы помогаем ресторанам и кафе экономить, предлагая качественное оборудование по доступным ценам.'"
            >
              {{ pageEditor.getElementValue('about-story-text2', 'ИП Нижник Виталий Робертович предлагает широкий ассортимент профессионального оборудования: от тепловых плит и печей до мясоперерабатывающих машин и холодильного оборудования. Мы помогаем ресторанам и кафе экономить, предлагая качественное оборудование по доступным ценам.') }}
            </AdminEditableElement>
            <div class="story-features">
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <AdminEditableElement
                  element-id="about-feature1"
                  tag="span"
                  type="text"
                  label="Преимущество 1"
                  :default-value="'Проверенное б/у оборудование'"
                >
                  {{ pageEditor.getElementValue('about-feature1', 'Проверенное б/у оборудование') }}
                </AdminEditableElement>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <AdminEditableElement
                  element-id="about-feature2"
                  tag="span"
                  type="text"
                  label="Преимущество 2"
                  :default-value="'Выгодные цены'"
                >
                  {{ pageEditor.getElementValue('about-feature2', 'Выгодные цены') }}
                </AdminEditableElement>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <AdminEditableElement
                  element-id="about-feature3"
                  tag="span"
                  type="text"
                  label="Преимущество 3"
                  :default-value="'Работаем пн-пт 9:00-17:30'"
                >
                  {{ pageEditor.getElementValue('about-feature3', 'Работаем пн-пт 9:00-17:30') }}
                </AdminEditableElement>
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
                      <stop offset="0%" stop-color="#f59e0be6"/>
                      <stop offset="100%" stop-color="#fbbf24"/>
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
            <AdminEditableElement
              element-id="about-stat1-number"
              tag="div"
              type="text"
              label="Статистика 1: число"
              class="stat-number"
              :default-value="'300+'"
            >
              {{ pageEditor.getElementValue('about-stat1-number', '300+') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="about-stat1-label"
              tag="div"
              type="text"
              label="Статистика 1: подпись"
              class="stat-label"
              :default-value="'Единиц оборудования'"
            >
              {{ pageEditor.getElementValue('about-stat1-label', 'Единиц оборудования') }}
            </AdminEditableElement>
          </div>
          <div class="stat-card">
            <AdminEditableElement
              element-id="about-stat2-number"
              tag="div"
              type="text"
              label="Статистика 2: число"
              class="stat-number"
              :default-value="'7'"
            >
              {{ pageEditor.getElementValue('about-stat2-number', '7') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="about-stat2-label"
              tag="div"
              type="text"
              label="Статистика 2: подпись"
              class="stat-label"
              :default-value="'Категорий товаров'"
            >
              {{ pageEditor.getElementValue('about-stat2-label', 'Категорий товаров') }}
            </AdminEditableElement>
          </div>
          <div class="stat-card">
            <AdminEditableElement
              element-id="about-stat3-number"
              tag="div"
              type="text"
              label="Статистика 3: число"
              class="stat-number"
              :default-value="'100%'"
            >
              {{ pageEditor.getElementValue('about-stat3-number', '100%') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="about-stat3-label"
              tag="div"
              type="text"
              label="Статистика 3: подпись"
              class="stat-label"
              :default-value="'Проверенное оборудование'"
            >
              {{ pageEditor.getElementValue('about-stat3-label', 'Проверенное оборудование') }}
            </AdminEditableElement>
          </div>
          <div class="stat-card">
            <AdminEditableElement
              element-id="about-stat4-number"
              tag="div"
              type="text"
              label="Статистика 4: число"
              class="stat-number"
              :default-value="'9-20'"
            >
              {{ pageEditor.getElementValue('about-stat4-number', '9-20') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="about-stat4-label"
              tag="div"
              type="text"
              label="Статистика 4: подпись"
              class="stat-label"
              :default-value="'Часы работы ежедневно'"
            >
              {{ pageEditor.getElementValue('about-stat4-label', 'Часы работы ежедневно') }}
            </AdminEditableElement>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="container">
        <AdminEditableElement
          element-id="about-values-title"
          tag="h2"
          type="text"
          label="Заголовок ценностей"
          class="section-title text-center"
          :default-value="'Наши ценности'"
        >
          {{ pageEditor.getElementValue('about-values-title', 'Наши ценности') }}
        </AdminEditableElement>
        <AdminEditableElement
          element-id="about-values-subtitle"
          tag="p"
          type="text"
          label="Подзаголовок ценностей"
          class="section-subtitle text-center"
          :default-value="'Принципы, которыми мы руководствуемся в работе'"
        >
          {{ pageEditor.getElementValue('about-values-subtitle', 'Принципы, которыми мы руководствуемся в работе') }}
        </AdminEditableElement>
        <div class="values-grid">
          <div class="value-card">
            <div class="value-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <AdminEditableElement
              element-id="about-value1-title"
              tag="h3"
              type="text"
              label="Ценность 1: заголовок"
              class="value-title"
              :default-value="'Качество'"
            >
              {{ pageEditor.getElementValue('about-value1-title', 'Качество') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="about-value1-description"
              tag="p"
              type="text"
              label="Ценность 1: описание"
              class="value-description"
              :default-value="'Мы тщательно отбираем каждый товар, чтобы гарантировать высочайшее качество и подлинность.'"
            >
              {{ pageEditor.getElementValue('about-value1-description', 'Мы тщательно отбираем каждый товар, чтобы гарантировать высочайшее качество и подлинность.') }}
            </AdminEditableElement>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <AdminEditableElement
              element-id="about-value2-title"
              tag="h3"
              type="text"
              label="Ценность 2: заголовок"
              class="value-title"
              :default-value="'Надежность'"
            >
              {{ pageEditor.getElementValue('about-value2-title', 'Надежность') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="about-value2-description"
              tag="p"
              type="text"
              label="Ценность 2: описание"
              class="value-description"
              :default-value="'Мы всегда выполняем свои обещания и обеспечиваем надежное обслуживание на каждом этапе.'"
            >
              {{ pageEditor.getElementValue('about-value2-description', 'Мы всегда выполняем свои обещания и обеспечиваем надежное обслуживание на каждом этапе.') }}
            </AdminEditableElement>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <AdminEditableElement
              element-id="about-value3-title"
              tag="h3"
              type="text"
              label="Ценность 3: заголовок"
              class="value-title"
              :default-value="'Забота'"
            >
              {{ pageEditor.getElementValue('about-value3-title', 'Забота') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="about-value3-description"
              tag="p"
              type="text"
              label="Ценность 3: описание"
              class="value-description"
              :default-value="'Мы ставим потребности наших клиентов на первое место и стремимся превзойти ожидания.'"
            >
              {{ pageEditor.getElementValue('about-value3-description', 'Мы ставим потребности наших клиентов на первое место и стремимся превзойти ожидания.') }}
            </AdminEditableElement>
          </div>

          <div class="value-card">
            <div class="value-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <AdminEditableElement
              element-id="about-value4-title"
              tag="h3"
              type="text"
              label="Ценность 4: заголовок"
              class="value-title"
              :default-value="'Инновации'"
            >
              {{ pageEditor.getElementValue('about-value4-title', 'Инновации') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="about-value4-description"
              tag="p"
              type="text"
              label="Ценность 4: описание"
              class="value-description"
              :default-value="'Мы постоянно совершенствуемся и внедряем новые технологии для улучшения вашего опыта.'"
            >
              {{ pageEditor.getElementValue('about-value4-description', 'Мы постоянно совершенствуемся и внедряем новые технологии для улучшения вашего опыта.') }}
            </AdminEditableElement>
          </div>
        </div>
      </div>
    </section>


    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <AdminEditableElement
            element-id="about-cta-title"
            tag="h2"
            type="text"
            label="CTA заголовок"
            class="cta-title"
            :default-value="'Готовы начать покупки?'"
          >
            {{ pageEditor.getElementValue('about-cta-title', 'Готовы начать покупки?') }}
          </AdminEditableElement>
          <AdminEditableElement
            element-id="about-cta-subtitle"
            tag="p"
            type="text"
            label="CTA подзаголовок"
            class="cta-subtitle"
            :default-value="'Присоединяйтесь к тысячам довольных клиентов'"
          >
            {{ pageEditor.getElementValue('about-cta-subtitle', 'Присоединяйтесь к тысячам довольных клиентов') }}
          </AdminEditableElement>
          <NuxtLink to="/products" class="btn btn-primary btn-lg">
            <AdminEditableElement
              element-id="about-cta-btn"
              tag="span"
              type="text"
              label="CTA кнопка"
              :default-value="'Перейти в каталог'"
            >
              {{ pageEditor.getElementValue('about-cta-btn', 'Перейти в каталог') }}
            </AdminEditableElement>
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
import { onMounted } from 'vue';
import { usePageEditor } from '../../composables/usePageEditor';

const pageEditor = usePageEditor();

onMounted(async () => {
  await pageEditor.loadPageContent('about');
});

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
  background: $gradient-hero;
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

// Container is defined globally in main.scss
</style>
