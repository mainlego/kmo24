<template>
  <div class="admin-reviews">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Отзывы</h1>
        <p class="page-subtitle">Модерация и управление отзывами покупателей</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filters-grid">
        <FormInput
          v-model="filters.search"
          placeholder="Поиск по тексту отзыва, автору, товару..."
          :clearable="true"
        >
          <template #prefix>
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </template>
        </FormInput>

        <FormSelect
          v-model="filters.status"
          :options="statusOptions"
          value-key="value"
          label-key="label"
          placeholder="Все статусы"
        />

        <FormSelect
          v-model="filters.rating"
          :options="ratingOptions"
          value-key="value"
          label-key="label"
          placeholder="Любой рейтинг"
        />

        <button class="btn btn-secondary" @click="resetFilters">
          <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Сбросить
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon pending">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">Ожидают модерации</div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon approved">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.approved }}</div>
            <div class="stat-label">Одобрено</div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon rejected">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.rejected }}</div>
            <div class="stat-label">Отклонено</div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon rating">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <div class="stat-value">{{ stats.avgRating.toFixed(1) }}</div>
            <div class="stat-label">Средний рейтинг</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="reviews-list">
      <div
        v-for="review in filteredReviews"
        :key="review.id"
        class="review-card"
        :class="`status-${review.status}`"
      >
        <!-- Review Header -->
        <div class="review-header">
          <div class="review-author">
            <div class="avatar">
              <img v-if="review.author.avatar" :src="review.author.avatar" :alt="review.author.name" />
              <div v-else class="avatar-placeholder">
                {{ getInitials(review.author.name) }}
              </div>
            </div>
            <div class="author-info">
              <div class="author-name">{{ review.author.name }}</div>
              <div class="review-date">{{ formatDate(review.createdAt) }}</div>
            </div>
          </div>

          <div class="review-status-badge" :class="`badge-${review.status}`">
            {{ getStatusLabel(review.status) }}
          </div>
        </div>

        <!-- Product Info -->
        <div class="review-product">
          <div class="product-image">
            <img v-if="review.product.image" :src="review.product.image" :alt="review.product.name" />
            <div v-else class="no-image">
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="product-info">
            <div class="product-name">{{ review.product.name }}</div>
            <div class="product-sku">Артикул: {{ review.product.sku }}</div>
          </div>
        </div>

        <!-- Rating -->
        <div class="review-rating">
          <div class="stars">
            <svg
              v-for="star in 5"
              :key="star"
              class="star"
              :class="{ filled: star <= review.rating }"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <span class="rating-text">{{ review.rating }} из 5</span>
        </div>

        <!-- Review Content -->
        <div class="review-content">
          <h4 v-if="review.title" class="review-title">{{ review.title }}</h4>
          <p class="review-text">{{ review.text }}</p>
        </div>

        <!-- Review Images -->
        <div v-if="review.images && review.images.length > 0" class="review-images">
          <div v-for="(image, index) in review.images" :key="index" class="review-image">
            <img :src="image" :alt="`Review image ${index + 1}`" />
          </div>
        </div>

        <!-- Pros/Cons -->
        <div v-if="review.pros || review.cons" class="review-pros-cons">
          <div v-if="review.pros" class="pros">
            <div class="label">
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Достоинства:
            </div>
            <p>{{ review.pros }}</p>
          </div>
          <div v-if="review.cons" class="cons">
            <div class="label">
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
              Недостатки:
            </div>
            <p>{{ review.cons }}</p>
          </div>
        </div>

        <!-- Admin Response -->
        <div v-if="review.response" class="admin-response">
          <div class="response-header">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span>Ответ администратора:</span>
          </div>
          <p class="response-text">{{ review.response }}</p>
        </div>

        <!-- Actions -->
        <div class="review-actions">
          <div class="helpful-count">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span>{{ review.helpful }} полезно</span>
          </div>

          <div class="action-buttons">
            <button
              v-if="review.status === 'pending'"
              class="btn btn-success"
              @click="approveReview(review)"
            >
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Одобрить
            </button>
            <button
              v-if="review.status === 'pending'"
              class="btn btn-danger"
              @click="rejectReview(review)"
            >
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Отклонить
            </button>
            <button class="btn btn-secondary" @click="respondToReview(review)">
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              {{ review.response ? 'Изменить ответ' : 'Ответить' }}
            </button>
            <button class="btn btn-secondary" @click="deleteReview(review)">
              <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Удалить
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredReviews.length === 0" class="empty-state">
        <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <p>{{ filters.search || filters.status || filters.rating ? 'Отзывы не найдены' : 'Нет отзывов' }}</p>
      </div>
    </div>

    <!-- Response Modal -->
    <div v-if="selectedReview" class="modal-overlay" @click="closeResponseModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Ответ на отзыв</h2>
          <button class="close-btn" @click="closeResponseModal">
            <svg class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="original-review">
            <div class="review-info">
              <strong>{{ selectedReview.author.name }}</strong> - {{ selectedReview.rating }} ★
            </div>
            <p>{{ selectedReview.text }}</p>
          </div>

          <FormTextarea
            v-model="responseText"
            label="Ваш ответ"
            placeholder="Напишите ответ на отзыв..."
            :rows="5"
            :required="true"
          />
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeResponseModal">Отмена</button>
          <button class="btn btn-primary" @click="saveResponse" :disabled="loading || !responseText">
            {{ loading ? 'Сохранение...' : 'Отправить ответ' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin'],
});

