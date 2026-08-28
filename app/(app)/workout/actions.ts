'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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

  // Start Transaction
  await prisma.$transaction(async (tx) => {
    // 1. Create or Update Session
    const session = await tx.workoutSession.upsert({
      where: { userId_date: { userId: user.id, date: dateNoTime } },
      create: { 
        userId: user.id, 
        date: dateNoTime, 
        dayType, 
        completed: true,
        totalVolume,
        finishedAt: new Date()
      },
      update: { 
        completed: true,
        totalVolume,
        finishedAt: new Date()
      },
    })

    // 2. Delete existing exercise logs for this session (clean state)
    await tx.exerciseLog.deleteMany({
      where: { workoutSessionId: session.id }
    })

    // 3. Insert new exercises and their sets
    for (let i = 0; i < exercises.length; i++) {
      const ex = exercises[i]
      if (ex.sets.length === 0) continue

      const log = await tx.exerciseLog.create({
        data: {
          workoutSessionId: session.id,
          exerciseName: ex.name,
          exerciseOrder: i,
        }
      })

      await tx.exerciseSet.createMany({
        data: ex.sets.map(s => ({
          exerciseLogId: log.id,
          setNumber: s.setNumber,
          reps: s.reps,
          weightKg: s.weightKg,
        }))
      })
    }
    
    // 4. Update the daily log summary gymCompleted status
    await tx.dailyLog.upsert({
      where: { userId_date: { userId: user.id, date: dateNoTime } },
      create: { userId: user.id, date: dateNoTime, gymCompleted: true },
      update: { gymCompleted: true }
    })
  })

  revalidatePath('/workout')
  revalidatePath('/')
  return { success: true }
}
