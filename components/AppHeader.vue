<template>
  <header class="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-5">
    <div
      class="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/50 bg-white/55 px-4 py-2.5 shadow-soft backdrop-blur-xl backdrop-saturate-150 sm:px-6 sm:py-3"
    >
      <NuxtLink to="/" class="flex items-center gap-2" @click="mobileOpen = false">
        <span class="font-script text-xl italic text-primary-700 sm:text-2xl">WOOMAN</span>
        <span class="hidden text-[10px] font-semibold tracking-widest text-primary-500/80 sm:inline">by KHANIA</span>
      </NuxtLink>

      <nav class="hidden items-center gap-7 text-sm font-medium text-primary-800/90 md:flex">
        <NuxtLink to="/" class="transition hover:text-primary-500" active-class="text-primary-600">Beranda</NuxtLink>
        <NuxtLink to="/katalog" class="transition hover:text-primary-500" active-class="text-primary-600">Katalog</NuxtLink>
        <a href="#kontak" class="transition hover:text-primary-500">Kontak</a>
      </nav>

      <div class="flex items-center gap-2">
        <a
          :href="waLink"
          target="_blank"
          rel="noopener"
          class="rounded-2xl bg-primary-500 px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-primary-600 active:scale-95 sm:px-6 sm:py-2.5 sm:text-sm"
        >
          <span class="sm:hidden">WA</span>
          <span class="hidden sm:inline">WhatsApp Admin</span>
        </a>

        <button
          type="button"
          aria-label="Buka menu"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-primary-700 transition hover:bg-white/60 md:hidden"
          @click="mobileOpen = !mobileOpen"
        >
          <svg v-if="!mobileOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Menu mobile -->
    <transition name="fade-slide">
      <div
        v-if="mobileOpen"
        class="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl border border-white/50 bg-white/80 p-3 text-sm font-medium text-primary-800 shadow-soft backdrop-blur-xl md:hidden"
      >
        <NuxtLink to="/" class="rounded-xl px-4 py-2.5 transition hover:bg-primary-100" @click="mobileOpen = false">Beranda</NuxtLink>
        <NuxtLink to="/katalog" class="rounded-xl px-4 py-2.5 transition hover:bg-primary-100" @click="mobileOpen = false">Katalog</NuxtLink>
        <a href="#kontak" class="rounded-xl px-4 py-2.5 transition hover:bg-primary-100" @click="mobileOpen = false">Kontak</a>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
const waLink = `https://wa.me/${WA_ADMIN_NUMBER}?text=${encodeURIComponent(
  'Halo Admin WOOMAN, saya mau tanya-tanya produk ya!'
)}`

const mobileOpen = ref(false)
const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  }
)
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
