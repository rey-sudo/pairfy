<template>
  <div class="index">
    <div class="index-content">
      <Banner />
      <Footer />
    </div>
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
  width: var(--body);
}
</style>
