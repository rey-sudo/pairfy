<template>

  <transition name="fade">
    <div class="dialog-backdrop" v-if="modelValue" @click="emitClose('modal')">
      <div class="dialog-box" @click.stop>

        <div class="header flex end" v-if="props.closable">
          <button class="flex center" @click="emitClose('button')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-x-icon lucide-x">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <slot />
      </div>
    </div>
  </transition>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: true
  },
  modalClose: {
    type: Boolean,
    default: true
  },
});

const emit = defineEmits(['update:modelValue']);

function emitClose(origin) {
  if (!props.closable) return

  if (origin === 'button') {
    emit('update:modelValue', false);
  }
  if (origin === 'modal') {
    if (props.modalClose) {
      emit('update:modelValue', false);
    }
  }
}

function open() {
  emit('update:modelValue', true);
}

function close() {
  emit('update:modelValue', false);
}

defineExpose({ open, close });

let scrollY = 0
let isLocked = false

function lockScroll() {
  if (isLocked) return
  scrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.overflowY = 'scroll'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
  isLocked = true
}

function unlockScroll() {
  if (!isLocked) return
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, scrollY)
  isLocked = false
}

if (import.meta.client) {
  watch(
    () => props.modelValue,
    (val) => {
      if (val) lockScroll()
      else unlockScroll()
    }
  )

  onMounted(() => {
    if (props.modelValue) lockScroll()
  })
  onBeforeUnmount(() => {
    unlockScroll()
  })
}

</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  z-index: 20000;
  padding-right: 0;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
}

.dialog-box {
  background: var(--background-a);
  border-radius: var(--radius-c);
  box-shadow: var(--shadow-b);
  box-sizing: border-box;
  overflow: hidden;
  min-width: 300px;
}

button {
  transition: var(--transition-a);
  background: transparent;
  color: var(--text-b);
  cursor: pointer;
  border: none;
}

button:hover {
  color: var(--text-a);
}

.header {
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}


.fade-enter-active,
.fade-leave-active {
  transition: var(--transition-a);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
