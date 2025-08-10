import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Settings,
  User,
  Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import useTradingStore from '@/store/tradingStore'

const TradingHeader = () => {
  const [isClient, setIsClient] = useState(false)
  const { selectedSymbol, prices, user, wsStatus } = useTradingStore()
  const currentPrice = prices.get(selectedSymbol)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNotifications = () => {
    toast({
      title: '🚧 Notifications',
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }

  const handleSettings = () => {
    toast({
      title: '🚧 Settings',
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }

  const handleProfile = () => {
    toast({
      title: '🚧 Profile',
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }

  return (
    <div className="flex items-center justify-between h-full px-4 border-b border-border">
      <div className="flex items-center space-x-2 md:space-x-4">
        <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Compatrade
        </h1>
        <div className="flex items-center space-x-1">
          {wsStatus === 'connected' ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className="hidden md:inline text-xs text-muted-foreground">
            {wsStatus}
          </span>
        </div>

        {isClient && currentPrice && (
          <motion.div
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base">{selectedSymbol}</span>
              <motion.span
                className={`text-base font-mono ${
                  currentPrice.change24h >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
                key={currentPrice.price}
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                $
                {currentPrice.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </motion.span>
              <div
                className={`flex items-center space-x-1 ${
                  currentPrice.change24h >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {currentPrice.change24h >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {currentPrice.change24h >= 0 ? '+' : ''}
                  {currentPrice.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {isClient && (
          <div className="hidden sm:block text-right">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="font-semibold">
              ${user.balance.toLocaleString()}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-1 md:space-x-2">
          <Button variant="ghost" size="icon" onClick={handleNotifications}>
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSettings}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleProfile}>
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TradingHeader
