<template>
  <HeroSection :featured-price="featuredPrice" />

  <StatsStrip :stats="stats" />

  <section class="collections section-pad">
    <div class="container">
      <SectionHeader eyebrow="Collections" title="Choose your line" />
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

  <ValuePropsSection :items="valueProps" />

  <section class="subscription-banner section-pad-sm">
    <div class="container banner-inner reveal">
      <div>
        <p class="eyebrow">Subscription Program</p>
        <h2>Save up to 20% with auto-delivery.</h2>
      </div>
      <RouterLink to="/collections/all" class="btn btn-primary">Configure Subscription</RouterLink>
    </div>
  </section>

  <section class="testimonials section-pad">
    <div class="container">
      <SectionHeader eyebrow="Community" title="Real customers, real progress" />
      <TestimonialSlider :items="testimonials" />
    </div>
  </section>

  <section class="journal section-pad">
    <div class="container">
      <SectionHeader eyebrow="Journal" title="Education and recipes" />
      <div class="blog-grid">
        <BlogCard v-for="post in previewPosts" :key="post.id" :post="post" />
      </div>
    </div>
  </section>

  <section class="faq section-pad">
    <div class="container">
      <SectionHeader eyebrow="FAQ" title="Common questions" />
      <FaqAccordion :items="faqs" :initial-open-id="1" />
    </div>
  </section>

  <NewsletterBlock title="Get new drops, guides, and subscription offers." />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
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
import type { StorefrontBlogPost, StorefrontProduct } from "../types/storefront";

const products = ref<StorefrontProduct[]>([]);
const posts = ref<StorefrontBlogPost[]>([]);
const activeCollection = ref("all");
const cart = useCart();
useRevealOnScroll();

const stats = [
  { value: "116+", label: "Products and bundles" },
  { value: "4.8/5", label: "Average verified rating" },
  { value: "24h", label: "Order processing window" },
  { value: "100%", label: "Plant-based formulas" }
];

const valueProps = [
  {
    title: "Clinically-informed formulas",
    text: "Ingredients selected for outcomes that matter: energy, recovery, and consistency."
  },
  {
    title: "Flexible subscription engine",
    text: "Frequency controls, smart offers, and predictable reorder flows."
  },
  {
    title: "Operationally scalable storefront",
    text: "Section-based UI, reusable blocks, and controlled app integrations."
  }
];

const testimonials = [
  {
    quote:
      "I switched my morning routine to BirdFuel and my digestion and training energy both improved within weeks.",
    name: "Ariadna L.",
    role: "Customer - Monterrey"
  },
  {
    quote:
      "Subscription delivery removed friction for me. I never run out now, and the cart upsells are actually relevant.",
    name: "Roberto M.",
    role: "Subscriber - Guadalajara"
  },
  {
    quote:
      "The formulas are clean, no heavy feeling, and the flavor profile is better than most options I tried.",
    name: "Daniela R.",
    role: "Customer - CDMX"
  }
];

const faqs = [
  {
    id: 1,
    question: "Do you offer subscriptions with flexible frequency?",
    answer: "Yes. Customers can choose monthly frequency and adjust delivery from account settings."
  },
  {
    id: 2,
    question: "Are products vegan and free from common allergens?",
    answer: "Core formulas are 100% plant-based and most are free from dairy, gluten, and soy."
  },
  {
    id: 3,
    question: "How long does shipping take in Mexico?",
    answer: "Most orders process within 24 hours and typically arrive in 2-5 business days."
  },
  {
    id: 4,
    question: "How are payments handled in this storefront?",
    answer: "The cart creates a Mercado Pago Checkout Pro preference on the backend and redirects customers to pay securely."
  }
];

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

onMounted(async () => {
  products.value = await getProducts("all");
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
