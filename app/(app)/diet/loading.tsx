import { DelayedSkeleton } from '@/components/shared/DelayedSkeleton'

export default function DietLoading() {
  return (
    <DelayedSkeleton>
      <div className="space-y-5 animate-pulse">
        <div>
          <div className="h-3 w-32 bg-[#141e40] rounded-full mb-2" />
          <div className="h-8 w-24 bg-[#141e40] rounded-xl" />
          <div className="h-3.5 w-48 bg-[#0e1630] rounded-full mt-2" />
        </div>
        <div className="h-32 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />
        <div className="h-24 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />
        <div className="space-y-3">
          <div className="h-3 w-28 bg-[#141e40] rounded-full mb-3" />
          {[1,2,3,4].map((i) => <div key={i} className="h-20 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />)}
        </div>
      </div>
    </DelayedSkeleton>
  )
}
