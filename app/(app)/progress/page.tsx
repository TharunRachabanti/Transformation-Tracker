'use client'

import { useState } from 'react'
import { format, subDays } from 'date-fns'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts'
import { motion } from 'framer-motion'
import { TrendingDown, Target, Dumbbell, Droplets, Moon, Footprints } from 'lucide-react'
import { SCORE_WEIGHTS, WEIGHT_MILESTONES } from '@/data/plans'
import { cn } from '@/lib/utils'
import { TimeFilter } from '@/types'

// Generate mock data for demonstration
function generateWeightData(days: number) {
  const data: Array<{ date: string; weight: number; avg7: number }> = []
  let weight = 96
  let avg7 = 96
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i)
    weight = Math.max(88, weight - (Math.random() * 0.12 - 0.04))
    const dayData = {
      date: format(date, 'MMM d'),
      weight: parseFloat(weight.toFixed(1)),
      avg7: parseFloat(weight.toFixed(1)),
    }
    data.push(dayData)
  }
  // Calculate 7-day rolling average
  return data.map((d, i) => ({
    ...d,
    avg7: parseFloat(
      (data.slice(Math.max(0, i - 6), i + 1).reduce((s, x) => s + x.weight, 0) /
        Math.min(7, i + 1)).toFixed(1)
    ),
  }))
}

function generateCaloriesData(days: number) {
  return Array.from({ length: days }, (_, i) => ({
    date: format(subDays(new Date(), days - i - 1), 'MMM d'),
    calories: Math.floor(1800 + Math.random() * 600),
    protein: Math.floor(110 + Math.random() * 60),
  }))
}

function generateStepsData(days: number) {
  return Array.from({ length: days }, (_, i) => ({
    date: format(subDays(new Date(), days - i - 1), 'MMM d'),
    steps: Math.floor(6000 + Math.random() * 5000),
  }))
}

const TIME_FILTERS: { label: string; value: TimeFilter; days: number }[] = [
  { label: '7D', value: '7D', days: 7 },
  { label: '30D', value: '30D', days: 30 },
  { label: '90D', value: '90D', days: 90 },
  { label: '6M', value: '6M', days: 180 },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; color: string; name: string; value: number; unit?: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass text-xs rounded-xl px-3 py-2 border border-slate-700/60">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}{p.unit ?? ''}
        </p>
      ))}
    </div>
  )
}

