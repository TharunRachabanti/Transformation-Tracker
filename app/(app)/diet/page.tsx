import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { DietClient } from './DietClient'
import { getMealPlanForDay } from '@/data/mealPlans'

export default async function DietPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  // 1. Fetch user profile for targets
  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  })
  if (!profile) redirect('/onboarding')

  // 2. Determine Day of Week & Plan
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayOfWeek = new Date().getDay()
  const plan = getMealPlanForDay(dayOfWeek)

  // 3. Fetch completed meals for today
  const mealLogs = await prisma.mealLog.findMany({
    where: {
      userId: user.id,
      date: today,
      completed: true,
    }
  })
  const initialMeals = mealLogs.map((m) => m.mealKey)

  return (
    <DietClient
      plan={plan}
      dayOfWeek={dayOfWeek}
      initialMeals={initialMeals}
      targetCalories={profile.calorieTartet || 2200}
      targetProtein={profile.proteinTargetG || 150}
    />
  )
}
