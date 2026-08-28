'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max: number
  color?: 'blue' | 'green' | 'orange' | 'cyan' | 'violet' | 'red'
  showLabel?: boolean
  height?: 'sm' | 'md' | 'lg'
  className?: string
}

const colorMap: Record<string, string> = {
  blue: 'bg-[#748C70]',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  cyan: 'bg-cyan-500',
  violet: 'bg-violet-500',
  red: 'bg-red-500',
}

const heightMap: Record<string, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
}

export function ProgressBar({
  value, max, color = 'blue', showLabel = true, height = 'md', className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-400">{pct.toFixed(0)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-slate-800 rounded-full overflow-hidden', heightMap[height])}>
        <motion.div
          className={cn('h-full rounded-full', colorMap[color])}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
