<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Page Header - Minimalist -->
    <section class="page-header">
      <div class="max-w-7xl mx-auto px-4">
        <h1 class="page-title">Новости компании</h1>
        <p class="page-subtitle">Будьте в курсе последних событий и новинок</p>
        <div class="title-underline"></div>
      </div>
    </section>

    <!-- Filters -->
    <section class="py-8 px-4 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-md">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <!-- Search -->
          <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск новостей..."
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>

          <!-- Category Filter -->
          <select v-model="selectedCategory" class="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
            <option value="">Все категории</option>
            <option value="company">Компания</option>
            <option value="products">Продукты</option>
            <option value="events">Мероприятия</option>
            <option value="tech">Технологии</option>
          </select>

          <!-- Sort -->
          <select v-model="sortBy" class="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white">
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="popular">Популярные</option>
          </select>
        </div>
      </div>
    </section>

    <!-- Featured News -->
    <section v-if="featuredNews" class="py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center mb-8">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-light rounded-xl flex items-center justify-center mr-3">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold">Главная новость</h2>
        </div>

        <div class="featured-news-card group">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Image -->
            <div class="relative overflow-hidden rounded-2xl h-80 md:h-auto">
              <img
                :src="featuredNews.image"
                :alt="featuredNews.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div class="absolute top-4 left-4">
                <span class="inline-block px-3 py-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-bold rounded-full">
                  Главное
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="flex flex-col justify-center">
              <div class="flex items-center gap-4 mb-4">
                <span class="text-sm text-gray-500">{{ formatDate(featuredNews.date) }}</span>
                <span class="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                  {{ getCategoryName(featuredNews.category) }}
                </span>
              </div>

              <h3 class="text-3xl md:text-4xl font-bold mb-4 group-hover:text-primary-600 transition-colors">
                {{ featuredNews.title }}
              </h3>

              <p class="text-gray-600 text-lg mb-6 line-clamp-3">
                {{ featuredNews.excerpt }}
              </p>

              <div class="flex items-center gap-6 mb-6">
                <div class="flex items-center text-gray-500">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  {{ featuredNews.views }} просмотров
                </div>
                <div class="flex items-center text-gray-500">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ featuredNews.readTime }} мин чтения
                </div>
              </div>

              <NuxtLink :to="`/news/${featuredNews.slug}`" class="premium-button w-fit">
                Читать полностью
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- News Grid -->
    <section class="py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <div v-if="filteredNews.length === 0" class="text-center py-16">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">Новостей не найдено</h3>
          <p class="text-gray-600">Попробуйте изменить параметры поиска</p>
        </div>

        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="(article, index) in filteredNews"
            :key="article.id"
            class="news-card group"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <!-- Image -->
            <div class="relative overflow-hidden rounded-t-2xl h-56">
              <img
                :src="article.image"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div class="absolute top-4 left-4">
                <span class="inline-block px-3 py-1 text-white text-xs font-bold rounded-full"
                  :class="getCategoryColor(article.category)">
                  {{ getCategoryName(article.category) }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="flex items-center text-sm text-gray-500 mb-3">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                </svg>
                {{ formatDate(article.date) }}
              </div>

              <h3 class="text-xl font-bold mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                {{ article.title }}
              </h3>

              <p class="text-gray-600 mb-4 line-clamp-3">
                {{ article.excerpt }}
              </p>

              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    {{ article.views }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ article.readTime}} мин
                  </span>
                </div>

                <NuxtLink :to="`/news/${article.slug}`" class="text-primary-600 hover:text-primary-700 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                  Читать
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <!-- Load More -->
        <div v-if="hasMore" class="text-center mt-12">
          <button @click="loadMore" class="premium-button-outline">
            <svg v-if="!loading" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <svg v-else class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Загрузка...' : 'Загрузить еще' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-20 px-4 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-light relative overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full filter blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-primary-light/10 rounded-full filter blur-3xl animate-float animation-delay-2"></div>
      </div>

      <div class="relative max-w-4xl mx-auto text-center text-white">
        <svg class="w-16 h-16 mx-auto mb-6 text-white/80" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
        </svg>

        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Подпишитесь на рассылку
        </h2>
        <p class="text-xl mb-8 text-white/90">
          Получайте свежие новости и эксклюзивные предложения первыми
        </p>

        <form @submit.prevent="subscribe" class="max-w-md mx-auto">
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              v-model="email"
              type="email"
              placeholder="Ваш email"
              required
              class="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-white/30 transition-all"
            />
            <button
              type="submit"
              class="px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
            >
              Подписаться
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const { apiFetch } = useApi()

