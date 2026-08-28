export default function HomeLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div>
          <div className="h-3 w-32 bg-[#141e40] rounded-full mb-2" />
          <div className="h-8 w-40 bg-[#141e40] rounded-xl" />
          <div className="h-3.5 w-48 bg-[#0e1630] rounded-full mt-2" />
        </div>
        <div className="w-16 h-16 rounded-full bg-[#141e40]" />
      </div>

      {/* Weight journey skeleton */}
      <div className="rounded-2xl p-4 space-y-3 bg-[#0e1630] border border-[#1a2550]">
        <div className="h-4 w-36 bg-[#141e40] rounded-full" />
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map((i) => <div key={i} className="h-16 bg-[#141e40] rounded-xl" />)}
        </div>
        <div className="h-2 bg-[#141e40] rounded-full" />
      </div>

      {/* Macro cards skeleton */}
      <div>
        <div className="h-3 w-24 bg-[#141e40] rounded-full mb-3" />
        <div className="grid grid-cols-2 gap-3">
          {[1,2,3,4].map((i) => <div key={i} className="h-24 bg-[#0e1630] border border-[#1a2550] rounded-xl" />)}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {[1,2].map((i) => <div key={i} className="h-16 bg-[#0e1630] border border-[#1a2550] rounded-xl" />)}
        </div>
      </div>

      {/* Water tracker skeleton */}
      <div className="h-28 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />

      {/* Checklist skeleton */}
      <div className="h-40 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />
    </div>
  )
}
