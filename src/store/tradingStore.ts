import { create } from 'zustand'
import type {
  TradingStore,
  PriceData,
  OrderBook,
  ChartDataPoint,
  Position,
  Order,
  Strategy,
  OrderFormData,
  User,
  Theme,
  ChartInterval,
  WebSocketStatus,
} from '@/types/trading'

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT'] as const

const generateInitialChartData = (): Map<string, ChartDataPoint[]> => {
  const data = new Map<string, ChartDataPoint[]>()
  SYMBOLS.forEach(symbol => {
    let price = 43250.5 + (Math.random() - 0.5) * 5000
    const chartData: ChartDataPoint[] = Array.from({ length: 100 }, (_, i) => {
      price += (Math.random() - 0.5) * 50
      return {
        time: Date.now() - (100 - i) * 60000,
        price: price,
      }
    })
    data.set(symbol, chartData)
  })
  return data
}

const useTradingStore = create<TradingStore>((set, get) => ({
  user: {
    id: '1',
    name: 'John Trader',
    email: 'john@example.com',
    balance: 50000,
    avatar: null,
  } as User,

  prices: new Map<string, PriceData>(
    SYMBOLS.map(symbol => [
      symbol,
      {
        symbol,
        price: 43250.5 + (Math.random() - 0.5) * 5000,
        change24h: (Math.random() - 0.5) * 10,
        volume: Math.random() * 2000000000,
      },
    ])
  ),

  orderBooks: new Map<string, OrderBook>(
    SYMBOLS.map(symbol => [
      symbol,
      {
        bids: Array.from({ length: 15 }, () => ({
          price: 43250.0 - Math.random() * 10,
          quantity: Math.random() * 2,
          total: Math.random() * 100000,
        })),
        asks: Array.from({ length: 15 }, () => ({
          price: 43251.0 + Math.random() * 10,
          quantity: Math.random() * 2,
          total: Math.random() * 100000,
        })),
      },
    ])
  ),

  chartData: generateInitialChartData(),

  selectedSymbol: 'BTCUSDT',
  positions: [
    {
      id: '1',
      symbol: 'BTCUSDT',
      side: 'long',
      size: 0.5,
      entryPrice: 42800.0,
      markPrice: 43250.5,
      pnl: 225.25,
      pnlPercent: 1.05,
      margin: 2140.0,
      leverage: 10,
    },
    {
      id: '2',
      symbol: 'ETHUSDT',
      side: 'short',
      size: 2.0,
      entryPrice: 2680.0,
      markPrice: 2650.75,
      pnl: 58.5,
      pnlPercent: 1.09,
      margin: 536.0,
      leverage: 5,
    },
  ] as Position[],

  orders: [
    {
      id: '1',
      symbol: 'BTCUSDT',
      side: 'buy',
      type: 'limit',
      quantity: 0.1,
      price: 43000.0,
      status: 'open',
      filled: 0,
      timestamp: Date.now() - 300000,
    },
  ] as Order[],

  strategies: [
    {
      id: '1',
      name: 'BTC Momentum Strategy',
      status: 'active',
      pnl: 1250.75,
      trades: 23,
      winRate: 65.2,
      description: 'AI-powered momentum trading for Bitcoin',
    },
  ] as Strategy[],

  theme: 'dark' as Theme,
  chartInterval: '15m' as ChartInterval,

  wsStatus: 'disconnected' as WebSocketStatus,
  lastUpdate: Date.now(),

  updatePrice: (symbol: string, newPrice: number) =>
    set(state => {
      const newPrices = new Map(state.prices)
      const oldPriceData = newPrices.get(symbol) || {
        symbol,
        price: 0,
        change24h: 0,
        volume: 0,
      }
      const change24h =
        oldPriceData.change24h +
        ((newPrice - oldPriceData.price) / oldPriceData.price) * 5 // A bit exaggerated for visual effect
      newPrices.set(symbol, {
        ...oldPriceData,
        symbol,
        price: newPrice,
        change24h,
      })

      const newChartData = new Map(state.chartData)
      const symbolChartData = newChartData.get(symbol) || []
      const updatedChartData = [
        ...symbolChartData.slice(-149),
        { time: Date.now(), price: newPrice },
      ]
      newChartData.set(symbol, updatedChartData)

      return {
        prices: newPrices,
        chartData: newChartData,
        lastUpdate: Date.now(),
      }
    }),

  updateOrderBook: (symbol: string, orderBook: OrderBook) =>
    set(state => {
      const newOrderBooks = new Map(state.orderBooks)
      newOrderBooks.set(symbol, orderBook)
      return { orderBooks: newOrderBooks }
    }),

  setSelectedSymbol: (symbol: string) => set({ selectedSymbol: symbol }),

  setChartInterval: (interval: ChartInterval) =>
    set({ chartInterval: interval }),

  placeOrder: async (order: OrderFormData): Promise<Order> => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      status: 'open',
      filled: 0,
      timestamp: Date.now(),
    }

    set(state => ({
      orders: [newOrder, ...state.orders],
    }))

    return newOrder
  },

  cancelOrder: (orderId: string) =>
    set(state => ({
      orders: state.orders.filter(order => order.id !== orderId),
    })),

  updatePosition: (positionId: string, updates: Partial<Position>) =>
    set(state => ({
      positions: state.positions.map(pos =>
        pos.id === positionId ? { ...pos, ...updates } : pos
      ),
    })),

  setTheme: (theme: Theme) => set({ theme }),

  setWsStatus: (status: WebSocketStatus) => set({ wsStatus: status }),
}))

export default useTradingStore
