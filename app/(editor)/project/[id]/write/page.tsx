"use client";

import { Suspense } from "react";
import { Loader2, Menu, Globe } from "lucide-react";
import NovelEditor from "@/components/editor/NovelEditor";
import EditorSidebar from "@/components/editor/EditorSidebar";
import AutoSaveIndicator from "@/components/shared/AutoSave";
import EditorWordCount from "@/components/editor/WordCount";
import PublishDialog from "@/components/editor/PublishDialog";

// Import our new Brain
import { EditorProvider, useEditorContext } from "./EditorContext";

function EditorLayout() {
  // Pull exactly what we need from the Cloud
  const {
    novel,
    activeChapter,
    isSidebarOpen,
    setIsSidebarOpen,
    saveStatus,
    isPublishModalOpen,
    setIsPublishModalOpen,
  } = useEditorContext();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden flex-row-reverse">
      {isPublishModalOpen && novel && <PublishDialog />}

      <EditorSidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="flex items-center justify-between px-6 py-3 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-md transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hidden sm:block">
              {novel.title || "Draft"}
            </span>
            <div className="w-px h-4 bg-border hidden md:block" />

            {/* AutoSave Indicator */}
            <AutoSaveIndicator state={saveStatus} className="hidden md:flex" />
          </div>

          <div className="flex items-center gap-4">
            <EditorWordCount
              count={activeChapter?.wordCount || 0}
              label="Words"
              className="hidden sm:flex"
            />
            <div className="w-px h-4 bg-border mx-2 hidden sm:block" />
            <button
              onClick={() => setIsPublishModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                novel.status === "published"
                  ? "bg-brand/10 text-brand hover:bg-brand/20"
                  : "border border-border bg-transparent text-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              {novel.status === "published" ? "Live" : "Publish"}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          <NovelEditor />
        </div>
      </main>
    </div>
  );
}

// The root page wraps the layout in the Provider
export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <EditorProvider>
        <EditorLayout />
      </EditorProvider>
    </Suspense>
  );
}
