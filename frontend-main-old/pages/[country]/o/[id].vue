<template>
    <div class="OrderPage">

        <ToastComp ref="toastRef" />

        <div class="OrderPage-body">

            <OrderNav v-model="currentNav" />

            <div class="OrderPage-grid" v-if="orderData">
                <OrderSummary v-if="currentNav === 0" />
                <OrderProduct v-if="currentNav === 1" />
                <OrderTxs v-if="currentNav === 2" />
                <OrderPanel />
            </div>

        </div>
    </div>
</template>

<script setup>
import { gql } from 'graphql-tag'

const route = useRoute();

const orderStore = useOrderStore()
const orderData = computed(() => orderStore.order)

const { $gatewayClient } = useNuxtApp()

const toastRef = ref(null);
const currentNav = ref(0);

let subscription1;

const fetchOrder = async () => {

    const GET_ORDER_QUERY = gql`
query ($getOrderVariable: GetOrderInput!) {
    getOrder(getOrderInput: $getOrderVariable) {
       order {
            id
            type
            status
            finished
            completed
            country
            buyer_pubkeyhash
            buyer_address
            buyer_wallet
            buyer_username
            buyer_rsa_version
            seller_id
            seller_pubkeyhash
            seller_address
            seller_wallet
            seller_username
            seller_rsa_version
            product_id
            product_snapshot
            contract_address
            contract_params
            contract_state
            contract_price
            contract_quote
            contract_fee
            contract_units
            asset_name
            asset_price
            watch_until
            pending_until
            shipping_until
            expire_until
            pending_tx
            pending_block
            pending_metadata
            returned_tx
            returned_block
            returned_metadata
            locking_tx
            locking_block
            locking_metadata
            canceled_tx
            canceled_block
            canceled_metadata
            shipping_tx
            shipping_block
            shipping_metadata
            appealed_tx
            appealed_block
            appealed_metadata
            received_tx
            received_block
            received_metadata
            collected_tx
            collected_block
            collected_metadata
            scanned_at
            created_at
            updated_at
            schema_v
       }

       product
       address
       shipping
       session
    }
}

`;

    const observable = $gatewayClient.watchQuery({
        query: GET_ORDER_QUERY,
        variables: {
            getOrderVariable: {
                id: route.params.id
            }
        },
        fetchPolicy: 'no-cache',
        pollInterval: 30_000,
    })

    subscription1 = observable.subscribe({
        next({ data }) {
            orderStore.setOrder(data.getOrder)
            orderStore.pendingTx = route.query?.tx || data.getOrder.order.pending_tx
        },
        error(err) {
            orderStore.showToast(err, 'error', 10_000)
        }
    })
}

function removeSubscriptions() {
    subscription1?.unsubscribe()
}

function watchToast() {
    watch(() => orderStore.toastMessage, ({ message, type, duration }) => toastRef.value?.showToast(message, type, duration));
}

onMounted(() => {
    watchToast()
    fetchOrder()
});

onBeforeUnmount(() => {
    removeSubscriptions()
})


/*


const shippingStatus = computed(() => {
    const state = orderData.value?.contract_state;

    if (state === 0) {
        return "pending"
    }

    if (state === 1) {
        return "preparing the package"
    }

    if (state === 2) {
        return "package shipped"
    }

    if (state === 3) {
        return "package received"
    }

    if (state === 4) {
        return "package received"
    }

    return "-"
});

const unwatchOrder = watch(getOrderResult, value => {
    if (value) {
        setOrderData(value.getOrder);

        const ORDER = value.getOrder.order;

        orderData.value = ORDER;

        const SHIPPING = value.getOrder.shipping;

        if (SHIPPING) {
            shippingData.value = JSON.parse(Buffer.from(SHIPPING, 'base64').toString("utf-8"))

            deliveryDate.value = convertDate(shippingData.value.date, 0);
        }

        isFinished.value = ORDER.finished;

        statusLog.value = ORDER.status_log;

        orderPayment.value = getPaymentStatus(ORDER.pending_block)

        contractPrice.value = convertLovelaceToADA(ORDER.contract_price);

        pendingTx.value = ORDER.pending_tx || pendingTx.value;

        contractFiat.value = convertLovelaceToUSD(ORDER.contract_price, ORDER.ada_price)

        globalTimestamp.value = getTimestamp(ORDER);


    }
}, { immediate: true })


////////////////////////////////////////////////////////////////


const openWebsite = (website) => {
    window.open(website, '_blank');
}

/////////////////////////////////////////////

onMounted(() => {
    updateGlobalCountdown();
    globalInterval = setInterval(updateGlobalCountdown, 1000);
});

onBeforeUnmount(() => {
    unwatchOrder()
    unwatchRoute()
})

onUnmounted(() => {
    clearInterval(globalInterval);
});
*/
</script>

<style lang="css" scoped>
.OrderPage {
    background: var(--background-a);
    justify-content: center;
    display: flex;
}

.OrderPage-body {
    max-width: calc(var(--body-a) - 100px);
    box-sizing: border-box;
    min-height: 100vh;
    margin-top: 1rem;
    width: 100%;
}

.OrderPage-grid {
    grid-template-columns: 1fr 600px;
    margin-top: 1rem; 
    display: grid;
}
</style>