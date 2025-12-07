<template>
  <div class="news-detail">
    <Breadcrumbs />

    <div class="container">
      <!-- Loading State -->
      <div v-if="isLoading" class="news-detail__loading">
        <BaseSpinner size="xl" text="Загрузка новости..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="news-detail__error">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m15 9-6 6"/>
          <path d="m9 9 6 6"/>
        </svg>
        <h2>Новость не найдена</h2>
        <p>{{ error }}</p>
        <BaseButton variant="primary" @click="navigateTo('/news')">
          Вернуться к новостям
        </BaseButton>
      </div>

      <!-- News Content -->
      <article v-else-if="newsItem" class="news-article">
        <!-- Header -->
        <header class="news-article__header">
          <div class="news-article__meta">
            <span class="news-article__date">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
              {{ formatDate(newsItem.publishedAt) }}
            </span>
            <span v-if="newsItem.stats?.views" class="news-article__views">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {{ newsItem.stats.views }} просмотров
            </span>
            <a
              v-if="newsItem.telegramUrl"
              :href="newsItem.telegramUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="news-article__telegram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.12.098.153.228.166.331.014.103.03.301.017.463z"/>
              </svg>
              Читать в Telegram
            </a>
          </div>

          <h1 class="news-article__title">{{ newsItem.title }}</h1>

          <div v-if="newsItem.tags?.length" class="news-article__tags">
            <NuxtLink
              v-for="tag in newsItem.tags"
              :key="tag"
              :to="`/news?tag=${tag}`"
              class="tag"
            >
              #{{ tag }}
            </NuxtLink>
          </div>
        </header>

        <!-- Video -->
        <div v-if="newsItem.video?.url" class="news-article__video">
          <video
            controls
            playsinline
            :class="{ 'video-note': newsItem.video.isVideoNote }"
            :poster="newsItem.thumbnail"
          >
            <source :src="getMediaUrl(newsItem.video.url)" type="video/mp4" />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        </div>

        <!-- Featured Image (only if no video) -->
        <div v-else-if="newsItem.thumbnail || newsItem.images?.length" class="news-article__image">
          <img
            :src="getMediaUrl(newsItem.thumbnail || newsItem.images[0]?.url)"
            :alt="newsItem.title"
            @error="handleImageError"
          />
        </div>

        <!-- Content -->
        <div class="news-article__content" v-html="formattedContent"></div>

        <!-- Image Gallery -->
        <div v-if="newsItem.images?.length > 1" class="news-article__gallery">
          <AdminEditableElement
            element-id="news-gallery-title"
            tag="h3"
            type="text"
            label="Заголовок галереи"
            default-value="Фотогалерея"
          >
            {{ pageEditor.getElementValue('news-gallery-title', 'Фотогалерея') }}
          </AdminEditableElement>
          <div class="gallery-grid">
            <div
              v-for="(image, index) in newsItem.images"
              :key="index"
              class="gallery-item"
              @click="openLightbox(index)"
            >
              <img :src="getMediaUrl(image.url)" :alt="image.alt || `Изображение ${index + 1}`" @error="handleImageError" />
            </div>
          </div>
        </div>

        <!-- Share Section -->
        <div class="news-article__share">
          <AdminEditableElement
            element-id="news-share-title"
            tag="span"
            type="text"
            label="Заголовок блока 'Поделиться'"
            default-value="Поделиться:"
          >
            {{ pageEditor.getElementValue('news-share-title', 'Поделиться:') }}
          </AdminEditableElement>
          <div class="share-buttons">
            <button @click="shareToTelegram" class="share-btn share-btn--telegram" title="Telegram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.12.098.153.228.166.331.014.103.03.301.017.463z"/>
              </svg>
            </button>
            <button @click="shareToVK" class="share-btn share-btn--vk" title="ВКонтакте">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.597-.188 1.364 1.259 2.179 1.815.616.422 1.085.33 1.085.33l2.179-.03s1.14-.071.599-.964c-.044-.073-.314-.659-1.618-1.863-1.366-1.261-1.183-1.057.462-3.24.999-1.328 1.398-2.139 1.273-2.486-.119-.332-.858-.244-.858-.244l-2.453.015s-.182-.025-.317.056c-.131.079-.216.262-.216.262s-.387 1.028-.903 1.902c-1.088 1.843-1.523 1.941-1.7 1.827-.414-.267-.31-1.075-.31-1.648 0-1.792.272-2.539-.53-2.733-.265-.064-.461-.107-1.14-.114-.871-.009-1.608.003-2.025.207-.278.136-.492.439-.361.457.161.022.526.099.72.361.249.339.24 1.1.24 1.1s.143 2.11-.334 2.371c-.327.18-.776-.187-1.739-1.865-.494-.859-.867-1.811-.867-1.811s-.072-.177-.2-.272c-.155-.115-.372-.151-.372-.151l-2.331.015s-.35.01-.479.163c-.115.136-.009.418-.009.418s1.821 4.258 3.883 6.403c1.889 1.965 4.035 1.837 4.035 1.837h.972z"/>
              </svg>
            </button>
            <button @click="shareToWhatsApp" class="share-btn share-btn--whatsapp" title="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
            <button @click="copyLink" class="share-btn share-btn--copy" title="Копировать ссылку">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Related News -->
        <div v-if="relatedNews.length" class="news-article__related">
          <AdminEditableElement
            element-id="news-related-title"
            tag="h3"
            type="text"
            label="Заголовок похожих новостей"
            default-value="Похожие новости"
          >
            {{ pageEditor.getElementValue('news-related-title', 'Похожие новости') }}
          </AdminEditableElement>
          <div class="related-grid">
            <NuxtLink
              v-for="item in relatedNews"
              :key="item._id"
              :to="`/news/${item.slug}`"
              class="related-card"
            >
              <div class="related-card__image">
                <img
                  :src="getMediaUrl(item.thumbnail)"
                  :alt="item.title"
                  @error="handleImageError"
                />
              </div>
              <div class="related-card__content">
                <span class="related-card__date">{{ formatDate(item.publishedAt) }}</span>
                <h4>{{ item.title }}</h4>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Back to News -->
        <div class="news-article__back">
          <NuxtLink to="/news" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <AdminEditableElement
              element-id="news-back-link"
              tag="span"
              type="text"
              label="Текст ссылки 'Вернуться к новостям'"
              default-value="Вернуться к новостям"
            >
              {{ pageEditor.getElementValue('news-back-link', 'Вернуться к новостям') }}
            </AdminEditableElement>
          </NuxtLink>
        </div>
      </article>

      <!-- Lightbox -->
      <Transition name="lightbox">
        <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
          <button class="lightbox__close" @click="closeLightbox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <button v-if="newsItem?.images?.length > 1" class="lightbox__prev" @click.stop="prevImage">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button v-if="newsItem?.images?.length > 1" class="lightbox__next" @click.stop="nextImage">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          <div class="lightbox__content" @click.stop>
            <img
              v-if="newsItem?.images?.[lightboxIndex]"
              :src="getMediaUrl(newsItem.images[lightboxIndex].url)"
              :alt="newsItem.images[lightboxIndex].alt || newsItem.title"
              @error="handleImageError"
            />
            <div class="lightbox__counter">
              {{ lightboxIndex + 1 }} / {{ newsItem?.images?.length }}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const { apiFetch } = useApi();

