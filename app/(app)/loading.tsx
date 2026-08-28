import { Loader2 } from 'lucide-react'

export default function AppLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-14 h-14 rounded-full border-t-2 border-r-2 border-[#4f7cff] animate-spin opacity-50" style={{ animationDuration: '3s' }} />
        {/* Inner solid ring */}
        <div className="absolute w-10 h-10 rounded-full border-2 border-[#1a2550]" />
        {/* Spinning Icon */}
        <Loader2 className="w-5 h-5 text-[#9b6dff] animate-spin" style={{ animationDuration: '1s' }} />
      </div>
      <p className="mt-6 text-[10px] font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
        Loading...
      </p>
    </div>
  )
}
