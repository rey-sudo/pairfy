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
  z-index: 1000;
  position: fixed;
  background: var(--background-0);
}

.Header-top {
  height: 2rem;
  display: flex;
  justify-content: center;
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
