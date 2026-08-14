"use client";

import { Library, Loader2 } from "lucide-react";
import InlineEdit from "@/components/ui/InlineEdit";
import { useProjectHub } from "../hooks/useProjectHub";
import { ProjectSidebar } from "./ProjectSidebar";
import { ManuscriptList } from "./ManuscriptList";
import { CharacterManager } from "./CharacterManager";

export function ProjectLobbyLayout({ projectId }: { projectId: string }) {
  const {
    project,
    isLoading,
    error,
    isReadOnly,
    isPublished,
    chapters,
    displayWordCount,
    isUploading,
    handleUpdate,
    handleFileUpload,
    handleCreateChapter,
    handleChapterUpdate,
  } = useProjectHub(projectId);

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#131217]">
        <Loader2 className="h-6 w-6 animate-spin text-[#c9975a]" />
      </div>
    );
  if (error || !project || (isReadOnly && !isPublished))
    return (
      <div className="flex h-screen items-center justify-center bg-[#131217]">
        <p className="text-[#5c5868]">Manuscript Unavailable.</p>
      </div>
    );

  const goal = project.targetWords ?? 5000;
  const progressPercent =
    goal > 0 ? Math.min(Math.round((displayWordCount / goal) * 100), 100) : 0;

  return (
    <div className="min-h-screen bg-transparent font-sans text-[#ede9e2]">
      {/* 🟢 MOBILE FIX: Responsive padding and top margin */}
      <main className="mx-auto max-w-[1080px] px-5 md:px-8 pb-20 pt-8 md:pt-16">
        {/* 🟢 MOBILE FIX: flex-col on mobile, flex-row on desktop */}
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#5c5868]">
              <Library className="h-3.5 w-3.5" />
              {isReadOnly ? "Reading Room" : "Author's Desk"}
            </div>
            {/* 🟢 MOBILE FIX: Scaled text size for mobile */}
            <InlineEdit
              isReadOnly={isReadOnly}
              value={project.title || "Untitled Masterpiece"}
              onSave={(val) => handleUpdate("title", val)}
              className="m-0 font-serif text-3xl sm:text-[44px] font-medium leading-tight sm:leading-none tracking-tight"
            />
          </div>

          <div className="flex flex-wrap items-end justify-start md:justify-end gap-5 md:gap-8 pb-2">
            <div className="hidden md:flex flex-col items-end">
              <span className="font-['JetBrains_Mono'] text-xl md:text-2xl font-light text-[#ede9e2]">
                {project.viewsCount?.toLocaleString() || 0}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#5c5868]">
                Views
              </span>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <span className="font-['JetBrains_Mono'] text-xl md:text-2xl font-light text-[#ede9e2]">
                {project.likesCount?.toLocaleString() || 0}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#5c5868]">
                Likes
              </span>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <span className="font-['JetBrains_Mono'] text-xl md:text-2xl font-light text-[#ede9e2]">
                {chapters.length}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#5c5868]">
                Chapters
              </span>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <span className="font-['JetBrains_Mono'] text-xl md:text-2xl font-light text-[#c9975a]">
                {displayWordCount.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#5c5868]">
                Words ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        <hr className="my-8 md:my-10 border-t border-white/10" />

        {/* 🟢 MOBILE FIX: Adjusted grid gap for mobile */}
        <div className="grid grid-cols-1 items-start gap-8 lg:gap-16 lg:grid-cols-[264px_1px_1fr]">
          <ProjectSidebar
            project={project}
            isReadOnly={isReadOnly}
            isUploading={isUploading}
            onUpdate={handleUpdate}
            onFileUpload={handleFileUpload}
          />

          <div className="hidden h-full w-full bg-white/10 lg:block" />

          <div className="flex flex-col">
            <div className="mb-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#5c5868] mb-3">
                Author&apos;s Note
              </h4>
              <InlineEdit
                isReadOnly={isReadOnly}
                multiline
                placeholder="Leave a note for your readers or a reminder for yourself..."
                value={project.authorNote || ""}
                onSave={(val) => handleUpdate("authorNote", val)}
                className="-ml-2 p-2 border-l-2 border-[#c9975a]/30 pl-4 font-serif text-[15px] sm:text-[16px] italic leading-relaxed text-[#ede9e2]"
              />
            </div>

            {!isReadOnly && (
              <CharacterManager project={project} handleUpdate={handleUpdate} />
            )}

            <ManuscriptList
              projectId={projectId}
              chapters={chapters}
              isReadOnly={isReadOnly}
              onCreateChapter={handleCreateChapter}
              onUpdateChapter={handleChapterUpdate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}