import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays, startOfDay } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, pattern = 'MMM d, yyyy') {
  return format(new Date(date), pattern)
}

export function getDaysSinceStart(startDate: Date | string): number {
  return differenceInDays(startOfDay(new Date()), startOfDay(new Date(startDate))) + 1
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`
}

export function formatWater(ml: number): string {
  if (ml >= 1000) return `${(ml / 1000).toFixed(2)} L`
  return `${ml} ml`
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m > 0 ? `${m}m` : ''}`
}

export function calcProgress(current: number, target: number): number {
  if (target === 0) return 0
  return Math.min(100, Math.round((current / target) * 100))
}

export function calcNutritionFromFoods(
  foods: Array<{
    caloriesPer100g: number
    proteinPer100g: number
    carbsPer100g: number
    fatPer100g: number
    quantityG: number
  }>
) {
  return foods.reduce(
    (acc, food) => {
      const factor = food.quantityG / 100
      acc.calories += food.caloriesPer100g * factor
      acc.proteinG += food.proteinPer100g * factor
      acc.carbsG += food.carbsPer100g * factor
      acc.fatG += food.fatPer100g * factor
      return acc
    },
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  )
}

export function calc7DayAverage(entries: Array<{ date: Date; weightKg: number }>): number | null {
  const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const last7 = sorted.slice(0, 7)
  if (last7.length === 0) return null
  return last7.reduce((sum, e) => sum + e.weightKg, 0) / last7.length
}

export function getTodayKey(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getDayOfWeek(): number {
  return new Date().getDay()
}

export function getDayLabel(dayOfWeek: number): string {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]
}

export function getMeasurementBadgeColor(type: 'RAW' | 'COOKED' | 'AS_SERVED') {
  switch (type) {
    case 'RAW': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'COOKED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'AS_SERVED': return 'bg-green-500/20 text-green-400 border-green-500/30'
  }
}
