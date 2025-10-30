<template>
  <div
    class="circular-progress"
    :style="{ width: size + 'px', height: size + 'px' }"
    role="progressbar"
    :aria-valuenow="clamped"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <svg :width="size" :height="size" viewBox="0 0 100 100" class="cp-svg">
      <!-- track/background circle -->
      <circle
        class="cp-track"
        cx="50"
        cy="50"
        r="45"
        :stroke-width="stroke"
        fill="none"
      />

      <!-- progress indicator -->
      <circle
        class="cp-progress"
        cx="50"
        cy="50"
        r="45"
        :stroke-width="stroke"
        fill="none"
        :style="progressStyle"
      />
    </svg>

    <!-- Label centered inside the circle -->
    <div class="cp-label">
      <slot>{{ Math.round(clamped) }}%</slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  percentage: { type: Number, default: 0 },
  size: { type: Number, default: 50 },
  stroke: { type: Number, default: 6 },
  color: { type: String, default: "#3b82f6" },
  trackColor: { type: String, default: "#e6e6e6" },
  clockwise: { type: Boolean, default: true },
  transition: { type: Boolean, default: true },
});

const clamped = computed(() =>
  Math.max(0, Math.min(100, Number(props.percentage) || 0))
);

const radius = 45;
const circumference = 2 * Math.PI * radius;

const offset = computed(() => {
  // progress length
  const progress = (clamped.value / 100) * circumference;
  return circumference - progress;
});

const progressStyle = computed(() => {
  const rotation = props.clockwise ? -90 : -90 + 360;
  return {
    stroke: props.color,
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: `${offset.value}`,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: "50% 50%",
    transition: props.transition
      ? "stroke-dashoffset 600ms ease, stroke 200ms ease"
      : "none",
  };
});
</script>

<style scoped>
.circular-progress {
  display: inline-grid;
  place-items: center;
  position: relative;
  line-height: 1;
}

.cp-svg {
  display: block;
}

.cp-track {
  stroke: var(--cp-track-color, #e6e6e6);
}

.cp-progress {
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cp-label {
  inset: 0;
  display: flex;
  font-weight: 700;
  user-select: none;
  position: absolute;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-1);
}

.circular-progress {
  --cp-track-color: var(--border-0);
}
</style>
