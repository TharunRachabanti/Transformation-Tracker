'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Flame, Leaf } from 'lucide-react'
import { FOOD_DATABASE, calcNutrition } from '@/data/nutrition'
import { MeasurementBadge } from '@/components/shared/MeasurementBadge'
import { cn } from '@/lib/utils'
import { MealConfig, MealFoodConfig } from '@/types'
import { toggleMealComplete } from '@/app/(app)/actions'

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

export function DietClient({ 
  plan, 
  dayOfWeek, 
  initialMeals,
  targetCalories,
  targetProtein
}: { 
  plan: any
  dayOfWeek: number
  initialMeals: string[]
  targetCalories: number
  targetProtein: number
}) {
  const today = new Date()
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set(initialMeals))
  const [expandedMeal, setExpandedMeal] = useState<string | null>('breakfast')
  const [loadingMeals, setLoadingMeals] = useState<Set<string>>(new Set())
  const [oilUsed, setOilUsed] = useState({ lunch: 5, dinner: 5 })
  const [fruitChoices, setFruitChoices] = useState<Record<string, string>>({})

  async function handleToggleMeal(meal: MealConfig) {
    if (loadingMeals.has(meal.key)) return

    const isCurrentlyCompleted = completedMeals.has(meal.key)
    const nextCompleted = !isCurrentlyCompleted
    
    // Optimistic UI update
    setCompletedMeals(prev => {
      const p = new Set(prev)
      nextCompleted ? p.add(meal.key) : p.delete(meal.key)
      return p
    })
    setLoadingMeals(prev => new Set(prev).add(meal.key))

    try {
      const mealEntries = meal.foods.map((f) => {
        let foodId = f.foodId
        let qty = f.quantityG
        if (f.alternatives && fruitChoices[meal.key]) {
          const alt = f.alternatives.find((a) => a.foodId === fruitChoices[meal.key])
          if (alt) { foodId = alt.foodId; qty = alt.quantityG }
        }
        
        const foodData = foodLookup[foodId]
        if (!foodData) return null
        const n = calcNutrition(foodData, qty)

        return {
          foodId,
          quantityG: qty,
          calories: n.calories,
          proteinG: n.proteinG
        }
      }).filter(Boolean) as any[]

      await toggleMealComplete(meal.key, meal.label, today, nextCompleted, mealEntries)
    } catch {
      // Revert if error
      setCompletedMeals(prev => {
        const p = new Set(prev)
        isCurrentlyCompleted ? p.add(meal.key) : p.delete(meal.key)
        return p
      })
    } finally {
      setLoadingMeals(prev => {
        const p = new Set(prev)
        p.delete(meal.key)
        return p
      })
    }
  }

  const consumedNutrition = plan.meals
    .filter((m: MealConfig) => completedMeals.has(m.key))
    .reduce(
      (acc: { calories: number; proteinG: number }, meal: MealConfig) => {
        const mealFoods = meal.foods.map(f => {
           if (f.alternatives && fruitChoices[meal.key]) {
             const alt = f.alternatives.find((a) => a.foodId === fruitChoices[meal.key])
             if (alt) return { ...f, foodId: alt.foodId, quantityG: alt.quantityG }
           }
           return f
        })
        const n = getMealNutrition(mealFoods)
        acc.calories += n.calories
        acc.proteinG += n.proteinG
        return acc
      },
      { calories: 0, proteinG: 0 }
    )

  const oilTotal = oilUsed.lunch + oilUsed.dinner
  const dayLabel = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
  const planLabel = { MWF: 'Mon / Wed / Fri', TTS: 'Tue / Thu / Sat', SUNDAY: 'Sunday' }[plan.dayType as string] || 'Custom'
  const completionPct = plan.meals.length > 0 ? Math.round((completedMeals.size / plan.meals.length) * 100) : 0

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div>
        <p className="text-[10px] text-[#4f7cff] font-bold uppercase tracking-[0.2em]">{format(today, 'MMMM d, yyyy')}</p>
        <h1 className="text-2xl font-bold text-white mt-1">Diet Plan</h1>
        <p className="text-sm text-slate-400 mt-0.5">{dayLabel} · {planLabel}</p>
      </div>

      {/* Progress Summary Card */}
      <div className="glass border border-[#1a2550] rounded-2xl p-5 shadow-lg shadow-[#4f7cff]/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-white">{completedMeals.size} of {plan.meals.length} meals</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Keep it up!</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">{completionPct}%</span>
            <p className="text-[10px] text-slate-500">done</p>
          </div>
        </div>

        <div className="h-1.5 bg-[#0c1528] rounded-full overflow-hidden mb-5">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #4f7cff, #9b6dff)' }}
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NutrBox label="Calories" value={Math.round(consumedNutrition.calories)} target={targetCalories} unit="kcal" color="#f97316" bg="bg-orange-500/15" />
          <NutrBox label="Protein" value={Math.round(consumedNutrition.proteinG)} target={targetProtein} unit="g" color="#4f7cff" bg="bg-[#4f7cff]/15" />
        </div>
      </div>

      {/* Oil Tracker */}
      <div className="glass border border-[#1a2550] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-amber-500/15 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Cooking Oil</h3>
              <p className="text-[10px] text-slate-500">Max 10g per day</p>
            </div>
          </div>
          <span className={cn(
            'text-xs font-bold px-3 py-1.5 rounded-lg border',
            oilTotal > 10
              ? 'text-red-400 bg-red-500/10 border-red-500/20'
              : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
          )}>
            {oilTotal}g / 10g
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['lunch', 'dinner'] as const).map((meal) => (
            <div key={meal} className="bg-[#0c1528] border border-[#1a2550] rounded-xl p-3 text-center">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-2">{meal}</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setOilUsed((o) => ({ ...o, [meal]: Math.max(0, o[meal] - 1) }))}
                  className="w-8 h-8 rounded-[10px] bg-[#141e40] text-slate-400 flex items-center justify-center hover:bg-[#1a2550] transition-colors border border-[#1a2550]"
                >−</button>
                <span className="text-base font-bold text-white">{oilUsed[meal]}g</span>
                <button
                  onClick={() => setOilUsed((o) => ({ ...o, [meal]: Math.min(10, o[meal] + 1) }))}
                  className="w-8 h-8 rounded-[10px] bg-[#141e40] text-slate-400 flex items-center justify-center hover:bg-[#1a2550] transition-colors border border-[#1a2550]"
                >+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meals */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1 pb-1">Today's Meals</h2>
        {plan.meals.map((meal: any, idx: number) => (
          <MealCard
            key={meal.key}
            meal={meal}
            completed={completedMeals.has(meal.key)}
            expanded={expandedMeal === meal.key}
            loading={loadingMeals.has(meal.key)}
            onToggleComplete={() => handleToggleMeal(meal)}
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

function NutrBox({ label, value, target, unit, color, bg }: { label: string; value: number; target: number; unit: string; color: string; bg: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100)) || 0
  return (
    <div className="bg-[#0c1528] rounded-xl p-3 border border-[#1a2550]">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: color }} />
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">{label}</span>
        </div>
        <span className="text-xs font-semibold text-white">{value}<span className="text-[10px] text-slate-500 font-normal">/{target} {unit}</span></span>
      </div>
      <div className="h-1.5 bg-[#141e40] rounded-full overflow-hidden">
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

function MealCard({
  meal, completed, expanded, loading, onToggleComplete, onToggleExpand, fruitChoice, onFruitChoice, emoji, delay = 0,
}: {
  meal: MealConfig
  completed: boolean
  expanded: boolean
  loading: boolean
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
        'rounded-2xl overflow-hidden transition-all duration-300 relative',
        completed ? 'border border-emerald-500/20' : 'border border-[#1a2550]'
      )}
      style={{
        background: completed ? 'rgba(16, 185, 129, 0.03)' : 'rgba(14, 22, 48, 0.6)'
      }}
    >
      <button onClick={onToggleExpand} className="w-full flex items-center gap-3 p-4 text-left">
        <div className={cn(
          'w-10 h-10 rounded-[12px] flex items-center justify-center text-xl shrink-0',
          completed ? 'bg-emerald-500/10' : 'bg-[#141e40] border border-[#1a2550]'
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
            {meal.time} · <span className="font-medium text-slate-400">{Math.round(nutrition.calories)}</span> kcal · <span className="font-medium text-slate-400">{Math.round(nutrition.proteinG)}g</span> p
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleComplete() }}
            disabled={loading}
            className="transition-transform active:scale-90 p-2 -m-2 disabled:opacity-50"
          >
            {loading ? (
               <span className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin flex" />
            ) : completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
            )}
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: 'auto', opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             transition={{ duration: 0.22, ease: 'easeInOut' }}
             className="overflow-hidden"
          >
             <div className="px-4 pb-4 border-t border-[#1a2550]">
                {meal.notes && (
                  <p className="text-xs text-slate-400 italic bg-[#0c1528] rounded-xl px-3 py-2.5 mt-4 border border-[#1a2550]/60 shadow-inner block">{meal.notes}</p>
                )}

                <div className="mt-3">
                  {meal.foods.map((food, i) => {
                    const foodData = foodLookup[food.foodId]
                    if (!food.isOptional && !foodData) return null

                    if (food.alternatives) {
                      return (
                        <div key={i} className="py-2.5">
                          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-2">Choose one fruit</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[{ foodId: food.foodId, quantityG: food.quantityG, label: food.foodId }, ...(food.alternatives ?? [])].map((alt) => (
                              <button
                                key={alt.foodId}
                                onClick={() => onFruitChoice(alt.foodId)}
                                className={cn(
                                  'text-xs py-2 px-3 rounded-xl border transition-all text-left flex items-center justify-between',
                                  (fruitChoice ?? food.foodId) === alt.foodId
                                    ? 'bg-gradient-to-br from-[#4f7cff]/15 to-[#9b6dff]/10 border-[#4f7cff]/30 text-[#60a5fa]'
                                    : 'bg-[#0c1528] border-[#1a2550] text-slate-400 hover:border-[#2a3a72]'
                                )}
                              >
                                <span className="font-medium">{alt.label ?? alt.foodId}</span>
                                <span className="text-slate-500 text-[10px]">{alt.quantityG}g</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-[#1a2550]/50 last:border-0 last:pb-1">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4f7cff] opacity-80 shrink-0 shadow-[0_0_8px_rgba(79,124,255,0.8)]" />
                          <span className="text-sm text-slate-200 truncate">{food.foodId}</span>
                          {food.isOptional && (
                            <span className="text-[9px] bg-[#141e40] text-slate-400 px-1.5 py-0.5 rounded border border-[#1a2550] uppercase tracking-wide shrink-0">opt</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {foodData && <MeasurementBadge type={foodData.measurementType} />}
                          <span className="text-xs font-bold text-slate-300 w-12 text-right font-mono">{food.quantityG}g</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-between mt-4 bg-[#0c1528] rounded-xl p-3 border border-[#1a2550]">
                  <div className="flex gap-4 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-400" />{Math.round(nutrition.calories)}</span>
                    <span className="flex items-center before:content-['•'] before:mr-3 before:text-slate-700">{Math.round(nutrition.proteinG)}g p</span>
                  </div>
                  <button
                    onClick={onToggleComplete}
                    disabled={loading}
                    className={cn(
                      'text-xs font-bold py-1.5 px-4 rounded-lg transition-all flex items-center gap-1.5',
                      completed
                        ? 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-white'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                    )}
                  >
                    {loading ? 'Saving...' : completed ? 'Undo' : 'Done ✓'}
                  </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
