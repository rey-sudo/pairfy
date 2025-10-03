<template>
  <div class="header-content">
    <Logo />
    <Divider vertical transparent margin="0rem 0.5rem" />
    <Search />
    <Divider vertical transparent margin="0rem 0.5rem" />
    <Button
      label="Connect"
      backgroundColor="var(--primary-0)"
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
