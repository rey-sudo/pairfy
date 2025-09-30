<template>
    <div class="transactions">
        <div class="card">
            <div class="card-head flex">
                <span>Pending Tx</span>

                <span class="timestamp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-clock-icon lucide-clock">
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    {{ formatCompleteDate(orderData.pending_block, true) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ orderData.pending_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(orderData.pending_tx)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-globe-icon lucide-globe">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Returned Tx</span>

                <span class="timestamp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-clock-icon lucide-clock">
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    {{ formatCompleteDate(orderData.returned_block, true) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ orderData.returned_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(orderData.returned_tx)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-globe-icon lucide-globe">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Locking Tx</span>

                <span class="timestamp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-clock-icon lucide-clock">
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    {{ formatCompleteDate(orderData.locking_block, true) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ orderData.locking_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(orderData.locking_tx)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-globe-icon lucide-globe">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Canceled Tx</span>

                <span class="timestamp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-clock-icon lucide-clock">
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    {{ formatCompleteDate(orderData.canceled_block, true) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ orderData.canceled_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(orderData.canceled_tx)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-globe-icon lucide-globe">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </span>
            </div>
        </div>


        <div class="card">
            <div class="card-head flex">
                <span>Shipping Tx</span>

                <span class="timestamp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-clock-icon lucide-clock">
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    {{ formatCompleteDate(orderData.shipping_block, true) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ orderData.shipping_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(orderData.shipping_tx)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-globe-icon lucide-globe">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Appealed Tx</span>

                <span class="timestamp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-clock-icon lucide-clock">
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    {{ formatCompleteDate(orderData.appealed_block, true) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ orderData.appealed_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(orderData.appealed_tx)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-globe-icon lucide-globe">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Received Tx</span>

                <span class="timestamp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-clock-icon lucide-clock">
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    {{ formatCompleteDate(orderData.received_block, true) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ orderData.received_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(orderData.received_tx)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-globe-icon lucide-globe">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </span>
            </div>
        </div>

        <div class="card">
            <div class="card-head flex">
                <span>Collected Tx</span>

                <span class="timestamp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-clock-icon lucide-clock">
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    {{ formatCompleteDate(orderData.collected_block, true) }}
                </span>
            </div>
            <div class="card-body">
                <span class="mask">{{ orderData.collected_tx || "None" }}</span>
                <span class="explore" @click="openExplorer(orderData.collected_tx)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-globe-icon lucide-globe">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                    </svg>
                </span>
            </div>
        </div>

    </div>
</template>

<script setup>

const orderStore = useOrderStore()

const orderData = computed(() => orderStore.order)

function openExplorer(txHash) {
    if (!import.meta.client) return

    const cardanoNetwork = useRuntimeConfig().public.cardanoNetwork;

    if (cardanoNetwork === 'mainnet' || cardanoNetwork === 'preprod') {
        const prefix = cardanoNetwork === 'mainnet' ? '' : `${cardanoNetwork}.`;
        window.open(`https://${prefix}cexplorer.io/tx/${txHash}`, '_blank');
    }
}

</script>

<style lang="css" scoped>
.transactions {}

.card {
    border-radius: 12px;
    border: 1px solid var(--border-a);
    margin-bottom: 1rem;
}

.card-head {
    border-bottom: 1px solid var(--border-a);
    justify-content: space-between;
    font-size: var(--text-size-1);
    font-weight: 700;
    padding: 1rem;
}

.card-body {
    padding: 1rem;
    display: flex;
    align-items: center;
}

.timestamp {
    font-size: var(--text-size-0);
    align-items: center;
    color: var(--text-b);
    display: flex;
}

.timestamp svg {
    margin-right: 0.5rem;
}

.mask {
    background: var(--background-b);
    padding: 0.5rem;
    border-radius: 8px;
    font-size: var(--text-size-1);
}

.explore {
    color: var(--text-b);
    cursor: pointer;
}
</style>