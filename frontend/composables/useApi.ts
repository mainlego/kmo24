export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  // Функция для получения заголовков
  const getHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};

    if (process.client) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Добавляем session ID для гостевой корзины
      const sessionId = localStorage.getItem('sessionId');
      if (sessionId) {
        headers['X-Session-ID'] = sessionId;
      }
    }

    return headers;
  };

  /**
   * Wrapper для $fetch с базовыми настройками
   * ВАЖНО: Используйте только apiFetch из этого composable
   */
  const apiFetch = $fetch.create({
    baseURL,
    credentials: 'include',
    onRequest({ options }) {
      // Добавляем заголовки
      const customHeaders = getHeaders();
      options.headers = {
        ...options.headers,
        ...customHeaders,
      };
    },
    async onResponseError({ response }) {
      // Извлекаем сообщение об ошибке из ответа сервера
      const data = response._data as { error?: string; message?: string; errors?: Array<{ field: string; message: string }> };
      let errorMessage = data?.error || data?.message || 'Произошла ошибка';

      // Если есть массив ошибок валидации, объединяем их
      if (data?.errors && Array.isArray(data.errors)) {
        errorMessage = data.errors.map(e => e.message).join('. ');
      }

      // Создаём ошибку с понятным сообщением
      const error = new Error(errorMessage);
      (error as any).statusCode = response.status;
      (error as any).data = data;

      // Обработка ошибок авторизации
      if (response.status === 401 && process.client) {
        const refreshToken = localStorage.getItem('refreshToken');

        // Если нет refresh токена или это уже запрос на refresh - очищаем и редирект
        if (!refreshToken || response.url?.includes('/auth/refresh')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          // Редирект на страницу логина только если не на публичной странице
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/account') || currentPath.startsWith('/admin')) {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
          return;
        }

        // Попытка обновить токен
        try {
          const refreshResponse = await $fetch<any>(`${baseURL}/auth/refresh`, {
            method: 'POST',
            body: { refreshToken },
          });

          if (refreshResponse.success && refreshResponse.data) {
            localStorage.setItem('accessToken', refreshResponse.data.accessToken);
            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);

            // Перезагружаем страницу для повторного выполнения запроса
            window.location.reload();
          }
        } catch (err) {
          // Если refresh не удался, очищаем токены и редирект на логин
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/account') || currentPath.startsWith('/admin')) {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
        return;
      }

      // Для всех остальных ошибок выбрасываем с понятным сообщением
      throw error;
    },
  });

  return {
    apiFetch,
  };
};
