import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart,
  PieChart,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const sampleEquityData = Array.from({ length: 30 }, (_, i) => ({
  name: `Day ${i + 1}`,
  equity:
    10000 + Math.random() * 1000 * i - (i > 15 ? Math.random() * 500 * i : 0),
}))

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const AnalyticsDashboard: React.FC = () => {
  const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    color,
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-muted-foreground ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}
        >
          {change >= 0 ? '+' : ''}
          {change}% from last month
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="flex items-center p-3 sm:p-4 border-b border-border flex-shrink-0">
        <BarChart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-primary" />
        <h2 className="text-base sm:text-lg font-semibold">
          Performance Analytics
        </h2>
      </header>
      <div className="flex-1 p-3 sm:p-4 space-y-4 overflow-y-auto scrollbar-thin">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total P&L"
            value="$1,250.75"
            change={12.5}
            icon={DollarSign}
            color="text-green-500"
          />
          <MetricCard
            title="Win Rate"
            value="65.2%"
            change={-1.2}
            icon={Percent}
            color="text-red-500"
          />
          <MetricCard
            title="Sharpe Ratio"
            value="1.8"
            change={0.3}
            icon={TrendingUp}
            color="text-green-500"
          />
          <MetricCard
            title="Max Drawdown"
            value="-8.3%"
            change={2.1}
            icon={TrendingDown}
            color="text-green-500"
          />
        </div>
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base">Equity Curve</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={sampleEquityData}
                margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="equityColor" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                  tickFormatter={value => `$${(value / 1000).toFixed(0)}k`}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="hsl(var(--primary))"
                  fill="url(#equityColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base">
              Portfolio Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
            <PieChart className="h-6 w-6 sm:h-8 sm:w-8 mr-2" />
            <p className="text-sm text-center">
              Portfolio allocation chart is not yet implemented.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
