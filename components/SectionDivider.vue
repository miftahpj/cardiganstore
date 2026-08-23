<template>
  <div class="relative h-12 w-full overflow-hidden sm:h-16 md:h-20" :style="{ backgroundColor: bg }">
    <svg
      class="absolute bottom-0 left-0 h-full w-full"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        :fill="fill"
        d="M0,64 C220,110 400,10 720,50 C1040,90 1220,20 1440,64 L1440,120 L0,120 Z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
// `bg`   = warna latar section DI ATAS pembatas ini
// `fill` = warna latar section DI BAWAH pembatas ini (yang "terungkap" oleh lekukan)
defineProps<{ bg: string; fill: string }>()
</script>
