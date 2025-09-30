<template>
  <div class="InputPassword">
    <label class="title" :for="id">
      <span>{{ label }}</span>
      <span class="error-text" :class="{ visible: errorMessage }" :id="`${id}-error`">
        {{ errorMessage || '-' }}
      </span>
    </label>

    <div class="InputPassword-wrap">
      <input ref="inputRef" v-model="internalValue" :id="id" :type="isVisible ? 'text' : 'password'"
        :placeholder="placeholder" :class="{ 'is-invalid': errorMessage }" :aria-invalid="!!errorMessage"
        :aria-describedby="`${id}-error`" class="InputPassword-input" @drop.prevent />

      <button class="toggle-btn" type="button" @click="toggleVisibility"
        :aria-label="isVisible ? 'Hide password' : 'Show password'">
        <svg v-if="!isVisible" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-eye">
          <path
            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-eye-closed">
          <path d="m15 18-.722-3.25" />
          <path d="M2 8a10.645 10.645 0 0 0 20 0" />
          <path d="m20 15-1.726-2.05" />
          <path d="m4 15 1.726-2.05" />
          <path d="m9 18 .722-3.25" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: String, default: 'input-password' },
  modelValue: { type: [String, null], default: null },
  label: { type: String, default: 'Password' },
  placeholder: { type: String, default: 'Enter your password' },
  focus: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'valid'])

const MIN_LENGTH = 12
const MAX_LENGTH = 64

const inputRef = ref(null)
const internalValue = ref(props.modelValue ?? '')
const errorMessage = ref('')
const isVisible = ref(false)

const passwordRegex = /^.{12,64}$/

const messages = {
  required: '•',
  minLength: `Password must be at least ${MIN_LENGTH} characters.`,
  maxLength: `Password must be no more than ${MAX_LENGTH} characters.`,
  invalid: 'Invalid password',
}

const isEmpty = (val) => val.trim() === ''
const emitValue = (val) => emit('update:modelValue', isEmpty(val) ? null : val)

const validate = () => {
  const val = internalValue.value
  const trimmed = val.trim()

  const validators = [
    { condition: isEmpty(val), message: messages.required },
    { condition: val.length < MIN_LENGTH, message: messages.minLength },
    { condition: val.length > MAX_LENGTH, message: messages.maxLength },
    { condition: !isEmpty(val) && !passwordRegex.test(trimmed), message: messages.invalid },
  ]

  const error = validators.find(v => v.condition)?.message
  errorMessage.value = error || ''
  emit('valid', { valid: !error, value: !error ? trimmed : null })
}

watch(() => props.modelValue, (val) => {
  if (val !== internalValue.value) internalValue.value = val ?? ''
})

watch(internalValue, (val) => {
  emitValue(val)
  validate()
}, { immediate: true })

const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

onMounted(() => {
  if(props.focus){
    inputRef.value?.focus()
  }
})
</script>

<style scoped>
.InputPassword {
  box-sizing: border-box;
  flex-direction: column;
  display: flex;
  width: 100%;
}

.InputPassword-wrap {
  position: relative;
}

.InputPassword-input {
  border-radius: var(--input-radius);
  border: 1px solid var(--border-a);
  transition: var(--transition-a);
  background: var(--background-b);
  box-sizing: border-box;
  padding: var(--input-padding);
  outline: none;
  width: 100%;
}

.InputPassword-input:focus {
  border: 1px solid var(--primary-a);
}

.title {
  justify-content: space-between;
  font-size: var(--text-size-0);
  box-sizing: border-box;
  margin-bottom: 0.75rem;
  white-space: nowrap;
  align-items: center;
  display: flex;
}

.error-text {
  white-space: break-spaces;
  margin-left: 0.75rem;
  color: transparent;
  font-weight: 300;
  font-size: 10px;
  opacity: 0;
}

.error-text.visible {
  opacity: 1;
  color: red;
}

.toggle-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>