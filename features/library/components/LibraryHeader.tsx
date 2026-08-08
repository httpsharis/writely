import Link from "next/link";
import { Plus } from "lucide-react";

interface LibraryHeaderProps {
  totalCount: number;
}

export function LibraryHeader({ totalCount }: LibraryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-8 mb-10 gap-6">
      <div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mb-2">
          Library
        </h1>
        <p className="text-sm text-muted-foreground tracking-widest uppercase">
          {totalCount} {totalCount === 1 ? "Manuscript" : "Manuscripts"}
        </p>
      </div>
      
      <Link 
        href="/project/new" 
        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all w-fit shrink-0"
      >
        <Plus className="w-3 h-3" />
        New Project
      </Link>
    </div>
  );
}