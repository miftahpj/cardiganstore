export interface ParsedProductFile {
  data: Buffer
  type: string
}

export interface ParsedProductBody {
  fields: Record<string, string>
  file: ParsedProductFile | null
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024 // 4MB - aman untuk limit body serverless (Vercel/Netlify)

// Menerima 2 bentuk body:
//  - multipart/form-data -> dipakai form tambah/edit produk di admin (bisa bawa file foto)
//  - JSON biasa -> dipakai update parsial seperti toggle aktif/tampil di beranda (tanpa foto)
export async function parseProductBody(event: any): Promise<ParsedProductBody> {
  const contentType = getHeader(event, 'content-type') || ''

  if (contentType.includes('multipart/form-data')) {
    const parts = await readMultipartFormData(event)
    const fields: Record<string, string> = {}
    let file: ParsedProductFile | null = null

    for (const part of parts || []) {
      if (!part.name) continue

      if (part.name === 'image' && part.filename) {
        if (part.data.length > MAX_IMAGE_BYTES) {
          throw createError({ statusCode: 413, statusMessage: 'Ukuran foto maksimal 4MB.' })
        }
        file = { data: part.data, type: part.type || 'application/octet-stream' }
      } else {
        fields[part.name] = part.data.toString('utf-8')
      }
    }

    return { fields, file }
  }

  // Fallback JSON (mis. spread objek produk dari toggle aktif/beranda)
  const body = (await readBody(event)) || {}
  const fields: Record<string, string> = {}
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    fields[key] = value === null || value === undefined ? '' : String(value)
  }
  return { fields, file: null }
}
