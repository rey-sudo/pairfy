<template>
  <div class="index">
    <div class="index-content">
      <Divider margin="0.5rem" transparent />
      <Slider />
      <Divider margin="2rem" transparent />
      <Banner />
      <Divider margin="1rem" transparent />
      <ProductGrid />
      <Divider margin="2rem" transparent />
    </div>
    <Footer />
  </div>
</template>

<script setup></script>

<style lang="css" scoped>
.index {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.index-content {
  width: 100%;
  padding: 1rem;
  max-width: var(--body);
}
</style>
