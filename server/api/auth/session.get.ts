export default defineEventHandler((event) => {
  const token = getCookie(event, ADMIN_SESSION_COOKIE)
  return { authenticated: verifySessionToken(token) }
})
