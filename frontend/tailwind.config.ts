import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS Configuration
 *
 * Этот файл интегрирует все SCSS переменные из _variables.scss
 * для использования в Tailwind классах. Теперь можно использовать
 * как Tailwind классы (bg-primary, text-gray-500), так и SCSS переменные ($primary).
 */

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],

  theme: {
    extend: {
      // Цветовая палитра - интеграция с SCSS
      colors: {
        // Основные цвета бренда (Orange)
        primary: {
          50: '#fff7ed',       // $primary-50
          100: '#ffedd5',      // $primary-100
          200: '#fed7aa',      // $primary-200
          300: '#fdba74',      // $primary-300
          400: '#fb923c',      // $primary-400
          500: '#f59e0b',      // $primary-500 - ОСНОВНОЙ
          600: '#ea580c',      // $primary-600 - Темный
          700: '#c2410c',      // $primary-700
          800: '#9a3412',      // $primary-800
          900: '#7c2d12',      // $primary-900
          DEFAULT: '#f59e0b',  // = 500
          light: '#fbbf24',    // Яркий светлый
          dark: '#ea580c',     // = 600
        },

        // Вторичный цвет - нейтральный серый
        secondary: {
          DEFAULT: '#4b5563',  // = gray-600
        },

        // Системные цвета (Статусы)
        success: {
          DEFAULT: '#10b981',  // $success
          light: '#d1fae5',    // $success-light
        },
        error: {
          DEFAULT: '#ef4444',  // $error
          light: '#fee2e2',    // $error-light
        },
        info: {
          DEFAULT: '#3b82f6',  // $info
          light: '#dbeafe',    // $info-light
        },
        warning: {
          DEFAULT: '#f59e0b',  // = primary
          light: '#fef3c7',    // $warning-light
        },

        // Нейтральная палитра (Gray scale)
        gray: {
          50: '#f9fafb',       // $gray-50
          100: '#f3f4f6',      // $gray-100
          200: '#e5e7eb',      // $gray-200
          300: '#d1d5db',      // $gray-300
          400: '#9ca3af',      // $gray-400
          500: '#6b7280',      // $gray-500
          600: '#4b5563',      // $gray-600
          700: '#374151',      // $gray-700
          800: '#1f2937',      // $gray-800
          900: '#111827',      // $gray-900
        },
      },

      // Шрифты
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },

      // Размеры шрифтов
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px - $font-size-xs
        sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - $font-size-sm
        base: ['1rem', { lineHeight: '1.5rem' }],     // 16px - $font-size-base
        lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px - $font-size-lg
        xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px - $font-size-xl
        '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px - $font-size-2xl
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - $font-size-3xl
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px - $font-size-4xl
        '5xl': ['3rem', { lineHeight: '1' }],         // 48px - $font-size-5xl
      },

      // Веса шрифтов
      fontWeight: {
        light: '300',      // $font-weight-light
        normal: '400',     // $font-weight-normal
        medium: '500',     // $font-weight-medium
        semibold: '600',   // $font-weight-semibold
        bold: '700',       // $font-weight-bold
      },

      // Высота строки
      lineHeight: {
        tight: '1.25',     // $line-height-tight
        normal: '1.5',     // $line-height-normal
        relaxed: '1.75',   // $line-height-relaxed
      },

      // Отступы (spacing)
      spacing: {
        'xs': '0.25rem',   // 4px - $spacing-xs
        'sm': '0.5rem',    // 8px - $spacing-sm
        'md': '1rem',      // 16px - $spacing-md
        'lg': '1.5rem',    // 24px - $spacing-lg
        'xl': '2rem',      // 32px - $spacing-xl
        '2xl': '3rem',     // 48px - $spacing-2xl
        '3xl': '4rem',     // 64px - $spacing-3xl
      },

      // Скругления (border radius)
      borderRadius: {
        sm: '0.25rem',     // 4px - $radius-sm
        DEFAULT: '0.375rem', // 6px - $radius-md
        md: '0.375rem',    // 6px - $radius-md
        lg: '0.5rem',      // 8px - $radius-lg
        xl: '0.75rem',     // 12px - $radius-xl
        '2xl': '1rem',     // 16px - $radius-2xl
        full: '9999px',    // $radius-full
      },

      // Тени (box-shadow)
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px rgba(245, 158, 11, 0.5)',
        colored: '0 10px 40px rgba(245, 158, 11, 0.3)',
      },

      // Переходы (transitions)
      transitionDuration: {
        fast: '150ms',     // $transition-fast
        DEFAULT: '200ms',  // $transition-base
        base: '200ms',     // $transition-base
        slow: '300ms',     // $transition-slow
      },

      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',      // $transition-ease
        ease: 'cubic-bezier(0.4, 0, 0.2, 1)',         // $transition-ease
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',      // $transition-ease-in
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',     // $transition-ease-out
      },

      // Z-index
      zIndex: {
        dropdown: '1000',        // $z-index-dropdown
        sticky: '1020',          // $z-index-sticky
        fixed: '1030',           // $z-index-fixed
        'modal-backdrop': '1040', // $z-index-modal-backdrop
        modal: '1050',           // $z-index-modal
        popover: '1060',         // $z-index-popover
        tooltip: '1070',         // $z-index-tooltip
      },

      // Контейнер
      maxWidth: {
        container: '1280px',   // $container-max-width
      },

      // Сетка
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))', // $grid-columns
      },

      gap: {
        gutter: '1.5rem',      // $grid-gutter
      },

      // Breakpoints (экраны)
      screens: {
        sm: '640px',           // $breakpoint-sm
        md: '768px',           // $breakpoint-md
        lg: '1024px',          // $breakpoint-lg
        xl: '1280px',          // $breakpoint-xl
        '2xl': '1536px',       // $breakpoint-2xl
      },

      // Градиенты (через backgroundImage) - только оранжевые
      backgroundImage: {
        // Основной градиент (кнопки, акценты) - оранжевый
        'gradient-primary': 'linear-gradient(135deg, #f59e0b, #ea580c)',

        // Hero секция - оранжевый градиент
        'gradient-hero': 'linear-gradient(135deg, #fb923c 0%, #f59e0b 50%, #ea580c 100%)',

        // CTA секция - оранжевый к красному
        'gradient-cta': 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #ef4444 100%)',

        // Градиент для текста - оранжевый с затемнением
        'gradient-text': 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',

        // Градиент для текста (теплый) - яркий оранжевый
        'gradient-text-warm': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',

        // Footer градиент (темный) - серый
        'gradient-footer': 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',

        // Декоративная линия - оранжевый с прозрачностью
        'gradient-rainbow': 'linear-gradient(90deg, transparent, #f59e0b, #fb923c, transparent)',
      },

      // Анимации
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'skeleton': 'skeleton-loading 1.5s ease-in-out infinite',
      },

      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'skeleton-loading': {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
    },
  },

  plugins: [],
} satisfies Config
