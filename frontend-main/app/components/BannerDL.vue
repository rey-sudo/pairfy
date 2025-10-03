<template>
  <div class="card">
    <div class="card-header">
      <h3>Discount Liquidity</h3>
    </div>

    <ul class="items">
      <li v-for="(item, idx) in items" :key="item.id" class="item">
        <div class="left">
          <div class="avatar">
            <span class="symbol"> 
              <img src="@/assets/icons/dl.svg" alt="">
            </span>
          </div>
          <div class="meta">
            <div class="amount">
              {{ formatAmount(item.amount) }} {{ item.ticker }}
            </div>
            <div class="usd">{{ formatUSD(item.usd) }} USD</div>
          </div>
        </div>

        <div class="right">
          <CircularProgress :size="50" :percentage="63" />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const items = reactive([
  {
    id: 1,
    symbol: "₮",
    ticker: "ADA",
    amount: 24299.0,
    usd: 23299.0,
    pct: 47,
    color: "#e6f7ef",
  },
]);

const formatAmount = (n) => {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
};

const formatUSD = (n) => {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
};
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
  margin-bottom: 14px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.btn {
  background: linear-gradient(90deg, #6b46ff, #9f7aea);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn .plus {
  background: rgba(255, 255, 255, 0.16);
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
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
  padding: 12px 8px;
  border-radius: 10px;
}

.item + .item {
  margin-top: 8px;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.symbol {
  font-weight: 700;
  font-size: 18px;
}

.meta {
  display: flex;
  flex-direction: column;
}

.amount {
  font-weight: 700;
}

.usd {
  font-size: 13px;
  color: #556068;
  margin-top: 2px;
}

.right {
  display: flex;
  align-items: center;
  padding-left: 1rem;
  gap: 1rem;
}

.percent {
  font-weight: 700;
  width: 36px;
  text-align: right;
}

.progress {
  width: 36px;
  height: 36px;
}

.progress .bg {
  fill: none;
  stroke: #f1f5f9;
  stroke-width: 3.5;
}

.progress .fg {
  fill: none;
  stroke: #6b46ff;
  stroke-width: 3.5;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
}

/* small screens */
@media (max-width: 520px) {
  .card {
    width: 100%;
  }
}
</style>
