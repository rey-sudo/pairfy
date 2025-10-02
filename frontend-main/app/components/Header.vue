<template>
  <div class="Header">
    <div class="Header-top">
      <TopNav />
    </div>
    <div class="Header-center">
      <Divider vertical  transparent/>
      <Search />
      <Divider vertical transparent />
      <Button
        label="Connect"
        backgroundColor="var(--black-0)"
        borderColor="var(--border-1)"
        textColor="var(--text-w)"
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-0);
}

.Header-bottom {
  display: flex;
  height: 2rem;
  justify-content: center;
}
</style>
