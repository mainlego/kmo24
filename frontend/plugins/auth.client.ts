export default defineNuxtPlugin(async () => {
  const { fetchCurrentUser } = useAuth();

  // Автоматически загружаем пользователя при старте приложения
  // Если токен есть в localStorage, попытаемся восстановить сессию
  if (process.client) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await fetchCurrentUser();
      } catch {
        // Если токен невалидный, он будет очищен в fetchCurrentUser
      }
    }
  }
});
