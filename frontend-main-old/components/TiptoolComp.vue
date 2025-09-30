<template>
  <div
    ref="wrapperRef"
    class="tooltip-wrapper"
    @mouseenter="show = true"
    @mouseleave="show = false"
    @focusin="show = true"
    @focusout="show = false"
  >
    <slot />
    <Teleport to="body" v-if="client">
      <div
        v-show="show"
        :class="['tooltip', position]"
        :style="tooltipStyle"
        role="tooltip"
      >
        {{ text }}
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  text: { type: String, required: true },
  position: {
    type: String as () => 'top' | 'bottom' | 'left' | 'right',
    default: 'top',
  },
})

const show = ref(false)
const client = ref(false)
const tooltipStyle = ref<Record<string, string>>({})
const wrapperRef = ref<HTMLElement | null>(null)

onMounted(() => {
  client.value = true

  watch(show, async (visible) => {
    if (!visible || !wrapperRef.value) return

    await nextTick()
    const rect = wrapperRef.value.getBoundingClientRect()

    const style: Record<string, string> = {
      position: 'fixed',
      zIndex: '9999',
    }

    switch (props.position) {
      case 'top':
        style.top = `${rect.top - 40}px`
        style.left = `${rect.left + rect.width / 2}px`
        style.transform = 'translateX(-50%)'
        break
      case 'bottom':
        style.top = `${rect.bottom + 8}px`
        style.left = `${rect.left + rect.width / 2}px`
        style.transform = 'translateX(-50%)'
        break
      case 'left':
        style.top = `${rect.top + rect.height / 2}px`
        style.left = `${rect.left - 8}px`
        style.transform = 'translate(-100%, -50%)'
        break
      case 'right':
        style.top = `${rect.top + rect.height / 2}px`
        style.left = `${rect.right + 8}px`
        style.transform = 'translateY(-50%)'
        break
    }

    tooltipStyle.value = style
  })
})
</script>

<style scoped>
.tooltip-wrapper {
  display: inline-block;
  position: relative;
}

.tooltip {
  opacity: 0;
  white-space: nowrap;
  color: var(--text-w);
  pointer-events: none;
  background: #1e293b;
  padding: 0.5rem 0.75rem;
  font-size: var(--text-size-1);
  border-radius: var(--radius-b);
  animation: fadeIn 0.2s ease forwards;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
