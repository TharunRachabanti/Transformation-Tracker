import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile, DailyLog, WaterEntry } from '@/types'
import { DEFAULT_USER_PROFILE } from '@/data/plans'

interface AppState {
  // User
  profile: Partial<UserProfile>
  setProfile: (profile: Partial<UserProfile>) => void

  // Today's quick-access state
  todayWaterMl: number
  waterEntries: WaterEntry[]
  addWater: (ml: number) => void
  removeLastWater: () => void
  resetWater: () => void

  // Steps
  todaySteps: number
  setSteps: (steps: number) => void

  // Theme
  theme: 'dark' | 'light'
  toggleTheme: () => void

  // SPA Navigation
  activeTab: 'home' | 'diet' | 'workout' | 'progress'
  setActiveTab: (tab: 'home' | 'diet' | 'workout' | 'progress') => void

  // startDate
  startDate: string
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: {
        ...DEFAULT_USER_PROFILE,
        startDate: new Date('2025-01-01'),
      },
      setProfile: (profile) => set((s) => ({ profile: { ...s.profile, ...profile } })),

      todayWaterMl: 0,
      waterEntries: [],
      addWater: (ml) =>
        set((s) => ({
          todayWaterMl: s.todayWaterMl + ml,
          waterEntries: [
            ...s.waterEntries,
            {
              id: crypto.randomUUID(),
              userId: '',
              dailyLogId: '',
              amountMl: ml,
              recordedAt: new Date(),
            },
          ],
        })),
      removeLastWater: () =>
        set((s) => {
          const entries = [...s.waterEntries]
          const last = entries.pop()
          return {
            waterEntries: entries,
            todayWaterMl: Math.max(0, s.todayWaterMl - (last?.amountMl ?? 0)),
          }
        }),
      resetWater: () => set({ todayWaterMl: 0, waterEntries: [] }),

      todaySteps: 0,
      setSteps: (steps) => set({ todaySteps: Math.max(0, steps) }),

      theme: 'dark',
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      startDate: '2025-01-01',
    }),
    {
      name: 'transformation-tracker-store',
      partialize: (state) => ({
        profile: state.profile,
        theme: state.theme,
        startDate: state.startDate,
        activeTab: state.activeTab,
      }),
    }
  )
)
