export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  // Check if user has admin or manager role
  if (!authStore.isAdmin && !authStore.isManager) {
    // Redirect to home page with error
    return navigateTo({
      path: '/',
      query: { error: 'access_denied' },
    });
  }
});
