<template>
  <div>
    <AppHeader />

    <div v-if="pending" class="flex min-h-[50vh] items-center justify-center pt-28 text-primary-400 sm:pt-32">
      Memuat produk...
    </div>

    <div v-else-if="error" class="flex min-h-[50vh] flex-col items-center justify-center gap-3 pt-28 text-center sm:pt-32">
      <p class="text-primary-500">Produk tidak ditemukan.</p>
      <NuxtLink to="/" class="btn-primary">Kembali ke Beranda</NuxtLink>
    </div>

    <section v-else class="mx-auto max-w-6xl px-5 pb-12 pt-28 sm:pt-32 md:pb-20">
      <NuxtLink to="/katalog" class="mb-6 inline-flex items-center gap-1 text-sm text-primary-500 hover:text-primary-700">
        ← Kembali ke katalog
      </NuxtLink>

      <div class="grid gap-10 md:grid-cols-2">
        <div data-aos="fade-right" class="overflow-hidden rounded-2xl bg-blush shadow-soft">
          <img :src="product?.image_url" :alt="product?.name" class="h-full w-full object-cover" />
        </div>

        <div data-aos="fade-left">
          <h1 class="section-title">{{ product?.name }}</h1>
          <p v-if="product?.code" class="mt-2 inline-flex w-fit items-center rounded-lg bg-blush px-3 py-1.5 font-mono text-xl font-bold tracking-wide text-primary-600 md:text-2xl">
            Kode: {{ product.code }}
          </p>
          <p class="mt-4 text-2xl font-bold text-primary-600">{{ formatRupiah(product?.price || 0) }}</p>
          <p class="mt-6 leading-relaxed text-primary-600">{{ product?.description }}</p>

          <div v-if="product" class="mt-8 flex flex-col gap-3">
            <!-- Pilih jumlah -->
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-primary-800">Jumlah</span>
              <div class="flex items-center gap-3 rounded-xl bg-blush px-2 py-1.5">
                <button
                  type="button"
                  aria-label="Kurangi jumlah"
                  class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-primary-600 shadow-soft transition active:scale-90"
                  @click="qty = Math.max(1, qty - 1)"
                >
                  <AppIcon name="minus" class="h-3.5 w-3.5" />
                </button>
                <span class="w-5 text-center text-sm font-bold text-primary-800">{{ qty }}</span>
                <button
                  type="button"
                  aria-label="Tambah jumlah"
                  class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-primary-600 shadow-soft transition active:scale-90"
                  @click="qty++"
                >
                  <AppIcon name="plus" class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary-500 py-3 text-sm font-semibold text-primary-600 transition hover:bg-primary-500 hover:text-white active:scale-95"
              @click="handleAddToCart"
            >
              <AppIcon :name="added ? 'check-circle' : 'cart'" class="h-5 w-5" />
              {{ added ? 'Ditambahkan ke Keranjang' : 'Tambah ke Keranjang' }}
            </button>

            <a :href="buildWhatsappLink(product, settings.whatsapp_number)" target="_blank" rel="noopener" class="btn-primary w-full">
              Chat via WhatsApp
            </a>
          </div>

          <div class="mt-8 rounded-xl bg-blush p-5 text-sm text-primary-600">
            <p class="font-semibold text-primary-800">Info Pembayaran</p>
            <p class="mt-1">
              Transfer ke rekening resmi WOOMAN a.n. <span class="font-semibold">Iskania Janah</span>. Pastikan nama
              penerima sesuai sebelum melakukan pembayaran.
            </p>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchProduct } = useProducts()
const { settings } = useStoreSettings()
const { addToCart } = useCart()

const {
  data: product,
  pending,
  error
} = await useAsyncData(`product-${route.params.id}`, () => fetchProduct(route.params.id as string))

const qty = ref(1)
const added = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

function handleAddToCart() {
  if (!product.value) return
  addToCart(product.value, qty.value)
  added.value = true
  qty.value = 1
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    added.value = false
  }, 1500)
}

useHead(() => ({
  title: product.value ? `${product.value.name} | WOOMAN by Khania` : 'WOOMAN by Khania',
  meta: [
    {
      name: 'description',
      content: product.value?.description || 'Toko cardigan Tasikmalaya - WOOMAN by Khania'
    },
    {
      name: 'keywords',
      content: 'whooman, toko cardigan, cardigan Tasikmalaya, toko cardigan Tasikmalaya'
    }
  ]
}))
</script>
