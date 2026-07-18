"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import NovelEditor from "@/components/editor/NovelEditor";
import EditorSidebar from "@/components/editor/EditorSidebar";
import PublishDialog from "@/components/editor/PublishDialog";

import { EditorProvider, useEditorContext } from "./EditorContext";

function EditorLayout() {
  const {
    novel,
    activeChapter,
    isSidebarOpen,
    setIsSidebarOpen,
    saveStatus,
    isPublishModalOpen,
    setIsPublishModalOpen,
    liveWordCount,
  } = useEditorContext();

  const isPublished = novel?.status === "published";

  return (
    <div className="grid grid-rows-[auto_2px_1fr] h-screen overflow-hidden bg-editor-bg text-editor-text-primary font-['Inter'] antialiased selection:bg-editor-gold-soft selection:text-editor-text-primary">
      {isPublishModalOpen && novel && <PublishDialog />}

      <header className="flex items-center justify-between px-6 h-14 border-b border-editor-border bg-editor-bg">
        <div className="flex items-center gap-4">
          <Link
            href={`/project/${novel?._id}`}
            className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary focus-visible:outline-2 focus-visible:outline-editor-gold-dim focus-visible:outline-offset-2"
            aria-label="Back to project"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="flex items-center gap-2 text-[13px] text-editor-text-secondary whitespace-nowrap">
            <span className="font-['Fraunces'] text-[15px] font-medium text-editor-text-primary tracking-[0.01em]">{novel?.title || "Draft"}</span>
            <span className="text-editor-text-tertiary">/</span>
            <span className="text-editor-text-secondary">{activeChapter?.title || "Untitled Chapter"}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end leading-[1.15]">
            <span className="font-['JetBrains_Mono'] text-[14px] font-medium text-editor-text-primary tabular-nums">{liveWordCount.toLocaleString()}</span>
            <span className="text-[10px] tracking-[0.08em] text-editor-text-tertiary uppercase">Words</span>
          </div>
          <div className="w-px h-5 bg-editor-border-strong"></div>
          <div className="flex items-center gap-[7px] px-[11px] py-[5px] rounded-[20px] border border-editor-border-strong text-[12px] text-editor-text-secondary bg-editor-surface">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200 ${saveStatus === 'saving' ? 'bg-editor-gold animate-editor-pulse' : 'bg-editor-green'}`}></span>
            <span>{saveStatus === 'saving' ? 'Saving' : 'Saved'}</span>
          </div>
          <button
            className="flex items-center gap-[7px] px-4 py-2 rounded-[20px] border border-editor-gold-dim bg-transparent text-editor-gold text-[13px] font-semibold tracking-[0.01em] transition-colors hover:bg-editor-gold-soft focus-visible:outline-2 focus-visible:outline-editor-gold-dim focus-visible:outline-offset-2 cursor-pointer"
            onClick={() => setIsPublishModalOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></svg>
            {isPublished ? "Live" : "Publish"}
          </button>
          <div className="w-px h-5 bg-editor-border-strong"></div>
          <button
            className="flex items-center justify-center w-8 h-8 rounded-md border-none bg-transparent text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary focus-visible:outline-2 focus-visible:outline-editor-gold-dim focus-visible:outline-offset-2 cursor-pointer"
            aria-label="Toggle Sidebar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-[17px] h-[17px]"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        </div>
      </header>

      <div className="relative bg-transparent overflow-hidden">
        <div className={`absolute inset-0 bg-editor-gold origin-left opacity-0 transform scale-x-0 ${saveStatus === 'saving' ? 'animate-editor-fill' : ''}`}></div>
      </div>

      <div className={`grid ${isSidebarOpen ? 'grid-cols-[1fr_320px]' : 'grid-cols-1'} min-h-0 max-w-[100vw]`}>
        <NovelEditor />
        {isSidebarOpen && <EditorSidebar />}
      </div>
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
