<template>
  <div class="card">
    <div class="card-header">
      <p>Black Days end in</p>
      <span class="tag">Until 50% off</span>
    </div>
    <div class="card-content">
      <BannerCountdown />
    </div>
  </div>
</template>

<script setup></script>

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
  margin-bottom: 1rem;
  justify-content: space-between;
}

.card-header p {
  margin: 0;
  font-weight: 700;
  font-size: var(--font-size-2);
}

.tag {
  background: rgba(var(--primary-0-base), 0.1);
  font-size: var(--font-size-1);
  border-radius: var(--radius-5);
  color: var(--primary-0);
  padding: 5px 10px;
  margin-left: auto;
}

@media (max-width: 520px) {
  .card {
    width: 100%;
  }
}
</style>
