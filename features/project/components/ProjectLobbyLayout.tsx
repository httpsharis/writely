import Link from "next/link";
import { Library, Loader2, BookOpen } from "lucide-react";
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
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-7 w-7 animate-spin text-brand" />
      </div>
    );

  if (error || !project)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <BookOpen className="w-10 h-10 text-muted-foreground/50 stroke-[1.5]" />
        <p className="font-serif text-2xl text-foreground">Manuscript Unavailable</p>
        <p className="text-xs uppercase tracking-widest text-muted-foreground max-w-sm">
          The requested novel could not be loaded or is not accessible.
        </p>
        <Link 
          href="/library" 
          className="mt-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all"
        >
          Return to Library
        </Link>
      </div>
    );

  const goal = project.targetWords ?? 5000;
  const progressPercent =
    goal > 0 ? Math.min(Math.round((displayWordCount / goal) * 100), 100) : 0;

  return (
    <div className="min-h-screen bg-transparent font-sans text-foreground">
      <main className="mx-auto max-w-[1100px] px-4 sm:px-6 md:px-8 pb-24 pt-4 md:pt-10">
        {/* Header Bar */}
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
          <div className="flex-1 min-w-0">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Library className="h-3.5 w-3.5 text-brand" />
              <span>{isReadOnly ? "Reading Room" : "Author's Desk"}</span>
            </div>
            <InlineEdit
              isReadOnly={isReadOnly}
              value={project.title || "Untitled Masterpiece"}
              onSave={(val) => handleUpdate("title", val)}
              className="m-0 font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-foreground"
            />
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-end justify-start md:justify-end gap-5 md:gap-8 pb-1 border-t md:border-t-0 border-border/40 pt-4 md:pt-0">
            <div className="hidden md:flex flex-col items-end">
              <span className="font-mono text-xl md:text-2xl font-light text-foreground">
                {project.viewsCount?.toLocaleString() || 0}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Views
              </span>
            </div>

            <div className="hidden md:flex flex-col items-end">
              <span className="font-mono text-xl md:text-2xl font-light text-foreground">
                {project.likesCount?.toLocaleString() || 0}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Likes
              </span>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <span className="font-mono text-xl md:text-2xl font-light text-foreground">
                {chapters.length}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Chapters
              </span>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <span className="font-mono text-xl md:text-2xl font-light text-brand">
                {displayWordCount.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Words ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>

        <hr className="my-6 md:my-8 border-t border-border" />

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:gap-14 lg:grid-cols-[280px_1px_1fr]">
          <ProjectSidebar
            project={project}
            isReadOnly={isReadOnly}
            isUploading={isUploading}
            onUpdate={handleUpdate}
            onFileUpload={handleFileUpload}
          />

          <div className="hidden h-full w-full bg-border lg:block" />

          <div className="flex flex-col min-w-0">
            <div className="mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Author&apos;s Note
              </h4>
              <InlineEdit
                isReadOnly={isReadOnly}
                multiline
                placeholder="Leave a note for your readers or a reminder for yourself..."
                value={project.authorNote || ""}
                onSave={(val) => handleUpdate("authorNote", val)}
                className="-ml-2 p-3 border-l-2 border-brand/50 pl-4 font-serif text-[15px] sm:text-[16px] italic leading-relaxed text-foreground bg-secondary/10 rounded-r-lg"
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