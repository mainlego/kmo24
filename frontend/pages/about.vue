<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Hero Section with Parallax Effect -->
    <section class="relative h-[70vh] overflow-hidden">
      <!-- Background with Parallax -->
      <div class="absolute inset-0 parallax-bg">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-indigo-900/90"></div>
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920"
          alt="Office background"
          class="w-full h-full object-cover"
        />
        <!-- Animated Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      <!-- Floating Particles -->
      <div class="absolute inset-0 overflow-hidden">
        <div v-for="i in 15" :key="`particle-${i}`"
          class="floating-particle absolute w-2 h-2 bg-white/20 rounded-full"
          :style="`left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-delay: ${Math.random() * 5}s; animation-duration: ${15 + Math.random() * 10}s`">
        </div>
      </div>

      <!-- Content -->
      <div class="relative h-full flex items-center justify-center text-center px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Animated Badge -->
          <div class="inline-block animate-slide-down mb-6">
            <span class="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm">
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              С 2015 года на рынке
            </span>
          </div>

          <!-- Title with Gradient Animation -->
          <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
            <span class="gradient-text-animated">О компании КМО24</span>
          </h1>

          <!-- Description -->
          <p class="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in-up animation-delay-1">
            Ваш надежный партнер в мире комиссионного оборудования
          </p>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-2">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-white counter" data-target="8">0</div>
              <div class="text-white/70 text-sm mt-1">Лет на рынке</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-white counter" data-target="5000">0</div>
              <div class="text-white/70 text-sm mt-1">Довольных клиентов</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-white counter" data-target="10000">0</div>
              <div class="text-white/70 text-sm mt-1">Единиц техники</div>
            </div>
          </div>

          <!-- Scroll Indicator -->
          <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg class="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section with Glass Cards -->
    <section class="py-20 px-4 relative">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" :style="{ backgroundImage: `url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.4&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')` }"></div>
      </div>

      <div class="max-w-7xl mx-auto relative">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4 section-title">
            Наша миссия и ценности
          </h2>
          <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Mission Card -->
          <div class="glass-card group hover-lift">
            <div class="p-8">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold mb-3">Миссия</h3>
              <p class="text-gray-600 leading-relaxed">
                Делаем качественное промышленное оборудование доступным для бизнеса любого масштаба через комиссионные решения.
              </p>
            </div>
          </div>

          <!-- Vision Card -->
          <div class="glass-card group hover-lift animation-delay-1">
            <div class="p-8">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold mb-3">Видение</h3>
              <p class="text-gray-600 leading-relaxed">
                Стать лидером рынка комиссионного оборудования в России, предоставляя клиентам лучший сервис и гарантии.
              </p>
            </div>
          </div>

          <!-- Values Card -->
          <div class="glass-card group hover-lift animation-delay-2">
            <div class="p-8">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold mb-3">Ценности</h3>
              <p class="text-gray-600 leading-relaxed">
                Честность, прозрачность, ответственность и забота о каждом клиенте — основа нашей работы.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            Наш путь к успеху
          </h2>
          <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <!-- Timeline -->
        <div class="relative">
          <!-- Central Line -->
          <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full hidden md:block"></div>

          <!-- Timeline Items -->
          <div class="space-y-12">
            <!-- 2015 -->
            <div class="timeline-item relative flex items-center justify-between">
              <div class="w-full md:w-5/12 text-right pr-8 timeline-content-left">
                <div class="glass-card p-6 hover-lift">
                  <h3 class="text-2xl font-bold text-blue-600 mb-2">2015</h3>
                  <h4 class="text-xl font-semibold mb-2">Основание компании</h4>
                  <p class="text-gray-600">Начали с небольшого склада и команды из 3 человек</p>
                </div>
              </div>
              <div class="timeline-dot"></div>
              <div class="w-full md:w-5/12"></div>
            </div>

            <!-- 2017 -->
            <div class="timeline-item relative flex items-center justify-between">
              <div class="w-full md:w-5/12"></div>
              <div class="timeline-dot"></div>
              <div class="w-full md:w-5/12 pl-8 timeline-content-right">
                <div class="glass-card p-6 hover-lift">
                  <h3 class="text-2xl font-bold text-green-600 mb-2">2017</h3>
                  <h4 class="text-xl font-semibold mb-2">Расширение ассортимента</h4>
                  <p class="text-gray-600">Добавили металлообрабатывающее оборудование</p>
                </div>
              </div>
            </div>

            <!-- 2019 -->
            <div class="timeline-item relative flex items-center justify-between">
              <div class="w-full md:w-5/12 text-right pr-8 timeline-content-left">
                <div class="glass-card p-6 hover-lift">
                  <h3 class="text-2xl font-bold text-primary-600 mb-2">2019</h3>
                  <h4 class="text-xl font-semibold mb-2">Открытие филиалов</h4>
                  <p class="text-gray-600">Филиалы в Москве, Санкт-Петербурге и Екатеринбурге</p>
                </div>
              </div>
              <div class="timeline-dot"></div>
              <div class="w-full md:w-5/12"></div>
            </div>

            <!-- 2021 -->
            <div class="timeline-item relative flex items-center justify-between">
              <div class="w-full md:w-5/12"></div>
              <div class="timeline-dot"></div>
              <div class="w-full md:w-5/12 pl-8 timeline-content-right">
                <div class="glass-card p-6 hover-lift">
                  <h3 class="text-2xl font-bold text-orange-600 mb-2">2021</h3>
                  <h4 class="text-xl font-semibold mb-2">Цифровая трансформация</h4>
                  <p class="text-gray-600">Запуск онлайн-платформы и мобильного приложения</p>
                </div>
              </div>
            </div>

            <!-- 2023 -->
            <div class="timeline-item relative flex items-center justify-between">
              <div class="w-full md:w-5/12 text-right pr-8 timeline-content-left">
                <div class="glass-card p-6 hover-lift">
                  <h3 class="text-2xl font-bold text-red-600 mb-2">2023</h3>
                  <h4 class="text-xl font-semibold mb-2">Лидер рынка</h4>
                  <p class="text-gray-600">Более 10000 единиц техники и 5000 довольных клиентов</p>
                </div>
              </div>
              <div class="timeline-dot"></div>
              <div class="w-full md:w-5/12"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            Наша команда
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Профессионалы с многолетним опытом в индустрии
          </p>
          <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div class="grid md:grid-cols-4 gap-8">
          <!-- Team Member 1 -->
          <div class="team-card group">
            <div class="relative overflow-hidden rounded-2xl mb-4">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
                alt="CEO"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 class="text-xl font-bold mb-1">Александр Петров</h3>
            <p class="text-gray-500 mb-2">Генеральный директор</p>
            <div class="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href="#" class="text-gray-400 hover:text-blue-500 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- Team Member 2 -->
          <div class="team-card group animation-delay-1">
            <div class="relative overflow-hidden rounded-2xl mb-4">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
                alt="CFO"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 class="text-xl font-bold mb-1">Елена Иванова</h3>
            <p class="text-gray-500 mb-2">Финансовый директор</p>
            <div class="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href="#" class="text-gray-400 hover:text-blue-500 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- Team Member 3 -->
          <div class="team-card group animation-delay-2">
            <div class="relative overflow-hidden rounded-2xl mb-4">
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
                alt="CTO"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 class="text-xl font-bold mb-1">Михаил Сидоров</h3>
            <p class="text-gray-500 mb-2">Технический директор</p>
            <div class="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href="#" class="text-gray-400 hover:text-blue-500 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- Team Member 4 -->
          <div class="team-card group animation-delay-3">
            <div class="relative overflow-hidden rounded-2xl mb-4">
              <img
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400"
                alt="Head of Sales"
                class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h3 class="text-xl font-bold mb-1">Анна Козлова</h3>
            <p class="text-gray-500 mb-2">Руководитель продаж</p>
            <div class="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href="#" class="text-gray-400 hover:text-blue-500 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partners Section -->
    <section class="py-20 px-4 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            Наши партнеры
          </h2>
          <p class="text-xl text-gray-600">
            Работаем с лидерами индустрии
          </p>
          <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mt-4"></div>
        </div>

        <!-- Partners Carousel -->
        <div class="overflow-hidden">
          <div class="partners-carousel flex space-x-12">
            <div v-for="i in 8" :key="`partner-${i}`" class="partner-logo flex-shrink-0">
              <div class="w-40 h-20 bg-white rounded-xl shadow-md flex items-center justify-center hover:shadow-xl transition-shadow">
                <span class="text-2xl font-bold text-gray-400">Partner {{ i }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 relative overflow-hidden">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>

      <!-- Animated Orbs -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full filter blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-primary-100/10 rounded-full filter blur-3xl animate-float animation-delay-2"></div>
      </div>

      <div class="relative max-w-4xl mx-auto text-center text-white">
        <h2 class="text-4xl md:text-5xl font-bold mb-6">
          Готовы начать сотрудничество?
        </h2>
        <p class="text-xl mb-8 text-white/90">
          Свяжитесь с нами сегодня и получите персональное предложение
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/contacts" class="premium-button-white">
            Связаться с нами
          </NuxtLink>
          <NuxtLink to="/products" class="premium-button-outline">
            Смотреть каталог
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

// SEO Meta tags
useHead({
  title: 'О компании - КМО24',
  meta: [
    { name: 'description', content: 'КМО24 - ваш надежный партнер в мире комиссионного оборудования с 2015 года. Более 5000 довольных клиентов и 10000 единиц техники.' },
    { name: 'keywords', content: 'о компании, КМО24, комиссионное оборудование, история компании, миссия, команда' }
  ]
})

// Counter animation
const animateCounter = (element) => {
  const target = parseInt(element.dataset.target)
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      element.textContent = target.toLocaleString('ru-RU')
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current).toLocaleString('ru-RU')
    }
  }, 16)
}

