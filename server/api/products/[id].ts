export default defineEventHandler(async (event) => {
  const pool = getPool()
  const method = event.method
  const id = getRouterParam(event, 'id')

  if (!id || Number.isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'ID produk tidak valid.' })
  }

  // GET /api/products/:id -> single product detail
  // Produk yang nonaktif disembunyikan dari halaman publik (dianggap tidak ditemukan)
  if (method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id])
    if (rows.length === 0 || rows[0].is_active === false) {
      throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan.' })
    }
    return rows[0]
  }

  // PUT /api/products/:id -> update product
  if (method === 'PUT') {
    const body = await readBody(event)
    const { name, description, image_url, price, code, is_active, is_featured, shopee_url, tiktok_url } = body

    const { rows } = await pool.query(
      `UPDATE products
       SET name = $1, description = $2, image_url = $3, price = $4, code = $5,
           is_active = $6, is_featured = $7, shopee_url = $8, tiktok_url = $9
       WHERE id = $10
       RETURNING *`,
      [
        name,
        description || '',
        image_url || '',
        price,
        code || '',
        is_active === undefined ? true : !!is_active,
        !!is_featured,
        shopee_url || '',
        tiktok_url || '',
        id
      ]
    )

    if (rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan.' })
    }

    return rows[0]
  }

  // DELETE /api/products/:id -> remove product
  if (method === 'DELETE') {
    const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id])
    if (rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan.' })
    }
    return { success: true, id: rows[0].id }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
