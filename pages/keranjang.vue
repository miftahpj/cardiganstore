<template>
  <div>
    <AppHeader />

    <section class="mx-auto max-w-4xl px-5 pb-16 pt-28 sm:pt-32">
      <h1 class="section-title">Keranjang Saya</h1>

      <!-- Keranjang kosong -->
      <div v-if="items.length === 0" class="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-blush p-10 text-center">
        <AppIcon name="cart" class="h-12 w-12 text-primary-300" />
        <p class="text-primary-600">Keranjangmu masih kosong. Yuk pilih produk favoritmu dulu.</p>
        <NuxtLink to="/katalog" class="btn-primary">Lihat Katalog</NuxtLink>
      </div>

      <!-- Daftar item -->
      <div v-else class="mt-8 grid gap-8 md:grid-cols-3">
        <div class="flex flex-col gap-4 md:col-span-2">
          <div
            v-for="item in items"
            :key="item.id"
            class="flex gap-4 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-primary-100"
          >
            <NuxtLink :to="`/product/${item.id}`" class="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-blush">
              <img :src="item.image_url" :alt="item.name" class="h-full w-full object-cover" />
            </NuxtLink>

            <div class="flex flex-1 flex-col justify-between">
              <div>
                <NuxtLink :to="`/product/${item.id}`" class="line-clamp-1 text-sm font-bold text-primary-900 hover:text-primary-600">
                  {{ item.name }}
                </NuxtLink>
                <p v-if="item.code" class="mt-0.5 text-xs font-mono text-primary-500">Kode: {{ item.code }}</p>
                <p class="mt-1 text-sm font-bold text-primary-600">{{ formatRupiah(item.price) }}</p>
              </div>

              <div class="mt-2 flex items-center justify-between">
                <div class="flex items-center gap-2 rounded-lg bg-blush px-1.5 py-1">
                  <button
                    type="button"
                    aria-label="Kurangi jumlah"
                    class="flex h-6 w-6 items-center justify-center rounded-md bg-white text-primary-600 shadow-soft transition active:scale-90"
                    @click="decrement(item.id)"
                  >
                    <AppIcon name="minus" class="h-3 w-3" />
                  </button>
                  <span class="w-4 text-center text-xs font-bold text-primary-800">{{ item.qty }}</span>
                  <button
                    type="button"
                    aria-label="Tambah jumlah"
                    class="flex h-6 w-6 items-center justify-center rounded-md bg-white text-primary-600 shadow-soft transition active:scale-90"
                    @click="increment(item.id)"
                  >
                    <AppIcon name="plus" class="h-3 w-3" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Hapus dari keranjang"
                  class="flex h-8 w-8 items-center justify-center rounded-lg text-primary-400 transition hover:bg-red-50 hover:text-red-500"
                  @click="removeFromCart(item.id)"
                >
                  <AppIcon name="trash" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            class="mt-1 w-fit text-xs font-semibold text-primary-400 underline-offset-2 hover:text-red-500 hover:underline"
            @click="clearCart"
          >
            Kosongkan keranjang
          </button>
        </div>

        <!-- Ringkasan & checkout -->
        <div class="h-fit rounded-2xl bg-blush p-5 shadow-soft md:sticky md:top-28">
          <p class="font-semibold text-primary-800">Ringkasan Pesanan</p>
          <div class="mt-3 flex items-center justify-between text-sm text-primary-600">
            <span>Total item</span>
            <span class="font-semibold">{{ totalItems }}</span>
          </div>
          <div class="mt-1 flex items-center justify-between text-sm text-primary-600">
            <span>Total harga</span>
            <span class="font-bold text-primary-800">{{ formatRupiah(totalPrice) }}</span>
          </div>

          <a
            :href="checkoutLink"
            target="_blank"
            rel="noopener"
            class="btn-primary mt-5 flex w-full items-center justify-center gap-2"
          >
            Checkout via WhatsApp
          </a>
          <p class="mt-3 text-center text-[11px] leading-relaxed text-primary-500">
            Kamu akan diarahkan ke WhatsApp Admin untuk konfirmasi pesanan dan pembayaran.
          </p>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
const { items, totalItems, totalPrice, removeFromCart, increment, decrement, clearCart } = useCart()
const { settings } = useStoreSettings()

const checkoutLink = computed(() => buildCartWhatsappLink(items.value, settings.value.whatsapp_number))

useHead({
  title: 'Keranjang Saya | WOOMAN by Khania',
  meta: [{ name: 'description', content: 'Keranjang belanja WOOMAN by Khania - checkout mudah lewat WhatsApp.' }]
})
</script>
