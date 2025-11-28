<template>
  <div class="contacts-page">
    <!-- Page Header - Minimalist -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">Контакты</h1>
        <p class="page-subtitle">Свяжитесь с нами для консультации</p>
        <div class="title-underline"></div>
      </div>
    </section>

    <!-- Map Section - Moved to the top -->
    <section class="map-section-wrapper">
      <div class="container">
        <div class="map-section">
          <div class="map-header">
            <h2 class="map-title">Мы на карте</h2>
            <div class="map-controls">
              <a
                href="https://yandex.ru/maps/?pt=92.893333,56.016111&z=16&l=map"
                target="_blank"
                rel="noopener noreferrer"
                class="map-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Открыть в Яндекс.Картах
              </a>
              <a
                href="https://yandex.ru/maps/?rtext=~56.016111,92.893333&rtt=auto"
                target="_blank"
                rel="noopener noreferrer"
                class="map-btn map-btn-primary"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Построить маршрут
              </a>
            </div>
          </div>
          <div class="map-container">
            <div id="yandex-map" style="width: 100%; height: 400px;"></div>
          </div>
          <div class="map-footer">
            <div class="map-info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>г. Красноярск, ул. Полигонная 11Д, пом. 8</span>
            </div>
            <div class="map-transport">
              <span class="transport-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
                  <path d="M7 11V7a4 4 0 0 1 8 0v4"/>
                </svg>
                Остановка "Технопарк"
              </span>
              <span class="transport-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                5 мин от метро
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="contacts-content">
      <div class="container">
        <div class="contacts-grid">
          <!-- Contact Form -->
          <div class="contact-form-wrapper">
            <div class="form-header">
              <h2 class="form-title">Напишите нам</h2>
              <p class="form-subtitle">Ответим в течение 1 часа в рабочее время</p>
            </div>

            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-group">
                <label for="name" class="form-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Ваше имя
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Телефон
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                  placeholder="+7 (___) ___-__-__"
                  required
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Email
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div class="form-group">
                <label for="message" class="form-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Сообщение
                </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  class="form-textarea"
                  rows="5"
                  placeholder="Расскажите, какое оборудование вас интересует..."
                  required
                ></textarea>
              </div>

              <button type="submit" class="submit-btn" :disabled="loading">
                <span v-if="!loading">
                  Отправить сообщение
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </span>
                <span v-else class="loading-text">
                  Отправка...
                </span>
              </button>

              <p v-if="success" class="success-message">
                ✓ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.
              </p>
            </form>
          </div>

          <!-- Contact Info -->
          <div class="contact-info">
            <!-- Address Card -->
            <div class="info-card">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <h3 class="card-title">Адрес</h3>
                <p class="card-text">
                  г. Красноярск<br>
                  ул. Полигонная 11Д, пом. 8
                </p>
              </div>
            </div>

            <!-- Phone Card -->
            <div class="info-card">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <h3 class="card-title">Телефон</h3>
                <p class="card-text">
                  <a href="tel:+79029239704" class="contact-link">+7 (902) 923-97-04</a><br>
                  <a href="tel:+79676123564" class="contact-link">+7 (967) 612-35-64</a>
                </p>
              </div>
            </div>

            <!-- Email Card -->
            <div class="info-card">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <h3 class="card-title">Email</h3>
                <p class="card-text">
                  <a href="mailto:kmo24@mail.ru" class="contact-link">kmo24@mail.ru</a>
                </p>
              </div>
            </div>

            <!-- Working Hours Card -->
            <div class="info-card">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h3 class="card-title">Режим работы</h3>
                <p class="card-text">
                  <strong>Склад:</strong> Пн-Пт 9:00-17:30<br>
                  Сб-Вс по договоренности<br>
                  <strong>Звонки:</strong> 9:00-20:00 ежедневно
                </p>
              </div>
            </div>

            <!-- Social Media -->
            <div class="social-links">
              <a href="#" class="social-link" aria-label="WhatsApp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Telegram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="VK">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.391 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.644v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.78 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// SEO Meta
useHead({
  title: 'Контакты - КМО24',
  meta: [
    {
      name: 'description',
      content: 'Свяжитесь с нами для подбора оборудования. Телефон, email, адрес офиса в Красноярске.',
    },
  ],
});

const form = ref({
  name: '',
  phone: '',
  email: '',
  message: '',
});

const loading = ref(false);
const success = ref(false);
const showFullMap = ref(false);

// Адрес офиса
const officeAddress = 'Красноярск, улица Полигонная, дом 11Д';

