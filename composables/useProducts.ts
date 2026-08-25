export interface Product {
  id: number
  name: string
  description: string
  image_url: string
  price: number | string
  code: string
  is_active: boolean
  is_featured: boolean
  category_id: number | null
  shopee_url: string
  tiktok_url: string
  created_at?: string
}

export const WA_ADMIN_NUMBER = '6285759169693'
export const WA_CHANNEL_URL = 'https://whatsapp.com/channel/0029VbD8BtB9WtC9NF56161p'
// Fallback link toko, dipakai sebelum pengaturan dari /api/settings (kelola toko) selesai dimuat
export const SHOPEE_STORE_URL = 'https://shopee.co.id/wooman.id'
export const TIKTOK_STORE_URL = 'https://www.tiktok.com/@woomanbykhania'
export const INSTAGRAM_URL = 'https://instagram.com/wooman.officialstore'

export function formatRupiah(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num || 0)
}

export function buildWhatsappLink(product: Pick<Product, 'name' | 'price'>, number?: string): string {
  const clean = (number || WA_ADMIN_NUMBER).replace(/[^0-9]/g, '')
  const message = `Halo Admin WOOMAN, saya tertarik dengan produk *${product.name}* seharga *${formatRupiah(
    product.price
  )}*. Apakah stoknya masih ada?`
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

// Dipakai untuk link WhatsApp di ikon "Ikuti Kami" pada footer, nomornya dikelola dari admin (Kelola Profile)
export function buildWaLink(number: string, message: string): string {
  const clean = (number || WA_ADMIN_NUMBER).replace(/[^0-9]/g, '')
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
}

export function useProducts() {
  const products = useState<Product[]>('products', () => [])
  const loading = useState<boolean>('products-loading', () => false)
  const error = useState<string | null>('products-error', () => null)
  const loaded = useState<boolean>('products-loaded', () => false)

  async function fetchProducts(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Product[]>('/api/products')
      products.value = data
      loaded.value = true
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Gagal memuat produk.'
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id: string | number) {
    return await $fetch<Product>(`/api/products/${id}`)
  }

  async function createProduct(payload: Partial<Product>) {
    const created = await $fetch<Product>('/api/products', {
      method: 'POST',
      body: payload
    })
    products.value.unshift(created)
    return created
  }

  async function updateProduct(id: number, payload: Partial<Product>) {
    const updated = await $fetch<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: payload
    })
    const idx = products.value.findIndex((p) => p.id === id)
    if (idx !== -1) products.value[idx] = updated
    return updated
  }

  async function deleteProduct(id: number) {
    await $fetch(`/api/products/${id}`, { method: 'DELETE' })
    products.value = products.value.filter((p) => p.id !== id)
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