const { success, error } = useToast();

// Data
const loading = ref(false);
const selectedReview = ref<any>(null);
const responseText = ref('');

// Filters
const filters = ref({
  search: '',
  status: '',
  rating: '',
});

// Filter Options
const statusOptions = ref([
  { value: '', label: 'Все статусы' },
  { value: 'pending', label: 'Ожидают модерации' },
  { value: 'approved', label: 'Одобрено' },
  { value: 'rejected', label: 'Отклонено' },
]);

const ratingOptions = ref([
  { value: '', label: 'Любой рейтинг' },
  { value: '5', label: '5 звезд' },
  { value: '4', label: '4 звезды' },
  { value: '3', label: '3 звезды' },
  { value: '2', label: '2 звезды' },
  { value: '1', label: '1 звезда' },
]);

// Stats
const stats = ref({
  pending: 8,
  approved: 156,
  rejected: 12,
  avgRating: 4.3,
});

// Mock reviews data
const reviews = ref([
  {
    id: '1',
    author: {
      name: 'Иван Петров',
      avatar: '',
    },
    product: {
      name: 'Фрезерный станок HAAS VF-2',
      sku: 'CNC-001',
      image: 'https://via.placeholder.com/60',
    },
    rating: 5,
    title: 'Отличный станок!',
    text: 'Приобрел этот станок для небольшого производства. Работает идеально, точность высокая, управление интуитивное. Доставили быстро, упаковка надежная. Рекомендую!',
    pros: 'Высокая точность, надежность, простое управление',
    cons: 'Цена высокая, но оправдана',
    images: [],
    helpful: 15,
    status: 'approved',
    response: 'Спасибо за отзыв! Рады, что станок оправдал ваши ожидания.',
    createdAt: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    author: {
      name: 'Анна Смирнова',
      avatar: '',
    },
    product: {
      name: 'Токарный станок 16К20',
      sku: 'LAT-001',
      image: '',
    },
    rating: 4,
    title: 'Хороший вариант за свою цену',
    text: 'Станок б/у, но в отличном состоянии. Работает без нареканий уже 3 месяца. Небольшой износ есть, но это нормально для б/у оборудования.',
    pros: 'Цена, состояние, надежность',
    cons: 'Небольшой износ направляющих',
    images: [],
    helpful: 8,
    status: 'approved',
    response: null,
    createdAt: '2024-01-18T14:20:00',
  },
  {
    id: '3',
    author: {
      name: 'Сергей Иванов',
      avatar: '',
    },
    product: {
      name: 'Сверлильный станок 2С132',
      sku: 'DRL-001',
      image: '',
    },
    rating: 5,
    title: 'Как новый!',
    text: 'Заказал станок б/у, но пришел практически новый. Видно, что предыдущий владелец ухаживал за оборудованием. Все работает отлично!',
    pros: 'Отличное состояние, быстрая доставка',
    cons: 'Не обнаружил',
    images: [],
    helpful: 12,
    status: 'pending',
    response: null,
    createdAt: '2024-01-20T09:15:00',
  },
  {
    id: '4',
    author: {
      name: 'Дмитрий Волков',
      avatar: '',
    },
    product: {
      name: 'Деревообрабатывающий станок JET',
      sku: 'WOD-001',
      image: '',
    },
    rating: 3,
    title: 'Средне',
    text: 'Станок рабочий, но есть нюансы. Пришлось делать небольшой ремонт сразу после получения.',
    pros: 'Цена',
    cons: 'Потребовался ремонт',
    images: [],
    helpful: 3,
    status: 'pending',
    response: null,
    createdAt: '2024-01-21T11:45:00',
  },
]);

