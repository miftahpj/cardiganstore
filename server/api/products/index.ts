export default defineEventHandler(async (event) => {
  const pool = getPool()
  const method = event.method

  // GET /api/products -> list all products
  if (method === 'GET') {
    const { rows } = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    )
    return rows
  }

  // POST /api/products -> create new product
  if (method === 'POST') {
    const body = await readBody(event)
    const { name, description, image_url, price, shopee_url, tiktok_url } = body

    if (!name || price === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nama produk dan harga wajib diisi.'
      })
    }

    const { rows } = await pool.query(
      `INSERT INTO products (name, description, image_url, price, shopee_url, tiktok_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description || '', image_url || '', price, shopee_url || '', tiktok_url || '']
    )

    return rows[0]
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
