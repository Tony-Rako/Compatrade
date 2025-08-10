// Core Trading Types
export interface User {
  id: string
  name: string
  email: string
  balance: number
  avatar?: string | null
}

export interface PriceData {
  symbol: string
  price: number
  change24h: number
  volume: number
}

export interface OrderBookLevel {
  price: number
  quantity: number
  total: number
}

export interface OrderBook {
  bids: OrderBookLevel[]
  asks: OrderBookLevel[]
}

export interface ChartDataPoint {
  time: number
  price: number
}

export interface Position {
  id: string
  symbol: string
  side: 'long' | 'short'
  size: number
  entryPrice: number
  markPrice: number
  pnl: number
  pnlPercent: number
  margin: number
  leverage: number
}

export type OrderSide = 'buy' | 'sell'
export type OrderType = 'market' | 'limit' | 'stop' | 'stop_limit'
export type OrderStatus =
  | 'open'
  | 'filled'
  | 'cancelled'
  | 'partially_filled'
  | 'rejected'

export interface Order {
  id: string
  symbol: string
  side: OrderSide
  type: OrderType
  quantity: number
  price: number
  status: OrderStatus
  filled: number
  timestamp: number
}

export interface OrderFormData {
  symbol: string
  side: OrderSide
  type: OrderType
  quantity: number
  price: number
}

export interface Strategy {
  id: string
  name: string
  status: 'active' | 'inactive' | 'paused'
  pnl: number
  trades: number
  winRate: number
  description: string
}

export type Theme = 'light' | 'dark'
export type ChartInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d'
export type WebSocketStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'error'

// Trading Store Interface
export interface TradingStore {
  // State
  user: User
  prices: Map<string, PriceData>
  orderBooks: Map<string, OrderBook>
  chartData: Map<string, ChartDataPoint[]>
  selectedSymbol: string
  positions: Position[]
  orders: Order[]
  strategies: Strategy[]
  theme: Theme
  chartInterval: ChartInterval
  wsStatus: WebSocketStatus
  lastUpdate: number

  // Actions
  updatePrice: (symbol: string, newPrice: number) => void
  updateOrderBook: (symbol: string, orderBook: OrderBook) => void
  setSelectedSymbol: (symbol: string) => void
  setChartInterval: (interval: ChartInterval) => void
  placeOrder: (order: OrderFormData) => Promise<Order>
  cancelOrder: (orderId: string) => void
  updatePosition: (positionId: string, updates: Partial<Position>) => void
  setTheme: (theme: Theme) => void
  setWsStatus: (status: WebSocketStatus) => void
}

// Component Props
export type ViewType =
  | 'trade'
  | 'ai_assistant'
  | 'strategy_builder'
  | 'analytics'
  | 'marketplace'
  | 'copy_trading'
  | 'competitions'
  | 'social'

export type MobileTabType =
  | 'chart'
  | 'markets'
  | 'trade'
  | 'orders'
  | 'positions'
  | 'ai_assistant'
  | 'strategy_builder'
  | 'analytics'

export interface PlaceholderViewProps {
  viewName: string
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'price_update' | 'orderbook_update' | 'trade_update'
  symbol: string
  data: any
}

export interface UseWebSocketReturn {
  status: WebSocketStatus
  lastMessage: WebSocketMessage | null
  sendMessage: (message: any) => void
  connect: () => void
  disconnect: () => void
}
