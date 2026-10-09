export default function DashboardLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-7 font-sans animate-pulse">
      {/* 1. Greeting + header buttons skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-[#E8E5E0] rounded-xl" />
          <div className="h-4 w-80 max-w-full bg-[#EAE6DF] rounded-lg" />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-8 w-36 bg-[#E8E5E0] rounded-xl" />
          <div className="h-8 w-8 bg-[#E8E5E0] rounded-xl" />
          <div className="h-8 w-8 bg-[#E8E5E0] rounded-xl" />
        </div>
      </div>

      {/* 2. Stat Cards skeleton (row of 4, compact) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E3E0DB] rounded-xl p-4 shadow-2xs space-y-2 min-h-[96px]"
          >
            <div className="h-3 w-20 bg-[#EAE6DF] rounded" />
            <div className="h-6 w-16 bg-[#E8E5E0] rounded-lg" />
            <div className="h-3 w-28 bg-[#EAE6DF] rounded" />
          </div>
        ))}
      </div>

      {/* 3. Your next step card skeleton */}
      <div className="bg-white border border-[#E3E0DB] border-l-[3.5px] border-l-[#2563EB] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-56 bg-[#E8E5E0] rounded-lg" />
          <div className="h-3.5 w-72 bg-[#EAE6DF] rounded" />
        </div>
        <div className="h-8 w-28 bg-[#E8E5E0] rounded-xl shrink-0" />
      </div>

      {/* 4. Latest testimonials skeleton (3 compact rows) */}
      <div className="bg-white border border-[#E3E0DB] rounded-xl shadow-2xs overflow-hidden">
        <div className="px-4 py-3.5 border-b border-[#F0ECE6]">
          <div className="h-5 w-40 bg-[#E8E5E0] rounded-lg" />
        </div>
        <div className="divide-y divide-[#F0ECE6]">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="px-4 py-2.5 sm:min-h-[56px] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 flex-1">
                <div className="w-7 h-7 rounded-full bg-[#E8E5E0] shrink-0" />
                <div className="h-3.5 w-24 bg-[#E8E5E0] rounded" />
                <div className="h-3.5 flex-1 max-w-sm bg-[#EAE6DF] rounded hidden sm:block" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-16 bg-[#EAE6DF] rounded" />
                <div className="h-4 w-14 bg-[#E8E5E0] rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 border-t border-[#F0ECE6] bg-[#FAF9F6]/40">
          <div className="h-3.5 w-36 bg-[#E8E5E0] rounded" />
        </div>
      </div>
    </div>
  );
}
