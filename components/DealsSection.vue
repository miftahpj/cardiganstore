<template>
  <section id="deals" class="scroll-mt-28 bg-blush py-16 md:py-24">
    <div class="mx-auto max-w-6xl px-5">
      <div data-aos="fade-up" class="mb-10 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-primary-400">Deals & Exclusive</p>
        <h2 class="section-title mt-2">Kenapa Belanja di WOOMAN?</h2>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(deal, i) in deals"
          :key="deal.title"
          :data-aos="'fade-up'"
          :data-aos-delay="i * 100"
          class="rounded-2xl bg-white p-6 shadow-soft"
        >
          <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <AppIcon :name="deal.icon" class="h-6 w-6" />
          </div>
          <h3 class="font-semibold text-primary-800">{{ deal.title }}</h3>
          <p class="mt-2 text-sm text-primary-500">{{ deal.description }}</p>
        </div>
      </div>

      <div
        data-aos="fade-up"
        class="mt-10 flex flex-col items-center justify-between gap-6 rounded-2xl bg-primary-500 p-8 text-center text-white sm:flex-row sm:text-left"
      >
        <div>
          <h3 class="font-script text-2xl italic">Cardigan baru tiap minggu, jangan sampai kehabisan!</h3>
          <p class="mt-1 text-sm text-white/80">Follow TikTok & Instagram kami untuk info restock pertama kali.</p>
        </div>
        <a :href="TIKTOK_STORE_URL" target="_blank" rel="noopener" class="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary-600 shrink-0">
          Follow @woomanbykhania
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const deals = [
  {
    icon: 'truck',
    title: 'Pengiriman Cepat',
    description: 'Pesanan diproses maksimal 1x24 jam setelah pembayaran dikonfirmasi.'
  },
  {
    icon: 'heart',
    title: 'Bahan Adem & Nyaman',
    description: 'Setiap cardigan dipilih dengan bahan berkualitas yang nyaman dipakai seharian.'
  },
  {
    icon: 'check-circle',
    title: 'Original & Terpercaya',
    description: 'Ratusan pelanggan sudah membuktikan kualitas produk WOOMAN.'
  }
]
</script>
