<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import 'aos/dist/aos.css'

onMounted(async () => {
  const AOS = (await import('aos')).default
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  })
})
</script>
