'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Plus, Minus, Dumbbell, Trophy, ChevronDown, ChevronUp, Timer, Zap, Weight } from 'lucide-react'
import { getWorkoutForDay } from '@/data/plans'
import { cn } from '@/lib/utils'

interface SetLog {
  setNumber: number
  reps: number
  weightKg: number
}

interface ExerciseLogState {
  name: string
  sets: SetLog[]
  expanded: boolean
  category?: string
}

// Placeholder previous session data (will be replaced with live DB fetch later)
const PREV_SESSION: Record<string, SetLog[]> = {
  'Bench Press': [
    { setNumber: 1, reps: 10, weightKg: 40 },
    { setNumber: 2, reps: 9, weightKg: 40 },
    { setNumber: 3, reps: 8, weightKg: 40 },
  ],
  'Lat Pulldown': [
    { setNumber: 1, reps: 12, weightKg: 50 },
    { setNumber: 2, reps: 10, weightKg: 50 },
    { setNumber: 3, reps: 10, weightKg: 50 },
  ],
}

export default function WorkoutPage() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const workout = getWorkoutForDay(dayOfWeek)
  const isRestDay = workout.dayType === 'REST'

  const [logs, setLogs] = useState<ExerciseLogState[]>(
    workout.exercises.map((ex) => ({
      name: ex.name,
      expanded: false,
      sets: Array.from({ length: ex.defaultSets }, (_, i) => ({
        setNumber: i + 1,
        reps: ex.defaultReps,
        weightKg: PREV_SESSION[ex.name]?.[i]?.weightKg ?? 0,
      })),
    }))
  )
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [workoutDone, setWorkoutDone] = useState(false)

  const dayLabel = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
  const totalVolume = logs.reduce((acc, ex) => acc + ex.sets.reduce((s, set) => s + set.weightKg * set.reps, 0), 0)
  const totalSets = logs.reduce((acc, ex) => acc + ex.sets.length, 0)
  const totalReps = logs.reduce((acc, ex) => acc + ex.sets.reduce((s, set) => s + set.reps, 0), 0)

  function updateSet(exName: string, setIdx: number, field: 'reps' | 'weightKg', value: number) {
    setLogs((prev) =>
      prev.map((ex) =>
        ex.name !== exName ? ex : {
          ...ex,
          sets: ex.sets.map((s, i) => i !== setIdx ? s : { ...s, [field]: value }),
        }
      )
    )
  }

  function addSet(exName: string) {
    setLogs((prev) =>
      prev.map((ex) => {
        if (ex.name !== exName) return ex
        const last = ex.sets[ex.sets.length - 1]
        return {
          ...ex,
          sets: [...ex.sets, {
            setNumber: ex.sets.length + 1,
            reps: last?.reps ?? 10,
            weightKg: last?.weightKg ?? 0,
          }],
        }
      })
    )
  }

  function removeSet(exName: string) {
    setLogs((prev) =>
      prev.map((ex) => {
        if (ex.name !== exName || ex.sets.length <= 1) return ex
        return { ...ex, sets: ex.sets.slice(0, -1) }
      })
    )
  }

  function toggleExpand(name: string) {
    setLogs((prev) => prev.map((ex) => ex.name === name ? { ...ex, expanded: !ex.expanded } : ex))
  }

  if (isRestDay) {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-[11px] text-slate-500 uppercase tracking-[0.18em] font-semibold">{format(today, 'MMMM d')}</p>
          <h1 className="text-[26px] font-bold text-white mt-1">Workout</h1>
        </div>
        <div className="rounded-2xl p-8 text-center space-y-5" style={{ background: 'linear-gradient(135deg, rgba(17,28,65,0.9) 0%, rgba(10,16,38,0.95) 100%)', border: '1px solid rgba(79,124,255,0.12)' }}>
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-4xl">😴</div>
          <div>
            <h2 className="text-xl font-bold text-white">Rest Day</h2>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">Sunday is your recovery day. Aim for 7k–10k steps and follow your regular diet plan.</p>
          </div>
          <div className="bg-[#4f7cff]/8 border border-[#4f7cff]/20 rounded-xl p-4 text-left">
            <p className="text-[#60a5fa] text-xs font-semibold uppercase tracking-wide mb-2">Recovery Tips</p>
            <ul className="text-slate-400 text-sm space-y-1.5">
              {['Light walking or stretching', 'Stay hydrated (3.5L target)', 'Get 7–9 hours of sleep', 'Follow your regular meal plan'].map((tip) => (
                <li key={tip} className="flex items-center gap-2">
                  <span className="text-[#4f7cff] shrink-0">·</span>{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-slate-500 uppercase tracking-[0.18em] font-semibold">{format(today, 'MMMM d')}</p>
          <h1 className="text-[26px] font-bold text-white mt-1">Workout</h1>
          <p className="text-sm text-slate-500 mt-0.5">{dayLabel} · {workout.label}</p>
        </div>
        {workoutDone && (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3 py-2">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-semibold">Session Complete!</span>
          </div>
        )}
      </div>

      {/* Live Stats Bar */}
      {workoutStarted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 grid grid-cols-3 gap-3 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(79,124,255,0.12) 0%, rgba(155,109,255,0.08) 100%)', border: '1px solid rgba(79,124,255,0.2)' }}
        >
          <div>
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 mb-1">
              <Weight className="w-3 h-3" /> Volume
            </div>
            <p className="text-lg font-bold text-white">{totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}k` : '—'}</p>
            <p className="text-[10px] text-slate-600">kg lifted</p>
          </div>
          <div className="border-x border-[#1a2550]">
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 mb-1">
              <Zap className="w-3 h-3" /> Sets
            </div>
            <p className="text-lg font-bold text-white">{totalSets}</p>
            <p className="text-[10px] text-slate-600">completed</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 mb-1">
              <Timer className="w-3 h-3" /> Reps
            </div>
            <p className="text-lg font-bold text-white">{totalReps}</p>
            <p className="text-[10px] text-slate-600">total</p>
          </div>
        </motion.div>
      )}

      {/* Start Button */}
      {!workoutStarted && !workoutDone && (
        <button
          onClick={() => setWorkoutStarted(true)}
          className="w-full font-semibold py-4 rounded-2xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #4f7cff, #9b6dff)', boxShadow: '0 8px 30px rgba(79,124,255,0.25)' }}
        >
          <Dumbbell className="w-5 h-5" />
          Begin Workout Session
        </button>
      )}

      {/* Exercise Cards */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">Exercises</h2>
        {logs.map((ex, exIdx) => {
          const prevSets = PREV_SESSION[ex.name]
          const exVolume = ex.sets.reduce((s, set) => s + set.weightKg * set.reps, 0)

          return (
            <motion.div
              key={ex.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: exIdx * 0.04 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(12, 20, 48, 0.85)', border: '1px solid rgba(26, 37, 80, 0.8)' }}
            >
              <button
                onClick={() => toggleExpand(ex.name)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4f7cff]/10 border border-[#4f7cff]/20 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-4 h-4 text-[#4f7cff]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{ex.name}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {ex.sets.length} sets{exVolume > 0 ? ` · ${exVolume.toLocaleString()} kg vol` : ' · tap to log'}
                    </p>
                  </div>
                </div>
                {ex.expanded ? <ChevronUp className="w-4 h-4 text-slate-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-600 shrink-0" />}
              </button>

              <AnimatePresence>
                {ex.expanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                    transition={{ duration: 0.22 }}
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-[#1a2550]">
                      {/* Previous session */}
                      {prevSets && (
                        <div className="mt-3 bg-[#0c1528]/60 rounded-xl p-3">
                          <p className="text-[9px] text-slate-600 uppercase tracking-wider font-semibold mb-2">Last Session</p>
                          <div className="grid grid-cols-3 gap-2">
                            {prevSets.map((s) => (
                              <div key={s.setNumber} className="text-center bg-[#0e1630] rounded-lg py-2 px-1">
                                <p className="text-[9px] text-slate-600">Set {s.setNumber}</p>
                                <p className="text-xs font-bold text-slate-300">{s.weightKg}kg</p>
                                <p className="text-[9px] text-slate-500">× {s.reps}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Set Headers */}
                      <div className="grid grid-cols-[44px_1fr_1fr_32px] gap-2 text-[9px] text-slate-600 uppercase tracking-wider px-1 mt-2">
                        <span>Set</span>
                        <span>Weight (kg)</span>
                        <span>Reps</span>
                        <span />
                      </div>

                      {/* Sets */}
                      {ex.sets.map((set, setIdx) => (
                        <div key={setIdx} className="grid grid-cols-[44px_1fr_1fr_32px] gap-2 items-center">
                          <div className="flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-500 w-6 h-6 rounded-lg bg-[#0c1528] flex items-center justify-center">{set.setNumber}</span>
                          </div>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={set.weightKg || ''}
                            onChange={(e) => updateSet(ex.name, setIdx, 'weightKg', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            min={0}
                            className="bg-[#0c1528] border border-[#1a2550] hover:border-[#2a3a72] focus:border-[#4f7cff]/60 focus:ring-1 focus:ring-[#4f7cff]/20 rounded-xl px-3 py-2.5 text-sm text-white text-center transition-all"
                          />
                          <input
                            type="number"
                            inputMode="numeric"
                            value={set.reps || ''}
                            onChange={(e) => updateSet(ex.name, setIdx, 'reps', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            min={0}
                            className="bg-[#0c1528] border border-[#1a2550] hover:border-[#2a3a72] focus:border-[#4f7cff]/60 focus:ring-1 focus:ring-[#4f7cff]/20 rounded-xl px-3 py-2.5 text-sm text-white text-center transition-all"
                          />
                          <div className="flex items-center justify-center">
                            {setIdx === ex.sets.length - 1 && ex.sets.length > 1 && (
                              <button onClick={() => removeSet(ex.name)} className="text-slate-700 hover:text-red-400 transition-colors">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add Set */}
                      <button
                        onClick={() => addSet(ex.name)}
                        className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-[#4f7cff] py-3 border border-dashed border-[#1a2550] hover:border-[#4f7cff]/30 rounded-xl transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Set
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Finish Button */}
      {workoutStarted && !workoutDone && (
        <button
          onClick={() => setWorkoutDone(true)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 rounded-2xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20"
        >
          <CheckCircle2 className="w-5 h-5" />
          Finish Workout
        </button>
      )}

      {/* Completion Card */}
      {workoutDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-8 text-center space-y-3"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(0,180,140,0.05) 100%)', border: '1px solid rgba(0,212,170,0.2)' }}
        >
          <div className="text-5xl mb-2">🏆</div>
          <h3 className="text-xl font-bold text-white">Session Complete!</h3>
          <p className="text-slate-400 text-sm">
            {totalSets} sets · {totalReps} reps · {totalVolume.toLocaleString()} kg volume
          </p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Volume', value: `${(totalVolume / 1000).toFixed(1)}k kg` },
              { label: 'Sets', value: totalSets },
              { label: 'Reps', value: totalReps },
            ].map(({ label, value }) => (
              <div key={label} className="bg-emerald-500/8 rounded-xl p-3">
                <p className="text-emerald-300 text-base font-bold">{value}</p>
                <p className="text-emerald-600 text-[10px] uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
