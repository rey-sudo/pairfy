<template>
  <div class="DispatchView">
    <form @submit.prevent="submitForm">

      <div class="form-group">
        <label for="date">Delivery date</label>
        <input type="datetime-local" id="date" v-model="form.dateInput" @change="convertToTimestamp" />
      </div>


      <div class="form-group">
        <label for="guide">Guide</label>
        <input type="text" id="guide" v-model="form.guide" maxlength="40" @beforeinput="onInput" />
      </div>


      <div class="form-group">
        <label for="website">Website</label>
        <input type="text" id="website" v-model="form.website" maxlength="110" @beforeinput="onInput" />
      </div>

      <div class="flex end">
        <ButtonSolid label="Submit" size="mini"  :loading="loading"/>
      </div>
    </form>
  </div>
</template>

<script setup>
import { encryptMessageWithPublicKey } from '@lovelacers/common-f'
import { gql } from '@apollo/client/core'
import { Buffer } from 'buffer';
import { z } from "zod";

const emit = defineEmits(['loading'])

const { $gatewayClient } = useNuxtApp()

const orderStore = useOrderStore()
const walletStore = useWalletStore()

const form = reactive({
  dateInput: '',
  date: null,
  guide: '',
  website: ''
})

const loading = ref(false)

watch(loading, (val) => {
  emit('loading', val)
})

const totalBytes = computed(() => {

  const metadata = {
    d: JSON.stringify(form.date),
    g: form.guide,
    w: form.website
  }

  const compressed = JSON.stringify(metadata)
  return Buffer.byteLength(compressed, "utf8") || 0
})


function onInput(event) {
  const input = event.data ?? ''
  if (!/^[\x00-\x7F]*$/.test(input)) {
    event.preventDefault()
  }
}

function convertToTimestamp() {
  const dt = new Date(form.dateInput)
  form.date = isNaN(dt.getTime()) ? null : dt.getTime()
}

const shippingSchema = z.object({
  date: z.number().int().nonnegative(),
  guide: z.string().min(1).max(40),
  website: z.string().min(1).max(110),
});

async function submitForm() {
  if (!import.meta.client) return;

  const SHIPPING_ENDPOINT_MUTATION = gql`
      mutation($shippingEndpointVariable: ShippingEndpointInput!) {
        shippingEndpoint(shippingEndpointInput: $shippingEndpointVariable) {
          success
          data {
            cbor
          }
        }
      }
        
`

  try {
    loading.value = true

    const validateParams = shippingSchema.safeParse(form);

    if (!validateParams.success) {
      throw new Error(`Invalid params ${JSON.stringify(z.treeifyError(validateParams.error))}`)
    }

    const params = validateParams.data

    const metadata = {
      v: "1.0",
      g: params.guide,
      w: params.website
    }

    const encrypted = encryptMessageWithPublicKey(orderStore.order.buyer_rsa_public_key, JSON.stringify(metadata));
    console.log("✅ Encrypted metadata: ", encrypted);

    const scheme = {
      order_id: orderStore.order.id,
      date: form.date,
      metadata: encrypted
    }

    const { data } = await $gatewayClient.mutate({
      mutation: SHIPPING_ENDPOINT_MUTATION,
      variables: {
        shippingEndpointVariable: scheme
      },
    });

    const response = data.shippingEndpoint;

    const txHash = await walletStore.balanceTx(response.data.cbor)

    console.log(txHash)

    orderStore.showToast(`The transaction has been sent to the network. TxHash: ${txHash}`, 'success', 10_000)

    await sleep(240_000)

    loading.value = false
  } catch (err) {
    console.error("shippingEndpoint:", err);
    orderStore.showToast(err, 'error', 12_000)
    loading.value = false
  }
}

</script>

<style scoped>
.DispatchView {
  width: 300px;
  padding: 1.5rem;
  padding-top: 0rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

input[type="text"],
input[type="datetime-local"],
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: var(--input-padding);
  border-radius: var(--radius-a);
  border: 1px solid var(--border-b);
}

textarea {
  resize: vertical;
}

.error {
  display: block;
  color: red;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}
</style>