<template>
  <HeroSection
    :eyebrow="content.hero.eyebrow"
    :title="content.hero.title"
    :subtext="content.hero.subtext"
    :primary-cta-label="content.hero.primaryCtaLabel"
    :secondary-cta-label="content.hero.secondaryCtaLabel"
    :card-label="content.hero.cardLabel"
    :card-title="content.hero.cardTitle"
    :card-text="content.hero.cardText"
    :featured-price="featuredPrice"
  />

  <StatsStrip :stats="content.stats" />

  <section class="collections section-pad">
    <div class="container">
      <SectionHeader :eyebrow="content.homeCollections.eyebrow" :title="content.homeCollections.title" />
      <CollectionPills v-model="activeCollection" :options="collectionOptions" />
      <div class="product-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @add="cart.addProduct"
        />
      </div>
    </div>
  </section>

  <ValuePropsSection
    :eyebrow="content.valueProps.eyebrow"
    :title="content.valueProps.title"
    :items="content.valueProps.items"
  />

  <section class="subscription-banner section-pad-sm">
    <div class="container banner-inner reveal">
      <div>
        <p class="eyebrow">{{ content.subscriptionBanner.eyebrow }}</p>
        <h2>{{ content.subscriptionBanner.title }}</h2>
      </div>
      <RouterLink to="/collections/all" class="btn btn-primary">{{ content.subscriptionBanner.buttonLabel }}</RouterLink>
    </div>
  </section>

  <section class="testimonials section-pad">
    <div class="container">
      <SectionHeader :eyebrow="content.testimonials.eyebrow" :title="content.testimonials.title" />
      <TestimonialSlider :items="content.testimonials.items" />
    </div>
  </section>

  <section class="journal section-pad">
    <div class="container">
      <SectionHeader :eyebrow="content.journal.eyebrow" :title="content.journal.title" />
      <div class="blog-grid">
        <BlogCard v-for="post in previewPosts" :key="post.id" :post="post" />
      </div>
    </div>
  </section>

  <section class="faq section-pad">
    <div class="container">
      <SectionHeader :eyebrow="content.faq.eyebrow" :title="content.faq.title" />
      <FaqAccordion :items="content.faq.items" :initial-open-id="1" />
    </div>
  </section>

  <NewsletterBlock :title="content.homeNewsletterTitle" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import HeroSection from "../components/home/HeroSection.vue";
import StatsStrip from "../components/home/StatsStrip.vue";
import ValuePropsSection from "../components/home/ValuePropsSection.vue";
import SectionHeader from "../components/common/SectionHeader.vue";
import CollectionPills, { type CollectionOption } from "../components/catalog/CollectionPills.vue";
import ProductCard from "../components/catalog/ProductCard.vue";
import TestimonialSlider from "../components/common/TestimonialSlider.vue";
import BlogCard from "../components/common/BlogCard.vue";
import FaqAccordion from "../components/common/FaqAccordion.vue";
import NewsletterBlock from "../components/common/NewsletterBlock.vue";
import { getProducts } from "../services/productService";
import { getBlogPosts } from "../services/blogService";
import { useCart } from "../composables/useCart";
import { useRevealOnScroll } from "../composables/useRevealOnScroll";
import { formatCurrency } from "../services/currency";
import { useCatalogStore } from "../services/catalogStore";
import { useStorefrontContent } from "../services/storefrontContent";
import type { StorefrontBlogPost, StorefrontProduct } from "../types/storefront";

const products = ref<StorefrontProduct[]>([]);
const posts = ref<StorefrontBlogPost[]>([]);
const activeCollection = ref("all");
const cart = useCart();
const { content } = useStorefrontContent();
const { catalogRevision } = useCatalogStore();
useRevealOnScroll();

const collectionOptions = computed<CollectionOption[]>(() => {
  const map = new Map<string, string>();
  map.set("all", "All");
  products.value.forEach((product) => {
    const handle = product.collectionHandle || slugify(product.collection);
    if (!map.has(handle)) {
      map.set(handle, product.collection);
    }
  });

  return [...map.entries()].map(([value, label]) => ({ value, label }));
});

const filteredProducts = computed(() => {
  if (activeCollection.value === "all") return products.value;
  return products.value.filter(
    (product) => (product.collectionHandle || slugify(product.collection)) === activeCollection.value
  );
});

const previewPosts = computed(() => posts.value.slice(0, 3));
const featuredPrice = computed(() =>
  products.value.length
    ? formatCurrency(products.value[0].priceCents, products.value[0].currencyCode)
    : formatCurrency(84900)
);

watch(
  catalogRevision,
  async () => {
    products.value = await getProducts("all");
  },
  { immediate: true }
);

onMounted(async () => {
  posts.value = await getBlogPosts();
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

</script>
