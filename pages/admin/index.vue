<template>
  <div class="min-h-screen bg-cream md:flex">
    <AdminSidebar v-model="activeTab" />

    <main class="flex-1 px-5 py-8 md:px-10 md:py-10">
      <!-- Dashboard overview -->
      <div v-if="activeTab === 'dashboard'">
        <h1 class="text-2xl font-bold text-primary-800">Dashboard</h1>
        <p class="mt-1 text-sm text-primary-500">Ringkasan singkat toko WOOMAN by Khania.</p>

        <div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div class="rounded-2xl bg-white p-6 shadow-soft">
            <p class="text-xs font-semibold uppercase tracking-widest text-primary-400">Total Produk</p>
            <p class="mt-2 text-3xl font-bold text-primary-700">{{ products.length }}</p>
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
      <div v-else>
        <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl font-bold text-primary-800">Kelola Produk</h1>
            <p class="mt-1 text-sm text-primary-500">Tambah, ubah, atau hapus produk katalog WOOMAN.</p>
          </div>
          <button class="btn-primary" @click="openCreateModal">+ Tambah Produk</button>
        </div>

        <div v-if="loading" class="py-10 text-center text-primary-400">Memuat data...</div>
        <div v-else-if="error" class="rounded-xl bg-red-50 p-6 text-center text-sm text-red-500">{{ error }}</div>

        <div v-else class="overflow-x-auto rounded-xl bg-white shadow-soft">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead class="bg-blush text-primary-700">
              <tr>
                <th class="p-4">Foto</th>
                <th class="p-4">Nama</th>
                <th class="p-4">Harga</th>
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
                <td class="p-4 font-medium text-primary-800">{{ product.name }}</td>
                <td class="p-4 text-primary-600">{{ formatRupiah(product.price) }}</td>
                <td class="max-w-[140px] truncate p-4 text-primary-400">{{ product.shopee_url }}</td>
                <td class="max-w-[140px] truncate p-4 text-primary-400">{{ product.tiktok_url }}</td>
                <td class="p-4 text-right">
                  <button class="mr-3 text-primary-500 hover:text-primary-700" @click="openEditModal(product)">Edit</button>
                  <button class="text-red-400 hover:text-red-600" @click="confirmDelete(product)">Hapus</button>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="6" class="p-8 text-center text-primary-400">Belum ada produk.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal Create/Edit -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft">
        <h2 class="mb-4 text-lg font-bold text-primary-800">
          {{ editingId ? 'Edit Produk' : 'Tambah Produk' }}
        </h2>

        <form class="space-y-4" @submit.prevent="submitForm">
          <div>
            <label class="text-xs font-semibold text-primary-500">Nama Produk</label>
            <input v-model="form.name" required class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none" />
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

definePageMeta({ layout: 'default' })

const { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts()

onMounted(() => {
  fetchProducts()
})

const activeTab = ref<'dashboard' | 'produk'>('dashboard')

const averagePrice = computed(() => {
  if (products.value.length === 0) return 0
  const total = products.value.reduce((sum, p) => sum + Number(p.price), 0)
  return Math.round(total / products.value.length)
})

const showModal = ref(false)
const editingId = ref<number | null>(null)
const submitting = ref(false)

const emptyForm = () => ({
  name: '',
  description: '',
  image_url: '',
  price: 0,
  shopee_url: '',
  tiktok_url: ''
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
    description: product.description,
    image_url: product.image_url,
    price: Number(product.price),
    shopee_url: product.shopee_url,
    tiktok_url: product.tiktok_url
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
</script>
