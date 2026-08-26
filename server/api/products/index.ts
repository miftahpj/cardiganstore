export default defineEventHandler(async (event) => {
  const pool = getPool()
  const method = event.method

  // GET /api/products -> list produk
  // Query params:
  //  - status: 'active' (default) | 'inactive' | 'all'
  //  - sort: 'newest' (default) | 'oldest'
  //  - q: cari berdasarkan nama ATAU kode produk
  //  - featured: '1' -> hanya produk yang ditandai tampil di beranda
  //  - category: id kategori -> hanya produk pada kategori tersebut
  if (method === 'GET') {
    const query = getQuery(event)
    const status = (query.status as string) || 'active'
    const sort = (query.sort as string) || 'newest'
    const q = typeof query.q === 'string' ? query.q.trim() : ''
    const featuredOnly = query.featured === '1' || query.featured === 'true'
    const categoryId = typeof query.category === 'string' ? query.category.trim() : ''

    const conditions: string[] = []
    const params: any[] = []

    if (status === 'active') {
      conditions.push('is_active = true')
    } else if (status === 'inactive') {
      conditions.push('is_active = false')
    }
    // status === 'all' -> tanpa filter status

    if (featuredOnly) {
      conditions.push('is_featured = true')
    }

    if (categoryId && !Number.isNaN(Number(categoryId))) {
      params.push(Number(categoryId))
      conditions.push(`category_id = $${params.length}`)
    }

    if (q) {
      params.push(`%${q}%`)
      const idx = params.length
      conditions.push(`(name ILIKE $${idx} OR code ILIKE $${idx})`)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const orderClause = sort === 'oldest' ? 'ORDER BY created_at ASC' : 'ORDER BY created_at DESC'

    // image_data (bytea) sengaja TIDAK ikut di-select di sini supaya list tetap ringan;
    // foto diambil terpisah lewat /api/products/:id/image
    const { rows } = await pool.query(
      `SELECT ${PRODUCT_LIST_COLUMNS} FROM products ${whereClause} ${orderClause}`,
      params
    )
    return rows.map(attachImageUrl)
  }

  // POST /api/products -> create new product (multipart/form-data, field "image" = file foto)
  if (method === 'POST') {
    requireAdminAuth(event)

    const { fields, file } = await parseProductBody(event)
    const name = fields.name?.trim()
    const price = fields.price !== undefined ? Number(fields.price) : undefined

    if (!name || price === undefined || Number.isNaN(price)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nama produk dan harga wajib diisi.'
      })
    }

    const is_active = fields.is_active === undefined ? true : fields.is_active === 'true'
    const is_featured = fields.is_featured === 'true'
    const category_id = fields.category_id ? Number(fields.category_id) : null

    const { rows } = await pool.query(
      `INSERT INTO products
         (name, description, image_url, image_data, image_mime, price, code, is_active, is_featured, category_id, shopee_url, tiktok_url, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
       RETURNING ${PRODUCT_LIST_COLUMNS}`,
      [
        name,
        fields.description || '',
        file ? '' : fields.image_url || '',
        file ? file.data : null,
        file ? file.type : null,
        price,
        fields.code || '',
        is_active,
        is_featured,
        category_id,
        fields.shopee_url || '',
        fields.tiktok_url || ''
      ]
    )

    return attachImageUrl(rows[0])
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
