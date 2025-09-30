<template>
  <button class="ButtonSolid" :class="[{ disabled, outlined }, sizeClass]" @click="$emit('click')" :disabled="disabled">

    <div class="ButtonSolid-body flex">
      <div class="slot" :class="{ icon }">
        <slot name="icon" />
      </div>

      <span class="loader" v-if="loading" />
      <span class="label" v-if="!loading">{{ label }}</span>
    </div>

  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  size: {
    type: String as PropType<'mini' | 'mid' | 'large'>,
    default: 'mid'
  },
  label: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Boolean,
    default: false
  }
})
defineEmits(['click'])

const sizeClass = computed(() => {
  switch (props.size) {
    case 'mini':
      return 'btn-mini'
    case 'large':
      return 'btn-large'
    default:
      return 'btn-mid'
  }
})
</script>

<style scoped>
.ButtonSolid {
  border-radius: var(--button-radius);
  border: 1px solid var(--primary-a);
  transition: var(--transition-a);
  background: var(--primary-a);
  justify-content: center;
  color: var(--text-w);
  align-items: center;
  font-weight: bold;
  cursor: pointer;
  display: flex;
}

.ButtonSolid:hover {
  background: var(--primary-b);
}

.ButtonSolid.disabled {
  pointer-events: none;
  background: var(--primary-b);
  border: 1px solid var(--primary-b);
}

.ButtonSolid-body {
  align-items: center;
  display: flex;
}

.ButtonSolid.outlined {
  border: 1px solid var(--primary-a);
  background: transparent;
  color: var(--primary-a);
}

.ButtonSolid.outlined:hover {
  border: 1px solid var(--primary-a);
  background: var(--primary-a);
  color: var(--text-w);
}

.ButtonSolid.outlined.disabled {
  pointer-events: none;
}

.btn-mini {
  padding: 0.5rem 1rem;
  font-size: var(--text-size-0);
}

.btn-mid {
  font-size: var(--text-size-1);
  padding: 0.75rem 1rem;
}

.btn-large {
  padding: 1rem;
  font-size: var(--text-size-1);
}

.loader {
  width: 1rem;
  height: 1rem;
  border: 2px solid #FFF;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  border-bottom-color: transparent;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.icon {
  margin-right: 0.5rem;
}
</style>
