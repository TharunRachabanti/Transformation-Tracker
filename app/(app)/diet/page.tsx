'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Flame, Leaf } from 'lucide-react'
import { getMealPlanForDay } from '@/data/mealPlans'
import { FOOD_DATABASE, calcNutrition } from '@/data/nutrition'
import { MeasurementBadge } from '@/components/shared/MeasurementBadge'
import { cn } from '@/lib/utils'
import { MealConfig, MealFoodConfig } from '@/types'

// Build food lookup
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

const MEAL_EMOJIS: Record<string, string> = {
  breakfast: '🌅',
  'early-morning': '🌤️',
  mid_morning: '🍎',
  lunch: '🍽️',
  'pre-workout': '⚡',
  'post-workout': '🥛',
  dinner: '🌙',
  'evening-snack': '🌙',
  default: '🥗',
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

  const oilTotal = oilUsed.lunch + oilUsed.dinner
  const dayLabel = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
  const planLabel = { MWF: 'Mon / Wed / Fri', TTS: 'Tue / Thu / Sat', SUNDAY: 'Sunday' }[plan.dayType]
  const completionPct = plan.meals.length > 0 ? Math.round((completedMeals.size / plan.meals.length) * 100) : 0

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <p className="text-[11px] text-slate-500 uppercase tracking-[0.18em] font-semibold">{format(today, 'MMMM d, yyyy')}</p>
        <h1 className="text-[26px] font-bold text-white mt-1">Diet</h1>
        <p className="text-sm text-slate-500 mt-0.5">{dayLabel} · {planLabel}</p>
      </div>

      {/* Progress Summary Card */}
      <div
        className="rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, rgba(17,28,65,0.9) 0%, rgba(10,16,38,0.95) 100%)', border: '1px solid rgba(79,124,255,0.12)' }}
      >
        {/* Completion */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-white">{completedMeals.size} of {plan.meals.length} meals</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Keep going!</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{completionPct}%</span>
            <p className="text-[10px] text-slate-500">done</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-[#0c1528] rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #4f7cff, #9b6dff)' }}
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {/* Macros */}
        <div className="grid grid-cols-2 gap-3">
          <NutrBox
            label="Calories"
            value={Math.round(consumedNutrition.calories)}
            target={TARGET_CALS}
            unit="kcal"
            color="#f97316"
          />
          <NutrBox
            label="Protein"
            value={Math.round(consumedNutrition.proteinG)}
            target={TARGET_PROTEIN}
            unit="g"
            color="#4f7cff"
          />
        </div>
      </div>

      {/* Oil Tracker */}
      <div className="rounded-2xl p-4" style={{ background: 'rgba(14,22,48,0.8)', border: '1px solid rgba(26,37,80,0.8)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Cooking Oil</h3>
              <p className="text-[10px] text-slate-500">Max 10g per day</p>
            </div>
          </div>
          <span className={cn(
            'text-sm font-bold px-3 py-1 rounded-full border text-xs',
            oilTotal > 10
              ? 'text-red-400 bg-red-500/10 border-red-500/20'
              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
          )}>
            {oilTotal}g / 10g
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['lunch', 'dinner'] as const).map((meal) => (
            <div key={meal} className="bg-[#0c1528]/60 rounded-xl p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2 capitalize">{meal}</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setOilUsed((o) => ({ ...o, [meal]: Math.max(0, o[meal] - 1) }))}
                  className="w-8 h-8 rounded-lg bg-[#141e40] text-slate-400 flex items-center justify-center hover:bg-[#1a2550] transition-colors text-lg font-light"
                >−</button>
                <span className="text-base font-bold text-white">{oilUsed[meal]}g</span>
                <button
                  onClick={() => setOilUsed((o) => ({ ...o, [meal]: Math.min(10, o[meal] + 1) }))}
                  className="w-8 h-8 rounded-lg bg-[#141e40] text-slate-400 flex items-center justify-center hover:bg-[#1a2550] transition-colors text-lg font-light"
                >+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">Today's Meals</h2>
        {plan.meals.map((meal, idx) => (
          <MealCard
            key={meal.key}
            meal={meal}
            completed={completedMeals.has(meal.key)}
            expanded={expandedMeal === meal.key}
            onToggleComplete={() => {
              setCompletedMeals((prev) => {
                const next = new Set(prev)
                next.has(meal.key) ? next.delete(meal.key) : next.add(meal.key)
                return next
              })
            }}
            onToggleExpand={() => setExpandedMeal(expandedMeal === meal.key ? null : meal.key)}
            fruitChoice={fruitChoices[meal.key]}
            onFruitChoice={(id) => setFruitChoices((p) => ({ ...p, [meal.key]: id }))}
            emoji={MEAL_EMOJIS[meal.key] || MEAL_EMOJIS.default}
            delay={idx * 0.04}
          />
        ))}
      </div>
    </div>
  )
}

// ── Nutrition Box ────────────────────────────────────────────────────────────
function NutrBox({ label, value, target, unit, color }: { label: string; value: number; target: number; unit: string; color: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] text-slate-500 uppercase tracking-wide">{label}</span>
        <span className="text-xs font-semibold text-white">{value}<span className="text-slate-500 font-normal"> / {target}{unit}</span></span>
      </div>
      <div className="h-1.5 bg-[#0c1528] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// ── Meal Card ────────────────────────────────────────────────────────────────
function MealCard({
  meal, completed, expanded, onToggleComplete, onToggleExpand, fruitChoice, onFruitChoice, emoji, delay = 0,
}: {
  meal: MealConfig
  completed: boolean
  expanded: boolean
  onToggleComplete: () => void
  onToggleExpand: () => void
  fruitChoice?: string
  onFruitChoice: (id: string) => void
  emoji: string
  delay?: number
}) {
  const nutrition = getMealNutrition(
    meal.foods.map((f) => {
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300',
        completed
          ? 'border border-emerald-500/20'
          : 'border border-[#1a2550]'
      )}
      style={{
        background: completed
          ? 'rgba(0, 212, 120, 0.05)'
          : 'rgba(12, 20, 48, 0.8)'
      }}
    >
      {/* Header */}
      <button onClick={onToggleExpand} className="w-full flex items-center gap-3 p-4 text-left">
        {/* Meal emoji */}
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0',
          completed ? 'bg-emerald-500/15' : 'bg-[#141e40]'
        )}>
          {completed ? '✅' : emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={cn('font-semibold text-sm', completed ? 'text-slate-400 line-through' : 'text-white')}>
              {meal.label}
            </h3>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {meal.time} · {Math.round(nutrition.calories)} kcal · {Math.round(nutrition.proteinG)}g protein
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleComplete() }}
            className="transition-transform active:scale-90"
          >
            {completed
              ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              : <Circle className="w-5 h-5 text-slate-700 hover:text-slate-500" />
            }
          </button>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-600" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-600" />}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-[#1a2550]">
              {meal.notes && (
                <p className="text-xs text-slate-500 italic pt-3 bg-[#0c1528]/60 rounded-lg px-3 py-2 mt-3">{meal.notes}</p>
              )}

              {/* Food Items */}
              <div className="space-y-0 mt-2">
                {meal.foods.map((food, i) => {
                  const foodData = foodLookup[food.foodId]
                  if (!food.isOptional && !foodData) return null

                  if (food.alternatives) {
                    return (
                      <div key={i} className="py-2">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-2">Choose one fruit</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[{ foodId: food.foodId, quantityG: food.quantityG, label: food.foodId }, ...(food.alternatives ?? [])].map((alt) => (
                            <button
                              key={alt.foodId}
                              onClick={() => onFruitChoice(alt.foodId)}
                              className={cn(
                                'text-xs py-2 px-3 rounded-xl border transition-all text-left',
                                (fruitChoice ?? food.foodId) === alt.foodId
                                  ? 'bg-[#4f7cff]/15 border-[#4f7cff]/40 text-[#60a5fa]'
                                  : 'bg-[#0c1528] border-[#1a2550] text-slate-400 hover:border-[#2a3a72]'
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
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#121b3a]/60 last:border-0">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4f7cff]/40 shrink-0" />
                        <span className="text-sm text-slate-200 truncate">{food.foodId}</span>
                        {food.isOptional && (
                          <span className="text-[9px] bg-[#141e40] text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0">opt</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {foodData && <MeasurementBadge type={foodData.measurementType} />}
                        <span className="text-xs font-semibold text-slate-300 w-12 text-right">{food.quantityG}g</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{Math.round(nutrition.calories)} kcal</span>
                  <span>· {Math.round(nutrition.proteinG)}g protein</span>
                </div>
                <button
                  onClick={onToggleComplete}
                  className={cn(
                    'text-xs font-semibold py-1.5 px-4 rounded-xl transition-all',
                    completed
                      ? 'bg-red-500/8 text-red-400 border border-red-500/15 hover:bg-red-500/15'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25'
                  )}
                >
                  {completed ? 'Undo' : 'Done ✓'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
