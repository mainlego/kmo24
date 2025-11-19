<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section -->
    <section class="relative h-[50vh] overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-primary-900/90 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1

516321497487-e288fb19713f?w=1920"
          alt="FAQ background"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Question Mark Animation -->
      <div class="absolute inset-0 z-20">
        <div v-for="i in 8" :key="`q-${i}`"
          class="question-mark-float absolute text-white/10 font-bold text-6xl"
          :style="`left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-delay: ${i * 0.3}s`">
          ?
        </div>
      </div>

      <div class="relative z-30 h-full flex items-center justify-center text-center px-4">
        <div class="max-w-4xl mx-auto">
          <div class="inline-block animate-slide-down mb-6">
            <span class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              База знаний
            </span>
          </div>

          <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            <span class="text-white">Частые вопросы</span>
          </h1>

          <p class="text-xl md:text-2xl text-white/90 animate-fade-in-up animation-delay-1">
            Найдите ответы на самые популярные вопросы
          </p>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="py-12 px-4 bg-white shadow-lg sticky top-0 z-40">
      <div class="max-w-4xl mx-auto">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Поиск по вопросам..."
            class="w-full pl-14 pr-6 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-lg shadow-lg"
          />
          <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-6 flex items-center">
            <button @click="searchQuery = ''" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            class="category-pill"
            :class="{ 'category-pill--active': selectedCategory === cat.id }"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="cat.icon"></path>
            </svg>
            {{ cat.name }}
            <span class="ml-2 opacity-75">({{ cat.count }})</span>
          </button>
        </div>
      </div>
    </section>

    <!-- FAQ Content -->
    <section class="py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <div v-if="filteredFaqs.length === 0" class="text-center py-16">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Ничего не найдено</h3>
          <p class="text-gray-600 mb-4">Попробуйте изменить параметры поиска</p>
          <button @click="resetFilters" class="premium-button-outline">
            Сбросить фильтры
          </button>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(faq, index) in filteredFaqs"
            :key="faq.id"
            class="faq-card"
            :style="{ animationDelay: `${index * 0.05}s` }"
          >
            <button @click="toggleFaq(faq.id)" class="w-full text-left">
              <div class="flex items-start justify-between gap-4 mb-3">
                <div class="flex items-start flex-1">
                  <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-light rounded-xl flex items-center justify-center mr-3">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 mb-1">{{ faq.question }}</h3>
                    <div class="flex items-center gap-2">
                      <span class="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                        {{ getCategoryName(faq.category) }}
                      </span>
                      <span v-if="faq.popular" class="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        Популярный
                      </span>
                    </div>
                  </div>
                </div>
                <svg
                  class="w-6 h-6 text-gray-400 transition-transform flex-shrink-0"
                  :class="{ 'rotate-180': openFaqs.includes(faq.id) }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>

              <div v-show="openFaqs.includes(faq.id)" class="mt-4 text-gray-600 border-t pt-4 pl-13">
                <p class="leading-relaxed whitespace-pre-line">{{ faq.answer }}</p>
                <div v-if="faq.helpful !== undefined" class="mt-6 pt-4 border-t flex items-center justify-between">
                  <span class="text-sm text-gray-500">Был ли этот ответ полезен?</span>
                  <div class="flex gap-2">
                    <button class="helpful-button">
                      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                      </svg>
                      Да
                    </button>
                    <button class="helpful-button">
                      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
                      </svg>
                      Нет
                    </button>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact CTA -->
    <section class="py-20 px-4 bg-gradient-to-br from-gray-50 to-orange-50">
      <div class="max-w-4xl mx-auto text-center">
        <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-light rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Не нашли ответ на свой вопрос?
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Наша служба поддержки всегда готова помочь
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/contacts" class="premium-button">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Связаться с нами
          </NuxtLink>
          <a href="tel:+78001234567" class="premium-button-outline">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            Позвонить: 8 (800) 123-45-67
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// SEO
useHead({
  title: 'Часто задаваемые вопросы (FAQ) - КМО24',
  meta: [
    { name: 'description', content: 'Ответы на часто задаваемые вопросы о покупке, доставке, гарантии и возврате комиссионного оборудования в КМО24.' },
    { name: 'keywords', content: 'FAQ, часто задаваемые вопросы, помощь, поддержка, КМО24' }
  ]
})

const searchQuery = ref('')
const selectedCategory = ref('all')
const openFaqs = ref([])

// Categories
const categories = [
  {
    id: 'all',
    name: 'Все вопросы',
    icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
    count: 20
  },
  {
    id: 'purchase',
    name: 'Покупка',
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    count: 6
  },
  {
    id: 'delivery',
    name: 'Доставка',
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
    count: 5
  },
  {
    id: 'warranty',
    name: 'Гарантия',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    count: 4
  },
  {
    id: 'payment',
    name: 'Оплата',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    count: 3
  },
  {
    id: 'other',
    name: 'Прочее',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    count: 2
  }
]

