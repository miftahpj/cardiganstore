export interface StoreSettings {
  shopee_url: string
  tiktok_url: string
}

export function useStoreSettings() {
  const settings = useState<StoreSettings>('store-settings', () => ({
    shopee_url: SHOPEE_STORE_URL,
    tiktok_url: TIKTOK_STORE_URL
  }))
  const loading = useState<boolean>('store-settings-loading', () => false)
  const error = useState<string | null>('store-settings-error', () => null)
  const loaded = useState<boolean>('store-settings-loaded', () => false)

  async function fetchSettings(force = false) {
    if (loaded.value && !force) return
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<StoreSettings>('/api/settings')
      settings.value = {
        shopee_url: data.shopee_url || SHOPEE_STORE_URL,
        tiktok_url: data.tiktok_url || TIKTOK_STORE_URL
      }
      loaded.value = true
    } catch (err: any) {
      error.value = err?.data?.statusMessage || 'Gagal memuat pengaturan toko.'
    } finally {
      loading.value = false
    }
  }

  async function updateSettings(payload: StoreSettings) {
    const data = await $fetch<StoreSettings>('/api/settings', {
      method: 'PUT',
      body: payload
    })
    settings.value = data
    loaded.value = true
    return data
  }

  return {
    settings,
    loading,
    error,
    loaded,
    fetchSettings,
    updateSettings
  }
}
