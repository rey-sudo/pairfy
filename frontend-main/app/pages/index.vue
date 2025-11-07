<template>
  <div class="index">
    <div class="index-content">
      <HomeSlider />
      <Divider margin="1rem" transparent />
      <HomeBanner />
      <Divider margin="1rem" transparent />
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
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
