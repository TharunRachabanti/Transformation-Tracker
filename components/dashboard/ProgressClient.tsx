'use client'

import { useState } from 'react'
import { format, subDays, parseISO } from 'date-fns'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts'
import { motion } from 'framer-motion'
import { TrendingDown, Target, Footprints } from 'lucide-react'
import { SCORE_WEIGHTS, WEIGHT_MILESTONES } from '@/data/plans'
import { cn } from '@/lib/utils'
import { TimeFilter } from '@/types'

const TIME_FILTERS: { label: string; value: TimeFilter; days: number }[] = [
  { label: '7D', value: '7D', days: 7 },
  { label: '30D', value: '30D', days: 30 },
  { label: '90D', value: '90D', days: 90 },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; color: string; name: string; value: number; unit?: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass text-xs rounded-xl px-3 py-2 border border-slate-700/60">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}{p.unit ?? ''}
        </p>
      ))}
    </div>
  )
}

export function ProgressClient({ 
  profile, 
  historyData 
}: { 
  profile: any
  historyData: { 
    date: string
    weight: number | null
    calories: number
    protein: number
    steps: number
    waterMl: number
    sleepMin: number
    gymCompleted: boolean
    checklistCompleted: number
    mealsCompleted: number
  }[] 
}) {
  const [filter, setFilter] = useState<TimeFilter>('30D')
  const days = TIME_FILTERS.find((f) => f.value === filter)?.days ?? 30

  // Filter history data back by selected days
  const startDate = subDays(new Date(), days)
  
  // Fill missing days with the last known weight so chart doesn't break
  let lastKnownWeight = profile.startingWeight || 80
  const chartData = historyData.map(d => {
    if (d.weight !== null) lastKnownWeight = d.weight
    return {
      dateObj: parseISO(d.date),
      date: format(parseISO(d.date), 'MMM d'),
      weight: lastKnownWeight,
      calories: d.calories,
      protein: d.protein,
      steps: d.steps,
      waterMl: d.waterMl,
      sleepMin: d.sleepMin,
      gymCompleted: d.gymCompleted,
      checklistCompleted: d.checklistCompleted,
      mealsCompleted: d.mealsCompleted
    }
  }).filter(d => d.dateObj >= startDate)

  // Calculate 7-day rolling average for weight
  const dataWithAvg = chartData.map((d, i) => {
    const slice = chartData.slice(Math.max(0, i - 6), i + 1)
    const avg = slice.reduce((s, x) => s + x.weight, 0) / slice.length
    return { ...d, avg7: parseFloat(avg.toFixed(1)) }
  })

  const currentWeight = dataWithAvg.length > 0 ? dataWithAvg[dataWithAvg.length - 1].weight : profile.startingWeight
  const startWeight = profile.startingWeight || 80
  const goalWeight = profile.targetWeight || 75
  const lostWeight = Math.max(0, startWeight - currentWeight)
  const toGoWeight = Math.max(0, currentWeight - goalWeight)

  // Dynamically compute the Transformation Score over the filtered period
  let sDiet = 0, sProtein = 0, sWorkout = 0, sSteps = 0, sWater = 0, sSleep = 0, sHabits = 0
  const len = Math.max(1, dataWithAvg.length)

  dataWithAvg.forEach(d => {
    // Diet (Meals completed): max 6 meals a day
    sDiet += Math.min(1, d.mealsCompleted / 6)
    // Protein: 
    sProtein += Math.min(1, d.protein / (profile.proteinTargetG ?? 160))
    // Workout
    if (d.gymCompleted) sWorkout += 1
    // Steps
    sSteps += Math.min(1, d.steps / (profile.stepTarget ?? 10000))
    // Water
    sWater += Math.min(1, d.waterMl / (profile.waterTargetMl ?? 3500))
    // Sleep
    sSleep += Math.min(1, d.sleepMin / ((profile.sleepTargetH ?? 8) * 60))
    // Habits (Checklist completed relative to total 15 items)
    sHabits += Math.min(1, d.checklistCompleted / 15)
  })

  const score = {
    total: Math.round(
      (sDiet / len) * SCORE_WEIGHTS.diet + 
      (sProtein / len) * SCORE_WEIGHTS.protein + 
      (sWorkout / len) * SCORE_WEIGHTS.workout + 
      (sSteps / len) * SCORE_WEIGHTS.steps + 
      (sWater / len) * SCORE_WEIGHTS.water + 
      (sSleep / len) * SCORE_WEIGHTS.sleep + 
      (sHabits / len) * SCORE_WEIGHTS.habits
    ),
    diet: Math.round((sDiet / len) * SCORE_WEIGHTS.diet),
    protein: Math.round((sProtein / len) * SCORE_WEIGHTS.protein),
    workout: Math.round((sWorkout / len) * SCORE_WEIGHTS.workout),
    steps: Math.round((sSteps / len) * SCORE_WEIGHTS.steps),
    water: Math.round((sWater / len) * SCORE_WEIGHTS.water),
    sleep: Math.round((sSleep / len) * SCORE_WEIGHTS.sleep),
    habits: Math.round((sHabits / len) * SCORE_WEIGHTS.habits),
  }
  const scoreColor = score.total >= 80 ? 'text-green-400' : score.total >= 60 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="space-y-5 pb-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-sm text-slate-400 mt-0.5">Analytics & transformation tracking</p>
      </div>

      {/* Time Filters */}
      <div className="flex gap-2">
        {TIME_FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={cn(
              'flex-1 py-3 text-xs font-semibold rounded-xl transition-all',
              filter === value
                ? 'bg-[#4f7cff] text-white shadow-lg shadow-[#4f7cff]/20'
                : 'bg-[#0e1630] border border-[#1a2550] text-slate-400 hover:text-slate-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Weight Summary */}
      <div className="glass rounded-2xl p-4 space-y-4 border border-[#1a2550]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="text-sm font-semibold text-white">Weight Journey</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Lost" value={`${lostWeight.toFixed(1)} kg`} color="text-emerald-400" />
          <Stat label="Current" value={`${currentWeight.toFixed(1)} kg`} color="text-white" large />
          <Stat label="To Goal" value={`${toGoWeight.toFixed(1)} kg`} color="text-[#4f7cff]" />
        </div>

        {/* Weight Chart */}
        <div className="h-48 mt-4 pt-2">
          {dataWithAvg.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataWithAvg} margin={{ left: -25, right: 5, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f7cff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f7cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} interval="preserveStartEnd" minTickGap={20} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="weight" name="Weight" stroke="#4f7cff" fill="url(#weightGrad)" strokeWidth={3} dot={false} unit=" kg" />
                <Line type="monotone" dataKey="avg7" name="7d Avg" stroke="#9b6dff" strokeWidth={2} dot={false} unit=" kg" strokeDasharray="4 2" />
                <ReferenceLine y={goalWeight} stroke="#22c55e" strokeDasharray="4 2" opacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <p className="text-sm">Not enough data to graph yet</p>
              <p className="text-xs mt-1">Log your weight today!</p>
            </div>
          )}
        </div>
        <div className="flex gap-4 text-[10px] justify-center mt-2 font-medium">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#4f7cff] inline-block rounded" />Daily</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#9b6dff] inline-block rounded" />7d Avg</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" />Goal</span>
        </div>
      </div>

      {/* Goal Milestones */}
      <div className="glass rounded-2xl p-4 space-y-4 border border-[#1a2550]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#4f7cff]/15 flex items-center justify-center">
            <Target className="w-4 h-4 text-[#4f7cff]" />
          </div>
          <h2 className="text-sm font-semibold text-white">Goal Milestones</h2>
        </div>
        <div className="space-y-4">
          {WEIGHT_MILESTONES.map((m, i) => {
            const reached = currentWeight <= m.weightKg
            const isGoal = i === WEIGHT_MILESTONES.length - 1
            return (
              <div key={m.weightKg} className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2',
                  reached
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : isGoal
                      ? 'bg-[#4f7cff]/15 border-[#4f7cff]/40 text-[#4f7cff]'
                      : 'bg-[#0e1630] border-[#1a2550] text-slate-500'
                )}>
                  {reached ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className={cn('text-sm font-semibold', reached ? 'text-white' : 'text-slate-300')}>{m.weightKg} kg</span>
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{m.label}</span>
                  </div>
                  {i === 0 && <div className="h-1 bg-[#1a2550] rounded-full" />}
                  {i > 0 && (
                    <div className="h-1.5 bg-[#1a2550] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{
                          width: reached ? '100%' :
                            `${Math.min(100, Math.max(0, (WEIGHT_MILESTONES[i-1].weightKg - currentWeight) /
                              (WEIGHT_MILESTONES[i-1].weightKg - m.weightKg) * 100))}%`
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transformation Score Placeholder */}
      <div className="glass rounded-2xl p-4 space-y-4 border border-[#1a2550]">
        <div>
          <h2 className="text-sm font-semibold text-white">Transformation Score</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Based on consistency over the past {days} days</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#1a2550" strokeWidth="8" />
              <motion.circle
                cx="40" cy="40" r="32" fill="none"
                stroke={score.total >= 80 ? '#34d399' : score.total >= 60 ? '#fbbf24' : '#f87171'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - score.total / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-xl font-bold', scoreColor)}>{score.total}</span>
              <span className="text-[9px] text-slate-500 font-medium">/100</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {[
              { key: 'diet', label: 'Diet', max: SCORE_WEIGHTS.diet, value: score.diet, tColor: 'text-orange-400', bColor: 'bg-orange-500' },
              { key: 'workout', label: 'Workout', max: SCORE_WEIGHTS.workout, value: score.workout, tColor: 'text-blue-400', bColor: 'bg-[#4f7cff]' },
              { key: 'steps', label: 'Steps', max: SCORE_WEIGHTS.steps, value: score.steps, tColor: 'text-emerald-400', bColor: 'bg-emerald-500' },
            ].map((s) => (
              <div key={s.key} className="flex items-center gap-3 text-xs w-full">
                <span className="text-slate-500 uppercase tracking-wider text-[9px] font-semibold w-12 shrink-0">{s.label}</span>
                <div className="flex-1 h-1.5 bg-[#1a2550] rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full", s.bColor)}
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.value / s.max) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className={cn("w-6 text-right font-bold text-[10px]", s.tColor)}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calories Chart */}
      <div className="glass rounded-2xl p-4 space-y-4 border border-[#1a2550]">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center">
            <span className="text-xs">🔥</span>
          </div>
          Calories Burned vs Consumed
        </h2>
        <div className="h-40 pt-2">
          {dataWithAvg.filter(d => d.calories > 0).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataWithAvg.slice(-14)} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickLine={false} interval="preserveStartEnd" minTickGap={20} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="calories" name="Calories" fill="#f97316" radius={[4, 4, 0, 0]} opacity={0.9} />
                <ReferenceLine y={profile.calorieTartet || 2200} stroke="#f97316" strokeDasharray="4 2" opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">No food logged recently</div>
          )}
        </div>
      </div>

      {/* Steps Chart */}
      <div className="glass rounded-2xl p-4 space-y-4 border border-[#1a2550]">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <Footprints className="w-4 h-4 text-emerald-400" />
          </div>
          Daily Steps
        </h2>
        <div className="h-40 pt-2">
          {dataWithAvg.filter(d => d.steps > 0).length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataWithAvg.slice(-14)} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickLine={false} interval="preserveStartEnd" minTickGap={20} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="steps" name="Steps" fill="#10b981" radius={[4, 4, 0, 0]} opacity={0.9} />
                <ReferenceLine y={profile.stepTarget || 10000} stroke="#10b981" strokeDasharray="4 2" opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">No steps tracked recently</div>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color, large }: { label: string; value: string; color: string; large?: boolean }) {
  return (
    <div className="bg-[#0c1528] rounded-xl p-3 border border-[#1a2550]">
      <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-1">{label}</p>
      <p className={cn('font-bold', color, large ? 'text-2xl' : 'text-lg')}>{value}</p>
    </div>
  )
}
