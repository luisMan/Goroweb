<template>
  <section class="section-pad">
    <div class="container" v-if="product">
      <nav class="breadcrumbs">
        <RouterLink to="/">Home</RouterLink>
        <span>/</span>
        <RouterLink :to="`/collections/${collectionHandle}`">{{ product.collection }}</RouterLink>
        <span>/</span>
        <strong>{{ product.title }}</strong>
      </nav>

      <div class="pdp-grid">
        <div class="pdp-gallery parallax-card" data-depth="0.03">
          <img class="pdp-main-image" :src="selectedImage" :alt="product.title" />
          <div class="pdp-thumbs">
            <button
              v-for="image in product.images"
              :key="image"
              :class="{ active: image === selectedImage }"
              @click="selectedImage = image"
            >
              <img :src="image" :alt="product.title" />
            </button>
          </div>
        </div>

        <div class="pdp-copy">
          <p class="eyebrow">{{ product.badge }}</p>
          <h1>{{ product.title }}</h1>
          <p class="pdp-vendor">{{ product.vendor }} - {{ product.productType }}</p>
          <div class="pdp-price">{{ formatCurrency(product.priceCents, product.currencyCode) }}</div>
          <p class="pdp-description" v-html="product.description"></p>

          <div class="pdp-actions">
            <button class="btn btn-primary" @click="addToCart(product)">Add to Cart</button>
            <RouterLink class="btn btn-ghost" to="/cart">Go to Cart</RouterLink>
          </div>

          <div class="api-contract-note parallax-card" data-depth="0.02">
            <h3>Catalog and Checkout</h3>
            <p>
              Product data is loaded from the local catalog feed and checked out through Mercado
              Pago once it reaches the cart.
            </p>
            <code>/api/products.json</code>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container">
      <p class="empty-state">Loading product...</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { getProductByHandle } from "../services/productService";
import type { StorefrontProduct } from "../types/storefront";
import { formatCurrency } from "../services/currency";
import { useCart } from "../composables/useCart";
import { useRevealOnScroll } from "../composables/useRevealOnScroll";

const route = useRoute();
const cart = useCart();
useRevealOnScroll();

const product = ref<StorefrontProduct | null>(null);
const selectedImage = ref("");

const collectionHandle = computed(() => (product.value ? product.value.collectionHandle || slugify(product.value.collection) : "all"));

watch(
  () => route.params.handle,
  async (handle) => {
    if (!handle) return;
    product.value = await getProductByHandle(String(handle));
    selectedImage.value = product.value.images[0] ?? product.value.image;
  },
  { immediate: true }
);

onMounted(async () => {
  if (!product.value && route.params.handle) {
    product.value = await getProductByHandle(String(route.params.handle));
    selectedImage.value = product.value.images[0] ?? product.value.image;
  }
});

function addToCart(item: StorefrontProduct): void {
  cart.addProduct(item);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
</script>
