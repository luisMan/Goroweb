<template>
  <section class="section-pad">
    <div class="container">
      <SectionHeader :eyebrow="content.cartPage.eyebrow" :title="content.cartPage.title" />
      <p v-if="checkoutNotice" class="checkout-note checkout-note-success">{{ checkoutNotice }}</p>
      <p v-if="checkoutError" class="checkout-note checkout-note-error">{{ checkoutError }}</p>

      <div v-if="state.lines.length" class="cart-page-grid">
        <article class="cart-page-item parallax-card" data-depth="0.025" v-for="line in state.lines" :key="line.id">
          <img :src="line.image" :alt="line.title" />
          <div>
            <h3>{{ line.title }}</h3>
            <p>{{ formatCurrency(line.unitPriceCents, line.currencyCode) }}</p>
            <div class="qty-row">
              <button @click="decrement(line.id)">-</button>
              <span>{{ line.quantity }}</span>
              <button @click="increment(line.id)">+</button>
            </div>
          </div>
          <div class="item-total">
            <strong>{{ formatCurrency(line.unitPriceCents * line.quantity, line.currencyCode) }}</strong>
            <button @click="removeLine(line.id)">Remove</button>
          </div>
        </article>

        <aside class="order-summary parallax-card" data-depth="0.02">
          <h3>Order Summary</h3>
          <div class="summary-row">
            <span>Subtotal</span>
            <strong>{{ formatCurrency(subtotalCents, currencyCode) }}</strong>
          </div>
          <p class="muted">{{ content.cartPage.shippingNote }}</p>
          <button class="btn btn-primary full" :disabled="isCheckingOut" @click="startCheckout">
            {{ isCheckingOut ? "Redirecting..." : content.cartPage.checkoutButtonLabel }}
          </button>
          <RouterLink class="btn btn-ghost full" to="/collections/all">{{ content.cartPage.continueShoppingLabel }}</RouterLink>
        </aside>
      </div>

      <div v-else class="empty-state">
        <p>{{ content.cartPage.emptyStateText }}</p>
        <RouterLink class="btn btn-primary" to="/collections/all">{{ content.cartPage.browseProductsLabel }}</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import SectionHeader from "../components/common/SectionHeader.vue";
import { useCart } from "../composables/useCart";
import { formatCurrency } from "../services/currency";
import { createMercadoPagoPreference } from "../services/mercadoPagoCheckout";
import { useStorefrontContent } from "../services/storefrontContent";

const route = useRoute();
const { content } = useStorefrontContent();
const { state, subtotalCents, currencyCode, increment, decrement, removeLine, clear } = useCart();
const isCheckingOut = ref(false);
const checkoutError = ref("");
const checkoutNotice = computed(() => {
  const status = String(route.query.checkout_status ?? "");
  if (status === "approved") {
    return "Payment approved. Mercado Pago sent you back to the cart successfully.";
  }

  if (status === "pending") {
    return "Payment is pending. Mercado Pago will confirm the final status shortly.";
  }

  if (status === "failure") {
    return "Payment was not completed. You can review the cart and try again.";
  }

  return "";
});

watch(
  () => route.query.checkout_status,
  (status) => {
    if (status === "approved") {
      clear();
    }
  },
  { immediate: true }
);

async function startCheckout(): Promise<void> {
  if (!state.lines.length || isCheckingOut.value) return;

  isCheckingOut.value = true;
  checkoutError.value = "";

  try {
    const preference = await createMercadoPagoPreference(state.lines);
    window.location.assign(preference.initPoint);
  } catch (error) {
    checkoutError.value =
      error instanceof Error ? error.message : "Unable to start Mercado Pago checkout right now.";
  } finally {
    isCheckingOut.value = false;
  }
}
</script>
