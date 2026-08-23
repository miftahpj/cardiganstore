<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-primary-500 via-primary-500 to-blush">
    <div class="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl"></div>

    <div class="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-24 pt-32 sm:pt-36 md:grid-cols-2 md:gap-10 md:pb-28 md:pt-40">
      <!-- Kolom kiri: info toko -->
      <div class="text-center md:text-left">
        <p data-aos="fade-down" class="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
          Holla, Gorgeous
        </p>

        <h1
          data-aos="fade-up"
          class="font-script text-4xl italic leading-tight text-white sm:text-5xl md:text-6xl"
        >
          Born to Stand, Styled to Shine.
        </h1>

        <p data-aos="fade-up" data-aos-delay="100" class="mx-auto mt-5 max-w-md text-sm text-white/90 sm:text-base md:mx-0">
          Tempatnya outfit manis buat perempuan yang suka tampil elegan, feminin, dan effortless. Scroll pelan-pelan
          ya, semoga kamu ketemu cardigan atau outfit yang langsung bikin bilang, "ih ini aku banget!"
        </p>

        <form
          data-aos="fade-up"
          data-aos-delay="150"
          class="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-2xl bg-white p-2 shadow-soft md:mx-0"
          @submit.prevent="onSearch"
        >
          <input
            v-model="query"
            type="text"
            placeholder="Cari cardigan favoritmu..."
            class="w-full rounded-xl bg-transparent px-4 py-2 text-sm text-primary-800 placeholder:text-primary-300 focus:outline-none"
          />
          <button
            type="submit"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white transition hover:bg-primary-600"
            aria-label="Cari"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1 0 6.15 6.15a7.5 7.5 0 0 0 10.5 10.5z" />
            </svg>
          </button>
        </form>

        <div data-aos="fade-up" data-aos-delay="200" class="mt-9">
          <p class="mb-4 text-xs font-semibold uppercase tracking-widest text-white/80">Kunjungi Toko Kami</p>
          <div class="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a
              :href="SHOPEE_STORE_URL"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-orange-600 shadow-soft transition hover:-translate-y-0.5"
            >
              <BrandMark brand="shopee" class="h-5 w-5" /> Shopee: wooman.id
            </a>
            <a
              :href="TIKTOK_STORE_URL"
              target="_blank"
              rel="noopener"
              class="flex items-center gap-2 rounded-2xl bg-primary-900 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
            >
              <BrandMark brand="tiktok" class="h-5 w-5" /> TikTok Shop
            </a>
          </div>
        </div>
      </div>

      <!-- Kolom kanan: tumpukan produk (kartu depan jatuh, kartu kiri naik menggantikan) -->
      <div data-aos="fade-left" data-aos-delay="150" class="relative mx-auto w-full max-w-sm md:max-w-none">
        <div
          class="relative aspect-[4/5] w-full"
          @mouseenter="paused = true"
          @mouseleave="paused = false"
        >
          <div
            v-for="(slide, i) in slides"
            :key="slideKey(i)"
            class="absolute left-0 top-0 h-[92%] w-[88%] overflow-hidden rounded-[1.5rem] shadow-soft transition-all duration-500 ease-out"
            :class="isFront(i) ? 'ring-4 ring-white/40' : ''"
            :style="cardStyle(i)"
          >
            <img :src="slide.image_url" :alt="slide.name" class="h-full w-full object-cover" />
            <div
              v-if="isFront(i)"
              class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-5"
            >
              <p class="text-xs uppercase tracking-widest text-white/80">Best Seller</p>
              <p class="font-semibold text-white">{{ slide.name }}</p>
            </div>
          </div>

          <!-- badge melayang -->
          <div class="absolute -bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-2xl bg-white px-5 py-2.5 text-xs font-semibold text-primary-700 shadow-soft sm:left-4 sm:translate-x-0">
            <AppIcon name="sparkle" class="h-3.5 w-3.5 text-primary-500" />
            Koleksi Favorit Minggu Ini
          </div>

          <!-- indikator titik -->
          <div v-if="slides.length > 1" class="absolute -bottom-5 right-0 z-20 flex items-center gap-1.5 sm:right-4">
            <button
              v-for="(_, i) in slides"
              :key="i"
              class="h-1.5 rounded-full transition-all"
              :class="i === activeIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'"
              :aria-label="`Lihat produk ${i + 1}`"
              @click="goTo(i)"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const query = ref('')
