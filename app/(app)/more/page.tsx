'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  User, Ruler, Camera, ShoppingCart, ChefHat, FileText,
  Bell, Settings, ChevronRight, Scale
} from 'lucide-react'

const MORE_ITEMS = [
  {
    section: 'Tracking',
    items: [
      { href: '/more/weight', icon: Scale, label: 'Weight Entry', desc: 'Log today\'s weight', color: 'text-[#8CA488]', bg: 'bg-[#748C70]/15' },
      { href: '/more/measurements', icon: Ruler, label: 'Body Measurements', desc: 'Waist, chest, arms...', color: 'text-violet-400', bg: 'bg-violet-500/15' },
      { href: '/more/photos', icon: Camera, label: 'Transformation Photos', desc: 'Before & after comparison', color: 'text-pink-400', bg: 'bg-pink-500/15' },
    ],
  },
  {
    section: 'Planning',
    items: [
      { href: '/more/grocery', icon: ShoppingCart, label: 'Grocery List', desc: 'Weekly auto-generated list', color: 'text-green-400', bg: 'bg-green-500/15' },
      { href: '/more/meal-prep', icon: ChefHat, label: 'Meal Prep', desc: 'Weekly ingredient calculator', color: 'text-orange-400', bg: 'bg-orange-500/15' },
    ],
  },
  {
    section: 'Reports',
    items: [
      { href: '/more/weekly-report', icon: FileText, label: 'Weekly Report', desc: 'Auto-generated summary', color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
    ],
  },
  {
    section: 'Settings',
    items: [
      { href: '/more/profile', icon: User, label: 'Profile', desc: 'Personal details & goals', color: 'text-slate-400', bg: 'bg-slate-700/40' },
      { href: '/more/notifications', icon: Bell, label: 'Notifications', desc: 'Meal & habit reminders', color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
      { href: '/more/settings', icon: Settings, label: 'App Settings', desc: 'Targets & preferences', color: 'text-slate-400', bg: 'bg-slate-700/40' },
    ],
  },
]

export default function MorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">More</h1>
        <p className="text-sm text-slate-400 mt-0.5">All features & settings</p>
      </div>

      {MORE_ITEMS.map(({ section, items }) => (
        <div key={section} className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">{section}</p>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-slate-800/60">
            {items.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-800/40 transition-all active:bg-slate-800/60"
                >
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-center text-[11px] text-slate-600 pb-2">
        Personal transformation tracker · Not medical advice
      </p>
    </div>
  )
}
