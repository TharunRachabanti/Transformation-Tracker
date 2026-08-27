import { WorkoutDayConfig, WorkoutDayType, HabitConfig } from '@/types'

// ─────────────────────────────────────────
// 6-DAY WORKOUT PLAN
// ─────────────────────────────────────────
export const WORKOUT_SCHEDULE: Record<number, WorkoutDayType> = {
  0: 'REST',        // Sunday
  1: 'UPPER_A',     // Monday
  2: 'LOWER_A',     // Tuesday
  3: 'CARDIO_CORE', // Wednesday
  4: 'UPPER_B',     // Thursday
  5: 'LOWER_B',     // Friday
  6: 'CARDIO_CORE', // Saturday
}

export const WORKOUT_CONFIGS: WorkoutDayConfig[] = [
  {
    dayType: 'UPPER_A',
    label: 'Upper Body A',
    exercises: [
      { name: 'Bench Press', defaultSets: 3, defaultReps: 10 },
      { name: 'Lat Pulldown', defaultSets: 3, defaultReps: 12 },
      { name: 'Seated Cable Row', defaultSets: 3, defaultReps: 12 },
      { name: 'Incline Dumbbell Press', defaultSets: 3, defaultReps: 10 },
      { name: 'Shoulder Press', defaultSets: 3, defaultReps: 10 },
      { name: 'Lateral Raises', defaultSets: 3, defaultReps: 15 },
      { name: 'Biceps Curl', defaultSets: 3, defaultReps: 12 },
      { name: 'Triceps Pushdown', defaultSets: 3, defaultReps: 12 },
    ],
  },
  {
    dayType: 'LOWER_A',
    label: 'Lower Body A',
    exercises: [
      { name: 'Leg Press', defaultSets: 4, defaultReps: 12 },
      { name: 'Romanian Deadlift', defaultSets: 3, defaultReps: 10 },
      { name: 'Leg Extension', defaultSets: 3, defaultReps: 12 },
      { name: 'Leg Curl', defaultSets: 3, defaultReps: 12 },
      { name: 'Calf Raise', defaultSets: 4, defaultReps: 15 },
      { name: 'Plank', defaultSets: 3, defaultReps: 1, notes: 'Hold 30–60s' },
    ],
  },
  {
    dayType: 'CARDIO_CORE',
    label: 'Cardio + Core',
    exercises: [
      { name: 'Treadmill / Cycle', defaultSets: 1, defaultReps: 1, notes: '30–45 minutes' },
      { name: 'Cable Crunch', defaultSets: 3, defaultReps: 15 },
      { name: 'Reverse Crunch', defaultSets: 3, defaultReps: 15 },
      { name: 'Plank', defaultSets: 3, defaultReps: 1, notes: 'Hold 45–60s' },
    ],
  },
  {
    dayType: 'UPPER_B',
    label: 'Upper Body B',
    exercises: [
      { name: 'Incline Press', defaultSets: 3, defaultReps: 10 },
      { name: 'Lat Pulldown / Pull-up', defaultSets: 3, defaultReps: 10 },
      { name: 'Machine Chest Press', defaultSets: 3, defaultReps: 12 },
      { name: 'Cable Row', defaultSets: 3, defaultReps: 12 },
      { name: 'Shoulder Press', defaultSets: 3, defaultReps: 10 },
      { name: 'Lateral Raises', defaultSets: 3, defaultReps: 15 },
      { name: 'Biceps Curl', defaultSets: 3, defaultReps: 12 },
      { name: 'Triceps Pushdown', defaultSets: 3, defaultReps: 12 },
    ],
  },
  {
    dayType: 'LOWER_B',
    label: 'Lower Body B',
    exercises: [
      { name: 'Squat / Hack Squat', defaultSets: 4, defaultReps: 10 },
      { name: 'Romanian Deadlift', defaultSets: 3, defaultReps: 10 },
      { name: 'Leg Press', defaultSets: 3, defaultReps: 12 },
      { name: 'Leg Curl', defaultSets: 3, defaultReps: 12 },
      { name: 'Leg Extension', defaultSets: 3, defaultReps: 12 },
      { name: 'Calf Raise', defaultSets: 4, defaultReps: 15 },
      { name: 'Hanging Knee Raise', defaultSets: 3, defaultReps: 12 },
    ],
  },
  {
    dayType: 'REST',
    label: 'Rest Day',
    exercises: [],
  },
]

export function getWorkoutForDay(dayOfWeek: number): WorkoutDayConfig {
  const dayType = WORKOUT_SCHEDULE[dayOfWeek]
  return WORKOUT_CONFIGS.find((w) => w.dayType === dayType) ?? WORKOUT_CONFIGS.find((w) => w.dayType === 'REST')!
}

