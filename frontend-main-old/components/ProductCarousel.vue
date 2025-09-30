<template>
  <div class="carousel-wrapper">
    <div class="container">
      <h2 class="carousel-title">{{ title }}</h2>

      <div class="carousel-container"> 
        <button class="nav left flex center" @click="scrollLeft">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        <div class="carousel" ref="carousel">
          <div class="carousel-item" v-for="(image, index) in images" :key="index">
            <img :src="image" alt="Product" />
          </div>
        </div>

        <button class="nav right flex center" @click="scrollRight">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  title?: string
}>()

const images = [

]

const carousel = ref<HTMLElement | null>(null)

const scrollLeft = () => {
  carousel.value?.scrollBy({ left: -600, behavior: 'smooth' })
}

const scrollRight = () => {
  carousel.value?.scrollBy({ left: 600, behavior: 'smooth' })
}
</script>

<style scoped>
.carousel-wrapper {
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  box-sizing: border-box;
  max-width: var(--body-a);
  background: var(--background-a);
  border-radius: var(--radius-b);
}

.carousel-title {
  font-size: var(--text-size-4);
  margin-bottom: 2rem;
  font-weight: 700;
  margin-top: 0;
}

.carousel-container {
  position: relative;
  overflow: hidden;
  width: 100%;
}

.carousel {
  gap: 1rem;
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 auto;
  width: 150px;
  height: 150px;
  padding: 1rem;
  overflow: hidden;
  border-radius: var(--radius-c);
  background: var(--background-a);
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.nav {
  top: 50%;
  z-index: 10;
  border: none;
  width: 3rem;
  height: 3rem;
  cursor: pointer;
  position: absolute;
  border-radius: 50%;
  padding: 0.2rem 0.5rem;
  box-shadow: var(--shadow-b);
  transform: translateY(-50%);
  transition: var(--transition-a);
  background: rgba(255, 255, 255, 80%);
}

.nav:hover{
  background: rgba(255, 255, 255, 100%);
}

.nav.left {
  left: 0;
}

.nav.right {
  right: 0;
}
</style>
