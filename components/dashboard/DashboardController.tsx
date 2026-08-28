'use client'

import { useAppStore } from '@/store/app-store'
import { HomeUI, DashboardData } from './HomeUI'
import { DietClient } from './DietClient'
import { WorkoutClient } from './WorkoutClient'
import { ProgressClient } from './ProgressClient'
import { WorkoutDayConfig } from '@/types'

export interface DashboardControllerProps {
  // Home Data
  todayData: DashboardData
  profile: any
  dayCount: number
  completionPct: number

  // Diet Data
  plan: any
  dayOfWeek: number
  initialMeals: string[]

  // Workout Data
  todayObj: string
  workoutDaysConfig: WorkoutDayConfig
  isRestDay: boolean
  prevSession: Record<string, { setNumber: number, reps: number, weightKg: number }[]>
  initialWorkoutData?: any

  // Progress Data
  historyData: any[]
}

export function DashboardController(props: DashboardControllerProps) {
  const { activeTab } = useAppStore()

  return (
    <>
      <div style={{ display: activeTab === 'home' ? 'block' : 'none' }}>
        <HomeUI
          todayData={props.todayData}
          profile={props.profile}
          dayCount={props.dayCount}
          completionPct={props.completionPct}
        />
      </div>

      <div style={{ display: activeTab === 'diet' ? 'block' : 'none' }}>
        {/* We mount DietClient instantly. display:none keeps it in DOM so 0ms latency! */}
        <DietClient
          plan={props.plan}
          dayOfWeek={props.dayOfWeek}
          initialMeals={props.initialMeals}
          targetCalories={props.profile.calorieTartet || 2200}
          targetProtein={props.profile.proteinTargetG || 150}
        />
      </div>

      <div style={{ display: activeTab === 'workout' ? 'block' : 'none' }}>
        <WorkoutClient
          todayObj={props.todayObj}
          dayOfWeek={props.dayOfWeek}
          workout={props.workoutDaysConfig}
          isRestDay={props.isRestDay}
          prevSession={props.prevSession}
          initialData={props.initialWorkoutData}
        />
      </div>

      <div style={{ display: activeTab === 'progress' ? 'block' : 'none' }}>
        <ProgressClient
          profile={props.profile}
          historyData={props.historyData}
        />
      </div>
    </>
  )
}
