<template>
  <div class="ProductPage">
    <ToastComp ref="toastRef" />

    <DialogComp v-model="product.cardanoDialog" @update:modelValue="product.cardanoDialog = $event" :modalClose="false">
      <CardanoForm />
    </DialogComp>

    <div class="ProductPage-body" v-if="productData">
      <div class="left-column">
        <ProductMedia />
        <DividerComp />
        <ProductBullet />
        <DividerComp />
        <ProductDescription />
        <DividerComp invisible />
      </div>

      <div class="center-column">
        <div class="trigger" ref="rightPanelTrigger" />
      </div>

      <div class="right-column">

        <div class="fixed-box" :class="{ fixed: isRightPanelFixed }">
          <div class="right-scroll" :class="{ fixed: isRightPanelFixed }" ref="rightScrollRef">
            <ProductPanel />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gql } from 'graphql-tag'
import { useIntersectionObserver } from '@vueuse/core'

const route = useRoute();

const product = useProductStore()
const productData = computed(() => product.product)

const { $queryClient } = useNuxtApp()

const toastRef = ref(null);

const isRightPanelFixed = ref(false)
const rightPanelTrigger = ref(null)

const rightScrollRef = ref(null)

const getProductError = ref(null)

const productId = ref(null)

let subscription1;

let pollIntervalId = null

let observer;

useLenis()
useLenisMultiple([rightScrollRef])

onMounted(() => {
  watchToast()
  observeTrigger()
  addScrollListener()
  showGetProductError()
  fetchProductPolling()
})

onBeforeUnmount(() => {
  deleteObserver()
  removeScrollListener()
  clearIntervals()
  removeSubscriptions()
})

watch(
  () => route.params.id,
  (id) => {
    productId.value = id
    fetchProduct()
  },
 { immediate: true }
)

async function fetchProduct() {

  const GET_PRODUCT_QUERY = gql`
  query GetProduct($getProductVariable: GetProductInput!) {
    getProduct(getProductInput: $getProductVariable) {
      product {
        id
        group_id
        media_group_id
        media_position
        status
        moderated
        thumbnail_url
        name
        price
        sku
        model
        brand
        description
        category
        bullet_list
        color
        condition_
        country
        origin
        city
        postal
        discount
        discount_value
        discount_percent
        created_at
      }

      media {
        id
        media_group_id
        product_id
        mime_type
        position
        alt_text
        resolutions {
          large
        }
        created_at
        updated_at
      }
    }
  }
`;

  try {
    const { data } = await $queryClient.query({
      query: GET_PRODUCT_QUERY,
      variables: {
        getProductVariable: {
          id: productId.value
        }
      },
      fetchPolicy: 'no-cache'
    })

    product.setProduct(data.getProduct)

    fetchBook()
  } catch (err) {
    getProductError.value = err
  }
}

async function fetchBook() {

  const GET_BOOK_QUERY = gql`
query ($getBookVariable: GetBookInput!){
  getBook(getBookInput: $getBookVariable) {
      success
      message
      data {
          ready_stock
      }
  }
}
`;

  const observable = $queryClient.watchQuery({
    query: GET_BOOK_QUERY,
    variables: {
      getBookVariable: {
        id: productId.value
      }
    },
    fetchPolicy: 'no-cache',
    pollInterval: 30_000,
  })

  subscription1 = observable.subscribe({
    next({ data }) {
      product.setBook(data.getBook.data)
      console.log(product.book)
    },
    error(err) {
      product.showToast(err, 'error', 10_000)
    }
  })
}

function syncScroll() {
  if (rightScrollRef.value) {
    rightScrollRef.value.scrollTop = window.scrollY
  }
}

function removeSubscriptions() {
  subscription1?.unsubscribe()
}

function watchToast() {
  watch(() => product.toastMessage, ({ message, type, duration }) => toastRef.value?.showToast(message, type, duration));
}

function observeTrigger() {
  const { stop } = useIntersectionObserver(
    rightPanelTrigger,
    ([entry]) => {
      isRightPanelFixed.value = !entry.isIntersecting
    },
    {
      threshold: 0.1
    })

  observer = stop
}

function deleteObserver() {
  if (observer) {
    observer()
    observer = null
  }
}

function fetchProductPolling() {
  pollIntervalId = setInterval(fetchProduct, 60_000)
}

function clearIntervals() {
  clearInterval(pollIntervalId)
}

function addScrollListener() {
  window.addEventListener('scroll', syncScroll)
}

function removeScrollListener() {
  window.removeEventListener('scroll', syncScroll)
}

function showGetProductError() {
  if (getProductError.value) product.showToast(getProductError.value, 'error', 10_000)
}
</script>

<style scoped>
.ProductPage {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.ProductPage-body {
  display: grid;
  width: inherit;
  margin-top: 3rem;
  box-sizing: border-box;
  max-width: var(--body-a);
  grid-template-columns: 4fr 2rem 1fr;
}

.left-column {
  width: inherit;
  box-sizing: border-box;
  border-radius: var(--radius-b);
  background: var(--background-a);
}

.center-column {
  width: inherit;
}

.right-column {
  width: 24rem;
  box-sizing: border-box;
  border-radius: var(--radius-b);
  background: var(--background-a);
}

.trigger {
  height: 1px;
  width: 100%;
}

.fixed-box {
  height: 100vh;
  width: inherit;
  z-index: 1;
  overflow: hidden;
  position: sticky;
  box-sizing: border-box;
  transform: translateY(0rem);
  transition: transform 0.6s ease-in-out;
}

.fixed-box.fixed {
  top: 0rem;
  position: fixed;
  transform: translateY(2rem);
  transition: transform 0.3s ease-in-out;
}

.right-scroll {
  height: 100%;
  padding: 1rem;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  transition: var(--transition-a);
}

.right-scroll.fixed {}

.right-scroll::-webkit-scrollbar {
  display: none;
}
</style>
