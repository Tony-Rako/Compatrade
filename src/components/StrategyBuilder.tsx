import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Play, Save, FolderOpen, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'

const StrategyBuilder = () => {
  const [conditions, setConditions] = useState([
    {
      id: 1,
      type: 'price',
      param1: 'BTC/USDT',
      operator: 'crosses_above',
      param2: 'MA',
      param3: '20',
    },
  ])
  const [actions, setActions] = useState([
    { id: 1, type: 'buy', amount: '10', unit: '%' },
  ])

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: Date.now(),
        type: 'price',
        param1: 'BTC/USDT',
        operator: 'crosses_above',
        param2: 'MA',
        param3: '20',
      },
    ])
  }

  const removeCondition = (id: number) => {
    setConditions(conditions.filter(c => c.id !== id))
  }

  const addAction = () => {
    setActions([
      ...actions,
      { id: Date.now(), type: 'buy', amount: '10', unit: '%' },
    ])
  }

  const removeAction = (id: number) => {
    setActions(actions.filter(a => a.id !== id))
  }

  const handleFeatureNotImplemented = (feature: string) => {
    toast({
      title: `🚧 ${feature}`,
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center">
          <Wand2 className="h-6 w-6 mr-3 text-primary" />
          <h2 className="text-lg font-semibold">Strategy Builder</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFeatureNotImplemented('Backtest')}
          >
            <Play className="h-4 w-4 mr-2" />
            Backtest
          </Button>
          <Button
            size="sm"
            onClick={() => handleFeatureNotImplemented('Save Strategy')}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-thin">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex justify-between items-center">
              Entry Conditions (AND)
              <Button variant="ghost" size="icon" onClick={addCondition}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {conditions.map(condition => (
              <motion.div
                key={condition.id}
                className="flex gap-2 items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Select defaultValue="price">
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="rsi">RSI</SelectItem>
                    <SelectItem value="macd">MACD</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="crosses_above">
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crosses_above">Crosses Above</SelectItem>
                    <SelectItem value="crosses_below">Crosses Below</SelectItem>
                    <SelectItem value="is_above">Is Above</SelectItem>
                    <SelectItem value="is_below">Is Below</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Value" className="w-[80px]" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCondition(condition.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex justify-between items-center">
              Actions
              <Button variant="ghost" size="icon" onClick={addAction}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {actions.map(action => (
              <motion.div
                key={action.id}
                className="flex gap-2 items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Select defaultValue="buy">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Amount" className="flex-1" type="number" />
                <Select defaultValue="%">
                  <SelectTrigger className="w-[80px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="%">% of Portfolio</SelectItem>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="btc">BTC</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAction(action.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Management</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Stop Loss (%)</label>
              <Input placeholder="e.g., 2" type="number" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Take Profit (%)</label>
              <Input placeholder="e.g., 5" type="number" />
            </div>
          </CardContent>
        </Card>
      </div>
      <footer className="p-4 border-t border-border">
        <Button
          className="w-full"
          size="lg"
          onClick={() => handleFeatureNotImplemented('Deploy Strategy')}
        >
          Deploy Strategy
        </Button>
      </footer>
    </div>
  )
}

export default StrategyBuilder
