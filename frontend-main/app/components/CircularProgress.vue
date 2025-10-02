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
import { computed, toRef } from 'vue'

/**
 * Props
 * - percentage: number 0..100
 * - size: px size of square container (default 96)
 * - stroke: stroke width used for both track and progress (default 8)
 * - color: stroke color for progress
 * - trackColor: background track stroke color
 * - clockwise: if true, progress increases clockwise (default true)
 * - transition: enable smooth animation (default true)
 */
const props = defineProps({
  percentage: { type: Number, default: 0 },
  size: { type: Number, default: 96 },
  stroke: { type: Number, default: 8 },
  color: { type: String, default: '#3b82f6' }, // blue-500
  trackColor: { type: String, default: '#e6e6e6' },
  clockwise: { type: Boolean, default: true },
  transition: { type: Boolean, default: true }
})

// clamp percentage to [0, 100]
const clamped = computed(() => Math.max(0, Math.min(100, Number(props.percentage) || 0)))

// SVG circle geometry: r=45 (so stroke sits inside viewBox comfortably)
const radius = 45
const circumference = 2 * Math.PI * radius

// compute stroke-dashoffset from percentage
const offset = computed(() => {
  // progress length
  const progress = (clamped.value / 100) * circumference
  // dashoffset works by subtracting progress from full circumference
  return circumference - progress
})

// style binding for the progress circle
const progressStyle = computed(() => {
  // rotate -90deg so 0% starts at 12 o'clock
  const rotation = props.clockwise ? -90 : -90 + 360
  return {
    stroke: props.color,
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: `${offset.value}`,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: '50% 50%',
    transition: props.transition ? 'stroke-dashoffset 600ms ease, stroke 200ms ease' : 'none'
  }
})
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

/* Track circle (background) */
.cp-track {
  stroke: var(--cp-track-color, #e6e6e6);
  /* Make track not be affected by stroke-dasharray */
}

/* Progress stroke: rounded linecaps for nicer visuals */
.cp-progress {
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Label centered inside the circle */
.cp-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
  color: #111827; /* gray-900 */
  user-select: none;
}

/* Make stroke colors easily overwritable via inline style on the component root */
.circular-progress {
  --cp-track-color: #e6e6e6;
}
</style>

<!--
USO
<CircularProgress :percentage="75" :size="120" :stroke="10" color="#10b981" trackColor="#f3f4f6" />

O bien (slot):
<CircularProgress :percentage="42">42 / 100</CircularProgress>

Nota: el componente usa un círculo con radio 45 en un viewBox 100x100 para simplificar el cálculo.
-->
