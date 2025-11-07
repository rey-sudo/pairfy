<template>
  <div class="layout">
    <Header />
    <main class="content">
      <NuxtPage :key="$route.fullPath" />
    </main>
  </div>
</template>

<script setup>


</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.content {
  flex: 1;
  padding-top: 180px;
}
</style>
