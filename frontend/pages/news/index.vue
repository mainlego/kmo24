<template>
  <div class="news-page">
    <Breadcrumbs />

    <div class="container">
      <!-- Page Header -->
      <div class="news-page__header">
        <h1>Новости</h1>
        <p>Актуальные новости и акции КМО24</p>
      </div>

      <!-- Tags Filter -->
      <div v-if="tags.length" class="news-page__tags">
        <button
          :class="['tag-btn', { active: !selectedTag }]"
          @click="selectedTag = ''"
        >
          Все
        </button>
        <button
          v-for="tag in tags"
          :key="tag.tag"
          :class="['tag-btn', { active: selectedTag === tag.tag }]"
          @click="selectedTag = tag.tag"
        >
          {{ tag.tag }} ({{ tag.count }})
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="news-page__loading">
        <BaseSpinner size="lg" text="Загрузка новостей..." />
      </div>

      <!-- News Grid -->
      <div v-else-if="news.length" class="news-page__grid">
        <article
          v-for="item in news"
          :key="item._id"
          class="news-card"
          @click="navigateTo(`/news/${item.slug}`)"
        >
          <div class="news-card__image">
            <img
              :src="item.thumbnail || '/images/news-placeholder.jpg'"
              :alt="item.title"
            />
            <div v-if="item.telegramMessageId" class="news-card__badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.12.098.153.228.166.331.014.103.03.301.017.463z"/>
              </svg>
            </div>
          </div>
          <div class="news-card__content">
            <div class="news-card__meta">
              <span class="news-card__date">
                {{ formatDate(item.publishedAt) }}
              </span>
              <span v-if="item.stats?.views" class="news-card__views">
                {{ item.stats.views }} просмотров
              </span>
            </div>
            <h2 class="news-card__title">{{ item.title }}</h2>
            <p class="news-card__excerpt">{{ item.excerpt }}</p>
            <div v-if="item.tags?.length" class="news-card__tags">
              <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">
                #{{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="news-page__empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
          <path d="M18 14h-8"/>
          <path d="M15 18h-5"/>
          <path d="M10 6h8v4h-8V6Z"/>
        </svg>
        <h3>Новостей пока нет</h3>
        <p>Скоро здесь появятся интересные новости и акции</p>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="news-page__pagination">
        <button
          class="pagination-btn"
          :disabled="pagination.currentPage <= 1"
          @click="changePage(pagination.currentPage - 1)"
        >
          ← Назад
        </button>
        <span class="pagination-info">
          Страница {{ pagination.currentPage }} из {{ pagination.totalPages }}
        </span>
        <button
          class="pagination-btn"
          :disabled="pagination.currentPage >= pagination.totalPages"
          @click="changePage(pagination.currentPage + 1)"
        >
          Вперед →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  tags?: string[];
  publishedAt: string;
  telegramMessageId?: number;
  telegramUrl?: string;
  stats?: {
    views: number;
    shares: number;
  };
}

interface Tag {
  tag: string;
  count: number;
}

interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const config = useRuntimeConfig();
const apiBase = config.public.apiBase;

const isLoading = ref(true);
const news = ref<NewsItem[]>([]);
const tags = ref<Tag[]>([]);
const selectedTag = ref('');
const pagination = ref<Pagination>({
  currentPage: 1,
  itemsPerPage: 12,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
});

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const fetchNews = async () => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams({
      page: pagination.value.currentPage.toString(),
      limit: pagination.value.itemsPerPage.toString(),
    });

    if (selectedTag.value) {
      params.append('tag', selectedTag.value);
    }

    const response = await fetch(`${apiBase}/news?${params}`);
    const data = await response.json();

    if (data.success) {
      news.value = data.data;
      pagination.value = data.pagination;
    }
  } catch (error) {
    console.error('Error fetching news:', error);
  } finally {
    isLoading.value = false;
  }
};

const fetchTags = async () => {
  try {
    const response = await fetch(`${apiBase}/news/tags/all`);
    const data = await response.json();

    if (data.success) {
      tags.value = data.data;
    }
  } catch (error) {
    console.error('Error fetching tags:', error);
  }
};

const changePage = (page: number) => {
  pagination.value.currentPage = page;
  fetchNews();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch(selectedTag, () => {
  pagination.value.currentPage = 1;
  fetchNews();
});

onMounted(() => {
  fetchNews();
  fetchTags();
});

// SEO
useHead({
  title: 'Новости - КМО24',
  meta: [
    {
      name: 'description',
      content: 'Новости и акции КМО24 - комиссионное медицинское оборудование в Красноярске',
    },
  ],
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.news-page {
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 60px;
  background: $gray-50;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

// Header
.news-page__header {
  text-align: center;
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    font-weight: 700;
    color: $gray-900;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 16px;
    color: $gray-600;
    margin: 0;
  }
}

// Tags Filter
.news-page__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 32px;

  .tag-btn {
    padding: 8px 16px;
    background: $white;
    border: 1px solid $gray-300;
    border-radius: 20px;
    font-size: 14px;
    color: $gray-700;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: $primary-400;
      color: $primary-600;
    }

    &.active {
      background: $primary-500;
      border-color: $primary-500;
      color: $white;
    }
  }
}

// Loading
.news-page__loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

// News Grid
.news-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

// News Card
.news-card {
  background: $white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  }

  &__image {
    position: relative;
    aspect-ratio: 16/9;
    overflow: hidden;
    background: $gray-100;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .news-card:hover & img {
      transform: scale(1.05);
    }
  }

  &__badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #0088cc;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    padding: 20px;
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 13px;
    color: $gray-500;
  }

  &__date {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__views {
    &::before {
      content: '•';
      margin-right: 12px;
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    color: $gray-900;
    margin: 0 0 8px 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__excerpt {
    font-size: 14px;
    color: $gray-600;
    line-height: 1.6;
    margin: 0 0 12px 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .tag {
      font-size: 12px;
      color: $primary-600;
      background: rgba($primary-500, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
    }
  }
}

// Empty State
.news-page__empty {
  text-align: center;
  padding: 80px 20px;
  color: $gray-500;

  svg {
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: $gray-700;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
}

// Pagination
.news-page__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;

  .pagination-btn {
    padding: 10px 20px;
    background: $white;
    border: 1px solid $gray-300;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: $gray-700;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      border-color: $primary-400;
      color: $primary-600;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .pagination-info {
    font-size: 14px;
    color: $gray-600;
  }
}
</style>
