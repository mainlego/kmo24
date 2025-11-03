<template>
  <div class="skeleton-card">
    <div class="skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-text"></div>
      <div class="skeleton-line skeleton-price"></div>
      <div class="skeleton-button"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton-card {
  background: $white;
  border-radius: $radius-xl;
  overflow: hidden;
  box-shadow: $shadow-sm;
}

.skeleton-image {
  width: 100%;
  padding-top: 75%;
  background: linear-gradient(
    90deg,
    $gray-200 0%,
    $gray-100 50%,
    $gray-200 100%
  );
  background-size: 2000px 100%;
  animation: shimmer 2s infinite linear;
}

.skeleton-content {
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    $gray-200 0%,
    $gray-100 50%,
    $gray-200 100%
  );
  background-size: 2000px 100%;
  animation: shimmer 2s infinite linear;
  border-radius: $radius-sm;
}

.skeleton-title {
  width: 80%;
  height: 20px;
}

.skeleton-text {
  width: 60%;
}

.skeleton-price {
  width: 40%;
  height: 24px;
  margin-top: $spacing-xs;
}

.skeleton-button {
  width: 100%;
  height: 44px;
  margin-top: $spacing-sm;
  background: linear-gradient(
    90deg,
    $gray-200 0%,
    $gray-100 50%,
    $gray-200 100%
  );
  background-size: 2000px 100%;
  animation: shimmer 2s infinite linear;
  border-radius: $radius-lg;
}
</style>
