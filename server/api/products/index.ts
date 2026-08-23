export default defineEventHandler(async (event) => {
  const pool = getPool()
  const method = event.method

  // GET /api/products -> list produk
  // Query params:
  //  - status: 'active' (default) | 'inactive' | 'all'
  //  - sort: 'newest' (default) | 'oldest'
  //  - q: cari berdasarkan nama ATAU kode produk
  //  - featured: '1' -> hanya produk yang ditandai tampil di beranda
  if (method === 'GET') {
    const query = getQuery(event)
    const status = (query.status as string) || 'active'
    const sort = (query.sort as string) || 'newest'
    const q = typeof query.q === 'string' ? query.q.trim() : ''
    const featuredOnly = query.featured === '1' || query.featured === 'true'

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

    if (q) {
      params.push(`%${q}%`)
      const idx = params.length
      conditions.push(`(name ILIKE $${idx} OR code ILIKE $${idx})`)
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
    const orderClause = sort === 'oldest' ? 'ORDER BY created_at ASC' : 'ORDER BY created_at DESC'

    const { rows } = await pool.query(
      `SELECT * FROM products ${whereClause} ${orderClause}`,
      params
    )
    return rows
  }

  // POST /api/products -> create new product
  if (method === 'POST') {
    const body = await readBody(event)
    const { name, description, image_url, price, code, is_active, is_featured, shopee_url, tiktok_url } = body

    if (!name || price === undefined) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Nama produk dan harga wajib diisi.'
      })
    }

    const { rows } = await pool.query(
      `INSERT INTO products (name, description, image_url, price, code, is_active, is_featured, shopee_url, tiktok_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
        tiktok_url || ''
      ]
    )

    return rows[0]
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
