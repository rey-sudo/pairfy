<template>
  <div class="Header">
    <div class="Header-top">
      <TopNav />
    </div>
    <div class="Header-center">
      <Button
        label="Connect wallet"
        backgroundColor="transparent"
        borderColor="var(--border-1)"
        textColor="var(--text-0)" 
      />
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
  height: 4rem;
  border-bottom: 1px solid var(--border-0);
}

.Header-bottom {
  display: flex;
  height: 2rem;
  justify-content: center;
}
</style>
