'use client'

import { useState } from 'react'
import { Droplets, Plus, Minus, Trash2, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { calcProgress, formatWater } from '@/lib/utils'
import { format } from 'date-fns'

const QUICK_AMOUNTS = [250, 500, 750]

interface WaterEntry {
  id: string
  amountMl: number
  recordedAt: Date
}

interface WaterTrackerProps {
  currentMl?: number
  targetMl?: number
}

export function WaterTracker({ currentMl: initMl = 0, targetMl = 3500 }: WaterTrackerProps) {
  const [entries, setEntries] = useState<WaterEntry[]>([])
  const [totalMl, setTotalMl] = useState(initMl)
  const [customMl, setCustomMl] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  function addWater(ml: number) {
    if (ml <= 0) return
    const entry: WaterEntry = {
      id: crypto.randomUUID(),
      amountMl: ml,
      recordedAt: new Date(),
    }
    setEntries((prev) => [...prev, entry])
    setTotalMl((prev) => prev + ml)
  }

  function removeEntry(id: string, ml: number) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    setTotalMl((prev) => Math.max(0, prev - ml))
  }

  function handleCustomAdd() {
    const ml = parseInt(customMl)
    if (!isNaN(ml) && ml > 0 && ml <= 2000) {
      addWater(ml)
      setCustomMl('')
      setShowCustom(false)
    }
  }

  const pct = calcProgress(totalMl, targetMl)

  return (
    <div className="glass rounded-2xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-cyan-400" />
          <h2 className="font-semibold text-white">Water</h2>
        </div>
        <span className="text-sm font-bold text-cyan-400">
          {formatWater(totalMl)} / {formatWater(targetMl)}
        </span>
      </div>

      {/* Progress */}
      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {/* Droplet markers */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute top-0 bottom-0 w-px bg-slate-700/50"
            style={{ left: `${mark}%` }}
          />
        ))}
      </div>

      {/* Quick Add Buttons */}
      <div className="flex gap-2">
        {QUICK_AMOUNTS.map((ml) => (
          <button
            key={ml}
            onClick={() => addWater(ml)}
            className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 font-medium py-2.5 rounded-xl text-sm transition-all active:scale-95 touch-target flex items-center justify-center"
          >
            +{ml}ml
          </button>
        ))}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 text-slate-400 px-3 py-2.5 rounded-xl text-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Custom Amount */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2">
              <input
                type="number"
                value={customMl}
                onChange={(e) => setCustomMl(e.target.value)}
                placeholder="Custom ml (e.g. 350)"
                className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                min={1} max={2000}
              />
              <button
                onClick={handleCustomAdd}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 rounded-xl text-sm font-medium transition-all"
              >
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entry History */}
      <AnimatePresence>
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-1.5 max-h-32 overflow-y-auto"
          >
            {[...entries].reverse().map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{format(entry.recordedAt, 'HH:mm')}</span>
                  <span className="text-cyan-400 font-medium">+{entry.amountMl}ml</span>
                </div>
                <button
                  onClick={() => removeEntry(entry.id, entry.amountMl)}
                  className="text-slate-600 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
