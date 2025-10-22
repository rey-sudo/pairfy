<template>
  <div class="header-content">
    <Logo />
    <Divider vertical transparent margin="0rem 1rem" />
    <Search />
    <Divider vertical transparent margin="0rem 1rem" />
    <Button
      label="Connect"
      backgroundColor="var(--black-0)"
      borderColor="transparent"
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
