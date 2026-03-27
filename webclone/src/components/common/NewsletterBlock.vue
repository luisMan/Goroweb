<template>
  <section class="newsletter section-pad-sm">
    <div class="container newsletter-inner reveal">
      <h2>{{ title }}</h2>
      <form class="newsletter-form" @submit.prevent>
        <input type="email" placeholder="Enter your email" />
        <button class="btn btn-primary">Subscribe</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

