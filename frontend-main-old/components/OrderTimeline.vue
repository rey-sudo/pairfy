<template>
    <div class="OrderTimeline">
        <div class="OrderTimeline-item" v-for="(item, index) in timeline" :key="index">

            <div class="OrderTimeline-left">
                <div class="timeline-box">
                    <div class="timeline-diamond">
                        <template v-if="item.template === 'created'">
                            <span v-if="!orderData.pending_block">{{ item.number }}</span>
                            <span v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-check-icon lucide-check">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </span>
                        </template>
                        <template v-if="item.template === 'shipping'">
                            <span v-if="!orderData.shipping_block">{{ item.number }}</span>
                            <span v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-check-icon lucide-check">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </span>
                        </template>
                        <template v-if="item.template === 'received'">
                            <span v-if="!orderData.finished">{{ item.number }}</span>
                            <span v-else>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-check-icon lucide-check">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                            </span>
                        </template>
                    </div>
                </div>
                <div class="timeline-line" :class="{ disabled: !item.line }" />
            </div>

            <div class="OrderTimeline-right">
                <div class="timeline-title">
                    {{ item.title }}
                </div>
                <div class="timeline-subtitle">
                    {{ item.subtitle }}
                </div>
                <div class="OrderTimeline-content"
                    :class="{ box: item.type === 'box', button: item.type === 'button' }">

                    <template v-if="item.template === 'created'">
                        <div class="template">
                            <div class="template-item">
                                <span>Status</span>
                                <span :class="{ red: ['returned', 'appealed', 'canceled'].includes(orderData.status) }">
                                    {{ orderData.status }}
                                </span>
                            </div>
                            <div class="template-item">
                                <span>USD Amount</span>
                                <span>{{ formatUSD(orderData.contract_quote) }} USD</span>
                            </div>
                            <div class="template-item">
                                <span>Asset Amount</span>
                                <span>{{ formatAssetQuantity(orderData.asset_name, orderData.contract_price) }}</span>
                            </div>
                            <div class="template-item">
                                <span>Asset Price</span>
                                <span>{{ orderData.asset_price }} {{ orderData.asset_name }}</span>
                            </div>
                            <div class="template-item">
                                <span>Quantity</span>
                                <span>{{ orderData.contract_units }}</span>
                            </div>
                            <div class="template-item">
                                <span>Payment</span>
                                <OrderScanner />
                            </div>
                        </div>
                    </template>


                    <template v-if="item.template === 'shipping'">
                        <div class="template">
                            <div class="template-item">
                                <span>Status</span>
                                <span>{{ shippingStatus }}</span>
                            </div>
                            <div class="template-item">
                                <span>Delivery date</span>
                                <span>{{ deliveryDate }}</span>
                            </div>
                        </div>
                    </template>

                    <template v-if="item.template === 'received'">
                        <UserPad />
                    </template>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { formatUSD } from '@/utils/utils'

const orderStore = useOrderStore()
const orderData = computed(() => orderStore.order)

const shippingData = ref(null);

const deliveryDate = computed(() => {
    const value = orderStore.shipping

    if (!value) return 'none'

    return formatDateYYMMDD(Number(value.public.tolerance))

});

const shippingStatus = computed(() => {
    const state = orderStore.state;

    if (state === null) {
        return "pending"
    }

    if (state === 0) {
        return "pending"
    }

    if (state === 1) {
        return "preparing"
    }

    if (state === 2) {
        return "dispatched"
    }

    if (state === 3) {
        return "received"
    }

    if (state === 4) {
        return "received"
    }

    return "-"
});

const timeline = ref([
    {
        number: 1,
        title: "Created",
        subtitle: "The seller has been notified to prepare your package.",
        completed: true,
        type: "box",
        template: "created",
        line: true
    },
    {
        number: 2,
        title: "Shipping",
        subtitle: "Use the tracking number to check your shipment.",
        completed: false,
        type: "box",
        template: "shipping",
        line: true
    },
    {
        number: 3,
        title: "Finished",
        subtitle: "Please confirm that the exact product was delivered.",
        completed: false,
        type: "button",
        template: "received",
        line: false
    }
])

</script>

<style lang="css" scoped>
.OrderTimeline {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.OrderTimeline-item {
    display: flex;
    width: inherit;
}

.OrderTimeline-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 1rem;
}

.OrderTimeline-right {
    width: inherit;
}

.timeline-box {
    width: inherit;
    min-height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.timeline-line {
    width: 2px;
    height: 100%;
    background: var(--border-a);
}

.timeline-line.disabled {
    background: transparent;
}

.OrderTimeline-body {
    display: flex;
    flex-direction: column;
    width: inherit;
}

.timeline-title {
    display: flex;
    min-height: 50px;
    font-weight: 600;
    align-items: center;
    font-size: var(--text-size-2);
}

.timeline-subtitle {
    font-size: var(--text-size-1);
    margin-bottom: 1rem;
}

.OrderTimeline-content {
    border: 1px solid var(--border-a);
    border-radius: var(--radius-c);
    width: inherit;
}

.OrderTimeline-content.button {
    border: initial
}

.timeline-diamond {
    width: 20px;
    height: 20px;
    background: var(--border-a);
    transform: rotate(45deg);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-radius: 4px;
}

.timeline-diamond span {
    font-size: var(--text-size-1);
    transform: rotate(-45deg);
    color: var(--text-a);
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
}

.timeline-diamond span i {
    font-size: 10px;
}

.template {
    display: block;
    padding: 1rem;
}

.template-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 2.5rem;
    text-transform: capitalize;
}

.template-item span {
    font-weight: 500;
    font-size: var(--text-size-2);
}

.template-item span:nth-child(1) {
    color: var(--text-b);
}

</style>