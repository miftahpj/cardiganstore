<template>
  <div class="flex w-60 shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-primary-100 transition hover:-translate-y-1 sm:w-64">
    <!-- Gambar produk -->
    <NuxtLink :to="`/product/${product.id}`" class="relative block aspect-[3/4] w-full overflow-hidden bg-blush">
      <img
        :src="product.image_url"
        :alt="product.name"
        class="h-full w-full object-cover transition duration-500 hover:scale-105"
        loading="lazy"
      />
      <div class="absolute right-3 top-3 flex flex-col gap-2">
        <a
          :href="product.shopee_url || SHOPEE_STORE_URL"
          target="_blank"
          rel="noopener"
          title="Beli di Shopee"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft transition hover:scale-110"
          @click.stop
        >
          <BrandMark brand="shopee" class="h-5 w-5" />
        </a>
        <a
          :href="product.tiktok_url || TIKTOK_STORE_URL"
          target="_blank"
          rel="noopener"
          title="Lihat di TikTok Shop"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft transition hover:scale-110"
          @click.stop
        >
          <BrandMark brand="tiktok" class="h-5 w-5" />
        </a>
      </div>
    </NuxtLink>

    <!-- Judul, harga & deskripsi: kontras & ukuran diperbesar biar gampang dibaca -->
    <div class="flex flex-1 flex-col px-4 pt-3.5">
      <NuxtLink :to="`/product/${product.id}`" class="hover:text-primary-600">
        <p class="line-clamp-1 text-sm font-bold leading-snug text-primary-900">{{ product.name }}</p>
      </NuxtLink>
      <p class="mt-1 text-lg font-extrabold leading-none text-primary-600">{{ formatRupiah(product.price) }}</p>
      <p class="mt-2 line-clamp-2 text-[13px] leading-relaxed text-primary-600">{{ product.description }}</p>
    </div>

    <!-- Tombol -->
    <div class="mt-3 flex flex-col gap-2 px-4 pb-4">
      <NuxtLink
        :to="`/product/${product.id}`"
        class="w-full rounded-xl bg-primary-500 py-2.5 text-center text-xs font-semibold text-white shadow-soft transition hover:bg-primary-600 active:scale-95"
      >
        Cek Detail
      </NuxtLink>
      <a
        :href="buildWhatsappLink(product)"
        target="_blank"
        rel="noopener"
        class="w-full rounded-xl border-2 border-primary-500 py-2.5 text-center text-xs font-semibold text-primary-600 transition hover:bg-primary-500 hover:text-white active:scale-95"
      >
        Chat via WhatsApp
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'

defineProps<{ product: Product }>()
</script>
