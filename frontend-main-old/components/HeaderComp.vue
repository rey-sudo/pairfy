<template>
    <header>
        <ToastComp ref="toastRef" />

        <HeaderTop />
        <HeaderContent v-if="!['country', 'index'].includes(currentRoute)" />
        <HeaderNav v-if="!['country', 'index'].includes(currentRoute)" />

        <DialogComp v-model="auth.locationDialog" @update:modelValue="auth.locationDialog = $event" :closable="false">
            <LocationView v-if="auth.locationDialog" />
        </DialogComp>

        <DrawerComp v-model="auth.authDrawer" @update:modelValue="auth.authDrawer = $event" position="right"
            width="320px" :overlay="false">
            <AuthView v-if="auth.authDrawer" />
        </DrawerComp>

        <DrawerComp v-model="auth.userDrawer" @update:modelValue="auth.userDrawer = $event" position="right"
            width="320px" :overlay="false">
            <UserView v-if="auth.userDrawer" />
        </DrawerComp>
    </header>
</template>

<script setup>
import { gql } from 'graphql-tag'

const auth = useAuthStore()
const wallet = useWalletStore()

const { $queryClient, $notificationClient } = useNuxtApp()

const route = useRoute()
const currentRoute = computed(() => route.name)

const toastRef = ref(null);

let subscription1;
let subscription2;

const connectWallet = async () => {
    try {
        await wallet.connect(auth.walletName)
    } catch (err) {
        auth.showToast(err.message, 'error', 5_000)
    }
}

const fetchPrices = async () => {
    const GET_PRICES_QUERY = gql`
query GetPrice {
    getPrice {
        success
        message
        data {
            ADA
        }
    }
}

`;

    const observable = $queryClient.watchQuery({
        query: GET_PRICES_QUERY,
        fetchPolicy: 'no-cache',
        pollInterval: 60_000,
    })

    subscription1 = observable.subscribe({
        next({ data }) {
            const prices = {
                ADA: data.getPrice.data.ADA,
                IUSD: 1.0,
                USDM: 1.0,
                USDA: 1.0,
            }
            auth.setPrices(prices)
        },
        error(err) {
            auth.showToast(err, 'error', 10_000)
        }
    })
}

const fetchNotifications = async () => {
    if(!auth.user) return;

    const GET_NOTIFICATIONS_QUERY = gql`
query GetNotifications {
    getNotifications {
        unseen {
            id
            type
            title
            owner
            seen
            data
            message
            created_at
            updated_at
        }
        seen {
            id
            type
            title
            owner
            seen
            data
            message
            created_at
            updated_at
        }
    }
}

`;

    const observable = $notificationClient.watchQuery({
        query: GET_NOTIFICATIONS_QUERY,
        fetchPolicy: 'no-cache',
        pollInterval: 60_000,
    })

    subscription2 = observable.subscribe({
        next({ data }) {
            auth.setNotifications(data.getNotifications)
        },
        error(err) {
            auth.showToast(err, 'error', 10_000)
        }
    })
}

function watchToast() {
    watch(() => auth.toastMessage, ({ message, type, duration }) => toastRef.value?.showToast(message, type, duration));
}

onMounted(() => {
    watchToast()
    connectWallet()
    fetchPrices()
    fetchNotifications()
});

onBeforeUnmount(() => {
    subscription1?.unsubscribe()
    subscription2?.unsubscribe()
})

</script>

<style scoped>
header {
    width: 100%;
    display: flex;
    align-items: center;
    color: var(--text-a);
    flex-direction: column;
    justify-content: center;
    font-size: var(--text-size-1);
}


/* Default styles apply to all devices */

/* Small phones (up to 480px) */
@media (max-width: 480px) {}

/* Large phones and small tablets (481px - 767px) */
@media (min-width: 481px) and (max-width: 767px) {}

/* Tablets (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
    /* Styles for tablets */
}

/* Laptops and small desktops (1025px - 1440px) */
@media (min-width: 1025px) and (max-width: 1440px) {
    /* Styles for laptops */
}

/* Large desktops (1441px and up) */
@media (min-width: 1441px) {
    /* Styles for large screens */
}
</style>
