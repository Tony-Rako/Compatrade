import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, TrendingUp, TrendingDown, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import useTradingStore from '@/store/tradingStore'

const MarketSidebar: React.FC = () => {
  const { prices, selectedSymbol, setSelectedSymbol } = useTradingStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState(new Set(['BTCUSDT', 'ETHUSDT']))

  const marketData = Array.from(prices.entries()).map(([symbolName, data]) => ({
    ...data,
    symbol: symbolName,
  }))

  const filteredMarkets = marketData.filter(market =>
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleFavorite = (symbol: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(symbol)) {
      newFavorites.delete(symbol)
    } else {
      newFavorites.add(symbol)
    }
    setFavorites(newFavorites)

    toast({
      title: favorites.has(symbol)
        ? 'Removed from favorites'
        : 'Added to favorites',
      description: `${symbol} ${favorites.has(symbol) ? 'removed from' : 'added to'} your watchlist`,
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Markets</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search markets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-2">
          {filteredMarkets.map(market => (
            <motion.div
              key={market.symbol}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                selectedSymbol === market.symbol
                  ? 'bg-primary/10 border border-primary/20'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setSelectedSymbol(market.symbol)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{market.symbol}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={e => {
                      e.stopPropagation()
                      handleFavorite(market.symbol)
                    }}
                  >
                    <Star
                      className={`h-3 w-3 ${
                        favorites.has(market.symbol)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-mono">
                    ${market.price.toLocaleString()}
                  </span>
                  <div
                    className={`flex items-center space-x-1 ${
                      market.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {market.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="text-xs">
                      {market.change24h >= 0 ? '+' : ''}
                      {market.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Vol: ${(market.volume / 1000000).toFixed(1)}M
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketSidebar
