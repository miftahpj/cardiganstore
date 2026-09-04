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

          <div class="mt-8">
            <a v-if="product" :href="buildWhatsappLink(product, settings.whatsapp_number)" target="_blank" rel="noopener" class="btn-primary w-full">
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

const {
  data: product,
  pending,
  error
} = await useAsyncData(`product-${route.params.id}`, () => fetchProduct(route.params.id as string))

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
