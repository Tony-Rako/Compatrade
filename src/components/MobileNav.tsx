import React from 'react'
import { Button } from '@/components/ui/button'
import {
  AreaChart,
  List,
  ShoppingCart,
  BookOpen,
  Sparkles,
  Wand2,
  BarChart,
  Briefcase,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { MobileTabType } from '@/types/trading'

interface MobileNavProps {
  activeTab: MobileTabType
  setActiveTab: (tab: MobileTabType) => void
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'chart', icon: AreaChart, label: 'Chart' },
    { id: 'trade', icon: ShoppingCart, label: 'Trade' },
    { id: 'positions', icon: Briefcase, label: 'Positions' },
    { id: 'orders', icon: BookOpen, label: 'Orders' },
    { id: 'markets', icon: List, label: 'Markets' },
    { id: 'ai_assistant', icon: Sparkles, label: 'AI' },
    { id: 'strategy_builder', icon: Wand2, label: 'Builder' },
    { id: 'analytics', icon: BarChart, label: 'Analytics' },
  ]

  return (
    <nav className="bg-background border-t border-border flex-shrink-0 safe-area-inset-bottom">
      {/* Mobile Layout (< 768px) - Scrollable */}
      <div className="md:hidden p-1">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-1 p-1.5">
            {navItems.map(item => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  'flex flex-col h-auto items-center justify-center p-2.5 rounded-lg text-[10px] w-16 min-h-[60px] transition-colors',
                  activeTab === item.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                onClick={() => setActiveTab(item.id as MobileTabType)}
              >
                <item.icon
                  className={cn(
                    'mb-1 transition-all',
                    activeTab === item.id ? 'h-5 w-5' : 'h-4 w-4'
                  )}
                />
                <span
                  className={cn(
                    'leading-tight text-center transition-all',
                    activeTab === item.id ? 'font-medium' : 'font-normal'
                  )}
                >
                  {item.label}
                </span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1" />
        </ScrollArea>
      </div>

      {/* Desktop Layout (>= 768px) - Grid */}
      <div className="hidden md:flex w-full p-2">
        <div className="flex justify-center w-full space-x-2 lg:space-x-3 xl:space-x-4">
          {navItems.map(item => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                'flex flex-col h-auto items-center justify-center p-2.5 rounded-lg transition-colors',
                'text-[10px] w-16 min-h-[60px]', // Mobile size
                'md:text-xs md:w-20 md:min-h-[64px]', // Tablet size
                'lg:text-sm lg:w-24 lg:min-h-[68px]', // Desktop size
                'xl:text-sm xl:w-28 xl:min-h-[72px]', // Large desktop size
                activeTab === item.id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              onClick={() => setActiveTab(item.id as MobileTabType)}
            >
              <item.icon
                className={cn(
                  'mb-1 transition-all',
                  activeTab === item.id ? 'h-5 w-5' : 'h-4 w-4',
                  'md:h-5 md:w-5',
                  'lg:h-6 lg:w-6'
                )}
              />
              <span
                className={cn(
                  'leading-tight text-center transition-all',
                  activeTab === item.id ? 'font-medium' : 'font-normal'
                )}
              >
                {item.label}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default MobileNav
