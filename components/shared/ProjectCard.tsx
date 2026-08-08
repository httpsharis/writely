"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FileText, Clock, Trash2, Heart, Eye } from "lucide-react";
import type { NovelDocument } from "@/hooks/useLibraryData"; 
import { useTrashDocumentMutation } from "@/redux/features/documents/documentApi";

interface ProjectCardProps {
  project: NovelDocument;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const [trashDocument] = useTrashDocumentMutation();

  const handleCardClick = () => {
    router.push(`/project/${project._id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (window.confirm(`Are you sure you want to move "${project.title}" to the trash?`)) {
      try {
        await trashDocument(project._id).unwrap();
      } catch (err) {
        console.error("Failed to delete document:", err);
      }
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-white/5 bg-[#1b1a21] shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-[#c9975a]/30 hover:shadow-xl hover:shadow-[#c9975a]/5"
    >
      {/* Cover Image Area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#131217] sm:aspect-[2/1] md:aspect-[3/2]">
        {project.coverImage ? (
          <Image 
            src={project.coverImage} 
            alt={project.title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1b1a21] to-[#131217]">
            <span className="font-serif text-[18px] text-[#5c5868]/40">No Cover Art</span>
          </div>
        )}
        
        {/* Status Badge Overlay */}
        <div className="absolute left-4 top-4">
          <span className={`rounded-md border border-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest backdrop-blur-md ${
            project.status === "published" ? "bg-[#7cbf8e]/20 text-[#7cbf8e]" : "bg-black/40 text-[#ede9e2]"
          }`}>
            {project.status || "Drafting"}
          </span>
        </div>

        {/* Delete Action Overlay */}
        <button 
          onClick={handleDelete}
          className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-[#948fa0] backdrop-blur-md transition-colors hover:bg-red-500/20 hover:text-red-400 opacity-0 group-hover:opacity-100"
          aria-label="Delete project"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Details Area */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 line-clamp-1 font-serif text-[22px] font-medium leading-tight text-[#ede9e2] transition-colors group-hover:text-[#c9975a]">
          {project.title || "Untitled"}
        </h3>
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#5c5868]">
          {project.type || "Novel"}
        </p>
        
        {/* Stats Row */}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-white/5 text-[11px] font-medium text-[#948fa0]">
          <span className="flex items-center gap-1.5" title="Word Count">
            <FileText className="h-3.5 w-3.5 text-[#5c5868]" />
            {(project.wordCount || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5" title="Views">
            <Eye className="h-3.5 w-3.5 text-[#5c5868]" />
            {(project.viewsCount || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5" title="Likes">
            <Heart className="h-3.5 w-3.5 text-[#5c5868]" />
            {(project.likesCount || 0).toLocaleString()}
          </span>
          <span className="ml-auto flex items-center gap-1.5" title="Last Updated">
            <Clock className="h-3.5 w-3.5 text-[#5c5868]" />
            {project.updatedAt 
              ? new Date(project.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric"
                })
              : "Recently"}
          </span>
        </div>
      </div>
    </div>
  );
}