<template>
  <div class="index">
    <div class="index-content">
      <Slider />
      <Divider margin="1rem" transparent />
      <Banner />
      <Divider margin="2rem" transparent />
      <ProductGrid />
      <Divider margin="1rem" transparent />
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
}
</style>
