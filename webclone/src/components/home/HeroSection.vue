<template>
  <section class="hero section-pad">
    <div class="container hero-grid">
      <div class="hero-copy reveal in-view">
        <p class="eyebrow">Performance nutrition for modern routines</p>
        <p class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p class="hero-subtext">{{ subtext }}</p>
        <div class="hero-cta">
          <RouterLink to="/collections/all" class="btn btn-primary">{{ primaryCtaLabel }}</RouterLink>
          <RouterLink to="/blog" class="btn btn-ghost">{{ secondaryCtaLabel }}</RouterLink>
        </div>
      </div>

      <div class="hero-visual reveal in-view">
        <div class="orb orb-a"></div>
        <div class="orb orb-b"></div>
        <div class="hero-card">
          <div class="product-can"></div>
          <div class="hero-card-content">
            <p class="hero-card-label">{{ cardLabel }}</p>
            <h3>{{ cardTitle }}</h3>
            <p>{{ cardText }}</p>
            <strong>{{ featuredPrice }}</strong>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

defineProps<{
  eyebrow: string;
  title: string;
  subtext: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  cardLabel: string;
  cardTitle: string;
  cardText: string;
  featuredPrice: string;
}>();
</script>
