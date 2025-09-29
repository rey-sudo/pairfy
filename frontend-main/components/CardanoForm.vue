<template>
    <div class="CardanoForm">

        <div class="CardanoForm-body">
            <!-- Left Form -->
            <div class="CardanoForm-left">

                <div class="CardanoForm-head">
                    <img src="@/assets/icon/list.svg" alt="">
                    <div>
                        <span class="title">Purchase Order</span>
                        <span class="legend">Confirm your order and proceed to payment</span>
                    </div>
                </div>

                <!-- Steps -->
                <StepperComp :steps="['Details Shipment', 'Package Shipping']" :activeStep="0" />

                <div class="CardanoForm-section">
                    <div class="subtitle">
                        <span>Shipment Information</span>
                    </div>

                    <div class="form-group">
                        <div class="form-item">

                            <InputSelect v-model="orderUnits" :options="orderUnitOptions" label="Quantity"
                                @valid="orderUnitsValid = $event.valid" id="order-units-select" placeholder="Quantity">
                                <template #option="{ option }">
                                    <span class="flex">
                                        <span>{{ option.label }}</span>
                                    </span>
                                </template>
                            </InputSelect>
                        </div>

                        <div class="form-item">
                            <InputSelect v-model="orderAsset" :options="orderAssetOptions" label="Payment in"
                                @valid="orderAssetValid = $event.valid" id="order-payment-select" placeholder="Assets">
                                <template #option="{ option }">
                                    <span class="flex">
                                        <span>{{ option.label }}</span>
                                    </span>
                                </template>
                            </InputSelect>
                        </div>
                    </div>

                    <div class="form-item">
                        <InputName v-model="orderName" @valid="orderNameValid = $event.valid" label="Receiver Alias" />
                    </div>
                </div>

                <div class="CardanoForm-section">
                    <div class="subtitle flex">
                        <span> Encrypt destination (RSA-256)
                        </span>
                    </div>

                    <div class="form-item">
                        <InputDestination v-model="orderDestination" @valid="orderDestinationValid = $event.valid" />
                    </div>

                    <div class="form-item">
                        <InputOutput v-model="encryptedMessage" />
                    </div>
                </div>

                <div class="CardanoForm-section">
                    <div class="subtitle">
                        Shipment preference
                    </div>
                    <div class="form-item">
                        <InputButtonGrid v-model="orderProvider" />
                    </div>
                </div>

            </div>
            <!-- Right Panel -->
            <div class="CardanoForm-right">
                <div class="CardanoForm-summary">
                    <div class="subtitle">
                        <span>Other information</span>
                    </div>

                    <div class="summary-top">
                        <label for="delivery-date">Delivery date</label>
                        <p id="delivery-date">{{ store.date }}</p>

                        <label for="receiver">Receiver alias</label>
                        <p id="receiver">{{ store.orderName }}</p>

                        <label for="destination">Destination</label>
                        <p id="destination">{{ store.orderDestination }}</p>

                        <label for="payment">Payment in</label>
                        <p id="payment">{{ store.orderAsset }}</p>

                        <DividerComp margin="1rem 0" />

                        <label for="note">Note</label>

                        <p class="note" id="note">
                            All purchases are covered by a guarantee in case of non-delivery or different
                            specifications.
                            However, you should review the specifications before paying.
                        </p>

                        <DividerComp margin="1rem 0" />
                    </div>
                </div>


                <div class="summary-bottom">
                    <div>
                        <span class="label">Subtotal:</span>
                        <span class="value">{{ quoteTotal }}</span>
                    </div>
                    <div>
                        <span class="label">Total Qty:</span>
                        <span class="value">{{ totalUnits }}</span>
                    </div>
                    <div>
                        <span class="label">Fee:</span>
                        <span class="value">0.25</span>
                    </div>

                    <DividerComp margin="1rem 0" />

                    <div class="total">
                        <span class="label">Total:</span>
                        <span class="value">{{ baseTotal }}</span>
                    </div>
                </div>

            </div>
        </div>

        <div class="CardanoForm-actions">
            <a class="link flex" href="https://x.com/home" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-info-icon lucide-info">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                </svg>
                <span> Learn how local encryption works.</span>
            </a>
            <ButtonSolid @click="product.cardanoDialog = false" label="Cancel" size="mini" outlined />
            <ButtonSolid @click="onSubmit" :loading="loading" label="Next" size="mini" />
        </div>
    </div>
