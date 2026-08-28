'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Save, LogOut, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { WEIGHT_MILESTONES } from '@/data/plans'
import { getDaysSinceStart } from '@/lib/utils'
import { updateProfile, signOutUser } from '../actions'

export function ProfileClient({ initialProfile }: { initialProfile: any }) {
  const [profile, setProfile] = useState({
    name: initialProfile.name,
    age: initialProfile.age || 25,
    heightCm: initialProfile.heightCm || 175,
    startDate: initialProfile.startDate || new Date(),
    gymDaysPerWeek: initialProfile.gymDaysPerWeek || 4,
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const dayCount = getDaysSinceStart(new Date(profile.startDate))

  async function handleSave() {
    setSaving(true)
    try {
      await updateProfile({
        name: profile.name,
        age: profile.age,
        heightCm: profile.heightCm,
        gymDaysPerWeek: profile.gymDaysPerWeek,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await signOutUser()
    window.location.href = '/auth'
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/more" className="w-10 h-10 rounded-xl bg-[#161c16] border border-[#232b21] text-[#8CA488] flex items-center justify-center hover:bg-[#1b241b] hover:text-white transition-colors shrink-0 shadow-lg shadow-[#8CA488]/5">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Day #{dayCount} of your transformation</p>
        </div>
      </div>

      {/* Avatar */}
      <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#748C70] to-[#C2A878] flex items-center justify-center shadow-lg shadow-[#748C70]/20">
          <span className="text-3xl font-bold text-white">{profile.name.charAt(0).toUpperCase()}</span>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{profile.name}</h2>
          <p className="text-sm text-[#748C70] mt-0.5 font-medium">Transformation Day #{dayCount}</p>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4 text-center w-full bg-[#161c16]/60 rounded-2xl p-4 border border-[#232b21]">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Age</p>
            <p className="text-lg font-bold text-white">{profile.age}</p>
          </div>
          <div className="border-x border-[#232b21]">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Height</p>
            <p className="text-lg font-bold text-white">{profile.heightCm} <span className="text-[10px] text-slate-500 font-normal">cm</span></p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mb-1">Gym</p>
            <p className="text-lg font-bold text-white">{profile.gymDaysPerWeek}<span className="text-[10px] text-slate-500 font-normal">×/wk</span></p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="glass rounded-2xl p-4 space-y-3 border border-[#232b21]">
        <h2 className="text-sm font-semibold text-white mb-4">Edit Profile</h2>
        {[
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'age', label: 'Age', type: 'number' },
          { key: 'heightCm', label: 'Height (cm)', type: 'number' },
          { key: 'gymDaysPerWeek', label: 'Gym Days/Week', type: 'number' },
        ].map((field) => (
          <div key={field.key} className="relative">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5 block">{field.label}</label>
            <input
              type={field.type}
              inputMode={field.type === 'number' ? 'decimal' : undefined}
              value={(profile as any)[field.key]}
              onChange={(e) => setProfile((p) => ({ ...p, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
              className="w-full bg-[#161c16] border border-[#232b21] hover:border-[#2f402c] focus:border-[#748C70]/60 focus:ring-1 focus:ring-[#748C70]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 transition-all"
            />
          </div>
        ))}

        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2.5 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3 mt-2"
          >
            <span className="text-emerald-400 text-xs mt-0.5">✓</span>
            <p className="text-emerald-400 text-xs font-medium">Profile saved successfully</p>
          </motion.div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-4 bg-gradient-to-r from-[#748C70] to-[#C2A878] hover:from-[#839c7f] hover:to-[#d1b787] text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#748C70]/20 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-400 border border-red-500/20 bg-red-500/5 py-4 rounded-2xl text-sm font-semibold hover:bg-red-500/10 transition-all">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  )
}
