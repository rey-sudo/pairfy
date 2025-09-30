<template>
  <div class="index">
    <div class="index-content">
      <Divider margin="0.5rem" transparent />
      <Slider />
      <Divider margin="1rem" transparent />
      <Pool />
      <Divider margin="1rem" transparent />
      <Grid />
      <Divider margin="2rem" transparent />
    </div>
    <Footer />
  </div>
</template>

<script setup></script>

<style lang="css" scoped>
.index {
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.index-content {
  width: 100%;
  max-width: var(--body);
}
</style>