</template>

<script setup>
import { gql } from 'graphql-tag'
import { encryptMessageWithPublicKey, compress, chunkMetadata } from '@lovelacers/common-f'
import { formatUSD, timestampToDate } from '@/utils/utils'

const route = useRoute()
const router = useRouter()

const auth = useAuthStore()
const product = useProductStore()
const wallet = useWalletStore()

const { $gatewayClient } = useNuxtApp()

const loading = ref(false)

const availableUnits = computed(() => product.book?.ready_stock || 0)
const orderFee = ref(0.25)

const orderUnits = ref(null);
const orderUnitsValid = ref(false)
const orderUnitOptions = computed(() => {
    return Array.from({ length: availableUnits.value }, (_, i) => ({
        label: String(i + 1),
        value: String(i + 1)
    }))
})


const orderAsset = ref(null)
const orderAssetValid = ref(false)
const orderAssetOptions = computed(() => [
    { label: 'ADA', value: 'ADA' }
])

const orderName = ref(null)
const orderNameValid = ref(false)

const orderDestination = ref(null)
const orderDestinationValid = ref(false)

const orderProvider = ref(null)

const encryptedMessage = ref(null)

const store = computed(() => {
    return {
        date: timestampToDate(Date.now() + 7 * 24 * 60 * 60 * 1000),
        orderName: orderName.value || 'Julian Blake',
        orderDestination: orderDestination.value || '1234 Brickell Avenue, Suite 500, Miami, FL 33131',
        orderAsset: orderAsset.value || 'N/A'
    }
})

const quoteTotal = computed(() => {
    const value = product.price * orderUnits.value || 0

    return '$' + formatUSD(value)
})

const totalUnits = computed(() => orderUnits.value || 0)

const baseTotal = computed(() => {
    const tag = orderAsset.value

    const units = orderUnits.value

    const unitPrice = product.price

    if (!tag || !units || !unitPrice) return 0


    const totalQuote = unitPrice * units || 0

    const basePrice = auth.prices[tag]

    const result = totalQuote / basePrice + orderFee.value

    const formated = result.toFixed(2) + ' ' + tag

    return formated
})

const createOrder = async () => {
    if (!import.meta.client) return;

    const PENDING_ENDPOINT_MUTATION = gql`
mutation PendingEndpoint($pendingEndpointVariable: PendingEndpointInput!) {
    pendingEndpoint(pendingEndpointInput: $pendingEndpointVariable) {
       success
       message
       data {
        order
        cbor
        seller_rsa_public_key
       }
    }
}
`
    try {
        loading.value = true

        const { data } = await $gatewayClient.mutate({
            mutation: PENDING_ENDPOINT_MUTATION,
            variables: {
                "pendingEndpointVariable": {
                    "product_id": route.params.id,
                    "order_units": parseInt(orderUnits.value),
                    "asset": orderAsset.value
                }
            },
        });

        product.showToast(data.pendingEndpoint.message, 'success', 10_000)

        return data.pendingEndpoint.data
    } catch (err) {
        console.error('pendingEndpoint:', err);
        product.showToast(err, 'error', 10_000)
    } finally {
        loading.value = false
    }
}

const isValidParams = () => {
    const values = [orderUnitsValid.value, orderAssetValid.value, orderNameValid.value, orderDestinationValid.value]

    console.log(values)

    return !values.includes(false)
}

