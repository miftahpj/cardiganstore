<template>
  <section id="deals" class="scroll-mt-28 bg-blush py-16 md:py-24">
    <div class="mx-auto max-w-6xl px-5">
      <div data-aos="fade-up" class="relative mb-10 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-primary-400">Deals & Exclusive</p>
        <h2 class="section-title mt-2">Kenapa Belanja di WOOMAN?</h2>
        <p class="mx-auto mt-2 max-w-md text-sm text-primary-500">Alasan ratusan pelanggan balik lagi belanja outfit di WOOMAN.</p>

        <div class="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-between px-1 sm:flex">
          <button
            type="button"
            aria-label="Sebelumnya"
            class="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-500 shadow-soft transition hover:bg-primary-100"
            @click="scroll(-1)"
          >
            <AppIcon name="arrow-left" class="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            class="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-500 shadow-soft transition hover:bg-primary-100"
            @click="scroll(1)"
          >
            <AppIcon name="arrow-right" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref="trackRef"
        data-aos="fade-up"
        data-aos-delay="100"
        class="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-4 sm:justify-center"
      >
        <div
          v-for="(deal, i) in deals"
          :key="deal.title"
          :data-aos="'fade-up'"
          :data-aos-delay="i * 100"
          class="w-72 shrink-0 snap-center rounded-2xl p-6 shadow-soft transition sm:w-80"
          :class="deal.featured ? 'scale-[1.03] bg-primary-500 text-white' : 'bg-white text-primary-800'"
        >
          <div
            class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
            :class="deal.featured ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-600'"
          >
            <AppIcon :name="deal.icon" class="h-6 w-6" />
          </div>
          <h3 class="font-semibold" :class="deal.featured ? 'text-white' : 'text-primary-800'">{{ deal.title }}</h3>
          <p class="mt-2 text-sm" :class="deal.featured ? 'text-white/80' : 'text-primary-500'">{{ deal.description }}</p>
        </div>
      </div>

      <div
        data-aos="fade-up"
        class="mt-10 grid gap-8 rounded-2xl bg-gradient-to-br from-primary-800 to-primary-900 p-8 text-white shadow-soft md:grid-cols-2 md:items-center md:p-12"
      >
        <div class="text-center md:text-left">
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-primary-200">Jangan Ketinggalan</p>
          <h3 class="mt-2 font-script text-2xl italic sm:text-3xl">Cardigan baru tiap minggu, jangan sampai kehabisan!</h3>
          <p class="mt-3 max-w-sm text-sm text-primary-100 md:mx-0">
            Follow TikTok & Instagram kami untuk info restock pertama kali, promo eksklusif, dan outfit inspo tiap hari.
          </p>
          <a
            :href="settings.tiktok_url"
            target="_blank"
            rel="noopener"
            class="btn-outline !border-white !text-white hover:!bg-white hover:!text-primary-700 mt-6 inline-flex"
          >
            Follow @woomanbykhania
          </a>
        </div>

        <div class="grid gap-3">
          <div v-for="perk in perks" :key="perk" class="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm">
            <AppIcon name="check-circle" class="h-4 w-4 shrink-0 text-primary-200" />
            {{ perk }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { settings } = useStoreSettings()

interface Deal {
  icon: string
  title: string
  description: string
  featured?: boolean
}

const deals: Deal[] = [
  {
    icon: 'truck',
    title: 'Pengiriman Cepat',
    description: 'Pesanan diproses maksimal 1x24 jam setelah pembayaran dikonfirmasi.'
  },
  {
    icon: 'heart',
    title: 'Bahan Adem & Nyaman',
    description: 'Setiap cardigan dipilih dengan bahan berkualitas yang nyaman dipakai seharian.',
    featured: true
  },
  {
    icon: 'check-circle',
    title: 'Original & Terpercaya',
    description: 'Ratusan pelanggan sudah membuktikan kualitas produk WOOMAN.'
  }
]

const perks = [
  'Pengiriman ke seluruh Indonesia',
  'Bahan adem, nyaman dipakai seharian',
  'Update koleksi baru tiap minggu'
]

const trackRef = ref<HTMLElement | null>(null)

function scroll(direction: 1 | -1) {
  trackRef.value?.scrollBy({ left: direction * 336, behavior: 'smooth' })
}
</script>
