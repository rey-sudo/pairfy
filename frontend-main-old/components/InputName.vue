<template>
  <div class="InputName">
    <label class="InputName-label" :for="id">
      <span>{{ label }}</span>
      <span class="error-text" :class="{ visible: errorMessage }" :id="`${id}-error`">
        {{ errorMessage || '-' }}
      </span>
    </label>

    <input
      ref="inputRef"
      v-model="internalValue"
      :id="id"
      type="text"
      :placeholder="placeholder"
      :maxlength="maxLength"
      inputmode="text"
      @drop.prevent
      :class="{ 'is-invalid': errorMessage }"
      :aria-invalid="!!errorMessage"
      :aria-describedby="`${id}-error`"
      class="InputName-input"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, default: 'input-name' },
  modelValue: { type: [String, null], default: null },
  label: { type: String, default: 'Name' },
  placeholder: { type: String, default: 'e.g. Julian Blake' },
  focus: { type: Boolean, default: false },
  required: { type: Boolean, default: true },
  maxLength: { type: Number, default: 30 },
})

const emit = defineEmits(['update:modelValue', 'valid'])

const inputRef = ref(null)
const internalValue = ref(props.modelValue ?? '')
const errorMessage = ref('')

const nameRegex = /^[\p{L}\p{M}\s\-'.(),]+$/u

const messages = {
  required: '•',
  invalid: 'Only letters, spaces, and basic punctuation like - ’ . , ( ) are allowed.',
  maxLength: `Maximum length is ${props.maxLength} characters.`,
}

const isEmpty = (val) => val.trim() === ''
const emitValue = (val) => emit('update:modelValue', isEmpty(val) ? null : val)

const validate = () => {
  const val = internalValue.value
  const trimmed = val.trim()

  const validators = [
    { condition: props.required && isEmpty(val), message: messages.required },
    { condition: val.length > props.maxLength, message: messages.maxLength },
    { condition: !isEmpty(val) && !nameRegex.test(trimmed), message: messages.invalid },
  ]

  const error = validators.find(v => v.condition)?.message
  errorMessage.value = error || ''
  emit('valid', { valid: !error, value: !error ? (isEmpty(val) ? null : trimmed) : null })
}

watch(() => props.modelValue, (val) => {
  if (val !== internalValue.value) internalValue.value = val ?? ''
})

watch(internalValue, (val) => {
  emitValue(val)
  validate()
}, { immediate: true })

watch(() => props.focus, (newVal) => {
  if (newVal) inputRef.value?.focus()
}, { immediate: true })


</script>

<style scoped>
.InputName {
  flex-direction: column;
  display: flex;
  width: 100%;
}

.InputName-input {
  border-radius: var(--input-radius);
  border: 1px solid var(--border-b);
  transition: var(--transition-a);
  background: var(--background-b);
  padding: 0.65rem 1rem;
  outline: none;
}

.InputName-input:focus {
  border: 1px solid var(--primary-a);
}

input::placeholder {
  color: var(--text-b);
  opacity: var(--placeholder-opacity);
}

input:focus::placeholder {
  color: transparent;
}

input:hover {
  border: 1px solid var(--primary-a);
}

.InputName-label {
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
