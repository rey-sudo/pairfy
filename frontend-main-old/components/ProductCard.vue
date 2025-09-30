<template>
    <div class="ProductCard" :style="{ animationDelay: `${index * 100}ms` }" @click="onSelect(data.id)">
        <div class="ProductCard-image">
            <LoadingComp v-if="loading" :size="32" :borderWidth="3" />
            <img v-show="!loading" :src="getImageSrc(data.thumbnail_url)" :alt="data.name" @load="loading = false" />
        </div>

        <div class="ProductCard-body">

            <div class="ProductCard-title">
                <span>{{ `${data.brand} -` }}</span>
                <span>{{ `${truncateByWords(data.name, 15)}...` }}</span>
            </div>

            <div class="ProductCard-rating">
                <RatingComp :rating="0" />
                <span>(0)</span>
            </div>

            <div class="ProductCard-price">
                <small>$</small>
                <span>{{ realPrice }}</span>

                <span class="last-price">{{ `$${formatUSD(price)}` }}</span>
            </div>

            <div class="ProductCard-discount" v-if="discount">
                <span>{{ `-${discount_percent}% deal` }}</span>
                <span>{{ save }}</span>
            </div>

        </div>
    </div>
</template>

<script setup>
import placeholderImage from '@/assets/icon/image.svg'
import { truncateByWords, formatUSD } from '~/utils/utils'

const props = defineProps({
    data: Object,
    index: Number
})

const loading = ref(true)
const router = useRouter()
const route = useRoute()

const onSelect = (id) => {
    router.push({
        name: 'country-p-id',
        params: { ...route.params, id }
    })
}

const price = computed(() => props.data.price)
const discount = computed(() => props.data.discount)
const discount_percent = computed(() => props.data.discount_percent)
const discount_value = computed(() => props.data.discount_value)

const realPrice = computed(() => formatUSD(discount.value ? discount_value.value : price.value))

const save = computed(() => discount.value ? `Save ${formatUSD(price.value - discount_value.value)} USD` : '')

function getImageSrc(item) {
    return item ? useMediaUrl(item) : placeholderImage
}
</script>

<style scoped>
.ProductCard {
    gap: 1rem;
    opacity: 0;
    width: 100%;
    height: 100%;
    display: flex;
    cursor: pointer;
    overflow: hidden;
    align-items: center;
    box-sizing: border-box;
    flex-direction: column;
    transform: translateY(20px);
    border-radius: var(--radius-b);
    justify-content: space-between;
    background: var(--background-a);
    transition: box-shadow 0.3s ease;
    animation: fadeInUp 0.5s forwards;
    border: 1px solid var(--border-a);
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.ProductCard:hover {
    box-shadow: var(--shadow-e)
}

.ProductCard-image {
    width: 100%;
    display: flex;
    overflow: hidden;
    position: relative;
    aspect-ratio: 4 / 3;
    justify-content: center;
}

.ProductCard-image img {
    width: 95%;
    height: 95%;
    object-fit: contain;
}

.ProductCard-body {
    padding: 1rem;
    display: flex;
    padding-top: 0;
    width: inherit;
    flex-direction: column;
    box-sizing: border-box;
    font-size: var(--text-size-1);
}

.ProductCard-title {
    height: 82px;
    font-weight: 400;
    line-height: 1.5;
    overflow: hidden;
    color: var(--text-a);
    word-break: break-word;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    font-size: var(--text-size-1);
}

.ProductCard-title span:nth-child(1) {
    margin-right: 0.5rem;
    font-weight: 600;
}

.ProductCard-price {
    display: flex;
    align-items: center;
    font-weight: 500;
    margin-top: 0.5rem;
    font-size: var(--text-size-5);
}

.ProductCard-price small {
    font-size: var(--text-size-0);
    margin-right: 2px;
    margin-bottom: 8px;
}

.ProductCard-rating {
    display: flex;
    align-items: center;
    font-size: var(--text-size-1);
    margin-top: 0.5rem;
}

.ProductCard-rating span {
    font-size: var(--text-size-0);
    color: var(--text-b);
    margin-left: 0.25rem;
    line-height: normal;
    font-weight: 400;
}

.last-price {
    font-size: var(--text-size-0);
    text-decoration: line-through;
    color: var(--text-b);
    margin-left: 0.5rem;
}

.ProductCard-discount {
    font-size: var(--text-size-2);
    color: var(--green-a);
    margin-top: 0.5rem;
}

.ProductCard-discount span:nth-child(2) {
    font-size: var(--text-size-0);
    color: var(--text-b);
    margin-left: 0.5rem;
}
</style>