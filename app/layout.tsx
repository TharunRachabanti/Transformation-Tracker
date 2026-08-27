import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import QueryProvider from '@/lib/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Transformation Tracker',
  description: 'Your personal fitness, nutrition & transformation tracking system',
  manifest: '/manifest.json',
  keywords: ['fitness', 'nutrition', 'workout', 'transformation', 'weight loss'],
  authors: [{ name: 'Tharun' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
