import { DayMealPlan } from '@/types'

// ─────────────────────────────────────────
// MEAL PLANS - 7 Day Configuration
// Food IDs match names in nutrition.ts database
// ─────────────────────────────────────────

// Monday / Wednesday / Friday
export const MWF_PLAN: DayMealPlan = {
  dayType: 'MWF',
  days: [1, 3, 5], // Mon, Wed, Fri
  meals: [
    {
      key: 'pre_workout',
      label: 'Pre-Workout',
      time: '06:15',
      notes: 'No sugar. Black coffee optional.',
      foods: [
        { foodId: 'Banana', quantityG: 110, notes: '100–120g edible portion' },
      ],
    },
    {
      key: 'breakfast',
      label: 'Breakfast',
      time: '08:30',
      foods: [
        { foodId: 'Whole Egg', quantityG: 180, notes: '3 whole eggs (~60g each)' },
        { foodId: 'Egg White', quantityG: 60, notes: '2 egg whites (~30g each)' },
        {
          foodId: 'Apple', quantityG: 150,
          notes: 'Choose one fruit',
          alternatives: [
            { foodId: 'Orange', quantityG: 190, label: 'Orange' },
            { foodId: 'Papaya', quantityG: 200, label: 'Papaya' },
            { foodId: 'Banana', quantityG: 110, label: 'Banana' },
          ],
        },
        { foodId: 'Onion', quantityG: 50, isOptional: true },
        { foodId: 'Tomato', quantityG: 50, isOptional: true },
        { foodId: 'Cooking Oil', quantityG: 2, notes: 'Max 2g' },
      ],
    },
    {
      key: 'meal_11am',
      label: '11 AM – Protein Salad',
      time: '11:00',
      foods: [
        { foodId: 'Curd / Plain Yoghurt', quantityG: 200 },
        { foodId: 'Cucumber', quantityG: 100 },
        { foodId: 'Carrot', quantityG: 100 },
        { foodId: 'Whey Protein (per scoop ~30g)', quantityG: 30, notes: '1 scoop' },
      ],
    },
    {
      key: 'lunch',
      label: 'Lunch',
      time: '13:30',
      notes: 'Chicken prepared as curry',
      foods: [
        { foodId: 'Chicken Breast', quantityG: 200, notes: 'RAW weight' },
        { foodId: 'Rice (White)', quantityG: 60, notes: 'RAW weight' },
        { foodId: 'Mixed Vegetables', quantityG: 225, notes: '200–250g' },
        { foodId: 'Onion', quantityG: 50 },
        { foodId: 'Tomato', quantityG: 100 },
        { foodId: 'Ginger-Garlic Paste', quantityG: 10 },
        { foodId: 'Cooking Oil', quantityG: 5 },
      ],
    },
    {
      key: 'meal_430pm',
      label: '4:30 PM – Salad',
      time: '16:30',
      notes: 'No additional oil',
      foods: [
        { foodId: 'Curd / Plain Yoghurt', quantityG: 200 },
        { foodId: 'Cucumber', quantityG: 100 },
        { foodId: 'Carrot', quantityG: 100 },
        { foodId: 'Tomato', quantityG: 50 },
        { foodId: 'Mixed Vegetables', quantityG: 100 },
      ],
    },
    {
      key: 'dinner',
      label: 'Dinner',
      time: '19:30',
      notes: 'Chicken via air fryer. No ghee/butter.',
      foods: [
        { foodId: 'Chicken Breast', quantityG: 200, notes: 'RAW weight' },
        { foodId: 'Atta (Whole Wheat)', quantityG: 60, notes: 'RAW – 2 rotis' },
        { foodId: 'Mixed Vegetables', quantityG: 250, notes: '200–300g' },
      ],
    },
  ],
}

