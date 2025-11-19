<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- Page Header -->
    <section class="py-16 px-4 bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Условия покупки оборудования
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Полная информация о процессе приобретения комиссионного оборудования
        </p>
        <div class="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-400 mx-auto rounded-full mt-6"></div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left Column - Main Info -->
          <div class="lg:col-span-2 space-y-8">
            <!-- About Equipment -->
            <div class="bg-white rounded-2xl p-8 shadow-md">
              <h2 class="text-2xl font-bold mb-6 flex items-center">
                <span class="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </span>
                О комиссионном оборудовании
              </h2>
              <div class="prose max-w-none text-gray-600">
                <p class="mb-4">
                  Комиссионное оборудование - это профессиональная техника, бывшая в эксплуатации,
                  прошедшая тщательную проверку и подготовку к продаже.
                </p>
                <ul class="space-y-3">
                  <li class="flex items-start">
                    <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Полная диагностика перед продажей</span>
                  </li>
                  <li class="flex items-start">
                    <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Проверка работоспособности всех узлов</span>
                  </li>
                  <li class="flex items-start">
                    <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Честное описание состояния</span>
                  </li>
                  <li class="flex items-start">
                    <svg class="w-5 h-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Выгодная цена по сравнению с новым</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Purchase Process -->
            <div class="bg-white rounded-2xl p-8 shadow-md">
              <h2 class="text-2xl font-bold mb-6 flex items-center">
                <span class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                </span>
                Процесс покупки
              </h2>

              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg mb-1">Выбор оборудования</h3>
                    <p class="text-gray-600">Изучите каталог, ознакомьтесь с характеристиками и фотографиями оборудования</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg mb-1">Консультация</h3>
                    <p class="text-gray-600">Свяжитесь с нами для получения дополнительной информации и уточнения деталей</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg mb-1">Осмотр (по желанию)</h3>
                    <p class="text-gray-600">Приезжайте на склад для личного осмотра оборудования перед покупкой</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg mb-1">Оформление заказа</h3>
                    <p class="text-gray-600">Оформите заказ на сайте или по телефону. Мы подготовим все документы</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg mb-1">Оплата</h3>
                    <p class="text-gray-600">Выберите удобный способ оплаты: наличные, карта или безналичный расчет</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                    6
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg mb-1">Получение</h3>
                    <p class="text-gray-600">Получите оборудование самовывозом или закажите доставку по России</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Important Terms -->
            <div class="bg-white rounded-2xl p-8 shadow-md">
              <h2 class="text-2xl font-bold mb-6 flex items-center">
                <span class="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </span>
                Важные условия
              </h2>

              <div class="space-y-4">
                <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h3 class="font-semibold text-yellow-800 mb-2">Состояние оборудования</h3>
                  <p class="text-yellow-700 text-sm">
                    Все оборудование продается "как есть" с указанием реального состояния.
                    Мы предоставляем подробные фотографии и описание всех дефектов.
                  </p>
                </div>

                <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h3 class="font-semibold text-orange-800 mb-2">Возврат и обмен</h3>
                  <p class="text-orange-700 text-sm">
                    Возврат возможен в течение 14 дней при сохранении товарного вида.
                    Обмен по согласованию с менеджером.
                  </p>
                </div>

                <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h3 class="font-semibold text-orange-800 mb-2">Документация</h3>
                  <p class="text-orange-700 text-sm">
                    К каждому оборудованию предоставляются: товарный чек,
                    акт приема-передачи, паспорт изделия (при наличии).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Quick Info & Form -->
          <div class="space-y-6">
            <!-- Quick Contacts -->
            <div class="bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl p-6 text-white">
              <h3 class="text-xl font-bold mb-4">Остались вопросы?</h3>
              <p class="mb-4 opacity-90">Наши специалисты помогут вам с выбором</p>

              <div class="space-y-3">
                <a href="tel:+79029239704" class="flex items-center hover:opacity-80 transition-opacity">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  +7 (902) 923-97-04
                </a>
                <div class="flex items-center">
                  <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Пн-Пт: 9:00 - 18:00
                </div>
              </div>

              <NuxtLink to="/contacts" class="inline-block mt-4 px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Связаться с нами
              </NuxtLink>
            </div>

            <!-- Equipment Evaluation Form -->
            <div class="bg-white rounded-2xl p-6 shadow-md">
              <h3 class="text-xl font-bold mb-4 flex items-center">
                <svg class="w-6 h-6 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Оценка оборудования
              </h3>
              <p class="text-gray-600 text-sm mb-4">
                Хотите продать или обменять свое оборудование? Заполните форму для оценки.
              </p>

              <form @submit.prevent="submitEvaluation" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Марка</label>
                  <input
                    v-model="evaluationForm.brand"
                    type="text"
                    required
                    placeholder="Например: Komatsu"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Модель</label>
                  <input
                    v-model="evaluationForm.model"
                    type="text"
                    required
                    placeholder="Например: D65EX-18"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Год выпуска</label>
                  <input
                    v-model="evaluationForm.year"
                    type="number"
                    required
                    placeholder="2020"
                    min="1990"
                    :max="new Date().getFullYear()"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Время использования (моточасы)</label>
                  <input
                    v-model="evaluationForm.operatingHours"
                    type="number"
                    required
                    placeholder="5000"
                    min="0"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Дополнительная информация</label>
                  <textarea
                    v-model="evaluationForm.description"
                    rows="3"
                    placeholder="Состояние, комплектация, дефекты..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Фотографии оборудования</label>
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors">
                    <input
                      type="file"
                      @change="handleFileUpload"
                      multiple
                      accept="image/*"
                      class="hidden"
                      id="file-upload"
                    />
                    <label for="file-upload" class="cursor-pointer">
                      <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <p class="text-sm text-gray-600">Нажмите для загрузки</p>
                      <p class="text-xs text-gray-500">PNG, JPG до 10MB</p>
                    </label>
                  </div>
                  <div v-if="evaluationForm.files.length > 0" class="mt-2">
                    <p class="text-sm text-gray-600">Выбрано файлов: {{ evaluationForm.files.length }}</p>
                    <ul class="text-xs text-gray-500 mt-1">
                      <li v-for="(file, index) in evaluationForm.files" :key="index">
                        {{ file.name }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ваш телефон</label>
                  <input
                    v-model="evaluationForm.phone"
                    type="tel"
                    required
                    placeholder="+7 (___) ___-__-__"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!isSubmitting">Отправить на оценку</span>
                  <span v-else>Отправка...</span>
                </button>
              </form>

              <div v-if="formMessage" :class="formMessageClass" class="mt-4 p-3 rounded-lg text-sm">
                {{ formMessage }}
              </div>
            </div>

            <!-- Benefits -->
            <div class="bg-gray-50 rounded-2xl p-6">
              <h3 class="font-bold mb-4">Преимущества покупки у нас</h3>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <span class="text-sm">Гарантия на все оборудование</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-sm">Выгодные цены</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-sm">Проверенное качество</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>
                  </svg>
                  <span class="text-sm">Консультация экспертов</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// SEO Meta
useHead({
  title: 'Условия покупки оборудования - КМО24',
  meta: [
    { name: 'description', content: 'Условия покупки комиссионного оборудования. Процесс оформления заказа, оценка вашего оборудования, гарантии и документация.' },
    { name: 'keywords', content: 'покупка оборудования, условия покупки, комиссионное оборудование, оценка техники' }
  ]
})

// Evaluation Form
const evaluationForm = ref({
  brand: '',
  model: '',
  year: '',
  operatingHours: '',
  description: '',
  phone: '',
  files: []
})

const isSubmitting = ref(false)
const formMessage = ref('')
const formMessageType = ref('success')

const formMessageClass = computed(() => {
  return formMessageType.value === 'success'
    ? 'bg-orange-100 text-orange-700 border border-orange-200'
    : 'bg-red-100 text-red-700 border border-red-200'
})

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  evaluationForm.value.files = files
}

