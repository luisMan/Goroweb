<template>
  <section class="section-pad">
    <div class="container">
      <SectionHeader
        eyebrow="Journal"
        title="Performance and nutrition insights"
        subtitle="Editorial content driven by the storefront content feed."
      />
      <div class="blog-grid">
        <BlogCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>
  </section>

  <NewsletterBlock title="Get weekly nutrition and training content." />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SectionHeader from "../components/common/SectionHeader.vue";
import BlogCard from "../components/common/BlogCard.vue";
import NewsletterBlock from "../components/common/NewsletterBlock.vue";
import { getBlogPosts } from "../services/blogService";
import type { StorefrontBlogPost } from "../types/storefront";
import { useRevealOnScroll } from "../composables/useRevealOnScroll";

const posts = ref<StorefrontBlogPost[]>([]);
useRevealOnScroll();

onMounted(async () => {
  posts.value = await getBlogPosts();
});
</script>
