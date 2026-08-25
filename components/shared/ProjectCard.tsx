"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FileText, Clock, Trash2, Heart, Eye } from "lucide-react";
import { toast } from "sonner";
import type { NovelDocument } from "@/hooks/useLibraryData"; 
import { useTrashDocumentMutation } from "@/redux/features/documents/documentApi";
import { getBookCoverUrl } from "@/lib/cloudinary";

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
    if (window.confirm(`Are you sure you want to move "${project.title || 'Untitled'}" to the trash?`)) {
      try {
        await trashDocument(project._id).unwrap();
        toast.success(`"${project.title || 'Manuscript'}" moved to trash.`);
      } catch (err) {
        console.error("Failed to delete document:", err);
        toast.error("Failed to move manuscript to trash.");
      }
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5"
    >
      {/* Cover Image Area */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary/30 sm:aspect-[2/1] md:aspect-[3/2]">
        {project.coverImage ? (
          <Image 
            src={getBookCoverUrl(project.coverImage, 480)} 
            alt={project.title || "Novel Cover"} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/20">
            <span className="font-serif text-base text-muted-foreground/60 italic">No Cover Art</span>
          </div>
        )}
        
        {/* Status Badge Overlay */}
        <div className="absolute left-3.5 top-3.5">
          <span className={`rounded-md border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest backdrop-blur-md ${
            project.status === "published" 
              ? "border-green-600/30 bg-green-500/15 text-green-600 dark:text-green-400" 
              : "border-border/60 bg-card/80 text-foreground"
          }`}>
            {project.status || "Drafting"}
          </span>
        </div>

        {/* Delete Action Overlay */}
        <button 
          onClick={handleDelete}
          className="absolute right-3.5 top-3.5 rounded-full bg-card/80 p-2 text-muted-foreground backdrop-blur-md transition-colors hover:bg-rose-500 hover:text-white opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Delete project"
          title="Move to Trash"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Details Area */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-1 line-clamp-1 font-serif text-xl font-medium leading-tight text-foreground transition-colors group-hover:text-brand">
          {project.title || "Untitled Masterpiece"}
        </h3>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          {project.type || "Novel"}
        </p>
        
        {/* Stats Row */}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-border text-[11px] font-medium text-muted-foreground">
          <span className="flex items-center gap-1.5" title="Word Count">
            <FileText className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span className="font-mono">{(project.wordCount || 0).toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1.5" title="Views">
            <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span className="font-mono">{(project.viewsCount || 0).toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1.5" title="Likes">
            <Heart className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span className="font-mono">{(project.likesCount || 0).toLocaleString()}</span>
          </span>
          <span className="ml-auto flex items-center gap-1.5" title="Last Updated" suppressHydrationWarning>
            <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
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