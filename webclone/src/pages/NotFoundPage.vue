<template>
  <section class="section-pad">
    <div class="container not-found">
      <p class="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The route does not exist in this storefront prototype.</p>
      <RouterLink to="/" class="btn btn-primary">Back to Home</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

