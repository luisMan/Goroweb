<template>
  <div class="cart-overlay" :class="{ open: state.isOpen }" @click="closeCart"></div>
  <aside class="cart-drawer" :class="{ open: state.isOpen }" aria-label="Cart drawer">
    <div class="cart-head">
      <h3>Your Cart ({{ lineCount }})</h3>
      <button @click="closeCart" aria-label="Close cart">x</button>
    </div>

    <div class="cart-body">
      <p v-if="state.lines.length === 0" class="empty">Your cart is empty.</p>
      <article class="cart-item" v-for="line in state.lines" :key="line.id">
        <div>
          <h4>{{ line.title }}</h4>
          <p>{{ formatCurrency(line.unitPriceCents, line.currencyCode) }}</p>
          <small>Qty: {{ line.quantity }}</small>
        </div>
        <div class="cart-actions">
          <button @click="decrement(line.id)">-</button>
          <button @click="increment(line.id)">+</button>
          <button @click="removeLine(line.id)">Remove</button>
        </div>
      </article>
    </div>

    <div class="cart-foot">
      <div class="total-row">
        <span>Subtotal</span>
        <strong>{{ formatCurrency(subtotalCents, currencyCode) }}</strong>
      </div>
      <RouterLink class="btn btn-primary full" to="/cart" @click="closeCart">Go to Cart</RouterLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useCart } from "../../composables/useCart";
import { formatCurrency } from "../../services/currency";

const { state, lineCount, subtotalCents, currencyCode, closeCart, removeLine, increment, decrement } = useCart();
</script>