const router = useRouter()

const { products, fetchProducts } = useProducts()

onMounted(() => {
  fetchProducts()
})

const fallbackSlides = [
  { id: 'f1', image_url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800', name: 'Cardigan Knit Blossom' },
  { id: 'f2', image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800', name: 'Cardigan Rib Milea' },
  { id: 'f3', image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', name: 'Outer Vest Aeril' },
  { id: 'f4', image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800', name: 'Cardigan Aksen Kancing' },
  { id: 'f5', image_url: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=800', name: 'Cardigan Oversized Cloudy' }
]

// Ambil sampai 5 produk untuk tumpukan looping; kalau data API belum siap, pakai fallback sementara.
const slides = computed(() => {
  const list = products.value.length ? products.value : fallbackSlides
  return list.slice(0, 5)
})

const activeIndex = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

// id kartu yang sedang animasi "jatuh" keluar dari posisi depan
const exitingKey = ref<string | number | null>(null)
let exitTimer: ReturnType<typeof setTimeout> | null = null

function slideKey(i: number) {
  return slides.value[i]?.id ?? i
}

// posisi relatif kartu ke-i terhadap kartu paling depan (0 = depan, 1 = mengintip di kiri, dst.)
function relativePos(i: number) {
  const len = slides.value.length
  if (!len) return 0
  return (i - activeIndex.value + len) % len
}

function isFront(i: number) {
  return relativePos(i) === 0 && slideKey(i) !== exitingKey.value
}

// gaya tampilan tiap posisi saat diam (bukan sedang berpindah)
const restStyles = [
  { transform: 'translate(0%, 0%) rotate(-2deg) scale(1)', opacity: 1, zIndex: 5 },
  { transform: 'translate(-10%, 6%) rotate(6deg) scale(0.93)', opacity: 1, zIndex: 4 },
  { transform: 'translate(-16%, 10%) rotate(9deg) scale(0.87)', opacity: 0, zIndex: 3 },
  { transform: 'translate(-16%, 10%) rotate(9deg) scale(0.87)', opacity: 0, zIndex: 2 },
  { transform: 'translate(-16%, 10%) rotate(9deg) scale(0.85)', opacity: 0, zIndex: 1 }
]

// kartu yang baru saja digeser dari depan akan "jatuh" ke bawah lalu memudar
const fallingStyle = { transform: 'translate(6%, 65%) rotate(10deg) scale(0.9)', opacity: 0, zIndex: 6 }

function cardStyle(i: number) {
  if (slideKey(i) === exitingKey.value) return fallingStyle
  const pos = relativePos(i)
  return restStyles[Math.min(pos, restStyles.length - 1)]
}

function advance(toIndex?: number) {
  const len = slides.value.length
  if (!len) return
  const frontIdx = slides.value.findIndex((_, idx) => relativePos(idx) === 0)
  const target = toIndex !== undefined ? toIndex : (activeIndex.value + 1) % len
  if (target === activeIndex.value || frontIdx === -1) return

  // kartu depan saat ini jatuh ke bawah, sementara kartu kiri otomatis naik mengisi posisi depan
  exitingKey.value = slideKey(frontIdx)
  activeIndex.value = target

  if (exitTimer) clearTimeout(exitTimer)
  exitTimer = setTimeout(() => {
    exitingKey.value = null
  }, 520)
}

function goTo(i: number) {
  advance(i)
}

function startLoop() {
  stopLoop()
  timer = setInterval(() => {
    if (paused.value) return
    advance()
  }, 3200)
}

function stopLoop() {
  if (timer) clearInterval(timer)
}

onMounted(startLoop)
onBeforeUnmount(() => {
  stopLoop()
  if (exitTimer) clearTimeout(exitTimer)
})

const emit = defineEmits<{ (e: 'search', value: string): void }>()

function onSearch() {
  emit('search', query.value.trim())
  router.push({ path: '/katalog', query: query.value.trim() ? { q: query.value.trim() } : {} })
}
</script>