// Инициализация Яндекс.Карт с геокодированием
const initYandexMap = () => {
  // Проверяем, что API загружен
  if (typeof window !== 'undefined' && (window as any).ymaps) {
    (window as any).ymaps.ready(() => {
      const ymaps = (window as any).ymaps;

      // Используем геокодер для поиска точных координат по адресу
      ymaps.geocode(officeAddress, {
        results: 1
      }).then((result: any) => {
        // Получаем координаты первого результата
        const firstGeoObject = result.geoObjects.get(0);
        const coords = firstGeoObject.geometry.getCoordinates();

        // Создаем карту с найденными координатами
        const map = new ymaps.Map('yandex-map', {
          center: coords,
          zoom: 17, // Увеличиваем zoom для более детального отображения
          controls: ['zoomControl', 'fullscreenControl', 'typeSelector']
        });

        // Добавляем метку офиса
        const placemark = new ymaps.Placemark(
          coords,
          {
            balloonContentHeader: 'КМО24',
            balloonContentBody: 'г. Красноярск, ул. Полигонная 11Д, пом. 8',
            balloonContentFooter: 'Склад: Пн-Пт 9:00-17:30 | Звонки: 9:00-20:00',
            hintContent: 'КМО24 - Профессиональное оборудование для кухни'
          },
          {
            preset: 'islands#orangeDotIcon', // Используем стандартную оранжевую метку
            iconColor: '#f59e0b'
          }
        );

        map.geoObjects.add(placemark);

        // Открываем балун автоматически при загрузке
        placemark.balloon.open();

        // Обновляем ссылки с правильными координатами
        const [lat, lon] = coords;
        updateMapLinks(lat, lon);
      }).catch((error: any) => {
        console.error('Ошибка геокодирования:', error);

        // Fallback на примерные координаты центра Красноярска
        const fallbackCoords = [56.010563, 92.852572];
        const map = new ymaps.Map('yandex-map', {
          center: fallbackCoords,
          zoom: 12,
          controls: ['zoomControl', 'fullscreenControl']
        });

        // Добавляем метку с fallback координатами
        const placemark = new ymaps.Placemark(
          fallbackCoords,
          {
            balloonContentHeader: 'КМО24',
            balloonContentBody: 'г. Красноярск, ул. Полигонная 11Д, пом. 8',
            balloonContentFooter: 'Склад: Пн-Пт 9:00-17:30 | Звонки: 9:00-20:00',
            hintContent: 'КМО24 - Профессиональное оборудование для кухни'
          },
          {
            preset: 'islands#orangeDotIcon',
            iconColor: '#f59e0b'
          }
        );

        map.geoObjects.add(placemark);
      });
    });
  }
};

// Функция для обновления ссылок на карту
const updateMapLinks = (lat: number, lon: number) => {
  // Обновляем ссылки если они есть в DOM
  const openMapLink = document.querySelector('a[href*="yandex.ru/maps/?pt="]');
  const routeLink = document.querySelector('a[href*="yandex.ru/maps/?rtext="]');

  if (openMapLink) {
    openMapLink.setAttribute('href', `https://yandex.ru/maps/?pt=${lon},${lat}&z=17&l=map`);
  }

  if (routeLink) {
    routeLink.setAttribute('href', `https://yandex.ru/maps/?rtext=~${lat},${lon}&rtt=auto`);
  }
};

