<template>
    <div class="LoadingComp">
      <div
        class="LoadingComp-loader"
        :style="loaderStyle"
      />
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    size: {
      type: [String, Number],
      default: 48,
    },
    borderWidth: {
      type: [String, Number],
      default: 5, 
    },
    color: {
      type: String,
      default: 'var(--primary-a)', 
    },
  })
  
  const loaderStyle = computed(() => ({
    width: typeof props.size === 'number' ? `${props.size}px` : props.size,
    height: typeof props.size === 'number' ? `${props.size}px` : props.size,
    borderWidth:
      typeof props.borderWidth === 'number'
        ? `${props.borderWidth}px`
        : props.borderWidth,
    borderColor: `${props.color} transparent ${props.color} ${props.color}`,
  }))
  </script>
  
  <style scoped>
  .LoadingComp {
    justify-content: center;
    align-items: center;
    display: flex;
    height: 100%;
  }
  
  .LoadingComp-loader {
    border-style: solid;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    box-sizing: border-box;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  