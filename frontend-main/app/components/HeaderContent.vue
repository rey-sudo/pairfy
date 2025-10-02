<template>
  <div class="header-content">
    <Divider vertical transparent />
    <Search />
    <Divider vertical transparent />
    <Button
      label="Connect"
      backgroundColor="var(--black-0)"
      borderColor="var(--border-1)"
      textColor="var(--text-w)"
    />
  </div>
</template>

<script setup></script>

<style lang="css" scoped>
.header-content {
  width: 100%;
  display: flex;
  align-items: center;
  max-width: var(--body);
}
</style>
