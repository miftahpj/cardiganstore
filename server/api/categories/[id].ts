export default defineEventHandler(async (event) => {
  const pool = getPool()
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (!id || Number.isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'ID kategori tidak valid.' })
  }

  // DELETE /api/categories/:id -> hapus kategori (produk terkait otomatis jadi "tanpa kategori")
  if (method === 'DELETE') {
    requireAdminAuth(event)

    const { rows } = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id])
    if (rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Kategori tidak ditemukan.' })
    }
    return { success: true, id: rows[0].id }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
