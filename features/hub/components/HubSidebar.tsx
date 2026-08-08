import Image from "next/image";
import { Heart, BookOpen } from "lucide-react";
import type { PopulatedProject } from "../hooks/useHubEngine";

export const HubSidebar = ({ project }: { project: PopulatedProject }) => (
  <div className="flex flex-col">
    
    {/* Identity Block (Title, Author, Meta) */}
    <div className="mb-10 text-center lg:text-left">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#948fa0]">
        By {project.owner?.name || "Unknown Author"}
      </p>
      <h1 className="mb-4 font-serif text-4xl md:text-5xl tracking-tight text-[#ede9e2]">
        {project.title || "Untitled Novel"}
      </h1>
      <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-[11px] text-[#948fa0] lg:justify-start">
        <span className="flex items-center gap-1.5" title="Likes">
          <Heart className="h-3.5 w-3.5 fill-current text-[#c9975a]" /> {project.likesCount || 0}
        </span>
        <span className="flex items-center gap-1.5" title="Views">
          <svg className="h-3.5 w-3.5 text-[#5c5868]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          {(project.viewsCount || 0).toLocaleString()}
        </span>
        <span className="h-1 w-1 rounded-full bg-[#5c5868]/50" />
        <span className="flex items-center gap-1.5" title="Word Count">
          <BookOpen className="h-3.5 w-3.5 text-[#5c5868]" /> {(project.wordCount || 0).toLocaleString()} words
        </span>
      </div>
    </div>

    {/* Cover Art */}
    <div className="relative mx-auto mb-10 flex aspect-[2/3] w-full max-w-[280px] flex-col items-center justify-center overflow-hidden rounded-md border border-white/5 bg-[#1b1a21]/50 text-[#5c5868] lg:max-w-none">
      {project.coverImage ? (
        <Image src={project.coverImage} alt="Cover" fill className="object-cover" />
      ) : (
        <span className="font-serif text-sm text-[#5c5868]/50">No cover art</span>
      )}
    </div>

    {/* Synopsis */}
    <div className="mb-8 flex flex-col">
      <span className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#5c5868]">Synopsis</span>
      <p className="m-0 whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-[#948fa0]">
        {project.synopsis || "No synopsis available for this manuscript."}
      </p>
    </div>

    {/* Status Footer */}
    <div className="flex flex-col gap-2 pt-6 border-t border-white/5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c5868]">Status</span>
        <span className="flex items-center gap-2 text-xs text-[#ede9e2]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7cbf8e]" /> Published
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c5868]">Updated</span>
        <span className="font-mono text-[11px] text-[#ede9e2]">
          {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
        </span>
      </div>
    </div>
  </div>
);