import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { getDaysSinceStart } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { DashboardController } from '@/components/dashboard/DashboardController'
import { getMealPlanForDay } from '@/data/mealPlans'
import { getWorkoutForDay } from '@/data/plans'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const userId = user.id
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayOfWeek = today.getDay()
  const todayStr = today.toISOString()
  
  // Progress Date Range
  const progressStart = startOfDay(subDays(new Date(), 90))
  const progressEnd = endOfDay(new Date())

  // Execute all queries in parallel
  const [
    profile, 
    dailyLog, 
    todayMeals, 
    workoutSession, 
    progressDailyLogs, 
    progressMeals
  ] = await Promise.all([
    // 1. Profile
    prisma.userProfile.findUnique({ where: { userId } }),
    // 2. Today's Log (for Home & Workout)
    prisma.dailyLog.findUnique({
      where: { userId_date: { userId, date: today } },
      include: {
        waterEntries: true, sleepEntry: true, weightEntry: true, checklistItems: true
      }
    }),
    // 3. Today's Meals (for Home & Diet)
    prisma.mealLog.findMany({
      where: { userId, date: today },
      include: { entries: true }
    }),
    // 4. Today's Workout Session (for Workout)
    prisma.workoutSession.findUnique({
      where: { userId_date: { userId, date: today } },
      include: {
        exerciseLogs: {
          include: { sets: { orderBy: { setNumber: 'asc' } } },
          orderBy: { exerciseOrder: 'asc' }
        }
      }
    }),
    // 5. 90-Day Logs (for Progress)
    prisma.dailyLog.findMany({
      where: { userId, date: { gte: progressStart, lte: progressEnd } },
      include: { weightEntry: true, waterEntries: true, sleepEntry: true, checklistItems: true }
    }),
    // 6. 90-Day Meals (for Progress)
    prisma.mealLog.findMany({
      where: { userId, date: { gte: progressStart, lte: progressEnd } },
      include: { entries: true }
    })
  ])

  if (!profile) redirect('/onboarding')
  const dayCount = getDaysSinceStart(profile.startDate)

  // -------------------------
  // Compute HOME Data
  // -------------------------
  let totalCalories = 0, totalProtein = 0, mealsCompleted = 0
  todayMeals.forEach((meal: any) => {
    if (meal.completed) mealsCompleted++
    meal.entries.forEach((e: any) => { totalCalories += e.calories; totalProtein += e.proteinG })
  })
  
  const waterMl = dailyLog?.waterEntries.reduce((acc: number, curr: any) => acc + curr.amountMl, 0) ?? 0
  const completionItems = [
    mealsCompleted > 0,
    waterMl >= (profile.waterTargetMl ?? 3500) * 0.5,
    dailyLog?.gymCompleted ?? false,
    (dailyLog?.steps ?? 0) >= (profile.stepTarget ?? 10000) * 0.5,
  ]
  const completionPct = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100)

  const dashboardData = {
    calories: Math.round(totalCalories), protein: Math.round(totalProtein),
    waterMl, steps: dailyLog?.steps ?? 0, sleepMin: dailyLog?.sleepEntry?.durationMin ?? 0,
    gymCompleted: dailyLog?.gymCompleted ?? false, mealsCompleted, totalMeals: Math.max(6, todayMeals.length),
    currentWeight: dailyLog?.weightEntry?.weightKg ?? profile.startingWeight,
    waterEntries: dailyLog?.waterEntries ?? [], checklistItems: dailyLog?.checklistItems ?? [],
  }

  // -------------------------
  // Compute DIET Data
  // -------------------------
  const plan = getMealPlanForDay(dayOfWeek)
  const initialMeals = todayMeals.filter((m: any) => m.completed).map((m: any) => m.mealKey)

  // -------------------------
  // Compute WORKOUT Data
  // -------------------------
  const workoutDaysConfig = getWorkoutForDay(dayOfWeek)
  const isRestDay = workoutDaysConfig.dayType === 'REST'
  
  let initialWorkoutData = undefined
  if (workoutSession) {
    initialWorkoutData = {
      totalVolume: workoutSession.totalVolume || 0,
      exercises: workoutSession.exerciseLogs.map((log: any) => ({
        name: log.exerciseName, expanded: false,
        sets: log.sets.map((s: any) => ({ setNumber: s.setNumber, reps: s.reps, weightKg: s.weightKg }))
      }))
    }
  }

  // Prev session data for empty sets prefill
  const prevSession: Record<string, { setNumber: number, reps: number, weightKg: number }[]> = {}
  if (!initialWorkoutData && !isRestDay) {
    for (const ex of workoutDaysConfig.exercises) {
      const prevLog = await prisma.exerciseLog.findFirst({
        where: { workoutSession: { userId, date: { lt: today } }, exerciseName: ex.name },
        orderBy: { workoutSession: { date: 'desc' } },
        include: { sets: { orderBy: { setNumber: 'asc' } } }
      })
      if (prevLog) prevSession[ex.name] = prevLog.sets.map((s: any) => ({ setNumber: s.setNumber, reps: s.reps, weightKg: s.weightKg }))
    }
  }

  // -------------------------
  // Compute PROGRESS Data
  // -------------------------
  const historyMap = new Map<string, any>()
  for (let i = 0; i <= 90; i++) {
    const d = format(subDays(new Date(), i), 'yyyy-MM-dd')
    historyMap.set(d, { weight: null, calories: 0, protein: 0, steps: 0, waterMl: 0, sleepMin: 0, gymCompleted: false, checklistCompleted: 0, mealsCompleted: 0 })
  }
  progressDailyLogs.forEach((log: any) => {
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
  progressMeals.forEach((meal: any) => {
    const d = format(meal.date, 'yyyy-MM-dd')
    const existing = historyMap.get(d)
    if (existing) {
      existing.calories += meal.entries.reduce((sum: number, e: any) => sum + e.calories, 0)
      existing.protein += meal.entries.reduce((sum: number, e: any) => sum + e.proteinG, 0)
      if (meal.completed) existing.mealsCompleted += 1
    }
  })
  const historyData = Array.from(historyMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <DashboardController
      todayData={dashboardData as any}
      profile={profile}
      dayCount={dayCount}
      completionPct={completionPct}
      plan={plan}
      dayOfWeek={dayOfWeek}
      initialMeals={initialMeals}
      todayObj={todayStr}
      workoutDaysConfig={workoutDaysConfig}
      isRestDay={isRestDay}
      prevSession={prevSession}
      initialWorkoutData={initialWorkoutData}
      historyData={historyData}
    />
  )
}

