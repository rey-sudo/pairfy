<template>
  <div class="products">
    <div class="products-content">
      <div class="header">
        <div class="header-left">
          <h2 class="title">Recommended for you</h2>
          <p class="subtitle">Electronics & Devices</p>
        </div>
        <div class="header-right">
          <Button
            label="See all"
            backgroundColor="transparent"
            borderColor="var(--border-1)"
          />
        </div>
      </div>

      <div class="grid">
        <div class="card" v-for="(product, index) in products" :key="index">
          <img class="card-image" :src="product.image" :alt="product.name" />
          <div class="card-body">
            <p class="card-title">{{ product.name }}</p>
            <div class="card-price">
              <p>{{ product.price }}</p>
              <div class="card-discount">
                <span>-</span>
                <span> {{ product.discount }}%</span>
              </div>
            </div>
            <div class="card-bottom">
              <p>COP $53.420</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
  width: 100%;
  display: flex;
  justify-content: center;
}

.products-content {
  width: 100%;
  max-width: var(--body);
}

.header {
  display: flex;
  text-align: left;
  margin-bottom: 1.5rem;
  justify-content: space-between;
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
  box-shadow: var(--card-shadow);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 250px;
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
  font-weight: 400;
  align-items: center;
  color: var(--text-w);
  padding: 0.25rem 0.5rem;
  background: var(--red-0);
  font-size: var(--font-size-1);
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
