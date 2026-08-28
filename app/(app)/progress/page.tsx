import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { subDays, startOfDay, endOfDay, format } from 'date-fns'
import { ProgressClient } from './ProgressClient'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  // Fetch the profile
  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  })
  if (!profile) redirect('/onboarding')

  // Fetch up to 90 days of history
  const startDate = startOfDay(subDays(new Date(), 90))
  const endDate = endOfDay(new Date())

  // Parallel fetch logs & meals
  const [dailyLogs, meals] = await Promise.all([
    prisma.dailyLog.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate }
      },
      include: { 
        weightEntry: true,
        waterEntries: true,
        sleepEntry: true,
        checklistItems: true,
      }
    }),
    prisma.mealLog.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate }
      },
      include: { entries: true }
    })
  ])

  // Aggregate data by date
  const historyMap = new Map<string, { weight: number | null; calories: number; protein: number; steps: number; waterMl: number; sleepMin: number; gymCompleted: boolean; checklistCompleted: number; mealsCompleted: number }>()

  // Initialize map for all dates in range with default 0s
  for (let i = 0; i <= 90; i++) {
    const d = format(subDays(new Date(), i), 'yyyy-MM-dd')
    historyMap.set(d, { weight: null, calories: 0, protein: 0, steps: 0, waterMl: 0, sleepMin: 0, gymCompleted: false, checklistCompleted: 0, mealsCompleted: 0 })
  }

  // Populate actual data
  dailyLogs.forEach((log: any) => {
    const d = format(log.date, 'yyyy-MM-dd')
    const existing = historyMap.get(d)
    if (existing) {
      existing.weight = log.weightEntry?.weightKg ?? null
      existing.steps = log.steps ?? 0
      existing.waterMl = log.waterEntries.reduce((sum: number, e: any) => sum + e.amountMl, 0)
      existing.sleepMin = log.sleepEntry?.durationMin ?? 0
      existing.gymCompleted = log.gymCompleted
      existing.checklistCompleted = log.checklistItems.filter((i: any) => i.completed).length
    }
  })

  meals.forEach((meal: any) => {
    const d = format(meal.date, 'yyyy-MM-dd')
    const existing = historyMap.get(d)
    if (existing) {
      const mealCals = meal.entries.reduce((sum: number, e: any) => sum + e.calories, 0)
      const mealProtein = meal.entries.reduce((sum: number, e: any) => sum + e.proteinG, 0)
      existing.calories += mealCals
      existing.protein += mealProtein
      if (meal.completed) existing.mealsCompleted += 1
    }
  })

  // Convert map to array sorted by date ASC
  const historyData = Array.from(historyMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <ProgressClient 
      profile={profile} 
      historyData={historyData} 
    />
  )
}
