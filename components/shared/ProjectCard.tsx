"use client";

import { useRouter } from "next/navigation";
import { FileText, Clock, Trash2 } from "lucide-react";
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
      className="group flex flex-col justify-between p-6 transition-all duration-300 hover:bg-secondary/20 rounded-lg border border-transparent hover:border-border/40 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="pr-6">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-muted-foreground transition-colors line-clamp-1">
            {project.title || "Untitled"}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {project.type || "Novel"}
          </p>
        </div>
        <button 
          onClick={handleDelete}
          className="p-2 transition-all rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
          aria-label="Delete project"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-widest font-bold text-foreground border border-border/60 px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm">
          {project.status || "Drafting"}
        </span>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <FileText className="w-3.5 h-3.5" />
          {(project.wordCount || 0).toLocaleString()} w
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {project.updatedAt 
            ? new Date(project.updatedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric"
              })
            : "Recently"}
        </div>
      </div>
    </div>
  );
}