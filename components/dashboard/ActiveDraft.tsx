import { PenLine, Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ActiveDraftProps {
  isLoading?: boolean;
  draft?: {
    novelTitle?: string;
    title: string;
    status: string;
    timeAgo: string;
    wordCount?: number;
  };
}

export function ActiveDraft({ isLoading, draft }: ActiveDraftProps) {
  // 1. Loading State
  if (isLoading) return <ActiveDraftSkeleton />;

  // 2. Premium Empty State
  if (!draft) {
    return (
      <section className="relative flex flex-col items-center justify-center gap-3 py-16 md:py-20 mb-6 md:mb-8 shrink-0 w-full group p-4 md:p-6 rounded-2xl border border-transparent md:hover:border-border/40 md:hover:bg-secondary/10 transition-all duration-500 cursor-pointer">
        <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-secondary/30 text-muted-foreground group-hover:text-brand group-hover:bg-secondary/50 transition-colors duration-300 mb-2">
          <PenLine className="h-5 w-5 md:h-6 md:w-6 stroke-[1.5]" />
        </div>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground tracking-tight">
          The blank page awaits
        </h3>
        <p className="text-xs md:text-sm font-medium text-muted-foreground tracking-widest uppercase mt-1">
          Begin your next masterpiece
        </p>
        <div className="mt-4 md:mt-6 px-6 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground border border-border/50 rounded-full group-hover:bg-foreground group-hover:text-background transition-all duration-300">
          Create New Novel
        </div>
      </section>
    );
  }

  // 3. Loaded Data State
  return (
    <section className="relative flex flex-col gap-5 md:gap-6 mb-6 md:mb-8 shrink-0 w-full group cursor-pointer p-4 md:p-6 -mx-4 md:-mx-6 rounded-2xl border border-transparent md:hover:border-border/40 md:hover:bg-secondary/20 transition-all duration-500">
      <h2 className="text-xs md:text-sm font-bold tracking-widest text-foreground uppercase flex items-center gap-4">
        Pick up where you left off
        <span className="h-px flex-1 bg-border" />
      </h2>

      <div className="flex items-center justify-between w-full gap-2 md:gap-4">
        <div className="flex items-start gap-3 md:gap-6 w-full min-w-0">
          <div className="flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl md:rounded-2xl bg-secondary/50 text-muted-foreground group-hover:text-brand group-hover:bg-secondary transition-colors duration-300">
            <PenLine className="h-5 w-5 md:h-6 md:w-6 stroke-2" />
          </div>

          <div className="flex flex-col gap-1.5 md:gap-2 flex-1 min-w-0">
            <div className="flex flex-col gap-0.5 md:gap-1.5">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80 line-clamp-1">
                {draft.novelTitle || "Workspace"}
              </span>
              <h3 className="text-xl md:text-4xl font-serif font-bold text-foreground tracking-tight md:group-hover:text-brand transition-colors duration-300 leading-tight md:leading-none line-clamp-2 md:line-clamp-none pr-2">
                {draft.title}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2 md:gap-x-3 text-xs md:text-sm text-muted-foreground font-medium mt-1">
              <span className="uppercase tracking-widest text-[9px] md:text-[10px] font-bold text-brand border border-brand/30 bg-brand/5 px-2 py-0.5 rounded-sm shrink-0">
                {draft.status}
              </span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span className="flex items-center gap-1.5 italic font-serif shrink-0">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-2" />
                {draft.timeAgo}
              </span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span className="flex items-center gap-1.5 italic font-serif shrink-0">
                <span className="font-sans text-[9px] md:text-[11px] font-bold uppercase tracking-widest opacity-60">
                  Words:
                </span>
                {draft.wordCount?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic "Continue Writing" Action Pill */}
        <div className="hidden md:flex items-center overflow-hidden rounded-full bg-foreground text-background h-10 px-0 group-hover:px-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out shrink-0 gap-2">
          <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap opacity-0 w-0 group-hover:w-auto group-hover:opacity-100 transition-all duration-300 delay-100">
            Continue
          </span>
          <ArrowRight className="h-4 w-4 stroke-2 shrink-0" />
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 4. Skeleton Loader (Fixes your missing name error)
// ==========================================
function ActiveDraftSkeleton() {
  return (
    <section className="relative flex flex-col gap-5 md:gap-6 mb-6 md:mb-8 shrink-0 w-full p-4 md:p-6 -mx-4 md:-mx-6 rounded-2xl border border-transparent">
      <h2 className="text-xs md:text-sm font-bold tracking-widest text-foreground uppercase flex items-center gap-4">
        Pick up where you left off
        <span className="h-px flex-1 bg-border" />
      </h2>

      <div className="flex items-center justify-between w-full gap-2 md:gap-4">
        <div className="flex items-start gap-3 md:gap-6 w-full min-w-0">
          <Skeleton className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl shrink-0" />

          <div className="flex flex-col gap-1.5 md:gap-2 flex-1 min-w-0">
            <div className="flex flex-col gap-2 mb-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 md:h-10 w-full max-w-md" />
            </div>

            <div className="flex items-center gap-3 mt-1">
              <Skeleton className="h-5 w-16 rounded-sm" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}