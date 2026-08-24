<template>
  <footer id="kontak" class="scroll-mt-10 bg-primary-900 pb-8 pt-16 text-primary-100">
    <div class="mx-auto max-w-6xl px-5">
      <!-- Info kontak + update koleksi + peta -->
      <div class="mb-14 grid gap-5 md:grid-cols-2">
        <!-- Kartu lokasi & kontak -->
        <div data-aos="fade-up" class="flex flex-col justify-center gap-4 rounded-2xl bg-primary-800/60 p-6 ring-1 ring-white/10 md:p-8">
          <div class="flex items-center gap-3 rounded-xl bg-primary-900/60 px-4 py-3">
            <AppIcon name="map-pin" class="h-5 w-5 shrink-0 text-primary-200" />
            <div>
              <p class="text-sm font-semibold text-white">WOOMAN by Khania — Tasikmalaya</p>
              <a :href="waLink" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-xs text-primary-200 hover:text-white">
                <AppIcon name="chat" class="h-3.5 w-3.5" />
                0857 5916 9693
              </a>
            </div>
          </div>
          <p class="text-xs text-primary-300">
            Order & konsultasi langsung lewat WhatsApp, atau mampir ke etalase online kami di Shopee &amp; TikTok Shop.
          </p>
        </div>

        <!-- Update koleksi + peta -->
        <div data-aos="fade-up" data-aos-delay="100" class="flex flex-col gap-5">
          <div class="rounded-2xl bg-primary-800/60 p-6 ring-1 ring-white/10 md:p-8">
            <h3 class="text-sm font-semibold text-white">Stay Updated, Jangan Sampai Kehabisan</h3>
            <p class="mt-1 text-xs text-primary-300">
              Gabung Saluran WhatsApp kami, kami kabari duluan setiap ada cardigan baru & promo.
            </p>
            <a
              :href="WA_CHANNEL_URL"
              target="_blank"
              rel="noopener"
              class="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-primary-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
            >
              <AppIcon name="chat" class="h-4 w-4" /> Gabung Saluran WhatsApp
            </a>
          </div>

          <div class="h-48 w-full overflow-hidden rounded-2xl ring-1 ring-white/10 md:h-full md:min-h-[140px]">
            <iframe
              title="Lokasi WOOMAN by Khania"
              src="https://maps.google.com/maps?q=Tasikmalaya&z=13&output=embed"
              width="100%"
              height="100%"
              style="border: 0; min-height: 140px"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Kolom footer utama -->
      <div class="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div data-aos="fade-up">
          <span class="font-script text-2xl italic text-white">WOOMAN</span>
          <p class="mt-1 text-xs uppercase tracking-widest text-primary-300">by Khania</p>
          <p class="mt-4 max-w-xs text-sm text-primary-200">
            Tempatnya outfit manis buat perempuan yang suka tampil elegan, feminin, dan effortless.
          </p>
        </div>

        <div data-aos="fade-up" data-aos-delay="100" class="grid grid-cols-2 gap-6 text-sm text-primary-200">
          <ul class="space-y-3">
            <li><NuxtLink to="/" class="hover:text-white">Beranda</NuxtLink></li>
            <li><NuxtLink to="/katalog" class="hover:text-white">Katalog</NuxtLink></li>
            <li><a href="#kontak" class="hover:text-white">Kontak</a></li>
          </ul>
          <ul class="space-y-3">
            <li><span class="cursor-default">Cara Belanja</span></li>
            <li><span class="cursor-default">Kebijakan Privasi</span></li>
            <li><span class="cursor-default">Syarat &amp; Ketentuan</span></li>
            <li><span class="cursor-default">FAQ</span></li>
          </ul>
        </div>

        <div data-aos="fade-up" data-aos-delay="200">
          <h4 class="text-sm font-semibold text-white">Ikuti Kami</h4>
          <div class="mt-4 flex items-center gap-4">
            <a :href="INSTAGRAM_URL" target="_blank" rel="noopener" aria-label="Instagram" class="transition hover:text-primary-300">
              <AppIcon name="camera" class="h-5 w-5" />
            </a>
            <a :href="settings.tiktok_url" target="_blank" rel="noopener" aria-label="TikTok" class="transition hover:opacity-80">
              <BrandMark brand="tiktok" class="h-5 w-5" />
            </a>
            <a :href="settings.shopee_url" target="_blank" rel="noopener" aria-label="Shopee" class="transition hover:opacity-80">
              <BrandMark brand="shopee" class="h-5 w-5" />
            </a>
            <a :href="waLink" target="_blank" rel="noopener" aria-label="WhatsApp" class="transition hover:text-primary-300">
              <AppIcon name="chat" class="h-5 w-5" />
            </a>
          </div>

          <h4 class="mt-6 text-sm font-semibold text-white">Belanja Lewat</h4>
          <div class="mt-3 flex flex-col gap-2">
            <a :href="settings.shopee_url" target="_blank" rel="noopener" class="flex items-center gap-2 rounded-2xl border border-white/20 px-4 py-2 text-xs font-medium text-primary-100 transition hover:bg-white/10">
              <BrandMark brand="shopee" class="h-4 w-4" /> Shopee: wooman.id
            </a>
            <a :href="settings.tiktok_url" target="_blank" rel="noopener" class="flex items-center gap-2 rounded-2xl border border-white/20 px-4 py-2 text-xs font-medium text-primary-100 transition hover:bg-white/10">
              <BrandMark brand="tiktok" class="h-4 w-4" /> TikTok Shop
            </a>
          </div>
        </div>
      </div>

      <!-- Info pembayaran -->
      <div data-aos="fade-up" class="mt-12 rounded-xl bg-primary-800/60 p-5 text-sm text-primary-200 ring-1 ring-white/10">
        <p class="font-semibold text-white">Info Pembayaran</p>
        <p class="mt-1">
          No. Rekening resmi WOOMAN a.n. <span class="font-semibold text-white">Iskania Janah</span>. Demi keamanan,
          pastikan nama penerima adalah Iskania Janah sebelum melakukan pembayaran.
        </p>
      </div>

      <div class="mt-10 border-t border-white/10 pt-6 text-center text-xs text-primary-400">
        © {{ new Date().getFullYear() }} WOOMAN by Khania. All Rights Reserved. Wear confidence. Wear WOOMAN.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { settings } = useStoreSettings()

const waLink = `https://wa.me/${WA_ADMIN_NUMBER}?text=${encodeURIComponent(
  'Halo Admin WOOMAN, saya mau tanya-tanya produk ya!'
)}`
</script>
