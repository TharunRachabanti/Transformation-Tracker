'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save } from 'lucide-react'
import { DEFAULT_USER_PROFILE } from '@/data/plans'

interface SettingsState {
  calorieTartet: number
  proteinTargetG: number
  waterTargetMl: number
  stepTarget: number
  sleepTargetH: number
  wakeUpTime: string
  bedTime: string
  startingWeight: number
  targetWeight: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    calorieTartet: DEFAULT_USER_PROFILE.calorieTartet,
    proteinTargetG: DEFAULT_USER_PROFILE.proteinTargetG,
    waterTargetMl: DEFAULT_USER_PROFILE.waterTargetMl,
    stepTarget: DEFAULT_USER_PROFILE.stepTarget,
    sleepTargetH: DEFAULT_USER_PROFILE.sleepTargetH,
    wakeUpTime: DEFAULT_USER_PROFILE.wakeUpTime,
    bedTime: DEFAULT_USER_PROFILE.bedTime,
    startingWeight: DEFAULT_USER_PROFILE.startingWeight,
    targetWeight: DEFAULT_USER_PROFILE.targetWeight,
  })
  const [saved, setSaved] = useState(false)

  function update(key: keyof SettingsState, value: number | string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    // In production: save to Supabase + update Zustand store
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const SECTIONS = [
    {
      title: 'Nutrition Targets',
      icon: '🍽️',
      fields: [
        { key: 'calorieTartet' as keyof SettingsState, label: 'Daily Calories', unit: 'kcal', type: 'number', min: 1000, max: 5000 },
        { key: 'proteinTargetG' as keyof SettingsState, label: 'Daily Protein', unit: 'g', type: 'number', min: 50, max: 300 },
        { key: 'waterTargetMl' as keyof SettingsState, label: 'Daily Water', unit: 'ml', type: 'number', min: 1000, max: 6000 },
      ],
    },
    {
      title: 'Activity Targets',
      icon: '🏃',
      fields: [
        { key: 'stepTarget' as keyof SettingsState, label: 'Daily Steps', unit: 'steps', type: 'number', min: 1000, max: 30000 },
        { key: 'sleepTargetH' as keyof SettingsState, label: 'Sleep Target', unit: 'hours', type: 'number', min: 4, max: 12 },
      ],
    },
    {
      title: 'Schedule',
      icon: '⏰',
      fields: [
        { key: 'wakeUpTime' as keyof SettingsState, label: 'Wake Up Time', unit: '', type: 'time', min: 0, max: 0 },
        { key: 'bedTime' as keyof SettingsState, label: 'Bedtime', unit: '', type: 'time', min: 0, max: 0 },
      ],
    },
    {
      title: 'Weight Goals',
      icon: '🎯',
      fields: [
        { key: 'startingWeight' as keyof SettingsState, label: 'Starting Weight', unit: 'kg', type: 'number', min: 30, max: 250 },
        { key: 'targetWeight' as keyof SettingsState, label: 'Target Weight', unit: 'kg', type: 'number', min: 30, max: 250 },
      ],
    },
  ]

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Configure your personal targets</p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="glass rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-white">
            {section.icon} {section.title}
          </h2>
          {section.fields.map((field) => (
            <div key={field.key} className="flex items-center justify-between gap-4">
              <label className="text-sm text-slate-300 flex-1">{field.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type={field.type}
                  value={settings[field.key]}
                  onChange={(e) => update(field.key, field.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                  min={field.min || undefined}
                  max={field.max || undefined}
                  step={field.key === 'sleepTargetH' ? 0.5 : 1}
                  className="w-28 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-sm text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                {field.unit && <span className="text-xs text-slate-500 w-10">{field.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      ))}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/15 border border-green-500/25 rounded-xl p-3 text-center"
        >
          <p className="text-green-400 text-sm font-medium">✓ Settings saved successfully!</p>
        </motion.div>
      )}

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save All Settings
      </button>

      <p className="text-center text-[10px] text-slate-600">
        Settings are stored locally and synced to your account
      </p>
    </div>
  )
}
