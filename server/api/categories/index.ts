export default defineEventHandler(async (event) => {
  const pool = getPool()
  const method = event.method

  // GET /api/categories -> list semua kategori
  if (method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY name ASC')
    return rows
  }

  // POST /api/categories -> tambah kategori baru
  if (method === 'POST') {
    requireAdminAuth(event)

    const body = await readBody(event)
    const name = typeof body?.name === 'string' ? body.name.trim() : ''

    if (!name) {
      throw createError({ statusCode: 400, statusMessage: 'Nama kategori wajib diisi.' })
    }

    try {
      const { rows } = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name])
      return rows[0]
    } catch (err: any) {
      if (err?.code === '23505') {
        throw createError({ statusCode: 409, statusMessage: 'Kategori dengan nama tersebut sudah ada.' })
      }
      throw err
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