export default function ProgressPage() {
  const [filter, setFilter] = useState<TimeFilter>('30D')
  const days = TIME_FILTERS.find((f) => f.value === filter)?.days ?? 30

  const weightData = generateWeightData(days)
  const calData = generateCaloriesData(days)
  const stepsData = generateStepsData(days)

  const currentWeight = weightData[weightData.length - 1]?.weight ?? 94.5
  const startWeight = 96
  const goalWeight = 81
  const lostWeight = startWeight - currentWeight
  const toGoWeight = currentWeight - goalWeight

  // Transformation Score
  const score = {
    diet: 16,
    protein: 15,
    workout: 18,
    steps: 11,
    water: 8,
    sleep: 8,
    habits: 4,
    total: 0,
  }
  score.total = score.diet + score.protein + score.workout + score.steps + score.water + score.sleep + score.habits

  const scoreColor = score.total >= 80 ? 'text-green-400' : score.total >= 60 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="space-y-5">
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
              'flex-1 py-2 text-xs font-semibold rounded-xl transition-all',
              filter === value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Weight Summary */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown className="w-4 h-4 text-green-400" />
          <h2 className="text-sm font-semibold text-white">Weight Journey</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Lost" value={`${lostWeight.toFixed(1)} kg`} color="text-green-400" />
          <Stat label="Current" value={`${currentWeight.toFixed(1)} kg`} color="text-white" large />
          <Stat label="To Goal" value={`${toGoWeight.toFixed(1)} kg`} color="text-blue-400" />
        </div>

        {/* Weight Chart */}
        <div className="h-48 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} interval={Math.floor(days / 6)} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="weight" name="Weight" stroke="#3b82f6" fill="url(#weightGrad)" strokeWidth={2} dot={false} unit=" kg" />
              <Line type="monotone" dataKey="avg7" name="7d Avg" stroke="#8b5cf6" strokeWidth={2} dot={false} unit=" kg" strokeDasharray="4 2" />
              <ReferenceLine y={goalWeight} stroke="#22c55e" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 text-xs justify-center">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />Daily</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-500 inline-block rounded" />7d Avg</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-500 inline-block rounded" />Goal</span>
        </div>
      </div>

      {/* Goal Milestones */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-white">Goal Milestones</h2>
        </div>
        <div className="space-y-3">
          {WEIGHT_MILESTONES.map((m, i) => {
            const reached = currentWeight <= m.weightKg
            const isGoal = i === WEIGHT_MILESTONES.length - 1
            return (
              <div key={m.weightKg} className="flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2',
                  reached
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : isGoal
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                )}>
                  {reached ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-200">{m.weightKg} kg</span>
                    <span className="text-xs text-slate-500">{m.label}</span>
                  </div>
                  {i === 0 && <div className="h-1 mt-1 bg-slate-800 rounded-full" />}
                  {i > 0 && (
                    <div className="h-1 mt-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
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

      {/* Transformation Score */}
      <div className="glass rounded-2xl p-4 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Transformation Score</h2>
          <p className="text-[10px] text-slate-500 mt-0.5">Personal consistency score · Not a medical metric</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#1e293b" strokeWidth="8" />
              <motion.circle
                cx="40" cy="40" r="32" fill="none"
                stroke={score.total >= 80 ? '#22c55e' : score.total >= 60 ? '#eab308' : '#ef4444'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 32}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - score.total / 100) }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-xl font-bold', scoreColor)}>{score.total}</span>
              <span className="text-[9px] text-slate-500">/100</span>
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {[
              { key: 'diet', label: 'Diet', max: SCORE_WEIGHTS.diet, value: score.diet },
              { key: 'protein', label: 'Protein', max: SCORE_WEIGHTS.protein, value: score.protein },
              { key: 'workout', label: 'Workout', max: SCORE_WEIGHTS.workout, value: score.workout },
              { key: 'steps', label: 'Steps', max: SCORE_WEIGHTS.steps, value: score.steps },
              { key: 'water', label: 'Water', max: SCORE_WEIGHTS.water, value: score.water },
              { key: 'sleep', label: 'Sleep', max: SCORE_WEIGHTS.sleep, value: score.sleep },
              { key: 'habits', label: 'Habits', max: SCORE_WEIGHTS.habits, value: score.habits },
            ].map((s) => (
              <div key={s.key} className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 w-14 shrink-0">{s.label}</span>
                <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(s.value / s.max) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-slate-400 w-10 text-right">{s.value}/{s.max}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calories Chart */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          🔥 Calories & Protein
        </h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calData.slice(-14)} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickLine={false} interval={2} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calories" name="Calories" fill="#f97316" radius={[3, 3, 0, 0]} opacity={0.8} />
              <ReferenceLine y={2300} stroke="#f97316" strokeDasharray="4 2" opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Steps Chart */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Footprints className="w-4 h-4 text-green-400" /> Daily Steps
        </h2>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stepsData.slice(-14)} margin={{ left: -20, right: 5, top: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickLine={false} interval={2} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="steps" name="Steps" fill="#22c55e" radius={[3, 3, 0, 0]} opacity={0.8} />
              <ReferenceLine y={10000} stroke="#22c55e" strokeDasharray="4 2" opacity={0.5} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color, large }: { label: string; value: string; color: string; large?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={cn('font-bold', color, large ? 'text-2xl' : 'text-lg')}>{value}</p>
    </div>
  )
}
