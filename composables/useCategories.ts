export interface Category {
  id: number
  name: string
  created_at?: string
}

export function useCategories() {
  const categories = useState<Category[]>('categories', () => [])
  const loading = useState<boolean>('categories-loading', () => false)
  const error = useState<string | null>('categories-error', () => null)
  const loaded = useState<boolean>('categories-loaded', () => false)

  async function fetchCategories(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = null
    try {
      categories.value = await $fetch<Category[]>('/api/categories')
      loaded.value = true
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Gagal memuat kategori.'
    } finally {
      loading.value = false
    }
  }

  async function createCategory(name: string) {
    const created = await $fetch<Category>('/api/categories', {
      method: 'POST',
      body: { name }
    })
    categories.value.push(created)
    categories.value.sort((a, b) => a.name.localeCompare(b.name))
    return created
  }

  async function deleteCategory(id: number) {
    await $fetch(`/api/categories/${id}`, { method: 'DELETE' })
    categories.value = categories.value.filter((c) => c.id !== id)
  }

  function categoryName(categoryId: number | null | undefined): string {
    if (!categoryId) return '-'
    return categories.value.find((c) => c.id === categoryId)?.name || '-'
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    deleteCategory,
    categoryName
  }
}
