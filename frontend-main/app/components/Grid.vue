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
          <p class="card-title">{{ product.name }}</p>
          <div class="card-price">
            <p>{{ product.price }}</p>
            <div class="card-discount">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-arrow-big-down-icon lucide-arrow-big-down"
              >
                <path
                  d="M15 11a1 1 0 0 0 1 1h2.939a1 1 0 0 1 .75 1.811l-6.835 6.836a1.207 1.207 0 0 1-1.707 0L4.31 13.81a1 1 0 0 1 .75-1.811H8a1 1 0 0 0 1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1z"
                />
              </svg>
              <span> {{ product.discount }}%</span>
            </div>
          </div>
          <div class="card-bottom">
            <p>COP $53.420</p>
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
    discount: 10,
  },
  {
    name: "NZXT H1 Mini ITX Gaming Tower Case Matte Black",
    price: "COP $629.688",
    image: "https://i.ebayimg.com/images/g/2f0AAeSwWB9oqJYS/s-l500.webp",
    discount: 13,
  },
  {
    name: "Vintage Inwin H500 Beige ATX Desktop Case",
    price: "COP $585.209",
    image: "https://i.ebayimg.com/images/g/wVQAAOSw1t9oXaBT/s-l500.webp",
    discount: 15,
  },
  {
    name: "Jonsplus i100 Pro-G Mini-ITX Gaming Case",
    price: "COP $312.132",
    image: "https://i.ebayimg.com/images/g/Kk0AAeSwyKpo2rG5/s-l500.webp",
    discount: 17,
  },
  {
    name: "Jonsplus i100 Pro-G Mini-ITX Gaming Case",
    price: "COP $312.132",
    image: "https://i.ebayimg.com/thumbs/images/g/fNUAAOSwN91njmwe/s-l960.webp",
    discount: 14,
  },
  {
    name: "Vintage Inwin H500 Beige ATX Desktop Case",
    price: "COP $585.209",
    image: "https://i.ebayimg.com/images/g/wVQAAOSw1t9oXaBT/s-l500.webp",
    discount: 12,
  },
  {
    name: "Jonsplus i100 Pro-G Mini-ITX Gaming Case",
    price: "COP $312.132",
    image: "https://i.ebayimg.com/images/g/Kk0AAeSwyKpo2rG5/s-l500.webp",
    discount: 20,
  },
  {
    name: "Jonsplus i100 Pro-G Mini-ITX Gaming Case",
    price: "COP $312.132",
    image: "https://i.ebayimg.com/thumbs/images/g/fNUAAOSwN91njmwe/s-l960.webp",
    discount: 14,
  },
  {
    name: "Vintage Inwin H500 Beige ATX Desktop Case",
    price: "COP $585.209",
    image: "https://i.ebayimg.com/images/g/wVQAAOSw1t9oXaBT/s-l500.webp",
    discount: 16,
  },
  {
    name: "Jonsplus i100 Pro-G Mini-ITX Gaming Case",
    price: "COP $312.132",
    image: "https://i.ebayimg.com/images/g/Kk0AAeSwyKpo2rG5/s-l500.webp",
    discount: 19,
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
  margin: 0;
  font-weight: 400;
}

.card-price {
  display: flex;
  margin-top: 1rem;
  font-weight: 700;
  align-items: center;
  font-size: var(--font-size-2);
  justify-content: space-between;
}

.card-price p {
  margin: 0;
}

.card-discount {
  display: flex;
  font-weight: 500;
  align-items: center;
  color: var(--green-0);
}

.card-bottom {
  margin-top: 0.5rem;
}

.card-bottom p {
  margin: 0;
  color: var(--text-1);
  text-decoration: line-through;
  font-size: var(--font-size-1);
}
</style>
