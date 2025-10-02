<template>
  <div class="card">
    <div class="card-header">
      <h3>Treasury</h3>
      <button class="btn">Add transfer <span class="plus">+</span></button>
    </div>

    <ul class="items">
      <li v-for="(item, idx) in items" :key="item.id" class="item">
        <div class="left">
          <div class="avatar" :style="{ backgroundColor: item.color }">
            <span class="symbol">{{ item.symbol }}</span>
          </div>
          <div class="meta">
            <div class="amount">{{ formatAmount(item.amount) }} {{ item.ticker }}</div>
            <div class="usd">{{ formatUSD(item.usd) }} USD</div>
          </div>
        </div>

        <div class="right">
          <div class="percent">{{ item.pct }}%</div>
          <svg class="progress" viewBox="0 0 36 36">
            <path class="bg" d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path
              class="fg"
              :stroke-dasharray="item.pct + ', 100'"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"/>
          </svg>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const items = reactive([
  { id: 1, symbol: '₮', ticker: 'USDT', amount: 24299.0, usd: 24299.0, pct: 47, color: '#e6f7ef' },
  { id: 2, symbol: 'λ', ticker: 'AZERO', amount: 68345.0, usd: 21431.0, pct: 31, color: '#eef2ff' },
  { id: 3, symbol: '◐', ticker: 'SYN', amount: 248299.0, usd: 16299.0, pct: 20, color: '#fff3e6' }
])

const formatAmount = (n) => {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

const formatUSD = (n) => {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}
</script>

<style>
/* Vanilla CSS for the treasury card */
.card {
  width: 480px;
  background: #ffffff;
  border-radius: 14px;
  padding: 18px;
  border: 1px solid var(--border-1);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  color: #0d1723;
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
  background: linear-gradient(90deg,#6b46ff,#9f7aea);
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
  background: rgba(255,255,255,0.16);
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
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px rgba(13,23,34,0.04);
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
  gap: 12px;
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
  .card { width: 100%; }
}
</style>