// Page Editor для визуального редактирования
const pageEditor = usePageEditor();

interface NewsImage {
  url: string;
  alt?: string;
}

interface NewsVideo {
  url: string;
  duration?: number;
  width?: number;
  height?: number;
  isVideoNote?: boolean;
  isAnimation?: boolean;
}

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  images?: NewsImage[];
  video?: NewsVideo;
  tags?: string[];
  publishedAt: string;
  telegramMessageId?: number;
  telegramUrl?: string;
  author?: {
    firstName: string;
    lastName: string;
  };
  stats?: {
    views: number;
    shares: number;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

const route = useRoute();
const config = useRuntimeConfig();
const apiBase = config.public.apiBaseUrl;

const slug = computed(() => route.params.slug as string);

const isLoading = ref(true);
const error = ref('');
const newsItem = ref<NewsItem | null>(null);
const relatedNews = ref<NewsItem[]>([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const linkCopied = ref(false);

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

// Placeholder for missing images
const PLACEHOLDER_IMAGE = '/images/news-placeholder.svg';

// Get full media URL (handle relative paths from backend)
const getMediaUrl = (url: string | undefined): string => {
  if (!url) return PLACEHOLDER_IMAGE;
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it's a relative path starting with /uploads, prepend API base
  if (url.startsWith('/uploads')) {
    return `${apiBase.replace('/api/v1', '')}${url}`;
  }
  return url;
};

// Handle image load errors
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  if (target && target.src !== PLACEHOLDER_IMAGE) {
    target.src = PLACEHOLDER_IMAGE;
  }
};

// Format content with line breaks
const formattedContent = computed(() => {
  if (!newsItem.value?.content) return '';
  return newsItem.value.content
    .split('\n')
    .map(p => p.trim())
    .filter(p => p)
    .map(p => `<p>${p}</p>`)
    .join('');
});

// Share functions
const shareUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return '';
});

