'use client'

import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PhotoCategory } from '@/types'

const CATEGORIES: { key: PhotoCategory; label: string; icon: string }[] = [
  { key: 'FRONT', label: 'Front', icon: '🧍' },
  { key: 'SIDE', label: 'Side', icon: '🧍' },
  { key: 'BACK', label: 'Back', icon: '🚶' },
  { key: 'FACE', label: 'Face', icon: '😊' },
  { key: 'HAIR', label: 'Hair', icon: '💇' },
]

interface PhotoEntry {
  id: string
  category: PhotoCategory
  date: string
  url: string
  notes?: string
}

// Demo photos (placeholder URLs)
const MOCK_PHOTOS: PhotoEntry[] = []

export default function PhotosPage() {
  const [photos, setPhotos] = useState<PhotoEntry[]>(MOCK_PHOTOS)
  const [activeCategory, setActiveCategory] = useState<PhotoCategory>('FRONT')
  const [compareMode, setCompareMode] = useState(false)
  const [sliderPos, setSliderPos] = useState(50)
  const [before, setBefore] = useState<PhotoEntry | null>(null)
  const [after, setAfter] = useState<PhotoEntry | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [notes, setNotes] = useState('')

  const categoryPhotos = photos.filter((p) => p.category === activeCategory)

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    files.forEach((file) => {
      const url = URL.createObjectURL(file)
      const entry: PhotoEntry = {
        id: crypto.randomUUID(),
        category: activeCategory,
        date: format(new Date(), 'yyyy-MM-dd'),
        url,
        notes,
      }
      setPhotos((prev) => [entry, ...prev])
    })
    setNotes('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/more" className="w-10 h-10 rounded-xl bg-[#161c16] border border-[#232b21] text-[#8CA488] flex items-center justify-center hover:bg-[#1b241b] hover:text-white transition-colors shrink-0 shadow-lg shadow-[#8CA488]/5">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Photos</h1>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">Private transformation photos</p>
          </div>
        </div>
        <button
          onClick={() => setCompareMode(!compareMode)}
          className={cn(
            'text-xs px-3 py-1.5 rounded-lg border transition-all',
            compareMode ? 'bg-[#748C70]/20 border-[#748C70]/40 text-[#8CA488]' : 'border-slate-700/60 text-slate-400'
          )}
        >
          Compare
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-all shrink-0',
              activeCategory === cat.key
                ? 'bg-[#627a5e] text-white'
                : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
            )}
          >
            <span>{cat.icon}</span>
            {cat.label}
            {photos.filter((p) => p.category === cat.key).length > 0 && (
              <span className="text-[10px] bg-white/20 rounded px-1">
                {photos.filter((p) => p.category === cat.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Upload */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">Add Photo</h2>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes..."
          className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
        <input type="file" ref={fileRef} accept="image/*" multiple onChange={handleUpload} className="hidden" />
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-700/60 hover:border-[#748C70]/40 rounded-xl py-6 text-sm text-slate-400 hover:text-[#8CA488] transition-all flex flex-col items-center gap-2"
        >
          <Upload className="w-6 h-6" />
          Tap to upload {activeCategory.toLowerCase()} photo
        </button>
      </div>

      {/* Compare Mode */}
      <AnimatePresence>
        {compareMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-4 space-y-3 overflow-hidden"
          >
            <h2 className="text-sm font-semibold text-white">Before vs After</h2>
            {categoryPhotos.length < 2 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                Upload at least 2 photos to compare
              </p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Before</p>
                    <select
                      onChange={(e) => setBefore(categoryPhotos.find((p) => p.id === e.target.value) ?? null)}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      <option value="">Select</option>
                      {categoryPhotos.map((p) => (
                        <option key={p.id} value={p.id}>{p.date}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">After</p>
                    <select
                      onChange={(e) => setAfter(categoryPhotos.find((p) => p.id === e.target.value) ?? null)}
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      <option value="">Select</option>
                      {categoryPhotos.map((p) => (
                        <option key={p.id} value={p.id}>{p.date}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {before && after && (
                  <div className="relative rounded-xl overflow-hidden h-64 border border-slate-700/60 bg-slate-900">
                    <img src={before.url} alt="Before"  className="absolute inset-0 w-full h-full object-cover" />
                    <div
                      className="absolute top-0 right-0 bottom-0 overflow-hidden"
                      style={{ width: `${100 - sliderPos}%` }}
                    >
                      <img src={after.url} alt="After" className="absolute right-0 top-0 h-full object-cover" style={{ width: `${100 / ((100 - sliderPos) / 100)}%`, right: 0 }} />
                    </div>
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
                      style={{ left: `${sliderPos}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                        <ChevronLeft className="w-3 h-3 text-slate-800" />
                      </div>
                    </div>
                    <input
                      type="range" min={0} max={100} value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-ew-resize"
                    />
                    <span className="absolute bottom-2 left-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">Before</span>
                    <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">After</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gallery */}
      {categoryPhotos.length === 0 ? (
        <div className="glass rounded-2xl p-8 text-center space-y-3">
          <Camera className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm">No {activeCategory.toLowerCase()} photos yet</p>
          <p className="text-slate-600 text-xs">Upload your first transformation photo above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categoryPhotos.map((photo) => (
            <div key={photo.id} className="glass rounded-xl overflow-hidden">
              <div className="relative aspect-[3/4] bg-slate-900">
                <img src={photo.url} alt={photo.category} className="w-full h-full object-cover" />
                <button
                  onClick={() => setPhotos((prev) => prev.filter((p) => p.id !== photo.id))}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-400">{format(new Date(photo.date + 'T00:00:00'), 'MMM d, yyyy')}</p>
                {photo.notes && <p className="text-xs text-slate-500 mt-0.5 truncate">{photo.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
