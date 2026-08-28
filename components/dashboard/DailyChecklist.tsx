'use client'

import { useState, useTransition, useEffect } from 'react'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CHECKLIST_TEMPLATE } from '@/data/plans'
import { toggleChecklistItem } from '@/app/(app)/actions'

interface ChecklistItemState {
  key: string
  label: string
  completed: boolean
  completedAt: Date | null
  sortOrder: number
}

interface DBChecklistItem {
  key: string
  label: string
  completed: boolean
  completedAt: Date | string | null
}

export function DailyChecklist({ date = new Date().toISOString(), initialItems = [] }: { date?: string, initialItems?: DBChecklistItem[] }) {
  const [items, setItems] = useState<ChecklistItemState[]>(() => {
    // Map initialItems to the template
    return CHECKLIST_TEMPLATE.map((t) => {
      const existing = initialItems.find(i => i.key === t.key)
      return {
        ...t,
        completed: existing?.completed ?? false,
        completedAt: existing?.completedAt ? new Date(existing.completedAt) : null,
      }
    })
  })
  
  const [isPending, startTransition] = useTransition()

  function toggle(key: string, label: string) {
    let nextCompletedState = false
    setItems((prev) =>
      prev.map((item) => {
        if (item.key === key) {
          nextCompletedState = !item.completed
          return {
            ...item,
            completed: nextCompletedState,
            completedAt: !item.completed ? new Date() : null,
          }
        }
        return item
      })
    )

    startTransition(() => {
      toggleChecklistItem(new Date(date), key, label, nextCompletedState).catch(console.error)
    })
  }

  const completed = items.filter((i) => i.completed).length
  const total = items.length
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="glass rounded-2xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Daily Checklist</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">{completed}/{total}</span>
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-400">{pct}%</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Items */}
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => toggle(item.key, item.label)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-xl transition-all touch-target text-left',
              item.completed
                ? 'bg-green-500/8 border border-green-500/15'
                : 'hover:bg-slate-800/40'
            )}
          >
            <AnimatePresence mode="wait">
              {item.completed ? (
                <motion.div
                  key="checked"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                </motion.div>
              ) : (
                <motion.div
                  key="unchecked"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <Circle className="w-5 h-5 text-slate-600 shrink-0" />
                </motion.div>
              )}
            </AnimatePresence>
            <span
              className={cn(
                'flex-1 text-sm transition-colors',
                item.completed ? 'text-slate-400 line-through' : 'text-slate-200'
              )}
            >
              {item.label}
            </span>
            {item.completedAt && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <Clock className="w-2.5 h-2.5" />
                {format(item.completedAt, 'HH:mm')}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
