<template>
    <div class="OrderSummary">

        <div class="OrderSummary-title">
            <div>
                {{ orderTitle }}
            </div>

            <span v-if="visibleCountdown">{{ formatCountdown(globalCountdown) }}</span>

            <FinishedIcon v-if="visibleIcon"/>
        </div>

        <div class="OrderSummary-subtitle">
            Order ID
            <div>
                <span>{{ truncateText(orderData.id, 30) }}</span>
            </div>
            <button class="copy-button" @click="copyToClipboard(orderData.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-copy-icon lucide-copy">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
            </button>
            <button class="copy-button" @click="openExplorer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-globe-icon lucide-globe">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                </svg>
            </button>
        </div>


        <div class="OrderSummary-subtitle">
            Contract Address
            <div>
                <span> {{ truncateText(orderData.contract_address, 20) }}</span>
            </div>
            <button class="copy-button flex" @click="copyToClipboard(orderData.contract_address)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-copy-icon lucide-copy">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
            </button>
        </div>

        <DividerComp margin="1rem 0" />

        <OrderTimeline />
    </div>
</template>

<script setup>
import { truncateText } from '@/utils/utils'

const orderStore = useOrderStore()
const orderData = computed(() => orderStore.order)

const orderTitle = computed(
    () => {
        const state = orderStore.state

        let title = "Preparing your package, Time Remaining"

        if (state === 0) {
            title = "Preparing your package, Time Remaining"
        }

        if (state === -1) {
            title = "The order has been returned."
        }

        if (state === 1) {
            title = "Preparing your package, Time Remaining"
        }

        if (state === -2) {
            title = "The order has been cancelled."
        }

        if (state === 2) {
            title = "The Package is Arriving, Time Remaining "
        }

        if (state === 3) {
            title = "The Package has Arrived, Time Remaining "
        }

        if (state === 4) {
            title = "The Package has Arrived, Time Remaining "
        }

        return title
    }
)

const globalTimestamp = computed(() => {
    const state = orderStore.state

    if (state === null) {
        return orderData.value.watch_until
    }

    if (state === 0) {
        return orderData.value.pending_until
    }

    if (state === -1) {
        return Date.now()
    }

    if (state === 1) {
        return orderData.value.shipping_until
    }

    if (state === -2) {
        return Date.now()
    }

    if (state === 2) {
        return Number(orderStore.shipping?.public?.tolerance)
    }

    if (state === -3) {
        return Date.now()
    }

    if (state === 3) {
        return Date.now()
    }
})

const visibleCountdown = computed(() => {

if (orderStore.finished || orderStore.order.completed) {
    return false
}

return true
})

const visibleIcon = computed(() => {

if (orderStore.finished || orderStore.order.completed) {
    return true
}

return false
})

const now = ref(Date.now());

const interval = setInterval(() => {
  now.value = Date.now(); 
}, 1000);

const globalCountdown = computed(() => {
    const globalTimeLeft = globalTimestamp.value - now.value;

    if (globalTimeLeft <= 0) return "00:00";

    const totalSeconds = Math.floor(globalTimeLeft / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
});

watch(globalCountdown, (e) => {
    orderStore.countdown = e
}, { immediate: true })

function openExplorer() {
    if (!import.meta.client) return

    const cardanoNetwork = useRuntimeConfig().public.cardanoNetwork;

    if (cardanoNetwork === 'mainnet' || cardanoNetwork === 'preprod') {
        const prefix = cardanoNetwork === 'mainnet' ? '' : `${cardanoNetwork}.`;
        window.open(`https://${prefix}cexplorer.io/tx/${orderStore.pendingTx}`, '_blank');
    }
}

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style lang="css" scoped>
.OrderSummary {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.OrderSummary-title {
    display: flex;
    font-weight: 600;
    line-height: 3rem;
    position: relative;
    font-size: var(--text-size-3);
}

.OrderSummary-title span {
    color: var(--primary-a);
    font-weight: 700;
    margin-left: 0.5rem
}

.OrderSummary-subtitle {
    font-size: var(--text-size-1);
    color: var(--text-a);
    align-items: center;
    line-height: 2.5rem;
    font-weight: 500;
    display: flex;
}

.OrderSummary-subtitle span {
    color: var(--text-b);
    margin-left: 0.5rem;
    font-weight: 400;
}

.OrderSummary-subtitle button {
    background: transparent;
    border: none;
    cursor: pointer;
}

.copy-button:hover {
    display: flex;
    align-items: center;
    color: var(--primary-c);
}
</style>