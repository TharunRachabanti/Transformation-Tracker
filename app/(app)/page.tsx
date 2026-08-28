import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { HomeUI } from '@/components/dashboard/HomeUI'
import { getDaysSinceStart } from '@/lib/utils'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Not authenticated → middleware handles the redirect, but just in case:
  if (!user) redirect('/auth')

  const userId = user.id
  const userName = user.email?.split('@')[0] || 'User'

  // 1. Fetch user profile
  const profile = await prisma.userProfile.findUnique({
    where: { userId }
  })

  // 2. New user with no profile → send to onboarding wizard
  if (!profile) {
    redirect('/onboarding')
  }

  // 3. Determine Day Count since start
  const dayCount = getDaysSinceStart(profile.startDate)

  // 4. Get today's logged data
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [dailyLog, meals] = await Promise.all([
    prisma.dailyLog.findUnique({
      where: { userId_date: { userId, date: today } },
      include: {
        waterEntries: true,
        sleepEntry: true,
        weightEntry: true,
        checklistItems: true,
      }
    }),
    prisma.mealLog.findMany({
      where: { userId, date: today },
      include: { entries: true }
    })
  ])

  // 5. Calculate nutritional totals
  let totalCalories = 0
  let totalProtein = 0
  let mealsCompleted = 0

  meals.forEach((meal: { completed: boolean; entries: { calories: number; proteinG: number }[] }) => {
    if (meal.completed) mealsCompleted++
    meal.entries.forEach((e: { calories: number; proteinG: number }) => {
      totalCalories += e.calories
      totalProtein += e.proteinG
    })
  })

  const waterMl = dailyLog?.waterEntries.reduce((acc: number, curr: { amountMl: number }) => acc + curr.amountMl, 0) ?? 0
  const sleepMin = dailyLog?.sleepEntry?.durationMin ?? 0
  const gymCompleted = dailyLog?.gymCompleted ?? false
  const currentWeight = dailyLog?.weightEntry?.weightKg ?? profile.startingWeight

  // 6. Compute completion % (checklist + key daily habits)
  const completionItems = [
    mealsCompleted > 0,
    waterMl >= (profile.waterTargetMl ?? 3500) * 0.5,
    gymCompleted,
    (dailyLog?.steps ?? 0) >= (profile.stepTarget ?? 10000) * 0.5,
  ]
  const completionPct = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  )

  const dashboardData = {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein),
    waterMl,
    steps: dailyLog?.steps ?? 0,
    sleepMin,
    gymCompleted,
    mealsCompleted,
    totalMeals: Math.max(6, meals.length),
    currentWeight: typeof currentWeight === 'number' ? currentWeight : (profile.startingWeight ?? 80),
  }

  return (
    <HomeUI
      todayData={dashboardData}
      profile={profile}
      dayCount={dayCount}
      completionPct={completionPct}
    />
  )
}
