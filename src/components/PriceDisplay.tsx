import React from 'react'
import { motion } from 'framer-motion'
import useTradingStore from '@/store/tradingStore'
import { useShallow } from 'zustand/react/shallow'

interface PriceDisplayProps {
  symbol: string
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ symbol }) => {
  const { price, change24h } = useTradingStore(
    useShallow(state => {
      const priceData = state.prices.get(symbol)
      return {
        price: priceData ? priceData.price : 0,
        change24h: priceData ? priceData.change24h : 0,
      }
    })
  )

  return (
    <motion.div
      className={`text-sm md:text-base font-mono ${
        change24h >= 0 ? 'text-green-500' : 'text-red-500'
      }`}
      key={price}
      initial={{ scale: 1.1, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      $
      {price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </motion.div>
  )
}

export default React.memo(PriceDisplay)