// FAQs Data
const faqs = ref([
  // Purchase
  {
    id: 1,
    category: 'purchase',
    question: 'Как оформить заказ на сайте?',
    answer: 'Добавьте нужные товары в корзину, нажав кнопку "В корзину". Затем перейдите в корзину, проверьте состав заказа и нажмите "Оформить заказ". Заполните контактные данные и выберите способ доставки и оплаты. После подтверждения заказа с вами свяжется наш менеджер.',
    popular: true,
    helpful: null
  },
  {
    id: 2,
    category: 'purchase',
    question: 'Можно ли посмотреть товар перед покупкой?',
    answer: 'Да, вы можете посетить наш шоу-рум и осмотреть интересующее оборудование. Предварительно свяжитесь с нами для согласования времени визита. Адреса и контакты указаны в разделе "Контакты".',
    popular: false,
    helpful: null
  },
  {
    id: 3,
    category: 'purchase',
    question: 'Как узнать о наличии товара?',
    answer: 'Актуальная информация о наличии отображается на странице товара. Если нужной модели нет в наличии, вы можете оформить предзаказ или связаться с менеджером для уточнения сроков поступления.',
    popular: true,
    helpful: null
  },
  {
    id: 4,
    category: 'purchase',
    question: 'Есть ли скидки при оптовой покупке?',
    answer: 'Да, мы предоставляем скидки при покупке от 3 единиц оборудования. Размер скидки зависит от объема заказа и типа оборудования. Свяжитесь с отделом продаж для расчета индивидуального предложения.',
    popular: false,
    helpful: null
  },
  {
    id: 5,
    category: 'purchase',
    question: 'Можно ли забронировать товар?',
    answer: 'Да, бронирование возможно на срок до 3 дней. Для этого свяжитесь с нами любым удобным способом. При необходимости более длительной брони требуется внесение предоплаты в размере 20%.',
    popular: false,
    helpful: null
  },
  {
    id: 6,
    category: 'purchase',
    question: 'Работаете ли вы с юридическими лицами?',
    answer: 'Да, мы работаем как с физическими, так и с юридическими лицами. Предоставляем все необходимые документы: договор, счет на оплату, акт выполненных работ, товарную накладную.',
    popular: false,
    helpful: null
  },

  // Delivery
  {
    id: 7,
    category: 'delivery',
    question: 'Какие способы доставки доступны?',
    answer: 'Мы предлагаем курьерскую доставку по городу, доставку транспортными компаниями по всей России и самовывоз со склада. Подробная информация о каждом способе доступна на странице "Доставка и оплата".',
    popular: true,
    helpful: null
  },
  {
    id: 8,
    category: 'delivery',
    question: 'Сколько стоит доставка?',
    answer: 'Стоимость курьерской доставки по городу - от 500₽. Доставка транспортными компаниями рассчитывается индивидуально в зависимости от веса, габаритов и региона. Самовывоз бесплатный.',
    popular: true,
    helpful: null
  },
  {
    id: 9,
    category: 'delivery',
    question: 'Как долго ждать доставку?',
    answer: 'Курьерская доставка по городу - 1-3 дня. Доставка по России транспортными компаниями - 3-14 дней в зависимости от региона. Точные сроки сообщит менеджер при оформлении заказа.',
    popular: false,
    helpful: null
  },
  {
    id: 10,
    category: 'delivery',
    question: 'Можно ли отследить заказ?',
    answer: 'Да, после отправки вы получите трек-номер для отслеживания. Также менеджер будет держать вас в курсе на всех этапах доставки. Статус заказа можно посмотреть в личном кабинете.',
    popular: false,
    helpful: null
  },
  {
    id: 11,
    category: 'delivery',
    question: 'Что делать, если товар повредился при доставке?',
    answer: 'При получении обязательно осмотрите товар в присутствии курьера или представителя транспортной компании. Если обнаружены повреждения - составьте акт. Мы заменим товар или вернем деньги.',
    popular: false,
    helpful: null
  },

  // Warranty
  {
    id: 12,
    category: 'warranty',
    question: 'Какая гарантия на товары?',
    answer: 'Базовая гарантия составляет 3 месяца. Также доступна расширенная гарантия на 12 месяцев и премиум на 24 месяца за дополнительную плату. Подробности на странице "Гарантии и возврат".',
    popular: true,
    helpful: null
  },
  {
    id: 13,
    category: 'warranty',
    question: 'Что делать при поломке?',
    answer: 'Свяжитесь с нашей службой поддержки. Мы организуем бесплатную диагностику и ремонт в гарантийный период. При необходимости предоставим подменное оборудование на время ремонта.',
    popular: false,
    helpful: null
  },
  {
    id: 14,
    category: 'warranty',
    question: 'Можно ли вернуть товар?',
    answer: 'Да, возврат возможен в течение 14 дней при сохранности товарного вида, упаковки и комплектации. Подробная информация о условиях возврата на странице "Гарантии и возврат".',
    popular: true,
    helpful: null
  },
  {
    id: 15,
    category: 'warranty',
    question: 'Что не покрывается гарантией?',
    answer: 'Гарантия не распространяется на механические повреждения, последствия неправильной эксплуатации, самостоятельного ремонта и форс-мажорных обстоятельств.',
    popular: false,
    helpful: null
  },

  // Payment
  {
    id: 16,
    category: 'payment',
    question: 'Какие способы оплаты принимаете?',
    answer: 'Принимаем оплату банковскими картами (Visa, Mastercard, МИР), наличными при получении, безналичный расчет для юридических лиц. Также доступна рассрочка 0% на 6 месяцев.',
    popular: true,
    helpful: null
  },
  {
    id: 17,
    category: 'payment',
    question: 'Безопасно ли платить на сайте?',
    answer: 'Да, все платежи проходят через защищенное соединение. Мы используем современные технологии шифрования данных. Данные вашей карты не сохраняются на нашем сервере.',
    popular: false,
    helpful: null
  },
  {
    id: 18,
    category: 'payment',
    question: 'Можно ли оплатить частями?',
    answer: 'Да, доступна рассрочка 0% на 6 месяцев для товаров стоимостью от 10 000₽. Также возможна оплата по частям - 50% при заказе, 50% при получении.',
    popular: false,
    helpful: null
  },

  // Other
  {
    id: 19,
    category: 'other',
    question: 'Есть ли программа лояльности?',
    answer: 'Да, мы начисляем бонусные баллы за каждую покупку. Баллами можно оплатить до 30% следующего заказа. Также действуют специальные предложения для постоянных клиентов.',
    popular: false,
    helpful: null
  },
  {
    id: 20,
    category: 'other',
    question: 'Как связаться с поддержкой?',
    answer: 'Вы можете написать нам на email info@kmo24.ru, позвонить по телефону 8 (800) 123-45-67 или воспользоваться формой обратной связи на странице "Контакты". Работаем ежедневно с 9:00 до 21:00.',
    popular: true,
    helpful: null
  }
])

