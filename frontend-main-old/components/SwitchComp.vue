<template>
    <div class="p-SwitchComp" :class="{ disabled }">
      <label :for="props.id" class="title-text">
        {{ label }}
      </label>
      <div class="switch-wrapper" :class="{ 'is-invalid': errorMessage }">
        <input
          type="checkbox"
          :id="props.id"
          ref="inputRef"
          v-model="internalValue"
          @change="onToggle"
          class="switch-input"
          :disabled="disabled"
          :aria-invalid="!!errorMessage"
          :aria-describedby="`${props.id}-error`"
        />
        <span class="switch-slider" />
      </div>
      <p class="error-text" :class="{ visible: errorMessage }" :id="`${props.id}-error`">
        {{ errorMessage || '-' }}
      </p>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps({
    id: { type: String, default: 'switch' },
    modelValue: { type: Boolean, default: false },
    label: { type: String, default: 'Toggle Option' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  })
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'valid', value: boolean): void
  }>()
  
  const inputRef = ref<HTMLInputElement | null>(null)
  const internalValue = ref(props.modelValue)
  const errorMessage = ref('')
  
  watch(() => props.modelValue, (val) => {
    if (val !== internalValue.value) internalValue.value = val
  })
  
  watch(internalValue, (val) => {
    emit('update:modelValue', val)
    validateSwitch(val)
  })
  
  const onToggle = () => {
    validateSwitch(internalValue.value)
  }
  
  const validateSwitch = (value: boolean) => {
    if (props.required && !value) {
      errorMessage.value = 'This field is required.'
      emit('valid', false)
    } else {
      errorMessage.value = ''
      emit('valid', true)
    }
  }
  </script>
  
  <style scoped>
  .p-SwitchComp {
    display: flex;
    flex-direction: column;
    width: 100%;
    opacity: 1;
    transition: opacity 0.3s;
  }
  .p-SwitchComp.disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  
  .title-text {
    font-size: var(--text-size-1, 1rem);
    margin-bottom: 0.75rem;
    font-weight: 600;
  }
  
  .switch-wrapper {
    position: relative;
    width: 48px;
    height: 26px;
  }
  
  .switch-input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .switch-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    border-radius: 26px;
    transition: 0.3s;
  }
  
  .switch-wrapper input:checked + .switch-slider {
    background-color: var(--primary-a, #2563eb);
  }
  
  .switch-slider::before {
    content: '';
    position: absolute;
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.3s;
  }
  
  .switch-wrapper input:checked + .switch-slider::before {
    transform: translateX(22px);
  }
  
  .switch-wrapper.is-invalid .switch-slider {
    border: 2px solid red;
  }
  
  .error-text {
    animation: fadeIn 0.2s ease-in-out;
    font-size: var(--text-size-0, 0.875rem);
    margin: 0.5rem 0;
    color: transparent;
    opacity: 0;
  }
  
  .error-text.visible {
    opacity: 1;
    color: red;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
  
    to {
      opacity: 1;
    }
  }
  </style>
  