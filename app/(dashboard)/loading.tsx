export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 flex flex-col space-y-10 sm:space-y-12">
        
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-pulse">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-black/10 dark:bg-white/10 rounded-lg"></div>
            <div className="h-4 w-48 bg-black/5 dark:bg-white/5 rounded-md"></div>
          </div>
          <div className="hidden sm:block h-10 w-36 bg-black/5 dark:bg-white/5 rounded-xl"></div>
        </div>

        {/* Active Project Hero Skeleton (Phantom UI style) */}
        <div className="relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent rounded-[25px] opacity-50"></div>
          <div className="relative bg-white dark:bg-[#0A0A0B] rounded-[24px] p-6 sm:p-8 border border-black/5 dark:border-white/5 shadow-xl dark:shadow-none overflow-hidden">
            {/* Shimmer effect inside the card */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            <div className="flex items-center justify-between mb-8 sm:mb-12">
              <div className="h-6 w-24 bg-black/10 dark:bg-white/10 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-8">
              <div className="h-10 w-3/4 sm:w-1/2 bg-black/10 dark:bg-white/10 rounded-lg animate-pulse"></div>

              <div className="flex items-center gap-8">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-black/5 dark:bg-white/5 rounded-md animate-pulse"></div>
                  <div className="h-8 w-16 bg-black/10 dark:bg-white/10 rounded-lg animate-pulse"></div>
                </div>
                
                <div className="w-px h-10 bg-black/10 dark:bg-white/10"></div>

                <div className="space-y-2">
                  <div className="h-4 w-24 bg-black/5 dark:bg-white/5 rounded-md animate-pulse"></div>
                  <div className="h-8 w-20 bg-indigo-500/20 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Writing Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-[#111] border border-black/[0.08] dark:border-white/5 rounded-[20px] p-5 h-28 animate-pulse flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-black/10 dark:bg-white/10"></div>
            <div className="flex-1 space-y-3 pt-1">
              <div className="h-4 w-1/2 bg-black/10 dark:bg-white/10 rounded-md"></div>
              <div className="h-3 w-3/4 bg-black/5 dark:bg-white/5 rounded-md"></div>
              <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full mt-2"></div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#111] border border-black/[0.08] dark:border-white/5 rounded-[20px] p-5 h-28 animate-pulse flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20"></div>
            <div className="flex-1 space-y-4 pt-1">
              <div className="h-4 w-1/3 bg-black/10 dark:bg-white/10 rounded-md"></div>
              <div className="flex justify-between w-full mt-2">
                {[1,2,3,4,5,6,7].map((i) => (
                  <div key={i} className="h-6 w-6 rounded-md bg-black/5 dark:bg-white/5"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Your Books Skeleton */}
        <div className="mt-12 space-y-4">
          <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded-md mb-4 ml-1 animate-pulse"></div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[200px] aspect-[2/3] rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse border border-black/10 dark:border-white/10"></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