// Intersection Observer for animations
let observer = null

onMounted(() => {
  // Counter animation
  const counters = document.querySelectorAll('.counter')
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        counterObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })

  counters.forEach(counter => {
    counterObserver.observe(counter)
  })

  // General animations
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated')
      }
    })
  }, {
    threshold: 0.1
  })

  // Observe elements
  document.querySelectorAll('.section-title, .timeline-item, .team-card, .glass-card').forEach(el => {
    observer.observe(el)
  })

  // Parallax effect
  const handleScroll = () => {
    const scrolled = window.scrollY
    const parallax = document.querySelector('.parallax-bg')
    if (parallax) {
      parallax.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  }

  window.addEventListener('scroll', handleScroll)

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (observer) {
      observer.disconnect()
    }
  })
})
</script>

<style scoped>
/* Gradient Text Animation */
.gradient-text-animated {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #667eea 75%, #764ba2 100%);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 8s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Floating Particles */
.floating-particle {
  animation: float-particle linear infinite;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Glass Card */
.glass-card {
  @apply bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100;
  transition: all 0.3s ease;
}

.glass-card:hover {
  @apply shadow-2xl bg-white/90;
  transform: translateY(-5px);
}

/* Timeline */
.timeline-dot {
  @apply absolute w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full;
  @apply left-1/2 transform -translate-x-1/2;
  @apply shadow-lg z-10;
  @apply hidden md:block;
}

.timeline-dot::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full;
  @apply animate-ping;
}

.timeline-item {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.timeline-item.animated {
  opacity: 1;
  transform: translateY(0);
}

.timeline-content-left {
  animation-delay: 0.2s;
}

.timeline-content-right {
  animation-delay: 0.4s;
}

/* Team Cards */
.team-card {
  @apply text-center;
  opacity: 0;
  transform: translateY(30px);
  animation: fade-in-up 0.6s ease forwards;
}

/* Partners Carousel */
.partners-carousel {
  animation: scroll-left 30s linear infinite;
}

@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Premium Buttons */
.premium-button-white {
  @apply inline-block px-8 py-4 bg-white text-blue-600 font-bold rounded-full;
  @apply hover:bg-gray-100 transition-all duration-300 hover:scale-105;
  @apply shadow-xl hover:shadow-2xl;
}

.premium-button-outline {
  @apply inline-block px-8 py-4 bg-transparent text-white font-bold rounded-full;
  @apply border-2 border-white/50 hover:bg-white/10 backdrop-blur-sm;
  @apply transition-all duration-300 hover:scale-105;
}

/* Hover Lift Effect */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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

/* Section Title Animation */
.section-title {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.section-title.animated {
  opacity: 1;
  transform: translateY(0);
}

/* Mobile Optimization */
@media (max-width: 768px) {
  .timeline-item {
    margin-left: 40px;
  }

  .timeline-item::before {
    content: '';
    @apply absolute left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500;
    transform: translateX(-20px);
  }

  .timeline-dot {
    @apply block;
    left: -20px;
    transform: translateX(0);
  }
}
</style>