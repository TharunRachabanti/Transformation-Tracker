'use client'

import { motion } from 'framer-motion'

interface MacroRingProps {
  value: number
  max: number
  label: string
  unit: string
  color: string
  size?: number
}

export function MacroRing({ value, max, label, unit, color, size = 80 }: MacroRingProps) {
  const pct = Math.min(100, (value / max) * 100)
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#1e293b" strokeWidth="6"
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-white">{Math.round(pct)}%</span>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 text-center">{label}</p>
      <p className="text-[10px] text-slate-500">
        {value}/{max} {unit}
      </p>
    </div>
  )
}
