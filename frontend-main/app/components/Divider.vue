<template>
  <hr
    class="divider"
    :class="{ vertical }"
    :style="{
      margin,
      borderTopColor: transparent ? 'transparent' : '',
      background: transparent ? 'transparent' : '',
    }"
  />
</template>

<script setup>
const props = defineProps({
  margin: String,
  transparent: Boolean,
  vertical: Boolean,
});

const margin = props.margin;
const transparent = props.transparent ?? false;
</script>

<style scoped>
.divider {
  all: initial;
  width: 100%;
  border: none;
  display: block;
  margin: 2rem 0;
  max-width: var(--body-a);
  border-top: 1px solid var(--border-0);
}

.divider.vertical {
  width: 1px;
  height: 100%;
  background: var(--border-0);
  margin: 0 1rem;
}
</style>
