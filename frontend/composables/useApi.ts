export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  /**
   * Wrapper для $fetch с базовыми настройками
   * ВАЖНО: Используйте только apiFetch из этого composable
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
    async onResponseError({ response }) {
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
      }
    },
  });

  return {
    apiFetch,
  };
};
