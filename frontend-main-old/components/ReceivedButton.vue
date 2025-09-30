<template>
    <ButtonSolid :label="label" :disabled="disabled" :loading="loading" @click="onClick" />
</template>

<script setup>
import { gql } from '@apollo/client/core'

const { $gatewayClient } = useNuxtApp()

const orderStore = useOrderStore()
const walletStore = useWalletStore()

const label = computed(() => 'Received')

const loading = ref(false)

const disabled = computed(() => {

    if (orderStore.state !== 2) {
        return true
    }

    if (loading.value === true) {
        return true
    }

    return false
})

const onClick = async () => {
    if (!import.meta.client) return;

    const RECEIVED_ENDPOINT_MUTATION = gql`
      mutation($receivedEndpointVariable: ReceivedEndpointInput!) {
        receivedEndpoint(receivedEndpointInput: $receivedEndpointVariable) {
          success
          data {
            cbor
          }
        }
      }
        
`

    try {
        loading.value = true

        const { data } = await $gatewayClient.mutate({
            mutation: RECEIVED_ENDPOINT_MUTATION,
            variables: {
                receivedEndpointVariable: {
                    order_id: orderStore.order.id
                }
            },
        });

        const response = data.receivedEndpoint;

        const txHash = await walletStore.balanceTx(response.data.cbor)

        console.log(txHash)

        orderStore.showToast(`The transaction has been sent to the network. TxHash: ${txHash}`, 'success', 30_000)
        
        await sleep(240_000)
        
        loading.value = false
    } catch (err) {
        console.error('receivedEndpoint:', err);
        orderStore.showToast(err, 'error', 10_000)
        loading.value = false
    } 

}
</script>

<style lang="css" scoped></style>