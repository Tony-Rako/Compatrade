'use client'

import React, { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import TradingHeader from '@/components/TradingHeader'
import MarketSidebar from '@/components/MarketSidebar'
import TradingChart from '@/components/TradingChart'
import OrderBook from '@/components/OrderBook'
import TradePanel from '@/components/TradePanel'
import PositionsPanel from '@/components/PositionsPanel'
import MobileNav from '@/components/MobileNav'
import AdvancedSidebar from '@/components/AdvancedSidebar'
import { toast } from '@/components/ui/use-toast'
import useWebSocket from '@/hooks/useWebSocket'
import type { ViewType, MobileTabType } from '@/types/trading'

// Lazy load advanced components with loading states
const AIAssistant = dynamic(() => import('@/components/AIAssistant'), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground">Loading AI Assistant...</div>
    </div>
  ),
  ssr: false,
})

const StrategyBuilder = dynamic(() => import('@/components/StrategyBuilder'), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-muted-foreground">Loading Strategy Builder...</div>
    </div>
  ),
  ssr: false,
})

const AnalyticsDashboard = dynamic(
  () => import('@/components/AnalyticsDashboard'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading Analytics...</div>
      </div>
    ),
    ssr: false,
  }
)

interface PlaceholderViewProps {
  viewName: string
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ viewName }) => {
  React.useEffect(() => {
    toast({
      title: `🚧 ${viewName}`,
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }, [viewName])

  return (
    <div className="flex items-center justify-center h-full bg-background">
      <p className="text-muted-foreground">
        {viewName} will be implemented soon!
      </p>
    </div>
  )
}

const TradingLayout: React.FC = () => {
  useWebSocket()
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTabType>('chart')
  const [activeView, setActiveView] = useState<ViewType>('trade')

  const renderMainContent = () => {
    switch (activeView) {
      case 'trade':
        return (
          <>
            <div className="chart-container">
              <TradingChart />
            </div>
            <div className="positions-container hidden xl:block">
              <PositionsPanel />
            </div>
          </>
        )
      case 'ai_assistant':
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">
                  Loading AI Assistant...
                </div>
              </div>
            }
          >
            <AIAssistant />
          </Suspense>
        )
      case 'strategy_builder':
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">
                  Loading Strategy Builder...
                </div>
              </div>
            }
          >
            <StrategyBuilder />
          </Suspense>
        )
      case 'analytics':
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">
                  Loading Analytics...
                </div>
              </div>
            }
          >
            <AnalyticsDashboard />
          </Suspense>
        )
      case 'marketplace':
      case 'copy_trading':
      case 'competitions':
      case 'social':
        return <PlaceholderView viewName={activeView.replace(/_/g, ' ')} />
      default:
        return (
          <div className="chart-container">
            <TradingChart />
          </div>
        )
    }
  }

  const renderMobileContent = () => {
    // For advanced views, render them directly with proper height
    if (
      ['ai_assistant', 'strategy_builder', 'analytics'].includes(activeView)
    ) {
      const mainContent = renderMainContent()
      return <div className="h-full overflow-hidden">{mainContent}</div>
    }

    // For regular trading view, show tab-based content
    const tabMap = {
      chart: (
        <div className="h-full flex flex-col overflow-hidden">
          <TradingChart />
        </div>
      ),
      markets: (
        <div className="h-full overflow-hidden">
          <MarketSidebar />
        </div>
      ),
      trade: (
        <div className="h-full overflow-hidden">
          <TradePanel />
        </div>
      ),
      orders: (
        <div className="h-full overflow-hidden">
          <OrderBook />
        </div>
      ),
      positions: (
        <div className="h-full overflow-hidden">
          <PositionsPanel />
        </div>
      ),
      ai_assistant: (
        <div className="h-full overflow-hidden">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">
                  Loading AI Assistant...
                </div>
              </div>
            }
          >
            <AIAssistant />
          </Suspense>
        </div>
      ),
      strategy_builder: (
        <div className="h-full overflow-hidden">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">
                  Loading Strategy Builder...
                </div>
              </div>
            }
          >
            <StrategyBuilder />
          </Suspense>
        </div>
      ),
      analytics: (
        <div className="h-full overflow-hidden">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-muted-foreground">
                  Loading Analytics...
                </div>
              </div>
            }
          >
            <AnalyticsDashboard />
          </Suspense>
        </div>
      ),
    }

    return tabMap[activeMobileTab] || tabMap.chart
  }

  return (
    <div className="trading-layout-container">
      <AdvancedSidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Desktop Grid Layout */}
          <div className="hidden md:grid trading-grid h-full">
            <header className="trading-header">
              <TradingHeader />
            </header>

            <aside className="trading-sidebar">
              <MarketSidebar />
            </aside>

            <main className="trading-main">{renderMainContent()}</main>

            <aside className="trading-rightbar">
              <div className="order-book-container">
                <OrderBook />
              </div>
              <div className="trade-panel-container">
                <TradePanel />
              </div>
            </aside>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0">
              <TradingHeader />
            </div>
            <main className="flex-1 min-h-0 overflow-hidden">
              {renderMobileContent()}
            </main>
          </div>
        </div>

        {/* Persistent Footer Navigation - Always Visible */}
        <div className="flex-shrink-0">
          <MobileNav
            activeTab={activeMobileTab}
            setActiveTab={setActiveMobileTab}
          />
        </div>
      </div>
    </div>
  )
}

export default TradingLayout
