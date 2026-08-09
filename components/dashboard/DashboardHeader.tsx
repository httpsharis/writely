import { Moon, Plus, Sunset, Sun } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useState, useEffect } from "react";

interface DashboardHeaderProps {
  userName?: string;
  stats?: {
    dailyGoalProgress: number;
    dailyGoalTarget: number;
  };
}

type GreetingPeriod = {
  label: string;
  Icon: React.ElementType;
};

function getGreetingPeriod(): GreetingPeriod {
  const hour = new Date().getHours();
  if (hour < 12) return { label: "Good morning", Icon: Sun };
  if (hour < 18) return { label: "Good afternoon", Icon: Sunset };
  return { label: "Good evening", Icon: Moon };
}

export function DashboardHeader({ userName, stats }: DashboardHeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const firstName = userName?.split(" ")[0] || "Writer";
  const progress = stats?.dailyGoalProgress || 0;
  const target = stats?.dailyGoalTarget || 2000;

  const { label, Icon } = getGreetingPeriod();

  const wordsRemaining = target - progress;
  let dynamicSubtitle = "Your universe is waiting for you.";

  if (wordsRemaining > 0 && progress > 0) {
    dynamicSubtitle = `You're ${wordsRemaining.toLocaleString()} words from your daily goal — keep writing.`;
  } else if (wordsRemaining <= 0) {
    dynamicSubtitle = "Daily goal crushed. Your universe is expanding.";
  }

  return (
    // Switched to flex-col on mobile, added gap-5 for vertical rhythm
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6 md:mb-12 shrink-0">
      <div className="flex flex-col gap-1.5 md:gap-2">
        {/* Scaled down to text-3xl on mobile to prevent wrapping awkwardness */}
        <h1 className=" flex text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
          {mounted ? (
            label && (
              <>
                <Icon
                  className="w-7 h-7 md:w-9 md:h-9 text-amber-500 shrink-0 mt-3.5 mr-3"
                  strokeWidth={1.5}
                />
                {label}, {firstName}.
              </>
            )
          ) : (
            <span className="opacity-0">Loading...</span>
          )}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg font-medium">
          {mounted ? dynamicSubtitle : <span className="opacity-0">Loading...</span>}
        </p>
      </div>

      {/* Mobile Fix: Removed 'hidden'. Now it spans w-full on mobile, and shrinks on md: */}
      <Link
        href="/project/new"
        className="flex items-center justify-center md:justify-start gap-2.5 w-full md:w-auto px-6 py-3.5 md:py-3 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 uppercase tracking-widest text-xs font-bold shrink-0"
      >
        <Plus className="w-4 h-4 stroke-2" />
        Create Novel
      </Link>
    </header>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-6 mb-10 md:mb-12 shrink-0">
      <div className="flex flex-col gap-3 w-full md:w-auto">
        <Skeleton className="h-9 md:h-12 w-3/4 md:w-80 rounded-md" />
        <Skeleton className="h-5 w-2/3 md:w-56 rounded-md" />
      </div>
      <Skeleton className="h-12 md:h-11 w-full md:w-36 rounded-full" />
    </header>
  );
}
