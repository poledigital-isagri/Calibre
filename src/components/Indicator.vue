<!-- Composant d'indicateur de progression -->
<!-- sdegliame@isagri.fr | 20250424091611 -->
<template>
  <div class="flex items-center gap-2 h-6">
    <div class="relative w-6 h-6">
      <svg class="w-8 h-8 transform -rotate-90">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke-width="5"
          fill="none"
          class="stroke-gray-200"
        />
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke-width="5"
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

// Les props du composant
const props = defineProps<{
  current: number;
  limit: number;
}>();

// détermination du degrès d'avancement 
const circumference = computed(() => 2 * Math.PI * 10);
const ratio = computed(() => props.current / props.limit);
const dashOffset = computed(() => 
  circumference.value * (1 - Math.min(ratio.value, 1))
);

// changement de la couleur en fonction du degrès d'avancement
const circleColor = computed(() => {
  const ratio = props.current / props.limit;
  if (props.current === 0) return '#aaa';
  if (ratio < 0.75) return 'green';
  if (ratio >= 0.75 && props.limit - props.current > 20) return 'orange';
  return 'red';
});
</script>
