<template>
  <div class="wrapper" v-show="visible" @click="close">
    <div class="overlay" v-if="overlay"  :class="{ 'overlay-visible': modelValue }"></div>

    <div
      class="drawer"
      :class="[
        position === 'right' ? 'drawer-right' : 'drawer-left',
        { open: isOpen },
      ]"
      :style="{ width }"
      @click.stop
    >
      <slot />
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: Boolean,
  position: {
    type: String,
    default: 'right',
    validator: val => ['left', 'right'].includes(val),
  },
  width: {
    type: String,
    default: '300px',
  },
  persistent: {
    type: Boolean,
    default: false,
  },
  overlay: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
const isOpen = ref(false)

watch(() => props.modelValue, async (val) => {
  if (val) {
    visible.value = true
    await nextTick()
   
    requestAnimationFrame(() => {
      isOpen.value = true
    })
  } else {
    isOpen.value = false
    setTimeout(() => {
      visible.value = false
    }, 300)
  }
})

function close() {
  if (!props.persistent) {
    emit('update:modelValue', false)
  }
}

function onKeyDown(e) {
  if (e.key === 'Escape' && !props.persistent) {
    close()
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
.wrapper {
  position: fixed;
  inset: 0;
  z-index: 15000;
}

.overlay {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s ease;
}

.overlay-visible {
  background: rgba(0, 0, 0, 0.2);
}

.drawer {
  top: 0;
  z-index: 1;
  height: 100%;
  overflow-y: auto;
  position: absolute;
  box-shadow: var(--shadow-a);
  background: var(--background-a);
  transition: transform 0.3s ease;
}

.drawer-right {
  right: 0;
  transform: translateX(100%);
}

.drawer-left {
  left: 0;
  transform: translateX(-100%);
}

.drawer.open {
  transform: translateX(0);
}
</style>