const onSubmit = async () => {
    try {
        if (!isValidParams()) {
            product.showToast('Please check the mandatory parameters.', 'error', 10_000)
            return;
        }

        const { order, seller_rsa_public_key, cbor } = await createOrder()

        const privateMetadata = {
            v: "1.0",
            r: orderName.value,
            d: orderDestination.value,
            p: orderProvider.value
        };

        const encrypted = encryptMessageWithPublicKey(seller_rsa_public_key, JSON.stringify(privateMetadata));

        console.log("✅Encrypted destination: ", encrypted);

        encryptedMessage.value = encrypted;

        const scheme = {
           public: {},
           private: encrypted
        }

        const metadata = chunkMetadata(JSON.stringify(scheme), 64)

        const txHash = await wallet.balanceTx(cbor, metadata)
        console.log(txHash)

        product.showToast(`The transaction has been sent to the network. TxHash: ${txHash}`, 'success', 10_000)

        router.push({
            name: 'country-o-id',
            params: {
                id: order
            },
            query: {
                tx: txHash
            }
        })

    } catch (err) {
        product.showToast(err, 'error', 10_000)
    }
}


</script>

<style scoped>
.CardanoForm {
    flex-direction: column;
    box-sizing: border-box;
    padding: 1.5rem;
    padding-bottom: 0;
    min-width: 300px;
    max-width: 50vw;
    padding-top: 0;
    display: flex;
    gap: 1rem;
}

.CardanoForm-head {
    display: flex;
    align-items: center;
}

.CardanoForm-head div {
    display: flex;
    margin-left: 0.5rem;
    flex-direction: column;
}

.CardanoForm-head .title {
    font-size: var(--text-size-4);
    font-weight: 700;
}

.form-group {}

.legend {
    font-size: var(--text-size-1);
    color: var(--text-b);
    margin-top: 0.25rem;
}


.subtitle {
    font-size: var(--text-size-2);
    font-weight: 700;
}

.link {
    font-size: var(--text-size-0);
    text-decoration: none;
    color: var(--text-b);
    margin-left: 0.5rem;
    font-weight: 400;
}

.link span {
    margin-left: 0.5rem;
}

.CardanoForm-body {
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    gap: 1.5rem;
}

.CardanoForm-left {
    flex: 2;
    gap: 1rem;
    display: flex;
    flex-direction: column;
}

.form-group {
    display: flex;
    gap: 1rem;
}

.form-item {
    flex-direction: column;
    margin-top: 1rem;
    display: flex;
    flex: 1;
}

.form-item label {
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: var(--text-size-0);
}

textarea,
input,
select {
    padding: 8px;
    border-radius: 6px;
    border: 1px solid var(--border-b);
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    background: var(--background-b);
}

.link-btn {
    background: none;
    border: none;
    color: var(--primary-a);
    font-size: 13px;
    cursor: pointer;
    margin-top: 4px;
    align-self: flex-start;
}

.CardanoForm-right {
    flex: 1;
    display: flex;
    overflow: hidden;
    min-width: 300px;
    flex-direction: column;
    font-size: var(--text-size-1);
    border-radius: var(--radius-c);
    background: var(--background-b);
    border: 1px solid var(--border-a);
}

.CardanoForm-summary {
    word-break: break-word;
    padding: 1.5rem;
}

.CardanoForm-actions {
    justify-content: flex-end;
    padding-bottom: 1rem;
    align-items: center;
    display: flex;
    gap: 1rem;
}

.summary-top {
    margin-top: 1rem;
}

.summary-top label {
    font-size: var(--text-size-0);
    color: var(--text-a);
    font-weight: 600;
}

.summary-top p {
    line-height: 2rem;
    color: var(--text-b);
    font-weight: 400;
    margin: 0.5rem 0;
}

.summary-bottom {
    box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.05);
    border-top-right-radius: var(--radius-d);
    border-top-left-radius: var(--radius-d);
    background: var(--background-a);
    margin-top: auto;
    padding: 1.5rem;
}

.note {
    font-size: var(--text-size-0);
    line-height: 1.25rem !important;
    color: var(--text-b);
    text-align: justify;
    font-weight: 400;
    display: flex;
    width: 100%;
}

.summary-bottom div {
    display: flex;
    padding: 0.5rem 0;
    justify-content: space-between;
}

.summary-bottom .label {
    font-weight: 500;
}

.summary-bottom .value {
    font-weight: 600;
}

.summary-bottom .total {
    font-weight: 700;
}
</style>