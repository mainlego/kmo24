// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Модули
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/google-fonts',
  ],

  // Настройки CSS
  css: ['~/assets/scss/main.scss'],

  // Настройки Vite
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_variables.scss" as *;',
        },
      },
    },
  },

  // Google Fonts
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
      'Plus Jakarta Sans': [400, 500, 600, 700],
    },
    display: 'swap',
  },

  // Runtime Config
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  // Настройки приложения
  app: {
    baseURL: '/kmo24/',
    head: {
      title: 'КМО24 - Профессиональное оборудование для кафе и ресторанов',
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content: 'КМО24 - комиссионный магазин б/у оборудования для кафе и ресторанов в Красноярске. Проверенное качество по выгодным ценам.'
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/kmo24/favicon.ico' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Настройки SSR (отключаем для GitHub Pages)
  ssr: false,

  // Настройки совместимости
  compatibilityDate: '2024-01-01',

  // Экспериментальные функции
  experimental: {
    payloadExtraction: false,
  },

  // Настройки Nitro
  nitro: {
    compressPublicAssets: true,
  },

  // TypeScript
  typescript: {
    strict: true,
    shim: false,
  },
});
