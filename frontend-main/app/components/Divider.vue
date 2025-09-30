<template>
  <hr
    class="divider"
    :style="{
      margin,
      borderTopColor: invisible ? 'transparent' : ''
    }"
  />
</template>

<script setup>
const props = defineProps({
  margin: String,
  invisible: Boolean
})

const margin = props.margin ?? '2rem 0'
const invisible = props.invisible ?? false
</script>

<style scoped>
.divider {
  all: initial;
  width: 100%;
  border: none;
  display: block;
  max-width: var(--body-a);
  border-top: 1px solid var(--border-a, #e0e0e0);
}
</style>
