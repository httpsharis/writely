import Image from "next/image";
import { Heart, BookOpen, Eye } from "lucide-react";
import type { PopulatedProject } from "../hooks/useHubEngine";
import { getBookCoverUrl } from "@/lib/cloudinary";

export const HubSidebar = ({ project }: { project: PopulatedProject }) => (
  <div className="flex flex-col">
    
    {/* Identity Block (Title, Author, Meta) */}
    <div className="mb-10 text-center lg:text-left">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        By {project.owner?.name || "Unknown Author"}
      </p>
      <h1 className="mb-4 font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight text-foreground">
        {project.title || "Untitled Novel"}
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] text-muted-foreground lg:justify-start">
        <span className="flex items-center gap-1.5" title="Likes">
          <Heart className="h-3.5 w-3.5 fill-current text-brand" /> {project.likesCount || 0}
        </span>
        <span className="flex items-center gap-1.5" title="Views">
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          {(project.viewsCount || 0).toLocaleString()}
        </span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span className="flex items-center gap-1.5" title="Word Count">
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" /> {(project.wordCount || 0).toLocaleString()} words
        </span>
      </div>
    </div>

    {/* Cover Art */}
    <div className="relative mx-auto mb-10 flex aspect-[2/3] w-full max-w-[280px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary/30 text-muted-foreground lg:max-w-none shadow-xl">
      {project.coverImage ? (
        <Image 
          src={getBookCoverUrl(project.coverImage, 600)} 
          alt="Cover" 
          fill 
          sizes="(max-width: 1024px) 280px, 400px"
          className="object-cover" 
        />
      ) : (
        <span className="font-serif text-sm text-muted-foreground/60 italic">No cover art</span>
      )}
    </div>

    {/* Synopsis */}
    <div className="mb-8 flex flex-col">
      <span className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synopsis</span>
      <p className="m-0 whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-foreground/80">
        {project.synopsis || "No synopsis available for this manuscript."}
      </p>
    </div>

    {/* Status Footer */}
    <div className="flex flex-col gap-2 pt-6 border-t border-border">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</span>
        <span className="flex items-center gap-2 text-xs text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Published
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Updated</span>
        <span className="font-mono text-[11px] text-foreground" suppressHydrationWarning>
          {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
        </span>
      </div>
    </div>
  </div>
);