const shareToTelegram = () => {
  const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(newsItem.value?.title || '')}`;
  window.open(url, '_blank', 'width=600,height=400');
};

const shareToVK = () => {
  const url = `https://vk.com/share.php?url=${encodeURIComponent(shareUrl.value)}&title=${encodeURIComponent(newsItem.value?.title || '')}`;
  window.open(url, '_blank', 'width=600,height=400');
};

const shareToWhatsApp = () => {
  const url = `https://wa.me/?text=${encodeURIComponent(`${newsItem.value?.title || ''} ${shareUrl.value}`)}`;
  window.open(url, '_blank');
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy link:', err);
  }
};

// Lightbox
const openLightbox = (index: number) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = '';
};

const nextImage = () => {
  if (newsItem.value?.images) {
    lightboxIndex.value = (lightboxIndex.value + 1) % newsItem.value.images.length;
  }
};

const prevImage = () => {
  if (newsItem.value?.images) {
    lightboxIndex.value = lightboxIndex.value === 0
      ? newsItem.value.images.length - 1
      : lightboxIndex.value - 1;
  }
};

// Fetch data
const fetchNews = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    const data = await apiFetch<{ success: boolean; data: NewsItem; message?: string }>(`/news/${slug.value}`);

    if (data.success) {
      newsItem.value = data.data;

      // Fetch related news
      const relatedData = await apiFetch<{ success: boolean; data: NewsItem[] }>(`/news/${newsItem.value?._id}/related?limit=3`);
      if (relatedData.success) {
        relatedNews.value = relatedData.data;
      }
    } else {
      error.value = data.message || 'Новость не найдена';
    }
  } catch (err) {
    console.error('Error fetching news:', err);
    error.value = 'Не удалось загрузить новость';
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  // Загружаем контент страницы для визуального редактора
  await pageEditor.loadPageContent('news-detail');

  fetchNews();
});

// Cleanup: restore body overflow if component unmounts while lightbox is open
onUnmounted(() => {
  document.body.style.overflow = '';
});

// SEO
useHead(() => ({
  title: newsItem.value?.seo?.title || newsItem.value?.title || 'Новость - КМО24',
  meta: [
    {
      name: 'description',
      content: newsItem.value?.seo?.description || newsItem.value?.excerpt || '',
    },
    {
      property: 'og:title',
      content: newsItem.value?.title || '',
    },
    {
      property: 'og:description',
      content: newsItem.value?.excerpt || '',
    },
    {
      property: 'og:image',
      content: newsItem.value?.thumbnail || '',
    },
    {
      property: 'og:type',
      content: 'article',
    },
  ],
}));
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.news-detail {
  min-height: 100vh;
  padding-top: 60px;
  padding-bottom: 60px;
  background: $gray-50;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
}

// Loading & Error States
.news-detail__loading,
.news-detail__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 16px;
  text-align: center;

  svg {
    color: $gray-400;
  }

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: $gray-900;
    margin: 0;
  }

  p {
    font-size: 14px;
    color: $gray-600;
    margin: 0;
  }
}