// SEO
useHead({
  title: 'Новости - КМО24',
  meta: [
    { name: 'description', content: 'Последние новости и обновления от компании КМО24. Будьте в курсе событий индустрии комиссионного оборудования.' },
    { name: 'keywords', content: 'новости, обновления, события, КМО24, оборудование' }
  ]
})

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const loading = ref(false)
const hasMore = ref(false)
const email = ref('')
const page = ref(1)
const limit = 9

// News data from API
const allNews = ref([])
const featuredNews = ref(null)
const totalPages = ref(1)

// Fetch news from API
const fetchNews = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: page.value.toString(),
      limit: limit.toString(),
    })

    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    if (selectedCategory.value) {
      params.append('tag', selectedCategory.value)
    }
    if (sortBy.value === 'oldest') {
      params.append('sort', 'publishedAt')
    } else if (sortBy.value === 'popular') {
      params.append('sort', '-stats.views')
    } else {
      params.append('sort', '-publishedAt')
    }

    const response = await apiFetch(`/news?${params.toString()}`)

    if (response.success && response.data) {
      if (page.value === 1) {
        allNews.value = response.data
        // Set first item as featured
        if (response.data.length > 0) {
          featuredNews.value = {
            ...response.data[0],
            image: response.data[0].thumbnail || 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800',
            date: response.data[0].publishedAt,
            category: response.data[0].tags?.[0] || 'news',
            views: response.data[0].stats?.views || 0,
            readTime: Math.ceil((response.data[0].content?.length || 500) / 1000)
          }
        }
      } else {
        allNews.value = [...allNews.value, ...response.data]
      }

      if (response.pagination) {
        totalPages.value = response.pagination.totalPages || 1
        hasMore.value = page.value < totalPages.value
      }
    }
  } catch (error) {
    console.error('Error fetching news:', error)
  } finally {
    loading.value = false
  }
}

// Map news data for display
const filteredNews = computed(() => {
  return allNews.value.slice(1).map(item => ({
    ...item,
    id: item._id,
    image: item.thumbnail || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
    date: item.publishedAt,
    category: item.tags?.[0] || 'news',
    views: item.stats?.views || 0,
    readTime: Math.ceil((item.content?.length || 500) / 1000)
  }))
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const getCategoryName = (category) => {
  const names = {
    company: 'Компания',
    products: 'Продукты',
    events: 'Мероприятия',
    tech: 'Технологии',
    news: 'Новости',
    promo: 'Акции',
    article: 'Статьи',
    announcement: 'Объявления'
  }
  return names[category] || category
}

const getCategoryColor = (category) => {
  const colors = {
    company: 'bg-orange-500',
    products: 'bg-orange-500',
    events: 'bg-primary-500',
    tech: 'bg-orange-500',
    news: 'bg-blue-500',
    promo: 'bg-green-500',
    article: 'bg-purple-500',
    announcement: 'bg-red-500'
  }
  return colors[category] || 'bg-gray-500'
}

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  page.value++
  await fetchNews()
}

const subscribe = () => {
  if (email.value) {
    alert(`Спасибо за подписку! Письмо отправлено на ${email.value}`)
    email.value = ''
  }
}

// Watch for filter changes
watch([searchQuery, selectedCategory, sortBy], () => {
  page.value = 1
  fetchNews()
})

// Initial fetch
onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
/* Page Header - Minimalist */
.page-header {
  padding-top: 5.5rem;
  @apply pb-4 text-center bg-white border-b border-gray-100 mb-8;
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

/* Featured News Card */
.featured-news-card {
  @apply bg-white rounded-2xl shadow-2xl overflow-hidden;
  @apply transform transition-all duration-500;
  @apply hover:shadow-2xl hover:-translate-y-2;
}

/* News Card */
.news-card {
  @apply bg-white rounded-2xl shadow-lg overflow-hidden;
  @apply transform transition-all duration-300;
  @apply hover:shadow-2xl hover:-translate-y-2;
  opacity: 0;
  animation: fade-in-up 0.6s ease forwards;
}

/* Premium Button */
.premium-button {
  @apply inline-flex items-center justify-center px-8 py-4;
  @apply bg-gradient-to-r from-primary-600 to-primary-500;
  @apply text-white font-bold rounded-xl;
  @apply hover:from-primary-700 hover:to-primary-600;
  @apply transition-all duration-300 hover:scale-105;
  @apply shadow-lg hover:shadow-xl;
}

.premium-button-outline {
  @apply inline-flex items-center justify-center px-8 py-4;
  @apply bg-transparent text-gray-700 font-bold rounded-xl;
  @apply border-2 border-gray-300 hover:bg-gray-50;
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

/* Float Animation */
@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

/* Line Clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>