<template>
  <div class="design-system-showcase">
    <div class="showcase-container">
      <h1 class="showcase-title">Дизайн-система КМО24</h1>

      <!-- Цветовая палитра -->
      <section class="showcase-section">
        <h2 class="showcase-section-title">Цветовая палитра</h2>

        <div class="color-group">
          <h3 class="color-group-title">Основные цвета бренда</h3>
          <div class="color-grid">
            <div class="color-card">
              <div class="color-preview bg-primary"></div>
              <div class="color-info">
                <span class="color-name">Primary</span>
                <span class="color-value">#f59e0be6</span>
                <code class="color-code">$primary</code>
              </div>
            </div>

            <div class="color-card">
              <div class="color-preview bg-primary-light"></div>
              <div class="color-info">
                <span class="color-name">Primary Light</span>
                <span class="color-value">#fbbf24</span>
                <code class="color-code">$primary-light</code>
              </div>
            </div>

            <div class="color-card">
              <div class="color-preview bg-primary-dark"></div>
              <div class="color-info">
                <span class="color-name">Primary Dark</span>
                <span class="color-value">#fbbf24</span>
                <code class="color-code">$primary-dark</code>
              </div>
            </div>

            <div class="color-card">
              <div class="color-preview bg-secondary"></div>
              <div class="color-info">
                <span class="color-name">Secondary (Gray)</span>
                <span class="color-value">#4b5563</span>
                <code class="color-code">$secondary</code>
              </div>
            </div>
          </div>
        </div>

        <div class="color-group">
          <h3 class="color-group-title">Системные цвета</h3>
          <div class="color-grid">
            <div class="color-card">
              <div class="color-preview bg-success"></div>
              <div class="color-info">
                <span class="color-name">Success</span>
                <span class="color-value">#10b981</span>
                <code class="color-code">$success</code>
              </div>
            </div>

            <div class="color-card">
              <div class="color-preview bg-error"></div>
              <div class="color-info">
                <span class="color-name">Error</span>
                <span class="color-value">#ef4444</span>
                <code class="color-code">$error</code>
              </div>
            </div>

            <div class="color-card">
              <div class="color-preview bg-info"></div>
              <div class="color-info">
                <span class="color-name">Info</span>
                <span class="color-value">#3b82f6</span>
                <code class="color-code">$info</code>
              </div>
            </div>

            <div class="color-card">
              <div class="color-preview bg-warning"></div>
              <div class="color-info">
                <span class="color-name">Warning</span>
                <span class="color-value">#f59e0be6</span>
                <code class="color-code">$warning</code>
              </div>
            </div>
          </div>
        </div>

        <div class="color-group">
          <h3 class="color-group-title">Primary Orange - Полная палитра</h3>
          <div class="color-grid">
            <div v-for="shade in primaryShades" :key="shade.value" class="color-card">
              <div :class="`color-preview bg-primary-${shade.value}`"></div>
              <div class="color-info">
                <span class="color-name">Primary {{ shade.value }}</span>
                <span class="color-description">{{ shade.name }}</span>
                <span class="color-value">{{ shade.hex }}</span>
                <code class="color-code">$primary-{{ shade.value }}</code>
              </div>
            </div>
          </div>
        </div>


        <div class="color-group">
          <h3 class="color-group-title">Gray Scale</h3>
          <div class="color-grid">
            <div v-for="shade in grayShades" :key="shade.name" class="color-card">
              <div :class="`color-preview bg-gray-${shade.value}`"></div>
              <div class="color-info">
                <span class="color-name">Gray {{ shade.value }}</span>
                <span class="color-value">{{ shade.hex }}</span>
                <code class="color-code">$gray-{{ shade.value }}</code>
              </div>
            </div>
          </div>
        </div>

        <div class="color-group">
          <h3 class="color-group-title">Градиенты - только оранжевые</h3>
          <div class="gradient-grid">
            <div class="gradient-card">
              <div class="gradient-preview bg-gradient-primary"></div>
              <span class="gradient-name">Primary</span>
              <small class="text-gray-500 text-xs">Оранжевый градиент</small>
            </div>
            <div class="gradient-card">
              <div class="gradient-preview bg-gradient-hero"></div>
              <span class="gradient-name">Hero</span>
              <small class="text-gray-500 text-xs">Оранжевый Hero</small>
            </div>
            <div class="gradient-card">
              <div class="gradient-preview bg-gradient-cta"></div>
              <span class="gradient-name">CTA</span>
              <small class="text-gray-500 text-xs">Оранжевый → Красный</small>
            </div>
            <div class="gradient-card">
              <div class="gradient-preview bg-gradient-text"></div>
              <span class="gradient-name">Text</span>
              <small class="text-gray-500 text-xs">Оранжевый затемнение</small>
            </div>
            <div class="gradient-card">
              <div class="gradient-preview bg-gradient-text-warm"></div>
              <span class="gradient-name">Text Warm</span>
              <small class="text-gray-500 text-xs">Яркий оранжевый</small>
            </div>
            <div class="gradient-card">
              <div class="gradient-preview bg-gradient-footer"></div>
              <span class="gradient-name">Footer</span>
              <small class="text-gray-500 text-xs">Серый темный</small>
            </div>
            <div class="gradient-card">
              <div class="gradient-preview bg-gradient-rainbow"></div>
              <span class="gradient-name">Декор</span>
              <small class="text-gray-500 text-xs">Оранжевая линия</small>
            </div>
          </div>
        </div>
      </section>

      <!-- Типографика -->
      <section class="showcase-section">
        <h2 class="showcase-section-title">Типографика</h2>

        <div class="typography-demo">
          <div class="text-5xl font-bold mb-2">Heading 5XL</div>
          <div class="text-4xl font-bold mb-2">Heading 4XL</div>
          <div class="text-3xl font-bold mb-2">Heading 3XL</div>
          <div class="text-2xl font-bold mb-2">Heading 2XL</div>
          <div class="text-xl font-bold mb-2">Heading XL</div>
          <div class="text-lg font-medium mb-2">Text Large</div>
          <div class="text-base mb-2">Text Base (16px)</div>
          <div class="text-sm mb-2">Text Small (14px)</div>
          <div class="text-xs">Text Extra Small (12px)</div>
        </div>

        <div class="font-weights-demo">
          <div class="font-light">Light (300)</div>
          <div class="font-normal">Normal (400)</div>
          <div class="font-medium">Medium (500)</div>
          <div class="font-semibold">Semibold (600)</div>
          <div class="font-bold">Bold (700)</div>
        </div>
      </section>

      <!-- Компоненты -->
      <section class="showcase-section">
        <h2 class="showcase-section-title">Компоненты</h2>

        <div class="components-demo">
          <div class="component-group">
            <h3 class="component-title">Кнопки</h3>
            <div class="flex flex-wrap gap-md">
              <BaseButton variant="primary" size="sm">Small</BaseButton>
              <BaseButton variant="primary" size="md">Medium</BaseButton>
              <BaseButton variant="primary" size="lg">Large</BaseButton>
            </div>
            <div class="flex flex-wrap gap-md mt-md">
              <BaseButton variant="primary">Primary</BaseButton>
              <BaseButton variant="secondary">Secondary</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
              <BaseButton variant="primary" disabled>Disabled</BaseButton>
            </div>
          </div>

          <div class="component-group">
            <h3 class="component-title">Badges</h3>
            <div class="flex flex-wrap gap-md">
              <BaseBadge variant="primary">Primary</BaseBadge>
              <BaseBadge variant="success">Success</BaseBadge>
              <BaseBadge variant="error">Error</BaseBadge>
              <BaseBadge variant="warning">Warning</BaseBadge>
              <BaseBadge variant="info">Info</BaseBadge>
            </div>
            <div class="flex flex-wrap gap-md mt-md">
              <BaseBadge size="sm">Small</BaseBadge>
              <BaseBadge size="md">Medium</BaseBadge>
              <BaseBadge size="lg">Large</BaseBadge>
            </div>
          </div>

          <div class="component-group">
            <h3 class="component-title">Карточки</h3>
            <div class="cards-grid">
              <BaseCard variant="elevated">
                <template #header>
                  <h4>Elevated Card</h4>
                </template>
                <p>Карточка с тенью</p>
              </BaseCard>

              <BaseCard variant="outlined">
                <template #header>
                  <h4>Outlined Card</h4>
                </template>
                <p>Карточка с бордером</p>
              </BaseCard>

              <BaseCard variant="flat">
                <template #header>
                  <h4>Flat Card</h4>
                </template>
                <p>Плоская карточка</p>
              </BaseCard>
            </div>
          </div>

          <div class="component-group">
            <h3 class="component-title">Формы</h3>
            <div class="forms-demo">
              <BaseInput
                label="Имя"
                placeholder="Введите ваше имя"
                class="mb-md"
              />
              <BaseSelect
                label="Категория"
                :options="[
                  { value: 1, label: 'Холодильное оборудование' },
                  { value: 2, label: 'Мебель для кафе' },
                ]"
                class="mb-md"
              />
              <BaseCheckbox>Согласен с условиями</BaseCheckbox>
            </div>
          </div>
        </div>
      </section>

      <!-- Spacing -->
      <section class="showcase-section">
        <h2 class="showcase-section-title">Отступы (Spacing)</h2>
        <div class="spacing-demo">
          <div class="spacing-item">
            <div class="spacing-visual" style="width: 4px;"></div>
            <span>xs (4px)</span>
          </div>
          <div class="spacing-item">
            <div class="spacing-visual" style="width: 8px;"></div>
            <span>sm (8px)</span>
          </div>
          <div class="spacing-item">
            <div class="spacing-visual" style="width: 16px;"></div>
            <span>md (16px)</span>
          </div>
          <div class="spacing-item">
            <div class="spacing-visual" style="width: 24px;"></div>
            <span>lg (24px)</span>
          </div>
          <div class="spacing-item">
            <div class="spacing-visual" style="width: 32px;"></div>
            <span>xl (32px)</span>
          </div>
          <div class="spacing-item">
            <div class="spacing-visual" style="width: 48px;"></div>
            <span>2xl (48px)</span>
          </div>
          <div class="spacing-item">
            <div class="spacing-visual" style="width: 64px;"></div>
            <span>3xl (64px)</span>
          </div>
        </div>
      </section>

      <!-- Border Radius -->
      <section class="showcase-section">
        <h2 class="showcase-section-title">Скругления (Border Radius)</h2>
        <div class="radius-demo">
          <div class="radius-item rounded-sm">sm (4px)</div>
          <div class="radius-item rounded-md">md (6px)</div>
          <div class="radius-item rounded-lg">lg (8px)</div>
          <div class="radius-item rounded-xl">xl (12px)</div>
          <div class="radius-item rounded-2xl">2xl (16px)</div>
          <div class="radius-item rounded-full">full</div>
        </div>
      </section>

      <!-- Shadows -->
      <section class="showcase-section">
        <h2 class="showcase-section-title">Тени (Shadows)</h2>
        <div class="shadows-demo">
          <div class="shadow-item shadow-sm">sm</div>
          <div class="shadow-item shadow-md">md</div>
          <div class="shadow-item shadow-lg">lg</div>
          <div class="shadow-item shadow-xl">xl</div>
          <div class="shadow-item shadow-2xl">2xl</div>
          <div class="shadow-item shadow-glow">glow</div>
          <div class="shadow-item shadow-colored">colored</div>
        </div>
      </section>

      <!-- Анимации -->
      <section class="showcase-section">
        <h2 class="showcase-section-title">Анимации</h2>
        <div class="animations-demo">
          <div class="animation-item animate-pulse">Pulse</div>
          <div class="animation-item animate-bounce">Bounce</div>
          <div class="animation-item animate-fade-in">Fade In</div>
          <div class="animation-item animate-float">Float</div>
          <div class="animation-item animate-shimmer">Shimmer</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const grayShades = [
  { name: '50', value: '50', hex: '#f9fafb' },
  { name: '100', value: '100', hex: '#f3f4f6' },
  { name: '200', value: '200', hex: '#e5e7eb' },
  { name: '300', value: '300', hex: '#d1d5db' },
  { name: '400', value: '400', hex: '#9ca3af' },
  { name: '500', value: '500', hex: '#6b7280' },
  { name: '600', value: '600', hex: '#4b5563' },
  { name: '700', value: '700', hex: '#374151' },
  { name: '800', value: '800', hex: '#1f2937' },
  { name: '900', value: '900', hex: '#111827' },
]