const submitEvaluation = async () => {
  isSubmitting.value = true
  formMessage.value = ''

  try {
    // Prepare form data
    const formData = new FormData()
    formData.append('brand', evaluationForm.value.brand)
    formData.append('model', evaluationForm.value.model)
    formData.append('year', evaluationForm.value.year)
    formData.append('operatingHours', evaluationForm.value.operatingHours)
    formData.append('description', evaluationForm.value.description)
    formData.append('phone', evaluationForm.value.phone)

    // Append files
    evaluationForm.value.files.forEach((file, index) => {
      formData.append(`files`, file)
    })

    // TODO: Send to API
    // const response = await $fetch('/api/evaluation', {
    //   method: 'POST',
    //   body: formData
    // })

    // Simulate success
    await new Promise(resolve => setTimeout(resolve, 1000))

    formMessageType.value = 'success'
    formMessage.value = 'Заявка отправлена! Мы свяжемся с вами в ближайшее время.'

    // Reset form
    evaluationForm.value = {
      brand: '',
      model: '',
      year: '',
      operatingHours: '',
      description: '',
      phone: '',
      files: []
    }
  } catch (error) {
    formMessageType.value = 'error'
    formMessage.value = 'Произошла ошибка. Попробуйте позже или позвоните нам.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Prose styles for better readability */
.prose ul {
  list-style: none;
  padding: 0;
}

.prose li {
  margin-bottom: 0;
}
</style>
