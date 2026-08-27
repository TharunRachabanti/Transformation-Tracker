// ─────────────────────────────────────────
// TYPESCRIPT TYPES & INTERFACES
// ─────────────────────────────────────────

// Measurement type for foods
export type MeasurementType = 'RAW' | 'COOKED' | 'AS_SERVED'

// Photo categories
export type PhotoCategory = 'FRONT' | 'SIDE' | 'BACK' | 'FACE' | 'HAIR'

// Grocery categories
export type GroceryCategory = 'PROTEIN' | 'CARBS' | 'VEGETABLES' | 'FRUITS' | 'DAIRY' | 'OTHER'

// Workout day types
export type WorkoutDayType = 'UPPER_A' | 'LOWER_A' | 'CARDIO_CORE' | 'UPPER_B' | 'LOWER_B' | 'REST'

// ─────────────────────────────────────────
// USER PROFILE
// ─────────────────────────────────────────
export interface UserProfile {
  id: string
  userId: string
  name: string
  age: number
  heightCm: number
  startingWeight: number
  targetWeight: number
  calorieTartet: number
  proteinTargetG: number
  waterTargetMl: number
  stepTarget: number
  sleepTargetH: number
  wakeUpTime: string
  bedTime: string
  gymDaysPerWeek: number
  startDate: Date
  createdAt: Date
  updatedAt: Date
}

