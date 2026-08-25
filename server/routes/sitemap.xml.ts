// Sitemap dinamis untuk Google Search Console: https://wooman.web.id/sitemap.xml
// Selalu sinkron dengan produk aktif di database, tidak perlu diupdate manual.

const SITE_URL = 'https://wooman.web.id'

function xmlEscape(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
      default:
        return c
    }
  })
}

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq: string
  priority: string
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  const urls: SitemapUrl[] = [
    { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${SITE_URL}/katalog`, changefreq: 'daily', priority: '0.9' }
  ]

  // Setiap produk aktif ikut dimasukkan sebagai halaman /product/:id
  try {
    const pool = getPool()
    const { rows } = await pool.query(
      `SELECT id, updated_at FROM products WHERE is_active = true ORDER BY updated_at DESC`
    )
    for (const row of rows) {
      urls.push({
        loc: `${SITE_URL}/product/${row.id}`,
        lastmod: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
        changefreq: 'weekly',
        priority: '0.7'
      })
    }
  } catch {
    // Kalau koneksi database sedang bermasalah, sitemap tetap tampil dengan halaman statis saja
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return body
})
