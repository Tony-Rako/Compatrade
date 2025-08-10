import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, Mic, Paperclip, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm your AI assistant. How can I help you analyze the market or build a strategy today?",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (input.trim() === '') return

    const newMessage = { id: Date.now(), sender: 'user', text: input }
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `This is a simulated response for "${input}". Feature not yet implemented.`,
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1500)
  }

  const handleQuickAction = (text: string) => {
    setInput(text)
    handleSendMessage()
  }

  const handleFeatureNotImplemented = () => {
    toast({
      title: '🚧 Feature Not Implemented',
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    })
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      // A bit of a hack to scroll to the bottom.
      setTimeout(() => {
        const viewport = scrollAreaRef.current?.querySelector(
          '[data-radix-scroll-area-viewport]'
        )
        if (viewport) viewport.scrollTop = viewport.scrollHeight
      }, 100)
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center p-4 border-b border-border">
        <Sparkles className="h-6 w-6 mr-3 text-primary" />
        <h2 className="text-lg font-semibold">AI Assistant</h2>
      </header>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {message.sender === 'ai' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AI
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs md:max-w-md p-3 rounded-lg text-sm',
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted rounded-bl-none'
                )}
              >
                {message.text}
              </div>
              {message.sender === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              className="flex items-start gap-3 justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted p-3 rounded-lg rounded-bl-none">
                <div className="flex items-center space-x-1">
                  <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-foreground rounded-full animate-bounce"></span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2 mb-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction('Analyze BTC/USDT chart')}
          >
            Analyze Chart
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              handleQuickAction('Create a simple momentum strategy')
            }
          >
            Create Strategy
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction('Explain RSI indicator')}
          >
            Explain Indicator
          </Button>
        </div>
        <div className="relative">
          <Input
            placeholder="Ask the AI anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            className="pr-24"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleFeatureNotImplemented}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleSendMessage}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