// Tuesday / Thursday / Saturday
export const TTS_PLAN: DayMealPlan = {
  dayType: 'TTS',
  days: [2, 4, 6], // Tue, Thu, Sat
  meals: [
    {
      key: 'pre_workout',
      label: 'Pre-Workout',
      time: '06:15',
      notes: 'No sugar. Black coffee optional.',
      foods: [
        { foodId: 'Banana', quantityG: 110, notes: '100–120g edible portion' },
      ],
    },
    {
      key: 'breakfast',
      label: 'Breakfast – Oats',
      time: '08:30',
      notes: 'Cook oats with milk. Remove from heat. Add whey after cooking.',
      foods: [
        { foodId: 'Oats', quantityG: 60, notes: 'RAW weight' },
        { foodId: 'Low-fat Milk', quantityG: 250 },
        { foodId: 'Whey Protein (per scoop ~30g)', quantityG: 30, notes: '1 scoop – add after cooking' },
      ],
    },
    {
      key: 'meal_11am',
      label: '11 AM',
      time: '11:00',
      foods: [
        {
          foodId: 'Apple', quantityG: 150,
          notes: 'Choose one fruit',
          alternatives: [
            { foodId: 'Orange', quantityG: 190, label: 'Orange' },
            { foodId: 'Papaya', quantityG: 200, label: 'Papaya' },
            { foodId: 'Banana', quantityG: 110, label: 'Banana' },
          ],
        },
        { foodId: 'Curd / Plain Yoghurt', quantityG: 200 },
        { foodId: 'Cucumber', quantityG: 100 },
        { foodId: 'Carrot', quantityG: 100 },
      ],
    },
    {
      key: 'lunch',
      label: 'Lunch',
      time: '13:30',
      foods: [
        { foodId: 'Chicken Breast', quantityG: 200, notes: 'RAW weight' },
        { foodId: 'Rice (White)', quantityG: 60, notes: 'RAW weight' },
        { foodId: 'Dal (Cooked)', quantityG: 150, notes: 'COOKED weight' },
        { foodId: 'Mixed Vegetables', quantityG: 225 },
        { foodId: 'Cooking Oil', quantityG: 5 },
      ],
    },
    {
      key: 'meal_430pm',
      label: '4:30 PM – Buttermilk',
      time: '16:30',
      notes: 'No added sugar',
      foods: [
        { foodId: 'Buttermilk', quantityG: 300 },
        {
          foodId: 'Apple', quantityG: 150,
          notes: 'Choose one fruit',
          alternatives: [
            { foodId: 'Orange', quantityG: 190, label: 'Orange' },
            { foodId: 'Papaya', quantityG: 200, label: 'Papaya' },
            { foodId: 'Banana', quantityG: 110, label: 'Banana' },
          ],
        },
      ],
    },
    {
      key: 'dinner',
      label: 'Dinner',
      time: '19:30',
      notes: 'Fish via air fryer. No ghee/butter.',
      foods: [
        { foodId: 'Fish (White)', quantityG: 200, notes: 'RAW weight' },
        { foodId: 'Atta (Whole Wheat)', quantityG: 60, notes: 'RAW – 2 rotis' },
        { foodId: 'Mixed Vegetables', quantityG: 250 },
      ],
    },
  ],
}

// Sunday – rest day, use MWF structure with optional modifications
export const SUNDAY_PLAN: DayMealPlan = {
  dayType: 'SUNDAY',
  days: [0], // Sunday
  meals: MWF_PLAN.meals.filter((m) => m.key !== 'pre_workout'),
}

// Get plan for a given day of week (0=Sun ... 6=Sat)
export function getMealPlanForDay(dayOfWeek: number): DayMealPlan {
  if (dayOfWeek === 0) return SUNDAY_PLAN
  if ([1, 3, 5].includes(dayOfWeek)) return MWF_PLAN
  return TTS_PLAN
}

// Get all meals for a day (excluding pre_workout for Sunday/rest)
export function getMealsForToday(): DayMealPlan {
  const day = new Date().getDay()
  return getMealPlanForDay(day)
}
