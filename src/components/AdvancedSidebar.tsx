import React from 'react'
import {
  Wand2,
  Sparkles,
  BarChart,
  Store,
  Users,
  Trophy,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ViewType } from '@/types/trading'

interface AdvancedSidebarProps {
  activeView: ViewType
  setActiveView: (view: ViewType) => void
}

const AdvancedSidebar: React.FC<AdvancedSidebarProps> = ({
  activeView,
  setActiveView,
}) => {
  const navItems = [
    // Phase 2
    { id: 'ai_assistant', icon: Sparkles, label: 'AI Assistant', phase: 2 },
    {
      id: 'strategy_builder',
      icon: Wand2,
      label: 'Strategy Builder',
      phase: 2,
    },
    { id: 'analytics', icon: BarChart, label: 'Analytics', phase: 2 },
    // Phase 3
    { id: 'marketplace', icon: Store, label: 'Marketplace', phase: 3 },
    { id: 'copy_trading', icon: Users, label: 'Copy Trading', phase: 3 },
    { id: 'competitions', icon: Trophy, label: 'Competitions', phase: 3 },
    { id: 'social', icon: MessageSquare, label: 'Social Feed', phase: 3 },
  ]

  return (
    <aside className="h-full bg-background flex flex-col items-center p-1.5 sm:p-2 border-r border-border w-12 sm:w-14 flex-shrink-0">
      <TooltipProvider delayDuration={200}>
        <nav className="flex flex-col items-center gap-1.5 sm:gap-2 mt-2 sm:mt-4 w-full">
          {navItems.map(item => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === item.id ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setActiveView(item.id as ViewType)}
                  className={cn(
                    'rounded-lg w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0',
                    activeView === item.id &&
                      'bg-primary text-primary-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2 hidden sm:block">
                <p className="text-xs sm:text-sm">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Mobile-only active indicator */}
        <div className="block sm:hidden mt-4 px-2">
          {navItems.find(item => item.id === activeView) && (
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground leading-tight">
                {
                  navItems
                    .find(item => item.id === activeView)
                    ?.label.split(' ')[0]
                }
              </p>
            </div>
          )}
        </div>
      </TooltipProvider>
    </aside>
  )
}

export default AdvancedSidebar
