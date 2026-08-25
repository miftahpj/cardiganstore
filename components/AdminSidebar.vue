<template>
  <!-- Topbar mobile -->
  <div class="flex items-center justify-between border-b border-primary-100 bg-white px-5 py-4 md:hidden">
    <div>
      <span class="font-script text-xl italic text-primary-600">WOOMAN</span>
      <span class="ml-2 text-xs font-semibold uppercase tracking-widest text-primary-400">Admin</span>
    </div>
    <button
      type="button"
      aria-label="Buka menu admin"
      class="flex h-9 w-9 items-center justify-center rounded-full text-primary-600 hover:bg-blush"
      @click="mobileOpen = !mobileOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>

  <!-- Overlay mobile -->
  <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-black/30 md:hidden" @click="mobileOpen = false"></div>

  <!-- Sidebar -->
  <aside
    class="z-50 flex w-72 shrink-0 flex-col bg-primary-900 px-4 py-6 text-primary-100 transition-transform duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0"
    :class="mobileOpen ? 'fixed inset-y-0 left-0 translate-x-0' : 'fixed inset-y-0 -left-72 md:relative md:left-0'"
  >
    <div class="mb-8 px-2">
      <span class="font-script text-2xl italic text-white">WOOMAN</span>
      <p class="text-xs uppercase tracking-widest text-primary-300">Admin Panel</p>
    </div>

    <nav class="flex flex-1 flex-col gap-1">
      <button
        v-for="item in menu"
        :key="item.key"
        type="button"
        class="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition"
        :class="modelValue === item.key ? 'bg-white/10 text-white' : 'text-primary-200 hover:bg-white/5'"
        @click="select(item.key)"
      >
        <AppIcon :name="item.icon" class="h-5 w-5" /> {{ item.label }}
      </button>
    </nav>

    <NuxtLink
      to="/"
      class="mt-4 flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-primary-200 transition hover:bg-white/5"
    >
      <AppIcon name="arrow-left" class="h-4 w-4" /> Kembali ke Website
    </NuxtLink>
  </aside>
</template>

<script setup lang="ts">
export type AdminTab = 'dashboard' | 'produk' | 'beranda' | 'profil'

defineProps<{ modelValue: AdminTab }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: AdminTab): void }>()

const menu: { key: AdminTab; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: 'chart-bar' },
  { key: 'produk', label: 'Kelola Produk', icon: 'hanger' },
  { key: 'beranda', label: 'Kelola Beranda', icon: 'sparkle' },
  { key: 'profil', label: 'Kelola Profile', icon: 'user' }
]

const mobileOpen = ref(false)

function select(tab: AdminTab) {
  emit('update:modelValue', tab)
  mobileOpen.value = false
}
</script>
