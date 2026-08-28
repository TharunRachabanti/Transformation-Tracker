import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SettingsClient } from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) redirect('/onboarding')

  return <SettingsClient initialSettings={profile as any} />
}
