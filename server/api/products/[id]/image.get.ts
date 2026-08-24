export default defineEventHandler(async (event) => {
  const pool = getPool()
  const id = getRouterParam(event, 'id')

  if (!id || Number.isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'ID produk tidak valid.' })
  }

  const { rows } = await pool.query('SELECT image_data, image_mime FROM products WHERE id = $1', [id])

  if (rows.length === 0 || !rows[0].image_data) {
    throw createError({ statusCode: 404, statusMessage: 'Gambar tidak ditemukan.' })
  }

  setHeader(event, 'Content-Type', rows[0].image_mime || 'application/octet-stream')
  // URL sudah mengandung query "?v=" berbasis updated_at, jadi aman di-cache selamanya:
  // begitu foto diganti, URL-nya otomatis berubah juga.
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return rows[0].image_data
})
