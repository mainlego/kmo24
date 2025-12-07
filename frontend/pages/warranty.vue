<template>
  <div class="warranty-page">
    <!-- Page Header -->
    <section class="page-header">
      <div class="container">
        <AdminEditableElement
          element-id="warranty-hero-title"
          tag="h1"
          type="text"
          label="Заголовок страницы"
          class="page-title"
          :default-value="'Гарантийные обязательства'"
        >
          {{ pageEditor.getElementValue('warranty-hero-title', 'Гарантийные обязательства') }}
        </AdminEditableElement>
        <AdminEditableElement
          element-id="warranty-hero-subtitle"
          tag="p"
          type="text"
          label="Подзаголовок страницы"
          class="page-subtitle"
          :default-value="'Надежность и качество каждой единицы оборудования'"
        >
          {{ pageEditor.getElementValue('warranty-hero-subtitle', 'Надежность и качество каждой единицы оборудования') }}
        </AdminEditableElement>
      </div>
    </section>

    <!-- Main Warranty Content -->
    <section class="warranty-content">
      <div class="container">
        <div class="warranty-card main-card">
          <AdminEditableElement
            element-id="warranty-conditions-title"
            tag="h2"
            type="text"
            label="Заголовок условий гарантии"
            class="section-title"
            :default-value="'Условия гарантии'"
          >
            {{ pageEditor.getElementValue('warranty-conditions-title', 'Условия гарантии') }}
          </AdminEditableElement>

          <div class="warranty-text">
            <AdminEditableElement
              element-id="warranty-conditions-text"
              tag="p"
              type="html"
              label="Описание условий гарантии"
              :default-value="warrantyConditionsDefault"
            >
              <span v-html="pageEditor.getElementValue('warranty-conditions-text', warrantyConditionsDefault)"></span>
            </AdminEditableElement>

            <AdminEditableElement
              element-id="warranty-includes-title"
              tag="h3"
              type="text"
              label="Заголовок 'Что включает гарантия'"
              :default-value="'Что включает гарантия:'"
            >
              {{ pageEditor.getElementValue('warranty-includes-title', 'Что включает гарантия:') }}
            </AdminEditableElement>
            <ul class="warranty-list">
              <AdminEditableElement
                element-id="warranty-includes-1"
                tag="li"
                type="text"
                label="Включает: пункт 1"
                :default-value="'Бесплатная диагностика оборудования'"
              >
                {{ pageEditor.getElementValue('warranty-includes-1', 'Бесплатная диагностика оборудования') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="warranty-includes-2"
                tag="li"
                type="text"
                label="Включает: пункт 2"
                :default-value="'Устранение технических неисправностей, возникших не по вине покупателя'"
              >
                {{ pageEditor.getElementValue('warranty-includes-2', 'Устранение технических неисправностей, возникших не по вине покупателя') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="warranty-includes-3"
                tag="li"
                type="text"
                label="Включает: пункт 3"
                :default-value="'Консультации по эксплуатации и обслуживанию'"
              >
                {{ pageEditor.getElementValue('warranty-includes-3', 'Консультации по эксплуатации и обслуживанию') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="warranty-includes-4"
                tag="li"
                type="text"
                label="Включает: пункт 4"
                :default-value="'Техническая поддержка по телефону'"
              >
                {{ pageEditor.getElementValue('warranty-includes-4', 'Техническая поддержка по телефону') }}
              </AdminEditableElement>
            </ul>

            <AdminEditableElement
              element-id="warranty-excludes-title"
              tag="h3"
              type="text"
              label="Заголовок 'Гарантия не распространяется на'"
              :default-value="'Гарантия не распространяется на:'"
            >
              {{ pageEditor.getElementValue('warranty-excludes-title', 'Гарантия не распространяется на:') }}
            </AdminEditableElement>
            <ul class="warranty-list excluded">
              <AdminEditableElement
                element-id="warranty-excludes-1"
                tag="li"
                type="text"
                label="Исключение: пункт 1"
                :default-value="'Механические повреждения, возникшие после получения товара'"
              >
                {{ pageEditor.getElementValue('warranty-excludes-1', 'Механические повреждения, возникшие после получения товара') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="warranty-excludes-2"
                tag="li"
                type="text"
                label="Исключение: пункт 2"
                :default-value="'Неисправности, вызванные неправильной эксплуатацией'"
              >
                {{ pageEditor.getElementValue('warranty-excludes-2', 'Неисправности, вызванные неправильной эксплуатацией') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="warranty-excludes-3"
                tag="li"
                type="text"
                label="Исключение: пункт 3"
                :default-value="'Повреждения, вызванные стихийными бедствиями'"
              >
                {{ pageEditor.getElementValue('warranty-excludes-3', 'Повреждения, вызванные стихийными бедствиями') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="warranty-excludes-4"
                tag="li"
                type="text"
                label="Исключение: пункт 4"
                :default-value="'Оборудование со следами самостоятельного ремонта'"
              >
                {{ pageEditor.getElementValue('warranty-excludes-4', 'Оборудование со следами самостоятельного ремонта') }}
              </AdminEditableElement>
              <AdminEditableElement
                element-id="warranty-excludes-5"
                tag="li"
                type="text"
                label="Исключение: пункт 5"
                :default-value="'Расходные материалы и комплектующие'"
              >
                {{ pageEditor.getElementValue('warranty-excludes-5', 'Расходные материалы и комплектующие') }}
              </AdminEditableElement>
            </ul>

            <div class="important-note">
              <svg class="note-icon" viewBox="0 0 24 24" fill="none">
                <path d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <div class="note-content">
                <AdminEditableElement
                  element-id="warranty-note-title"
                  tag="h4"
                  type="text"
                  label="Заголовок важной заметки"
                  :default-value="'Важно знать'"
                >
                  {{ pageEditor.getElementValue('warranty-note-title', 'Важно знать') }}
                </AdminEditableElement>
                <AdminEditableElement
                  element-id="warranty-note-text"
                  tag="p"
                  type="text"
                  label="Текст важной заметки"
                  :default-value="'Все оборудование проходит тщательную проверку перед продажей. Мы тестируем работоспособность всех функций и систем, чтобы гарантировать качество нашей продукции.'"
                >
                  {{ pageEditor.getElementValue('warranty-note-text', 'Все оборудование проходит тщательную проверку перед продажей. Мы тестируем работоспособность всех функций и систем, чтобы гарантировать качество нашей продукции.') }}
                </AdminEditableElement>
              </div>
            </div>
          </div>
        </div>

        <!-- How to Use Warranty -->
        <div class="warranty-card">
          <AdminEditableElement
            element-id="warranty-steps-title"
            tag="h2"
            type="text"
            label="Заголовок шагов гарантии"
            class="section-title"
            :default-value="'Как воспользоваться гарантией'"
          >
            {{ pageEditor.getElementValue('warranty-steps-title', 'Как воспользоваться гарантией') }}
          </AdminEditableElement>

          <div class="warranty-steps">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <AdminEditableElement
                  element-id="warranty-step1-title"
                  tag="h4"
                  type="text"
                  label="Шаг 1: заголовок"
                  :default-value="'Свяжитесь с нами'"
                >
                  {{ pageEditor.getElementValue('warranty-step1-title', 'Свяжитесь с нами') }}
                </AdminEditableElement>
                <AdminEditableElement
                  element-id="warranty-step1-text"
                  tag="p"
                  type="text"
                  label="Шаг 1: описание"
                  :default-value="'Позвоните по телефону +7 (391) 989-20-13 или напишите на email'"
                >
                  {{ pageEditor.getElementValue('warranty-step1-text', 'Позвоните по телефону +7 (391) 989-20-13 или напишите на email') }}
                </AdminEditableElement>
              </div>
            </div>

            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <AdminEditableElement
                  element-id="warranty-step2-title"
                  tag="h4"
                  type="text"
                  label="Шаг 2: заголовок"
                  :default-value="'Опишите проблему'"
                >
                  {{ pageEditor.getElementValue('warranty-step2-title', 'Опишите проблему') }}
                </AdminEditableElement>
                <AdminEditableElement
                  element-id="warranty-step2-text"
                  tag="p"
                  type="text"
                  label="Шаг 2: описание"
                  :default-value="'Расскажите о возникшей неисправности и условиях эксплуатации'"
                >
                  {{ pageEditor.getElementValue('warranty-step2-text', 'Расскажите о возникшей неисправности и условиях эксплуатации') }}
                </AdminEditableElement>
              </div>
            </div>

            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <AdminEditableElement
                  element-id="warranty-step3-title"
                  tag="h4"
                  type="text"
                  label="Шаг 3: заголовок"
                  :default-value="'Диагностика'"
                >
                  {{ pageEditor.getElementValue('warranty-step3-title', 'Диагностика') }}
                </AdminEditableElement>
                <AdminEditableElement
                  element-id="warranty-step3-text"
                  tag="p"
                  type="text"
                  label="Шаг 3: описание"
                  :default-value="'Привезите оборудование для диагностики или вызовите специалиста'"
                >
                  {{ pageEditor.getElementValue('warranty-step3-text', 'Привезите оборудование для диагностики или вызовите специалиста') }}
                </AdminEditableElement>
              </div>
            </div>

            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <AdminEditableElement
                  element-id="warranty-step4-title"
                  tag="h4"
                  type="text"
                  label="Шаг 4: заголовок"
                  :default-value="'Решение проблемы'"
                >
                  {{ pageEditor.getElementValue('warranty-step4-title', 'Решение проблемы') }}
                </AdminEditableElement>
                <AdminEditableElement
                  element-id="warranty-step4-text"
                  tag="p"
                  type="text"
                  label="Шаг 4: описание"
                  :default-value="'Мы устраним неисправность или предложим замену оборудования'"
                >
                  {{ pageEditor.getElementValue('warranty-step4-text', 'Мы устраним неисправность или предложим замену оборудования') }}
                </AdminEditableElement>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="warranty-card contact-card">
          <AdminEditableElement
            element-id="warranty-contact-title"
            tag="h2"
            type="text"
            label="Заголовок контактной секции"
            class="section-title"
            :default-value="'Остались вопросы?'"
          >
            {{ pageEditor.getElementValue('warranty-contact-title', 'Остались вопросы?') }}
          </AdminEditableElement>
          <AdminEditableElement
            element-id="warranty-contact-text"
            tag="p"
            type="text"
            label="Описание контактной секции"
            class="contact-text"
            :default-value="'Наши специалисты готовы ответить на все вопросы о гарантии и помочь с выбором оборудования'"
          >
            {{ pageEditor.getElementValue('warranty-contact-text', 'Наши специалисты готовы ответить на все вопросы о гарантии и помочь с выбором оборудования') }}
          </AdminEditableElement>
          <div class="contact-buttons">
            <a href="tel:+73919892013" class="btn-primary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" stroke-width="2"/>
              </svg>
              Позвонить
            </a>
            <NuxtLink to="/contacts" class="btn-secondary">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke="currentColor" stroke-width="2"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="2"/>
              </svg>
              Контакты
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePageEditor } from '../composables/usePageEditor';

const pageEditor = usePageEditor();

// Default values with HTML content
const warrantyConditionsDefault = 'На все единицы оборудования, приобретенные в ООО "КМО24", распространяется гарантийное обслуживание сроком <strong>1 месяц</strong> с момента приобретения. Мы гарантируем, что техника находится в технически исправном состоянии на момент продажи.';

onMounted(async () => {
  await pageEditor.loadPageContent('warranty');
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.warranty-page {
  min-height: 100vh;
  background: linear-gradient(180deg, $gray-50 0%, $white 100%);
}

// Page Header
.page-header {
  padding: 120px 0 60px;
  background: linear-gradient(135deg,
    rgba($primary-500, 0.05) 0%,
    rgba($primary-light, 0.05) 100%);
  border-bottom: 1px solid $gray-100;
  text-align: center;
}

.page-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-md;
}

.page-subtitle {
  font-size: $font-size-lg;
  color: $gray-600;
}

// Warranty Content
.warranty-content {
  padding: $spacing-3xl 0;
}

.warranty-card {
  background: $white;
  border-radius: $radius-2xl;
  padding: $spacing-2xl;
  margin-bottom: $spacing-2xl;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid $gray-100;

  &.main-card {
    background: linear-gradient(135deg, $white 0%, rgba($primary-50, 0.5) 100%);
    border: 2px solid rgba($primary-500, 0.1);
  }

  &.contact-card {
    background: linear-gradient(135deg,
      rgba($primary-500, 0.05) 0%,
      rgba($primary-light, 0.05) 100%);
    text-align: center;
  }
}

.section-title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  color: $gray-900;
  margin-bottom: $spacing-xl;
  display: flex;
  align-items: center;

  &::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(90deg, $gray-200 0%, transparent 100%);
    margin-left: $spacing-lg;
  }
}

// Warranty Text
.warranty-text {
  font-size: $font-size-base;
  line-height: $line-height-relaxed;
  color: $gray-700;

  p {
    margin-bottom: $spacing-lg;
  }

  h3 {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin: $spacing-2xl 0 $spacing-lg;
  }

  strong {
    color: $primary-600;
    font-weight: $font-weight-semibold;
  }
}

// Warranty List
.warranty-list {
  list-style: none;
  padding: 0;
  margin: 0 0 $spacing-xl;

  li {
    position: relative;
    padding-left: $spacing-xl;
    margin-bottom: $spacing-md;
    color: $gray-700;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      top: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, $primary-500 0%, $primary-light 100%);
      color: $white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-sm;
      font-weight: $font-weight-bold;
    }
  }

  &.excluded {
    li::before {
      content: '✕';
      background: linear-gradient(135deg, $gray-400 0%, $gray-500 100%);
    }
  }
}

// Important Note
.important-note {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-lg;
  background: linear-gradient(135deg,
    rgba($primary-500, 0.05) 0%,
    rgba($primary-light, 0.05) 100%);
  border-left: 4px solid $primary-500;
  border-radius: $radius-lg;
  margin-top: $spacing-2xl;
}

.note-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: $primary-500;
}

.note-content {
  h4 {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $primary-700;
    margin-bottom: $spacing-sm;
  }

  p {
    color: $gray-700;
    margin: 0;
  }
}

// Warranty Steps
.warranty-steps {
  display: grid;
  gap: $spacing-xl;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.step {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-lg;
  border-radius: $radius-lg;
  background: $gray-50;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg,
      rgba($primary-500, 0.05) 0%,
      rgba($primary-light, 0.05) 100%);
    transform: translateX(10px);
  }
}

.step-number {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: $radius-lg;
  background: linear-gradient(135deg, $primary-500 0%, $primary-light 100%);
  color: $white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
}

.step-content {
  flex: 1;

  h4 {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $gray-900;
    margin-bottom: $spacing-xs;
  }

  p {
    color: $gray-600;
    margin: 0;
  }
}

// Contact Section
.contact-text {
  font-size: $font-size-lg;
  color: $gray-600;
  margin-bottom: $spacing-2xl;
}

.contact-buttons {
  display: flex;
  gap: $spacing-md;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-lg;
  font-weight: $font-weight-semibold;
  text-decoration: none;
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
  }
}

.btn-primary {
  background: linear-gradient(135deg, $primary-500 0%, $primary-light 100%);
  color: $white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba($primary-500, 0.3);
  }
}

.btn-secondary {
  background: $white;
  color: $primary-600;
  border: 2px solid $primary-200;

  &:hover {
    background: $primary-50;
    border-color: $primary-300;
  }
}

// Container
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-lg;
}
</style>
