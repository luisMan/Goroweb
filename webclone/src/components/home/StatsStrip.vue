<template>
  <section class="stats section-pad-sm">
    <div class="container stats-grid">
      <article
        class="stat reveal parallax-card"
        data-depth="0.03"
        v-for="(stat, index) in stats"
        :key="stat.label"
        :style="{ '--delay': `${index * 70}ms` }"
      >
        <h3>{{ stat.value }}</h3>
        <p>{{ stat.label }}</p>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
interface StatItem {
  value: string;
  label: string;
}

defineProps<{
  stats: StatItem[];
}>();
</script>
