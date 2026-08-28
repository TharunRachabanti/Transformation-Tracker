'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, CheckCircle2, Circle, Plus, Trash2, Edit2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { TTS_PLAN, MWF_PLAN } from '@/data/mealPlans'
import { FOOD_DATABASE } from '@/data/nutrition'
import { cn } from '@/lib/utils'

type GroceryCategory = 'PROTEIN' | 'CARBS' | 'VEGETABLES' | 'FRUITS' | 'DAIRY' | 'OTHER'

interface GroceryItem {
  id: string
  name: string
  quantity: string
  category: GroceryCategory
  checked: boolean
  isCustom?: boolean
}

const CATEGORY_CONFIG: Record<GroceryCategory, { label: string; icon: string; color: string }> = {
  PROTEIN: { label: 'Protein', icon: '🍗', color: 'text-red-400' },
  CARBS: { label: 'Carbohydrates', icon: '🍚', color: 'text-yellow-400' },
  VEGETABLES: { label: 'Vegetables', icon: '🥦', color: 'text-green-400' },
  FRUITS: { label: 'Fruits', icon: '🍎', color: 'text-pink-400' },
  DAIRY: { label: 'Dairy', icon: '🥛', color: 'text-blue-400' },
  OTHER: { label: 'Other', icon: '🧂', color: 'text-slate-400' },
}

// Auto-generate from 6-day meal plan (3×MWF + 3×TTS)
function generateGroceryItems(): GroceryItem[] {
  const items: GroceryItem[] = [
    // Protein
    { id: '1', name: 'Chicken Breast', quantity: '2.4 kg', category: 'PROTEIN', checked: false },
    { id: '2', name: 'Fish (White)', quantity: '600 g', category: 'PROTEIN', checked: false },
    { id: '3', name: 'Whole Eggs', quantity: '21 eggs', category: 'PROTEIN', checked: false },
    { id: '4', name: 'Egg Whites', quantity: '6 (extra)', category: 'PROTEIN', checked: false },
    { id: '5', name: 'Whey Protein', quantity: '6 scoops (180g)', category: 'PROTEIN', checked: false },
    // Carbs
    { id: '6', name: 'Rice (White)', quantity: '360 g', category: 'CARBS', checked: false },
    { id: '7', name: 'Oats', quantity: '180 g', category: 'CARBS', checked: false },
    { id: '8', name: 'Whole Wheat Atta', quantity: '360 g', category: 'CARBS', checked: false },
    { id: '9', name: 'Dal', quantity: '1 cup (to cook 450g)', category: 'CARBS', checked: false },
    // Vegetables
    { id: '10', name: 'Cucumber', quantity: '1.2 kg', category: 'VEGETABLES', checked: false },
    { id: '11', name: 'Carrot', quantity: '1.2 kg', category: 'VEGETABLES', checked: false },
    { id: '12', name: 'Tomato', quantity: '1 kg', category: 'VEGETABLES', checked: false },
    { id: '13', name: 'Onion', quantity: '600 g', category: 'VEGETABLES', checked: false },
    { id: '14', name: 'Mixed Vegetables', quantity: '2.5 kg', category: 'VEGETABLES', checked: false },
    { id: '15', name: 'Ginger-Garlic Paste', quantity: '60 g', category: 'VEGETABLES', checked: false },
    // Fruits
    { id: '16', name: 'Banana', quantity: '14 (pre-workout + meals)', category: 'FRUITS', checked: false },
    { id: '17', name: 'Assorted Fruits', quantity: '6 servings', category: 'FRUITS', checked: false },
    // Dairy
    { id: '18', name: 'Curd / Yoghurt', quantity: '2.1 kg', category: 'DAIRY', checked: false },
    { id: '19', name: 'Low-fat Milk', quantity: '750 ml', category: 'DAIRY', checked: false },
    { id: '20', name: 'Buttermilk', quantity: '900 ml', category: 'DAIRY', checked: false },
    // Other
    { id: '21', name: 'Cooking Oil', quantity: '70 g (1 week)', category: 'OTHER', checked: false },
    { id: '22', name: 'Spices & masala', quantity: 'as needed', category: 'OTHER', checked: false },
    { id: '23', name: 'Black Coffee', quantity: 'optional', category: 'OTHER', checked: false },
  ]
  return items
}

export default function GroceryPage() {
  const [items, setItems] = useState<GroceryItem[]>(generateGroceryItems())
  const [newItem, setNewItem] = useState('')
  const [newQty, setNewQty] = useState('')
  const [newCat, setNewCat] = useState<GroceryCategory>('OTHER')
  const [showAdd, setShowAdd] = useState(false)

  const grouped = (Object.keys(CATEGORY_CONFIG) as GroceryCategory[]).map((cat) => ({
    category: cat,
    items: items.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0)

  const checkedCount = items.filter((i) => i.checked).length

  function toggle(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function addCustom() {
    if (!newItem.trim()) return
    setItems((prev) => [...prev, {
      id: crypto.randomUUID(),
      name: newItem.trim(),
      quantity: newQty || '1',
      category: newCat,
      checked: false,
      isCustom: true,
    }])
    setNewItem('')
    setNewQty('')
    setShowAdd(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
        <Link href="/more" className="w-10 h-10 rounded-xl bg-[#0c1528] border border-[#1a2550] text-[#60a5fa] flex items-center justify-center hover:bg-[#141e40] hover:text-white transition-colors shrink-0 shadow-lg shadow-[#60a5fa]/5">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">Grocery List</h1>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Week auto-generated · {checkedCount}/{items.length} bought</p>
        </div>
      </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Progress */}
      <div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            animate={{ width: `${(checkedCount / items.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">{items.length - checkedCount} items remaining</p>
      </div>

      {/* Add Custom */}
      {showAdd && (
        <div className="glass rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">Add Custom Item</h3>
          <input
            type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)}
            placeholder="Item name"
            className="w-full bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <div className="flex gap-2">
            <input
              type="text" value={newQty} onChange={(e) => setNewQty(e.target.value)}
              placeholder="Quantity"
              className="flex-1 bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
            <select
              value={newCat} onChange={(e) => setNewCat(e.target.value as GroceryCategory)}
              className="bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
            >
              {(Object.keys(CATEGORY_CONFIG) as GroceryCategory[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_CONFIG[c].label}</option>
              ))}
            </select>
          </div>
          <button onClick={addCustom} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-medium">
            Add Item
          </button>
        </div>
      )}

      {/* Grouped Items */}
      {grouped.map(({ category, items: catItems }) => {
        const config = CATEGORY_CONFIG[category]
        return (
          <div key={category} className="glass rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/60">
              <span>{config.icon}</span>
              <h3 className={cn('text-sm font-semibold', config.color)}>{config.label}</h3>
              <span className="text-xs text-slate-600 ml-auto">
                {catItems.filter((i) => i.checked).length}/{catItems.length}
              </span>
            </div>
            <div className="divide-y divide-slate-800/40">
              {catItems.map((item) => (
                <div key={item.id} className={cn('flex items-center gap-3 px-4 py-3', item.checked && 'opacity-50')}>
                  <button onClick={() => toggle(item.id)} className="shrink-0">
                    {item.checked
                      ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                      : <Circle className="w-5 h-5 text-slate-600" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className={cn('text-sm', item.checked ? 'line-through text-slate-500' : 'text-slate-200')}>
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500 ml-2">{item.quantity}</span>
                  </div>
                  {item.isCustom && (
                    <button onClick={() => deleteItem(item.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
