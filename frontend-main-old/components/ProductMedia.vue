<template>
  <div class="ProductMedia">
    <div class="ProductMedia-nav">
      <div
        v-for="(item, index) in visibleThumbnails"
        :key="'visible-' + index"
        class="ProductMedia-nav-item flex"
        :class="{ selected: selectedImageIndex === index && !modalSelectedImage }"
        @click="selectImage(index)"
        @mouseover="selectImage(index)"
        @keydown.enter="selectImage(index)"
        @keydown.space.prevent="selectImage(index)"
        role="button"
        tabindex="0"
        :aria-selected="selectedImageIndex === index"
      >
        <img :src="getImageSrc(item)" :alt="'Miniatura ' + (index + 1)" />
      </div>

      <div
        v-if="hiddenThumbnails.length"
        class="ProductMedia-nav-item flex more-thumbnail"
        @click="openDialog(0)"
        @keydown.enter="openDialog(0)"
        @keydown.space.prevent="openDialog(0)"
        role="button"
        tabindex="0"
      >
        +{{ hiddenThumbnails.length }}
      </div>
    </div>

    <!-- Image -->
    <div class="ProductMedia-image">
      <img
        :src="getImageSrc(modalSelectedImage || visibleThumbnails[selectedImageIndex])"
        alt="Imagen principal del producto"
      />

      <button
        class="btn-nav left"
        v-if="visibleThumbnails.length > 1"
        @click="prevImage"
        @keydown.enter="prevImage"
        @keydown.space.prevent="prevImage"
        role="button"
        tabindex="0"
        aria-label="Imagen anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        class="btn-nav right"
        v-if="visibleThumbnails.length > 1"
        @click="nextImage"
        @keydown.enter="nextImage"
        @keydown.space.prevent="nextImage"
        role="button"
        tabindex="0"
        aria-label="Siguiente imagen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>

    <!-- Gallery -->
    <DialogComp ref="dialogRef">
      <div class="modal-viewer" role="dialog" aria-modal="true">
        <img
          :src="getImageSrc(modalSelectedImage)"
          alt="Imagen en galería"
          class="modal-image"
        />

        <button class="btn-nav left" @click.stop="prevModalImage" @keydown.enter="prevModalImage" @keydown.space.prevent="prevModalImage" role="button" tabindex="0" aria-label="Imagen anterior">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button class="btn-nav right" @click.stop="nextModalImage" @keydown.enter="nextModalImage" @keydown.space.prevent="nextModalImage" role="button" tabindex="0" aria-label="Siguiente imagen">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
        
        <div class="modal-thumbnails">
          <div
            v-for="(item, index) in productImageList"
            :key="'modal-thumb-' + index"
            class="ProductMedia-nav-item flex"
            :class="{ selected: modalIndex === index }"
            @click.stop="selectModalImage(index)"
            @keydown.enter.stop="selectModalImage(index)"
            @keydown.space.prevent.stop="selectModalImage(index)"
            role="button"
            tabindex="0"
            :aria-selected="modalIndex === index"
          >
            <img :src="getImageSrc(item)" :alt="'Miniatura modal ' + (index + 1)" />
          </div>
        </div>
      </div>
    </DialogComp>
  </div>
</template>

<script setup>
import placeholderImage from '@/assets/icon/image.svg'
import DialogComp from '@/components/DialogComp.vue'

const productStore = useProductStore()
const media = computed(() => productStore.media)

const productImageList = computed(() =>
  media.value.map(item => item.resolutions.large)
)

const maxVisible = 5
const visibleThumbnails = computed(() =>
  productImageList.value.slice(0, maxVisible)
)
const hiddenThumbnails = computed(() =>
  productImageList.value.slice(maxVisible)
)

const selectedImageIndex = ref(0)
const modalSelectedImage = ref(null)
const modalIndex = ref(0)
const dialogRef = ref(null)

const selectImage = (index) => {
  modalSelectedImage.value = null
  selectedImageIndex.value = index
}

const prevImage = () => {
  modalSelectedImage.value = null
  const total = visibleThumbnails.value.length
  selectedImageIndex.value = (selectedImageIndex.value - 1 + total) % total
}

const nextImage = () => {
  modalSelectedImage.value = null
  const total = visibleThumbnails.value.length
  selectedImageIndex.value = (selectedImageIndex.value + 1) % total
}

const openDialog = (index) => {
  modalIndex.value = index
  modalSelectedImage.value = productImageList.value[index]
  dialogRef.value?.open?.()
}

const closeDialog = () => {
  dialogRef.value?.close?.()
  modalSelectedImage.value = null
}

const prevModalImage = () => {
  const total = productImageList.value.length
  modalIndex.value = (modalIndex.value - 1 + total) % total
  modalSelectedImage.value = productImageList.value[modalIndex.value]
}

const nextModalImage = () => {
  const total = productImageList.value.length
  modalIndex.value = (modalIndex.value + 1) % total
  modalSelectedImage.value = productImageList.value[modalIndex.value]
}

const selectModalImage = (index) => {
  modalIndex.value = index
  modalSelectedImage.value = productImageList.value[index]
}

function getImageSrc(item) {
  return item ? useMediaUrl(item) : placeholderImage
}
</script>

<style scoped>
.ProductMedia {
  border-radius: var(--radius-d);
  position: relative;
  display: flex;
}

.ProductMedia-nav {
  display: flex;
  flex-direction: column;
}

.ProductMedia-nav-item {
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: var(--transition-a);
  border-radius: var(--radius-b);
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;
  cursor: pointer;
  height: 3.5rem;
  width: 3.5rem;
  display: flex;
  align-items: center;
}

.ProductMedia-nav-item.selected {
  border: 1px solid rgba(0, 0, 0, 0.8);
}

.ProductMedia-nav-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.more-thumbnail {
  background: rgba(0, 0, 0, 0.04);
  font-weight: bold;
  justify-content: center;
  align-items: center;
}

.ProductMedia-image {
  width: 500px;
  height: 500px;
  display: flex;
  margin: 0 auto;
  position: relative;
  align-items: center;
}

.ProductMedia-image img {
  transition: opacity 0.3s ease;
  width: 100%;
}

.btn-nav {
  position: absolute;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.04);
  border-radius: 50%;
  border: none;
  top: 50%;
  width: 4rem;
  height: 4rem;
  cursor: pointer;
  z-index: 10;
  transition: var(--transition-a);
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-nav:hover {
  background: rgba(0, 0, 0, 0.08);
}

.btn-nav.left {
  left: -8rem;
}

.btn-nav.right {
  right: -8rem;
}

/* Modal */
.modal-viewer {
  background: var(--background-a);
  border-radius: var(--radius-d);
  box-sizing: border-box;
  width: 65vw;
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.modal-image {
  max-width: 100%;
  max-height: 40vh;
  object-fit: contain;
  margin-top: auto;
}

.modal-viewer .btn-nav.left {
  left: 2rem;
}

.modal-viewer .btn-nav.right {
  right: 2rem;
}

.modal-thumbnails {
  justify-content: center;
  margin-top: auto;
  flex-wrap: wrap;
  display: flex;
  gap: 1rem;
  max-width: 100%;
  overflow-x: auto;
}

.modal-thumbnails .ProductMedia-nav-item {
  height: 4rem;
  width: 4rem;
  margin-bottom: 0;
  flex: 0 0 auto;
}

@media (max-width: 480px) {
  .ProductMedia {
    display: none;
  }
}
</style>