// Загружаем скрипт Яндекс.Карт
onMounted(() => {
  if (typeof window !== 'undefined') {
    // Проверяем, не загружен ли уже скрипт
    if (!(window as any).ymaps) {
      const script = document.createElement('script');
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=ac8ab521-ee09-4f73-ad3b-0c97074568ce&lang=ru_RU`;
      script.async = true;
      script.onload = () => {
        initYandexMap();
      };
      document.head.appendChild(script);
    } else {
      initYandexMap();
    }
  }
});

const handleSubmit = async () => {
  loading.value = true;
  success.value = false;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  loading.value = false;
  success.value = true;

  // Reset form
  setTimeout(() => {
    form.value = {
      name: '',
      phone: '',
      email: '',
      message: '',
    };
    success.value = false;
  }, 3000);
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.contacts-page {
  min-height: 100vh;
}

// Page Header - Minimalist
.page-header {
  padding: 5.5rem 0 1rem;
  text-align: center;
  background: $white;
  border-bottom: 1px solid $gray-100;
  margin-bottom: 2rem;

  @media (max-width: $breakpoint-md) {
    padding: 4.5rem 0 0.75rem;
    margin-bottom: 1.5rem;
  }
}

.page-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin: 0 0 $spacing-xs;
  letter-spacing: -0.02em;
  line-height: $line-height-tight;
}

.page-subtitle {
  font-size: $font-size-sm;
  color: $gray-500;
  margin: 0 0 $spacing-md;
  line-height: $line-height-relaxed;
}

.title-underline {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, $primary-500, $primary-light);
  margin: 0 auto;
  border-radius: 2px;
}

// Main Content - Ultra Compact
.contacts-content {
  padding: 1.5rem 0;
  background: $gray-50;

  @media (max-width: $breakpoint-md) {
    padding: 1rem 0;
  }
}

.contacts-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: $spacing-lg; // Reduced gap

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
    gap: $spacing-md;
  }
}

// Contact Form - Compact
.contact-form-wrapper {
  background: $white;
  padding: $spacing-xl; // Reduced padding
  border-radius: $radius-lg;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-lg;
  }
}

.form-header {
  margin-bottom: $spacing-lg; // Reduced margin
}

.form-title {
  font-size: $font-size-xl; // Smaller title
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: 4px;
}

.form-subtitle {
  color: $gray-500;
  font-size: $font-size-sm; // Smaller subtitle
}

.contact-form {
  .form-group {
    margin-bottom: $spacing-md; // Reduced margin
  }

  .form-label {
    display: flex;
    align-items: center;
    gap: 4px; // Smaller gap
    font-weight: $font-weight-medium;
    color: $gray-700;
    margin-bottom: 6px; // Smaller margin
    font-size: 13px; // Smaller font

    svg {
      color: #f59e0be6;
      width: 16px; // Smaller icons
      height: 16px;
    }
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 8px 12px; // Smaller padding
    border: 1px solid $gray-200; // Thinner border
    border-radius: $radius-md;
    font-size: 14px; // Smaller font
    transition: all 0.2s ease;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #f59e0be6;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1);
    }

    &::placeholder {
      color: $gray-400;
      font-size: 13px;
    }
  }

  .form-textarea {
    resize: vertical;
    min-height: 80px; // Smaller textarea
  }

  .submit-btn {
    width: 100%;
    padding: 10px 16px; // Compact padding
    background: linear-gradient(135deg, #f59e0be6 0%, #fbbf24 100%);
    color: $white;
    border: none;
    border-radius: $radius-md;
    font-size: 14px; // Smaller font
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    svg {
      transition: transform 0.2s ease;
      width: 18px;
      height: 18px;
    }

    &:hover:not(:disabled) svg {
      transform: translateX(2px);
    }
  }

  .success-message {
    margin-top: $spacing-md;
    padding: 8px 12px;
    background: #d1fae5;
    color: #065f46;
    border-radius: $radius-md;
    text-align: center;
    font-weight: $font-weight-medium;
    font-size: 13px;
  }
}

// Contact Info - Ultra Compact
.contact-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-sm; // Grid layout for compact design

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

.info-card {
  background: $white;
  padding: $spacing-lg; // Much smaller padding
  border-radius: $radius-md;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  display: flex;
  align-items: flex-start;
  gap: $spacing-md;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(245, 158, 11, 0.1);

    .card-icon {
      transform: scale(1.05);
    }
  }
}

.card-icon {
  width: 40px; // Much smaller icon
  height: 40px;
  border-radius: $radius-md;
  background: linear-gradient(135deg, #f59e0be6 0%, #fbbf24 100%);
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;

  svg {
    width: 20px;
    height: 20px;
  }
}

.card-title {
  font-size: 14px; // Smaller title
  font-weight: $font-weight-semibold;
  color: $gray-900;
  margin-bottom: 4px;
  line-height: 1.2;
}

.card-text {
  color: $gray-600;
  line-height: 1.5;
  margin: 0;
  font-size: 13px; // Smaller text

  strong {
    color: $gray-700;
    display: inline-block;
    margin-top: 4px;
  }
}

.contact-link {
  color: #f59e0be6;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 13px;

  &:hover {
    color: #fbbf24;
    text-decoration: underline;
  }
}

// Social Links - Compact
.social-links {
  display: flex;
  gap: $spacing-sm;
  grid-column: 1 / -1; // Span full width in grid
}

.social-link {
  width: 36px; // Smaller icons
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0be6 0%, #fbbf24 100%);
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
  }
}

// Map Section Wrapper - New styling for top position
.map-section-wrapper {
  padding: 2rem 0;
  background: $white;

  @media (max-width: $breakpoint-md) {
    padding: 1.5rem 0;
  }
}

// Map Section
.map-section {
  background: $white;
  border-radius: $radius-2xl;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.map-header {
  padding: $spacing-xl;
  border-bottom: 1px solid $gray-100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-lg;
  }
}

.map-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin: 0;
}

.map-controls {
  display: flex;
  gap: $spacing-md;
  flex-wrap: wrap;
}

.map-btn {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-sm $spacing-lg;
  border: 2px solid $gray-200;
  border-radius: $radius-lg;
  background: $white;
  color: $gray-700;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: $primary-300;
    background: $primary-50;
    color: $primary-600;
  }

  &.map-btn-primary {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
    color: $white;
    border: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba($primary-500, 0.3);
    }
  }
}

.map-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: $gray-100;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}

.map-footer {
  padding: $spacing-lg $spacing-xl;
  background: $gray-50;
  border-top: 1px solid $gray-100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: $spacing-md;

  @media (max-width: $breakpoint-sm) {
    padding: $spacing-md $spacing-lg;
  }
}

.map-info {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  color: $gray-700;
  font-size: $font-size-sm;

  svg {
    flex-shrink: 0;
    color: $primary-500;
  }
}

.map-transport {
  display: flex;
  gap: $spacing-xl;
  flex-wrap: wrap;
}

.transport-item {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  color: $gray-600;
  font-size: $font-size-sm;

  svg {
    flex-shrink: 0;
    color: $gray-400;
  }
}

// Container is defined globally in main.scss
</style>
