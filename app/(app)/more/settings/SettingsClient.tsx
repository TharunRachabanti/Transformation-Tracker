'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { updateSettings } from '../actions'

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

export function SettingsClient({ initialSettings }: { initialSettings: SettingsState }) {
  const [settings, setSettings] = useState<SettingsState>({
    calorieTartet: initialSettings.calorieTartet || 2200,
    proteinTargetG: initialSettings.proteinTargetG || 150,
    waterTargetMl: initialSettings.waterTargetMl || 3500,
    stepTarget: initialSettings.stepTarget || 10000,
    sleepTargetH: initialSettings.sleepTargetH || 8,
    wakeUpTime: initialSettings.wakeUpTime || '07:00',
    bedTime: initialSettings.bedTime || '23:00',
    startingWeight: initialSettings.startingWeight || 80,
    targetWeight: initialSettings.targetWeight || 75,
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  function update(key: keyof SettingsState, value: number | string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await updateSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
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
    <div className="space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <Link href="/more" className="w-10 h-10 rounded-xl bg-[#0c1528] border border-[#1a2550] text-[#60a5fa] flex items-center justify-center hover:bg-[#141e40] hover:text-white transition-colors shrink-0 shadow-lg shadow-[#60a5fa]/5">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Configure your personal targets</p>
        </div>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="glass rounded-2xl p-4 space-y-4 border border-[#1a2550]">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>{section.icon}</span> {section.title}
          </h2>
          {section.fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{field.label}</label>
              <div className="relative">
                <input
                  type={field.type}
                  inputMode={field.type === 'number' ? 'decimal' : undefined}
                  value={settings[field.key]}
                  onChange={(e) => update(field.key, field.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                  min={field.min || undefined}
                  max={field.max || undefined}
                  step={field.key === 'sleepTargetH' ? 0.5 : 1}
                  className="w-full bg-[#0c1528] border border-[#1a2550] hover:border-[#2a3a72] focus:border-[#4f7cff]/60 focus:ring-1 focus:ring-[#4f7cff]/20 rounded-xl px-4 py-3 text-sm text-white transition-all"
                  style={{ paddingRight: field.unit ? '3.5rem' : undefined }}
                />
                {field.unit && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">{field.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      ))}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3"
        >
          <span className="text-emerald-400 text-xs mt-0.5">✓</span>
          <p className="text-emerald-400 text-xs font-medium">Settings saved successfully!</p>
        </motion.div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-gradient-to-r from-[#4f7cff] to-[#9b6dff] hover:from-[#5f8aff] hover:to-[#a87bff] text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4f7cff]/20 disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : 'Save All Settings'}
      </button>

      <p className="text-center text-[10px] text-slate-600">
        Settings are saved to your account and synced across devices
      </p>
    </div>
  )
}
