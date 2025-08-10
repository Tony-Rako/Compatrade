import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import useTradingStore from '@/store/tradingStore'

interface Order {
  price: number
  quantity: number
  total: number
}

interface OrderRowProps {
  order: Order
  type: 'bid' | 'ask'
  maxTotal: number
  isMobile: boolean
}

const OrderRow = React.memo(
  ({ order, type, maxTotal, isMobile }: OrderRowProps) => (
    <div className="relative flex items-center justify-between py-1 px-2 sm:px-3 text-xs font-mono cursor-pointer hover:bg-muted/30">
      <div
        className={`absolute top-0 bottom-0 ${
          type === 'bid' ? 'right-0 bg-green-500/10' : 'left-0 bg-red-500/10'
        }`}
        style={{
          width: `${(order.total / maxTotal) * 100}%`,
        }}
      />
      <span
        className={`${type === 'bid' ? 'text-green-500' : 'text-red-500'} font-semibold min-w-0 flex-1 text-left`}
      >
        {isMobile ? order.price.toFixed(1) : order.price.toFixed(2)}
      </span>
      <span className="text-muted-foreground min-w-0 flex-1 text-center">
        {isMobile ? order.quantity.toFixed(2) : order.quantity.toFixed(4)}
      </span>
      <span className="text-muted-foreground min-w-0 flex-1 text-right">
        {isMobile
          ? order.total > 1000
            ? `${(order.total / 1000).toFixed(1)}k`
            : order.total.toFixed(0)
          : order.total.toFixed(0)}
      </span>
    </div>
  )
)

const OrderBook: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)
  const { selectedSymbol, orderBooks, prices } = useTradingStore()
  const orderBook = orderBooks.get(selectedSymbol)
  const currentPrice = prices.get(selectedSymbol)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { bids, asks, maxTotal } = useMemo(() => {
    if (!orderBook) return { bids: [], asks: [], maxTotal: 0 }

    const bids = orderBook.bids || []
    const asks = orderBook.asks || []

    const maxTotal = Math.max(
      ...bids.map(b => b.total),
      ...asks.map(a => a.total)
    )

    return { bids, asks, maxTotal }
  }, [orderBook])

  if (!orderBook) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading order book...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed Header */}
      <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-b border-border flex-shrink-0">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold">
          Order Book
        </h3>
        <div className="text-xs sm:text-sm text-muted-foreground">
          {selectedSymbol}
        </div>
      </div>

      {/* Fixed Column Headers */}
      <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 text-xs text-muted-foreground border-b border-border flex-shrink-0 bg-background">
        <span className="flex-1 text-left font-medium">Price</span>
        <span className="flex-1 text-center font-medium">Size</span>
        <span className="flex-1 text-right font-medium">Total</span>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Asks Section - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0 max-h-[45%]">
          <div className="flex flex-col-reverse">
            {asks.slice(0, isMobile ? 15 : 25).map((ask, index) => (
              <OrderRow
                key={`ask-${ask.price}-${index}`}
                order={ask}
                type="ask"
                maxTotal={maxTotal}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Fixed Current Price Display */}
        <div className="flex items-center justify-center py-1.5 sm:py-2 border-y border-border bg-muted/20 flex-shrink-0 sticky z-10">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            <motion.span
              key={currentPrice?.price}
              className="text-sm sm:text-base md:text-lg font-mono font-semibold"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isMobile
                ? currentPrice?.price.toFixed(1)
                : currentPrice?.price.toFixed(2)}
            </motion.span>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
          </div>
        </div>

        {/* Bids Section - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0 max-h-[45%]">
          {bids.slice(0, isMobile ? 15 : 25).map((bid, index) => (
            <OrderRow
              key={`bid-${bid.price}-${index}`}
              order={bid}
              type="bid"
              maxTotal={maxTotal}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default OrderBook
