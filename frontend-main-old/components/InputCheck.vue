<template>
  <div class="p-InputCheck">
    <label class="p-InputCheck-wrap">
      <input class="p-InputCheck-input" ref="checkboxRef" type="checkbox" :checked="modelValue" @change="onChange"  />
      <span class="p-InputCheck-box"></span>
      <span class="p-InputCheck-label">{{ label }}

        <a class="p-InputCheck-link" v-if="link" :href="link.href" target="_blank" rel="noopener">
          {{ link.label }}
        </a>

      </span>
    </label>

    <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  focus: {
    type: Boolean,
    default: false
  },
  link: {
    type: Object,
    default: null
    // expected: { label: string, href: string }
  }
})

const emit = defineEmits(['update:modelValue', 'valid'])

const checkboxRef = ref(null)
const errorMessage = ref('')

const validate = (value) => {
  if (props.required && !value) {
    errorMessage.value = ''
    emit('valid', false)
    return false
  }

  errorMessage.value = ''
  emit('valid', true)
  return true
}

const onChange = (event) => {
  const checked = event.target.checked
  emit('update:modelValue', checked)
  validate(checked)
}

onMounted(() => {
  if (props.focus) {
    checkboxRef.value?.focus()
  }

  validate(props.modelValue)
})


</script>

<style scoped>
.p-InputCheck {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.p-InputCheck-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.p-InputCheck-input {
  display: none;
}

.p-InputCheck-box {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--border-a, #ccc);
  border-radius: 4px;
  position: relative;
  background-color: white;
}

.p-InputCheck-input:checked+.p-InputCheck-box {
  background-color: var(--primary-a, #3498db);
  border-color: var(--primary-a, #3498db);
}

.p-InputCheck-input:checked+.p-InputCheck-box::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  font-size: 16px;
  color: white;
}

.p-InputCheck-label {
  font-size: var(--text-size-0);
}

.error-text {
  color: red;
  font-size: var(--text-size-0);
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.p-InputCheck-link {
  text-decoration: underline;
  color: var(--text-a);
  font-size: inherit;
}
</style>