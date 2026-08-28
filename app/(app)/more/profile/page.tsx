import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id }
  })

  if (!profile) redirect('/onboarding')

  // Prevent next.js RSC Date serialization errors
  const safeProfile = JSON.parse(JSON.stringify(profile))

  return <ProfileClient initialProfile={safeProfile} />
}
