import {
  pgTable,
  uuid,
  text,
  decimal,
  timestamp,
  jsonb,
  boolean,
  integer,
  index,
} from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  demoBalance: decimal('demo_balance', { precision: 20, scale: 8 }).default(
    '10000'
  ),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Positions table
export const positions = pgTable(
  'positions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    symbol: text('symbol').notNull(),
    side: text('side', { enum: ['long', 'short'] }).notNull(),
    size: decimal('size', { precision: 20, scale: 8 }).notNull(),
    entryPrice: decimal('entry_price', { precision: 20, scale: 8 }).notNull(),
    markPrice: decimal('mark_price', { precision: 20, scale: 8 }).notNull(),
    pnl: decimal('pnl', { precision: 20, scale: 8 }).default('0'),
    pnlPercent: decimal('pnl_percent', { precision: 10, scale: 4 }).default(
      '0'
    ),
    margin: decimal('margin', { precision: 20, scale: 8 }).notNull(),
    leverage: integer('leverage').notNull(),
    isDemo: boolean('is_demo').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  table => ({
    userIdIdx: index('positions_user_id_idx').on(table.userId),
    symbolIdx: index('positions_symbol_idx').on(table.symbol),
  })
)

// Orders table
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    symbol: text('symbol').notNull(),
    side: text('side', { enum: ['buy', 'sell'] }).notNull(),
    type: text('type', { enum: ['market', 'limit', 'stop'] }).notNull(),
    quantity: decimal('quantity', { precision: 20, scale: 8 }).notNull(),
    price: decimal('price', { precision: 20, scale: 8 }).notNull(),
    status: text('status', {
      enum: ['open', 'filled', 'cancelled', 'failed'],
    }).notNull(),
    filled: decimal('filled', { precision: 20, scale: 8 }).default('0'),
    isDemo: boolean('is_demo').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  table => ({
    userIdIdx: index('orders_user_id_idx').on(table.userId),
    symbolIdx: index('orders_symbol_idx').on(table.symbol),
    statusIdx: index('orders_status_idx').on(table.status),
  })
)

// Strategies table
export const strategies = pgTable(
  'strategies',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    name: text('name').notNull(),
    description: text('description'),
    config: jsonb('config').notNull(),
    status: text('status', { enum: ['active', 'inactive', 'paused'] }).default(
      'inactive'
    ),
    pnl: decimal('pnl', { precision: 20, scale: 8 }).default('0'),
    trades: integer('trades').default(0),
    winRate: decimal('win_rate', { precision: 5, scale: 2 }).default('0'),
    isPublic: boolean('is_public').default(false),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  table => ({
    userIdIdx: index('strategies_user_id_idx').on(table.userId),
    statusIdx: index('strategies_status_idx').on(table.status),
  })
)

// Market data table for storing OHLCV data
export const marketData = pgTable(
  'market_data',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    symbol: text('symbol').notNull(),
    timeframe: text('timeframe').notNull(),
    openTime: timestamp('open_time').notNull(),
    open: decimal('open', { precision: 20, scale: 8 }).notNull(),
    high: decimal('high', { precision: 20, scale: 8 }).notNull(),
    low: decimal('low', { precision: 20, scale: 8 }).notNull(),
    close: decimal('close', { precision: 20, scale: 8 }).notNull(),
    volume: decimal('volume', { precision: 20, scale: 8 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  table => ({
    symbolTimeIdx: index('market_data_symbol_time_idx').on(
      table.symbol,
      table.openTime
    ),
    timeframeIdx: index('market_data_timeframe_idx').on(table.timeframe),
  })
)
