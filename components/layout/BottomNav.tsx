'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Utensils, Dumbbell, TrendingUp, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/app-store'

const navItems = [
  { id: 'home', href: '/', label: 'Home', icon: Home },
  { id: 'diet', href: '/', label: 'Diet', icon: Utensils },
  { id: 'workout', href: '/', label: 'Workout', icon: Dumbbell },
  { id: 'progress', href: '/', label: 'Progress', icon: TrendingUp },
  { id: 'more', href: '/more', label: 'More', icon: MoreHorizontal },
]

export function BottomNav() {
  const pathname = usePathname()
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden w-full">
      {/* Blur backdrop */}
      <div
        className="border-t border-[#32402f] bg-[#0d1110]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}
      >
        <div className="flex items-center justify-around px-2 pt-2.5 pb-1">
          {navItems.map((item) => {
            const isMoreTab = item.id === 'more'
            // Active if it's the More tab and we are on a /more route, or if we're on / and activeTab matches
            const isActive = isMoreTab 
              ? pathname.startsWith('/more') 
              : pathname === '/' && activeTab === item.id

            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch={true}
                onClick={() => {
                  if (!isMoreTab) {
                    setActiveTab(item.id as 'home' | 'diet' | 'workout' | 'progress')
                  }
                }}
                className="flex flex-col items-center gap-1 touch-target justify-center px-2 relative group"
              >
                {/* Active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-x-0 top-0 bottom-0 rounded-2xl bg-[#748C70]/10 border border-[#748C70]/15"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <item.icon
                    className={cn(
                      'w-[18px] h-[18px] transition-all duration-200',
                      isActive
                        ? 'text-[#748C70]'
                        : 'text-slate-600 group-hover:text-slate-400'
                    )}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  <span className={cn(
                    'text-[9px] font-semibold tracking-wide transition-colors',
                    isActive ? 'text-[#748C70]' : 'text-slate-600 group-hover:text-slate-400'
                  )}>
                    {item.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
