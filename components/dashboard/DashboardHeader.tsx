"use client";

import { useSession } from "next-auth/react";
import { Plus, Flame } from "lucide-react";

export function DashboardHeader() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "Writer";

  return (
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white">
            Welcome back, {firstName}.
          </h1>
          {/* THE NEW STREAK BADGE */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-full text-xs font-bold uppercase tracking-wider border border-orange-500/20">
            <Flame className="w-3.5 h-3.5" />
            3-Day Streak
          </div>
        </div>
        <p className="text-sm text-black/50 dark:text-white/50 font-medium">
          Ready to continue your universe?
        </p>
      </div>
      
      <button className="hidden sm:flex items-center gap-2 bg-white dark:bg-[#111] border border-black/[0.08] dark:border-white/10 px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 active:scale-[0.98] transition-all shadow-sm text-black dark:text-white">
        <Plus className="w-4 h-4" />
        Quick Capture
      </button>
    </header>
  );
}