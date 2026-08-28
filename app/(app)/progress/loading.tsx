export default function ProgressLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div>
        <div className="h-8 w-28 bg-[#141e40] rounded-xl" />
        <div className="h-3 w-48 bg-[#0e1630] rounded-full mt-2" />
      </div>
      <div className="flex gap-2">
        {[1,2,3,4].map((i) => <div key={i} className="flex-1 h-9 bg-[#0e1630] border border-[#1a2550] rounded-xl" />)}
      </div>
      <div className="h-56 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />
      <div className="h-40 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />
      <div className="h-36 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />
      <div className="h-48 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />
    </div>
  )
}
