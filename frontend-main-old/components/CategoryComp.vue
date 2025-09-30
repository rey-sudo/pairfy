<template>

    <div class="CategoryComp">
        <div class="p-category">

            <div class="category-grid">
                <div class="grid">
                    <div class="grid-item" v-for="category in categories" :key="category.index"
                        @click="goToCategory(category)" @mouseover="showModal(category.index)" @mouseleave="hideModal">
                        <div class="name flex">
                            {{ category.label }}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
 
<script setup>
import categoryList from '@/assets/json/categories.json';

const router = useRouter()

const categories = ref(categoryList)

const activeIndex = ref(0);

function goToCategory(category) {
    router.push({ name: 'search', query: { k: category.name.toLowerCase() } })
}

function showModal(index) {
    activeIndex.value = index;
};

function hideModal() {
    activeIndex.value = null;
}
</script>

<style scoped>
.CategoryComp{
    display: flex;
    justify-content: center;
    width: inherit;
}
.p-category {
    width: 100%;
    box-sizing: border-box;
    max-width: var(--body-a);
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1rem;
}

.grid-item {
    border: 1px solid var(--border-a);
    transition: box-shadow 0.2s ease;
    background: var(--background-a);
    border-radius: var(--radius-c);
    position: relative;
    text-align: center;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    box-sizing: border-box;
}

.grid-item:hover {
    box-shadow: var(--shadow-a);
}

.icon {
    width: 100%;
    object-fit: contain;
}

.name {
    font-size: var(--text-size-2);
    color: var(--primary-a);
    justify-content: center;
    text-align: center;
    font-weight: 400;
    font-size: 1rem;
    padding: 1rem;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.category-title {
    font-size: var(--text-size-5);
    font-weight: 700;
    margin: 2rem 0;
}
</style>