const primaryShades = [
  { value: '50', hex: '#fff7ed', name: 'Очень светлый' },
  { value: '100', hex: '#ffedd5', name: 'Светлый фон' },
  { value: '200', hex: '#fed7aa', name: 'Светлый акцент' },
  { value: '300', hex: '#fdba74', name: 'Средний светлый' },
  { value: '400', hex: '#fbbf24', name: 'Светлый' },
  { value: '500', hex: '#f59e0be6', name: 'ОСНОВНОЙ' },
  { value: '600', hex: '#fbbf24', name: 'Темный' },
  { value: '700', hex: '#c2410c', name: 'Более темный' },
  { value: '800', hex: '#9a3412', name: 'Очень темный' },
  { value: '900', hex: '#7c2d12', name: 'Самый темный' },
]

</script>

<style lang="scss" scoped>
@use '~/assets/scss/mixins' as *;

.design-system-showcase {
  min-height: 100vh;
  background: $gray-50;
  padding: $spacing-2xl $spacing-lg;
}

.showcase-container {
  @include container;
  max-width: 1400px;
}

.showcase-title {
  font-size: $font-size-5xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-3xl;
  text-align: center;

  @include text-gradient($gradient-primary);
}

.showcase-section {
  background: $white;
  border-radius: $radius-2xl;
  padding: $spacing-2xl;
  margin-bottom: $spacing-xl;
  box-shadow: $shadow-lg;
}

