<template>
  <div class="min-h-screen bg-cream md:flex">
    <AdminSidebar v-model="activeTab" />

    <main class="flex-1 px-5 py-8 md:px-10 md:py-10">
      <!-- Dashboard overview -->
      <div v-if="activeTab === 'dashboard'">
        <h1 class="text-2xl font-bold text-primary-800">Dashboard</h1>
        <p class="mt-1 text-sm text-primary-500">Ringkasan singkat toko WOOMAN by Khania.</p>

        <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div class="rounded-2xl bg-white p-6 shadow-soft">
            <p class="text-xs font-semibold uppercase tracking-widest text-primary-400">Total Produk</p>
            <p class="mt-2 text-3xl font-bold text-primary-700">{{ products.length }}</p>
          </div>
          <div class="rounded-2xl bg-white p-6 shadow-soft">
            <p class="text-xs font-semibold uppercase tracking-widest text-primary-400">Produk Aktif</p>
            <p class="mt-2 text-3xl font-bold text-primary-700">{{ activeCount }}</p>
          </div>
          <div class="rounded-2xl bg-white p-6 shadow-soft">
            <p class="text-xs font-semibold uppercase tracking-widest text-primary-400">Harga Rata-rata</p>
            <p class="mt-2 text-3xl font-bold text-primary-700">{{ formatRupiah(averagePrice) }}</p>
          </div>
          <div class="rounded-2xl bg-white p-6 shadow-soft">
            <p class="text-xs font-semibold uppercase tracking-widest text-primary-400">Produk Terbaru</p>
            <p class="mt-2 truncate text-lg font-semibold text-primary-700">{{ products[0]?.name || '-' }}</p>
          </div>
        </div>

        <div class="mt-8 rounded-2xl bg-white p-6 shadow-soft">
          <h2 class="font-semibold text-primary-800">Mulai Kelola Produk</h2>
          <p class="mt-1 text-sm text-primary-500">Tambah, ubah, atau hapus produk dari menu "Kelola Produk" di samping.</p>
          <button class="btn-primary mt-4" @click="activeTab = 'produk'">Buka Kelola Produk →</button>
        </div>
      </div>

      <!-- Kelola Produk -->
      <div v-else-if="activeTab === 'produk'">
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold text-primary-800">Kelola Produk</h1>
            <p class="mt-1 text-sm text-primary-500">Tambah, ubah, atau hapus produk katalog WOOMAN.</p>
          </div>
          <button class="btn-primary" @click="openCreateModal">+ Tambah Produk</button>
        </div>

        <!-- Filter & pencarian -->
        <div class="mb-5 grid gap-3 rounded-xl bg-white p-4 shadow-soft sm:grid-cols-[1fr_auto_auto]">
          <input
            v-model="filters.q"
            type="text"
            placeholder="Cari nama atau kode produk..."
            class="w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
          />
          <select
            v-model="filters.status"
            class="rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <select
            v-model="filters.sort"
            class="rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>

        <div v-if="loading" class="py-10 text-center text-primary-400">Memuat data...</div>
        <div v-else-if="error" class="rounded-xl bg-red-50 p-6 text-center text-sm text-red-500">{{ error }}</div>

        <div v-else class="overflow-x-auto rounded-xl bg-white shadow-soft">
          <table class="w-full min-w-[820px] text-left text-sm">
            <thead class="bg-blush text-primary-700">
              <tr>
                <th class="p-4">Foto</th>
                <th class="p-4">Kode</th>
                <th class="p-4">Nama</th>
                <th class="p-4">Harga</th>
                <th class="p-4">Status</th>
                <th class="p-4">Shopee</th>
                <th class="p-4">TikTok</th>
                <th class="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id" class="border-t border-blush">
                <td class="p-4">
                  <img :src="product.image_url" :alt="product.name" class="h-14 w-14 rounded-lg object-cover" />
                </td>
                <td class="p-4 font-mono text-xs text-primary-500">{{ product.code || '-' }}</td>
                <td class="p-4 font-medium text-primary-800">{{ product.name }}</td>
                <td class="p-4 text-primary-600">{{ formatRupiah(product.price) }}</td>
                <td class="p-4">
                  <button
                    type="button"
                    class="rounded-full px-3 py-1 text-xs font-semibold transition"
                    :class="product.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-primary-100 text-primary-400 hover:bg-primary-200'"
                    :disabled="togglingId === product.id"
                    @click="onToggleActive(product)"
                  >
                    {{ product.is_active ? 'Aktif' : 'Nonaktif' }}
                  </button>
                </td>
                <td class="max-w-[140px] truncate p-4 text-primary-400">{{ product.shopee_url }}</td>
                <td class="max-w-[140px] truncate p-4 text-primary-400">{{ product.tiktok_url }}</td>
                <td class="p-4 text-right">
                  <button class="mr-3 text-primary-500 hover:text-primary-700" @click="openEditModal(product)">Edit</button>
                  <button class="text-red-400 hover:text-red-600" @click="confirmDelete(product)">Hapus</button>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="8" class="p-8 text-center text-primary-400">Belum ada produk yang cocok.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Kelola Beranda -->
      <div v-else-if="activeTab === 'beranda'">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-primary-800">Kelola Beranda</h1>
          <p class="mt-1 text-sm text-primary-500">
            Pilih produk yang ingin ditampilkan di bagian "Katalog Baju" halaman beranda. Hanya produk aktif yang bisa ditampilkan.
          </p>
        </div>

        <div v-if="loading" class="py-10 text-center text-primary-400">Memuat data...</div>
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label
            v-for="product in activeProducts"
            :key="product.id"
            class="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-4 shadow-soft ring-1 ring-transparent transition"
            :class="product.is_featured ? '!ring-primary-400' : ''"
          >
            <input
              type="checkbox"
              class="h-4 w-4 accent-primary-500"
              :checked="product.is_featured"
              :disabled="togglingId === product.id"
              @change="onToggleFeatured(product)"
            />
            <img :src="product.image_url" :alt="product.name" class="h-12 w-12 shrink-0 rounded-lg object-cover" />
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-primary-800">{{ product.name }}</p>
              <p class="text-xs text-primary-400">{{ product.code || '-' }} · {{ formatRupiah(product.price) }}</p>
            </div>
          </label>

          <p v-if="activeProducts.length === 0" class="text-sm text-primary-400">
            Belum ada produk aktif. Aktifkan produk dulu di menu "Kelola Produk".
          </p>
        </div>
      </div>

      <!-- Kelola Toko -->
      <div v-else-if="activeTab === 'toko'">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-primary-800">Kelola Toko</h1>
          <p class="mt-1 text-sm text-primary-500">Atur link toko Shopee & TikTok Shop yang tampil di seluruh halaman website.</p>
        </div>

        <form class="max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-soft" @submit.prevent="submitStoreSettings">
          <div>
            <label class="text-xs font-semibold text-primary-500">Link Toko Shopee</label>
            <input
              v-model="storeForm.shopee_url"
              type="url"
              placeholder="https://shopee.co.id/nama-toko"
              class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
            />
          </div>
          <div>
            <label class="text-xs font-semibold text-primary-500">Link Toko TikTok Shop</label>
            <input
              v-model="storeForm.tiktok_url"
              type="url"
              placeholder="https://www.tiktok.com/@nama-toko"
              class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
            />
          </div>

          <p v-if="storeSaved" class="text-xs font-medium text-green-600">Pengaturan toko tersimpan.</p>

          <div class="flex justify-end pt-2">
            <button type="submit" class="btn-primary !px-5 !py-2 text-xs" :disabled="savingStore">
              {{ savingStore ? 'Menyimpan...' : 'Simpan Pengaturan' }}
            </button>
          </div>
        </form>
      </div>
    </main>

    <!-- Modal Create/Edit Produk -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft">
        <h2 class="mb-4 text-lg font-bold text-primary-800">
          {{ editingId ? 'Edit Produk' : 'Tambah Produk' }}
        </h2>

        <form class="max-h-[75vh] space-y-4 overflow-y-auto pr-1" @submit.prevent="submitForm">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-primary-500">Nama Produk</label>
              <input v-model="form.name" required class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none" />
            </div>
            <div>
              <label class="text-xs font-semibold text-primary-500">Kode Produk</label>
              <input
                v-model="form.code"
                placeholder="cth. CK-001"
                class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label class="text-xs font-semibold text-primary-500">Deskripsi</label>
            <textarea v-model="form.description" rows="3" class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"></textarea>
          </div>
          <div>
            <label class="text-xs font-semibold text-primary-500">URL Gambar</label>
            <input v-model="form.image_url" class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none" />
          </div>
          <div>
            <label class="text-xs font-semibold text-primary-500">Harga (Rp)</label>
            <input v-model.number="form.price" type="number" required class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-primary-500">Link Shopee</label>
              <input v-model="form.shopee_url" class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none" />
            </div>
            <div>
              <label class="text-xs font-semibold text-primary-500">Link TikTok</label>
              <input v-model="form.tiktok_url" class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none" />
            </div>
          </div>

          <div class="flex items-center gap-5 pt-1">
            <label class="flex items-center gap-2 text-xs font-semibold text-primary-600">
              <input v-model="form.is_active" type="checkbox" class="h-4 w-4 accent-primary-500" />
              Aktif (tampil di website)
            </label>
            <label class="flex items-center gap-2 text-xs font-semibold text-primary-600">
              <input v-model="form.is_featured" type="checkbox" class="h-4 w-4 accent-primary-500" />
              Tampilkan di beranda
            </label>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" class="btn-outline !px-5 !py-2 text-xs" @click="closeModal">Batal</button>
            <button type="submit" class="btn-primary !px-5 !py-2 text-xs" :disabled="submitting">
              {{ submitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useProducts'
import type { AdminTab } from '~/components/AdminSidebar.vue'

definePageMeta({ layout: 'default' })

const { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct, toggleActive, toggleFeatured } =
  useAdminProducts()
const { settings, fetchSettings, updateSettings } = useStoreSettings()

const activeTab = ref<AdminTab>('dashboard')

const filters = reactive({
  q: '',
  status: 'all' as 'all' | 'active' | 'inactive',
  sort: 'newest' as 'newest' | 'oldest'
})

function reload() {
  fetchProducts({ q: filters.q, status: filters.status, sort: filters.sort })
}

onMounted(() => {
  reload()
  fetchSettings()
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(
  () => filters.q,
  () => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(reload, 350)
  }
)
watch([() => filters.status, () => filters.sort], reload)

const activeCount = computed(() => products.value.filter((p) => p.is_active).length)
const activeProducts = computed(() => products.value.filter((p) => p.is_active))

const averagePrice = computed(() => {
  if (products.value.length === 0) return 0
  const total = products.value.reduce((sum, p) => sum + Number(p.price), 0)
  return Math.round(total / products.value.length)
})

const togglingId = ref<number | null>(null)

async function onToggleActive(product: Product) {
  togglingId.value = product.id
  try {
    await toggleActive(product)
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'Gagal mengubah status produk.')
  } finally {
    togglingId.value = null
  }
}

async function onToggleFeatured(product: Product) {
  togglingId.value = product.id
  try {
    await toggleFeatured(product)
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'Gagal mengubah status beranda.')
  } finally {
    togglingId.value = null
  }
}

const showModal = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)

