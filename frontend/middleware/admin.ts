export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchCurrentUser, isAdmin, isAuthenticated } = useAuth();

  // Проверяем авторизацию только на клиенте
  if (process.client) {
    // Если пользователь еще не загружен, пытаемся его загрузить
    if (!isAuthenticated.value) {
      await fetchCurrentUser();
    }

    // Если не авторизован, редирект на страницу входа
    if (!isAuthenticated.value) {
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }

    // Если не админ, редирект на главную
    if (!isAdmin.value) {
      return navigateTo({
        path: '/',
        query: { error: 'access_denied' },
      });
    }
  }
});
