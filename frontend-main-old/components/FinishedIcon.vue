<template>
    <div class="icon" :class="{ visible: color, red: color === 'red', green: color === 'green' }">
        <div class="circle" :class="{ green: color === 'green' }" v-if="color === 'green'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-check-icon lucide-check">
                <path d="M20 6 9 17l-5-5" />
            </svg>
        </div>

        <div class="circle" :class="{ red: color === 'red' }" v-if="color === 'red'">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-x-icon lucide-x">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
            </svg>
        </div>
    </div>
</template>

<script setup>

const orderStore = useOrderStore()

const color = computed(() => {

    if (orderStore.finished || orderStore.order.completed) {
        if ([-1, -2, null].includes(orderStore.state)) return 'red'

        if ([3,4].includes(orderStore.state)) return 'green'
    }

    return false
});

</script>

<style lang="css" scoped>
.icon {
    width: 50px;
    height: 50px;
    position: absolute;
    z-index: 100;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    right: 0;
    background: color-mix(in srgb, var(--green-a), transparent 50%);
}

.icon.visible {
    display: flex;
}

.circle {
    width: 38px;
    height: 38px;
    display: flex;
    border-radius: 50%;
    align-items: center;
    color: var(--text-w);
    justify-content: center;
}

.icon.red {
    background: color-mix(in srgb, var(--red-a), transparent 50%);
}

.icon.green {
    background: color-mix(in srgb, var(--green-a), transparent 50%);
}

.circle.red {
    background: var(--red-a);
}

.circle.green {
    background: var(--green-a);
}
</style>