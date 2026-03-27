<template>
  <div class="parallax-bg-wrap" :class="{ 'parallax-bg-wrap-home': isHomeRoute }" aria-hidden="true">
    <div class="parallax-image" :style="parallaxStyle"></div>
    <video
      v-if="isHomeRoute"
      class="parallax-video"
      :style="parallaxStyle"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      poster="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=2100&q=80"
    >
      <source
        src="https://upload.wikimedia.org/wikipedia/commons/transcoded/e/eb/Half_rack_resistance_exercise_workout.webm/Half_rack_resistance_exercise_workout.webm.360p.webm?download="
        type="video/webm"
      />
    </video>
    <div class="parallax-vignette"></div>
  </div>
  <div class="grain"></div>
  <div class="announcement-bar">
    <p>{{ content.branding.announcementText }}</p>
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
import { useStorefrontContent } from "../../services/storefrontContent";

const route = useRoute();
const { content } = useStorefrontContent();
const parallaxOffset = ref(0);
const parallaxCards = ref<HTMLElement[]>([]);
let ticking = false;

const isHomeRoute = computed(() => route.name === "home");

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
