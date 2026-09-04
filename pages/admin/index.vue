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

        <!-- Kelola Kategori -->
        <div class="mb-5 rounded-xl bg-white p-4 shadow-soft">
          <p class="mb-2.5 text-xs font-semibold uppercase tracking-widest text-primary-400">Kategori Produk</p>
          <div class="flex flex-wrap items-center gap-2">
            <span
              v-for="c in categories"
              :key="c.id"
              class="inline-flex items-center gap-1.5 rounded-full bg-blush px-3 py-1.5 text-xs font-semibold text-primary-700"
            >
              {{ c.name }}
              <button
                type="button"
                title="Hapus kategori"
                class="text-primary-400 transition hover:text-red-500"
                @click="removeCategory(c)"
              >
                <AppIcon name="x" class="h-3 w-3" />
              </button>
            </span>
            <span v-if="categories.length === 0" class="text-xs text-primary-400">Belum ada kategori.</span>

            <form class="ml-1 flex items-center gap-2" @submit.prevent="addCategory">
              <input
                v-model="newCategoryName"
                type="text"
                placeholder="Kategori baru, cth. Cardigan"
                class="rounded-lg border border-blush px-3 py-1.5 text-xs focus:border-primary-400 focus:outline-none"
              />
              <button
                type="submit"
                class="rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-600"
                :disabled="addingCategory"
              >
                + Tambah
              </button>
            </form>
          </div>
        </div>

        <!-- Filter & pencarian -->
        <div class="mb-5 flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow-soft">
          <input
            v-model="filters.q"
            type="text"
            placeholder="Cari nama atau kode produk..."
            class="min-w-[200px] flex-1 rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
          />
          <select
            v-model="filters.category_id"
            class="rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none sm:w-48"
          >
            <option value="">Semua Kategori</option>
            <option v-for="c in categories" :key="c.id" :value="String(c.id)">{{ c.name }}</option>
          </select>
          <select
            v-model="filters.status"
            class="rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none sm:w-40"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <select
            v-model="filters.sort"
            class="rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none sm:w-36"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>

        <div v-if="loading" class="py-10 text-center text-primary-400">Memuat data...</div>
        <div v-else-if="error" class="rounded-xl bg-red-50 p-6 text-center text-sm text-red-500">{{ error }}</div>

        <div v-else class="overflow-x-auto rounded-xl bg-white shadow-soft">
          <table class="w-full min-w-[960px] text-left text-sm">
            <thead class="bg-blush text-primary-700">
              <tr>
                <th class="p-4">Foto</th>
                <th class="p-4">Kode</th>
                <th class="p-4">Nama</th>
                <th class="p-4">Kategori</th>
                <th class="p-4">Harga</th>
                <th class="p-4">Status</th>
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
                <td class="p-4">
                  <span
                    v-if="product.category_id"
                    class="rounded-full bg-blush px-2.5 py-1 text-xs font-medium text-primary-600"
                  >
                    {{ categoryName(product.category_id) }}
                  </span>
                  <span v-else class="text-xs text-primary-300">-</span>
                </td>
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
                <td class="whitespace-nowrap p-4 text-right">
                  <button
                    class="mr-3 inline-flex items-center gap-1 text-primary-500 hover:text-primary-700"
                    @click="openEditModal(product)"
                  >
                    <AppIcon name="pencil" class="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    class="inline-flex items-center gap-1 text-red-400 hover:text-red-600"
                    @click="confirmDelete(product)"
                  >
                    <AppIcon name="trash" class="h-3.5 w-3.5" /> Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="products.length === 0">
                <td colspan="9" class="p-8 text-center text-primary-400">Belum ada produk yang cocok.</td>
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

        <!-- Filter -->
        <div class="mb-5 flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow-soft">
          <input
            v-model="berandaFilters.q"
            type="text"
            placeholder="Cari nama atau kode produk..."
            class="min-w-[200px] flex-1 rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
          />
          <select
            v-model="berandaFilters.category_id"
            class="rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none sm:w-48"
          >
            <option value="">Semua Kategori</option>
            <option v-for="c in categories" :key="c.id" :value="String(c.id)">{{ c.name }}</option>
          </select>
        </div>

        <div v-if="berandaLoading" class="py-10 text-center text-primary-400">Memuat data...</div>
        <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <label
            v-for="product in berandaProducts"
            :key="product.id"
            class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-soft ring-2 transition"
            :class="product.is_featured ? 'ring-primary-500' : 'ring-transparent hover:ring-primary-200'"
          >
            <input
              type="checkbox"
              class="absolute right-2.5 top-2.5 z-10 h-5 w-5 accent-primary-500"
              :checked="product.is_featured"
              :disabled="togglingId === product.id"
              @change="onToggleFeaturedBeranda(product)"
            />
            <div class="aspect-square w-full overflow-hidden bg-blush">
              <img :src="product.image_url" :alt="product.name" class="h-full w-full object-cover" />
            </div>
            <div class="p-3">
              <p class="truncate text-sm font-semibold text-primary-800">{{ product.name }}</p>
              <p
                v-if="product.code"
                class="mt-1 inline-flex items-center rounded-md bg-blush px-2 py-0.5 font-mono text-xs font-bold text-primary-600"
              >
                {{ product.code }}
              </p>
            </div>
          </label>

          <p v-if="berandaProducts.length === 0" class="col-span-full text-sm text-primary-400">
            Tidak ada produk aktif yang cocok. Aktifkan produk dulu di menu "Kelola Produk".
          </p>
        </div>
      </div>

      <!-- Kelola Profile -->
      <div v-else-if="activeTab === 'profil'">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-primary-800">Kelola Profile</h1>
          <p class="mt-1 text-sm text-primary-500">Atur link toko & media sosial yang tampil di seluruh halaman website.</p>
        </div>

        <form class="max-w-lg space-y-8" @submit.prevent="submitStoreSettings">
          <!-- Kelola Toko -->
          <div class="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
            <div>
              <h2 class="font-semibold text-primary-800">Kelola Toko</h2>
              <p class="mt-0.5 text-xs text-primary-400">Link ini dipakai di banner "Kunjungi Toko Kami" (beranda) & bagian "Belanja Lewat" (footer).</p>
            </div>
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
          </div>

          <!-- Kelola Media Sosial -->
          <div class="space-y-4 rounded-2xl bg-white p-6 shadow-soft">
            <div>
              <h2 class="font-semibold text-primary-800">Kelola Media Sosial</h2>
              <p class="mt-0.5 text-xs text-primary-400">
                Link untuk ikon "Ikuti Kami" di footer. Link Shopee mengikuti Link Toko Shopee di atas.
              </p>
            </div>
            <div>
              <label class="text-xs font-semibold text-primary-500">Link Instagram</label>
              <input
                v-model="storeForm.instagram_url"
                type="url"
                placeholder="https://instagram.com/nama-akun"
                class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
              />
            </div>
            <div>
              <label class="text-xs font-semibold text-primary-500">Link TikTok</label>
              <input
                v-model="storeForm.socmed_tiktok_url"
                type="url"
                placeholder="https://www.tiktok.com/@nama-akun"
                class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
              />
            </div>
            <div>
              <label class="text-xs font-semibold text-primary-500">Nomor WhatsApp</label>
              <input
                v-model="storeForm.whatsapp_number"
                type="text"
                placeholder="62812xxxxxxx (pakai kode negara, tanpa +)"
                class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
              />
              <p class="mt-1 text-[11px] text-primary-400">
                Dipakai untuk semua tombol "Chat/WhatsApp Admin" di seluruh halaman (header, footer, produk).
              </p>
            </div>
            <div>
              <label class="text-xs font-semibold text-primary-500">Link Saluran WhatsApp (Channel)</label>
              <input
                v-model="storeForm.whatsapp_channel_url"
                type="url"
                placeholder="https://whatsapp.com/channel/xxxxxxxxxxxx"
                class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none"
              />
              <p class="mt-1 text-[11px] text-primary-400">
                Dipakai untuk tombol "Gabung Saluran WhatsApp" di footer.
              </p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3">
            <p v-if="storeSaved" class="text-xs font-medium text-green-600">Pengaturan tersimpan.</p>
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
            <label class="text-xs font-semibold text-primary-500">Foto Produk</label>
            <div class="mt-1 flex items-center gap-3">
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Preview foto produk"
                class="h-20 w-20 shrink-0 rounded-lg object-cover ring-1 ring-blush"
              />
              <div v-else class="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-blush text-center text-[10px] text-primary-300">
                Belum ada foto
              </div>
              <div class="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  class="block w-full text-xs text-primary-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-500 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white file:transition hover:file:bg-primary-600"
                  @change="onFileChange"
                />
                <p class="mt-1 text-[11px] text-primary-400">
                  {{ editingId ? 'Kosongkan kalau tidak ingin ganti foto.' : 'Wajib diisi.' }} Maks 4MB (JPG/PNG/WebP).
                </p>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-primary-500">Kategori</label>
              <select v-model="form.category_id" class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none">
                <option value="">Tanpa Kategori</option>
                <option v-for="c in categories" :key="c.id" :value="String(c.id)">{{ c.name }}</option>
              </select>
            </div>
            <div>
              <label class="text-xs font-semibold text-primary-500">Harga (Rp)</label>
              <input v-model.number="form.price" type="number" required class="mt-1 w-full rounded-lg border border-blush px-4 py-2 text-sm focus:border-primary-400 focus:outline-none" />
            </div>
          </div>
          <div class="flex items-center gap-5 pt-1">
            <label class="flex items-center gap-2 text-
