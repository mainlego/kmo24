export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();
  const cartStore = useCartStore();

  // Инициализация auth store
  await authStore.init();

  // Инициализация cart store
  await cartStore.fetchCart();
});
