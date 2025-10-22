<template>
  <nav class="top-nav">
    <!-- Left -->
    <div class="nav-left">
      <a href="#">Github</a>
      <a href="#">FAQ</a>
      <a href="#">Support</a>
      <a href="#">Contact</a>
    </div>

    <!-- Right -->
    <div class="nav-right">
      <button class="lang-btn">🌐 ES</button>
      <a href="#">Sell</a>
      <a href="#">Favorites ▾</a>
      <a href="#">My Account ▾</a>
      <button class="icon-btn">🔔</button>
      <button class="icon-btn">🛒</button>
    </div>
  </nav>
</template>

<script setup>

</script>

<style scoped>
.top-nav {
  width: 100%;
  display: flex;
  align-items: center;
  max-width: var(--body);
  font-size: var(--font-size-1);
  justify-content: space-between;
}

.top-nav a {
  color: var(--text-0);
  text-decoration: none;
  font-weight: 500;
}

.top-nav a:hover {
  text-decoration: underline;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #111;
  font-size: 14px;
}

.lang-btn:hover {
  text-decoration: underline;
}

.icon-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 6px;
}

.icon-btn:hover {
  opacity: 0.7;
}
</style>
