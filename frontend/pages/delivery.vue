<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Page Header - Minimalist -->
    <PageHeader
      title="Доставка и оплата"
      description="Удобные способы доставки и оплаты для вашего комфорта"
      :breadcrumbs="[{ text: 'Доставка и оплата' }]"
    />

    <!-- Delivery Methods -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <AdminEditableElement
            element-id="delivery-methods-title"
            tag="h2"
            type="text"
            label="Заголовок способов доставки"
            class="text-4xl md:text-5xl font-bold mb-4"
            default-value="Способы доставки"
          >
            {{ pageEditor.getElementValue('delivery-methods-title', 'Способы доставки') }}
          </AdminEditableElement>
          <AdminEditableElement
            element-id="delivery-methods-subtitle"
            tag="p"
            type="text"
            label="Подзаголовок способов доставки"
            class="text-xl text-gray-600"
            default-value="Выберите удобный для вас вариант"
          >
            {{ pageEditor.getElementValue('delivery-methods-subtitle', 'Выберите удобный для вас вариант') }}
          </AdminEditableElement>
          <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-light mx-auto rounded-full mt-4"></div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Courier Delivery -->
          <div class="delivery-card group">
            <div class="relative overflow-hidden rounded-t-2xl h-48 bg-gradient-to-br from-primary-500 to-primary-600">
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-24 h-24 text-white/20 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 18.5a1.5 1.5 0 01-1 1.415V21a1 1 0 11-2 0v-1.085a1.5 1.5 0 111-1.415zm-12 0a1.5 1.5 0 01-1 1.415V21a1 1 0 11-2 0v-1.085a1.5 1.5 0 111-1.415zM3 6a1 1 0 000 2h1v7a2 2 0 002 2h7v-2H6V8h12v2h2V8a2 2 0 00-2-2H3zm16 5h-3a1 1 0 00-1 1v3a1 1 0 001 1h5a1 1 0 001-1v-2a2 2 0 00-2-2h-1z"/>
                </svg>
              </div>
            </div>
            <div class="p-6 bg-white rounded-b-2xl">
              <h3 class="text-2xl font-bold mb-3">До объекта</h3>
              <div class="space-y-3 mb-6">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-600">Доставка до объекта</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-600">В пределах г. Красноярска</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-600">Удобное время доставки</span>
                </div>
              </div>
              <div class="pt-4 border-t border-gray-100">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-500">Срок доставки:</span>
                  <span class="font-semibold">1 день</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">Стоимость:</span>
                  <span class="font-bold text-2xl text-primary-600">от 1 000₽</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Transport Company -->
          <div class="delivery-card group animation-delay-1">
            <div class="relative overflow-hidden rounded-t-2xl h-48 bg-gradient-to-br from-primary-500 to-primary-600">
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-24 h-24 text-white/20 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <div class="p-6 bg-white rounded-b-2xl">
              <h3 class="text-2xl font-bold mb-3">Транспортной компанией</h3>
              <div class="space-y-3 mb-6">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-600">Доставка по всей России</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-600">Трек-номер для отслеживания</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-600">Страхование груза</span>
                </div>
              </div>
              <div class="pt-4 border-t border-gray-100">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-500">Срок доставки:</span>
                  <span class="font-semibold">3-7 дней</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">Стоимость:</span>
                  <span class="font-bold text-2xl text-primary-600">Расчет</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pickup -->
          <div class="delivery-card group animation-delay-2">
            <div class="relative overflow-hidden rounded-t-2xl h-48 bg-gradient-to-br from-primary-500 to-primary-600">
              <div class="absolute inset-0 flex items-center justify-center">
                <svg class="w-24 h-24 text-white/20 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
              </div>
            </div>
            <div class="p-6 bg-white rounded-b-2xl">
              <h3 class="text-2xl font-bold mb-3">Самовывоз</h3>
              <div class="space-y-3 mb-6">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-600">Получите сразу</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-600">Проверьте товар на месте</span>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-gray-600">Консультация специалиста</span>
                </div>
              </div>
              <div class="pt-4 border-t border-gray-100">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-gray-500">Срок доставки:</span>
                  <span class="font-semibold">Сразу</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-500">Стоимость:</span>
                  <span class="font-bold text-2xl text-primary-600">Бесплатно</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Payment Methods -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            Способы оплаты
          </h2>
          <p class="text-xl text-gray-600">
            Выберите удобный способ оплаты
          </p>
          <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-light mx-auto rounded-full mt-4"></div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Payment Method 1 -->
          <div class="payment-card group">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-light rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Банковской картой</h3>
            <p class="text-gray-600 text-sm">МИР</p>
          </div>

          <!-- Payment Method 2 -->
          <div class="payment-card group animation-delay-1">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-light rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Наличными</h3>
            <p class="text-gray-600 text-sm">При получении или в офисе</p>
          </div>

          <!-- Payment Method 3 -->
          <div class="payment-card group animation-delay-2">
            <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-light rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Счет для юр. лиц</h3>
            <p class="text-gray-600 text-sm">Безналичный расчет</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Delivery Process -->
    <section class="py-20 px-4 bg-gradient-to-br from-orange-50 to-orange-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            Как происходит доставка
          </h2>
          <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-light mx-auto rounded-full mt-4"></div>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <!-- Step 1 -->
          <div class="process-step">
            <div class="step-number">1</div>
            <div class="step-icon">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Оформление заказа</h3>
            <p class="text-gray-600 text-center">Выберите товар и оформите заказ на сайте</p>
          </div>

          <!-- Step 2 -->
          <div class="process-step animation-delay-1">
            <div class="step-number">2</div>
            <div class="step-icon">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Подтверждение</h3>
            <p class="text-gray-600 text-center">Менеджер свяжется с вами для уточнения деталей</p>
          </div>

          <!-- Step 3 -->
          <div class="process-step animation-delay-2">
            <div class="step-number">3</div>
            <div class="step-icon">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Упаковка</h3>
            <p class="text-gray-600 text-center">Тщательно упакуем товар для безопасной доставки</p>
          </div>

          <!-- Step 4 -->
          <div class="process-step animation-delay-3">
            <div class="step-number">4</div>
            <div class="step-icon">
              <svg class="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 18.5a1.5 1.5 0 01-1 1.415V21a1 1 0 11-2 0v-1.085a1.5 1.5 0 111-1.415zm-12 0a1.5 1.5 0 01-1 1.415V21a1 1 0 11-2 0v-1.085a1.5 1.5 0 111-1.415zM3 6a1 1 0 000 2h1v7a2 2 0 002 2h7v-2H6V8h12v2h2V8a2 2 0 00-2-2H3zm16 5h-3a1 1 0 00-1 1v3a1 1 0 001 1h5a1 1 0 001-1v-2a2 2 0 00-2-2h-1z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-2">Доставка</h3>
            <p class="text-gray-600 text-center">Получите заказ в указанное время и место</p>
          </div>
        </div>

        <!-- Progress Line -->
        <div class="relative mt-8 hidden md:block">
          <div class="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-light via-primary-600 to-orange-500 transform -translate-y-1/2 rounded-full"></div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-light"></div>

      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full filter blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-primary-light/10 rounded-full filter blur-3xl animate-float animation-delay-2"></div>
      </div>

      <div class="relative max-w-4xl mx-auto text-center text-white">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Остались вопросы о доставке?
        </h2>
        <p class="text-xl mb-8 text-white/90">
          Наши специалисты помогут подобрать оптимальный способ доставки
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/contacts" class="premium-button-white">
            Связаться с нами
          </NuxtLink>
          <NuxtLink to="/products" class="premium-button-outline">
            Перейти в каталог
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

