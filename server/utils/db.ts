import { Pool } from 'pg'

let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    const config = useRuntimeConfig()
    const connectionString = config.databaseUrl || process.env.DATABASE_URL

    if (!connectionString) {
      throw createError({
        statusCode: 500,
        statusMessage:
          'DATABASE_URL belum diset. Salin .env.example menjadi .env dan isi connection string Neon kamu.'
      })
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    })
  }

  return pool
}
