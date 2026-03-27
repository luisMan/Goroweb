<template>
  <div class="testimonial-card reveal in-view parallax-card" data-depth="0.035">
    <button class="slider-control" @click="prev" aria-label="Previous testimonial"><</button>
    <div class="testimonial-copy">
      <p>"{{ active.quote }}"</p>
      <h4>{{ active.name }}</h4>
      <span>{{ active.role }}</span>
    </div>
    <button class="slider-control" @click="next" aria-label="Next testimonial">></button>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const props = defineProps<{
  items: Testimonial[];
}>();

const index = ref(0);
let timer: number | null = null;

const active = computed(() => props.items[index.value] ?? props.items[0]);

function next(): void {
  index.value = (index.value + 1) % props.items.length;
}

function prev(): void {
  index.value = (index.value - 1 + props.items.length) % props.items.length;
}

onMounted(() => {
  timer = window.setInterval(next, 5500);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});
</script>
