<template>
  <div class="delivery-page">
    <!-- Hero Section -->
    <section class="delivery-hero">
      <!-- Background Image -->
      <div class="hero-background">
        <img
          src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1920&q=80"
          alt="Доставка"
          class="hero-bg-image"
        />
        <!-- Gradient Overlay -->
        <div class="hero-overlay"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Доставка и
            <span class="gradient-text">оплата</span>
          </h1>
          <p class="hero-subtitle">
            Быстрая доставка по всей России и удобные способы оплаты
          </p>
        </div>
      </div>
    </section>

    <!-- Delivery Methods Section -->
    <section class="delivery-methods-section">
      <div class="container">
        <h2 class="section-title">Способы доставки</h2>
        <div class="delivery-grid">
          <div class="delivery-card">
            <div class="delivery-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M13 16V6C13 4.34315 11.6569 3 10 3H4C2.34315 3 1 4.34315 1 6V16C1 17.6569 2.34315 19 4 19H10C11.6569 19 13 17.6569 13 16Z" stroke="currentColor" stroke-width="2"/>
                <path d="M13 16H18L23 11V16C23 17.6569 21.6569 19 20 19H13" stroke="currentColor" stroke-width="2"/>
                <path d="M13 6H18L23 11H13V6Z" stroke="currentColor" stroke-width="2"/>
                <path d="M5.5 19V21M10.5 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="delivery-title">Курьерская доставка</h3>
            <p class="delivery-description">
              Доставим заказ прямо к вашей двери. Курьер свяжется с вами за час до приезда.
            </p>
            <div class="delivery-details">
              <div class="detail-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>1-3 рабочих дня</span>
              </div>
              <div class="detail-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>От 500 ₽</span>
              </div>
              <div class="detail-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Бесплатно от 5000 ₽</span>
              </div>
            </div>
          </div>

          <div class="delivery-card">
            <div class="delivery-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="delivery-title">Самовывоз</h3>
            <p class="delivery-description">
              Заберите заказ из нашего пункта выдачи в удобное для вас время.
            </p>
            <div class="delivery-details">
              <div class="detail-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>1-2 рабочих дня</span>
              </div>
              <div class="detail-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Бесплатно</span>
              </div>
              <div class="detail-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>г. Москва, ул. Тверская, 1</span>
              </div>
            </div>
          </div>

          <div class="delivery-card">
            <div class="delivery-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="delivery-title">Экспресс-доставка</h3>
            <p class="delivery-description">
              Получите заказ в день оформления! Доступно для Москвы и МО.
            </p>
            <div class="delivery-details">
              <div class="detail-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>В день заказа</span>
              </div>
              <div class="detail-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>От 1000 ₽</span>
              </div>
              <div class="detail-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Заказ до 12:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Payment Methods Section -->
    <section class="payment-methods-section">
      <div class="container">
        <h2 class="section-title">Способы оплаты</h2>
        <div class="payment-grid">
          <div class="payment-card">
            <div class="payment-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
                <path d="M1 10H23" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="payment-title">Банковской картой</h3>
            <p class="payment-description">
              Принимаем Visa, MasterCard, МИР. Безопасная оплата через защищенное соединение.
            </p>
          </div>

          <div class="payment-card">
            <div class="payment-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="payment-title">Наличными</h3>
            <p class="payment-description">
              Оплата курьеру при получении заказа или в пункте самовывоза.
            </p>
          </div>

          <div class="payment-card">
            <div class="payment-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="payment-title">Электронными деньгами</h3>
            <p class="payment-description">
              Поддерживаем ЮMoney, QIWI, WebMoney и другие платежные системы.
            </p>
          </div>

          <div class="payment-card">
            <div class="payment-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="payment-title">Банковский перевод</h3>
            <p class="payment-description">
              Оплата по счету для юридических лиц с НДС или без НДС.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process-section">
      <div class="container">
        <h2 class="section-title">Как происходит доставка</h2>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="step-title">Оформление заказа</h3>
              <p class="step-description">
                Выберите товары, добавьте их в корзину и оформите заказ с указанием адреса доставки.
              </p>
            </div>
          </div>

          <div class="process-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="step-title">Подтверждение</h3>
              <p class="step-description">
                Наш менеджер свяжется с вами для подтверждения заказа и уточнения деталей.
              </p>
            </div>
          </div>

          <div class="process-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="step-title">Сборка и отправка</h3>
              <p class="step-description">
                Мы тщательно упакуем ваш заказ и передадим его курьеру или в пункт выдачи.
              </p>
            </div>
          </div>

          <div class="process-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3 class="step-title">Получение</h3>
              <p class="step-description">
                Получите заказ, проверьте комплектность и оплатите удобным способом.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Часто задаваемые вопросы</h2>
        <div class="faq-list">
          <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
            <button
              class="faq-question"
              :class="{ 'faq-question--active': activeIndex === index }"
              @click="toggleFaq(index)"
            >
              <span>{{ item.question }}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                :class="{ 'rotate': activeIndex === index }"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div v-if="activeIndex === index" class="faq-answer">
              {{ item.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Готовы сделать заказ?</h2>
          <p class="cta-subtitle">
            Выберите товары и мы доставим их в удобное для вас время
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
import { ref } from 'vue';

useHead({
  title: 'Доставка и оплата',
  meta: [
    {
      name: 'description',
      content: 'Доставка по всей России, самовывоз, экспресс-доставка. Удобные способы оплаты.',
    },
  ],
});

const activeIndex = ref<number | null>(null);

const faqItems = [
  {
    question: 'Сколько стоит доставка?',
    answer: 'Стоимость доставки зависит от способа и региона. Курьерская доставка по Москве - от 500₽, бесплатно при заказе от 5000₽. Самовывоз всегда бесплатный. Экспресс-доставка - от 1000₽.',
  },
  {
    question: 'Как долго ждать доставку?',
    answer: 'Стандартная доставка курьером занимает 1-3 рабочих дня. Самовывоз - 1-2 дня. Экспресс-доставка - в день заказа при оформлении до 12:00.',
  },
  {
    question: 'Можно ли примерить товар перед оплатой?',
    answer: 'Да, при курьерской доставке вы можете осмотреть товар перед оплатой. Если товар не подошел, вы можете отказаться от него без объяснения причин.',
  },
  {
    question: 'Какие гарантии при оплате онлайн?',
    answer: 'Мы используем защищенное соединение для всех платежей. Данные вашей карты передаются напрямую в банк и не сохраняются на нашем сервере. Все платежи сертифицированы по стандарту PCI DSS.',
  },
  {
    question: 'Можно ли изменить адрес доставки после оформления?',
    answer: 'Да, вы можете изменить адрес доставки, связавшись с нашей службой поддержки до момента отправки заказа.',
  },
  {
    question: 'Что делать, если товар пришел поврежденным?',
    answer: 'Если товар пришел поврежденным, не принимайте его у курьера. Свяжитесь с нашей поддержкой, мы заменим товар или вернем деньги.',
  },
];

const toggleFaq = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.delivery-page {
  min-height: 100vh;
}

// Hero Section
.delivery-hero {
  position: relative;
  padding: 8rem 0 6rem;
  overflow: hidden;
  min-height: 400px;
  display: flex;
  align-items: center;

  @media (max-width: $breakpoint-md) {
    padding: 6rem 0 4rem;
    min-height: 350px;
  }
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: $font-weight-bold;
  color: $white;
  margin-bottom: $spacing-lg;
  line-height: 1.2;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.gradient-text {
  display: inline-block;
  color: $white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

.hero-subtitle {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: rgba($white, 0.95);
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

// Delivery Methods Section
.delivery-methods-section {
  padding: 4rem 0;

  @media (max-width: $breakpoint-md) {
    padding: 3rem 0;
  }
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-2xl;
  text-align: center;
}

.delivery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: $spacing-xl;
}

.delivery-card {
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

.delivery-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: $radius-2xl;
  background: $gradient-primary;
  color: $white;
  margin-bottom: $spacing-lg;
}

.delivery-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: $spacing-md;
}

.delivery-description {
  color: $gray-600;
  line-height: $line-height-relaxed;
  margin-bottom: $spacing-lg;
}

.delivery-details {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $gray-700;
  font-size: $font-size-sm;

  svg {
    color: $primary;
    flex-shrink: 0;
  }
}

// Payment Methods Section
.payment-methods-section {
  padding: 4rem 0;
  background: $gray-50;

  @media (max-width: $breakpoint-md) {
    padding: 3rem 0;
  }
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: $spacing-xl;
}

.payment-card {
  padding: $spacing-2xl;
  background: $white;
  border-radius: $radius-2xl;
  box-shadow: $shadow-md;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-lg;
  }
}

.payment-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: $radius-2xl;
  background: rgba($primary, 0.1);
  color: $primary;
  margin-bottom: $spacing-lg;
}

.payment-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: $spacing-md;
}

