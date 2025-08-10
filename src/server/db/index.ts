import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// For now, use a mock connection string
// In production, this would come from environment variables
const connectionString = process.env.DATABASE_URL || 'mock-connection'

let sql: any
let db: any

if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  sql = neon(connectionString)
  db = drizzle(sql, { schema })
} else {
  // Mock database for development
  db = {
    select: () => ({
      from: () => ({
        where: () => [],
        limit: () => [],
        orderBy: () => [],
      }),
    }),
    insert: () => ({
      values: () => ({
        returning: () => [],
      }),
    }),
    update: () => ({
      set: () => ({
        where: () => [],
      }),
    }),
    delete: () => ({
      where: () => [],
    }),
  }
}

export { db }
