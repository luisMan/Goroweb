<template>
  <article class="blog-card reveal parallax-card" data-depth="0.04">
    <div class="blog-cover" :style="{ backgroundImage: `url(${post.cover})` }"></div>
    <div class="blog-copy">
      <p>{{ post.category }}</p>
      <h3>{{ post.title }}</h3>
      <span class="blog-date">{{ post.publishedAt }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { StorefrontBlogPost } from "../../types/storefront";

defineProps<{
  post: StorefrontBlogPost;
}>();
</script>
