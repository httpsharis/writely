export default function DashboardLoading() {
  return (
    <div className="w-full max-w-[720px] mx-auto px-6 py-12 md:py-20 flex flex-col min-h-screen">
      
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-pulse shrink-0">
        <div className="flex flex-col gap-3">
          <div className="h-10 md:h-[44px] w-[250px] md:w-[320px] rounded-md bg-foreground/10" />
          <div className="h-[22px] w-[180px] md:w-[220px] rounded-md bg-foreground/5" />
        </div>
        <div className="hidden md:block h-[42px] w-[140px] rounded-full bg-foreground/5 border border-border" />
      </div>

      {/* Active Project Hero Skeleton */}
      <div className="flex flex-col gap-4 mb-16 animate-pulse shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-3 w-40 rounded bg-foreground/10" />
          <div className="h-px flex-1 bg-border/50" />
        </div>
        <div className="flex items-start gap-6 pt-4">
          <div className="h-14 w-14 rounded-2xl bg-foreground/5 border border-border" />
          <div className="flex flex-col gap-3">
            <div className="h-8 w-[280px] md:w-[400px] rounded bg-foreground/10" />
            <div className="h-5 w-[120px] rounded bg-foreground/5" />
          </div>
        </div>
      </div>

      <hr className="border-border my-4 md:my-8" />

      {/* Writing Stats Invisible Grid Skeleton */}
      <div className="flex flex-col gap-4 mb-16 animate-pulse shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-3 w-32 rounded bg-foreground/10" />
          <div className="h-px flex-1 bg-border/50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col py-6 md:py-8 px-0 md:px-8 first:pl-0 last:pr-0">
              <div className="h-3 w-24 rounded bg-foreground/5 mb-3" />
              <div className="h-10 w-20 rounded bg-foreground/10" />
            </div>
          ))}
        </div>
      </div>

      <hr className="border-border my-4 md:my-8" />

      {/* Recent Workspace List Skeleton */}
      <div className="flex flex-col gap-4 animate-pulse pb-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-3 w-36 rounded bg-foreground/10" />
          <div className="h-px flex-1 bg-border/50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-foreground/5 shrink-0" />
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 w-3/4 rounded bg-foreground/10" />
                <div className="h-3 w-1/3 rounded bg-foreground/5" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}