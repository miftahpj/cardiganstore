<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import 'aos/dist/aos.css'

const { fetchSettings } = useStoreSettings()

onMounted(async () => {
  fetchSettings()

  const AOS = (await import('aos')).default
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60
  })
})
</script>
