<template>
  <div class="contacts-page">
    <!-- Hero Section -->
    <section class="contacts-hero">
      <!-- Background Image -->
      <div class="hero-background">
        <img
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
          alt="Контакты"
          class="hero-bg-image"
        />
        <!-- Gradient Overlay -->
        <div class="hero-overlay"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Свяжитесь с
            <span class="gradient-text">нами</span>
          </h1>
          <p class="hero-subtitle">
            Мы всегда рады помочь вам с любыми вопросами
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Info Section -->
    <section class="contact-info-section">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Cards -->
          <div class="contact-cards">
            <div class="contact-card">
              <div class="contact-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="contact-title">Телефон</h3>
              <p class="contact-value">+7 (495) 123-45-67</p>
              <p class="contact-description">Пн-Вс: 9:00 - 21:00</p>
            </div>

            <div class="contact-card">
              <div class="contact-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="contact-title">Email</h3>
              <p class="contact-value">info@premiumshop.ru</p>
              <p class="contact-description">Ответим в течение 24 часов</p>
            </div>

            <div class="contact-card">
              <div class="contact-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 class="contact-title">Адрес</h3>
              <p class="contact-value">г. Москва</p>
              <p class="contact-description">ул. Тверская, д. 1, офис 100</p>
            </div>

            <div class="contact-card">
              <div class="contact-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <h3 class="contact-title">Время работы</h3>
              <p class="contact-value">Ежедневно</p>
              <p class="contact-description">9:00 - 21:00 (МСК)</p>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-wrapper">
            <div class="form-header">
              <h2 class="form-title">Напишите нам</h2>
              <p class="form-subtitle">Заполните форму и мы свяжемся с вами в ближайшее время</p>
            </div>

            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name" class="form-label">Ваше имя *</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.name }"
                  placeholder="Иван Иванов"
                  required
                />
                <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email *</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  class="form-input"
                  :class="{ 'form-input--error': errors.email }"
                  placeholder="ivan@example.com"
                  required
                />
                <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">Телефон</label>
                <input
                  id="phone"
                  v-model="formData.phone"
                  type="tel"
                  class="form-input"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <div class="form-group">
                <label for="subject" class="form-label">Тема обращения *</label>
                <select
                  id="subject"
                  v-model="formData.subject"
                  class="form-input"
                  required
                >
                  <option value="">Выберите тему</option>
                  <option value="order">Вопрос о заказе</option>
                  <option value="product">Вопрос о товаре</option>
                  <option value="delivery">Доставка</option>
                  <option value="payment">Оплата</option>
                  <option value="return">Возврат товара</option>
                  <option value="other">Другое</option>
                </select>
                <span v-if="errors.subject" class="form-error">{{ errors.subject }}</span>
              </div>

              <div class="form-group">
                <label for="message" class="form-label">Сообщение *</label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  class="form-textarea"
                  :class="{ 'form-input--error': errors.message }"
                  placeholder="Опишите ваш вопрос подробно..."
                  rows="5"
                  required
                ></textarea>
                <span v-if="errors.message" class="form-error">{{ errors.message }}</span>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
                <span v-if="!isSubmitting">Отправить сообщение</span>
                <span v-else>Отправка...</span>
                <svg v-if="!isSubmitting" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <div v-if="submitSuccess" class="form-success">
                ✓ Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Section -->
    <section class="social-section">
      <div class="container">
        <h2 class="section-title">Мы в социальных сетях</h2>
        <p class="section-subtitle">Следите за новостями и специальными предложениями</p>
        <div class="social-links">
          <a href="#" class="social-link">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.45 14.8h-1.58c-.87 0-1.13-.69-2.69-2.25-1.35-1.33-1.95-1.51-2.29-1.51-.47 0-.6.13-.6.75v2.05c0 .55-.18.88-1.61.88-2.39 0-5.03-1.45-6.89-4.15-2.8-3.98-3.56-6.96-3.56-7.57 0-.34.13-.66.75-.66h1.59c.56 0 .77.26 1 .86.99 2.84 2.66 5.33 3.35 5.33.26 0 .38-.12.38-.78V8.97c-.09-1.43-.83-1.55-.83-2.06 0-.27.22-.54.58-.54h2.48c.47 0 .64.25.64.81v4.37c0 .47.21.64.35.64.26 0 .47-.17.95-.65 1.45-1.63 2.49-4.15 2.49-4.15.14-.29.39-.57.98-.57h1.59c.67 0 .82.35.67.82-.23 1.05-2.86 4.44-2.86 4.44-.22.36-.3.52 0 .93.2.3.87.85 1.32 1.37.81.9 1.43 1.65 1.6 2.18.16.52-.09.79-.67.79z"/>
            </svg>
            <span>ВКонтакте</span>
          </a>

          <a href="#" class="social-link">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <span>Telegram</span>
          </a>

          <a href="#" class="social-link">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            <span>Instagram</span>
          </a>

          <a href="#" class="social-link">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
            </svg>
            <span>TikTok</span>
          </a>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Часто задаваемые вопросы</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h3 class="faq-question">Как я могу отследить свой заказ?</h3>
            <p class="faq-answer">
              После отправки заказа вы получите трек-номер на email. Отслеживать заказ можно в личном кабинете или на сайте транспортной компании.
            </p>
          </div>

          <div class="faq-item">
            <h3 class="faq-question">Какие способы оплаты вы принимаете?</h3>
            <p class="faq-answer">
              Мы принимаем оплату банковскими картами, электронными деньгами, а также наличными при получении.
            </p>
          </div>

          <div class="faq-item">
            <h3 class="faq-question">Можно ли вернуть товар?</h3>
            <p class="faq-answer">
              Да, вы можете вернуть товар в течение 14 дней с момента получения, если он не был в употреблении и сохранена упаковка.
            </p>
          </div>

          <div class="faq-item">
            <h3 class="faq-question">Есть ли у вас программа лояльности?</h3>
            <p class="faq-answer">
              Да! Мы предлагаем бонусную программу, скидки постоянным клиентам и специальные предложения для подписчиков.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

