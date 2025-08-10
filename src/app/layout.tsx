import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/index.css'
import { Toaster } from '@/components/ui/toaster'
import { TRPCProvider } from '@/components/providers/TRPCProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Compatrade - AI-Powered Crypto Trading Platform',
  description:
    'Professional crypto trading platform with AI assistance and advanced analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <TRPCProvider>
          {children}
          <Toaster />
        </TRPCProvider>
      </body>
    </html>
  )
}
