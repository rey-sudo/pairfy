<template>
  <div class="Header">
    <div class="Header-top">
      <TopNav />
    </div>
    <div class="Header-center">
      <HeaderContent />
    </div>
    <div class="Header-bottom">
      <SubNav />
    </div>
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
  height: 5rem;
  display: flex;
  justify-content: center;
}

.Header-bottom {
  display: flex;
  justify-content: center;
}
</style>
