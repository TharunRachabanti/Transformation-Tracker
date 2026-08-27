'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Flame, Droplets, Footprints, Moon, Dumbbell, TrendingDown } from 'lucide-react'
import { getDaysSinceStart, formatWeight, calcProgress, formatWater, formatDuration } from '@/lib/utils'
import { CHECKLIST_TEMPLATE, DEFAULT_USER_PROFILE } from '@/data/plans'
import { WaterTracker } from '@/components/dashboard/WaterTracker'
import { DailyChecklist } from '@/components/dashboard/DailyChecklist'
import { MacroRing } from '@/components/shared/MacroRing'
import { ProgressBar } from '@/components/shared/ProgressBar'

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

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">
            {format(today, 'EEEE, MMMM d')}
          </p>
          <h1 className="text-2xl font-bold text-white mt-0.5">
            Transformation Day{' '}
            <span className="gradient-text">#{dayCount}</span>
          </h1>
        </div>
        {/* Score Badge */}
        <div className="flex flex-col items-center">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" className="stroke-slate-800" strokeWidth="4" />
              <circle
                cx="28" cy="28" r="24" fill="none"
                className="stroke-blue-500"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - completionPct / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{completionPct}%</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 mt-0.5">Today</span>
        </div>
      </motion.div>

      {/* Weight Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-slate-300">Weight Journey</span>
          </div>
          <span className="text-xs text-green-400 font-medium">
            -{formatWeight(profile.startingWeight - todayData.currentWeight)} lost
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">Start</p>
            <p className="text-lg font-bold text-slate-300">{profile.startingWeight}</p>
            <p className="text-[10px] text-slate-600">kg</p>
          </div>
          <div className="border-x border-slate-800/60">
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">Current</p>
            <p className="text-2xl font-bold text-white">{todayData.currentWeight}</p>
            <p className="text-[10px] text-slate-600">kg</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">Goal</p>
            <p className="text-lg font-bold text-slate-300">{profile.targetWeight}</p>
            <p className="text-[10px] text-slate-600">kg</p>
          </div>
        </div>
        {/* Progress to goal */}
        <div className="mt-3">
          <ProgressBar
            value={profile.startingWeight - todayData.currentWeight}
            max={profile.startingWeight - profile.targetWeight}
            color="green"
            showLabel={false}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-600">
              {formatWeight(profile.startingWeight - todayData.currentWeight)} lost
            </span>
            <span className="text-[10px] text-slate-600">
              {formatWeight(todayData.currentWeight - profile.targetWeight)} to go
            </span>
          </div>
        </div>
      </motion.div>

      {/* Macro Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
          Today&apos;s Progress
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Calories */}
          <MacroCard
            label="Calories"
            value={todayData.calories}
            target={profile.calorieTartet}
            unit="kcal"
            icon={<Flame className="w-4 h-4" />}
            color="orange"
          />
          {/* Protein */}
          <MacroCard
            label="Protein"
            value={todayData.protein}
            target={profile.proteinTargetG}
            unit="g"
            icon={<span className="text-sm">🍗</span>}
            color="blue"
          />
          {/* Water */}
          <MacroCard
            label="Water"
            value={Math.round(todayData.waterMl / 100) / 10}
            target={profile.waterTargetMl / 1000}
            unit="L"
            icon={<Droplets className="w-4 h-4" />}
            color="cyan"
            decimals={1}
          />
          {/* Steps */}
          <MacroCard
            label="Steps"
            value={todayData.steps}
            target={profile.stepTarget}
            unit=""
            icon={<Footprints className="w-4 h-4" />}
            color="green"
            format={(v) => v.toLocaleString()}
          />
        </div>

        {/* Sleep + Gym row */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="glass rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
              <Moon className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500">Sleep</p>
              <p className="text-sm font-semibold text-white">
                {formatDuration(todayData.sleepMin)}
              </p>
            </div>
          </div>
          <div className="glass rounded-xl p-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              todayData.gymCompleted ? 'bg-green-500/15' : 'bg-slate-800/50'
            }`}>
              <Dumbbell className={`w-4 h-4 ${todayData.gymCompleted ? 'text-green-400' : 'text-slate-500'}`} />
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Gym</p>
              <p className={`text-sm font-semibold ${todayData.gymCompleted ? 'text-green-400' : 'text-slate-400'}`}>
                {todayData.gymCompleted ? 'Completed ✓' : 'Pending'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Water Quick Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <WaterTracker
          currentMl={todayData.waterMl}
          targetMl={profile.waterTargetMl}
        />
      </motion.div>

      {/* Daily Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DailyChecklist />
      </motion.div>
    </div>
  )
}

// ─── MacroCard Component ────────────────────────────────────────────────────
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
  const pct = calcProgress(value, target)
  const colorMap = {
    orange: { bg: 'bg-orange-500/15', text: 'text-orange-400', stroke: '#f97316' },
    blue: { bg: 'bg-blue-500/15', text: 'text-blue-400', stroke: '#3b82f6' },
    cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', stroke: '#06b6d4' },
    green: { bg: 'bg-green-500/15', text: 'text-green-400', stroke: '#22c55e' },
  }
  const c = colorMap[color]

  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
          <span className={c.text}>{icon}</span>
        </div>
        <span className="text-xs font-medium text-slate-500">{pct}%</span>
      </div>
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-base font-bold text-white leading-tight">
        {fmt ? fmt(value) : value.toFixed(decimals)}
        <span className="text-xs text-slate-500 font-normal ml-1">
          / {fmt ? fmt(target) : target.toFixed(decimals)} {unit}
        </span>
      </p>
      <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: c.stroke }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
