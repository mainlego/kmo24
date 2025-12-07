<template>
  <div class="contacts-page">
    <!-- Hero Section -->
    <section class="contacts-hero">
      <!-- Background Image -->
      <div class="hero-background">
        <img
          :src="pageEditor.getElementValue('contacts-hero-image', 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80')"
          alt="Контакты"
          class="hero-bg-image"
        />
        <!-- Gradient Overlay -->
        <div class="hero-overlay"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <AdminEditableElement
            element-id="contacts-hero-title"
            tag="h1"
            type="html"
            label="Заголовок страницы"
            class="hero-title"
            :default-value="'Свяжитесь с <span class=\'gradient-text\'>нами</span>'"
          >
            <span v-html="pageEditor.getElementValue('contacts-hero-title', 'Свяжитесь с <span class=\'gradient-text\'>нами</span>')"></span>
          </AdminEditableElement>

          <AdminEditableElement
            element-id="contacts-hero-subtitle"
            tag="p"
            type="text"
            label="Подзаголовок"
            class="hero-subtitle"
            default-value="Мы всегда рады помочь вам с любыми вопросами"
          >
            {{ pageEditor.getElementValue('contacts-hero-subtitle', 'Мы всегда рады помочь вам с любыми вопросами') }}
          </AdminEditableElement>
        </div>
      </div>
    </section>

    <!-- Contact Info Section -->
    <section class="contact-info-section">
      <div class="container">
        <div class="contact-grid">
          <!-- Contact Cards -->
          <div class="contact-cards">
            <!-- Телефон -->
            <div class="contact-card">
              <div class="contact-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <AdminEditableElement
                element-id="contact-phone-title"
                tag="h3"
                type="text"
                label="Телефон - Заголовок"
                class="contact-title"
                default-value="Телефон"
              >
                {{ pageEditor.getElementValue('contact-phone-title', 'Телефон') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="contact-phone-value"
                tag="p"
                type="text"
                label="Телефон - Номер"
                class="contact-value"
                default-value="+7 (391) 123-45-67"
              >
                {{ pageEditor.getElementValue('contact-phone-value', '+7 (391) 123-45-67') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="contact-phone-desc"
                tag="p"
                type="text"
                label="Телефон - Время работы"
                class="contact-description"
                default-value="Пн-Вс: 9:00 - 21:00"
              >
                {{ pageEditor.getElementValue('contact-phone-desc', 'Пн-Вс: 9:00 - 21:00') }}
              </AdminEditableElement>
            </div>

            <!-- Email -->
            <div class="contact-card">
              <div class="contact-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <AdminEditableElement
                element-id="contact-email-title"
                tag="h3"
                type="text"
                label="Email - Заголовок"
                class="contact-title"
                default-value="Email"
              >
                {{ pageEditor.getElementValue('contact-email-title', 'Email') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="contact-email-value"
                tag="p"
                type="text"
                label="Email - Адрес"
                class="contact-value"
                default-value="info@kmo24.ru"
              >
                {{ pageEditor.getElementValue('contact-email-value', 'info@kmo24.ru') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="contact-email-desc"
                tag="p"
                type="text"
                label="Email - Описание"
                class="contact-description"
                default-value="Ответим в течение 24 часов"
              >
                {{ pageEditor.getElementValue('contact-email-desc', 'Ответим в течение 24 часов') }}
              </AdminEditableElement>
            </div>

            <!-- Адрес -->
            <div class="contact-card">
              <div class="contact-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <AdminEditableElement
                element-id="contact-address-title"
                tag="h3"
                type="text"
                label="Адрес - Заголовок"
                class="contact-title"
                default-value="Адрес"
              >
                {{ pageEditor.getElementValue('contact-address-title', 'Адрес') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="contact-address-value"
                tag="p"
                type="text"
                label="Адрес - Город"
                class="contact-value"
                default-value="г. Красноярск"
              >
                {{ pageEditor.getElementValue('contact-address-value', 'г. Красноярск') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="contact-address-desc"
                tag="p"
                type="text"
                label="Адрес - Улица"
                class="contact-description"
                default-value="ул. Партизана Железняка, д. 1"
              >
                {{ pageEditor.getElementValue('contact-address-desc', 'ул. Партизана Железняка, д. 1') }}
              </AdminEditableElement>
            </div>

            <!-- Время работы -->
            <div class="contact-card">
              <div class="contact-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <AdminEditableElement
                element-id="contact-hours-title"
                tag="h3"
                type="text"
                label="Время работы - Заголовок"
                class="contact-title"
                default-value="Время работы"
              >
                {{ pageEditor.getElementValue('contact-hours-title', 'Время работы') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="contact-hours-value"
                tag="p"
                type="text"
                label="Время работы - Дни"
                class="contact-value"
                default-value="Ежедневно"
              >
                {{ pageEditor.getElementValue('contact-hours-value', 'Ежедневно') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="contact-hours-desc"
                tag="p"
                type="text"
                label="Время работы - Часы"
                class="contact-description"
                default-value="9:00 - 21:00"
              >
                {{ pageEditor.getElementValue('contact-hours-desc', '9:00 - 21:00') }}
              </AdminEditableElement>
            </div>
          </div>

          <!-- Contact Form -->
          <div class="contact-form-wrapper">
            <div class="form-header">
              <AdminEditableElement
                element-id="contact-form-title"
                tag="h2"
                type="text"
                label="Форма - Заголовок"
                class="form-title"
                default-value="Напишите нам"
              >
                {{ pageEditor.getElementValue('contact-form-title', 'Напишите нам') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="contact-form-subtitle"
                tag="p"
                type="text"
                label="Форма - Подзаголовок"
                class="form-subtitle"
                default-value="Заполните форму и мы свяжемся с вами в ближайшее время"
              >
                {{ pageEditor.getElementValue('contact-form-subtitle', 'Заполните форму и мы свяжемся с вами в ближайшее время') }}
              </AdminEditableElement>
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
                <AdminEditableElement
                  v-if="!isSubmitting"
                  element-id="contact-form-btn"
                  tag="span"
                  type="text"
                  label="Кнопка формы"
                  default-value="Отправить сообщение"
                >
                  {{ pageEditor.getElementValue('contact-form-btn', 'Отправить сообщение') }}
                </AdminEditableElement>
                <span v-else>Отправка...</span>
                <svg v-if="!isSubmitting" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <AdminEditableElement
                v-if="submitSuccess"
                element-id="contact-form-success"
                tag="div"
                type="text"
                label="Сообщение успеха"
                class="form-success"
                default-value="✓ Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время."
              >
                {{ pageEditor.getElementValue('contact-form-success', '✓ Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.') }}
              </AdminEditableElement>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Section -->
    <section class="social-section">
      <div class="container">
        <AdminEditableElement
          element-id="contacts-social-title"
          tag="h2"
          type="text"
          label="Соцсети - Заголовок"
          class="section-title"
          default-value="Мы в социальных сетях"
        >
          {{ pageEditor.getElementValue('contacts-social-title', 'Мы в социальных сетях') }}
        </AdminEditableElement>
        <AdminEditableElement
          element-id="contacts-social-subtitle"
          tag="p"
          type="text"
          label="Соцсети - Подзаголовок"
          class="section-subtitle"
          default-value="Следите за новостями и специальными предложениями"
        >
          {{ pageEditor.getElementValue('contacts-social-subtitle', 'Следите за новостями и специальными предложениями') }}
        </AdminEditableElement>
        <div class="social-links">
          <a href="#" class="social-link">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.45 14.8h-1.58c-.87 0-1.13-.69-2.69-2.25-1.35-1.33-1.95-1.51-2.29-1.51-.47 0-.6.13-.6.75v2.05c0 .55-.18.88-1.61.88-2.39 0-5.03-1.45-6.89-4.15-2.8-3.98-3.56-6.96-3.56-7.57 0-.34.13-.66.75-.66h1.59c.56 0 .77.26 1 .86.99 2.84 2.66 5.33 3.35 5.33.26 0 .38-.12.38-.78V8.97c-.09-1.43-.83-1.55-.83-2.06 0-.27.22-.54.58-.54h2.48c.47 0 .64.25.64.81v4.37c0 .47.21.64.35.64.26 0 .47-.17.95-.65 1.45-1.63 2.49-4.15 2.49-4.15.14-.29.39-.57.98-.57h1.59c.67 0 .82.35.67.82-.23 1.05-2.86 4.44-2.86 4.44-.22.36-.3.52 0 .93.2.3.87.85 1.32 1.37.81.9 1.43 1.65 1.6 2.18.16.52-.09.79-.67.79z"/>
            </svg>
            <AdminEditableElement
              element-id="social-vk-name"
              tag="span"
              type="text"
              label="Соцсеть VK - название"
              default-value="ВКонтакте"
            >
              {{ pageEditor.getElementValue('social-vk-name', 'ВКонтакте') }}
            </AdminEditableElement>
          </a>

          <a href="#" class="social-link">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            <AdminEditableElement
              element-id="social-tg-name"
              tag="span"
              type="text"
              label="Соцсеть Telegram - название"
              default-value="Telegram"
            >
              {{ pageEditor.getElementValue('social-tg-name', 'Telegram') }}
            </AdminEditableElement>
          </a>

          <a href="#" class="social-link">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <AdminEditableElement
              element-id="social-wa-name"
              tag="span"
              type="text"
              label="Соцсеть WhatsApp - название"
              default-value="WhatsApp"
            >
              {{ pageEditor.getElementValue('social-wa-name', 'WhatsApp') }}
            </AdminEditableElement>
          </a>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <AdminEditableElement
          element-id="contacts-faq-title"
          tag="h2"
          type="text"
          label="FAQ - Заголовок"
          class="section-title"
          default-value="Часто задаваемые вопросы"
        >
          {{ pageEditor.getElementValue('contacts-faq-title', 'Часто задаваемые вопросы') }}
        </AdminEditableElement>

        <div class="faq-grid">
          <div class="faq-item">
            <AdminEditableElement
              element-id="faq-q1"
              tag="h3"
              type="text"
              label="FAQ 1 - Вопрос"
              class="faq-question"
              default-value="Как я могу отследить свой заказ?"
            >
              {{ pageEditor.getElementValue('faq-q1', 'Как я могу отследить свой заказ?') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="faq-a1"
              tag="p"
              type="text"
              label="FAQ 1 - Ответ"
              class="faq-answer"
              default-value="После отправки заказа вы получите трек-номер на email. Отслеживать заказ можно в личном кабинете или на сайте транспортной компании."
            >
              {{ pageEditor.getElementValue('faq-a1', 'После отправки заказа вы получите трек-номер на email. Отслеживать заказ можно в личном кабинете или на сайте транспортной компании.') }}
            </AdminEditableElement>
          </div>

          <div class="faq-item">
            <AdminEditableElement
              element-id="faq-q2"
              tag="h3"
              type="text"
              label="FAQ 2 - Вопрос"
              class="faq-question"
              default-value="Какие способы оплаты вы принимаете?"
            >
              {{ pageEditor.getElementValue('faq-q2', 'Какие способы оплаты вы принимаете?') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="faq-a2"
              tag="p"
              type="text"
              label="FAQ 2 - Ответ"
              class="faq-answer"
              default-value="Мы принимаем оплату банковскими картами, электронными деньгами, а также наличными при получении."
            >
              {{ pageEditor.getElementValue('faq-a2', 'Мы принимаем оплату банковскими картами, электронными деньгами, а также наличными при получении.') }}
            </AdminEditableElement>
          </div>

          <div class="faq-item">
            <AdminEditableElement
              element-id="faq-q3"
              tag="h3"
              type="text"
              label="FAQ 3 - Вопрос"
              class="faq-question"
              default-value="Можно ли вернуть товар?"
            >
              {{ pageEditor.getElementValue('faq-q3', 'Можно ли вернуть товар?') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="faq-a3"
              tag="p"
              type="text"
              label="FAQ 3 - Ответ"
              class="faq-answer"
              default-value="Да, вы можете вернуть товар в течение 14 дней с момента получения, если он не был в употреблении и сохранена упаковка."
            >
              {{ pageEditor.getElementValue('faq-a3', 'Да, вы можете вернуть товар в течение 14 дней с момента получения, если он не был в употреблении и сохранена упаковка.') }}
            </AdminEditableElement>
          </div>

          <div class="faq-item">
            <AdminEditableElement
              element-id="faq-q4"
              tag="h3"
              type="text"
              label="FAQ 4 - Вопрос"
              class="faq-question"
              default-value="Есть ли гарантия на оборудование?"
            >
              {{ pageEditor.getElementValue('faq-q4', 'Есть ли гарантия на оборудование?') }}
            </AdminEditableElement>
            <AdminEditableElement
              element-id="faq-a4"
              tag="p"
              type="text"
              label="FAQ 4 - Ответ"
              class="faq-answer"
              default-value="Да, на всё оборудование предоставляется гарантия от 3 до 12 месяцев в зависимости от категории товара."
            >
              {{ pageEditor.getElementValue('faq-a4', 'Да, на всё оборудование предоставляется гарантия от 3 до 12 месяцев в зависимости от категории товара.') }}
            </AdminEditableElement>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { usePageEditor } from '../../composables/usePageEditor';

// Page Editor
const pageEditor = usePageEditor();

// Load saved content on mount
onMounted(async () => {
  await pageEditor.loadPageContent('contacts');
});

useHead({
  title: 'Контакты',
  meta: [
    {
      name: 'description',
      content: 'Свяжитесь с КМО24 - телефон, email, адрес. Мы всегда рады помочь!',
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
  } catch {
    // Error submitting form
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

  :deep(.gradient-text) {
    display: inline-block;
    color: $white;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  }
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
  background: rgba($primary, 0.1);
  border: 1px solid $primary;
  border-radius: $radius-lg;
  color: $primary;
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
</style>
