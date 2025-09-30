<template>
    <div class="scanner" @click="openExplorer">
        <div class="scanner-label" :style="{ color: status.color }">
            {{ status.label }}
        </div>

        <div class="scanner-symbol" :style="{ color: status.color }">
            <div class="scanner-loader" :class="{
                warn: status.label === 'confirming',
                danger: status.label === 'unconfirmed'
            }" v-if="status.template === 'loading'" />

            <div v-if="status.template === 'icon'">
                <template v-if="status.icon === 'eye'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-eye-icon lucide-eye">
                        <path
                            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
const orderStore = useOrderStore()
const orderData = computed(() => orderStore.order)

const status = computed(() => {
    const pendingBlock = orderData.value.pending_block

    if (!pendingBlock) {
        return {
            label: "unconfirmed",
            template: "loading",
            color: "var(--red-a)"
        }
    }

    const now = Math.floor(Date.now() / 1000);
    const diff = now - pendingBlock;
    const minutes = Math.floor(diff / 60);

    if (minutes <= 10) {
        return {
            label: "confirming",
            template: "icon",
            icon: "eye",
            color: "var(--orange-a)"
        }
    }

    if (minutes >= 10) {
        return {
            label: "confirmed",
            template: "icon",
            icon: "eye",
            color: "var(--green-a)"
        }
    }
})

function openExplorer() {
    if (!import.meta.client) return

    const cardanoNetwork = useRuntimeConfig().public.cardanoNetwork;

    if (cardanoNetwork === 'mainnet' || cardanoNetwork === 'preprod') {
        const prefix = cardanoNetwork === 'mainnet' ? '' : `${cardanoNetwork}.`;
        window.open(`https://${prefix}cexplorer.io/tx/${orderStore.pendingTx}`, '_blank');
    }
}
</script>

<style lang="css" scoped>
.scanner {
    display: flex;
    cursor: pointer;
    overflow: hidden;
    background: inherit;
    padding-right: 1rem;
    align-items: center;
    border-radius: var(--radius-f);
    outline: 1px solid var(--border-a);
}

.scanner-label {
    font-size: var(--text-size-1);
    font-weight: 600;
    border-right: 1px solid var(--border-a);
    padding: 0 1rem;
    margin-right: 0.75rem;
}

.scanner-label.unconfirmed {
    color: var(--red-a);
}

.scanner-label.confirmed {
    color: var(--green-a);
}

.scanner-symbol {
    justify-content: center;
    align-items: center;
    margin-left: 1px;
    display: flex;
}

.scanner-loader {
    width: 1rem;
    height: 1rem;
    border: 2px solid transparent;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    margin-left: 1px;
}

.scanner-loader.warn {
    border: 2px solid var(--orange-a);
    border-bottom-color: transparent;
}

.scanner-loader.danger {
    border: 2px solid var(--red-a);
    border-bottom-color: transparent;
}


@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>