<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <h3>BirdFuel</h3>
        <p>Plant-based supplements for daily performance.</p>
      </div>
      <div>
        <h4>Shop</h4>
        <RouterLink to="/collections/all">All Products</RouterLink>
        <RouterLink to="/collections/protein">Protein</RouterLink>
        <RouterLink to="/collections/performance">Performance</RouterLink>
      </div>
      <div>
        <h4>Support</h4>
        <a href="#">Shipping Policy</a>
        <a href="#">Returns</a>
        <a href="#">Order Status</a>
      </div>
      <div>
        <h4>Content</h4>
        <RouterLink to="/blog">Blog</RouterLink>
        <a href="#">Our Story</a>
        <a href="#">Contact</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

