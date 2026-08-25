import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { NewProjectForm } from "@/components/project/NewProjectForm";

export default function NewProjectPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col w-full px-3 sm:px-6 md:px-10 pt-2 sm:pt-6 pb-24 md:pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 sm:mb-10 border-b border-border pb-5">
        <Link 
          href="/library"
          className="p-2.5 -ml-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
          title="Back to Library"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2]" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manuscript Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground tracking-tight">
            The blank page awaits
          </h1>
          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground mt-1">
            Configure your story premise, target goal, and jacket artwork
          </p>
        </div>
      </div>

      {/* Form Component */}
      <NewProjectForm />
    </div>
  );
}