// Computed
const filteredReviews = computed(() => {
  let result = reviews.value;

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter(
      (r) =>
        r.text.toLowerCase().includes(search) ||
        r.author.name.toLowerCase().includes(search) ||
        r.product.name.toLowerCase().includes(search)
    );
  }

  if (filters.value.status) {
    result = result.filter((r) => r.status === filters.value.status);
  }

  if (filters.value.rating) {
    result = result.filter((r) => r.rating === parseInt(filters.value.rating));
  }

  return result;
});

// Methods
const resetFilters = () => {
  filters.value = {
    search: '',
    status: '',
    rating: '',
  };
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Ожидает модерации',
    approved: 'Одобрено',
    rejected: 'Отклонено',
  };
  return labels[status] || status;
};

const approveReview = async (review: any) => {
  try {
    loading.value = true;

    // TODO: API call to approve review
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = reviews.value.findIndex((r) => r.id === review.id);
    if (index !== -1) {
      reviews.value[index].status = 'approved';
    }

    stats.value.pending--;
    stats.value.approved++;

    success('Отзыв одобрен');
  } catch (err) {
    error('Ошибка при одобрении отзыва');
  } finally {
    loading.value = false;
  }
};

const rejectReview = async (review: any) => {
  if (!confirm('Вы уверены, что хотите отклонить этот отзыв?')) return;

  try {
    loading.value = true;

    // TODO: API call to reject review
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = reviews.value.findIndex((r) => r.id === review.id);
    if (index !== -1) {
      reviews.value[index].status = 'rejected';
    }

    stats.value.pending--;
    stats.value.rejected++;

    success('Отзыв отклонен');
  } catch (err) {
    error('Ошибка при отклонении отзыва');
  } finally {
    loading.value = false;
  }
};

const respondToReview = (review: any) => {
  selectedReview.value = review;
  responseText.value = review.response || '';
};

const closeResponseModal = () => {
  selectedReview.value = null;
  responseText.value = '';
};

const saveResponse = async () => {
  try {
    loading.value = true;

    // TODO: API call to save response
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = reviews.value.findIndex((r) => r.id === selectedReview.value.id);
    if (index !== -1) {
      reviews.value[index].response = responseText.value;
    }

    success('Ответ сохранен');
    closeResponseModal();
  } catch (err) {
    error('Ошибка при сохранении ответа');
  } finally {
    loading.value = false;
  }
};

