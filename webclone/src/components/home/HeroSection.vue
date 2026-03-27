<template>
  <section class="hero section-pad">
    <div class="container hero-grid">
      <div class="hero-copy reveal in-view">
        <p class="eyebrow">Performance nutrition for modern routines</p>
        <h1>Plant-powered formulas with clean ingredients and serious results.</h1>
        <p class="hero-subtext">
          Built with Vue + Vite + Router, a catalog-driven storefront layer, and Mercado Pago checkout.
        </p>
        <div class="hero-cta">
          <RouterLink to="/collections/all" class="btn btn-primary">Shop All Products</RouterLink>
          <RouterLink to="/blog" class="btn btn-ghost">Read Performance Journal</RouterLink>
        </div>
      </div>

      <div class="hero-visual reveal in-view">
        <div class="orb orb-a"></div>
        <div class="orb orb-b"></div>
        <div class="hero-card">
          <div class="product-can"></div>
          <div class="hero-card-content">
            <p class="hero-card-label">Top Seller</p>
            <h3>Falcon Protein</h3>
            <p>Organic plant protein with digestive enzymes.</p>
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
  featuredPrice: string;
}>();
</script>
