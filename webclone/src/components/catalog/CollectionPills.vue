<template>
  <div class="pill-row reveal">
    <button
      v-for="option in options"
      :key="option.value"
      :class="['pill', { active: modelValue === option.value }]"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
export interface CollectionOption {
  label: string;
  value: string;
}

defineProps<{
  options: CollectionOption[];
  modelValue: string;
}>();

defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

