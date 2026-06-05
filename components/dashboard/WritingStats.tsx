import { Target, Flame, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WritingStatsProps {
  isLoading?: boolean;
  stats?: {
    dailyGoalProgress: number;
    dailyGoalTarget: number;
    currentStreak: number;
    totalWords: number;
  };
}

export function WritingStats({ isLoading, stats }: WritingStatsProps) {
  const progress = stats?.dailyGoalProgress ?? 0;
  const target = stats?.dailyGoalTarget ?? 2000; // Keep 2000 as the default goal
  const totalWords = stats?.totalWords ?? 0;
  const streak = stats?.currentStreak ?? 0;

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(progress / target, 1);
  const strokeDashoffset = circumference - percentage * circumference;

  const nextMilestone = Math.floor(totalWords / 10000) * 10000 + 10000;
  const milestonePercentage = Math.min(
    ((totalWords % 10000) / 10000) * 100,
    100,
  );

  return (
    <section className="flex flex-col gap-5 md:gap-6 shrink-0 w-full">
      <h2 className="text-xs md:text-sm font-bold tracking-widest text-foreground uppercase flex items-center gap-4">
        Writing Analytics
        <span className="h-px flex-1 bg-border" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border">
        {/* --- 1. Daily Goal --- */}
        <div className="flex flex-col items-center md:items-start justify-between h-full py-8 md:py-10 md:pr-10 group cursor-default text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5 mb-6 md:mb-8 text-foreground group-hover:text-brand transition-colors duration-300 w-full">
            <Target className="w-4 h-4 md:w-5 md:h-5 stroke-2" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Daily Goal
            </span>
          </div>

          {isLoading ? (
            <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-full mt-auto shrink-0 mx-auto md:mx-0" />
          ) : (
            <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mt-auto shrink-0 mx-auto md:mx-0">
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  className="stroke-border/50"
                  strokeWidth="3.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  className="stroke-brand transition-all duration-1000 ease-out"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="flex flex-col items-center justify-center absolute inset-0 text-center">
                <span className="text-lg md:text-xl font-serif font-bold text-foreground tracking-tight leading-none group-hover:scale-105 transition-transform duration-300">
                  {progress.toLocaleString()}
                </span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
                  / {target.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* --- 2. Current Streak --- */}
        <div className="flex flex-col items-center md:items-start justify-between h-full py-8 md:py-10 md:px-10 group cursor-default text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5 mb-6 md:mb-8 text-brand w-full">
            <Flame className="w-4 h-4 md:w-5 md:h-5 stroke-2" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Current Streak
            </span>
          </div>

          {isLoading ? (
            <Skeleton className="h-16 w-full mt-auto" />
          ) : (
            <div className="flex flex-col items-center md:items-start w-full mt-auto">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-6xl font-serif font-bold text-foreground tracking-tight leading-none group-hover:scale-105 origin-center md:origin-left transition-transform duration-300">
                  {streak}
                </span>
                <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Days
                </span>
              </div>

              {/* 7-Day Micro-Calendar */}
              <div className="flex items-center gap-1.5 mt-4">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${day <= 5 ? "bg-brand" : "bg-border"}`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground mt-2 font-medium">
                2 days from personal best
              </span>
            </div>
          )}
        </div>

        {/* --- 3. Total Manuscript --- */}
        <div className="flex flex-col items-center md:items-start justify-between h-full py-8 md:py-10 md:pl-10 group cursor-default text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5 mb-6 md:mb-8 text-foreground group-hover:text-brand transition-colors duration-300 w-full">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5 stroke-2" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Total Manuscript
            </span>
          </div>

          {isLoading ? (
            <Skeleton className="h-16 w-full mt-auto" />
          ) : (
            <div className="flex flex-col items-center md:items-start w-full mt-auto">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight leading-none group-hover:scale-105 origin-center md:origin-left transition-transform duration-300">
                  {totalWords.toLocaleString()}
                </span>
                <span className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Words
                </span>
              </div>

              {/* Linear Milestone Track */}
              <div className="w-full h-1 bg-border/50 rounded-full mt-5 overflow-hidden flex">
                <div
                  className="h-full bg-foreground transition-all duration-1000 ease-out"
                  style={{ width: `${milestonePercentage}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground mt-2 font-medium uppercase tracking-widest flex w-full justify-between">
                <span>Milestone Track</span>
                <span>{nextMilestone.toLocaleString()}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
