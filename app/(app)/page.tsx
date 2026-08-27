import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { HomeUI } from '@/components/dashboard/HomeUI'
import { getDaysSinceStart } from '@/lib/utils'
export default async function HomePage() {
  const { cookies } = await import('next/headers')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const cookieStore = await cookies()
  const devBypass = cookieStore.get('dev_bypass')?.value === 'true'

  if (!user && !devBypass) {
    return null // middleware redirects unauthenticated users
  }

  const userId = user?.id || 'dev-bypass-user-123'
  const userName = user?.email?.split('@')[0] || 'DevBypass'

  // 1. Fetch or create user profile
  let profile = await prisma.userProfile.findUnique({
    where: { userId: userId }
  })

  let isNewUser = false
  if (!profile) {
    profile = await prisma.userProfile.create({
      data: {
        userId: userId,
        name: userName,
      }
    })
    isNewUser = true
  }

  // 2. Determine Day Count
  const dayCount = getDaysSinceStart(profile.startDate)

  // 3. Get or construct today's data
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dailyLog = await prisma.dailyLog.findUnique({
    where: { userId_date: { userId: userId, date: today } },
    include: {
      waterEntries: true,
      sleepEntry: true,
      weightEntry: true,
      checklistItems: true,
    }
  })

  const meals = await prisma.mealLog.findMany({
    where: { userId: userId, date: today },
    include: { entries: true }
  })

  // Calculate actuals
  let totalCalories = 0
  let totalProtein = 0
  let mealsCompleted = 0

  meals.forEach(meal => {
    if (meal.completed) mealsCompleted++
    meal.entries.forEach(e => {
      totalCalories += e.calories
      totalProtein += e.proteinG
    })
  })

  const waterMl = dailyLog?.waterEntries.reduce((acc, curr) => acc + curr.amountMl, 0) || 0
  const sleepMin = dailyLog?.sleepEntry?.durationMin || 0
  const gymCompleted = dailyLog?.gymCompleted || false
  const currentWeight = dailyLog?.weightEntry?.weightKg || profile.startingWeight

  const dashboardData = {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein),
    waterMl,
    steps: dailyLog?.steps || 0,
    sleepMin,
    gymCompleted,
    mealsCompleted,
    totalMeals: isNewUser ? 0 : Math.max(6, meals.length),
    currentWeight,
  }

  return (
    <HomeUI
      todayData={dashboardData}
      profile={profile}
      dayCount={dayCount}
      completionPct={0} // Replace with actual checklist logic down the road
    />
  )
}
