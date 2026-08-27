'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Scale, TrendingDown, TrendingUp } from 'lucide-react'
import { format, subDays } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts'
import { cn } from '@/lib/utils'

// Mock weight entries
const mockEntries = Array.from({ length: 30 }, (_, i) => {
  let w = 96
  for (let j = 0; j <= i; j++) w -= Math.random() * 0.12 - 0.03
  return { date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'), weightKg: parseFloat(w.toFixed(1)) }
}).map((e, i, arr) => ({
  ...e,
  avg7: parseFloat(
    (arr.slice(Math.max(0, i - 6), i + 1).reduce((s, x) => s + x.weightKg, 0) /
      Math.min(7, i + 1)).toFixed(1)
  ),
}))

export default function WeightPage() {
  const [entries, setEntries] = useState(mockEntries)
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  const currentWeight = entries[entries.length - 1]?.weightKg ?? 96
  const startWeight = 96
  const goalWeight = 81
  const avg7 = entries.slice(-7).reduce((s, e) => s + e.weightKg, 0) / Math.min(7, entries.length)
  const weekChange = entries.length > 7
    ? (entries.slice(-7).reduce((s, e) => s + e.weightKg, 0) / 7) -
      (entries.slice(-14, -7).reduce((s, e) => s + e.weightKg, 0) / 7)
    : null

  function handleSave() {
    const w = parseFloat(weight)
    if (isNaN(w) || w < 30 || w > 250) return
    const today = format(new Date(), 'yyyy-MM-dd')
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.date !== today)
      const newEntry = { date: today, weightKg: w, avg7: w, notes }
      return [...filtered, newEntry].sort((a, b) => a.date.localeCompare(b.date))
    })
    setWeight('')
    setNotes('')
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const chartData = entries.map((e) => ({ ...e, date: format(new Date(e.date + 'T00:00:00'), 'MMM d') }))

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Weight Tracker</h1>
        <p className="text-sm text-slate-400 mt-0.5">Morning · After bathroom · Before food</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Current', value: `${currentWeight} kg`, color: 'text-white', large: true },
          { label: 'Lost Total', value: `${(startWeight - currentWeight).toFixed(1)} kg`, color: 'text-green-400' },
          { label: '7-Day Avg', value: `${avg7.toFixed(1)} kg`, color: 'text-blue-400' },
          { label: 'To Goal', value: `${(currentWeight - goalWeight).toFixed(1)} kg`, color: 'text-violet-400' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-3">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={cn('text-xl font-bold mt-0.5', s.color)}>{s.value}</p>
            {s.label === '7-Day Avg' && weekChange !== null && (
              <div className={cn('flex items-center gap-1 text-xs mt-1', weekChange < 0 ? 'text-green-400' : 'text-red-400')}>
                {weekChange < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {weekChange < 0 ? '' : '+'}{weekChange.toFixed(2)} kg this week
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Weight Entry Form */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-400" />
          Log Today&apos;s Weight
        </h2>
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 94.5"
              step={0.1}
              min={30}
              max={250}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-xl font-bold text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-600"
            />
          </div>
          <span className="text-slate-400 font-medium">kg</span>
        </div>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        {saved && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-sm text-center">
            ✓ Weight saved!
          </motion.p>
        )}
        <button
          onClick={handleSave}
          disabled={!weight}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium py-3 rounded-xl transition-all"
        >
          Save Weight
        </button>
        <p className="text-[10px] text-slate-600 text-center">Tip: Weigh at same time daily for consistency</p>
      </div>

      {/* Chart */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">Weight Trend</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData.slice(-30)} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickLine={false} interval={6} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="weightKg" name="Weight" stroke="#3b82f6" fill="url(#wGrad)" strokeWidth={2} dot={false} unit=" kg" />
              <Line type="monotone" dataKey="avg7" name="7d Avg" stroke="#8b5cf6" strokeWidth={2} dot={false} strokeDasharray="4 2" unit=" kg" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex gap-4 text-xs justify-center">
          <span className="flex items-center gap-1.5 text-slate-400"><span className="w-3 h-0.5 bg-blue-500 inline-block" />Daily</span>
          <span className="flex items-center gap-1.5 text-slate-400"><span className="w-3 h-0.5 bg-violet-500 inline-block border-dashed" />7d Avg</span>
        </div>
      </div>

      {/* History */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-white">History</h2>
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {[...entries].reverse().slice(0, 14).map((entry) => (
            <div key={entry.date} className="flex justify-between items-center text-sm py-1.5 border-b border-slate-800/40 last:border-0">
              <span className="text-slate-400">{format(new Date(entry.date + 'T00:00:00'), 'EEE, MMM d')}</span>
              <span className="font-medium text-white">{entry.weightKg} kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
