'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: { name: string; age: number; heightCm: number; gymDaysPerWeek: number }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  await prisma.userProfile.update({
    where: { userId: user.id },
    data: {
      name: data.name,
      age: data.age,
      heightCm: data.heightCm,
      gymDaysPerWeek: data.gymDaysPerWeek,
    }
  })

  revalidatePath('/more/profile')
  revalidatePath('/')
  return { success: true }
}

export async function updateSettings(data: {
  calorieTartet: number;
  proteinTargetG: number;
  waterTargetMl: number;
  stepTarget: number;
  sleepTargetH: number;
  wakeUpTime: string;
  bedTime: string;
  startingWeight: number;
  targetWeight: number;
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  await prisma.userProfile.update({
    where: { userId: user.id },
    data
  })

  revalidatePath('/more/settings')
  revalidatePath('/')
  return { success: true }
}

export async function signOutUser() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
