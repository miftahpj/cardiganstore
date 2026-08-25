<template>
  <svg
    v-if="brand === 'whatsapp'"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    class="object-contain"
    role="img"
    aria-label="WhatsApp"
  >
    <circle cx="16" cy="16" r="16" fill="#25D366" />
    <path
      d="M16 7.4c-4.8 0-8.6 3.8-8.6 8.6 0 1.6.4 3.1 1.2 4.4L7 24.6l4.4-1.2c1.3.7 2.7 1.1 4.6 1.1 4.8 0 8.6-3.8 8.6-8.6S20.8 7.4 16 7.4Zm0 15.6c-1.4 0-2.8-.4-3.9-1.1l-.3-.2-2.6.7.7-2.5-.2-.3a7 7 0 0 1-1.1-3.8c0-3.9 3.2-7.1 7.4-7.1s7.4 3.2 7.4 7.1-3.3 7.2-7.4 7.2Z"
      fill="#fff"
    />
    <path
      d="M12.8 11.4c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.3s1 2.7 1.1 2.9c.1.2 2 3.2 5 4.4.7.3 1.2.4 1.6.5.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.6.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.6-1.6-.9-2.1Z"
      fill="#25D366"
    />
  </svg>

  <svg
    v-else-if="brand === 'instagram'"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    class="object-contain"
    role="img"
    aria-label="Instagram"
  >
    <defs>
      <linearGradient :id="igGradientId" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FED576" />
        <stop offset="26%" stop-color="#F47133" />
        <stop offset="61%" stop-color="#BC3081" />
        <stop offset="100%" stop-color="#4C63D2" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="30" height="30" rx="9" :fill="`url(#${igGradientId})`" />
    <rect x="9.5" y="9.5" width="13" height="13" rx="4" fill="none" stroke="#fff" stroke-width="1.8" />
    <circle cx="16" cy="16" r="3.6" fill="none" stroke="#fff" stroke-width="1.8" />
    <circle cx="21.6" cy="10.4" r="1.1" fill="#fff" />
  </svg>

  <img v-else :src="src" :alt="alt" class="object-contain" />
</template>

<script setup lang="ts">
const props = defineProps<{ brand: 'shopee' | 'tiktok' | 'whatsapp' | 'instagram' }>()

const src = computed(() => (props.brand === 'shopee' ? '/brands/shopee-icon.png' : '/brands/tiktokshop-icon.png'))
const alt = computed(() => (props.brand === 'shopee' ? 'Shopee' : 'TikTok Shop'))

// id unik biar gradient-nya gak bentrok kalau ikon Instagram dipakai lebih dari sekali di satu halaman
const igGradientId = `ig-gradient-${Math.random().toString(36).slice(2, 9)}`
</script>
