'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Flame, Droplets, Footprints, Moon, Dumbbell, TrendingDown, ArrowRight } from 'lucide-react'
import { getDaysSinceStart, calcProgress, formatWater, formatDuration } from '@/lib/utils'
import { CHECKLIST_TEMPLATE } from '@/data/plans'
import { WaterTracker } from '@/components/dashboard/WaterTracker'
import { DailyChecklist } from '@/components/dashboard/DailyChecklist'

export interface DashboardData {
  calories: number
  protein: number
  waterMl: number
  steps: number
  sleepMin: number
  gymCompleted: boolean
  mealsCompleted: number
  totalMeals: number
  currentWeight: number
  waterEntries: any[]
  checklistItems: any[]
}

export function HomeUI({ 
  todayData, 
  profile,
  dayCount,
  completionPct
}: { 
  todayData: DashboardData
  profile: any
  dayCount: number
  completionPct: number
}) {
  const [today] = useState(new Date())
  const weightLost = Math.max(0, (profile.startingWeight || 96) - todayData.currentWeight)
  const weightToGo = Math.max(0, todayData.currentWeight - (profile.targetWeight || 81))

  return (
    <div className="space-y-5 pb-1">
      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <p className="text-[11px] text-slate-500 uppercase tracking-[0.18em] font-semibold">
            {format(today, 'EEEE, MMMM d')}
          </p>
          <h1 className="text-[26px] font-bold text-white mt-1 leading-tight">
            Day{' '}
            <span className="gradient-text">#{dayCount}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {profile.name ? `Welcome back, ${profile.name.split(' ')[0]}` : 'Stay consistent today 💪'}
          </p>
        </div>

        {/* Completion Ring */}
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="27" fill="none" stroke="#111611" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="27" fill="none"
                stroke="url(#ring-grad)"
                strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 27}`}
                strokeDashoffset={`${2 * Math.PI * 27 * (1 - completionPct / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
              <defs>
                <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#748C70" />
                  <stop offset="100%" stopColor="#C2A878" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-white">{completionPct}%</span>
            </div>
          </div>
          <span className="text-[9px] text-slate-600 uppercase tracking-wide">Today</span>
        </div>
      </motion.div>

      {/* ── Weight Journey ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 28, 65, 0.9) 0%, rgba(10, 16, 38, 0.95) 100%)',
          border: '1px solid rgba(116, 140, 112, 0.12)'
        }}
      >
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-white">Weight Journey</span>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
              -{weightLost.toFixed(1)} kg lost
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#161c16]/60 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Start</p>
              <p className="text-lg font-bold text-slate-300">{profile.startingWeight || 96}</p>
              <p className="text-[10px] text-slate-600">kg</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(116, 140, 112, 0.1)', border: '1px solid rgba(116, 140, 112, 0.2)' }}>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">Current</p>
              <p className="text-2xl font-bold text-white">{todayData.currentWeight || profile.startingWeight}</p>
              <p className="text-[10px] text-slate-400">kg</p>
            </div>
            <div className="bg-[#161c16]/60 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Goal</p>
              <p className="text-lg font-bold text-[#748C70]">{profile.targetWeight || 81}</p>
              <p className="text-[10px] text-slate-600">kg</p>
            </div>
          </div>

          {/* Progress to goal */}
          <div className="mt-4">
            <div className="h-2 bg-[#161c16] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #748C70, #C2A878)' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (weightLost / Math.max(1, (profile.startingWeight || 96) - (profile.targetWeight || 81))) * 100)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-slate-600">{weightLost.toFixed(1)} kg lost</span>
              <span className="text-[10px] text-slate-600">{weightToGo.toFixed(1)} kg to go</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Today's Progress ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em] mb-3">
          Today's Progress
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <MacroCard
            label="Calories"
            value={todayData.calories}
            target={profile.calorieTartet || 2300}
            unit="kcal"
            icon={<Flame className="w-4 h-4" />}
            color="orange"
          />
          <MacroCard
            label="Protein"
            value={todayData.protein}
            target={profile.proteinTargetG || 160}
            unit="g"
            icon={<span className="text-sm leading-none">🍗</span>}
            color="blue"
          />
          <MacroCard
            label="Water"
            value={Math.round(todayData.waterMl / 100) / 10}
            target={(profile.waterTargetMl || 3500) / 1000}
            unit="L"
            icon={<Droplets className="w-4 h-4" />}
            color="cyan"
            decimals={1}
          />
          <MacroCard
            label="Steps"
            value={todayData.steps}
            target={profile.stepTarget || 10000}
            unit=""
            icon={<Footprints className="w-4 h-4" />}
            color="green"
            format={(v) => v.toLocaleString()}
          />
        </div>

        {/* Sleep + Gym row */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: 'rgba(79, 59, 180, 0.1)', border: '1px solid rgba(79, 59, 180, 0.2)' }}>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
              <Moon className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Sleep</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {todayData.sleepMin > 0 ? formatDuration(todayData.sleepMin) : '—'}
              </p>
            </div>
          </div>

          <div className={`rounded-xl p-3.5 flex items-center gap-3 ${
            todayData.gymCompleted
              ? 'bg-emerald-500/8 border border-emerald-500/20'
              : 'bg-[#111611]/60 border border-[#232b21]'
          }`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              todayData.gymCompleted ? 'bg-emerald-500/20' : 'bg-[#1b241b]'
            }`}>
              <Dumbbell className={`w-4 h-4 ${todayData.gymCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Gym</p>
              <p className={`text-sm font-bold mt-0.5 ${todayData.gymCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                {todayData.gymCompleted ? 'Done ✓' : 'Pending'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Water Quick Tracker ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <WaterTracker
          currentMl={todayData.waterMl}
          targetMl={profile.waterTargetMl || 3500}
          initialEntries={todayData.waterEntries}
          date={today.toISOString()}
        />
      </motion.div>

      {/* ── Daily Checklist ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DailyChecklist 
          date={today.toISOString()}
          initialItems={todayData.checklistItems}
        />
      </motion.div>
    </div>
  )
}

// ── MacroCard ─────────────────────────────────────────────────────────────────
function MacroCard({
  label, value, target, unit, icon, color, decimals = 0, format: fmt,
}: {
  label: string
  value: number
  target: number
  unit: string
  icon: React.ReactNode
  color: 'orange' | 'blue' | 'cyan' | 'green'
  decimals?: number
  format?: (v: number) => string
}) {
  const pct = Math.min(100, Math.round(target > 0 ? (value / target) * 100 : 0))
  const isComplete = pct >= 100

  const colorMap = {
    orange: { 
      bg: 'rgba(249, 115, 22, 0.1)', 
      border: 'rgba(249, 115, 22, 0.2)',
      iconBg: 'rgba(249, 115, 22, 0.15)', 
      text: '#fb923c', 
      bar: 'linear-gradient(90deg, #f97316, #fb923c)' 
    },
    blue: { 
      bg: 'rgba(116, 140, 112, 0.08)', 
      border: 'rgba(116, 140, 112, 0.18)',
      iconBg: 'rgba(116, 140, 112, 0.15)', 
      text: '#8CA488', 
      bar: 'linear-gradient(90deg, #748C70, #D1BD96)' 
    },
    cyan: { 
      bg: 'rgba(6, 182, 212, 0.08)', 
      border: 'rgba(6, 182, 212, 0.18)',
      iconBg: 'rgba(6, 182, 212, 0.15)', 
      text: '#22d3ee', 
      bar: 'linear-gradient(90deg, #06b6d4, #22d3ee)' 
    },
    green: { 
      bg: 'rgba(194, 168, 120, 0.08)', 
      border: 'rgba(194, 168, 120, 0.18)',
      iconBg: 'rgba(194, 168, 120, 0.15)', 
      text: '#34d399', 
      bar: 'linear-gradient(90deg, #00d4aa, #34d399)' 
    },
  }
  const c = colorMap[color]

  return (
    <div
      className="rounded-xl p-3.5 transition-all"
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: c.iconBg }}>
          <span style={{ color: c.text }}>{icon}</span>
        </div>
        <span 
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          style={{ color: c.text, background: c.iconBg }}
        >
          {pct}%
        </span>
      </div>
      <p className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-white mt-0.5 leading-tight">
        {fmt ? fmt(value) : value.toFixed(decimals)}
        <span className="text-[10px] text-slate-500 font-normal ml-1">
          / {fmt ? fmt(target) : target.toFixed(decimals)}{unit ? ` ${unit}` : ''}
        </span>
      </p>
      <div className="mt-2.5 h-1 bg-[#161c16] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: c.bar }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}
