<template>
    <button :disabled="disabled">
        <slot name="content"></slot>
    </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

</script>

<style lang="css" scoped>

button {
  background: transparent;
  flex-direction: column;
  color: var(--text-a);
  border-radius: 50%;
  transition: 0.2s;
  padding: 0.75rem;
  cursor: pointer;
  display: flex;
  border: none;
}

button:hover{
  background: var(--background-b);
}

button:disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}

button:hover:not(:disabled) {
  background: var(--background-b);
}

</style>