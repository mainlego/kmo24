/**
 * Plugin to initialize page editor mode from URL query parameter
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Page ID mapping from routes
  const routeToPageId: Record<string, string> = {
    '/': 'home',
    '/index': 'home',
    '/delivery': 'delivery',
    '/contacts': 'contacts',
    '/warranty': 'warranty',
    '/about': 'about',
  };

  // Use router hook when app is ready
  nuxtApp.hook('page:finish', () => {
    const route = useRoute();

    // Check if ?edit=true is in the URL
    if (route.query.edit === 'true') {
      const pageEditor = usePageEditor();
      const authStore = useAuthStore();

      // Only enable if user is admin
      if (authStore.user?.role === 'admin') {
        const pageId = routeToPageId[route.path];
        if (pageId && !pageEditor.isEditMode.value) {
          pageEditor.enableEditMode(pageId);
        }
      }
    }
  });
});
