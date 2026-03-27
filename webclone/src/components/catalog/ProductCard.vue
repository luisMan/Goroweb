<template>
  <article class="product-card reveal parallax-card" data-depth="0.065">
    <div class="card-top card-visual" @mouseenter="pauseSlideshow" @mouseleave="resumeSlideshow">
      <img :src="activeImage" :alt="product.title" loading="lazy" />
      <span class="chip">{{ product.badge }}</span>
      <div v-if="product.images.length > 1" class="card-image-dots" aria-hidden="true">
        <span
          v-for="(image, index) in product.images"
          :key="`${product.id}-${image}`"
          :class="['card-image-dot', { active: index === activeImageIndex }]"
        ></span>
      </div>
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import type { StorefrontProduct } from "../../types/storefront";
import { formatCurrency } from "../../services/currency";

const props = defineProps<{
  product: StorefrontProduct;
}>();

defineEmits<{
  add: [product: StorefrontProduct];
}>();

const activeImageIndex = ref(0);
let timer: number | null = null;

const shortDescription = computed(() => {
  const plain = props.product.description.replace(/<[^>]+>/g, "");
  return plain.length > 92 ? `${plain.slice(0, 92)}...` : plain;
});

const activeImage = computed(() => props.product.images[activeImageIndex.value] ?? props.product.image);

onMounted(() => {
  resumeSlideshow();
});

onBeforeUnmount(() => {
  stopSlideshow();
});

function resumeSlideshow(): void {
  stopSlideshow();
  if (props.product.images.length <= 1) return;

  timer = window.setInterval(() => {
    activeImageIndex.value = (activeImageIndex.value + 1) % props.product.images.length;
  }, 2200);
}

function pauseSlideshow(): void {
  stopSlideshow();
}

function stopSlideshow(): void {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }
}
</script>