// Computed
const filteredFaqs = computed(() => {
  let result = faqs.value

  // Filter by category
  if (selectedCategory.value !== 'all') {
    result = result.filter(faq => faq.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    )
  }

  return result
})

// Methods
const getCategoryName = (categoryId) => {
  const category = categories.find(c => c.id === categoryId)
  return category ? category.name : categoryId
}

const toggleFaq = (id) => {
  const index = openFaqs.value.indexOf(id)
  if (index > -1) {
    openFaqs.value.splice(index, 1)
  } else {
    openFaqs.value.push(id)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
}
</script>

<style scoped>
/* Question Mark Float */
.question-mark-float {
  animation: float-question 8s ease-in-out infinite;
}

@keyframes float-question {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.1;
  }
  25% {
    transform: translate(20px, -30px) rotate(15deg);
    opacity: 0.2;
  }
  50% {
    transform: translate(-15px, 15px) rotate(-10deg);
    opacity: 0.1;
  }
  75% {
    transform: translate(25px, -20px) rotate(20deg);
    opacity: 0.15;
  }
}

/* Category Pills */
.category-pill {
  @apply inline-flex items-center px-6 py-3 rounded-full;
  @apply bg-white text-gray-700 border-2 border-gray-200;
  @apply font-semibold transition-all duration-200;
  @apply hover:border-primary-500 hover:text-primary-600 hover:scale-105;
  @apply shadow-md hover:shadow-lg;
}

.category-pill--active {
  @apply bg-gradient-to-r from-primary-600 to-primary-light;
  @apply text-white border-transparent;
  @apply scale-105 shadow-lg;
}

/* FAQ Card */
.faq-card {
  @apply bg-white rounded-2xl p-6 shadow-md;
  @apply transition-all duration-300;
  @apply hover:shadow-xl;
  opacity: 0;
  animation: fade-in-up 0.4s ease forwards;
}

/* Helpful Button */
.helpful-button {
  @apply inline-flex items-center px-3 py-2 text-sm font-medium;
  @apply bg-gray-100 text-gray-700 rounded-lg;
  @apply hover:bg-orange-50 hover:text-orange-600;
  @apply transition-colors duration-200;
}

/* Premium Buttons */
.premium-button {
  @apply inline-flex items-center justify-center px-8 py-4;
  @apply bg-gradient-to-r from-primary-600 to-primary-light;
  @apply text-white font-bold rounded-xl;
  @apply hover:from-primary-700 hover:to-primary-600;
  @apply transition-all duration-300 hover:scale-105;
  @apply shadow-lg hover:shadow-xl;
}

.premium-button-outline {
  @apply inline-flex items-center justify-center px-8 py-4;
  @apply bg-white text-gray-700 font-bold rounded-xl;
  @apply border-2 border-gray-300 hover:bg-gray-50;
  @apply transition-all duration-300 hover:scale-105;
  @apply shadow-lg hover:shadow-xl;
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
</style>