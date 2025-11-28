<template>
  <div id="app">
    <ErrorBoundary>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ErrorBoundary>
    <Toast />
  </div>
</template>

<script setup lang="ts">
// Метаданные приложения
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Интернет-магазин` : 'Интернет-магазин';
  },
});
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
