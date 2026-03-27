<template>
  <article class="product-card reveal parallax-card" data-depth="0.065">
    <div class="card-top card-visual">
      <img :src="product.image" :alt="product.title" loading="lazy" />
      <span class="chip">{{ product.badge }}</span>
    </div>
    <div class="card-body">
      <p class="muted">{{ product.collection }}</p>
      <RouterLink :to="`/products/${product.handle}`" class="product-title-link">
        <h3>{{ product.title }}</h3>
      </RouterLink>
      <p v-html="shortDescription"></p>
      <div class="card-actions">
        <strong>{{ formatCurrency(product.priceCents, product.currencyCode) }}</strong>
        <button class="btn btn-mini" @click="$emit('add', product)">Add</button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import type { StorefrontProduct } from "../../types/storefront";
import { formatCurrency } from "../../services/currency";

const props = defineProps<{
  product: StorefrontProduct;
}>();

defineEmits<{
  add: [product: StorefrontProduct];
}>();

const shortDescription = computed(() => {
  const plain = props.product.description.replace(/<[^>]+>/g, "");
  return plain.length > 92 ? `${plain.slice(0, 92)}...` : plain;
});
</script>
