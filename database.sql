-- =========================================================
-- WOOMAN by Khania - Database Schema (PostgreSQL / Neon)
-- Jalankan file ini secara manual di SQL Editor Neon Dashboard
-- Aman dijalankan ulang (idempotent) berkat IF NOT EXISTS
-- =========================================================

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  shopee_url TEXT,
  tiktok_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kolom tambahan: kode produk, status aktif/nonaktif, dan status tampil di beranda
ALTER TABLE products ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_code ON products (code);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products (is_featured);

-- =========================================================
-- Foto produk disimpan langsung di database (bukan URL eksternal lagi)
-- image_url tetap dipakai sebagai src <img>, tapi isinya jadi link ke
-- endpoint /api/products/:id/image yang membaca bytea di bawah ini
-- =========================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_data BYTEA;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_mime VARCHAR(100);
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- =========================================================
-- Kategori produk (dikelola langsung dari halaman admin)
-- Produk memilih salah satu kategori, mis. "Cardigan"
-- =========================================================

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);

INSERT INTO categories (name)
VALUES ('Cardigan')
ON CONFLICT (name) DO NOTHING;

-- =========================================================
-- Pengaturan toko (link Shopee & TikTok Shop, dikelola dari admin)
-- Tabel ini hanya berisi 1 baris (id = 1)
-- =========================================================

CREATE TABLE IF NOT EXISTS store_settings (
  id INT PRIMARY KEY DEFAULT 1,
  shopee_url TEXT NOT NULL DEFAULT '',
  tiktok_url TEXT NOT NULL DEFAULT '',
  CONSTRAINT store_settings_single_row CHECK (id = 1)
);

INSERT INTO store_settings (id, shopee_url, tiktok_url)
VALUES (1, 'https://shopee.co.id/wooman.id', 'https://www.tiktok.com/@woomanbykhania')
ON CONFLICT (id) DO NOTHING;

-- =========================================================
-- Kelola Media Sosial (bagian "Ikuti Kami" di footer)
-- Instagram, TikTok (profil), dan WhatsApp punya link sendiri-sendiri
-- dan dikelola terpisah dari link Shopee/TikTok Shop di atas.
-- Shopee TIDAK punya kolom baru karena tetap memakai shopee_url yang sama.
-- =========================================================

ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS instagram_url TEXT NOT NULL DEFAULT '';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT NOT NULL DEFAULT '';
ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS socmed_tiktok_url TEXT NOT NULL DEFAULT '';

UPDATE store_settings
SET
  instagram_url = COALESCE(NULLIF(instagram_url, ''), 'https://instagram.com/wooman.officialstore'),
  whatsapp_number = COALESCE(NULLIF(whatsapp_number, ''), '6285759169693'),
  socmed_tiktok_url = COALESCE(NULLIF(socmed_tiktok_url, ''), 'https://www.tiktok.com/@woomanbykhania')
WHERE id = 1;

-- =========================================================
-- Kelola Saluran WhatsApp (tombol "Gabung Saluran WhatsApp" di footer)
-- Nomor WA admin (whatsapp_number di atas) dan link Saluran/Channel WA
-- sekarang dipisah jadi 2 pengaturan sendiri-sendiri.
-- =========================================================

ALTER TABLE store_settings ADD COLUMN IF NOT EXISTS whatsapp_channel_url TEXT NOT NULL DEFAULT '';

UPDATE store_settings
SET whatsapp_channel_url = COALESCE(NULLIF(whatsapp_channel_url, ''), 'https://whatsapp.com/channel/0029VbD8BtB9WtC9NF56161p')
WHERE id = 1;

-- =========================================================
-- Dummy / mockup data (hanya terisi kalau tabel products masih kosong)
-- =========================================================

INSERT INTO products (name, description, image_url, price, code, is_active, is_featured, category_id, shopee_url, tiktok_url)
SELECT s.name, s.description, s.image_url, s.price, s.code, s.is_active, s.is_featured,
       (SELECT id FROM categories WHERE name = 'Cardigan'), s.shopee_url, s.tiktok_url
FROM (VALUES
(
  'Cardigan Knit Blossom',
  'Cardigan rajut lembut dengan potongan oversized, cocok dipadukan dengan inner apapun. Bahan adem, tidak gerah, dan nyaman dipakai seharian.',
  'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800',
  159000::numeric,
  'CK-001',
  true,
  true,
  'https://shopee.co.id/wooman.id',
  'https://www.tiktok.com/@woomanbykhania'
),
(
  'Cardigan Rib Milea',
  'Cardigan rib premium dengan warna dusty pink signature WOOMAN. Simple namun tetap terlihat elegan dan feminin.',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
  175000::numeric,
  'CR-002',
  true,
  true,
  'https://shopee.co.id/wooman.id',
  'https://www.tiktok.com/@woomanbykhania'
),
(
  'Outer Vest Aeril',
  'Outer vest tanpa lengan yang effortless, pas untuk gaya kasual maupun semi-formal. Tersedia berbagai warna pastel.',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
  189000::numeric,
  'OV-003',
  true,
  true,
  'https://shopee.co.id/wooman.id',
  'https://www.tiktok.com/@woomanbykhania'
),
(
  'Cardigan Rajut Aksen Kancing',
  'Detail kancing depan bikin tampilan makin manis. Cocok untuk daily outfit maupun jalan santai.',
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
  169000::numeric,
  'CA-004',
  true,
  false,
  'https://shopee.co.id/wooman.id',
  'https://www.tiktok.com/@woomanbykhania'
),
(
  'Cardigan Oversized Cloudy',
  'Terinspirasi dari kenyamanan awan, cardigan ini super lembut dan ringan. Best seller WOOMAN!',
  'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=800',
  165000::numeric,
  'CO-005',
  true,
  true,
  'https://shopee.co.id/wooman.id',
  'https://www.tiktok.com/@woomanbykhania'
),
(
  'Cardigan Basic Everyday',
  'Model basic yang mudah dimix-match dengan outfit apapun di lemarimu. Wajib punya!',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
  145000::numeric,
  'CB-006',
  true,
  false,
  'https://shopee.co.id/wooman.id',
  'https://www.tiktok.com/@woomanbykhania'
)
) AS seed(name, description, image_url, price, code, is_active, is_featured, shopee_url, tiktok_url)
WHERE NOT EXISTS (SELECT 1 FROM products);
