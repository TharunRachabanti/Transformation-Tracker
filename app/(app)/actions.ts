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

  // Ensure daily log exists
  const dailyLog = await prisma.dailyLog.upsert({
    where: { userId_date: { userId: user.id, date: dateNoTime } },
    create: { userId: user.id, date: dateNoTime },
    update: {}
  })

  // Insert entry
  await prisma.waterEntry.create({
    data: {
      userId: user.id,
      dailyLogId: dailyLog.id,
      amountMl,
    }
  })

  revalidatePath('/')
  return { success: true }
}

export async function deleteWaterEntry(date: Date, entryId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await prisma.waterEntry.delete({
    where: { id: entryId }
  })

  revalidatePath('/')
  return { success: true }
}

export async function toggleChecklistItem(date: Date, itemKey: string, label: string, completed: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const dateNoTime = new Date(date)
  dateNoTime.setHours(0, 0, 0, 0)

  // Ensure daily log exists
  const dailyLog = await prisma.dailyLog.upsert({
    where: { userId_date: { userId: user.id, date: dateNoTime } },
    create: { userId: user.id, date: dateNoTime },
    update: {}
  })

  // Find existing item
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
        userId: user.id,
        dailyLogId: dailyLog.id,
        key: itemKey,
        label,
        completed,
        completedAt: completed ? new Date() : null
      }
    })
  }

  revalidatePath('/')
  return { success: true }
}
