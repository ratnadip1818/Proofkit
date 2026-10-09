export default function DashboardLoading() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 space-y-8 font-sans animate-pulse">
      {/* 1. Greeting skeleton */}
      <div className="space-y-2 pb-2">
        <div className="h-8 w-64 bg-[#E8E5E0] rounded-[8px]" />
        <div className="h-4 w-96 max-w-full bg-[#EAE6DF] rounded-[6px]" />
      </div>

      {/* 2. Stat Cards skeleton (row of 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white border border-[#E8E5E0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3"
          >
            <div className="h-3 w-20 bg-[#EAE6DF] rounded-[4px]" />
            <div className="h-7 w-16 bg-[#E8E5E0] rounded-[6px]" />
            <div className="h-3 w-32 bg-[#EAE6DF] rounded-[4px]" />
          </div>
        ))}
      </div>

      {/* 3. Needs your attention skeleton */}
      <div className="bg-white border border-[#E8E5E0] rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
        <div className="h-4 w-40 bg-[#E8E5E0] rounded-[6px]" />
        <div className="h-4 w-72 bg-[#EAE6DF] rounded-[6px]" />
      </div>

      {/* 4. Two-Column section skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column skeleton */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white border border-[#E8E5E0] rounded-[14px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <div className="h-5 w-44 bg-[#E8E5E0] rounded-[6px]" />
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 pt-3 border-t border-[#F0ECE6]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#E8E5E0]" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-28 bg-[#E8E5E0] rounded-[4px]" />
                    <div className="h-2.5 w-20 bg-[#EAE6DF] rounded-[4px]" />
                  </div>
                </div>
                <div className="h-3 w-full bg-[#EAE6DF] rounded-[4px] pl-11" />
              </div>
            ))}
          </div>
        </div>

        {/* Right column skeleton */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border border-[#E8E5E0] rounded-[14px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
          <div className="h-5 w-40 bg-[#E8E5E0] rounded-[6px]" />
          <div className="h-3 w-52 bg-[#EAE6DF] rounded-[4px]" />
          <div className="h-9 w-full bg-[#EAE6DF] rounded-[10px]" />
          <div className="grid grid-cols-2 gap-2.5">
            <div className="h-8 bg-[#EAE6DF] rounded-[10px]" />
            <div className="h-8 bg-[#EAE6DF] rounded-[10px]" />
          </div>
        </div>
      </div>

      {/* 5. Widgets section skeleton */}
      <div className="bg-white border border-[#E8E5E0] rounded-[14px] p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
        <div className="h-5 w-32 bg-[#E8E5E0] rounded-[6px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-[12px] bg-[#FAF9F6] border border-[#E8E5E0] space-y-3"
            >
              <div className="h-4 w-24 bg-[#E8E5E0] rounded-[4px]" />
              <div className="h-3 w-36 bg-[#EAE6DF] rounded-[4px]" />
              <div className="h-6 w-full bg-[#EAE6DF] rounded-[8px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
