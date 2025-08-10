// Re-export all types for easy importing
export * from './trading'
export * from './ui'

// Backend types (for future tRPC integration)
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface FormFieldError {
  message: string
}

export interface FormErrors {
  [key: string]: FormFieldError
}

export interface FormState<T = any> {
  data: T
  errors: FormErrors
  isSubmitting: boolean
  isValid: boolean
}

// Chart types
export interface CandlestickData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TechnicalIndicator {
  name: string
  values: number[]
  timestamps: number[]
}

// AI Assistant types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

// Strategy Builder types
export interface StrategyRule {
  id: string
  type: 'entry' | 'exit' | 'stop_loss' | 'take_profit'
  indicator: string
  operator:
    | 'greater_than'
    | 'less_than'
    | 'crosses_above'
    | 'crosses_below'
    | 'equals'
  value: number | string
}

export interface StrategyConfig {
  id: string
  name: string
  description?: string
  rules: StrategyRule[]
  riskManagement: {
    stopLoss?: number
    takeProfit?: number
    positionSize?: number
    maxDrawdown?: number
  }
  timeframe: string
  symbols: string[]
}

// Analytics types
export interface PerformanceMetrics {
  totalReturn: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  profitFactor: number
  totalTrades: number
  avgWin: number
  avgLoss: number
}

export interface TradingStatistics {
  daily: PerformanceMetrics
  weekly: PerformanceMetrics
  monthly: PerformanceMetrics
  allTime: PerformanceMetrics
}

// Error types
export class TradingError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message)
    this.name = 'TradingError'
  }
}

export class WebSocketError extends Error {
  constructor(
    message: string,
    public event?: Event
  ) {
    super(message)
    this.name = 'WebSocketError'
  }
}
