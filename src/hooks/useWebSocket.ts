import { useEffect, useRef, useCallback } from 'react'
import useTradingStore from '@/store/tradingStore'
import type { UseWebSocketReturn, WebSocketStatus } from '@/types/trading'

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT'] as const

interface MockWebSocketConnection {
  interval: NodeJS.Timeout
}

const useWebSocket = (): UseWebSocketReturn => {
  const wsRef = useRef<MockWebSocketConnection | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { updatePrice, updateOrderBook, setWsStatus, prices } =
    useTradingStore.getState()

  const connect = useCallback((): void => {
    if (wsRef.current) return

    setWsStatus('connecting')

    const interval = setInterval(() => {
      SYMBOLS.forEach((symbol: string) => {
        const currentPriceData = prices.get(symbol)
        if (currentPriceData) {
          const newPrice =
            currentPriceData.price * (1 + (Math.random() - 0.5) * 0.001) // Realistic small fluctuation
          useTradingStore.getState().updatePrice(symbol, newPrice)
        }
      })

      const selectedSymbol = useTradingStore.getState().selectedSymbol
      const currentPrice =
        useTradingStore.getState().prices.get(selectedSymbol)?.price || 43250
      const mockOrderBook = {
        bids: Array.from({ length: 15 }, (_, i) => {
          const price = currentPrice - i * 0.5 - Math.random() * 0.5
          return {
            price,
            quantity: Math.random() * 2,
            total: price * Math.random() * 2,
          }
        }),
        asks: Array.from({ length: 15 }, (_, i) => {
          const price = currentPrice + i * 0.5 + Math.random() * 0.5
          return {
            price,
            quantity: Math.random() * 2,
            total: price * Math.random() * 2,
          }
        }),
      }

      updateOrderBook(selectedSymbol, mockOrderBook)
    }, 1000)

    wsRef.current = { interval }
    setWsStatus('connected')
  }, [updatePrice, updateOrderBook, setWsStatus, prices])

  const disconnect = useCallback((): void => {
    if (wsRef.current?.interval) {
      clearInterval(wsRef.current.interval)
    }
    wsRef.current = null
    setWsStatus('disconnected')
  }, [setWsStatus])

  const scheduleReconnect = useCallback((): void => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      connect()
    }, 5000)
  }, [connect])

  const sendMessage = useCallback((message: any): void => {
    // Mock implementation - in real app would send via WebSocket
    console.log('Mock WebSocket message:', message)
  }, [])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect, disconnect])

  return {
    status: useTradingStore(state => state.wsStatus),
    lastMessage: null, // Mock implementation
    sendMessage,
    connect,
    disconnect,
  }
}

export default useWebSocket
