<template>
  <div class="banner">
    <div class="banner-content">
      <BannerDP />
      <BannerTL />
      <BannerTL />
      <BannerSP />
    </div>
  </div>
</template>

<script setup></script>

<style lang="css" scoped>
.banner {
  width: 100%;
  display: flex;
  justify-content: center;
}

.banner-content {
  gap: 1rem;
  width: 100%;
  display: flex;
  max-width: var(--body);
  justify-content: space-between;
}
</style>
