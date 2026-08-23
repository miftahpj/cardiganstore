<template>
  <div>
    <AppHeader />
    <HeroSection />
    <SectionDivider bg="#f6e9ec" fill="#fdf8f6" />
    <ProductCarousel />
    <SectionDivider bg="#fdf8f6" fill="#f6e9ec" />
    <DealsSection />
    <SectionDivider bg="#f6e9ec" fill="#622f3e" />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'WOOMAN by Khania | Toko Cardigan Tasikmalaya',
  meta: [
    {
      name: 'description',
      content:
        'Belanja cardigan dan outfit wanita elegan, feminin, effortless di WOOMAN by Khania. Toko cardigan Tasikmalaya terpercaya.'
    },
    {
      name: 'keywords',
      content: 'whooman, toko cardigan, cardigan Tasikmalaya, toko cardigan Tasikmalaya'
    }
  ]
})
</script>
