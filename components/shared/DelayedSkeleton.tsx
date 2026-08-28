'use client'

import { useState, useEffect } from 'react'

export function DelayedSkeleton({ children, delayMs = 250 }: { children: React.ReactNode, delayMs?: number }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, delayMs)

    return () => clearTimeout(timer)
  }, [delayMs])

  if (!show) return null

  return <>{children}</>
}
