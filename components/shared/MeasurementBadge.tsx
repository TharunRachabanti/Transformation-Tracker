'use client'

import { cn } from '@/lib/utils'

interface MeasurementBadgeProps {
  type: 'RAW' | 'COOKED' | 'AS_SERVED'
  size?: 'xs' | 'sm'
}

const BADGE_CONFIG = {
  RAW: { label: 'RAW', className: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
  COOKED: { label: 'COOKED', className: 'bg-[#748C70]/15 text-[#8CA488] border-[#748C70]/25' },
  AS_SERVED: { label: 'AS SERVED', className: 'bg-green-500/15 text-green-400 border-green-500/25' },
}

export function MeasurementBadge({ type, size = 'xs' }: MeasurementBadgeProps) {
  const config = BADGE_CONFIG[type]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-semibold tracking-wider uppercase',
        size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}
