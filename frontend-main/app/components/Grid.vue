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
          <p class="card-price">{{ product.price }}</p>
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
];
</script>

<style scoped>
.products {
  padding: 1.5rem;
  margin: 0 auto;
}

.products-header {
  text-align: left;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0.3rem 0 0;
}

.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.card {
  border: 1px solid #eee;
  border-radius: var(--card-radius);
  overflow: hidden;
  box-sizing: border-box;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.card-price {
  color: #222;
  font-weight: bold;
}
</style>
