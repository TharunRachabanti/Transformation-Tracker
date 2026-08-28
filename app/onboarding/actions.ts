'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export interface OnboardingData {
  name: string
  startingWeight: number
  targetWeight: number
  heightCm: number
  calorieTarget: number
  proteinTargetG: number
  waterTargetMl: number
  stepTarget: number
  gymDaysPerWeek: number
}

export async function saveOnboardingProfile(data: OnboardingData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  try {
    await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        name: data.name || user.email?.split('@')[0] || 'User',
        startingWeight: data.startingWeight,
        targetWeight: data.targetWeight,
        heightCm: data.heightCm || 175,
        calorieTartet: data.calorieTarget,
        proteinTargetG: data.proteinTargetG,
        waterTargetMl: data.waterTargetMl,
        stepTarget: data.stepTarget,
      },
      update: {
        name: data.name || user.email?.split('@')[0] || 'User',
        startingWeight: data.startingWeight,
        targetWeight: data.targetWeight,
        heightCm: data.heightCm || 175,
        calorieTartet: data.calorieTarget,
        proteinTargetG: data.proteinTargetG,
        waterTargetMl: data.waterTargetMl,
        stepTarget: data.stepTarget,
      },
    })
  } catch (e) {
    console.error('Failed to save onboarding profile:', e)
    throw new Error('Failed to save your profile. Please try again.')
  }

  redirect('/')
}
