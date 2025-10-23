<template>
  <div class="card">
    <div class="card-header">
      <p>Black Days end in</p>
    </div>
    <div class="card-content">
      <BannerCountdown /> 
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.card {
  border-radius: var(--card-radius);
  border: 1px solid var(--border-1);
  padding: 1rem;
  width: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header p {
  margin: 0;
  font-weight: 700;
  margin-bottom: 1rem;
  font-size: var(--font-size-3);
}

@media (max-width: 520px) {
  .card {
    width: 100%;
  }
}
</style>
