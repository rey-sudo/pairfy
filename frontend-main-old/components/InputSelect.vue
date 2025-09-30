<template>
  <div class="InputSelect" ref="dropdownRef" @blur="validate(props.modelValue)" @keydown.enter.prevent="toggleDropdown"
    @keydown.space.prevent="toggleDropdown" tabindex="0">

    <label class="InputSelect-label" :for="props.id">
      <span> {{ label }}</span>

      <span class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '-' }}
      </span>
    </label>

    <!-- Display -->
    <div class="InputSelect-dropdown" :class="{ 'is-invalid': errorMessage }" role="combobox"
      :aria-expanded="isOpen.toString()" aria-haspopup="listbox" :aria-controls="`${props.id}-listbox`"
      @click="toggleDropdown">
      <template v-if="selectedOption">
        <slot name="selected" :option="selectedOption">
          {{ selectedOption.label }}
        </slot>
      </template>
      <template v-else>
        <span class="placeholder">{{ placeholder }}</span>
      </template>

      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-down-icon"
        aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>

    <!-- Dropdown -->

    <ul class="InputSelect-options" v-if="isOpen" :id="`${props.id}-listbox`" role="listbox">
      <li v-for="option in options" :key="option.value" class="dropdown-item" @click.stop="select(option)"
        :id="`option-${option.value}`" role="option">
        <slot name="option" :option="option">
          {{ option.label }}
        </slot>
      </li>
    </ul>

    <!-- Dropdown -->
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, default: 'input-select' },
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  required: { type: Boolean, default: true },
  options: { type: Array, required: true },
  placeholder: { type: String, default: 'Select one' }
})

const emit = defineEmits(['update:modelValue', 'valid'])

const isOpen = ref(false)
const dropdownRef = ref(null)
const errorMessage = ref('')
const selectedOption = computed(() => props.options.find(opt => opt.value === props.modelValue))

watch(() => props.modelValue, (newVal) => validate(newVal), { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside, { passive: true })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function select(option) {
  emit('update:modelValue', option.value)
  validate(option.value)
  isOpen.value = false
}

function validate(value) {
  if (props.required && !value) {
    errorMessage.value = '•'
    emit('valid', { valid: false, value: null })
    return false
  }
  errorMessage.value = ''
  emit('valid', { valid: true, value })
  return true
}

function handleClickOutside(e) {
  if (!dropdownRef.value?.contains(e.target)) {
    isOpen.value = false
  }
}
</script>

<style scoped>
.InputSelect {
  font-size: var(--text-size-1);
  flex-direction: column;
  position: relative;
  display: flex;
  width: 100%;
}

.InputSelect-dropdown {
  border-radius: var(--input-radius);
  border: 1px solid var(--border-b);
  background: var(--background-b);
  transition: var(--transition-a);
  justify-content: space-between;
  padding: 0.65rem 1rem;
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 0.5rem;
}

.InputSelect-dropdown:hover {
  border: 1px solid var(--primary-a);
}

.chevron-down-icon {
  margin-left: auto;
  flex-shrink: 0;
  pointer-events: none;
  transition: transform 0.2s ease;
}

.InputSelect-dropdown[aria-expanded="true"] .chevron-down-icon {
  transform: rotate(180deg);
}

.placeholder {
  color: var(--text-b);
  opacity: var(--placeholder-opacity);
}

.InputSelect-options {
  border-radius: var(--input-radius);
  border: 1px solid var(--border-a);
  background: var(--background-a);
  font-size: var(--text-size-1);
  box-shadow: var(--shadow-a);
  position: absolute;
  top: calc(100% - 0px);
  left: 0;
  right: 0;
  max-height: 200px;
  list-style: none;
  overflow-y: auto;
  z-index: 1000;
  padding: 0;
  margin: 0;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f9f9f9;
}

.InputSelect-label {
  justify-content: space-between;
  font-size: var(--text-size-0);
  margin-bottom: 0.75rem;
  align-items: center;
  display: flex;
}

.error-text {
  font-size: var(--text-size-0);
  color: transparent;
  font-weight: 300;
  opacity: 0;
}

.error-text.visible {
  opacity: 1;
  color: red;
}
</style>
