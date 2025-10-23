<template>
  <div class="countdown">
    <div class="boxes">
      <div class="box">
        <div class="value">{{ pad(days) }}</div>
        <div class="label">Days</div>
      </div>
      <div class="box">
        <div class="value">{{ pad(hours) }}</div>
        <div class="label">Hours</div>
      </div>
      <div class="box">
        <div class="value">{{ pad(minutes) }}</div>
        <div class="label">Minutes</div>
      </div>
      <div class="box">
        <div class="value">{{ pad(seconds) }}</div>
        <div class="label">Seconds</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const targetMs = ref(Date.now() + 13 * 24 * 60 * 60 * 1000);

const now = ref(Date.now());
let t = null;
onMounted(() => {
  t = setInterval(() => (now.value = Date.now()), 1000);
});
onUnmounted(() => clearInterval(t));

const diff = computed(() => Math.max(0, targetMs.value - now.value));
const days = computed(() => Math.floor(diff.value / 86400000));
const hours = computed(() => Math.floor((diff.value % 86400000) / 3600000));
const minutes = computed(() => Math.floor((diff.value % 3600000) / 60000));
const seconds = computed(() => Math.floor((diff.value % 60000) / 1000));
const pad = (n) => String(n).padStart(2, "0");
</script>

<style scoped>
.countdown {
  display: flex;
  justify-content: center;
  justify-content: space-around;
}

.boxes {
  gap: 1rem;
  display: flex;
  align-items: center;
}
.box {
  width: 4rem;
  height: 4rem;
  border: 1px solid var(--border-1);
  border-radius: var(--radius-3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.value {
  font-weight: 700;
  font-size: var(--font-size-2);
}
.label {
  font-size: var(--font-size-0);
  color: var(--text-1);
  margin-top: 0.25rem;
}
</style>
