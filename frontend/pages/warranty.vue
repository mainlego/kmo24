<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Page Header - Minimalist -->
    <section class="page-header">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="page-title">Гарантии и возврат</h1>
        <p class="page-subtitle">Мы гарантируем качество и защищаем ваши интересы</p>
        <div class="title-underline"></div>
      </div>
    </section>

    <!-- Warranty Types -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            Виды гарантии
          </h2>
          <p class="text-xl text-gray-600">
            Выбирайте подходящий уровень защиты
          </p>
          <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-light mx-auto rounded-full mt-4"></div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Basic Warranty -->
          <div class="warranty-card">
            <div class="warranty-icon warranty-icon--basic">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-3">Базовая гарантия</h3>
            <div class="warranty-badge warranty-badge--basic">3 месяца</div>
            <p class="text-gray-600 mb-6">
              Стандартная гарантия на все оборудование при покупке
            </p>
            <ul class="space-y-3 mb-6">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Бесплатный ремонт</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Замена комплектующих</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Техническая поддержка</span>
              </li>
            </ul>
            <div class="price">Бесплатно</div>
          </div>

          <!-- Extended Warranty -->
          <div class="warranty-card warranty-card--popular">
            <div class="popular-badge">Популярный выбор</div>
            <div class="warranty-icon warranty-icon--extended">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-3">Расширенная гарантия</h3>
            <div class="warranty-badge warranty-badge--extended">12 месяцев</div>
            <p class="text-gray-600 mb-6">
              Максимальная защита для вашего спокойствия
            </p>
            <ul class="space-y-3 mb-6">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Все из базовой гарантии</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Приоритетное обслуживание</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Бесплатная диагностика</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Замена на время ремонта</span>
              </li>
            </ul>
            <div class="price">от 5% стоимости</div>
          </div>

          <!-- Premium Warranty -->
          <div class="warranty-card">
            <div class="warranty-icon warranty-icon--premium">
              <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-3">Премиум гарантия</h3>
            <div class="warranty-badge warranty-badge--premium">24 месяца</div>
            <p class="text-gray-600 mb-6">
              VIP-уровень обслуживания и полная защита
            </p>
            <ul class="space-y-3 mb-6">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Все из расширенной</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Персональный менеджер</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Выездное обслуживание</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span>Страхование от всех рисков</span>
              </li>
            </ul>
            <div class="price">от 10% стоимости</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Return Policy -->
    <section class="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            Политика возврата
          </h2>
          <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-light mx-auto rounded-full mt-4"></div>
        </div>

        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <!-- Return Conditions -->
          <div class="glass-card p-8">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-light rounded-xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold">Условия возврата</h3>
            </div>
            <ul class="space-y-4">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <div>
                  <span class="font-semibold">14 дней на возврат</span>
                  <p class="text-sm text-gray-600 mt-1">С момента получения товара</p>
                </div>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <div>
                  <span class="font-semibold">Сохранность товарного вида</span>
                  <p class="text-sm text-gray-600 mt-1">Без следов эксплуатации</p>
                </div>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <div>
                  <span class="font-semibold">Полная комплектация</span>
                  <p class="text-sm text-gray-600 mt-1">Все документы и аксессуары</p>
                </div>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <div>
                  <span class="font-semibold">Оригинальная упаковка</span>
                  <p class="text-sm text-gray-600 mt-1">Желательно в фирменной коробке</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Return Process -->
          <div class="glass-card p-8">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold">Процесс возврата</h3>
            </div>
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <div>
                  <span class="font-semibold">Заявка на возврат</span>
                  <p class="text-sm text-gray-600 mt-1">Свяжитесь с нами любым удобным способом</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <div>
                  <span class="font-semibold">Проверка условий</span>
                  <p class="text-sm text-gray-600 mt-1">Убедимся, что товар подходит для возврата</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <div>
                  <span class="font-semibold">Доставка товара</span>
                  <p class="text-sm text-gray-600 mt-1">Привезите сами или закажите курьера</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">
                  4
                </div>
                <div>
                  <span class="font-semibold">Возврат средств</span>
                  <p class="text-sm text-gray-600 mt-1">Деньги вернем в течение 3-5 рабочих дней</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Important Note -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl">
          <div class="flex items-start">
            <svg class="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <div>
              <h4 class="font-bold text-yellow-800 mb-2">Важная информация</h4>
              <p class="text-sm text-yellow-700">
                Возврат не распространяется на товары с индивидуальными характеристиками, изготовленные на заказ,
                а также на оборудование, которое было в эксплуатации более 14 дней.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 px-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            Часто задаваемые вопросы
          </h2>
          <div class="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-light mx-auto rounded-full mt-4"></div>
        </div>

        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
            <button @click="toggleFaq(index)" class="w-full text-left p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold pr-4">{{ faq.question }}</h3>
                <svg
                  class="w-6 h-6 text-gray-400 transition-transform flex-shrink-0"
                  :class="{ 'rotate-180': faq.isOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <div v-show="faq.isOpen" class="mt-4 text-gray-600 border-t pt-4">
                {{ faq.answer }}
              </div>
            </button>
          </div>
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
          Остались вопросы?
        </h2>
        <p class="text-xl mb-8 text-white/90">
          Наша служба поддержки всегда готова помочь
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/contacts" class="premium-button-white">
            Связаться с нами
          </NuxtLink>
          <NuxtLink to="/products" class="premium-button-outline-white">
            Перейти в каталог
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// SEO
useHead({
  title: 'Гарантии и возврат - КМО24',
  meta: [
    { name: 'description', content: 'Политика гарантий и возврата товаров в КМО24. Базовая, расширенная и премиум гарантия. Прозрачные условия возврата в течение 14 дней.' },
    { name: 'keywords', content: 'гарантия, возврат, обмен, защита покупателя, КМО24' }
  ]
})

