<template>
    <ToastComp ref="toastRef" />
    <SearchSection1 />
    <FooterComp />
</template>

<script setup>
import { gql } from 'graphql-tag'

useLenis()

const SEARCH_PRODUCTS_QUERY = gql`
  query SearchProducts($searchProductsVariable: SearchProductsInput!) {
    searchProducts(searchProductsInput: $searchProductsVariable) {
        id
        thumbnail_url
        name
        price
        sku
        model
        brand
        category
        bullet_list
        color
        condition_
        origin
        city
        postal
        discount
        discount_value
        discount_percent
    }
  }
`;

const route = useRoute()

const search = useSearchStore()

const toastRef = ref(null);

const { $queryClient } = useNuxtApp()

const loading = ref(true)

const searchProductsError = ref(null)

watch(
    () => route.query,
    (query) => {
        if (import.meta.client) {
            let prompt = query?.prompt;

            if (prompt) {
                searchProducts(prompt)
                search.setPrompt(prompt)
            }
        }
    }
    ,
    { immediate: true }
)

async function searchProducts(prompt) {
    try {
        let filters = {}

        if (route.query?.sku) {
            filters["sku"] = route.query?.sku
        }

        if (route.query?.priceMin) {
            filters["priceMin"] = Number(route.query?.priceMin)
        }

        if (route.query?.priceMax) {
            filters["priceMax"] = Number(route.query?.priceMax)
        }

        if (route.query?.category) {
            filters["category"] = route.query?.category
        }

        if (route.query?.brand) {
            filters["brand"] = route.query?.brand
        }

        if (route.query?.model) {
            filters["model"] = route.query?.model
        }

        if (route.query?.condition) {
            filters["condition"] = route.query?.condition
        }

        if (route.query?.discountPercentMin) {
            filters["discountPercentMin"] = Number(route.query?.discountPercentMin)
        }

        console.log(filters, "filters")

        const isVectorized = route.query?.vectorized === 'true'

        const { data } = await $queryClient.query({
            query: SEARCH_PRODUCTS_QUERY,
            variables: {
                searchProductsVariable: {
                    prompt: isVectorized ? prompt + " new" : prompt,
                    vectorized: isVectorized,
                    filters
                }
            },
            fetchPolicy: 'no-cache'
        })

        console.log(data)

        search.setResultData(data.searchProducts);
    } catch (err) {
        console.log(err)
        searchProductsError.value = err
        showGetProductError()
    } finally {
        loading.value = false
    }
}

function showGetProductError() {
    if (searchProductsError.value) displayMessage(searchProductsError.value, 'error')
}

function displayMessage(message, type, duration) {
    toastRef.value?.showToast(message, type, duration)
}

onMounted(() => {
    showGetProductError()
})

useHead({
    title: 'Pairfy - Cardano marketplace',
    meta: [
        { name: 'description', content: 'Buy and sell products on Cardano blockchain.' }
    ]
})
</script>
