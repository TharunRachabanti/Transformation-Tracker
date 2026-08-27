'use client'

import { useState } from 'react'
import { ChefHat, CheckCircle2, Circle } from 'lucide-react'

const PREP_TASKS = [
  { id: '1', label: 'Buy chicken breast (2.4 kg)', done: false },
  { id: '2', label: 'Buy fish (600 g)', done: false },
  { id: '3', label: 'Buy eggs (21 whole + extra whites)', done: false },
  { id: '4', label: 'Buy all vegetables', done: false },
  { id: '5', label: 'Buy fruits', done: false },
  { id: '6', label: 'Buy curd (2.1 kg)', done: false },
  { id: '7', label: 'Buy milk (750 ml)', done: false },
  { id: '8', label: 'Buy buttermilk (900 ml)', done: false },
  { id: '9', label: 'Portion chicken (200g per meal × 12 meals)', done: false },
  { id: '10', label: 'Portion fish (200g per meal × 3 meals)', done: false },
  { id: '11', label: 'Wash & prep vegetables', done: false },
  { id: '12', label: 'Cook dal (~3 portions)', done: false },
  { id: '13', label: 'Pre-measure rice (60g portions × 6)', done: false },
  { id: '14', label: 'Pre-measure atta (60g portions × 6)', done: false },
  { id: '15', label: 'Stock oats & whey protein', done: false },
]

const WEEKLY_REQUIREMENTS = [
  { label: 'Chicken Breast', qty: '2.4 kg (RAW)', color: 'text-red-400', icon: '🍗' },
  { label: 'Fish (White)', qty: '600 g (RAW)', color: 'text-blue-400', icon: '🐟' },
  { label: 'Whole Eggs', qty: '21 eggs', color: 'text-yellow-400', icon: '🥚' },
  { label: 'Egg Whites', qty: '6 extras', color: 'text-yellow-300', icon: '🥚' },
  { label: 'Rice', qty: '360 g (RAW)', color: 'text-amber-400', icon: '🍚' },
  { label: 'Oats', qty: '180 g (RAW)', color: 'text-amber-300', icon: '🌾' },
  { label: 'Whole Wheat Atta', qty: '360 g (RAW)', color: 'text-amber-500', icon: '🫓' },
  { label: 'Curd/Yoghurt', qty: '2.1 kg (AS SERVED)', color: 'text-cyan-400', icon: '🥛' },
  { label: 'Low-fat Milk', qty: '750 ml', color: 'text-cyan-300', icon: '🥛' },
  { label: 'Buttermilk', qty: '900 ml', color: 'text-cyan-200', icon: '🥛' },
  { label: 'Whey Protein', qty: '6 scoops (180 g)', color: 'text-violet-400', icon: '💊' },
  { label: 'Cooking Oil', qty: 'Max 70 g total', color: 'text-orange-400', icon: '🫙' },
  { label: 'Bananas', qty: '14 (pre-workout + meals)', color: 'text-yellow-400', icon: '🍌' },
  { label: 'Assorted Fruits', qty: '6 servings', color: 'text-pink-400', icon: '🍎' },
  { label: 'Mixed Vegetables', qty: '≈2.5 kg', color: 'text-green-400', icon: '🥦' },
]

export default function MealPrepPage() {
  const [tasks, setTasks] = useState(PREP_TASKS)

  function toggle(id: string) {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t))
  }

  const done = tasks.filter((t) => t.done).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Meal Prep</h1>
        <p className="text-sm text-slate-400 mt-0.5">Weekly ingredient requirements & prep checklist</p>
      </div>

      {/* Weekly Requirements */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-orange-400" />
          This Week&apos;s Requirements
        </h2>
        <p className="text-xs text-slate-500">Based on 6-day plan (3× MWF + 3× TTS + Sunday)</p>
        <div className="space-y-2 mt-2">
          {WEEKLY_REQUIREMENTS.map((req) => (
            <div key={req.label} className="flex items-center justify-between py-1.5 border-b border-slate-800/30 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-base">{req.icon}</span>
                <span className="text-sm text-slate-300">{req.label}</span>
              </div>
              <span className={`text-xs font-medium ${req.color}`}>{req.qty}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prep Checklist */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Prep Checklist</h2>
          <span className="text-xs text-slate-500">{done}/{tasks.length} done</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${(done / tasks.length) * 100}%` }} />
        </div>
        <div className="space-y-1">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggle(task.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${task.done ? 'opacity-60' : 'hover:bg-slate-800/40'}`}
            >
              {task.done
                ? <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                : <Circle className="w-5 h-5 text-slate-600 shrink-0" />
              }
              <span className={`text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {task.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
