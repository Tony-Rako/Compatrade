import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Settings, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import useTradingStore from '@/store/tradingStore'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import type { ChartInterval } from '@/types/trading'
import { useShallow } from 'zustand/react/shallow'
import PriceDisplay from '@/components/PriceDisplay'

interface ChartControlsProps {
  chartType: string
  setChartType: (type: string) => void
}

const ChartHeader = React.memo(() => {
  const { selectedSymbol, chartInterval, setChartInterval } = useTradingStore(
    useShallow(state => ({
      selectedSymbol: state.selectedSymbol,
      chartInterval: state.chartInterval,
      setChartInterval: state.setChartInterval,
    }))
  )

  const intervals = ['1m', '5m', '15m', '1h', '4h', '1d']

  const handleFullscreen = () => {
    toast({
      title: '🚧 Fullscreen Chart',
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }

  const handleSettings = () => {
    toast({
      title: '🚧 Chart Settings',
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }

  return (
    <div className="flex flex-col border-b border-border">
      <div className="flex items-center justify-between p-2 sm:p-3 md:p-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold truncate">
            {selectedSymbol} Chart
          </h3>
          <div className="hidden xs:block">
            <PriceDisplay symbol={selectedSymbol} />
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={handleSettings}
          >
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={handleFullscreen}
          >
            <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile price display */}
      <div className="block xs:hidden px-2 pb-2">
        <PriceDisplay symbol={selectedSymbol} />
      </div>

      {/* Time intervals - responsive layout */}
      <div className="px-2 sm:px-3 md:px-4 pb-2">
        <Tabs
          value={chartInterval}
          onValueChange={value => setChartInterval(value as ChartInterval)}
        >
          <TabsList className="grid grid-cols-6 w-full sm:w-fit h-8">
            {intervals.map(interval => (
              <TabsTrigger
                key={interval}
                value={interval}
                className="text-xs px-1 sm:px-2 h-full"
              >
                {interval}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
})
ChartHeader.displayName = 'ChartHeader'

const ChartControls = React.memo(
  ({ chartType, setChartType }: ChartControlsProps) => {
    const handleIndicator = (indicator: string) => {
      toast({
        title: `🚧 ${indicator} Indicator`,
        description:
          "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      })
    }

    return (
      <div className="hidden md:flex items-center space-x-2 p-2 md:p-4 border-b border-border">
        <Button
          variant={chartType === 'candlestick' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleIndicator('Candlestick')}
        >
          <BarChart3 className="h-4 w-4 mr-1" /> Candlestick
        </Button>
        <Button
          variant={chartType === 'line' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setChartType('line')}
        >
          <TrendingUp className="h-4 w-4 mr-1" /> Line
        </Button>
        <div className="flex items-center space-x-2 ml-4">
          <span className="text-sm text-muted-foreground">Indicators:</span>
          {['MA', 'EMA', 'RSI', 'MACD', 'Volume'].map(indicator => (
            <Button
              key={indicator}
              variant={'ghost'}
              size="sm"
              onClick={() => handleIndicator(indicator)}
            >
              {indicator}
            </Button>
          ))}
        </div>
      </div>
    )
  }
)
ChartControls.displayName = 'ChartControls'

const Chart = React.memo(() => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { data, change24h, selectedSymbol } = useTradingStore(
    useShallow(state => {
      const currentPrice = state.prices.get(state.selectedSymbol)
      return {
        data: state.chartData.get(state.selectedSymbol) || [],
        change24h: currentPrice ? currentPrice.change24h : 0,
        selectedSymbol: state.selectedSymbol,
      }
    })
  )

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-muted-foreground">Loading chart data...</div>
      </div>
    )
  }

  const chartColor = change24h >= 0 ? 'hsl(var(--primary))' : '#ef4444'
  const gradientId = `color-${selectedSymbol}`

  return (
    <div className="flex-1 p-1 sm:p-2 md:p-4 min-h-0 h-full overflow-hidden">
      <div className="w-full h-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: isMobile ? 5 : 10,
              left: isMobile ? -25 : -20,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tickFormatter={time => {
                const date = new Date(time)
                return isMobile
                  ? date
                      .toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                      .replace(':', '')
                  : date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
              }}
              stroke="hsl(var(--muted-foreground))"
              fontSize={isMobile ? 10 : 12}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              interval="preserveStartEnd"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              orientation="right"
              domain={['dataMin * 0.995', 'dataMax * 1.005']}
              stroke="hsl(var(--muted-foreground))"
              fontSize={isMobile ? 10 : 12}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickFormatter={value =>
                isMobile ? `${value.toFixed(0)}` : `${value.toFixed(2)}`
              }
              axisLine={false}
              tickLine={false}
              width={isMobile ? 40 : 50}
            />
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.3}
            />
            <Tooltip
              animationDuration={200}
              labelFormatter={time => new Date(time).toLocaleString()}
              formatter={value => [`${Number(value).toFixed(4)}`, 'Price']}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                fontSize: isMobile ? '12px' : '14px',
              }}
            />
            <Area
              isAnimationActive={false}
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={isMobile ? 1.5 : 2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})
Chart.displayName = 'Chart'

const TradingChart: React.FC = () => {
  const [chartType, setChartType] = useState<string>('line')

  return (
    <div className="flex flex-col h-full">
      <ChartHeader />
      <ChartControls chartType={chartType} setChartType={setChartType} />
      <Chart />
    </div>
  )
}

export default TradingChart
