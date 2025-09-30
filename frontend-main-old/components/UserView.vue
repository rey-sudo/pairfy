<template>
    <div class="UserView">
        <div class="UserView-header">
            <span>Account Info</span>
        </div>
        <div class="UserView-content">
            <div class="UserView-card">
                <div class="UserView-grid">
                    <div>User:</div>
                    <div>{{ auth.user.username }}</div>
                    <div>Country:</div>
                    <div>{{ auth.user.country }}</div>
                    <div>Wallet:</div>
                    <div class="wallet flex">
                        <img :src="walletMap[auth.user.wallet_name]" alt="">
                        <span>{{ auth.user.wallet_name }}</span>
                    </div>
                    <div>Role:</div>
                    <div>{{ auth.user.role }}</div>
                    <div>Address:</div>
                    <div class="break">{{ auth.user.address }}</div>
                    <div>PubKeyHash:</div>
                    <div class="break">{{ auth.user.pubkeyhash }}</div>
                </div>
            </div>
            <div class="UserView-button" @click="onLogout">
                Log out
            </div>
        </div>
    </div>
</template>

<script setup>
import eternl from '@/assets/icon/eternl.png'
import lace from '@/assets/icon/lace.svg'

const walletMap = {
    eternl,
    lace
}

const router = useRouter()

const auth = useAuthStore()

const onLogout = async () => {
    try {
        await auth.logout()
        window.location.reload()
    } catch (err) {
        console.error(err)
    }
}

</script>

<style scoped>
.UserView {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.UserView-header {
    display: flex;
    padding: 1rem;
    font-weight: 700;
    align-items: center;
    font-size: var(--text-size-3);
}

.UserView-content {
    overflow-y: auto;
    padding: 0 1rem;
    flex: 1;
}

.UserView-card {
    background: var(--background-b);
    border-radius: var(--radius-c);
    padding: 1rem;
}

.UserView-grid {
    grid-template-columns: 1fr 1fr;
    font-size: var(--text-size-0);
    box-sizing: border-box;
    color: var(--text-b);
    column-gap: 1rem;
    row-gap: 1rem;
    display: grid;
}

.break {
    word-break: break-all;
}

.wallet img{
    width: 2rem;
}

.wallet span {
    text-transform: capitalize;
    margin-left: 0.5rem;
}

.UserView-button {
    border-radius: var(--radius-f);
    background: var(--primary-a);
    justify-content: center;
    padding: 0.75rem 1rem;
    color: var(--text-w);
    font-weight: 600;
    margin-top: 1rem;
    cursor: pointer;
    display: flex;
}
</style>