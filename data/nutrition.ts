import { FoodItem } from '@/types'

// ─────────────────────────────────────────
// FOOD NUTRITION DATABASE
// All values per 100g unless specified
// ─────────────────────────────────────────
export const FOOD_DATABASE: Omit<FoodItem, 'id' | 'userId' | 'isDefault'>[] = [
  // ── PROTEINS ──────────────────────────
  {
    name: 'Chicken Breast',
    measurementType: 'RAW',
    caloriesPer100g: 120,
    proteinPer100g: 22,
    carbsPer100g: 0,
    fatPer100g: 2.5,
  },
  {
    name: 'Fish (White)',
    measurementType: 'RAW',
    caloriesPer100g: 105,
    proteinPer100g: 20,
    carbsPer100g: 0,
    fatPer100g: 2,
  },
  {
    name: 'Whole Egg',
    measurementType: 'RAW',
    caloriesPer100g: 155,
    proteinPer100g: 13,
    carbsPer100g: 1.1,
    fatPer100g: 11,
  },
  {
    name: 'Egg White',
    measurementType: 'RAW',
    caloriesPer100g: 52,
    proteinPer100g: 11,
    carbsPer100g: 0.7,
    fatPer100g: 0.2,
  },
  // ── CARBS ──────────────────────────────
  {
    name: 'Rice (White)',
    measurementType: 'RAW',
    caloriesPer100g: 358,
    proteinPer100g: 7.1,
    carbsPer100g: 79,
    fatPer100g: 0.7,
  },
  {
    name: 'Oats',
    measurementType: 'RAW',
    caloriesPer100g: 389,
    proteinPer100g: 17,
    carbsPer100g: 66,
    fatPer100g: 7,
  },
  {
    name: 'Atta (Whole Wheat)',
    measurementType: 'RAW',
    caloriesPer100g: 340,
    proteinPer100g: 12,
    carbsPer100g: 71,
    fatPer100g: 2.5,
  },
  // ── DAIRY ──────────────────────────────
  {
    name: 'Low-fat Milk',
    measurementType: 'AS_SERVED',
    caloriesPer100g: 42,
    proteinPer100g: 3.4,
    carbsPer100g: 5,
    fatPer100g: 1,
  },
  {
    name: 'Curd / Plain Yoghurt',
    measurementType: 'AS_SERVED',
    caloriesPer100g: 60,
    proteinPer100g: 3.5,
    carbsPer100g: 4,
    fatPer100g: 3.2,
  },
  {
    name: 'Buttermilk',
    measurementType: 'AS_SERVED',
    caloriesPer100g: 40,
    proteinPer100g: 3.3,
    carbsPer100g: 4.9,
    fatPer100g: 0.9,
  },
  {
    name: 'Whey Protein (per scoop ~30g)',
    measurementType: 'AS_SERVED',
    caloriesPer100g: 380,
    proteinPer100g: 80,
    carbsPer100g: 7,
    fatPer100g: 4,
  },
  // ── DAL / PULSES ───────────────────────
  {
    name: 'Dal (Cooked)',
    measurementType: 'COOKED',
    caloriesPer100g: 116,
    proteinPer100g: 9,
    carbsPer100g: 20,
    fatPer100g: 0.4,
  },
  // ── VEGETABLES ─────────────────────────
  {
    name: 'Cucumber',
    measurementType: 'RAW',
    caloriesPer100g: 15,
    proteinPer100g: 0.7,
    carbsPer100g: 3.6,
    fatPer100g: 0.1,
  },
  {
    name: 'Carrot',
    measurementType: 'RAW',
    caloriesPer100g: 41,
    proteinPer100g: 0.9,
    carbsPer100g: 10,
    fatPer100g: 0.2,
  },
  {
    name: 'Tomato',
    measurementType: 'RAW',
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatPer100g: 0.2,
  },
  {
    name: 'Onion',
    measurementType: 'RAW',
    caloriesPer100g: 40,
    proteinPer100g: 1.1,
    carbsPer100g: 9.3,
    fatPer100g: 0.1,
  },
  {
    name: 'Mixed Vegetables',
    measurementType: 'RAW',
    caloriesPer100g: 35,
    proteinPer100g: 2,
    carbsPer100g: 7,
    fatPer100g: 0.3,
  },
  {
    name: 'Ginger-Garlic Paste',
    measurementType: 'AS_SERVED',
    caloriesPer100g: 75,
    proteinPer100g: 2.5,
    carbsPer100g: 16,
    fatPer100g: 0.5,
  },
  // ── FRUITS ─────────────────────────────
  {
    name: 'Apple',
    measurementType: 'RAW',
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 14,
    fatPer100g: 0.2,
  },
  {
    name: 'Orange',
    measurementType: 'RAW',
    caloriesPer100g: 47,
    proteinPer100g: 0.9,
    carbsPer100g: 12,
    fatPer100g: 0.1,
  },
  {
    name: 'Papaya',
    measurementType: 'RAW',
    caloriesPer100g: 43,
    proteinPer100g: 0.5,
    carbsPer100g: 11,
    fatPer100g: 0.3,
  },
  {
    name: 'Banana',
    measurementType: 'RAW',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatPer100g: 0.3,
  },
  // ── OILS ───────────────────────────────
  {
    name: 'Cooking Oil',
    measurementType: 'AS_SERVED',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
  },
]

// Lookup by name for convenient access
export const FOOD_BY_NAME = Object.fromEntries(
  FOOD_DATABASE.map((f) => [f.name, f])
)

// Calculate nutrition for a given food + quantity
export function calcNutrition(
  food: Pick<FoodItem, 'caloriesPer100g' | 'proteinPer100g' | 'carbsPer100g' | 'fatPer100g'>,
  quantityG: number
) {
  const factor = quantityG / 100
  return {
    calories: Math.round(food.caloriesPer100g * factor * 10) / 10,
    proteinG: Math.round(food.proteinPer100g * factor * 10) / 10,
    carbsG: Math.round(food.carbsPer100g * factor * 10) / 10,
    fatG: Math.round(food.fatPer100g * factor * 10) / 10,
  }
}
