'use client'

import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { FileText, TrendingDown, TrendingUp, CheckCircle2, XCircle, Minus, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Mock weekly data for current and previous week
const CURRENT_WEEK = {
  weekStart: subDays(new Date(), 6),
  weekEnd: new Date(),
  avgWeight: 94.3,
  startWeight: 94.8,
  endWeight: 93.9,
  weightChange: -0.9,
  avgCalories: 2150,
  avgProtein: 138,
  avgSteps: 8240,
  avgWaterMl: 3100,
  avgSleepH: 7.5,
  gymSessions: 5,
  gymTarget: 6,
  dietAdherence: 82,
  habitAdherence: 78,
  notes: '',
}

export default function WeeklyReportPage() {
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const w = CURRENT_WEEK

  const weeklyScoreCategories = [
    { label: 'Avg Calories', value: `${w.avgCalories} kcal`, target: '2300 kcal', ok: w.avgCalories <= 2300, neutral: Math.abs(w.avgCalories - 2300) < 100 },
    { label: 'Avg Protein', value: `${w.avgProtein} g`, target: '160 g', ok: w.avgProtein >= 150, neutral: w.avgProtein >= 130 },
    { label: 'Avg Steps', value: w.avgSteps.toLocaleString(), target: '10,000', ok: w.avgSteps >= 10000, neutral: w.avgSteps >= 7000 },
    { label: 'Avg Water', value: `${(w.avgWaterMl / 1000).toFixed(2)} L`, target: '3.5 L', ok: w.avgWaterMl >= 3500, neutral: w.avgWaterMl >= 2800 },
    { label: 'Avg Sleep', value: `${w.avgSleepH} h`, target: '7–9 h', ok: w.avgSleepH >= 7 && w.avgSleepH <= 9, neutral: w.avgSleepH >= 6 },
    { label: 'Gym Sessions', value: `${w.gymSessions}/${w.gymTarget}`, target: `${w.gymTarget}/week`, ok: w.gymSessions >= w.gymTarget, neutral: w.gymSessions >= w.gymTarget - 1 },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/more" className="w-10 h-10 rounded-xl bg-[#0c1528] border border-[#1a2550] text-[#60a5fa] flex items-center justify-center hover:bg-[#141e40] hover:text-white transition-colors shrink-0 shadow-lg shadow-[#60a5fa]/5">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Weekly Report</h1>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">
            {format(w.weekStart, 'MMM d')} – {format(w.weekEnd, 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* Weight Change */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          Weight Summary
        </h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-[11px] text-slate-500">Week Start</p>
            <p className="text-lg font-bold text-white">{w.startWeight} kg</p>
          </div>
          <div className="border-x border-slate-800/60">
            <p className="text-[11px] text-slate-500">Change</p>
            <div className={cn('text-lg font-bold flex items-center justify-center gap-1', w.weightChange < 0 ? 'text-green-400' : 'text-red-400')}>
              {w.weightChange < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              {w.weightChange > 0 ? '+' : ''}{w.weightChange.toFixed(1)} kg
            </div>
          </div>
          <div>
            <p className="text-[11px] text-slate-500">Week End</p>
            <p className="text-lg font-bold text-white">{w.endWeight} kg</p>
          </div>
        </div>
        <div className="bg-slate-800/40 rounded-xl p-3">
          <p className="text-[11px] text-slate-500 uppercase tracking-wide">7-Day Average</p>
          <p className="text-2xl font-bold text-blue-400 mt-0.5">{w.avgWeight} kg</p>
        </div>
        <p className="text-[10px] text-slate-500 italic">Weight change calculated using 7-day rolling averages. Not based on a single day&apos;s weight.</p>
      </div>

      {/* Adherence Summary */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">Adherence</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/40 rounded-xl p-3 text-center">
            <p className="text-[11px] text-slate-500">Diet Adherence</p>
            <p className={cn('text-2xl font-bold mt-1', w.dietAdherence >= 80 ? 'text-green-400' : w.dietAdherence >= 60 ? 'text-yellow-400' : 'text-red-400')}>
              {w.dietAdherence}%
            </p>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-3 text-center">
            <p className="text-[11px] text-slate-500">Habit Adherence</p>
            <p className={cn('text-2xl font-bold mt-1', w.habitAdherence >= 80 ? 'text-green-400' : w.habitAdherence >= 60 ? 'text-yellow-400' : 'text-red-400')}>
              {w.habitAdherence}%
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-white mb-3">Weekly Averages</h2>
        {weeklyScoreCategories.map((cat) => (
          <div key={cat.label} className="flex items-center justify-between py-2 border-b border-slate-800/30 last:border-0">
            <span className="text-sm text-slate-300">{cat.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">{cat.value}</span>
              <span className="text-[10px] text-slate-600">/ {cat.target}</span>
              {cat.ok
                ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                : cat.neutral
                  ? <Minus className="w-4 h-4 text-yellow-400" />
                  : <XCircle className="w-4 h-4 text-red-400" />
              }
            </div>
          </div>
        ))}
      </div>

      {/* What went well / needs improvement */}
      <div className="grid grid-cols-1 gap-3">
        <div className="glass rounded-2xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-green-400">💪 What Went Well</h3>
          <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
            {w.gymSessions >= 5 && <li>Great gym consistency ({w.gymSessions} sessions)</li>}
            {w.weightChange < 0 && <li>Weight trending down ({w.weightChange.toFixed(1)} kg this week)</li>}
            {w.avgProtein >= 130 && <li>Good protein intake avg ({w.avgProtein}g/day)</li>}
          </ul>
        </div>
        <div className="glass rounded-2xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-yellow-400">📈 Needs Improvement</h3>
          <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
            {w.avgWaterMl < 3500 && <li>Water intake below target (avg {(w.avgWaterMl/1000).toFixed(2)} L vs 3.5 L goal)</li>}
            {w.avgSteps < 10000 && <li>Steps below target (avg {w.avgSteps.toLocaleString()} vs 10,000 goal)</li>}
            {w.avgProtein < 150 && <li>Protein below optimal (avg {w.avgProtein}g vs 150–160g goal)</li>}
          </ul>
          <p className="text-[10px] text-slate-600 italic mt-2">Not medical advice – personal tracking only</p>
        </div>
      </div>

      {/* Journal Note */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">📝 Weekly Note</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How did this week go? What will you do differently next week?"
          rows={4}
          className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
        />
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2.5 rounded-xl text-sm transition-all"
        >
          {saved ? '✓ Saved!' : 'Save Note'}
        </button>
      </div>
    </div>
  )
}