.showcase-section-title {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-xl;
  padding-bottom: $spacing-md;
  border-bottom: 2px solid $gray-200;
}

// Цвета
.color-group {
  margin-bottom: $spacing-xl;

  &:last-child {
    margin-bottom: 0;
  }
}

.color-group-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $gray-800;
  margin-bottom: $spacing-lg;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: $spacing-lg;
}

.color-card {
  border: 1px solid $gray-200;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $transition-base $transition-ease;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-4px);
  }
}

.color-preview {
  height: 100px;
  width: 100%;
}

.color-info {
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.color-name {
  font-weight: $font-weight-medium;
  color: $gray-900;
}

.color-value {
  font-size: $font-size-sm;
  color: $gray-600;
  font-family: monospace;
}

.color-code {
  font-size: $font-size-xs;
  color: $primary;
  background: rgba($primary, 0.1);
  padding: $spacing-xs $spacing-sm;
  border-radius: $radius-sm;
}

.color-description {
  font-size: $font-size-xs;
  color: $gray-500;
  font-style: italic;
}

// Градиенты
.gradient-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: $spacing-lg;
}

.gradient-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.gradient-preview {
  height: 100px;
  border-radius: $radius-lg;
  margin-bottom: $spacing-sm;
}

.gradient-name {
  font-weight: $font-weight-medium;
  color: $gray-700;
  font-size: $font-size-sm;
}

