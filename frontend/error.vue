<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-orange-50 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Floating Orbs -->
      <div class="absolute top-20 left-20 w-72 h-72 bg-primary-200/30 rounded-full filter blur-3xl animate-float"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-orange-200/30 rounded-full filter blur-3xl animate-float animation-delay-2"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-100/30 rounded-full filter blur-3xl animate-float animation-delay-4"></div>

      <!-- Floating Icons -->
      <div v-for="i in 12" :key="`icon-${i}`"
        class="floating-icon absolute"
        :style="`left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-delay: ${Math.random() * 5}s`">
        <svg class="w-8 h-8 text-gray-300/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getRandomIcon()"></path>
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-4 text-center">
      <!-- 404 Number with Animation -->
      <div class="mb-8 animate-bounce-in">
        <div class="relative inline-block">
          <!-- Glowing Effect -->
          <div class="absolute inset-0 blur-3xl opacity-30">
            <span class="text-9xl md:text-[20rem] font-black bg-gradient-to-r from-primary-600 via-primary-500 to-orange-600 bg-clip-text text-transparent">
              404
            </span>
          </div>

          <!-- Main Number -->
          <h1 class="relative text-9xl md:text-[20rem] font-black bg-gradient-to-r from-primary-600 via-primary-500 to-orange-600 bg-clip-text text-transparent animate-gradient">
            404
          </h1>

          <!-- Floating Elements Around Number -->
          <div class="absolute -top-8 -left-8 w-16 h-16 bg-orange-400 rounded-full animate-ping opacity-20"></div>
          <div class="absolute -bottom-8 -right-8 w-20 h-20 bg-orange-400 rounded-full animate-ping opacity-20 animation-delay-1"></div>
        </div>
      </div>

      <!-- Error Message -->
      <div class="mb-8 animate-fade-in-up animation-delay-1">
        <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Страница не найдена
        </h2>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          {{ errorMessage }}
        </p>
      </div>

      <!-- Suggestions -->
      <div class="mb-12 animate-fade-in-up animation-delay-2">
        <div class="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200">
          <div class="flex-shrink-0">
            <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div class="text-left">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Возможные причины:</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li>• Страница была перемещена или удалена</li>
              <li>• В адресе допущена ошибка</li>
              <li>• Ссылка устарела</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up animation-delay-3">
        <NuxtLink to="/" class="premium-button group">
          <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          На главную
        </NuxtLink>

        <button @click="goBack" class="premium-button-outline group">
          <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Вернуться назад
        </button>

        <NuxtLink to="/products" class="premium-button-outline group">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          Каталог товаров
        </NuxtLink>
      </div>

      <!-- Quick Links -->
      <div class="animate-fade-in-up animation-delay-4">
        <p class="text-sm text-gray-500 mb-4">Популярные разделы:</p>
        <div class="flex flex-wrap gap-3 justify-center">
          <NuxtLink
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="quick-link group"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="link.icon"></path>
            </svg>
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>

      <!-- Search -->
      <div class="mt-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-5">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Или попробуйте найти то, что искали..."
            class="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-md border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/30 focus:border-primary-500 transition-all shadow-lg"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  error: {
    type: Object,
    default: () => ({})
  }
})

// SEO
useHead({
  title: '404 - Страница не найдена | КМО24',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const searchQuery = ref('')

const errorMessage = computed(() => {
  if (props.error?.statusCode === 404) {
    return 'К сожалению, запрашиваемая страница не существует. Возможно, она была перемещена или удалена.'
  }
  return props.error?.message || 'Произошла неожиданная ошибка. Пожалуйста, попробуйте позже.'
})

const quickLinks = [
  {
    to: '/about',
    label: 'О компании',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    to: '/delivery',
    label: 'Доставка',
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
  },
  {
    to: '/contacts',
    label: 'Контакты',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
  },
  {
    to: '/news',
    label: 'Новости',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
  }
]

const iconPaths = [
  'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
]

const getRandomIcon = () => {
  return iconPaths[Math.floor(Math.random() * iconPaths.length)]
}

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/products?search=${encodeURIComponent(searchQuery.value)}`)
  }
}
</script>

<style scoped>
/* Floating Icons */
.floating-icon {
  animation: float-icon 15s ease-in-out infinite;
}

@keyframes float-icon {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translate(30px, -30px) rotate(90deg);
    opacity: 0.5;
  }
  50% {
    transform: translate(-20px, 20px) rotate(180deg);
    opacity: 0.3;
  }
  75% {
    transform: translate(20px, -10px) rotate(270deg);
    opacity: 0.4;
  }
}

/* Animated Gradient */
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

/* Float Animation */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

/* Bounce In Animation */
@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(-100px);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Fade In Up */
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

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease forwards;
}

.animation-delay-1 { animation-delay: 0.1s; }
.animation-delay-2 { animation-delay: 0.2s; }
.animation-delay-3 { animation-delay: 0.3s; }
.animation-delay-4 { animation-delay: 0.4s; }
.animation-delay-5 { animation-delay: 0.5s; }

/* Premium Buttons */
.premium-button {
  @apply inline-flex items-center justify-center px-8 py-4;
  @apply bg-gradient-to-r from-primary-600 to-primary-light;
  @apply text-white font-bold rounded-xl;
  @apply hover:from-primary-700 hover:to-primary-500;
  @apply transition-all duration-300 hover:scale-105;
  @apply shadow-xl hover:shadow-2xl;
}

.premium-button-outline {
  @apply inline-flex items-center justify-center px-8 py-4;
  @apply bg-white/90 backdrop-blur-md text-gray-700 font-bold rounded-xl;
  @apply border-2 border-gray-300 hover:bg-gray-50;
  @apply transition-all duration-300 hover:scale-105;
  @apply shadow-lg hover:shadow-xl;
}

/* Quick Links */
.quick-link {
  @apply inline-flex items-center gap-2 px-4 py-2;
  @apply bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg;
  @apply border border-gray-200 hover:border-primary-500;
  @apply transition-all duration-200 hover:scale-105;
  @apply text-sm font-medium;
  @apply hover:text-primary-600 hover:shadow-md;
}
</style>