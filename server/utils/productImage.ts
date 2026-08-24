// Mengubah kolom bantu (has_image_data, updated_at) dari hasil query jadi image_url final.
// - Kalau produk punya foto tersimpan di DB -> image_url diarahkan ke /api/products/:id/image
//   dengan query "?v=" (dari updated_at) supaya browser otomatis ambil versi baru saat foto diganti.
// - Kalau tidak ada foto di DB (mis. data lama pakai URL eksternal) -> image_url apa adanya.
export function attachImageUrl(row: any) {
  if (!row) return row
  if (row.has_image_data) {
    const v = row.updated_at ? new Date(row.updated_at).getTime() : Date.now()
    row.image_url = `/api/products/${row.id}/image?v=${v}`
  }
  delete row.has_image_data
  return row
}

export const PRODUCT_LIST_COLUMNS = `
  id, name, description, image_url, price, code, is_active, is_featured,
  category_id, shopee_url, tiktok_url, created_at, updated_at,
  (image_data IS NOT NULL) AS has_image_data
`