// Типографика
.typography-demo,
.font-weights-demo {
  margin-bottom: $spacing-xl;

  & > * {
    padding: $spacing-sm 0;
  }
}

// Компоненты
.components-demo {
  display: flex;
  flex-direction: column;
  gap: $spacing-2xl;
}

.component-group {
  padding: $spacing-lg;
  background: $gray-50;
  border-radius: $radius-xl;
}

.component-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  margin-bottom: $spacing-lg;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: $spacing-lg;
}

.forms-demo {
  max-width: 400px;
}

// Spacing
.spacing-demo {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.spacing-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;

  span {
    font-family: monospace;
    color: $gray-700;
  }
}

.spacing-visual {
  height: 40px;
  background: $primary;
  border-radius: $radius-sm;
}

// Border Radius
.radius-demo {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-lg;
}

.radius-item {
  padding: $spacing-lg $spacing-xl;
  background: $primary;
  color: $white;
  font-weight: $font-weight-medium;
}

// Shadows
.shadows-demo {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xl;
}

.shadow-item {
  padding: $spacing-xl;
  background: $white;
  border-radius: $radius-lg;
  font-weight: $font-weight-medium;
  color: $gray-900;
}

// Animations
.animations-demo {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-xl;
}

.animation-item {
  padding: $spacing-xl;
  background: $primary;
  color: $white;
  border-radius: $radius-lg;
  font-weight: $font-weight-medium;
}
</style>