// Article
.news-article {
  background: $white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &__header {
    padding: 32px 32px 24px;

    @media (max-width: 768px) {
      padding: 24px 20px 20px;
    }
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    font-size: 14px;
    color: $gray-500;

    svg {
      vertical-align: middle;
      margin-right: 4px;
    }
  }

  &__date,
  &__views {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__telegram {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #0088cc;
    text-decoration: none;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }
  }

  &__title {
    font-size: 32px;
    font-weight: 700;
    color: $gray-900;
    line-height: 1.3;
    margin: 0 0 16px 0;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .tag {
      padding: 6px 12px;
      background: rgba($primary-500, 0.1);
      color: $primary-600;
      border-radius: 16px;
      font-size: 13px;
      text-decoration: none;
      transition: background 0.2s;

      &:hover {
        background: rgba($primary-500, 0.2);
      }
    }
  }

  &__video {
    width: 100%;
    background: $gray-900;
    display: flex;
    justify-content: center;
    align-items: center;

    video {
      max-width: 100%;
      max-height: 70vh;

      &.video-note {
        border-radius: 50%;
        max-width: 400px;
        max-height: 400px;
        margin: 20px auto;
      }
    }
  }

  &__image {
    width: 100%;
    aspect-ratio: 16/9;
    overflow: hidden;
    background: $gray-100;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    padding: 32px;
    font-size: 16px;
    line-height: 1.8;
    color: $gray-700;

    @media (max-width: 768px) {
      padding: 24px 20px;
      font-size: 15px;
    }

    :deep(p) {
      margin: 0 0 16px 0;

      &:last-child {
        margin-bottom: 0;
      }
    }

    :deep(a) {
      color: $primary-600;
      text-decoration: underline;
    }

    :deep(strong) {
      font-weight: 600;
      color: $gray-900;
    }
  }

  &__gallery {
    padding: 0 32px 32px;

    @media (max-width: 768px) {
      padding: 0 20px 24px;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: $gray-900;
      margin: 0 0 16px 0;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 12px;
    }

    .gallery-item {
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.02);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  &__share {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px 32px;
    border-top: 1px solid $gray-200;

    @media (max-width: 768px) {
      padding: 20px;
      flex-direction: column;
      align-items: flex-start;
    }

    span {
      font-size: 14px;
      font-weight: 500;
      color: $gray-700;
    }

    .share-buttons {
      display: flex;
      gap: 8px;
    }

    .share-btn {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.2s, opacity 0.2s;
      color: white;

      &:hover {
        transform: scale(1.1);
      }

      &--telegram {
        background: #0088cc;
      }

      &--vk {
        background: #4a76a8;
      }

      &--whatsapp {
        background: #25d366;
      }

      &--copy {
        background: $gray-600;
      }
    }
  }

  &__related {
    padding: 32px;
    border-top: 1px solid $gray-200;
    background: $gray-50;

    @media (max-width: 768px) {
      padding: 24px 20px;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      color: $gray-900;
      margin: 0 0 20px 0;
    }

    .related-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .related-card {
      background: $white;
      border-radius: 12px;
      overflow: hidden;
      text-decoration: none;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &__image {
        aspect-ratio: 16/10;
        overflow: hidden;
        background: $gray-100;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }
      }

      &:hover &__image img {
        transform: scale(1.05);
      }

      &__content {
        padding: 12px;
      }

      &__date {
        font-size: 12px;
        color: $gray-500;
        margin-bottom: 4px;
        display: block;
      }

      h4 {
        font-size: 14px;
        font-weight: 500;
        color: $gray-900;
        margin: 0;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }

  &__back {
    padding: 24px 32px;
    border-top: 1px solid $gray-200;

    @media (max-width: 768px) {
      padding: 20px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: $gray-600;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s;

      &:hover {
        color: $primary-600;
      }
    }
  }
}

// Lightbox
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  &__content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;

    img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
    }
  }

  &__counter {
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-size: 14px;
  }

  &__close,
  &__prev,
  &__next {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &__close {
    top: 20px;
    right: 20px;
  }

  &__prev {
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
  }

  &__next {
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
