<template>
  <section id="katalog" class="mx-auto max-w-6xl px-5 py-16 md:py-24">
    <div data-aos="fade-up" class="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-primary-400">Shop Here</p>
        <h2 class="section-title mt-1">Katalog Baju</h2>
        <p class="mt-1 max-w-md text-sm text-primary-500">Lihat koleksi terbaru WOOMAN, geser untuk menjelajah lebih banyak</p>
      </div>

      <div class="flex shrink-0 items-center gap-3">
        <NuxtLink to="/katalog" class="text-sm font-semibold text-primary-600 transition hover:text-primary-700">
          Lihat Semua →
        </NuxtLink>
        <div v-if="featured.length" class="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            aria-label="Sebelumnya"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-primary-200 text-primary-500 transition hover:bg-primary-100"
            @click="scroll(-1)"
          >
            <AppIcon name="arrow-left" class="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-primary-200 text-primary-500 transition hover:bg-primary-100"
            @click="scroll(1)"
          >
            <AppIcon name="arrow-right" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-10 text-primary-400">Memuat produk...</div>
    <div v-else-if="error" class="rounded-xl bg-red-50 p-6 text-center text-sm text-red-500">{{ error }}</div>
    <div v-else-if="featured.length === 0" class="text-center text-sm text-primary-400">
      Belum ada produk.
    </div>

    <div
      v-else
      ref="trackRef"
      data-aos="fade-up"
      data-aos-delay="100"
      class="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-5 overflow-x-auto scroll-smooth px-5 pb-4"
    >
      <ProductCard v-for="product in featured" :key="product.id" :product="product" class="snap-start" />
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

const trackRef = ref<HTMLElement | null>(null)

function scroll(direction: 1 | -1) {
  trackRef.value?.scrollBy({ left: direction * 320, behavior: 'smooth' })
}
</script>
