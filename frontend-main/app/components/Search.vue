<template>
    <div class="Search">
        <input class="search-input" v-model="searchQuery" @input="onInput" @keydown.enter.prevent="emitSearch"
            type="text" placeholder="Search products" />

        <button class="search-button flex center" @click="emitSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-search-icon lucide-search">
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
            </svg>
        </button>

        <ul class="suggestions-list" v-if="showSuggestions && suggestions.length">
            <li v-for="(item, index) in suggestions" :key="index" @click="selectSuggestion(item)"
                class="suggestion-item">
                {{ item.name }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">

const route = useRoute()
const router = useRouter()

interface ProductSuggestion {
    id: string | number
    name: string
}

const searchQuery = ref('')
const suggestions = ref<ProductSuggestion[]>([])
const showSuggestions = ref(false)

const emit = defineEmits<{
    (e: 'search', query: string): void
    (e: 'suggest', query: string): void
    (e: 'select', item: ProductSuggestion): void
}>()

let timeout: any

const onInput = () => {
    showSuggestions.value = true
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        emit('suggest', searchQuery.value)
    }, 300)
}

const emitSearch = () => {
    showSuggestions.value = false
    emit('search', searchQuery.value)

    const trimmed = searchQuery.value.trim()
    if (!trimmed) return

    router.push({
        name: 'country-s',
        query: {
            ...route.query,
            prompt: trimmed,
            vectorized: false
        } as any
    })
}

const selectSuggestion = (item: ProductSuggestion) => {
    searchQuery.value = item.name
    showSuggestions.value = false
    emit('select', item)
}
</script>

<style scoped>
.Search {
    width: 100%;
    margin: 0 auto;
    position: relative;
    color: var(--text-0);
}

.search-input {
    width: 100%;
    outline: none;
    color: currentColor;
    padding: 0.75rem 1rem;
    box-sizing: border-box;
    font-size: var(--font-size-1);
    border-radius: var(--radius-5);
    transition: var(--transition-0);
    background: var(--background-1);
    border: 1px solid var(--black-0);
}

.search-input::placeholder {
    opacity: 0.6;
}

.search-input::placeholder {
    color: currentColor;
}

.search-input:focus::placeholder {
    opacity: 0;
}

.search-button {
    color: inherit;
    transform: translateY(-50%);
    background: transparent;
    border-radius: 999px;
    position: absolute;
    cursor: pointer;
    height: inherit;
    padding: 0.5rem;
    display: flex;
    right: 0.75rem;
    border: none;
    top: 50%;
}

.suggestions-list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    border: 1px solid white;
    border-radius: 4px;
    margin-top: 5px;
    list-style: none;
    padding: 0;
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.suggestion-item {
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
}

.suggestion-item:hover {
    background: #f5f5f5;
}
</style>