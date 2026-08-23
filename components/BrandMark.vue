<template>
  <img :src="src" :alt="alt" class="object-contain" />
</template>

<script setup lang="ts">
const props = defineProps<{ brand: 'shopee' | 'tiktok' }>()

const src = computed(() => (props.brand === 'shopee' ? '/brands/shopee-icon.png' : '/brands/tiktokshop-icon.png'))
const alt = computed(() => (props.brand === 'shopee' ? 'Shopee' : 'TikTok Shop'))
</script>
