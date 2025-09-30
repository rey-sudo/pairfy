<template>
  <div class="index">
    <div class="index-content">
      <Divider margin="0.25rem" invisible />
      <Slider />
      <Divider margin="1rem" invisible />
      <Pool />
      <Divider margin="1rem" invisible />
      <Grid /> 
      <Footer />
    </div>
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
