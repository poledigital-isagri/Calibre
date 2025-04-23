<template>
  <div class="flex items-center gap-2 h-6">
    <div class="relative w-6 h-6">
      <svg class="w-6 h-6 transform -rotate-90">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke-width="4"
          fill="none"
          class="stroke-gray-200"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke-width="4"
          fill="none"
          :stroke="circleColor"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          class="transition-all duration-300"
        />
      </svg>
    </div>
    <span>{{ current }}/{{ limit }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  current: number;
  limit: number;
}>();

const circumference = computed(() => 2 * Math.PI * 10);
const ratio = computed(() => props.current / props.limit);
const dashOffset = computed(() => 
  circumference.value * (1 - Math.min(ratio.value, 1))
);

const circleColor = computed(() => {
  const ratio = props.current / props.limit;
  if (props.current === 0) return '#aaa';
  if (ratio < 0.75) return 'green';
  if (ratio >= 0.75 && props.limit - props.current > 20) return 'orange';
  return 'red';
});
</script>
