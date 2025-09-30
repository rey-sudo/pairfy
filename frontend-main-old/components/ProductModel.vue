<template>
    <div class="ProductModel flex" :class="{ isCurrent }">
        <div class="icon flex">
            <img :src="getImageSrc(product.media[0].resolutions.large)" alt="">
        </div>

        <div class="body">
            <div class="model flex">
                <span>{{ model }}</span>
                <span class="divider" />
                <span class="color" :style="{ backgroundColor: color }" />
                <div class="flex" v-if="condition === 'used'">
                    <span class="divider" />
                    <span class="condition">{{ condition }}</span>
                </div>
            </div>

            <div class="price">
                <span>{{ `$${realPrice}` }}</span>
                <span class="discount">{{ discountTag }}</span>
                <span class="saved">{{ save }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { formatUSD } from '~/utils/utils'
import placeholderImage from '@/assets/icon/image.svg'

function getImageSrc(item) {
  return item ? useMediaUrl(item) : placeholderImage
}
const route = useRoute()

const product = useProductStore()

const props = defineProps({
    id: String,
    model: String,
    condition: String,
    color: String,
    price: [Number],
    discount: [Boolean],
    discountPercent: [Number],
    discountValue: [Number]
})

const model = computed(() => props.model)
const condition = computed(() => props.condition)
const color = computed(() => props.color)
const price = computed(() => props.price)
const discount = computed(() => props.discount)
const discount_percent = computed(() => props.discountPercent)
const discount_value = computed(() => props.discountValue)

const isCurrent = computed(() => props.id === route.params?.id)

const realPrice = computed(() => formatUSD(discount.value ? discount_value.value : price.value))
const discountTag = computed(() => discount.value ? `-${discount_percent.value}% Off` : '')
const save = computed(() => discount.value ? `Save $${formatUSD(price.value - discount_value.value)}` : '')
</script>


<style scoped>
.ProductModel {
    border: 1px solid var(--border-b);    
    transition: var(--transition-a);
    border-radius: var(--radius-c);
    font-size: var(--text-size-2);
    margin-bottom: 1rem;
    font-weight: 600;
    cursor: pointer;
    padding: 1rem;
}

.ProductModel:focus {
    outline: 1px solid var(--primary-a);
}

.ProductModel:hover {
    border: 1px solid var(--primary-a);
}

.ProductModel.isCurrent {
    border: 1px solid var(--primary-a);
}

.body {
    display: flex;
    flex-direction: column;
}

.color {
    border-radius: 50%;
    background: transparent;
    opacity: 0.5;
    height: 1rem;
    width: 1rem;
}

.price {
    margin-top: 0.5rem;
    font-weight: 400;
}

.icon {
    width: 2rem;
    height: 2rem;
    margin-right: 1rem;
    object-fit: contain;
}

.icon img {
    width: 100%;
}

.price span {
    margin-right: 1rem;
}

.discount,
.saved {
    font-size: var(--text-size-1);
}

.discount {
    color: var(--green-a);
    font-weight: 4300;
}

.saved {
    font-weight: 400;
}

.divider {
    width: 1px;
    height: 0.75rem;
    margin: 0 0.75rem;
    background: var(--border-a)
}

.condition {
    text-transform: capitalize;
    font-weight: 400;
}
</style>
