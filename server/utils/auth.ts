import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

export const ADMIN_SESSION_COOKIE = 'wooman_admin_session'
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 hari

function getSecret(): string {
  const config = useRuntimeConfig()
  return config.adminSessionSecret || 'wooman-khania-ganti-secret-ini-di-env'
}

function sign(value: string): string {
  return createHmac('sha256', getSecret()).update(value).digest('hex')
}

// Token = base64url(payload) + "." + signature(payload)
// payload = "username|expiresAtMs" -> stateless, tidak butuh tabel session di database
export function createSessionToken(username: string): string {
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE * 1000
  const payload = `${username}|${expiresAt}`
  const signature = sign(payload)
  return `${Buffer.from(payload, 'utf-8').toString('base64url')}.${signature}`
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false

  const separatorIndex = token.lastIndexOf('.')
  if (separatorIndex === -1) return false

  const encodedPayload = token.slice(0, separatorIndex)
  const signature = token.slice(separatorIndex + 1)

  let payload: string
  try {
    payload = Buffer.from(encodedPayload, 'base64url').toString('utf-8')
  } catch {
    return false
  }

  const expectedSignature = sign(payload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)
  if (signatureBuffer.length !== expectedBuffer.length) return false
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return false

  const pipeIndex = payload.lastIndexOf('|')
  if (pipeIndex === -1) return false
  const expiresAt = Number(payload.slice(pipeIndex + 1))
  if (!expiresAt || Number.isNaN(expiresAt) || Date.now() > expiresAt) return false

  return true
}

export function checkAdminCredentials(username: string, password: string): boolean {
  const config = useRuntimeConfig()
  const validUsername = config.adminUsername || 'Wooman.id'
  const validPassword = config.adminPassword || 'Wooman2025'
  return username === validUsername && password === validPassword
}

// Dipanggil di awal handler API yang cuma boleh diakses admin (create/update/delete)
export function requireAdminAuth(event: H3Event): void {
  const token = getCookie(event, ADMIN_SESSION_COOKIE)
  if (!verifySessionToken(token)) {
    throw createError({ statusCode: 401, statusMessage: 'Silakan login sebagai admin terlebih dahulu.' })
  }
}
