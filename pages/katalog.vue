<template>
  <div>
    <AppHeader />

    <!-- Header halaman -->
    <section class="relative overflow-hidden bg-gradient-to-b from-primary-500 to-blush pb-16 pt-32 sm:pt-36 md:pb-20">
      <div class="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="relative mx-auto max-w-6xl px-5 text-center">
        <p data-aos="fade-down" class="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
          Shop Here
        </p>
        <h1 data-aos="fade-up" class="section-title text-white">Katalog Baju WOOMAN</h1>
        <p data-aos="fade-up" data-aos-delay="100" class="mx-auto mt-3 max-w-md text-sm text-white/90">
          Semua cardigan &amp; outfit manis kami ada di sini. Ketik nama produk buat cari yang paling "kamu banget".
        </p>

        <form
          data-aos="fade-up"
          data-aos-delay="150"
          class="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-2xl bg-white p-2 shadow-soft"
          @submit.prevent
        >
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari cardigan favoritmu..."
            class="w-full rounded-xl bg-transparent px-4 py-2 text-sm text-primary-800 placeholder:text-primary-300 focus:outline-none"
          />
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.15 6.15a7.5 7.5 0 0 0 10.5 10.5z" />
            </svg>
          </div>
        </form>
      </div>
    </section>

    <SectionDivider bg="#f6e9ec" fill="#fdf8f6" />

    <!-- Grid produk -->
    <section class="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div v-if="loading" class="flex justify-center py-16 text-primary-400">Memuat produk...</div>
      <div v-else-if="error" class="rounded-xl bg-red-50 p-6 text-center text-sm text-red-500">{{ error }}</div>
      <div v-else-if="filteredProducts.length === 0" class="py-16 text-center text-sm text-primary-400">
        Produk "{{ searchQuery }}" tidak ditemukan. Coba kata kunci lain ya.
      </div>

      <div
        v-else
        data-aos="fade-up"
        class="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
      >
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          class="!w-full"
        />
      </div>
    </section>

    <SectionDivider bg="#fdf8f6" fill="#622f3e" />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Katalog Baju | WOOMAN by Khania',
  meta: [
    {
      name: 'description',
      content: 'Semua koleksi cardigan dan outfit WOOMAN by Khania. Toko cardigan Tasikmalaya.'
    },
    {
      name: 'keywords',
      content: 'whooman, toko cardigan, cardigan Tasikmalaya, toko cardigan Tasikmalaya'
    }
  ]
})

const route = useRoute()
const { products, loading, error, fetchProducts } = useProducts()

onMounted(() => {
  fetchProducts()
})

const searchQuery = ref((route.query.q as string) || '')

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(
    (p) => p.name.toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q)
  )
})
</script>