const emptyForm = () => ({
  name: '',
  code: '',
  description: '',
  image_url: '',
  price: 0,
  shopee_url: '',
  tiktok_url: '',
  is_active: true,
  is_featured: false
})

const form = ref(emptyForm())

function openCreateModal() {
  editingId.value = null
  form.value = emptyForm()
  showModal.value = true
}

function openEditModal(product: Product) {
  editingId.value = product.id
  form.value = {
    name: product.name,
    code: product.code || '',
    description: product.description,
    image_url: product.image_url,
    price: Number(product.price),
    shopee_url: product.shopee_url,
    tiktok_url: product.tiktok_url,
    is_active: product.is_active,
    is_featured: product.is_featured
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  submitting.value = true
  try {
    if (editingId.value) {
      await updateProduct(editingId.value, form.value)
    } else {
      await createProduct(form.value)
    }
    showModal.value = false
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'Gagal menyimpan produk.')
  } finally {
    submitting.value = false
  }
}

async function confirmDelete(product: Product) {
  if (confirm(`Hapus produk "${product.name}"?`)) {
    await deleteProduct(product.id)
  }
}

// Kelola Toko
const storeForm = reactive({ shopee_url: '', tiktok_url: '' })
const savingStore = ref(false)
const storeSaved = ref(false)

watch(
  settings,
  (val) => {
    storeForm.shopee_url = val.shopee_url
    storeForm.tiktok_url = val.tiktok_url
  },
  { immediate: true }
)

async function submitStoreSettings() {
  savingStore.value = true
  storeSaved.value = false
  try {
    await updateSettings({ shopee_url: storeForm.shopee_url, tiktok_url: storeForm.tiktok_url })
    storeSaved.value = true
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'Gagal menyimpan pengaturan toko.')
  } finally {
    savingStore.value = false
  }
}
</script>
