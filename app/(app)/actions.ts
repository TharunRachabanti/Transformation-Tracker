'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addWaterEntry(date: Date, amountMl: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const dateNoTime = new Date(date)
  dateNoTime.setHours(0, 0, 0, 0)

  const dailyLog = await prisma.dailyLog.upsert({
    where: { userId_date: { userId: user.id, date: dateNoTime } },
    create: { userId: user.id, date: dateNoTime },
    update: {}
  })

  await prisma.waterEntry.create({
    data: { userId: user.id, dailyLogId: dailyLog.id, amountMl }
  })

  revalidatePath('/')
  return { success: true }
}

export async function deleteWaterEntry(date: Date, entryId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await prisma.waterEntry.delete({ where: { id: entryId } })
  revalidatePath('/')
  return { success: true }
}

export async function toggleChecklistItem(date: Date, itemKey: string, label: string, completed: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const dateNoTime = new Date(date)
  dateNoTime.setHours(0, 0, 0, 0)

  const dailyLog = await prisma.dailyLog.upsert({
    where: { userId_date: { userId: user.id, date: dateNoTime } },
    create: { userId: user.id, date: dateNoTime },
    update: {}
  })

  const existing = await prisma.checklistItem.findFirst({
    where: { dailyLogId: dailyLog.id, key: itemKey }
  })

  if (existing) {
    await prisma.checklistItem.update({
      where: { id: existing.id },
      data: { completed, completedAt: completed ? new Date() : null }
    })
  } else {
    await prisma.checklistItem.create({
      data: {
        userId: user.id, dailyLogId: dailyLog.id, key: itemKey, label,
        completed, completedAt: completed ? new Date() : null
      }
    })
  }

  revalidatePath('/')
  return { success: true }
}

export async function toggleMealComplete(mealKey: string, mealLabel: string, date: Date, completed: boolean, entries: { foodId: string; quantityG: number; calories: number; proteinG: number }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const dateNoTime = new Date(date)
  dateNoTime.setHours(0, 0, 0, 0)

  await prisma.$transaction(async (tx) => {
    const log = await tx.mealLog.upsert({
      where: { userId_date_mealKey: { userId: user.id, date: dateNoTime, mealKey } },
      create: { userId: user.id, date: dateNoTime, mealKey, mealLabel, completed },
      update: { mealLabel, completed },
    })

    await tx.mealEntry.deleteMany({ where: { mealLogId: log.id } })

    if (completed && entries.length > 0) {
      await tx.mealEntry.createMany({
        data: entries.map(e => ({
          mealLogId: log.id, foodItemId: e.foodId, quantityG: e.quantityG,
          calories: e.calories, proteinG: e.proteinG, carbsG: 0, fatG: 0,
        }))
      })
    }
  })

  revalidatePath('/')
  return { success: true }
}

interface SetLog {
  setNumber: number
  reps: number
  weightKg: number
}

interface ExerciseLogState {
  name: string
  sets: SetLog[]
}

export async function finishWorkout(date: Date, dayType: string, exercises: ExerciseLogState[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const dateNoTime = new Date(date)
  dateNoTime.setHours(0, 0, 0, 0)

  const totalVolume = exercises.reduce((acc, ex) => 
    acc + ex.sets.reduce((s, set) => s + set.weightKg * set.reps, 0)
  , 0)

  await prisma.$transaction(async (tx) => {
    const session = await tx.workoutSession.upsert({
      where: { userId_date: { userId: user.id, date: dateNoTime } },
      create: { 
        userId: user.id, date: dateNoTime, dayType, 
        completed: true, totalVolume, finishedAt: new Date()
      },
      update: { completed: true, totalVolume, finishedAt: new Date() },
    })

    await tx.exerciseLog.deleteMany({ where: { workoutSessionId: session.id } })

    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i]
      if (ex.sets.length === 0) continue

      const log = await tx.exerciseLog.create({
        data: { workoutSessionId: session.id, exerciseName: ex.name, exerciseOrder: i }
      })

      await tx.exerciseSet.createMany({
        data: ex.sets.map(s => ({
          exerciseLogId: log.id, setNumber: s.setNumber,
          reps: s.reps, weightKg: s.weightKg,
        }))
      })
    }
    
    await tx.dailyLog.upsert({
      where: { userId_date: { userId: user.id, date: dateNoTime } },
      create: { userId: user.id, date: dateNoTime, gymCompleted: true },
      update: { gymCompleted: true }
    })
  })

  revalidatePath('/')
  return { success: true }
}
