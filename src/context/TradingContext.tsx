import React, { createContext, useContext, useEffect } from 'react'
import useTradingStore from '@/store/tradingStore'

const TradingContext = createContext(null)

export const useTradingContext = () => useContext(TradingContext)

export const TradingProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  // This hook now just initializes the WebSocket connection
  // and doesn't return anything to avoid re-renders.
  useWebSocket()

  return (
    <TradingContext.Provider value={null}>{children}</TradingContext.Provider>
  )
}

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT']

// The WebSocket logic is now a simple hook that doesn't cause re-renders.
const useWebSocket = () => {
  useEffect(() => {
    useTradingStore.getState().setWsStatus('connecting')

    const intervalId = setInterval(() => {
      // Simulate live data updates
      SYMBOLS.forEach(symbol => {
        const currentPriceData = useTradingStore.getState().prices.get(symbol)
        if (currentPriceData) {
          const newPrice =
            currentPriceData.price * (1 + (Math.random() - 0.5) * 0.001)
          useTradingStore.getState().updatePrice(symbol, newPrice)
        }
      })
    }, 1000)

    useTradingStore.getState().setWsStatus('connected')

    return () => {
      clearInterval(intervalId)
      useTradingStore.getState().setWsStatus('disconnected')
    }
  }, [])
}
