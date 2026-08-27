'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Utensils, Dumbbell, TrendingUp, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/diet', label: 'Diet', icon: Utensils },
  { href: '/workout', label: 'Workout', icon: Dumbbell },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/more', label: 'More', icon: MoreHorizontal },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="glass border-t border-slate-800/60 bottom-nav">
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 touch-target justify-center px-3 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-blue-400' : 'text-slate-500'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive ? 'text-blue-400' : 'text-slate-500'
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
