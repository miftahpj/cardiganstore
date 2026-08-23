import type { Product } from './useProducts'

export interface AdminProductFilters {
  q?: string
  status?: 'all' | 'active' | 'inactive'
  sort?: 'newest' | 'oldest'
}

// State terpisah dari useProducts() (yang dipakai halaman publik) supaya produk
// nonaktif yang dimuat di admin tidak pernah "bocor" ke tampilan publik.
export function useAdminProducts() {
  const products = useState<Product[]>('admin-products', () => [])
  const loading = useState<boolean>('admin-products-loading', () => false)
  const error = useState<string | null>('admin-products-error', () => null)

  async function fetchProducts(filters: AdminProductFilters = {}) {
    loading.value = true
    error.value = null
    try {
      const query: Record<string, string> = {
        status: filters.status || 'all',
        sort: filters.sort || 'newest'
      }
      if (filters.q?.trim()) query.q = filters.q.trim()

      const data = await $fetch<Product[]>('/api/products', { query })
      products.value = data
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Gagal memuat produk.'
    } finally {
      loading.value = false
    }
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

  async function toggleActive(product: Product) {
    return updateProduct(product.id, { ...product, is_active: !product.is_active })
  }

  async function toggleFeatured(product: Product) {
    return updateProduct(product.id, { ...product, is_featured: !product.is_featured })
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
    toggleFeatured
  }
}
