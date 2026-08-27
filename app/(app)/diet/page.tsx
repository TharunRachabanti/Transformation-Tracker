'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Flame, Droplets } from 'lucide-react'
import { getMealPlanForDay } from '@/data/mealPlans'
import { FOOD_DATABASE, calcNutrition } from '@/data/nutrition'
import { MeasurementBadge } from '@/components/shared/MeasurementBadge'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { cn } from '@/lib/utils'
import { MealConfig, MealFoodConfig, FoodItem } from '@/types'

// Build food lookup at module level
const foodLookup: Record<string, typeof FOOD_DATABASE[0]> = {}
FOOD_DATABASE.forEach((f) => { foodLookup[f.name] = f })

function getMealNutrition(foods: MealFoodConfig[]) {
  return foods.reduce(
    (acc, f) => {
      const food = foodLookup[f.foodId]
      if (!food) return acc
      const n = calcNutrition(food, f.quantityG)
      acc.calories += n.calories
      acc.proteinG += n.proteinG
      return acc
    },
    { calories: 0, proteinG: 0 }
  )
}

export default function DietPage() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const plan = getMealPlanForDay(dayOfWeek)
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set())
  const [expandedMeal, setExpandedMeal] = useState<string | null>('breakfast')
  const [oilUsed, setOilUsed] = useState({ lunch: 5, dinner: 5 })
  const [fruitChoices, setFruitChoices] = useState<Record<string, string>>({})

  const TARGET_CALS = 2300
  const TARGET_PROTEIN = 160

  const totalNutrition = plan.meals.reduce(
    (acc, meal) => {
      const n = getMealNutrition(meal.foods)
      acc.calories += n.calories
      acc.proteinG += n.proteinG
      return acc
    },
    { calories: 0, proteinG: 0 }
  )

  const consumedNutrition = plan.meals
    .filter((m) => completedMeals.has(m.key))
    .reduce(
      (acc, meal) => {
        const n = getMealNutrition(meal.foods)
        acc.calories += n.calories
        acc.proteinG += n.proteinG
        return acc
      },
      { calories: 0, proteinG: 0 }
    )

  function toggleMeal(key: string) {
    setCompletedMeals((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const dayLabel = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
  const planLabel = { MWF: 'Mon / Wed / Fri', TTS: 'Tue / Thu / Sat', SUNDAY: 'Sunday (Rest Day)' }[plan.dayType]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">{format(today, 'MMMM d, yyyy')}</p>
        <h1 className="text-2xl font-bold text-white mt-0.5">Diet</h1>
        <p className="text-sm text-slate-400 mt-0.5">{dayLabel} · {planLabel}</p>
      </div>

      {/* Daily Nutrition Summary */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">Today&apos;s Nutrition</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500 flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" /> Calories</span>
              <span className="text-xs font-medium text-white">{Math.round(consumedNutrition.calories)} / {TARGET_CALS}</span>
            </div>
            <ProgressBar value={consumedNutrition.calories} max={TARGET_CALS} color="orange" showLabel={false} />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500">🍗 Protein</span>
              <span className="text-xs font-medium text-white">{Math.round(consumedNutrition.proteinG)}g / {TARGET_PROTEIN}g</span>
            </div>
            <ProgressBar value={consumedNutrition.proteinG} max={TARGET_PROTEIN} color="blue" showLabel={false} />
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-800/60">
          <span>{completedMeals.size} / {plan.meals.length} meals completed</span>
          <span className="text-slate-400">
            Plan total: ~{Math.round(totalNutrition.calories)} kcal · {Math.round(totalNutrition.proteinG)}g protein
          </span>
        </div>
      </div>

      {/* Oil Tracker */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              🫙 Oil Tracker
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Max 10g/day cooking oil</p>
          </div>
          <span className={cn(
            'text-sm font-bold',
            (oilUsed.lunch + oilUsed.dinner) > 10 ? 'text-red-400' : 'text-green-400'
          )}>
            {oilUsed.lunch + oilUsed.dinner}g / 10g
          </span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
          {['Lunch', 'Dinner'].map((meal, i) => (
            <div key={meal}>
              <p className="text-slate-500 mb-1">{meal}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setOilUsed((o) => ({ ...o, [meal.toLowerCase()]: Math.max(0, (i === 0 ? o.lunch : o.dinner) - 1) }))}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 transition-colors">-</button>
                <span className="font-medium text-white w-8 text-center">{i === 0 ? oilUsed.lunch : oilUsed.dinner}g</span>
                <button onClick={() => setOilUsed((o) => ({ ...o, [meal.toLowerCase()]: Math.min(10, (i === 0 ? o.lunch : o.dinner) + 1) }))}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 transition-colors">+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Today&apos;s Meals</h2>
        {plan.meals.map((meal) => (
          <MealCard
            key={meal.key}
            meal={meal}
            completed={completedMeals.has(meal.key)}
            expanded={expandedMeal === meal.key}
            onToggleComplete={() => toggleMeal(meal.key)}
            onToggleExpand={() => setExpandedMeal(expandedMeal === meal.key ? null : meal.key)}
            fruitChoice={fruitChoices[meal.key]}
            onFruitChoice={(foodId) => setFruitChoices((p) => ({ ...p, [meal.key]: foodId }))}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Meal Card ──────────────────────────────────────────────────────────────
function MealCard({
  meal, completed, expanded, onToggleComplete, onToggleExpand, fruitChoice, onFruitChoice,
}: {
  meal: MealConfig
  completed: boolean
  expanded: boolean
  onToggleComplete: () => void
  onToggleExpand: () => void
  fruitChoice?: string
  onFruitChoice: (id: string) => void
}) {
  const nutrition = getMealNutrition(
    meal.foods.map((f) => {
      // Apply fruit choice override if applicable
      if (f.alternatives && fruitChoice) {
        const alt = f.alternatives.find((a) => a.foodId === fruitChoice)
        if (alt) return { ...f, foodId: alt.foodId, quantityG: alt.quantityG }
      }
      return f
    })
  )

  return (
    <motion.div
      layout
      className={cn(
        'rounded-2xl border transition-all',
        completed
          ? 'bg-green-500/8 border-green-500/20'
          : 'glass border-slate-800/60'
      )}
    >
      {/* Header */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggleComplete() }}
          className="shrink-0 transition-transform active:scale-90"
        >
          {completed
            ? <CheckCircle2 className="w-6 h-6 text-green-400" />
            : <Circle className="w-6 h-6 text-slate-600" />
          }
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={cn('font-semibold text-sm', completed ? 'text-slate-400 line-through' : 'text-white')}>
              {meal.label}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {meal.time} · ~{Math.round(nutrition.calories)} kcal · {Math.round(nutrition.proteinG)}g protein
          </p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {meal.notes && (
                <p className="text-xs text-slate-500 italic bg-slate-800/40 rounded-lg px-3 py-2">{meal.notes}</p>
              )}

              {/* Food Items */}
              {meal.foods.map((food, i) => {
                const foodData = foodLookup[food.foodId]
                if (!food.isOptional && !foodData) return null

                // Fruit alternatives
                if (food.alternatives) {
                  return (
                    <div key={i} className="space-y-1.5">
                      <p className="text-xs text-slate-500">🍎 Choose one fruit:</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[{ foodId: food.foodId, quantityG: food.quantityG, label: food.foodId }, ...(food.alternatives ?? [])].map((alt) => (
                          <button
                            key={alt.foodId}
                            onClick={() => onFruitChoice(alt.foodId)}
                            className={cn(
                              'text-xs py-2 px-3 rounded-lg border transition-all text-left',
                              (fruitChoice ?? food.foodId) === alt.foodId
                                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                                : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:border-slate-600'
                            )}
                          >
                            <span className="font-medium">{alt.label ?? alt.foodId}</span>
                            <span className="text-slate-500 ml-1">{alt.quantityG}g</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-800/30 last:border-0">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm text-slate-200 truncate">{food.foodId}</span>
                      {food.isOptional && (
                        <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wide">optional</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {foodData && <MeasurementBadge type={foodData.measurementType} />}
                      <span className="text-xs font-medium text-slate-300 w-14 text-right">
                        {food.quantityG}g
                      </span>
                    </div>
                  </div>
                )
              })}

              {/* Nutrition Footer */}
              <div className="flex gap-4 pt-2 border-t border-slate-800/40">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span className="text-xs text-slate-400">~{Math.round(nutrition.calories)} kcal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🍗</span>
                  <span className="text-xs text-slate-400">~{Math.round(nutrition.proteinG)}g protein</span>
                </div>
              </div>

              {/* Complete Button */}
              <button
                onClick={onToggleComplete}
                className={cn(
                  'w-full py-2.5 rounded-xl text-sm font-medium transition-all mt-1',
                  completed
                    ? 'bg-slate-800/60 text-slate-400 hover:bg-red-500/10 hover:text-red-400'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20'
                )}
              >
                {completed ? '✓ Completed – Tap to undo' : 'Mark as Completed'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
