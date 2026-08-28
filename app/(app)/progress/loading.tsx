import { DelayedSkeleton } from '@/components/shared/DelayedSkeleton'

export default function ProgressLoading() {
  return (
    <DelayedSkeleton>
      <div className="space-y-5 animate-pulse">
        <div>
          <div className="h-8 w-40 bg-[#141e40] rounded-xl" />
          <div className="h-3.5 w-48 bg-[#0e1630] rounded-full mt-2" />
        </div>
        <div className="flex gap-2">
          {[1,2,3].map((i) => <div key={i} className="h-12 flex-1 bg-[#141e40] rounded-xl" />)}
        </div>
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-48 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />
        ))}
      </div>
    </DelayedSkeleton>
  )
}
