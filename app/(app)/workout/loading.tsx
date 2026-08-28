export default function WorkoutLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div>
        <div className="h-3 w-28 bg-[#141e40] rounded-full mb-2" />
        <div className="h-8 w-28 bg-[#141e40] rounded-xl" />
        <div className="h-3 w-40 bg-[#0e1630] rounded-full mt-2" />
      </div>
      <div className="h-14 bg-[#0e1630] border border-[#4f7cff]/15 rounded-2xl" />
      <div className="h-3 w-20 bg-[#141e40] rounded-full" />
      {[1,2,3,4,5].map((i) => (
        <div key={i} className="h-16 bg-[#0e1630] border border-[#1a2550] rounded-2xl" />
      ))}
    </div>
  )
}
