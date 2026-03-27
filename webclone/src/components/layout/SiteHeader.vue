<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="logo">
        <span class="logo-mark">BF</span>
        <span class="logo-word">BirdFuel</span>
      </RouterLink>

      <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>

      <nav class="site-nav" :class="{ open: isMenuOpen }">
        <RouterLink to="/collections/all" @click="isMenuOpen = false">Shop</RouterLink>
        <RouterLink to="/collections/performance" @click="isMenuOpen = false">Performance</RouterLink>
        <RouterLink to="/collections/protein" @click="isMenuOpen = false">Protein</RouterLink>
        <RouterLink to="/blog" @click="isMenuOpen = false">Blog</RouterLink>
      </nav>

      <div class="header-actions">
        <RouterLink class="cart-link" to="/cart">Cart</RouterLink>
        <button class="cart-button" @click="openCart" aria-label="Open cart drawer">
          Drawer <span class="cart-count">{{ lineCount }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useCart } from "../../composables/useCart";

const { lineCount, openCart } = useCart();
const isMenuOpen = ref(false);
</script>