.payment-description {
  color: $gray-600;
  line-height: $line-height-relaxed;
}

// Process Section
.process-section {
  padding: 4rem 0;

  @media (max-width: $breakpoint-md) {
    padding: 3rem 0;
  }
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: $spacing-2xl;
}

.process-step {
  display: flex;
  gap: $spacing-lg;

  @media (max-width: $breakpoint-sm) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 50%;
  background: $gradient-primary;
  color: $white;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: $spacing-sm;
}

.step-description {
  color: $gray-600;
  line-height: $line-height-relaxed;
  font-size: $font-size-sm;
}

// FAQ Section
.faq-section {
  padding: 4rem 0;
  background: $gray-50;

  @media (max-width: $breakpoint-md) {
    padding: 3rem 0;
  }
}

.faq-list {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.faq-item {
  background: $white;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg;
  background: none;
  border: none;
  text-align: left;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: $gray-50;
  }

  &.faq-question--active {
    color: $primary;
  }

  svg {
    transition: transform 0.3s ease;
    color: $gray-400;

    &.rotate {
      transform: rotate(180deg);
      color: $primary;
    }
  }
}

.faq-answer {
  padding: 0 $spacing-lg $spacing-lg;
  color: $gray-600;
  line-height: $line-height-relaxed;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// CTA Section
.cta-section {
  padding: 6rem 0;
  background: $gradient-primary;

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
