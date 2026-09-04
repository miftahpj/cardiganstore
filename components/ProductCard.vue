<template>
  <div
    class="group flex w-60 shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-primary-100 transition hover:-translate-y-1 sm:w-64"
    role="link"
    tabindex="0"
    :aria-label="`Lihat detail ${product.name}`"
    @click="goToDetail"
    @keydown.enter="goToDetail"
  >
    <!-- Gambar produk -->
    <div class="relative block aspect-[3/4] w-full overflow-hidden bg-blush">
      <img
        :src="product.image_url"
        :alt="product.name"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </div>

    <!-- Judul, harga & deskripsi: kontras & ukuran diperbesar biar gampang dibaca -->
    <div class="flex flex-1 flex-col px-4 pt-3.5">
      <p class="line-clamp-1 text-sm font-bold leading-snug text-primary-900 group-hover:text-primary-600">{{ product.name }}</p>
      <p v-if="product.code" class="mt-1 inline-flex w-fit items-center rounded-md bg-primary-50 px-2 py-0.5 font-mono text-sm font-bold tracking-wide text-primary-600">
        Kode: {{ product.code }}
      </p>
      <p class="mt-1 text-lg font-extrabold leading-none text-primary-600">{{ formatRupiah(product.price) }}</p>
      <p class="mt-2 line-clamp-2 text-[13px] leading-relaxed text-primary-600">{{ product.description }}</p>
    </div>

    <!-- Tombol -->
    <div class="mt-3 flex flex-col gap-2 px-4 pb-4">
      <NuxtLink
        :to="`/product/${product.id}`"
        class="w-full rounded-xl bg-primary-500 py-2.5 text-center text-xs font-semibold text-white shadow-soft transition hover:bg-primary-600 active:scale-95"
        @click.stop
      >
        Cek Detail
      </NuxtLink>
      <a
        :href="buildWhatsappLink(product, settings.whatsapp_number)"
        target="_blank"
        rel="noopener"
        class="w-full rounded-xl border-2 border-primary-500 py-2.5 text-center text-xs font-semibold text-primary-600 transition hover:bg-primary-500 hover:text-white active:scale-95"
        @click.stop
      >
        Chat via WhatsApp
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

const props = defineProps<{ product: Product }>()

const { settings } = useStoreSettings()

function goToDetail() {
  navigateTo(`/product/${props.product.id}`)
}
</script>
