<template>
  <div class="section-head reveal">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
}>();
</script>