useHead({
  title: 'Контакты',
  meta: [
    {
      name: 'description',
      content: 'Свяжитесь с PremiumShop - телефон, email, адрес. Мы всегда рады помочь!',
    },
  ],
});

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
});

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);

const validateForm = (): boolean => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = '';
  });

  // Validate name
  if (!formData.name.trim()) {
    errors.name = 'Введите ваше имя';
    isValid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = 'Введите email';
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Введите корректный email';
    isValid = false;
  }

  // Validate subject
  if (!formData.subject) {
    errors.subject = 'Выберите тему обращения';
    isValid = false;
  }

  // Validate message
  if (!formData.message.trim()) {
    errors.message = 'Введите сообщение';
    isValid = false;
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Сообщение должно содержать минимум 10 символов';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  submitSuccess.value = false;

  try {
    // Имитация отправки формы
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Form submitted:', formData);

    // Success
    submitSuccess.value = true;

    // Reset form
    Object.keys(formData).forEach((key) => {
      formData[key as keyof typeof formData] = '';
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      submitSuccess.value = false;
    }, 5000);
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.contacts-page {
  min-height: 100vh;
}

// Hero Section
.contacts-hero {
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

// Contact Info Section
.contact-info-section {
  padding: 4rem 0;

  @media (max-width: $breakpoint-md) {
    padding: 3rem 0;
  }
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: $spacing-3xl;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
    gap: $spacing-2xl;
  }
}

.contact-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-lg;

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.contact-card {
  padding: $spacing-xl;
  background: $white;
  border-radius: $radius-2xl;
  box-shadow: $shadow-md;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-colored;
  }
}

.contact-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: $radius-2xl;
  background: $gradient-primary;
  color: $white;
  margin-bottom: $spacing-md;
}

.contact-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: $spacing-sm;
}

.contact-value {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $primary;
  margin-bottom: $spacing-xs;
}

.contact-description {
  font-size: $font-size-sm;
  color: $gray-600;
}

// Contact Form
.contact-form-wrapper {
  padding: $spacing-2xl;
  background: $white;
  border-radius: $radius-2xl;
  box-shadow: $shadow-xl;
}

.form-header {
  margin-bottom: $spacing-xl;
}

.form-title {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-sm;
}

.form-subtitle {
  font-size: $font-size-base;
  color: $gray-600;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.form-label {
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  color: $gray-700;
}

.form-input,
.form-textarea {
  padding: $spacing-md;
  border: 2px solid $gray-200;
  border-radius: $radius-lg;
  font-size: $font-size-base;
  color: $gray-900;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.1);
  }

  &::placeholder {
    color: $gray-400;
  }

  &.form-input--error {
    border-color: $error;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.form-error {
  font-size: $font-size-sm;
  color: $error;
}

.form-success {
  padding: $spacing-md;
  background: rgba($success, 0.1);
  border: 1px solid $success;
  border-radius: $radius-lg;
  color: $success;
  font-weight: $font-weight-medium;
  text-align: center;
}

// Button
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-full;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  font-size: $font-size-base;
  width: 100%;

  &.btn-primary {
    background: $gradient-primary;
    color: $white;
    box-shadow: $shadow-lg;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: $shadow-xl;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &.btn-lg {
    padding: $spacing-lg $spacing-2xl;
    font-size: $font-size-lg;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover:not(:disabled) svg {
    transform: translateX(4px);
  }
}

// Social Section
.social-section {
  padding: 4rem 0;
  background: $gray-50;

  @media (max-width: $breakpoint-md) {
    padding: 3rem 0;
  }
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-md;
  text-align: center;
}

.section-subtitle {
  font-size: $font-size-lg;
  color: $gray-600;
  margin-bottom: $spacing-2xl;
  text-align: center;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: $spacing-lg;
  flex-wrap: wrap;
}

.social-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-xl;
  background: $white;
  border-radius: $radius-2xl;
  box-shadow: $shadow-md;
  color: $gray-700;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 140px;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-colored;
    color: $primary;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  span {
    font-weight: $font-weight-medium;
    font-size: $font-size-sm;
  }
}

// FAQ Section
.faq-section {
  padding: 4rem 0;

  @media (max-width: $breakpoint-md) {
    padding: 3rem 0;
  }
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: $spacing-xl;
}

.faq-item {
  padding: $spacing-xl;
  background: $white;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  border-left: 4px solid $primary;
}

.faq-question {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: $spacing-md;
}

.faq-answer {
  color: $gray-600;
  line-height: $line-height-relaxed;
}

.container {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $container-padding;
}
</style>
