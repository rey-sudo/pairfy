<template>
  <section class="products">
    <div class="products-header">
      <h2 class="title">Estantes para computadora</h2>
      <p class="subtitle">Recomendados para ti</p>
    </div>

    <div class="grid">
      <div class="card" v-for="(product, index) in products" :key="index">
        <img class="card-image" :src="product.image" :alt="product.name" />
        <div class="card-body">
          <h3 class="card-title">{{ product.name }}</h3>
          <div class="card-price">
            <p>{{ product.price }}</p>
            <span>15%</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const products = [
  {
    name: "NCASE M1 V5.0 Black (Angled Front) Mini ITX PC",
    price: "COP $390.166",
    image: "https://i.ebayimg.com/images/g/sXsAAOSwCwtmKq4Y/s-l500.webp",
  },
  {
    name: "NZXT H1 Mini ITX Gaming Tower Case Matte Black",
    price: "COP $629.688",
    image: "https://i.ebayimg.com/images/g/2f0AAeSwWB9oqJYS/s-l500.webp",
  },
  {
    name: "Vintage Inwin H500 Beige ATX Desktop Case",
    price: "COP $585.209",
    image: "https://i.ebayimg.com/images/g/wVQAAOSw1t9oXaBT/s-l500.webp",
  },
  {
    name: "Jonsplus i100 Pro-G Mini-ITX Gaming Case",
    price: "COP $312.132",
    image: "https://i.ebayimg.com/images/g/Kk0AAeSwyKpo2rG5/s-l500.webp",
  },
  {
    name: "Jonsplus i100 Pro-G Mini-ITX Gaming Case",
    price: "COP $312.132",
    image: "https://i.ebayimg.com/thumbs/images/g/fNUAAOSwN91njmwe/s-l960.webp",
  },
  {
    name: "Vintage Inwin H500 Beige ATX Desktop Case",
    price: "COP $585.209",
    image: "https://i.ebayimg.com/images/g/wVQAAOSw1t9oXaBT/s-l500.webp",
  },
  {
    name: "Jonsplus i100 Pro-G Mini-ITX Gaming Case",
    price: "COP $312.132",
    image: "https://i.ebayimg.com/images/g/Kk0AAeSwyKpo2rG5/s-l500.webp",
  },
  {
    name: "Jonsplus i100 Pro-G Mini-ITX Gaming Case",
    price: "COP $312.132",
    image: "https://i.ebayimg.com/thumbs/images/g/fNUAAOSwN91njmwe/s-l960.webp",
  },
  {
    name: "Vintage Inwin H500 Beige ATX Desktop Case",
    price: "COP $585.209",
    image: "https://i.ebayimg.com/images/g/wVQAAOSw1t9oXaBT/s-l500.webp",
  },
  {
    name: "Jonsplus i100 Pro-G Mini-ITX Gaming Case",
    price: "COP $312.132",
    image: "https://i.ebayimg.com/images/g/Kk0AAeSwyKpo2rG5/s-l500.webp",
  },
];
</script>

<style scoped>
.products {
}

.products-header {
  text-align: left;
  margin-bottom: 1.5rem;
}

.title {
  font-size: var(--font-size-3);
  font-weight: bold;
  margin: 0;
}

.subtitle {
  color: var(--text-1);
  font-size: var(--font-size-2);
  margin: 0.3rem 0 0;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.card {
  border: 1px solid var(--border-1);
  border-radius: var(--card-radius);
  overflow: hidden;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: var(--background-0);
  flex-direction: column;
  cursor: pointer;
  display: flex;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 260px;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: var(--font-size-2);
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.card-price {
  display: flex;
  font-weight: bold;
  align-items: center;
  font-size: var(--font-size-2);
  justify-content: space-between;
}
</style>
