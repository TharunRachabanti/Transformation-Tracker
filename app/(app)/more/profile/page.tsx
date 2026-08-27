'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Save, LogOut } from 'lucide-react'
import { DEFAULT_USER_PROFILE, WEIGHT_MILESTONES } from '@/data/plans'
import { getDaysSinceStart } from '@/lib/utils'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: DEFAULT_USER_PROFILE.name,
    age: DEFAULT_USER_PROFILE.age,
    heightCm: DEFAULT_USER_PROFILE.heightCm,
    startDate: '2025-01-01',
    gymDaysPerWeek: DEFAULT_USER_PROFILE.gymDaysPerWeek,
  })
  const [saved, setSaved] = useState(false)

  const dayCount = getDaysSinceStart(new Date(profile.startDate))

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-sm text-slate-400 mt-0.5">Day #{dayCount} of your transformation</p>
      </div>

      {/* Avatar */}
      <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">{profile.name.charAt(0)}</span>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">{profile.name}</h2>
          <p className="text-sm text-slate-400">Transformation Day #{dayCount}</p>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-2 text-center w-full">
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">Age</p>
            <p className="text-lg font-bold text-white">{profile.age}</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">Height</p>
            <p className="text-lg font-bold text-white">{profile.heightCm} cm</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase tracking-wide">Gym</p>
            <p className="text-lg font-bold text-white">{profile.gymDaysPerWeek}×/wk</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">Edit Profile</h2>
        {[
          { key: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
          { key: 'age', label: 'Age', type: 'number', placeholder: '25' },
          { key: 'heightCm', label: 'Height (cm)', type: 'number', placeholder: '178' },
          { key: 'gymDaysPerWeek', label: 'Gym Days/Week', type: 'number', placeholder: '6' },
          { key: 'startDate', label: 'Transformation Start Date', type: 'date', placeholder: '' },
        ].map((field) => (
          <div key={field.key}>
            <label className="text-xs text-slate-500 mb-1 block">{field.label}</label>
            <input
              type={field.type}
              value={(profile as any)[field.key]}
              placeholder={field.placeholder}
              onChange={(e) => setProfile((p) => ({ ...p, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        ))}

        {saved && <p className="text-green-400 text-sm">✓ Profile saved!</p>}
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Profile
        </button>
      </div>

      {/* Milestones */}
      <div className="glass rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-white">Goal Milestones</h2>
        {WEIGHT_MILESTONES.map((m) => (
          <div key={m.weightKg} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/40 last:border-0">
            <span className="text-slate-300">{m.label}</span>
            <span className="font-medium text-white">{m.weightKg} kg</span>
          </div>
        ))}
      </div>

      {/* Sign Out */}
      <button className="w-full flex items-center justify-center gap-2 text-red-400 border border-red-500/20 bg-red-500/5 py-3 rounded-xl text-sm font-medium hover:bg-red-500/10 transition-all">
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  )
}
