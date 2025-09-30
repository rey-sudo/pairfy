<template>
    <div class="p-ToastComp-container">
      <transition-group name="p-ToastComp" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['p-ToastComp', toast.type]"
        >
          <span class="p-ToastComp-message">{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>
  </template>
  
  <script setup lang="ts">
  const toasts = ref<{ id: number; message: string; type: string }[]>([]);
  let counter = 0;
  

  function showToast(
    message: string,
    type: "success" | "error" | "info" | "default" = "default",
    duration = 5000
  ) {
    const id = counter++;
    toasts.value.push({ id, message, type });
  
    setTimeout(() => removeToast(id), duration);
  }
  

  function removeToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }
  
  defineExpose({ showToast });
  </script>
  
  <style scoped>
  .p-ToastComp-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 30000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .p-ToastComp {
    justify-content: space-between;
    border-radius: var(--radius-b);
    font-size: var(--text-size-1);
    box-shadow: var(--shadow-b);
    margin-bottom: 1rem;
    align-items: center;
    position: relative;
    min-width: 300px;
    max-width: 400px;
    font-weight: 500;
    padding: 1rem;
    display: flex;
  }
  
  .p-ToastComp.success {
    background-color: #e6f4ea;
    color: #216e39;
  }
  .p-ToastComp.error {
    background-color: #fdecea;
    color: #b91c1c;
  }
  .p-ToastComp.info {
    background-color: #e8f1fb;
    color: #1e3a8a;
  }
  .p-ToastComp.default {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  .p-ToastComp-message {
    overflow-wrap: anywhere;
    text-align: left;
    flex: 1;
  }
  
  .p-ToastComp-enter-active,
  .p-ToastComp-leave-active {
    transition: all 0.3s ease;
  }
  .p-ToastComp-enter-from,
  .p-ToastComp-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>
  