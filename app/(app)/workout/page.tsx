'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Plus, Minus, Dumbbell, Timer, ChevronDown, ChevronUp, Trophy } from 'lucide-react'
import { getWorkoutForDay, WORKOUT_SCHEDULE } from '@/data/plans'
import { cn } from '@/lib/utils'
import { ExerciseSet } from '@/types'

interface SetLog {
  setNumber: number
  reps: number
  weightKg: number
  notes: string
}

interface ExerciseLogState {
  name: string
  sets: SetLog[]
  expanded: boolean
}

// Mock previous session data
const PREV_SESSION: Record<string, SetLog[]> = {
  'Bench Press': [
    { setNumber: 1, reps: 10, weightKg: 40, notes: '' },
    { setNumber: 2, reps: 9, weightKg: 40, notes: '' },
    { setNumber: 3, reps: 8, weightKg: 40, notes: '' },
  ],
  'Lat Pulldown': [
    { setNumber: 1, reps: 12, weightKg: 50, notes: '' },
    { setNumber: 2, reps: 10, weightKg: 50, notes: '' },
    { setNumber: 3, reps: 10, weightKg: 50, notes: '' },
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
        notes: '',
      })),
    }))
  )
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [workoutDone, setWorkoutDone] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  const dayLabel = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]

  const totalVolume = logs.reduce((acc, ex) =>
    acc + ex.sets.reduce((s, set) => s + set.weightKg * set.reps, 0), 0
  )

  const totalSets = logs.reduce((acc, ex) => acc + ex.sets.length, 0)
  const totalReps = logs.reduce((acc, ex) => acc + ex.sets.reduce((s, set) => s + set.reps, 0), 0)

  function updateSet(exName: string, setIdx: number, field: keyof SetLog, value: number | string) {
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
            notes: '',
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
          <p className="text-xs text-slate-500 uppercase tracking-widest">{format(today, 'MMMM d')}</p>
          <h1 className="text-2xl font-bold text-white mt-0.5">Workout</h1>
        </div>
        <div className="glass rounded-2xl p-8 text-center space-y-4">
          <div className="text-5xl">😴</div>
          <h2 className="text-xl font-bold text-white">Rest Day</h2>
          <p className="text-slate-400 text-sm">Sunday is your recovery day. Aim for 7,000–10,000 steps and go through your regular diet plan.</p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <p className="text-blue-300 text-sm font-medium">Recovery Tips</p>
            <ul className="text-slate-400 text-xs mt-2 space-y-1 text-left list-disc list-inside">
              <li>Light walking or stretching</li>
              <li>Stay hydrated (3.5L target)</li>
              <li>Get 7–9 hours of sleep</li>
              <li>Follow your regular meal plan</li>
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
          <p className="text-xs text-slate-500 uppercase tracking-widest">{format(today, 'MMMM d')}</p>
          <h1 className="text-2xl font-bold text-white mt-0.5">Workout</h1>
          <p className="text-sm text-slate-400 mt-0.5">{dayLabel} · {workout.label}</p>
        </div>
        {workoutDone && (
          <div className="flex items-center gap-2 bg-green-500/15 border border-green-500/25 rounded-xl px-3 py-2">
            <Trophy className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Done!</span>
          </div>
        )}
      </div>

      {/* Stats Bar */}
      {workoutStarted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-3 grid grid-cols-3 gap-3 text-center"
        >
          <div>
            <p className="text-xs text-slate-500">Volume</p>
            <p className="text-base font-bold text-white">{(totalVolume / 1000).toFixed(1)}k</p>
            <p className="text-[10px] text-slate-600">kg</p>
          </div>
          <div className="border-x border-slate-800/60">
            <p className="text-xs text-slate-500">Sets</p>
            <p className="text-base font-bold text-white">{totalSets}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Reps</p>
            <p className="text-base font-bold text-white">{totalReps}</p>
          </div>
        </motion.div>
      )}

      {/* Start Workout Button */}
      {!workoutStarted && !workoutDone && (
        <button
          onClick={() => { setWorkoutStarted(true); setStartTime(new Date()) }}
          className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold py-4 rounded-2xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Dumbbell className="w-5 h-5" />
          Start Workout
        </button>
      )}

      {/* Exercises */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Exercises</h2>
        {logs.map((ex, exIdx) => {
          const prevSets = PREV_SESSION[ex.name]
          const exVolume = ex.sets.reduce((s, set) => s + set.weightKg * set.reps, 0)

          return (
            <motion.div
              key={ex.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: exIdx * 0.05 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(ex.name)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div>
                  <h3 className="font-semibold text-white text-sm">{ex.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {ex.sets.length} sets · {exVolume > 0 ? `${exVolume} kg vol.` : 'Log your sets'}
                  </p>
                </div>
                {ex.expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              <AnimatePresence>
                {ex.expanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      {/* Previous session */}
                      {prevSets && (
                        <div className="bg-slate-800/40 rounded-xl p-3 space-y-1">
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Last Session</p>
                          {prevSets.map((s) => (
                            <p key={s.setNumber} className="text-xs text-slate-400">
                              Set {s.setNumber}: {s.weightKg} kg × {s.reps}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Set Headers */}
                      <div className="grid grid-cols-[40px_1fr_1fr_32px] gap-2 text-[10px] text-slate-500 uppercase tracking-wide px-1">
                        <span>Set</span>
                        <span>Weight (kg)</span>
                        <span>Reps</span>
                        <span></span>
                      </div>

                      {/* Sets */}
                      {ex.sets.map((set, setIdx) => (
                        <div key={setIdx} className="grid grid-cols-[40px_1fr_1fr_32px] gap-2 items-center">
                          <span className="text-xs font-medium text-slate-400 text-center">{set.setNumber}</span>
                          <input
                            type="number"
                            value={set.weightKg || ''}
                            onChange={(e) => updateSet(ex.name, setIdx, 'weightKg', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            min={0}
                            className="bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                          <input
                            type="number"
                            value={set.reps || ''}
                            onChange={(e) => updateSet(ex.name, setIdx, 'reps', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            min={0}
                            className="bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                          <div className="w-8 h-8 flex items-center justify-center">
                            {setIdx === ex.sets.length - 1 && ex.sets.length > 1 && (
                              <button onClick={() => removeSet(ex.name)} className="text-slate-600 hover:text-red-400 transition-colors">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add Set */}
                      <button
                        onClick={() => addSet(ex.name)}
                        className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-400 py-2 border border-dashed border-slate-700/60 hover:border-blue-500/40 rounded-xl transition-all"
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
          className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded-2xl text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-5 h-5" />
          Finish Workout
        </button>
      )}

      {workoutDone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-6 text-center space-y-2"
        >
          <div className="text-4xl mb-2">🏆</div>
          <h3 className="text-lg font-bold text-white">Workout Complete!</h3>
          <p className="text-slate-400 text-sm">
            {totalSets} sets · {totalReps} reps · {totalVolume.toLocaleString()} kg volume
          </p>
        </motion.div>
      )}
    </div>
  )
}
