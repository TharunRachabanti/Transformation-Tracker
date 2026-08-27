'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Utensils, Dumbbell, TrendingUp, User, Settings,
  Ruler, Camera, ShoppingCart, ChefHat, FileText, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mainNav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/diet', label: 'Diet', icon: Utensils },
  { href: '/workout', label: 'Workout', icon: Dumbbell },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
]

const moreNav = [
  { href: '/more/profile', label: 'Profile', icon: User },
  { href: '/more/measurements', label: 'Measurements', icon: Ruler },
  { href: '/more/photos', label: 'Photos', icon: Camera },
  { href: '/more/grocery', label: 'Grocery List', icon: ShoppingCart },
  { href: '/more/meal-prep', label: 'Meal Prep', icon: ChefHat },
  { href: '/more/weekly-report', label: 'Weekly Report', icon: FileText },
  { href: '/more/notifications', label: 'Notifications', icon: Bell },
  { href: '/more/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 glass border-r border-slate-800/60 z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white">Transformation</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tracker</p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="px-3 py-4 flex-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 px-3 mb-2">Main</p>
        <div className="space-y-0.5">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm',
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 1.5} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <p className="text-[10px] uppercase tracking-widest text-slate-500 px-3 mb-2 mt-6">More</p>
        <div className="space-y-0.5">
          {moreNav.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm',
                  isActive
                    ? 'bg-blue-500/20 text-blue-400 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2.5 : 1.5} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-800/60">
        <p className="text-[10px] text-slate-500">Personal use only · Not medical advice</p>
      </div>
    </aside>
  )
}
