/**
 * Composable для работы с URL медиафайлов
 * Преобразует относительные пути в полные URL для backend
 */

export const useMediaUrl = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBaseUrl as string;

  // Базовый URL для медиафайлов (без /api/v1)
  const mediaBaseUrl = apiBase.replace('/api/v1', '');

  /**
   * Получить полный URL для медиафайла
   * @param url - относительный или абсолютный URL
   * @param placeholder - URL плейсхолдера если url пустой
   */
  const getMediaUrl = (url: string | undefined | null, placeholder?: string): string => {
    const defaultPlaceholder = '/images/placeholder.jpg';

    if (!url) {
      return placeholder || defaultPlaceholder;
    }

    // Если это уже полный URL, возвращаем как есть
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Если это относительный путь к uploads, добавляем базовый URL
    if (url.startsWith('/uploads')) {
      return `${mediaBaseUrl}${url}`;
    }

    // Если это относительный путь без /uploads
    if (url.startsWith('/')) {
      return url;
    }

    // Иначе возвращаем как есть
    return url;
  };

  /**
   * Получить URL изображения товара
   */
  const getProductImageUrl = (url: string | undefined | null): string => {
    return getMediaUrl(url, '/images/product-placeholder.jpg');
  };

  /**
   * Получить URL изображения новости
   */
  const getNewsImageUrl = (url: string | undefined | null): string => {
    return getMediaUrl(url, '/images/news-placeholder.jpg');
  };

  /**
   * Получить URL аватара пользователя
   */
  const getUserAvatarUrl = (url: string | undefined | null): string => {
    return getMediaUrl(url, '/images/avatar-placeholder.jpg');
  };

  /**
   * Получить URL видео
   */
  const getVideoUrl = (url: string | undefined | null): string => {
    return getMediaUrl(url);
  };

  return {
    getMediaUrl,
    getProductImageUrl,
    getNewsImageUrl,
    getUserAvatarUrl,
    getVideoUrl,
    mediaBaseUrl,
  };
};
