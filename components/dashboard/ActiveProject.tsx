import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/shared/Skeleton";

export interface ActiveProjectProps {
  project?: {
    id: string;
    title: string;
    currentChapter: string;
    words: string | number;
  };
  isLoading?: boolean;
}

export function ActiveProject({ project, isLoading }: ActiveProjectProps) {
  
  // 3. The Phantom UI Loading State
  if (isLoading || !project) {
    return (
      <div className="group relative overflow-hidden rounded-[32px] border border-border bg-foreground/[0.02] p-8 sm:p-10 flex flex-col justify-between min-h-[300px]">
        <div>
          <Skeleton className="w-32 h-6 rounded-full mb-6" />
          <Skeleton className="w-3/4 h-10 mb-3" />
          <Skeleton className="w-1/2 h-5" />
        </div>
        <Skeleton className="w-48 h-12 rounded-full mt-12" />
      </div>
    );
  }

  // 4. The Fully Loaded Dynamic State
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-border bg-background p-8 sm:p-10 flex flex-col justify-between min-h-[300px] transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20">

      {/* Animated Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 border border-border text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-[pulse_2s_ease-in-out_infinite]" />
          Active Project
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
          {project.title}
        </h2>
        <p className="text-foreground/60 font-medium flex items-center gap-2">
          {project.currentChapter} <span className="opacity-50">•</span> {project.words} words
        </p>
      </div>

      <div className="relative z-10 mt-12">
        <Link 
          href={`/project/${project.id}`}
          className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-full font-semibold text-sm transition-transform active:scale-95 w-max"
        >
          Continue Writing
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </Link>
      </div>
    </div>
  );
}