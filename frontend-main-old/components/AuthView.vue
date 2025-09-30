<template>
    <div class="AuthView">

        <span class="title">
            Login
        </span>

        <div class="AuthView-icons">
            <button class="AuthView-wallet" :class="{ disabled: disableSubmit }" v-for="item in walletIcons"
                :key="item.name" type="submit" :disabled="disableSubmit" @click="connectWallet(item.name)">

                <img :src="item.src" :alt="item.name" />

                <span>{{ item.name }} </span>
            </button>

            <div class="AuthView-password">
                <InputPassword label="RSA password" v-model="password" @valid="passwordValid = $event.valid" />
            </div>

            <span class="terms">
                By logging in with your wallet, you acknowledge and accept the DApp's usage policy and confirm your
                understanding of the CIP-30 standard.
            </span>
        </div>

    </div>
</template>

<script setup>
import eternl from '@/assets/icon/eternl.png'
import lace from '@/assets/icon/lace.svg'

const config = useRuntimeConfig()

const authStore = useAuthStore()
const walletStore = useWalletStore()

const walletMap = {
    eternl,
    lace
}

const validWallets = config.public.validWallets

const walletIcons = validWallets.map(name => ({
    name,
    src: walletMap[name] ?? ''
}))

const password = ref(null)
const passwordValid = ref(false)

const disableSubmit = computed(() => !passwordValid.value)

const connectWallet = async (name) => {
    try {
        await walletStore.connect(name)

        const [signature, address] = await walletStore.sign()
        
        await authStore.login({
            signature,
            address,
            wallet_name: name,
            country: authStore.country?.toUpperCase(),
            terms_accepted: true,
            password: password.value
        })

        authStore.authDrawer = false       
        window.location.reload()
    } catch (err) {
        console.error(err);
        authStore.showToast(err.message, 'error', 10_000)
    }
}
</script>

<style lang="css" scoped>
.AuthView {
    padding: 1.25rem;
}

.AuthView-icons {
    display: flex;
    flex-direction: column;
}

.AuthView-wallet {
    padding: 1rem;
    display: flex;
    cursor: pointer;
    margin-top: 1rem;
    align-items: center;
    background: transparent;
    border-radius: var(--radius-b);
    transition: var(--transition-a);
    border: 1px solid var(--border-a);
}

.AuthView-wallet:hover {
    border: 1px solid var(--primary-a);
}

.AuthView-wallet.disabled {
    pointer-events: none;
    cursor: default;
}

.AuthView-wallet img {
    width: 1.5rem;
}

.AuthView-wallet span {
    font-size: var(--text-size-1);
    text-transform: capitalize;
    margin-left: 1rem;
    font-weight: 600;
}

.title {
    font-size: var(--text-size-3);
    font-weight: 700;
}

.terms {
    font-size: var(--text-size-0);
    color: var(--text-b);
    text-align: left;
    margin-top: 1rem;
    font-weight: 300;
}

.AuthView-password {
    margin-top: 1rem;
}
</style>