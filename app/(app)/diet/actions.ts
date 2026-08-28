'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function toggleMealComplete(mealKey: string, mealLabel: string, date: Date, completed: boolean, entries: { foodId: string; quantityG: number; calories: number; proteinG: number }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const dateNoTime = new Date(date)
  dateNoTime.setHours(0, 0, 0, 0)

  // Start Transaction
  await prisma.$transaction(async (tx) => {
    const log = await tx.mealLog.upsert({
      where: { userId_date_mealKey: { userId: user.id, date: dateNoTime, mealKey } },
      create: { userId: user.id, date: dateNoTime, mealKey, mealLabel, completed },
      update: { mealLabel, completed },
    })

    // Delete existing entries
    await tx.mealEntry.deleteMany({
      where: { mealLogId: log.id }
    })

    if (completed && entries.length > 0) {
      await tx.mealEntry.createMany({
        data: entries.map(e => ({
          mealLogId: log.id,
          foodItemId: e.foodId,
          quantityG: e.quantityG,
          calories: e.calories,
          proteinG: e.proteinG,
          carbsG: 0,
          fatG: 0,
        }))
      })
    }
  })

  revalidatePath('/diet')
  revalidatePath('/')
  return { success: true }
}