// FAQs
const faqs = ref([
  {
    question: 'Что делать, если товар сломался в течение гарантийного срока?',
    answer: 'Свяжитесь с нашей службой поддержки по телефону или email. Мы организуем бесплатную диагностику и ремонт в авторизованном сервисном центре. При необходимости предоставим подменное оборудование на время ремонта.',
    isOpen: false
  },
  {
    question: 'Можно ли продлить гарантию после покупки?',
    answer: 'Да, вы можете приобрести расширенную или премиум гарантию в течение 30 дней с момента покупки. Стоимость продления будет зависеть от типа оборудования и выбранного срока.',
    isOpen: false
  },
  {
    question: 'Что не покрывается гарантией?',
    answer: 'Гарантия не распространяется на механические повреждения, последствия неправильной эксплуатации, самостоятельного ремонта, стихийных бедствий и форс-мажорных обстоятельств. Также не покрываются расходные материалы и естественный износ.',
    isOpen: false
  },
  {
    question: 'Как происходит возврат денег?',
    answer: 'Возврат осуществляется тем же способом, которым была произведена оплата. Для банковских карт срок возврата составляет 3-5 рабочих дней, для наличных - в день возврата товара. При безналичной оплате - в течение 5-7 рабочих дней.',
    isOpen: false
  },
  {
    question: 'Можно ли обменять товар на другой?',
    answer: 'Да, обмен возможен в течение 14 дней при условии сохранности товарного вида, упаковки и комплектации. Если новый товар дороже, необходимо доплатить разницу. Если дешевле - мы вернем разницу.',
    isOpen: false
  }
])

const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}
</script>

<style scoped>
/* Page Header - Minimalist */
.page-header {
  @apply pt-22 pb-4 text-center bg-white border-b border-gray-100 mb-8;
}

.page-title {
  @apply text-2xl md:text-3xl font-bold text-gray-900 mb-1 tracking-tight;
}

.page-subtitle {
  @apply text-sm text-gray-500 mb-4;
}

.title-underline {
  @apply w-10 h-0.5 bg-gradient-to-r from-primary-500 to-primary-light mx-auto rounded-full;
}

/* Glass Card */
.glass-card {
  @apply bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100;
}

/* Warranty Card */
.warranty-card {
  @apply relative bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200;
  @apply transform transition-all duration-300;
  @apply hover:shadow-2xl hover:-translate-y-2;
}

.warranty-card--popular {
  @apply border-blue-500 bg-gradient-to-br from-blue-50 to-white;
  @apply scale-105;
}

/* Popular Badge */
.popular-badge {
  @apply absolute -top-4 left-1/2 transform -translate-x-1/2;
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
  @apply text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg;
}

/* Warranty Icon */
.warranty-icon {
  @apply w-16 h-16 rounded-2xl flex items-center justify-center mb-6;
  @apply transform transition-transform duration-300;
  @apply group-hover:scale-110;
}

.warranty-icon--basic {
  @apply bg-gradient-to-br from-blue-500 to-cyan-500;
}

.warranty-icon--extended {
  @apply bg-gradient-to-br from-purple-500 to-pink-500;
}

.warranty-icon--premium {
  @apply bg-gradient-to-br from-orange-500 to-red-500;
}

/* Warranty Badge */
.warranty-badge {
  @apply inline-block px-4 py-2 rounded-full font-bold text-lg mb-4;
}

.warranty-badge--basic {
  @apply bg-blue-100 text-blue-700;
}

.warranty-badge--extended {
  @apply bg-primary-100 text-primary-700;
}

.warranty-badge--premium {
  @apply bg-orange-100 text-orange-700;
}

/* Price */
.price {
  @apply text-center text-2xl font-bold text-gray-900 pt-4 border-t border-gray-200;
}

/* FAQ Item */
.faq-item {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in-up 0.4s ease forwards;
}

.faq-item:nth-child(1) { animation-delay: 0.1s; }
.faq-item:nth-child(2) { animation-delay: 0.2s; }
.faq-item:nth-child(3) { animation-delay: 0.3s; }
.faq-item:nth-child(4) { animation-delay: 0.4s; }
.faq-item:nth-child(5) { animation-delay: 0.5s; }

/* Premium Buttons */
.premium-button-white {
  @apply inline-block px-8 py-4 bg-white text-primary-600 font-bold rounded-full;
  @apply hover:bg-gray-100 transition-all duration-300 hover:scale-105;
  @apply shadow-xl hover:shadow-2xl;
}

.premium-button-outline-white {
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

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animation-delay-1 { animation-delay: 0.1s; }
.animation-delay-2 { animation-delay: 0.2s; }
.animation-delay-4 { animation-delay: 0.4s; }
</style>