// ─────────────────────────────────────────
// NUTRITION
// ─────────────────────────────────────────
export interface Nutrition {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

// ─────────────────────────────────────────
// FOOD ITEM
// ─────────────────────────────────────────
export interface FoodItem {
  id: string
  userId?: string | null
  name: string
  measurementType: MeasurementType
  caloriesPer100g: number
  proteinPer100g: number
  carbsPer100g: number
  fatPer100g: number
  isDefault: boolean
}

export interface FoodItemWithQuantity extends FoodItem {
  quantityG: number
  nutrition: Nutrition
}

// ─────────────────────────────────────────
// DAILY LOG
// ─────────────────────────────────────────
export interface DailyLog {
  id: string
  userId: string
  date: Date
  steps?: number | null
  smokingFree: boolean
  alcoholFree: boolean
  junkFoodFree: boolean
  gymCompleted: boolean
  transformationScore?: number | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface DailyLogWithRelations extends DailyLog {
  checklistItems: ChecklistItem[]
  waterEntries: WaterEntry[]
  sleepEntry?: SleepEntry | null
  weightEntry?: WeightEntry | null
}

// ─────────────────────────────────────────
// CHECKLIST
// ─────────────────────────────────────────
export interface ChecklistItem {
  id: string
  userId: string
  dailyLogId: string
  key: string
  label: string
  completed: boolean
  completedAt?: Date | null
  sortOrder: number
}

export type ChecklistItemKey =
  | 'wake_up'
  | 'pre_workout'
  | 'gym'
  | 'breakfast'
  | 'meal_11am'
  | 'lunch'
  | 'meal_430pm'
  | 'dinner'
  | 'water_target'
  | 'steps_target'
  | 'protein_target'
  | 'no_junk_food'
  | 'no_smoking'
  | 'no_alcohol'
  | 'sleep_target'

// ─────────────────────────────────────────
// WEIGHT
// ─────────────────────────────────────────
export interface WeightEntry {
  id: string
  userId: string
  dailyLogId: string
  weightKg: number
  notes?: string | null
  recordedAt: Date
}

export interface WeightStats {
  startingWeight: number
  currentWeight: number
  totalLost: number
  remaining: number
  sevenDayAverage: number
  weeklyChange: number | null
}

// ─────────────────────────────────────────
// BODY MEASUREMENTS
// ─────────────────────────────────────────
export interface BodyMeasurement {
  id: string
  userId: string
  recordedAt: Date
  waistCm?: number | null
  chestCm?: number | null
  neckCm?: number | null
  leftArmCm?: number | null
  rightArmCm?: number | null
  thighCm?: number | null
  notes?: string | null
}

export interface MeasurementDelta {
  field: string
  label: string
  start: number | null
  current: number | null
  delta: number | null
}

// ─────────────────────────────────────────
// WATER
// ─────────────────────────────────────────
export interface WaterEntry {
  id: string
  userId: string
  dailyLogId: string
  amountMl: number
  recordedAt: Date
}

// ─────────────────────────────────────────
// SLEEP
// ─────────────────────────────────────────
export interface SleepEntry {
  id: string
  userId: string
  dailyLogId: string
  bedtime: Date
  wakeUp: Date
  durationMin: number
  quality?: number | null
  notes?: string | null
}

// ─────────────────────────────────────────
// MEAL PLAN (config, not DB)
// ─────────────────────────────────────────
export interface MealFoodConfig {
  foodId: string
  quantityG: number
  notes?: string
  isOptional?: boolean
  alternatives?: Array<{ foodId: string; quantityG: number; label: string }>
}

export interface MealConfig {
  key: string
  label: string
  time: string
  foods: MealFoodConfig[]
  notes?: string
}

export interface DayMealPlan {
  dayType: 'MWF' | 'TTS' | 'SUNDAY'
  days: number[] // 0=Sun, 1=Mon ... 6=Sat
  meals: MealConfig[]
}

// ─────────────────────────────────────────
// MEAL LOG (DB)
// ─────────────────────────────────────────
export interface MealLog {
  id: string
  userId: string
  date: Date
  mealKey: string
  mealLabel: string
  completed: boolean
  completedAt?: Date | null
  notes?: string | null
  oilGrams: number
  entries: MealEntry[]
}

export interface MealEntry {
  id: string
  mealLogId: string
  foodItemId: string
  quantityG: number
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

// ─────────────────────────────────────────
// WORKOUT
// ─────────────────────────────────────────
export interface ExerciseConfig {
  name: string
  defaultSets: number
  defaultReps: number
  notes?: string
}

export interface WorkoutDayConfig {
  dayType: WorkoutDayType
  label: string
  exercises: ExerciseConfig[]
}

export interface WorkoutSession {
  id: string
  userId: string
  date: Date
  dayType: WorkoutDayType
  completed: boolean
  startedAt?: Date | null
  finishedAt?: Date | null
  notes?: string | null
  totalVolume?: number | null
  exerciseLogs: ExerciseLog[]
}

export interface ExerciseLog {
  id: string
  workoutSessionId: string
  exerciseName: string
  exerciseOrder: number
  notes?: string | null
  sets: ExerciseSet[]
}

export interface ExerciseSet {
  id: string
  exerciseLogId: string
  setNumber: number
  reps: number
  weightKg: number
  rpe?: number | null
  notes?: string | null
}

// ─────────────────────────────────────────
// HABITS
// ─────────────────────────────────────────
export interface HabitConfig {
  key: string
  label: string
  icon: string
  category: 'fitness' | 'diet' | 'lifestyle'
}

export interface HabitLog {
  id: string
  userId: string
  date: Date
  habitKey: string
  completed: boolean
  completedAt?: Date | null
}

export interface HabitStreak {
  userId: string
  habitKey: string
  currentStreak: number
  bestStreak: number
  lastUpdated: Date
}

// ─────────────────────────────────────────
// TRANSFORMATION PHOTOS
// ─────────────────────────────────────────
export interface TransformationPhoto {
  id: string
  userId: string
  category: PhotoCategory
  storageUrl: string
  storagePath: string
  date: Date
  notes?: string | null
  createdAt: Date
}

// ─────────────────────────────────────────
// GROCERY
// ─────────────────────────────────────────
export interface GroceryItem {
  id: string
  userId: string
  weekOf: Date
  category: GroceryCategory
  name: string
  quantity: string
  unit: string
  checked: boolean
  isCustom: boolean
}

// ─────────────────────────────────────────
// TRANSFORMATION SCORE
// ─────────────────────────────────────────
export interface TransformationScoreBreakdown {
  diet: number         // max 20
  protein: number      // max 20
  workout: number      // max 20
  steps: number        // max 15
  water: number        // max 10
  sleep: number        // max 10
  habits: number       // max 5
  total: number        // max 100
}

// ─────────────────────────────────────────
// GOAL MILESTONES
// ─────────────────────────────────────────
export interface WeightMilestone {
  weightKg: number
  label: string
  reached: boolean
  reachedDate?: Date | null
}

// ─────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────
export type TimeFilter = '7D' | '30D' | '90D' | '6M' | '1Y' | 'ALL'

export interface DailyDataPoint {
  date: string
  value: number | null
}

export interface WeeklyReport {
  weekStart: Date
  weekEnd: Date
  averageWeight: number | null
  startWeight: number | null
  endWeight: number | null
  weightChange: number | null
  averageCalories: number | null
  averageProtein: number | null
  averageSteps: number | null
  averageWaterMl: number | null
  averageSleepH: number | null
  gymSessions: number
  dietAdherence: number // percentage
  habitAdherence: number // percentage
}
