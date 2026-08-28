import { Settings, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsLoading() {
  return (
    <div className="space-y-5 animate-pulse pb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800/60 shrink-0" />
        <div className="space-y-2">
          <div className="h-6 w-32 bg-slate-800/60 rounded" />
          <div className="h-3 w-48 bg-slate-800/60 rounded" />
        </div>
      </div>

      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass rounded-2xl p-4 space-y-4">
          <div className="w-40 h-5 bg-slate-800/60 rounded" />
          <div className="space-y-3">
            <div>
              <div className="w-24 h-2.5 bg-slate-700/60 rounded mb-1.5" />
              <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
            </div>
            <div>
              <div className="w-24 h-2.5 bg-slate-700/60 rounded mb-1.5" />
              <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
      
      <div className="w-full h-14 bg-slate-800/60 rounded-xl mt-6" />
    </div>
  )
}
