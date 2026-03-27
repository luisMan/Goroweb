<template>
  <section class="section-pad">
    <div class="container">
      <SectionHeader
        :eyebrow="content.blogPage.eyebrow"
        :title="content.blogPage.title"
        :subtitle="content.blogPage.subtitle"
      />
      <div class="blog-grid">
        <BlogCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>
  </section>

  <NewsletterBlock :title="content.blogPage.newsletterTitle" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import SectionHeader from "../components/common/SectionHeader.vue";
import BlogCard from "../components/common/BlogCard.vue";
import NewsletterBlock from "../components/common/NewsletterBlock.vue";
import { getBlogPosts } from "../services/blogService";
import { useStorefrontContent } from "../services/storefrontContent";
import type { StorefrontBlogPost } from "../types/storefront";
import { useRevealOnScroll } from "../composables/useRevealOnScroll";

const posts = ref<StorefrontBlogPost[]>([]);
const { content } = useStorefrontContent();
useRevealOnScroll();

onMounted(async () => {
  posts.value = await getBlogPosts();
});
</script>
