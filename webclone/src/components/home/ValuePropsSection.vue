<template>
  <section class="value-props section-pad">
    <div class="container">
      <SectionHeader :eyebrow="eyebrow" :title="title" />
      <div class="props-grid">
        <article
          class="prop reveal parallax-card"
          data-depth="0.05"
          v-for="(item, index) in items"
          :key="item.title"
          :style="{ '--delay': `${index * 80}ms` }"
        >
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionHeader from "../common/SectionHeader.vue";

interface ValueProp {
  title: string;
  text: string;
}

defineProps<{
  eyebrow: string;
  title: string;
  items: ValueProp[];
}>();
</script>
