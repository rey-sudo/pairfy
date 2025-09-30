<template>
    <div class="ProductBullet">
        <h2 class="title">All about this item</h2>
        <ul class="bullet-list">
            <li class="bullet-item" v-for="(item, index) in bullets" :key="index">
                <span class="checkmark">•</span>
                <span class="text">{{ item }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup>
const productStore = useProductStore()

const product = computed(() => productStore.product)

const bullets = computed(() => product.value.bullet_list)
</script>

<style scoped>
.ProductBullet {
    border-radius: var(--radius-d);
    background: var(--background-b);
    color: var(--text-a);
    padding: 1.5rem;
}

.title {
    font-size: var(--text-size-2);
    margin-bottom: 16px;
    font-weight: 700;
}

.bullet-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.bullet-item {
    display: flex;
    margin-bottom: 1rem;
    align-items: flex-start;
}

.checkmark {
    color: var(--text-a);
    margin-right: 0.5rem;
    font-weight: bold;
}

.text {
    font-size: var(--text-size-1);
    line-height: 1.5;
}
</style>