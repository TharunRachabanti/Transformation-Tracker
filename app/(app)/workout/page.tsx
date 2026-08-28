import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { getWorkoutForDay } from '@/data/plans'
import { WorkoutClient } from './WorkoutClient'

export default async function WorkoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dayOfWeek = today.getDay()
  const workout = getWorkoutForDay(dayOfWeek)
  const isRestDay = workout.dayType === 'REST'

  // Fetch today's workout if it exists (for resumption)
  const todaySession = await prisma.workoutSession.findUnique({
    where: { userId_date: { userId: user.id, date: today } },
    include: {
      exerciseLogs: {
        include: { sets: { orderBy: { setNumber: 'asc' } } },
        orderBy: { exerciseOrder: 'asc' }
      }
    }
  })

  // Format initialData if today's session exists
  let initialData = undefined
  if (todaySession) {
    initialData = {
      totalVolume: todaySession.totalVolume || 0,
      exercises: todaySession.exerciseLogs.map(log => ({
        name: log.exerciseName,
        expanded: false,
        sets: log.sets.map(s => ({
          setNumber: s.setNumber,
          reps: s.reps,
          weightKg: s.weightKg,
        }))
      }))
    }
  }

  // Fetch previous sets for each exercise in today's plan to prefill the weights
  const prevSession: Record<string, { setNumber: number, reps: number, weightKg: number }[]> = {}
  
  if (!initialData && !isRestDay) {
    // We only need to fetch previous history if we haven't already started today's workout
    for (const ex of workout.exercises) {
      const prevLog = await prisma.exerciseLog.findFirst({
        where: {
          workoutSession: { userId: user.id, date: { lt: today } },
          exerciseName: ex.name,
        },
        orderBy: { workoutSession: { date: 'desc' } },
        include: { sets: { orderBy: { setNumber: 'asc' } } } // getting the sets sequentially
      })
      if (prevLog) {
        prevSession[ex.name] = prevLog.sets.map(s => ({
          setNumber: s.setNumber,
          reps: s.reps,
          weightKg: s.weightKg,
        }))
      }
    }
  }

  return (
    <WorkoutClient
      todayObj={today.toISOString()}
      dayOfWeek={dayOfWeek}
      workout={workout}
      isRestDay={isRestDay}
      prevSession={prevSession}
      initialData={initialData}
    />
  )
}
