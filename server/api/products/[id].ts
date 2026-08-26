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
    const { rows } = await pool.query(`SELECT ${PRODUCT_LIST_COLUMNS} FROM products WHERE id = $1`, [id])
    if (rows.length === 0 || rows[0].is_active === false) {
      throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan.' })
    }
    return attachImageUrl(rows[0])
  }

  // PUT /api/products/:id -> update product
  // Terima multipart/form-data (field "image" opsional -> ganti foto) ATAU JSON biasa (update parsial, tanpa foto)
  if (method === 'PUT') {
    requireAdminAuth(event)

    const { fields, file } = await parseProductBody(event)

    const is_active = fields.is_active === undefined ? true : fields.is_active === 'true'
    const is_featured = fields.is_featured === 'true'
    const category_id = fields.category_id ? Number(fields.category_id) : null

    const setParts = [
      'name = $1',
      'description = $2',
      'price = $3',
      'code = $4',
      'is_active = $5',
      'is_featured = $6',
      'category_id = $7',
      'shopee_url = $8',
      'tiktok_url = $9',
      'updated_at = NOW()'
    ]
    const params: any[] = [
      fields.name,
      fields.description || '',
      fields.price !== undefined ? Number(fields.price) : 0,
      fields.code || '',
      is_active,
      is_featured,
      category_id,
      fields.shopee_url || '',
      fields.tiktok_url || ''
    ]

    if (file) {
      // Foto baru diupload -> timpa data lama
      params.push(file.data, file.type)
      setParts.push(`image_data = $${params.length - 1}`, `image_mime = $${params.length}`)
    } else if (fields.image_url) {
      // Tidak upload file baru, tapi ada image_url manual (jarang dipakai, jaga-jaga panggilan API langsung)
      params.push(fields.image_url)
      setParts.push(`image_url = $${params.length}`)
    }
    // Kalau tidak ada file baru & tidak ada image_url -> foto lama dibiarkan apa adanya

    params.push(id)

    const { rows } = await pool.query(
      `UPDATE products SET ${setParts.join(', ')}
       WHERE id = $${params.length}
       RETURNING ${PRODUCT_LIST_COLUMNS}`,
      params
    )

    if (rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan.' })
    }

    return attachImageUrl(rows[0])
  }

  // DELETE /api/products/:id -> remove product
  if (method === 'DELETE') {
    requireAdminAuth(event)

    const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING id', [id])
    if (rows.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan.' })
    }
    return { success: true, id: rows[0].id }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
