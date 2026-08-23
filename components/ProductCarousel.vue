<template>
  <section id="katalog" class="mx-auto max-w-6xl px-5 py-16 md:py-24">
    <div data-aos="fade-up" class="mb-10 flex flex-col items-center gap-2 text-center">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-primary-400">Shop Here</p>
      <h2 class="section-title">Katalog Baju</h2>
      <p class="mx-auto mt-1 max-w-md text-sm text-primary-500">Lihat koleksi terbaru WOOMAN, geser untuk menjelajah lebih banyak</p>
    </div>

    <div v-if="loading" class="flex justify-center py-10 text-primary-400">Memuat produk...</div>
    <div v-else-if="error" class="rounded-xl bg-red-50 p-6 text-center text-sm text-red-500">{{ error }}</div>
    <div v-else-if="featured.length === 0" class="text-center text-sm text-primary-400">
      Belum ada produk.
    </div>

    <div v-else data-aos="fade-up" data-aos-delay="100" class="no-scrollbar -mx-5 flex gap-5 overflow-x-auto px-5 pb-4">
      <ProductCard v-for="product in featured" :key="product.id" :product="product" />
    </div>

    <div data-aos="fade-up" data-aos-delay="150" class="mt-10 text-center">
      <NuxtLink to="/katalog" class="btn-outline">
        Lihat Semua Produk →
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
const { products, loading, error, fetchProducts } = useProducts()

onMounted(() => {
  fetchProducts()
})

// Teaser homepage: cukup tampilkan sebagian, katalog lengkap ada di /katalog
const featured = computed(() => products.value.slice(0, 8))
</script>