// ─────────────────────────────────────────
// HABIT CONFIGURATION
// ─────────────────────────────────────────
export const HABITS: HabitConfig[] = [
  { key: 'gym', label: 'Gym / Workout', icon: '💪', category: 'fitness' },
  { key: 'diet', label: 'Followed Diet', icon: '🥗', category: 'diet' },
  { key: 'protein_target', label: 'Protein Target', icon: '🍗', category: 'diet' },
  { key: 'water_target', label: 'Water Target', icon: '💧', category: 'fitness' },
  { key: 'steps', label: 'Steps Target', icon: '👟', category: 'fitness' },
  { key: 'sleep', label: 'Sleep Target', icon: '😴', category: 'lifestyle' },
  { key: 'no_smoking', label: 'No Smoking', icon: '🚭', category: 'lifestyle' },
  { key: 'no_alcohol', label: 'No Alcohol', icon: '🚫', category: 'lifestyle' },
  { key: 'no_junk', label: 'No Junk Food', icon: '🍎', category: 'lifestyle' },
]

// ─────────────────────────────────────────
// DAILY CHECKLIST TEMPLATE
// ─────────────────────────────────────────
export const CHECKLIST_TEMPLATE = [
  { key: 'wake_up', label: 'Wake Up (6:00 AM)', sortOrder: 0 },
  { key: 'pre_workout', label: 'Pre-Workout Meal', sortOrder: 1 },
  { key: 'gym', label: 'Gym / Workout', sortOrder: 2 },
  { key: 'breakfast', label: 'Breakfast (8:30 AM)', sortOrder: 3 },
  { key: 'meal_11am', label: '11 AM Meal', sortOrder: 4 },
  { key: 'lunch', label: 'Lunch (1:30 PM)', sortOrder: 5 },
  { key: 'meal_430pm', label: '4:30 PM Meal', sortOrder: 6 },
  { key: 'dinner', label: 'Dinner (7:30 PM)', sortOrder: 7 },
  { key: 'water_target', label: 'Water Target (3.5 L)', sortOrder: 8 },
  { key: 'steps_target', label: 'Steps Target (10k)', sortOrder: 9 },
  { key: 'protein_target', label: 'Protein Target (160g)', sortOrder: 10 },
  { key: 'no_junk_food', label: 'No Junk Food', sortOrder: 11 },
  { key: 'no_smoking', label: 'No Smoking', sortOrder: 12 },
  { key: 'no_alcohol', label: 'No Alcohol', sortOrder: 13 },
  { key: 'sleep_target', label: 'Sleep Target (7–9h)', sortOrder: 14 },
]

// Weight milestones
export const WEIGHT_MILESTONES = [
  { weightKg: 96, label: 'Start' },
  { weightKg: 90, label: 'Milestone 1' },
  { weightKg: 85, label: 'Milestone 2' },
  { weightKg: 81, label: 'Goal (80–82 kg)' },
]

// Default user profile values
export const DEFAULT_USER_PROFILE = {
  name: 'Tharun',
  age: 25,
  heightCm: 178,
  startingWeight: 96,
  targetWeight: 81,
  calorieTartet: 2300,
  proteinTargetG: 160,
  waterTargetMl: 3500,
  stepTarget: 10000,
  sleepTargetH: 8,
  wakeUpTime: '06:00',
  bedTime: '23:00',
  gymDaysPerWeek: 6,
}

// Transformation Score weights
export const SCORE_WEIGHTS = {
  diet: 20,
  protein: 20,
  workout: 20,
  steps: 15,
  water: 10,
  sleep: 10,
  habits: 5,
}

// Notification reminders
export const DEFAULT_REMINDERS = [
  { time: '06:00', message: 'Good morning! Time for your weight check 🌅', key: 'morning', enabled: true },
  { time: '06:15', message: 'Pre-workout time! Have your banana 🍌', key: 'pre_workout', enabled: true },
  { time: '08:30', message: 'Breakfast time! 🍳', key: 'breakfast', enabled: true },
  { time: '11:00', message: '11 AM meal! Protein salad time 🥗', key: 'meal_11am', enabled: true },
  { time: '13:30', message: 'Lunch time! 🍱', key: 'lunch', enabled: true },
  { time: '16:30', message: 'Snack time! 🥛', key: 'meal_430pm', enabled: true },
  { time: '19:30', message: 'Dinner time! 🍽️', key: 'dinner', enabled: true },
  { time: '22:00', message: 'Start winding down for sleep 😴', key: 'sleep', enabled: true },
]
