import { User, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProfileLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800/60 shrink-0" />
        <div className="space-y-2">
          <div className="h-6 w-32 bg-slate-800/60 rounded" />
          <div className="h-3 w-48 bg-slate-800/60 rounded" />
        </div>
      </div>

      <div className="glass rounded-2xl p-6 flex flex-col items-center gap-3">
        <div className="w-20 h-20 rounded-[24px] bg-slate-800/60" />
        <div className="w-32 h-6 bg-slate-800/60 rounded mt-1" />
        <div className="w-40 h-4 bg-slate-800/60 rounded" />
        <div className="grid grid-cols-3 gap-6 w-full mt-4 bg-slate-800/40 rounded-2xl p-4">
          <div className="w-full h-12 bg-slate-700/40 rounded" />
          <div className="w-full h-12 bg-slate-700/40 rounded" />
          <div className="w-full h-12 bg-slate-700/40 rounded" />
        </div>
      </div>

      <div className="glass rounded-2xl p-4 space-y-4">
        <div className="w-24 h-4 bg-slate-800/60 rounded" />
        <div className="space-y-5 mt-4">
          <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
          <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
          <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
          <div className="w-full h-12 bg-slate-800/60 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
