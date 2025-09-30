<template>
  <div class="ProductPanel">
    <div class="ProductPanel-brand">
      {{ productData.brand }}
    </div>

    <div class="ProductPanel-name">
      {{ productData.name }}
    </div>

    <div class="ProductPanel-sku">
      <span>SKU {{ productData.sku }}</span>
    </div>

    <div class="ProductPanel-rating">
      <RatingComp :rating="0" />
      <span>0.0</span>
      <span>(0 reviews)</span>
    </div>

    <div class="ProductPanel-price">
      <span>{{ formatUSD(productStore.price) }}</span>
      <span>USD</span>
    </div>

    <div class="subtitle">
      Model. <span>Check variations.</span>
    </div>

    <ProductModel v-for="n in 1" :key="n" :id="productData.id" :model="productData.model"
      :condition="productData.condition_" :color="productData.color" :price="productData.price"
      :discount="productData.discount" :discountPercent="productData.discount_percent"
      :discountValue="productData.discount_value" />

    <div class="subtitle">
      Finish. <span>Choose your network.</span>
    </div>

    <BuyButton @click="onCardanoClick">
      <template #icon>
        <img class="icon" src="@/assets/icon/cardano.svg" alt="">
      </template>
      Cardano Network
    </BuyButton>

    <BuyButton style="margin-top: 1rem;">
      <template #icon>
        <img class="icon" src="@/assets/icon/midnight.svg" alt="">
      </template>
      Midnight Network
    </BuyButton>

    <div class="busy-box" />
  </div>
</template>

<script setup>
const productStore = useProductStore()

const productData = computed(() => productStore.product)

const authStore = useAuthStore()

const onCardanoClick = () => {
  if (!authStore.user) {
    authStore.authDrawer = true
  } else {
    productStore.showCardanoDialog(true)
  }
}
</script>

<style lang="css" scoped>
.ProductPanel-brand {
  font-size: var(--text-size-2);
  color: var(--text-a);
  font-weight: 700;
}

.ProductPanel-name {
  font-size: var(--text-size-5);
  line-height: 2.25rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.ProductPanel-price {
  font-size: var(--text-size-6);
  font-weight: 700;
  margin-top: 2rem;
}

.ProductPanel-price span:nth-child(2) {
  margin-left: 0.5rem;
}

.ProductPanel-rating {
  display: flex;
  margin-top: 1rem;
  align-items: center;
  color: var(--text-a);
  font-size: var(--text-size-1);
}

.ProductPanel-rating span:nth-child(2) {
  margin-left: 0.25rem;
  font-weight: 700;
}

.ProductPanel-rating span:nth-child(3) {
  font-size: var(--text-size-0);
  margin-left: 0.25rem;
}

.ProductPanel-sku {
  color: var(--text-b);
  align-items: center;
  margin-top: 1rem;
  display: flex;
}

.ProductPanel-sku div {
  width: 1px;
  height: 10px;
  margin: auto 0.5rem;
  background: var(--text-b);
}

.subtitle {
  font-size: var(--text-size-3);
  margin-bottom: 2rem;
  margin-top: 2rem;
  font-weight: 600;
}

.subtitle span {
  color: var(--text-a);
}


.busy-box {
  height: 150px;
}

.icon {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
}
</style>