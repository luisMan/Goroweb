<template>
  <div class="faq-list">
    <article class="faq-item reveal" v-for="item in items" :key="item.id">
      <button @click="toggle(item.id)" class="faq-q">
        <span>{{ item.question }}</span>
        <span>{{ openId === item.id ? "-" : "+" }}</span>
      </button>
      <div class="faq-a" :class="{ open: openId === item.id }">
        <p>{{ item.answer }}</p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const props = defineProps<{
  items: FaqItem[];
  initialOpenId?: number;
}>();

const openId = ref<number | null>(props.initialOpenId ?? null);

function toggle(id: number): void {
  openId.value = openId.value === id ? null : id;
}
</script>

