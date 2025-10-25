import type { UseFetchOptions } from 'nuxt/app';

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  /**
   * Wrapper для $fetch с базовыми настройками
   */
  const apiFetch = $fetch.create({
    baseURL,
    credentials: 'include',
    onRequest({ options }) {
      // Добавляем токен из localStorage если есть
      if (process.client) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        // Добавляем session ID для гостевой корзины
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
          options.headers = {
            ...options.headers,
            'X-Session-ID': sessionId,
          };
        }
      }
    },
    onResponseError({ response }) {
      // Обработка ошибок авторизации
      if (response.status === 401 && process.client) {
        // Попытка обновить токен
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // TODO: Implement token refresh
        }
      }
    },
  });

  /**
   * GET запрос
   */
  const get = async <T>(url: string, options?: UseFetchOptions<T>) => {
    return await useFetch<T>(url, {
      baseURL,
      method: 'GET',
      ...options,
    });
  };

  /**
   * POST запрос
   */
  const post = async <T>(url: string, body?: any, options?: UseFetchOptions<T>) => {
    return await useFetch<T>(url, {
      baseURL,
      method: 'POST',
      body,
      ...options,
    });
  };

  /**
   * PUT запрос
   */
  const put = async <T>(url: string, body?: any, options?: UseFetchOptions<T>) => {
    return await useFetch<T>(url, {
      baseURL,
      method: 'PUT',
      body,
      ...options,
    });
  };

  /**
   * DELETE запрос
   */
  const del = async <T>(url: string, options?: UseFetchOptions<T>) => {
    return await useFetch<T>(url, {
      baseURL,
      method: 'DELETE',
      ...options,
    });
  };

  return {
    apiFetch,
    get,
    post,
    put,
    delete: del,
  };
};