// Page Editor для визуального редактирования
const pageEditor = usePageEditor();

// Загружаем контент страницы
onMounted(async () => {
  await pageEditor.loadPageContent('delivery');
});

// SEO Meta
useHead({
  title: 'Доставка и оплата - КМО24',
  meta: [
    { name: 'description', content: 'Доставка комиссионного оборудования по всей России. Курьерская доставка, транспортными компаниями или самовывоз. Удобные способы оплаты.' },
    { name: 'keywords', content: 'доставка оборудования, оплата, курьерская доставка, транспортная компания, самовывоз' }
  ]
})
</script>

<style scoped>
/* Truck Animation */
.truck-animation {
  animation: drive-truck 15s linear infinite;
}

@keyframes drive-truck {
  0% {
    left: -10%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 110%;
    opacity: 0;
  }
}

/* Delivery Card */
.delivery-card {
  @apply bg-white rounded-2xl shadow-lg overflow-hidden;
  @apply transform transition-all duration-300;
  @apply hover:shadow-2xl hover:-translate-y-2;
}

/* Partner Card */
.partner-card {
  opacity: 0;
  transform: translateY(30px);
  animation: fade-in-up 0.6s ease forwards;
}

/* Payment Card */
.payment-card {
  @apply bg-white rounded-2xl p-6 shadow-md;
  @apply transform transition-all duration-300;
  @apply hover:shadow-xl hover:-translate-y-2;
}

/* Process Step */
.process-step {
  @apply relative text-center;
  opacity: 0;
  transform: translateY(30px);
  animation: fade-in-up 0.6s ease forwards;
}

.step-number {
  @apply absolute -top-4 left-1/2 transform -translate-x-1/2;
  @apply w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-light rounded-full;
  @apply flex items-center justify-center text-white font-bold text-xl;
  @apply shadow-lg;
  @apply z-10;
}

.step-icon {
  @apply w-20 h-20 mx-auto mb-4 bg-gray-50 rounded-2xl;
  @apply flex items-center justify-center;
  @apply transform transition-transform duration-300;
  @apply mt-8;
}

.process-step:hover .step-icon {
  transform: scale(1.1);
}

/* Premium Buttons */
.premium-button-white {
  @apply inline-block px-8 py-4 bg-white text-primary-600 font-bold rounded-full;
  @apply hover:bg-gray-100 transition-all duration-300 hover:scale-105;
  @apply shadow-xl hover:shadow-2xl;
}

.premium-button-outline {
  @apply inline-block px-8 py-4 bg-transparent text-white font-bold rounded-full;
  @apply border-2 border-white/50 hover:bg-white/10 backdrop-blur-sm;
  @apply transition-all duration-300 hover:scale-105;
}

/* Animations */
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease forwards;
}

.animate-slide-down {
  animation: slide-down 0.6s ease forwards;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animation-delay-1 { animation-delay: 0.1s; }
.animation-delay-2 { animation-delay: 0.2s; }
.animation-delay-3 { animation-delay: 0.3s; }

/* Float Animation */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

</style>