<template>
  <div class="Header">
    <div class="Header-top">
      <TopNav />
    </div>
    <div class="Header-center"></div>
    <div class="Header-bottom"></div>
  </div>
</template>

<script setup></script>

<style lang="css" scoped>
.Header {
  width: 100%;
}

.Header-top {
  height: 2rem;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--border-0);
}

.Header-center {
  height: 4rem;

  border-bottom: 1px solid var(--border-0);
}

.Header-bottom {
  height: 2rem;
}
</style>
