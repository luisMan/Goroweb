<template>
  <div class="parallax-bg-wrap" aria-hidden="true">
    <div class="parallax-image" :style="parallaxStyle"></div>
    <div class="parallax-vignette"></div>
  </div>
  <div class="grain"></div>
  <div class="announcement-bar">
    <p>Free shipping in Mexico from $999 MXN - 100% plant-based formulas</p>
  </div>
  <SiteHeader />
  <main>
    <slot />
  </main>
  <SiteFooter />
  <CartDrawer />
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import SiteHeader from "./SiteHeader.vue";
import SiteFooter from "./SiteFooter.vue";
import CartDrawer from "./CartDrawer.vue";

const route = useRoute();
const parallaxOffset = ref(0);
const parallaxCards = ref<HTMLElement[]>([]);
let ticking = false;

const parallaxStyle = computed(() => ({
  transform: `translate3d(0, ${-parallaxOffset.value}px, 0) scale(1.16)`
}));

const syncParallaxCards = (): void => {
  parallaxCards.value = Array.from(document.querySelectorAll<HTMLElement>(".parallax-card"));
};

const applyCardParallax = (): void => {
  const disableMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth < 768;
  const viewportCenter = window.innerHeight / 2;

  parallaxCards.value.forEach((card) => {
    if (disableMotion) {
      card.style.setProperty("--parallax-shift", "0px");
      return;
    }

    const rect = card.getBoundingClientRect();
    const cardCenter = rect.top + rect.height / 2;
    const normalized = (cardCenter - viewportCenter) / viewportCenter;
    const depth = Number(card.dataset.depth ?? "0.045");
    const shift = Math.max(-20, Math.min(20, -normalized * depth * 100));

    card.style.setProperty("--parallax-shift", `${shift.toFixed(2)}px`);
  });
};

const onScroll = (): void => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    parallaxOffset.value = window.scrollY * 0.16;
    applyCardParallax();
    ticking = false;
  });
};

onMounted(() => {
  syncParallaxCards();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
});

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    syncParallaxCards();
    onScroll();
  }
);

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
});
</script>
