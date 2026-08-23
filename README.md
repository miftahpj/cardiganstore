# WOOMAN by Khania — Website Katalog

Website katalog/e-commerce untuk WOOMAN by Khania, dibangun dengan **Nuxt 3**, **Tailwind CSS**, **AOS**, dan **PostgreSQL (Neon)**.

## 🚀 Cara Menjalankan

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup Database (Neon)**
   - Buat project baru di [Neon](https://neon.tech).
   - Buka SQL Editor, lalu jalankan seluruh isi file `database.sql` (berisi `CREATE TABLE products` + data dummy).
   - Salin *connection string* dari Neon dashboard.

3. **Setup Environment Variable**
   ```bash
   cp .env.example .env
   ```
   Lalu isi `DATABASE_URL` di file `.env` dengan connection string Neon kamu.

4. **Jalankan development server**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000`.

## 📁 Struktur Proyek

```
pages/
  index.vue               # Halaman utama (Hero carousel, teaser katalog, Deals, Footer)
  katalog.vue              # Halaman katalog penuh (grid semua produk + pencarian)
  product/[id].vue         # Halaman detail produk
  admin/index.vue          # Dashboard admin dengan sidebar (Dashboard & Kelola Produk)
components/
  AppHeader.vue             # Navbar floating + liquid glass, menu mobile
  HeroSection.vue           # Hero 2 kolom + carousel produk looping (crossfade otomatis)
  SectionDivider.vue        # Pembatas wave/gelombang antar section
  ProductCard.vue           # Kartu produk (foto+overlay, tombol bertumpuk)
  ProductCarousel.vue       # Teaser katalog di homepage + tombol "Lihat Semua Produk"
  DealsSection.vue
  AppFooter.vue
  AdminSidebar.vue          # Sidebar navigasi panel admin (desktop sticky, mobile drawer)
composables/
  useProducts.ts            # Fetch, create, update, delete produk + helper WA/format Rupiah
server/
  api/products/index.ts     # GET (list) & POST (create)
  api/products/[id].ts      # GET (detail), PUT (update), DELETE
  utils/db.ts                # Koneksi pg Pool ke Neon
database.sql                # Schema + data dummy (jalankan manual di Neon)
.env.example
tailwind.config.js           # Warna primary diambil dari logo WOOMAN (dusty pink)
```

## 🧭 Navigasi

- **Beranda** → `/`
- **Katalog** → `/katalog` (halaman terpisah, grid semua produk + pencarian real-time)
- **Kontak** → scroll ke footer (`#kontak`), tersedia di semua halaman karena footer bersifat global
- Search bar di Hero akan mengarahkan ke `/katalog?q=<kata kunci>`

## 🔗 Halaman Admin

Akses panel admin di `/admin` — sekarang dengan **sidebar** (Dashboard & Kelola Produk), termasuk versi drawer di mobile.
> Catatan: halaman ini belum diberi proteksi login — tambahkan autentikasi sebelum di-deploy ke production.

## ✨ Fitur

- Navbar floating dengan efek liquid glass (`backdrop-blur`), lengkap dengan menu mobile
- Hero 2 kolom: info toko di kiri, carousel produk (looping otomatis, hingga 5 foto + indikator titik) di kanan
- Pembatas bergelombang (wave divider) di antara setiap section untuk transisi scroll yang lebih halus
- Halaman katalog penuh dengan grid produk & pencarian real-time
- Kartu produk dengan foto+overlay nama/harga dan tombol bertumpuk (Cek Detail / Chat WhatsApp), tombol WA otomatis terisi nama & harga produk
- Dashboard admin dengan sidebar (ringkasan statistik + CRUD produk)
- Footer dengan info kontak, rekening, embed Google Maps, dan sosial media
- Animasi AOS (fade-in/slide-up) di setiap section
- SEO meta title, description, keywords sudah terpasang (`whooman`, `toko cardigan`, `cardigan Tasikmalaya`, dll)
- 100% responsif mobile & desktop
- CRUD produk lewat API Nuxt (`server/api`) menggunakan `pg`, tanpa Prisma

## 🎨 Warna Brand

Warna `primary` di `tailwind.config.js` diekstrak dari logo WOOMAN (dusty pink/rose #c66a80), dipakai konsisten di seluruh komponen.
