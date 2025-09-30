<template>
  <div class="OrderProduct">

    <div class="OrderProduct-image">
      <img :src="getImageSrc(product.thumbnail_url)" :alt="product.name" />
    </div>

    <div class="OrderProduct-body">

      <h2 class="name">{{ product.name }}</h2>
      <p class="model">{{ product.brand }} • Model: {{ product.model }}</p>


      <div class="product-pricing">
        <div class="price-section">
          <span class="price-final">${{ discountedPrice }}</span>

          <span class="price-original" v-if="product.discount">
            ${{ formatUSD(product.price) }}
          </span>
        </div>

        <div class="discount-label" v-if="product.discount">
          <span class="label">Discount applied</span>
          <span class="badge">{{ product.discount_percent }}% OFF</span>
        </div>
      </div>

      <ul class="features">
        <li v-for="(feature, index) in product.bullet_list" :key="index">
          {{ feature }}
        </li>
      </ul>

    </div>
  </div>
</template>

<script setup>
import placeholderImage from '@/assets/icon/image.svg'

const orderStore = useOrderStore()
const product = computed(() => orderStore.product)

const discountedPrice = computed(() =>
  product.value.discount ? product.value.discount_value : product.value.price
)

function getImageSrc(src) {
  return src ? useMediaUrl(src) : placeholderImage
}
</script>

<style scoped>
.OrderProduct {
  gap: 2rem;
  display: flex;
  padding: 1.5rem;
  flex-direction: column;
  border-radius: var(--radius-c);
  border: 1px solid var(--border-a);
}

@media (min-width: 768px) {
  .OrderProduct {
    flex-direction: row;
    align-items: flex-start;
  }
}

.OrderProduct-image {
  background-color: var(--background-b);
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.OrderProduct-image img {
  width: 100%;
  max-width: 260px;
  border-radius: 10px;
  object-fit: cover;
}

.OrderProduct-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.name {
  font-size: var(--text-size-5);
  line-height: 2.25rem;
  margin-bottom: 0;
  font-weight: 600;
}

.model {
  font-size: var(--text-size-2);
  color: var(--text-b);
  margin-bottom: 1rem;
}

.features {
  font-size: var(--text-size-2);
  list-style: disc inside;
  margin-bottom: 1.5rem;
  color: var(--text-b);
  padding-left: 1rem;
  line-height: 1.5;
}

.features li{
  margin-bottom: 0.25rem;
}

.product-pricing {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.price-final {
  font-size: var(--text-size-5);
  font-weight: 700;
}

.price-original {
  color: var(--text-b);
  font-size: var(--text-size-2);
  text-decoration: line-through;
}

.discount-label {
  gap: 0.5rem;
  display: flex;
  align-items: center;
  color: var(--red-a);
  padding: 0.4rem 0.75rem;
  font-size: var(--text-size-2);
  background: rgb(239 68 68 / 10%);
  border-radius: var(--radius-a);
  width: fit-content;
}

.discount-label .label {
  font-weight: 500;
}

.discount-label .badge {
  font-weight: 700;
}
</style>