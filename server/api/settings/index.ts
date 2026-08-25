export default defineEventHandler(async (event) => {
  const pool = getPool()
  const method = event.method

  // GET /api/settings -> ambil semua link toko & media sosial
  if (method === 'GET') {
    const { rows } = await pool.query(
      'SELECT shopee_url, tiktok_url, instagram_url, whatsapp_number, socmed_tiktok_url, whatsapp_channel_url FROM store_settings WHERE id = 1'
    )
    if (rows.length === 0) {
      return {
        shopee_url: '',
        tiktok_url: '',
        instagram_url: '',
        whatsapp_number: '',
        socmed_tiktok_url: '',
        whatsapp_channel_url: ''
      }
    }
    return rows[0]
  }

  // PUT /api/settings -> update link toko (Shopee & TikTok Shop) & media sosial (Instagram, TikTok, WhatsApp, Saluran WhatsApp)
  if (method === 'PUT') {
    const body = await readBody(event)
    const { shopee_url, tiktok_url, instagram_url, whatsapp_number, socmed_tiktok_url, whatsapp_channel_url } = body

    const { rows } = await pool.query(
      `INSERT INTO store_settings (id, shopee_url, tiktok_url, instagram_url, whatsapp_number, socmed_tiktok_url, whatsapp_channel_url)
       VALUES (1, $1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         shopee_url = EXCLUDED.shopee_url,
         tiktok_url = EXCLUDED.tiktok_url,
         instagram_url = EXCLUDED.instagram_url,
         whatsapp_number = EXCLUDED.whatsapp_number,
         socmed_tiktok_url = EXCLUDED.socmed_tiktok_url,
         whatsapp_channel_url = EXCLUDED.whatsapp_channel_url
       RETURNING shopee_url, tiktok_url, instagram_url, whatsapp_number, socmed_tiktok_url, whatsapp_channel_url`,
      [
        shopee_url || '',
        tiktok_url || '',
        instagram_url || '',
        whatsapp_number || '',
        socmed_tiktok_url || '',
        whatsapp_channel_url || ''
      ]
    )

    return rows[0]
  }

  throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
})
