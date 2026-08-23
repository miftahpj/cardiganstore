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
-- Dummy / mockup data (hanya terisi kalau tabel products masih kosong)
-- =========================================================

INSERT INTO products (name, description, image_url, price, code, is_active, is_featured, shopee_url, tiktok_url)
SELECT * FROM (VALUES
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
