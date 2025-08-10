import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import useTradingStore from '@/store/tradingStore'

const TradePanel: React.FC = () => {
  const { selectedSymbol, prices, placeOrder, user } = useTradingStore()
  const [orderType, setOrderType] = useState('market')
  const [side, setSide] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [leverage, setLeverage] = useState('1')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')

  const currentPrice = prices.get(selectedSymbol)
  const orderPrice =
    orderType === 'market' ? (currentPrice?.price ?? 0) : parseFloat(price) || 0
  const orderQuantity = parseFloat(quantity) || 0
  const orderValue = orderPrice * orderQuantity
  const margin = orderValue / parseFloat(leverage)
  const fee = orderValue * 0.001 // 0.1% fee

  const handlePlaceOrder = async () => {
    if (!orderQuantity || (orderType === 'limit' && !orderPrice)) {
      toast({
        title: 'Invalid Order',
        description: 'Please enter valid quantity and price',
        variant: 'destructive',
      })
      return
    }

    if (margin > user.balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'Not enough balance to place this order',
        variant: 'destructive',
      })
      return
    }

    try {
      await placeOrder({
        symbol: selectedSymbol,
        side: side as 'buy' | 'sell',
        type: orderType as 'market' | 'limit',
        quantity: orderQuantity,
        price: orderPrice,
      })

      toast({
        title: 'Order Placed',
        description: `${side.toUpperCase()} order for ${orderQuantity} ${selectedSymbol} placed successfully`,
      })

      // Reset form
      setQuantity('')
      setPrice('')
      setStopLoss('')
      setTakeProfit('')
    } catch (_error) {
      toast({
        title: 'Order Failed',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleQuickAmount = (percentage: number) => {
    const availableBalance = user.balance
    const maxQuantity =
      (availableBalance * percentage) / (orderPrice * parseFloat(leverage))
    setQuantity(maxQuantity.toFixed(6))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 sm:p-4 border-b border-border flex-shrink-0">
        <h3 className="text-base sm:text-lg font-semibold">
          Trade {selectedSymbol}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 sm:p-4 space-y-3 sm:space-y-4">
        <Tabs value={side} onValueChange={setSide}>
          <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
            <TabsTrigger
              value="buy"
              className="text-green-500 text-sm sm:text-base"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="text-red-500 text-sm sm:text-base"
            >
              Sell
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground font-medium">
              Order Type
            </label>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger className="h-9 sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="stop">Stop</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {orderType === 'limit' && (
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm text-muted-foreground font-medium">
                Price
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="h-9 sm:h-10"
              />
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground font-medium">
              Quantity
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="h-9 sm:h-10"
            />
            <div className="grid grid-cols-4 gap-1 sm:gap-2 mt-2">
              {[0.25, 0.5, 0.75, 1].map(percentage => (
                <Button
                  key={percentage}
                  variant="outline"
                  size="sm"
                  className="h-7 sm:h-8 text-xs px-1"
                  onClick={() => handleQuickAmount(percentage)}
                >
                  {percentage * 100}%
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <label className="text-xs sm:text-sm text-muted-foreground font-medium">
              Leverage
            </label>
            <Select value={leverage} onValueChange={setLeverage}>
              <SelectTrigger className="h-9 sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 5, 10, 20, 50, 100].map(lev => (
                  <SelectItem key={lev} value={lev.toString()}>
                    {lev}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm text-muted-foreground font-medium">
                Stop Loss
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={stopLoss}
                onChange={e => setStopLoss(e.target.value)}
                className="h-9 sm:h-10"
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-xs sm:text-sm text-muted-foreground font-medium">
                Take Profit
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={takeProfit}
                onChange={e => setTakeProfit(e.target.value)}
                className="h-9 sm:h-10"
              />
            </div>
          </div>
        </div>

        <Card className="mt-4">
          <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm flex items-center">
              <Calculator className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Value:</span>
              <span className="font-mono">${orderValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Margin Required:</span>
              <span className="font-mono">${margin.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Fee:</span>
              <span className="font-mono">${fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-1.5 sm:pt-2 border-t border-border">
              <span>Total Cost:</span>
              <span className="font-mono">${(margin + fee).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {margin > user.balance && (
          <motion.div
            className="flex items-center space-x-2 p-2.5 sm:p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive flex-shrink-0" />
            <span className="text-xs sm:text-sm text-destructive">
              Insufficient balance
            </span>
          </motion.div>
        )}

        <Button
          className={`w-full h-10 sm:h-11 text-sm sm:text-base font-semibold ${
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          onClick={handlePlaceOrder}
          disabled={!orderQuantity || margin > user.balance}
        >
          {side === 'buy' ? 'Buy' : 'Sell'} {selectedSymbol}
        </Button>
      </div>
    </div>
  )
}

export default TradePanel
