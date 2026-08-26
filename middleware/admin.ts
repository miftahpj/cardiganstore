export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  // Saat SSR, cookie browser tidak otomatis ikut ke $fetch internal -> harus diteruskan manual
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  try {
    const { authenticated } = await $fetch<{ authenticated: boolean }>('/api/auth/session', { headers })
    if (!authenticated) {
      return navigateTo('/admin/login')
    }
  } catch {
    return navigateTo('/admin/login')
  }
})
