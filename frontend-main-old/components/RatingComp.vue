<template>
  <div class="flex space-x-1">
    <svg 
      v-for="index in 5" 
      :key="index" 
      width="17px" 
      height="17px" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
      :fill="index <= rating ? 'var(--yellow-a)' : 'none'" 
      :stroke="index <= rating ? '#E1B300' : 'var(--text-b)'" 
      stroke-width="1.5"
    >
      <path
        d="M12 2.5C12.3 2.5 12.6 2.7 12.7 2.9L15.1 8.3L21 9.1C21.6 9.2 21.9 9.9 21.5 10.4L17.3 14.8L18.3 20.6C18.4 21.2 17.8 21.7 17.3 21.4L12 18.4L6.7 21.4C6.2 21.7 5.6 21.2 5.7 20.6L6.7 14.8L2.5 10.4C2.1 9.9 2.4 9.2 3 9.1L8.9 8.3L11.3 2.9C11.4 2.7 11.7 2.5 12 2.5Z" />
    </svg>
  </div>
</template>

<script setup>
defineProps({ 
  rating: {
    type: Number,
    required: true,
    default: 4,
  },
});
</script>

<style scoped>
.space-x-1 > * + * {
  margin-left: 0.1px;
}
</style>
