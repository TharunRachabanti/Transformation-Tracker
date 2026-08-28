'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Plus, Minus, Dumbbell, Trophy, ChevronDown, ChevronUp, Timer, Zap, Weight } from 'lucide-react'
import { finishWorkout } from './actions'

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

export function WorkoutClient({ 
  todayObj,
  dayOfWeek,
  workout,
  isRestDay,
  prevSession,
  initialData,
}: {
  todayObj: string
  dayOfWeek: number
  workout: any
  isRestDay: boolean
  prevSession: Record<string, SetLog[]>
  initialData?: {
    totalVolume: number
    exercises: ExerciseLogState[]
  }
}) {
  const today = new Date(todayObj)
  const dayLabel = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]

  const [logs, setLogs] = useState<ExerciseLogState[]>(
    initialData ? initialData.exercises :
    workout.exercises.map((ex: any) => ({
      name: ex.name,
      expanded: false,
      sets: Array.from({ length: ex.defaultSets }, (_, i) => ({
        setNumber: i + 1,
        reps: ex.defaultReps,
        weightKg: prevSession[ex.name]?.[i]?.weightKg ?? 0,
      })),
    }))
  )
  const [workoutStarted, setWorkoutStarted] = useState(!!initialData)
  const [workoutDone, setWorkoutDone] = useState(!!initialData)
  const [saving, setSaving] = useState(false)

  const totalVolume = logs.reduce((acc, ex) => acc + ex.sets.reduce((s, set) => s + set.weightKg * set.reps, 0), 0)
  const totalSets = logs.reduce((acc, ex) => acc + ex.sets.length, 0)
  const totalReps = logs.reduce((acc, ex) => acc + ex.sets.reduce((s, set) => s + set.reps, 0), 0)

  function updateSet(exName: string, setIdx: number, field: 'reps' | 'weightKg', value: number) {
    if (workoutDone) return
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
    if (workoutDone) return
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
    if (workoutDone) return
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

  async function handleFinish() {
    setSaving(true)
    try {
      await finishWorkout(today, workout.dayType, logs)
      setWorkoutDone(true)
    } finally {
      setSaving(false)
    }
  }

  if (isRestDay) {
    return (
      <div className="space-y-5 pb-8">
        <div>
          <p className="text-[10px] text-[#4f7cff] uppercase tracking-[0.2em] font-bold">{format(today, 'MMMM d')}</p>
          <h1 className="text-[26px] font-bold text-white mt-1">Workout</h1>
        </div>
        <div className="glass rounded-2xl p-8 text-center space-y-5 border border-[#1a2550] shadow-xl shadow-[#4f7cff]/5">
          <div className="w-20 h-20 rounded-[24px] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-4xl shadow-lg shadow-indigo-500/10">😴</div>
          <div>
            <h2 className="text-xl font-bold text-white">Rest Day</h2>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed font-medium">Sunday is your recovery day. Aim for 7k–10k steps and follow your regular diet plan.</p>
          </div>
          <div className="bg-[#0c1528] border border-[#1a2550] rounded-2xl p-5 text-left">
            <p className="text-[#60a5fa] text-[10px] font-bold uppercase tracking-widest mb-3">Recovery Tips</p>
            <ul className="text-slate-400 text-xs font-semibold space-y-2.5">
              {['Light walking or stretching', 'Stay hydrated (3.5L target)', 'Get 7–9 hours of sleep', 'Follow your regular meal plan'].map((tip) => (
                <li key={tip} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4f7cff] shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] text-[#4f7cff] font-bold uppercase tracking-[0.2em]">{format(today, 'MMMM d, yyyy')}</p>
          <h1 className="text-[26px] font-bold text-white mt-1">Workout</h1>
          <p className="text-sm text-slate-400 mt-0.5 font-medium">{dayLabel} · {workout.dayType.replace('_', ' ')}</p>
        </div>
        {workoutDone && (
          <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-3 py-2 shadow-lg shadow-emerald-500/5">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wide">Complete</span>
          </div>
        )}
      </div>

      {/* Live Stats Bar */}
      {workoutStarted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4 grid grid-cols-3 gap-3 text-center border border-[#1a2550] shadow-lg shadow-[#4f7cff]/5"
        >
          <div>
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#60a5fa] mb-1.5">
              <Weight className="w-3.5 h-3.5" /> Volume
            </div>
            <p className="text-xl font-bold text-white">{totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}k` : '—'}</p>
            <p className="text-[10px] text-slate-500 font-medium">kg lifted</p>
          </div>
          <div className="border-x border-[#1a2550]">
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-[#a87bff] mb-1.5">
              <Zap className="w-3.5 h-3.5" /> Sets
            </div>
            <p className="text-xl font-bold text-white">{totalSets}</p>
            <p className="text-[10px] text-slate-500 font-medium">completed</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400 mb-1.5">
              <Timer className="w-3.5 h-3.5" /> Reps
            </div>
            <p className="text-xl font-bold text-white">{totalReps}</p>
            <p className="text-[10px] text-slate-500 font-medium">total</p>
          </div>
        </motion.div>
      )}

      {/* Start Button */}
      {!workoutStarted && !workoutDone && (
        <button
          onClick={() => setWorkoutStarted(true)}
          className="w-full font-bold py-4 rounded-xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2.5"
          style={{ background: 'linear-gradient(135deg, #4f7cff, #9b6dff)', boxShadow: '0 8px 32px rgba(79,124,255,0.25)' }}
        >
          <Dumbbell className="w-5 h-5 text-white" />
          <span className="text-white">Begin Workout Session</span>
        </button>
      )}

      {/* Exercise Cards */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1 pb-1">Exercises</h2>
        {logs.map((ex, exIdx) => {
          const prevSets = prevSession[ex.name]
          const exVolume = ex.sets.reduce((s, set) => s + set.weightKg * set.reps, 0)

          return (
            <motion.div
              key={ex.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: exIdx * 0.04 }}
              className="glass rounded-2xl overflow-hidden border border-[#1a2550] shadow-xl shadow-black/20"
            >
              <button
                onClick={() => toggleExpand(ex.name)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#4f7cff]/15 to-[#9b6dff]/10 border border-[#4f7cff]/30 flex items-center justify-center shrink-0 shadow-lg shadow-[#4f7cff]/10">
                    <Dumbbell className="w-4 h-4 text-[#60a5fa]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{ex.name}</h3>
                    <p className="text-[11px] text-[#8fa6d9] mt-0.5 font-medium">
                      {ex.sets.length} sets{exVolume > 0 ? ` · ${exVolume.toLocaleString()} kg vol` : ' · tap to log'}
                    </p>
                  </div>
                </div>
                {ex.expanded ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
              </button>

              <AnimatePresence>
                {ex.expanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden bg-[#0a1024]"
                    transition={{ duration: 0.22 }}
                  >
                    <div className="px-4 pb-5 pt-1 space-y-4 border-t border-[#1a2550]">
                      {/* Previous session */}
                      {prevSets && prevSets.length > 0 && !workoutDone && (
                        <div className="mt-3 bg-[#0c1528] border border-[#1a2550] rounded-2xl p-3.5 text-center shadow-inner">
                          <p className="text-[9px] text-[#60a5fa] uppercase tracking-widest font-bold mb-2.5">Last Session</p>
                          <div className="grid grid-cols-3 gap-2">
                            {prevSets.map((s) => (
                              <div key={s.setNumber} className="bg-[#141e40] rounded-xl py-2 px-1">
                                <p className="text-[9px] text-slate-400 font-semibold mb-0.5">Set {s.setNumber}</p>
                                <p className="text-xs font-bold text-white">{s.weightKg}kg</p>
                                <p className="text-[10px] text-[#4f7cff] font-medium">× {s.reps}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Set Headers */}
                      {!workoutDone && (
                        <div className="grid grid-cols-[36px_1fr_1fr_32px] gap-3 text-[9px] text-slate-500 font-bold uppercase tracking-widest px-1 mt-2">
                          <span className="text-center">Set</span>
                          <span className="text-center">Weight <span className="text-[8px] opacity-75 lowercase">(kg)</span></span>
                          <span className="text-center">Reps</span>
                          <span />
                        </div>
                      )}

                      {/* Sets */}
                      <div className="space-y-2">
                        {ex.sets.map((set, setIdx) => (
                          <div key={setIdx} className="grid grid-cols-[36px_1fr_1fr_32px] gap-3 items-center">
                            <div className="flex items-center justify-center">
                              <span className="text-[11px] font-bold text-slate-400 w-7 h-7 rounded-lg bg-[#141e40] flex items-center justify-center shadow-inner">
                                {set.setNumber}
                              </span>
                            </div>
                            <input
                              type="number"
                              inputMode="decimal"
                              value={set.weightKg || ''}
                              onChange={(e) => updateSet(ex.name, setIdx, 'weightKg', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              min={0}
                              disabled={workoutDone}
                              className="bg-[#0c1528] border border-[#1a2550] hover:border-[#2a3a72] focus:border-[#4f7cff]/60 focus:ring-1 focus:ring-[#4f7cff]/20 rounded-xl px-3 py-3 text-sm text-white font-mono text-center transition-all disabled:opacity-50"
                            />
                            <input
                              type="number"
                              inputMode="numeric"
                              value={set.reps || ''}
                              onChange={(e) => updateSet(ex.name, setIdx, 'reps', parseInt(e.target.value) || 0)}
                              placeholder="0"
                              min={0}
                              disabled={workoutDone}
                              className="bg-[#0c1528] border border-[#1a2550] hover:border-[#2a3a72] focus:border-[#4f7cff]/60 focus:ring-1 focus:ring-[#4f7cff]/20 rounded-xl px-3 py-3 text-sm text-white font-mono text-center transition-all disabled:opacity-50"
                            />
                            <div className="flex items-center justify-center">
                              {setIdx === ex.sets.length - 1 && ex.sets.length > 1 && !workoutDone && (
                                <button onClick={() => removeSet(ex.name)} className="text-slate-600 hover:text-red-400 bg-[#141e40] w-7 h-7 rounded-lg flex items-center justify-center transition-colors">
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Set */}
                      {!workoutDone && (
                        <button
                          onClick={() => addSet(ex.name)}
                          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-[#60a5fa] hover:text-white py-3.5 border border-dashed border-[#4f7cff]/30 hover:border-[#4f7cff]/60 bg-[#4f7cff]/5 rounded-xl transition-all mt-4"
                        >
                          <Plus className="w-4 h-4" />
                          Add Set
                        </button>
                      )}
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
          onClick={handleFinish}
          disabled={saving}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-bold py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-6"
        >
          {saving ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin flex" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-white" />
          )}
          <span>{saving ? 'Saving...' : 'Finish Workout'}</span>
        </button>
      )}

      {/* Completion Card */}
      {workoutDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 text-center space-y-4 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10 mt-6 bg-[#0a1520]/80"
        >
          <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">🏆</div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-emerald-200">Session Complete!</h3>
          <p className="text-emerald-300/80 text-sm font-medium">
            {totalSets} sets · {totalReps} reps · {totalVolume.toLocaleString()} kg total
          </p>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Volume', value: `${(totalVolume / 1000).toFixed(1)}k kg` },
              { label: 'Sets', value: totalSets },
              { label: 'Reps', value: totalReps },
            ].map(({ label, value }) => (
              <div key={label} className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5">
                <p className="text-emerald-400 text-lg font-bold">{value}</p>
                <p className="text-emerald-600/80 text-[9px] uppercase font-bold tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
