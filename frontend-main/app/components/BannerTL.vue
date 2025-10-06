<template>
  <div class="card">
    <div class="card-header">
      <p>Treasury</p>
    </div>

    <ul class="items">
      <li class="item" v-for="(item, idx) in items" :key="item.id">
        <div class="left">
          <div class="avatar">
            <img src="@/assets/icons/cardano.png" alt="" />
          </div>
          <div class="meta">
            <div class="amount">
              {{ formatADA(item.amount) }} {{ item.ticker }}
            </div>
            <div class="usd">{{ formatUSD(item.usd) }} USD</div>
          </div>
        </div>

        <div class="right">
          <CircularProgress
            :size="55"
            :percentage="30"
            color="var(--primary-1)"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { formatADA, formatUSD } from "@/utils/format";

const items = reactive([
  {
    id: 1,
    symbol: "₮",
    ticker: "ADA",
    amount: 152910.0,
    usd: 125200.0,
    pct: 47,
    color: "#e6f7ef",
  },
]);
</script>

<style scoped>
.card {
  border-radius: var(--card-radius);
  border: 1px solid var(--border-1);
  padding: 1rem;
  width: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header p {
  margin: 0;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: var(--font-size-2);
}

.items {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
}

.left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.meta {
  display: flex;
  flex-direction: column;
}

.amount {
  font-weight: 700;
  font-size: var(--font-size-2);
}

.usd {
  font-size: var(--font-size-1);
  color: var(--text-1);
  margin-top: 0.25rem;
}

.right {
  display: flex;
  align-items: center;
  padding-left: 1rem;
  gap: 1rem;
}

/* small screens */
@media (max-width: 520px) {
  .card {
    width: 100%;
  }
}
</style>
