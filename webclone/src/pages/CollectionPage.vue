<template>
  <section class="section-pad">
    <div class="container">
      <SectionHeader
        eyebrow="Collection"
        :title="pageTitle"
        subtitle="Filter products by line and quickly add items to cart."
      />
      <CollectionPills v-model="activeCollection" :options="collectionOptions" />
      <div class="product-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @add="cart.addProduct"
        />
      </div>
      <p v-if="!loading && filteredProducts.length === 0" class="empty-state">
        No products were found for this collection.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import SectionHeader from "../components/common/SectionHeader.vue";
import CollectionPills, { type CollectionOption } from "../components/catalog/CollectionPills.vue";
import ProductCard from "../components/catalog/ProductCard.vue";
import { getProducts } from "../services/productService";
import type { StorefrontProduct } from "../types/storefront";
import { useCart } from "../composables/useCart";
import { useRevealOnScroll } from "../composables/useRevealOnScroll";

const route = useRoute();
const router = useRouter();
const cart = useCart();
useRevealOnScroll();

const loading = ref(true);
const products = ref<StorefrontProduct[]>([]);
const activeCollection = ref("all");

const collectionOptions = computed<CollectionOption[]>(() => {
  const map = new Map<string, string>();
  map.set("all", "All");
  products.value.forEach((product) => {
    const handle = product.collectionHandle || slugify(product.collection);
    if (!map.has(handle)) map.set(handle, product.collection);
  });
  return [...map.entries()].map(([value, label]) => ({ value, label }));
});

const filteredProducts = computed(() => {
  if (activeCollection.value === "all") return products.value;
  return products.value.filter(
    (product) => (product.collectionHandle || slugify(product.collection)) === activeCollection.value
  );
});

const pageTitle = computed(() =>
  activeCollection.value === "all"
    ? "All Products"
    : `${collectionOptions.value.find((option) => option.value === activeCollection.value)?.label ?? "Collection"} Collection`
);

watch(
  () => route.params.handle,
  async (handle) => {
    loading.value = true;
    const collection = String(handle ?? "all");
    activeCollection.value = collection;
    products.value = await getProducts("all");
    loading.value = false;
  },
  { immediate: true }
);

watch(activeCollection, (value) => {
  if (value !== String(route.params.handle ?? "all")) {
    void router.replace({ name: "collection", params: { handle: value } });
  }
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
</script>
