export default defineNuxtRouteMiddleware(async (to, from) => {
  const { fetchCurrentUser, isAuthenticated } = useAuth();

  // Проверяем авторизацию только на клиенте
  if (process.client) {
    // Если пользователь еще не загружен, пытаемся его загрузить
    if (!isAuthenticated.value) {
      await fetchCurrentUser();
    }

    // Если авторизован, редирект на главную
    if (isAuthenticated.value) {
      const redirect = to.query.redirect as string;
      return navigateTo(redirect || '/');
    }
  }
});
