<template>
    <div class="HeaderTop flex" :class="{ home: ['country', 'index'].includes(route.name) }">
        <div class="HeaderTop-content flex">
            <div class="HeaderTop-location flex" @click="auth.locationDialog = true">
                <img :src="US" alt="">
                <span></span>
                <span>United States</span>
            </div>

            <nav class="flex">
                <span class="HeaderTop-price">Discount liquidity: 0 ADA</span>
                <span class="HeaderTop-price">Volume 24h: 23 ADA</span>

                <span class="HeaderTop-price" v-for="(price, symbol) in auth.prices" :key="symbol">
                    {{ symbol }} {{ price.toFixed(2) }}
                </span>

                <div class="HeaderTop-network flex">
                    <div class="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-arrow-down-up-icon lucide-arrow-down-up">
                            <path d="m3 16 4 4 4-4" />
                            <path d="M7 20V4" />
                            <path d="m21 8-4-4-4 4" />
                            <path d="M17 4v16" />
                        </svg>
                        <span> Cardano {{ network }}</span>
                    </div>
                </div>
            </nav>


        </div>
    </div>
</template>

<script setup>
import US from '@lovelacers/common-f/public/us.svg';

const route = useRoute()

const auth = useAuthStore()

const network = useRuntimeConfig().public.cardanoNetwork
</script>

<style lang="css" scoped>
.HeaderTop {
    font-size: var(--text-size-0);
    background: var(--blue-c);
    justify-content: center;
    box-sizing: border-box;
    color: var(--text-w);
    height: 2.5rem;
    width: 100%;
    top: 0;
}

.home {
    background: transparent;
    color: var(--text-a);
    position: initial;
}

.HeaderTop-content {
    justify-content: space-between;
    max-width: var(--body-a);
    box-sizing: border-box;
    width: inherit;
}

.HeaderTop-price,
.HeaderTop-network {
    text-transform: capitalize;
    margin-left: 2rem;
}

.HeaderTop-network svg {
    margin-right: 0.5rem;
}

.HeaderTop-location {
    cursor: pointer;
}

.HeaderTop-location img {
    height: 0.75rem;
}

.HeaderTop-location span:nth-child(2) {
    background: var(--border-b);
    height: 0.75rem;
    margin: 0 1rem;
    width: 1px;
}

@media (max-width: 480px) {
    .HeaderTop-price {
        display: none;
    }

    .HeaderTop-content {
        padding: 0 1rem;
        max-width: 100%;
    }
}


@media (min-width: 481px) and (max-width: 767px) {}


@media (min-width: 768px) and (max-width: 1024px) {}


@media (min-width: 1025px) and (max-width: 1440px) {}


@media (min-width: 1441px) {}
</style>