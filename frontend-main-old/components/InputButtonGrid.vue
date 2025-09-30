<template>
  <div class="InputButtonGrid">
    <button
      class="InputButtonGrid-button"
      v-for="provider in providers"
      :key="provider"
      :class="{ active: modelValue === provider }"
      @click="$emit('update:modelValue', provider)"
    >
      {{ provider }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String
});

const emit = defineEmits(['update:modelValue']);

const providers = [
  "UPS",
  "FedEx",
  "USPS",
  "DHL",
  "Amazon",
  "OnTrac"
];
</script>

<style scoped>
.InputButtonGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.InputButtonGrid-button {
  border: 1px solid var(--primary-a);
  transition: var(--transition-a);
  background: var(--background-a);
  border-radius: var(--radius-a);
  font-size: var(--text-size-1);
  color: var(--primary-a);
  padding: 0.65rem 1rem;
  text-align: center;
  cursor: pointer;
}

.InputButtonGrid-button.active {
  background: var(--primary-a);
  color: var(--text-w);
}
</style>
