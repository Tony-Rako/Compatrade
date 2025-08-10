import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, X, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import useTradingStore from '@/store/tradingStore'

const PositionsPanel: React.FC = () => {
  const { positions, orders, strategies, cancelOrder } = useTradingStore()
  const [activeTab, setActiveTab] = useState('positions')

  const handleClosePosition = (_positionId: string) => {
    toast({
      title: '🚧 Close Position',
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }

  const handleEditPosition = (_positionId: string) => {
    toast({
      title: '🚧 Edit Position',
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId)
      toast({
        title: 'Order Cancelled',
        description: 'Order has been cancelled successfully',
      })
    } catch (_error) {
      toast({
        title: 'Cancel Failed',
        description: 'Failed to cancel order. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const PositionRow = ({
    position,
    index,
  }: {
    position: any
    index: number
  }) => (
    <motion.div
      className="flex items-center justify-between p-3 border-b border-border last:border-b-0 hover:bg-muted/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{position.symbol}</span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              position.side === 'long'
                ? 'bg-green-500/20 text-green-500'
                : 'bg-red-500/20 text-red-500'
            }`}
          >
            {position.side.toUpperCase()}
          </span>
          <span className="text-xs text-muted-foreground">
            {position.leverage}x
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-1 text-sm">
          <span className="text-muted-foreground">Size: {position.size}</span>
          <span className="text-muted-foreground">
            Entry: ${position.entryPrice.toFixed(2)}
          </span>
          <span className="text-muted-foreground">
            Mark: ${position.markPrice.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div
          className={`flex items-center space-x-1 ${
            position.pnl >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {position.pnl >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="font-medium">${position.pnl.toFixed(2)}</span>
        </div>
        <div
          className={`text-sm ${
            position.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {position.pnlPercent >= 0 ? '+' : ''}
          {position.pnlPercent.toFixed(2)}%
        </div>
        <div className="flex space-x-1 mt-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleEditPosition(position.id)}
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleClosePosition(position.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  )

  const OrderRow = ({ order, index }: { order: any; index: number }) => (
    <motion.div
      className="flex items-center justify-between p-3 border-b border-border last:border-b-0 hover:bg-muted/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{order.symbol}</span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              order.side === 'buy'
                ? 'bg-green-500/20 text-green-500'
                : 'bg-red-500/20 text-red-500'
            }`}
          >
            {order.side.toUpperCase()}
          </span>
          <span className="text-xs px-2 py-1 rounded bg-muted">
            {order.type.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
          <span>Qty: {order.quantity}</span>
          {order.price && <span>Price: ${order.price.toFixed(2)}</span>}
          <span>Filled: {order.filled}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm text-muted-foreground">
          {new Date(order.timestamp).toLocaleTimeString()}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 mt-1"
          onClick={() => handleCancelOrder(order.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  )

  const StrategyRow = ({
    strategy,
    index,
  }: {
    strategy: any
    index: number
  }) => (
    <motion.div
      className="flex items-center justify-between p-3 border-b border-border last:border-b-0 hover:bg-muted/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{strategy.name}</span>
          <span
            className={`text-xs px-2 py-1 rounded ${
              strategy.status === 'active'
                ? 'bg-green-500/20 text-green-500'
                : 'bg-gray-500/20 text-gray-500'
            }`}
          >
            {strategy.status.toUpperCase()}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {strategy.description}
        </div>
        <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
          <span>Trades: {strategy.trades}</span>
          <span>Win Rate: {strategy.winRate}%</span>
        </div>
      </div>
      <div className="text-right">
        <div
          className={`font-medium ${
            strategy.pnl >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          ${strategy.pnl.toFixed(2)}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 mt-1"
          onClick={() =>
            toast({
              title: '🚧 Strategy Settings',
              description:
                "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
            })
          }
        >
          <Settings className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="positions">
              Positions ({positions.length})
            </TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="strategies">
              Strategies ({strategies.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <Tabs value={activeTab}>
          <TabsContent value="positions" className="mt-0">
            {positions.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No open positions
              </div>
            ) : (
              <div>
                {positions.map((position, index) => (
                  <PositionRow
                    key={position.id}
                    position={position}
                    index={index}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            {orders.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No open orders
              </div>
            ) : (
              <div>
                {orders.map((order, index) => (
                  <OrderRow key={order.id} order={order} index={index} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="strategies" className="mt-0">
            {strategies.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No active strategies
              </div>
            ) : (
              <div>
                {strategies.map((strategy, index) => (
                  <StrategyRow
                    key={strategy.id}
                    strategy={strategy}
                    index={index}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default PositionsPanel
