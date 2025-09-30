<template>
    <ButtonSolid :label="label" :disabled="disabled" :loading="loading" @click="onClick" />
</template>

<script setup>
import { gql } from '@apollo/client/core'

const { $gatewayClient } = useNuxtApp()

const orderStore = useOrderStore()
const walletStore = useWalletStore()

const label = computed(() => `Return ${orderStore.countdown}`)

const loading = ref(false)

const disabled = computed(() => {
    if (orderStore.countdown !== '00:00') {
        return true
    }

    if (orderStore.state !== 0) {
        return true
    }

    if (loading.value === true) {
        return true
    }

    return false
})

const onClick = async () => {
    if (!import.meta.client) return;

    const RETURNED_ENDPOINT_MUTATION = gql`
      mutation($returnedEndpointVariable: ReturnedEndpointInput!) {
        returnedEndpoint(returnedEndpointInput: $returnedEndpointVariable) {
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
            mutation: RETURNED_ENDPOINT_MUTATION,
            variables: {
                returnedEndpointVariable: {
                    order_id: orderStore.order.id
                }
            },
        });

        const response = data.returnedEndpoint;

        const txHash = await walletStore.balanceTx(response.data.cbor)

        console.log(txHash)

        orderStore.showToast(`The transaction has been sent to the network. TxHash: ${txHash}`, 'success', 30_000)
        
        await sleep(30_000)
        
        loading.value = false
    } catch (err) {
        console.error('returnedEndpoint:', err);
        orderStore.showToast(err, 'error', 10_000)
        loading.value = false
    } 

}
</script>

<style lang="css" scoped></style>