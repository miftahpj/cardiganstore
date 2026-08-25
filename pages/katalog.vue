<template>
  <div>
    <AppHeader />

    <!-- Toolbar katalog: pencarian + kategori (gaya marketplace) -->
    <section class="relative overflow-hidden bg-gradient-to-b from-primary-500 to-blush pb-6 pt-24 sm:pb-8 sm:pt-28">
      <div class="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="relative mx-auto max-w-6xl px-3 sm:px-5">
        <p data-aos="fade-down" class="mb-2 text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 sm:mb-3">
          Shop Here
        </p>
        <h1 class="sr-only">Katalog Baju WOOMAN by Khania</h1>

        <!-- Search bar -->
        <form
          data-aos="fade-up"
          class="mx-auto flex max-w-xl items-center gap-1 rounded-2xl bg-white p-1.5 shadow-soft sm:gap-2 sm:p-2"
          @submit.prevent="loadProducts"
        >
          <div class="flex h-9 w-9 shrink-0 items-center justify-center text-primary-300 sm:h-10 sm:w-10">
            <AppIcon name="search" class="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama atau kode produk..."
            class="w-full min-w-0 bg-transparent px-1 py-2 text-sm text-primary-800 placeholder:text-primary-300 focus:outline-none"
          />
          <button
            type="submit"
            class="shrink-0 rounded-xl bg-primary-500 px-3.5 py-2.5 text-xs font-semibold text-white shadow-soft transition hover:bg-primary-600 active:scale-95 sm:px-6 sm:text-sm"
          >
            Cari
          </button>
        </form>

        <!-- Kategori -->
        <div
          data-aos="fade-up"
          data-aos-delay="100"
          class="scrollbar-none mt-4 flex gap-2 overflow-x-auto pb-1 sm:mt-5 sm:flex-wrap sm:justify-center sm:overflow-visible"
        >
          <button
            type="button"
            class="shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm"
            :class="
              selectedCategory === null
                ? 'bg-white text-primary-700 shadow-soft'
                : 'bg-white/20 text-white hover:bg-white/30'
            "
            @click="selectedCategory = null"
          >
            Semua
          </button>
          <button
            v-for="c in categories"
            :key="c.id"
            type="button"
            class="shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm"
            :class="
              selectedCategory === c.id
                ? 'bg-white text-primary-700 shadow-soft'
                : 'bg-white/20 text-white hover:bg-white/30'
            "
            @click="selectedCategory = c.id"
          >
            {{ c.name }}
          </button>
        </div>
      </div>
    </section>

    <SectionDivider bg="#f6e9ec" fill="#fdf8f6" />

    <!-- Grid produk -->
    <section class="mx-auto max-w-6xl px-3 py-10 sm:px-5 sm:py-14 md:py-16">
      <div v-if="loading" class="flex justify-center py-16 text-primary-400">Memuat produk...</div>
      <div v-else-if="error" class="rounded-xl bg-red-50 p-6 text-center text-sm text-red-500">{{ error }}</div>
      <div v-else-if="products.length === 0" class="py-16 text-center text-sm text-primary-400">
        <span v-if="searchQuery.trim()">Produk "{{ searchQuery }}" tidak ditemukan. Coba kata kunci lain ya.</span>
        <span v-else>Belum ada produk pada kategori ini.</span>
      </div>

      <div
        v-else
        data-aos="fade-up"
        class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5"
      >
        <ProductCard v-for="product in products" :key="product.id" :product="product" class="!w-full" />
      </div>
    </section>

    <SectionDivider bg="#fdf8f6" fill="#622f3e" />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

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
const { categories, fetchCategories } = useCategories()

const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const searchQuery = ref((route.query.q as string) || '')
const selectedCategory = ref<number | null>(route.query.category ? Number(route.query.category) : null)

async function loadProducts() {
  loading.value = true
  error.value = null
  try {
    const query: Record<string, string> = { status: 'active', sort: 'newest' }
    if (searchQuery.value.trim()) query.q = searchQuery.value.trim()
    if (selectedCategory.value) query.category = String(selectedCategory.value)
    products.value = await $fetch<Product[]>('/api/products', { query })
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Gagal memuat produk.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategories()
  loadProducts()
})

let debounce: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, () => {
  if (debounce) clearTimeout(debounce)
  debounce = setTimeout(loadProducts, 350)
})
watch(selectedCategory, loadProducts)
</script>

<style scoped>
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
