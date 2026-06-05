import {
  FileText,
  Users,
  Globe,
  ArrowRight,
  BookOpen,
  Map,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface RecentFile {
  id: string | number;
  title: string;
  type: string;
  timeAgo: string;
  category: "character" | "lore" | "location" | "chapter" | "novel";
}

interface RecentWorkspaceProps {
  isLoading?: boolean;
  files?: RecentFile[];
}

export function RecentWorkspace({
  isLoading,
  files = [],
}: RecentWorkspaceProps) {
  // UX Critique Applied: Micro-Color Coding
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "character":
        return {
          icon: Users,
          color:
            "border-l-rose-500/50 group-hover:border-l-rose-500 text-rose-500/80 group-hover:text-rose-500",
        };
      case "lore":
        return {
          icon: Globe,
          color:
            "border-l-purple-500/50 group-hover:border-l-purple-500 text-purple-500/80 group-hover:text-purple-500",
        };
      case "location":
        return {
          icon: Map,
          color:
            "border-l-teal-500/50 group-hover:border-l-teal-500 text-teal-500/80 group-hover:text-teal-500",
        };
      case "chapter":
      case "novel":
        return {
          icon: BookOpen,
          color:
            "border-l-brand/50 group-hover:border-l-brand text-brand/80 group-hover:text-brand",
        };
      default:
        return {
          icon: FileText,
          color:
            "border-l-muted-foreground/50 group-hover:border-l-foreground text-muted-foreground group-hover:text-foreground",
        };
    }
  };

  // 1. Loading State
  if (isLoading) return <RecentWorkspaceSkeleton />;

  // 2. Premium Empty State
  if (files.length === 0) {
    return (
      <section className="flex flex-col gap-6 shrink-0 w-full pb-10">
        <h2 className="text-xs md:text-sm font-bold tracking-widest text-foreground uppercase flex items-center gap-4">
          Recent Workspace
          <span className="h-px flex-1 bg-border" />
        </h2>
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-transparent md:hover:border-border/40 transition-all duration-500">
          <p className="font-serif italic text-muted-foreground text-lg">
            Your library is currently empty.
          </p>
          <p className="text-[10px] md:text-xs text-muted-foreground/60 uppercase tracking-widest font-bold mt-3">
            Drafts, chapters, and notes will appear here.
          </p>
        </div>
      </section>
    );
  }

  // 3. Loaded Data State
  return (
    <section className="flex flex-col gap-6 shrink-0 w-full pb-10">
      <h2 className="text-xs md:text-sm font-bold tracking-widest text-foreground uppercase flex items-center gap-4">
        Recent Workspace
        <span className="h-px flex-1 bg-border" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 pt-2">
        {files.map((file) => {
          const { icon: Icon, color } = getCategoryTheme(file.category);

          return (
            <button
              key={file.id}
              className="group flex items-center justify-between p-3 -mx-3 rounded-2xl border border-transparent bg-secondary/10 hover:border-border/40 hover:bg-secondary/30 transition-all duration-300 text-left"
            >
              <div className="flex items-center gap-5 min-w-0">
                {/* Micro-Color Coded Icon Container */}
                <div
                  className={`flex items-center justify-center h-12 w-12 rounded-xl bg-secondary/30 border-l-[3px] transition-colors duration-300 shrink-0 ${color}`}
                >
                  <Icon className="w-5 h-5 stroke-2" />
                </div>

                {/* Typography Block */}
                <div className="flex flex-col gap-1 min-w-0 pr-4">
                  <span className="font-bold text-foreground text-sm tracking-tight group-hover:text-brand transition-colors duration-300 line-clamp-1">
                    {file.title}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    {file.type}
                    <span className="opacity-40">•</span>
                    <span className="capitalize tracking-normal line-clamp-1">
                      {file.timeAgo}
                    </span>
                  </span>
                </div>
              </div>

              {/* Interaction Indicator */}
              <ArrowRight className="w-5 h-5 text-brand stroke-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shrink-0" />
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ==========================================
// 4. Skeleton Loader
// ==========================================
function RecentWorkspaceSkeleton() {
  return (
    <section className="flex flex-col gap-6 shrink-0 w-full pb-10">
      <h2 className="text-xs md:text-sm font-bold tracking-widest text-foreground uppercase flex items-center gap-4">
        Recent Workspace
        <span className="h-px flex-1 bg-border" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-5 p-3 -mx-3">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="h-4 w-3/4 rounded-sm" />
              <Skeleton className="h-3 w-1/3 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
