<template>
    <div class="OrderNav flex">
        <div class="OrderNav-item" :class="{ selected: modelValue === 0 }" @click="updateNav(0)">
            <span>P2P</span>
            <div class="border" :class="{ selected: modelValue === 0 }" />
        </div>
        <div class="OrderNav-item" :class="{ selected: modelValue === 1 }" @click="updateNav(1)">
            <span>Details</span>
            <div class="border" :class="{ selected: modelValue === 1 }" />
        </div>
        <div class="OrderNav-item" :class="{ selected: modelValue === 2 }" @click="updateNav(2)">
            <span>Transactions</span>
            <div class="border" :class="{ selected: modelValue === 2 }" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: Number,
        required: true,
    }
})

const emit = defineEmits(['update:modelValue'])

function updateNav(index) {
    emit('update:modelValue', index)
}
</script>


<style lang="css" scoped>
.OrderNav {
    border-bottom: 1px solid var(--border-a);
}

.OrderNav-item {
    transition: var(--transition-a);
    justify-content: center;
    flex-direction: column;
    color: var(--text-b);
    align-items: center;
    margin-right: 2rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
}

.OrderNav-item.selected {
    color: var(--text-a);
    font-weight: 600;
}

.OrderNav-item span {
    padding: 0.75rem 0;
}

.OrderNav-item .border {
    width: 50%;
    height: 3px;
    border-radius: 3px;
    background: transparent;
}

.OrderNav-item .border.selected {
    background: var(--primary-a);
}
</style>