'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Ruler, Plus, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MeasurementEntry {
  date: string
  waist?: number
  chest?: number
  neck?: number
  leftArm?: number
  rightArm?: number
  thigh?: number
}

const INITIAL_MEASUREMENTS: MeasurementEntry[] = [
  { date: '2025-01-01', waist: 101, chest: 104, neck: 40, leftArm: 36, rightArm: 36.5, thigh: 62 },
  { date: '2025-02-01', waist: 98, chest: 102, neck: 39.5 },
  { date: '2025-03-01', waist: 96, chest: 101, neck: 39 },
]

const MEASUREMENT_FIELDS = [
  { key: 'waist', label: 'Waist', unit: 'cm', icon: '📏', frequency: 'weekly' },
  { key: 'chest', label: 'Chest', unit: 'cm', icon: '💪', frequency: 'monthly' },
  { key: 'neck', label: 'Neck', unit: 'cm', icon: '🔵', frequency: 'monthly' },
  { key: 'leftArm', label: 'Left Arm', unit: 'cm', icon: '💪', frequency: 'monthly' },
  { key: 'rightArm', label: 'Right Arm', unit: 'cm', icon: '💪', frequency: 'monthly' },
  { key: 'thigh', label: 'Thigh', unit: 'cm', icon: '🦵', frequency: 'monthly' },
]

export default function MeasurementsPage() {
  const [entries, setEntries] = useState<MeasurementEntry[]>(INITIAL_MEASUREMENTS)
  const [form, setForm] = useState<Partial<MeasurementEntry>>({ date: format(new Date(), 'yyyy-MM-dd') })
  const [saved, setSaved] = useState(false)

  const latest = entries[entries.length - 1]
  const first = entries[0]

  function handleSave() {
    if (!form.date) return
    const existing = entries.findIndex((e) => e.date === form.date)
    if (existing >= 0) {
      setEntries((prev) => prev.map((e, i) => i === existing ? { ...e, ...form } : e))
    } else {
      setEntries((prev) => [...prev, form as MeasurementEntry].sort((a, b) => a.date.localeCompare(b.date)))
    }
    setForm({ date: format(new Date(), 'yyyy-MM-dd') })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Measurements</h1>
        <p className="text-sm text-slate-400 mt-0.5">Waist weekly · Others monthly</p>
      </div>

      {/* Delta Summary */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Ruler className="w-4 h-4 text-violet-400" />
          Progress Summary
        </h2>
        {MEASUREMENT_FIELDS.map((field) => {
          const startVal = first?.[field.key as keyof MeasurementEntry] as number | undefined
          const currVal = latest?.[field.key as keyof MeasurementEntry] as number | undefined
          const delta = startVal !== undefined && currVal !== undefined ? currVal - startVal : null

          return (
            <div key={field.key} className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0">
              <div>
                <span className="text-sm text-slate-300">{field.label}</span>
                <span className="text-[10px] text-slate-600 ml-2 uppercase">{field.frequency}</span>
              </div>
              <div className="text-right">
                {startVal !== undefined && currVal !== undefined ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{startVal} →</span>
                    <span className="text-sm font-medium text-white">{currVal} cm</span>
                    {delta !== null && (
                      <span className={cn('text-xs font-medium flex items-center gap-0.5', delta < 0 ? 'text-green-400' : delta > 0 ? 'text-red-400' : 'text-slate-400')}>
                        {delta < 0 ? <TrendingDown className="w-3 h-3" /> : delta > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-600">No data</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Log Form */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Plus className="w-4 h-4 text-violet-400" />
          Log Measurements
        </h2>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MEASUREMENT_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-xs text-slate-500 mb-1 block">{field.label} (cm)</label>
              <input
                type="number" step={0.5} min={0}
                value={(form as any)[field.key] ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, [field.key]: parseFloat(e.target.value) || undefined }))}
                placeholder="0.0"
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white text-center focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
          ))}
        </div>
        {saved && <p className="text-green-400 text-sm text-center">✓ Measurements saved!</p>}
        <button onClick={handleSave} className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium py-3 rounded-xl transition-all">
          Save Measurements
        </button>
      </div>

      {/* History */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-white">History</h2>
        {[...entries].reverse().map((entry) => (
          <div key={entry.date} className="py-2 border-b border-slate-800/40 last:border-0">
            <p className="text-xs text-slate-500 mb-1.5">{format(new Date(entry.date + 'T00:00:00'), 'MMM d, yyyy')}</p>
            <div className="flex flex-wrap gap-2">
              {MEASUREMENT_FIELDS.map((f) => {
                const val = (entry as any)[f.key]
                if (!val) return null
                return (
                  <span key={f.key} className="text-xs bg-slate-800/60 border border-slate-700/40 rounded-lg px-2 py-1">
                    <span className="text-slate-500">{f.label}: </span>
                    <span className="text-white font-medium">{val}</span>
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
