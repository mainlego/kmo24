export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    // Try to restore session from localStorage
    await authStore.init();

    // If still not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  }
});
