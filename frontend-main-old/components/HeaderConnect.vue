<template>
    <button class="HeaderConnect" @click="auth.authDrawer = true">

        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-wallet-minimal-icon lucide-wallet-minimal">
            <path d="M17 14h.01" />
            <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14" />
        </svg>

        <span>Connect Wallet</span>
    </button>
</template>

<script setup>
const route = useRoute()

const auth = useAuthStore()

</script>

<style lang="css" scoped>
.HeaderConnect {
    padding: 0;
    border: none;
    outline: none;
    display: flex;
    cursor: pointer;
    font-weight: 700;
    align-items: center;
    white-space: nowrap;
    color: var(--text-w);
    background: transparent;
    overflow-wrap: break-word;
    font-size: var(--text-size-1);
    transition: var(--transition-a);
}

.HeaderConnect span {
    font-size: var(--text-size-2);
    margin-left: 0.5rem;
}
</style>


<style scoped>
@media (max-width: 480px) {
    .HeaderConnect {
        display: none;
    }
}

@media (min-width: 481px) and (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) and (max-width: 1599px) {}

@media (min-width: 1600px) {}
</style>