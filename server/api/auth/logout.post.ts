export default defineEventHandler((event) => {
  deleteCookie(event, ADMIN_SESSION_COOKIE, { path: '/' })
  return { success: true }
})