const deleteReview = async (review: any) => {
  if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;

  try {
    loading.value = true;

    // TODO: API call to delete review
    await new Promise((resolve) => setTimeout(resolve, 500));

    reviews.value = reviews.value.filter((r) => r.id !== review.id);
    success('Отзыв удален');
  } catch (err) {
    error('Ошибка при удалении отзыва');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // TODO: Fetch reviews from API
});
</script>

<style scoped lang="scss">
.admin-reviews {
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.filters-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .icon {
    width: 1.5rem;
    height: 1.5rem;
    color: white;
  }

  &.pending {
    background: linear-gradient(135deg, #f59e0be6 0%, #d97706 100%);
  }

  &.approved {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }

  &.rejected {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  }

  &.rating {
    background: linear-gradient(135deg, #f59e0be6 0%, #f97316 100%);
  }
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #e5e7eb;

  &.status-pending {
    border-left-color: #f59e0be6;
  }

  &.status-approved {
    border-left-color: #10b981;
  }

  &.status-rejected {
    border-left-color: #ef4444;
  }
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.author-info {
  .author-name {
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.125rem;
  }

  .review-date {
    font-size: 0.75rem;
    color: #6b7280;
  }
}

.review-status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;

  &.badge-pending {
    background: #fef3c7;
    color: #a16207;
  }

  &.badge-approved {
    background: #dcfce7;
    color: #15803d;
  }

  &.badge-rejected {
    background: #fee2e2;
    color: #991b1b;
  }
}

.review-product {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 0.375rem;
  overflow: hidden;
  background: #e5e7eb;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .no-image {
    color: #9ca3af;

    .icon {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}

.product-info {
  flex: 1;
  min-width: 0;

  .product-name {
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .product-sku {
    font-size: 0.75rem;
    color: #6b7280;
  }
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  .stars {
    display: flex;
    gap: 0.25rem;
  }

  .star {
    width: 1.25rem;
    height: 1.25rem;
    color: #d1d5db;

    &.filled {
      color: #f59e0be6;
    }
  }

  .rating-text {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }
}

.review-content {
  margin-bottom: 1rem;

  .review-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  .review-text {
    font-size: 0.9375rem;
    color: #374151;
    line-height: 1.6;
    margin: 0;
  }
}

.review-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.review-image {
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.review-pros-cons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  .pros,
  .cons {
    padding: 0.75rem;
    border-radius: 0.5rem;
  }

  .pros {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;

    .label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #15803d;
      margin-bottom: 0.5rem;

      .icon {
        width: 1rem;
        height: 1rem;
      }
    }

    p {
      font-size: 0.875rem;
      color: #166534;
      margin: 0;
    }
  }

  .cons {
    background: #fef2f2;
    border: 1px solid #fecaca;

    .label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #991b1b;
      margin-bottom: 0.5rem;

      .icon {
        width: 1rem;
        height: 1rem;
      }
    }

    p {
      font-size: 0.875rem;
      color: #991b1b;
      margin: 0;
    }
  }
}

.admin-response {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;

  .response-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 0.5rem;

    .icon {
      width: 1rem;
      height: 1rem;
    }
  }

  .response-text {
    font-size: 0.875rem;
    color: #1e3a8a;
    margin: 0;
  }
}

.review-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.helpful-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;

  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  color: #9ca3af;

  .icon {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }
}

// Modal styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.close-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.original-review {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;

  .review-info {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
    color: #374151;
    margin: 0;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  .icon {
    width: 1rem;
    height: 1rem;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.btn-primary {
    background: #3b82f6;
    color: white;

    &:hover:not(:disabled) {
      background: #2563eb;
    }
  }

  &.btn-secondary {
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #f9fafb;
    }
  }

  &.btn-success {
    background: #10b981;
    color: white;

    &:hover:not(:disabled) {
      background: #059669;
    }
  }

  &.btn-danger {
    background: #ef4444;
    color: white;

    &:hover:not(:disabled) {
      background: #dc2626;
    }
  }
}
</style>
