export default defineEventHandler(async (event) => {
  const pool = getPool()
  const method = event.method

  // GET /api/settings -> ambil link toko Shopee & TikTok
  if (method === 'GET') {
    const { rows } = await pool.query('SELECT shopee_url, tiktok_url FROM store_settings WHERE id = 1')
    if (rows.length === 0) {
      return { shopee_url: '', tiktok_url: '' }
    }
    return rows[0]
  }

  // PUT /api/settings -> update link toko Shopee & TikTok
  if (method === 'PUT') {
    const body = await readBody(event)
    const { shopee_url, tiktok_url } = body

    const { rows } = await pool.query(
      `INSERT INTO store_settings (id, shopee_url, tiktok_url)
       VALUES (1, $1, $2)
       ON CONFLICT (id) DO UPDATE SET shopee_url = EXCLUDED.shopee_url, tiktok_url = EXCLUDED.tiktok_url
       RETURNING shopee_url, tiktok_url`,
      [shopee_url || '', tiktok_url || '']
    )

    return rows[0]
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
