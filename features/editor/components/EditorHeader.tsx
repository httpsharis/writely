"use client";

import Link from "next/link";
import { ArrowLeft, Globe, Menu } from "lucide-react";
import { useEditorContext } from "../context/EditorContext";

/**
 * EditorHeader: The top navigation and command bar for the writing interface.
 * Handles breadcrumbs, live word counts, save status indicators, and UI toggles.
 */
export function EditorHeader() {
  const {
    novel,
    activeChapter,
    isSidebarOpen,
    setIsSidebarOpen,
    saveStatus,
    liveWordCount,
    handleChangeChapterStatus,
    setIsPublishModalOpen, // 🟢 FIX 1: Extracted the modal trigger!
  } = useEditorContext();

  const isChapterPublished = activeChapter?.status === "published";

  return (
    <header className="flex h-14 items-center justify-between border-b border-editor-border bg-editor-bg px-6">
      
      {/* Left: Navigation & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Link
          href={`/project/${novel?._id}`}
          className="flex h-8 w-8 items-center justify-center rounded-md border-none bg-transparent text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary focus-visible:outline-2 focus-visible:outline-editor-gold-dim focus-visible:outline-offset-2"
          aria-label="Back to project"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-2 whitespace-nowrap text-[13px] text-editor-text-secondary">
          <span className="font-serif text-[15px] font-medium tracking-[0.01em] text-editor-text-primary">
            {novel?.title || "Draft"}
          </span>
          <span className="text-editor-text-tertiary">/</span>
          
          {/* 🟢 FIX 2: The Interactive Chapter Status Badge (Next to the Title!) */}
          <div className="flex items-center gap-3">
            <span className="text-editor-text-secondary">
              {activeChapter?.title || "Untitled Chapter"}
            </span>
            
            {activeChapter?._id !== "draft" && (
              <button 
                onClick={() => handleChangeChapterStatus(activeChapter._id, isChapterPublished ? "draft" : "published")}
                className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  isChapterPublished 
                    ? "bg-[#7cbf8e]/10 text-[#7cbf8e] hover:bg-[#7cbf8e]/20" 
                    : "bg-editor-surface-hover text-editor-text-tertiary hover:text-editor-text-secondary"
                }`}
              >
                {isChapterPublished ? "Published" : "Draft"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right: Stats, Status, & Actions */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end leading-[1.15]">
          <span className="font-mono tabular-nums text-[14px] font-medium text-editor-text-primary">
            {liveWordCount.toLocaleString()}
          </span>
          <span className="text-[10px] uppercase tracking-[0.08em] text-editor-text-tertiary">
            Words
          </span>
        </div>
        <div className="h-5 w-px bg-editor-border-strong" />

        {/* Save Status Indicator */}
        <div className="flex items-center gap-1.5 rounded-[20px] border border-editor-border-strong bg-editor-surface px-3 py-1 text-[12px] text-editor-text-secondary">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200 ${
              saveStatus === "saving"
                ? "animate-pulse bg-editor-gold"
                : "bg-editor-green"
            }`}
          />
          <span>{saveStatus === "saving" ? "Saving" : "Saved"}</span>
        </div>

        {/* 🟢 Novel Publish / Share Settings Button */}
        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="flex h-8 items-center gap-2 rounded-md border border-white/10 bg-transparent px-3 text-[10px] font-bold uppercase tracking-widest text-[#5c5868] transition-colors hover:bg-white/5 hover:text-[#ede9e2]"
        >
          <Globe className="h-3.5 w-3.5" />
          Share
        </button>
        <div className="h-5 w-px bg-editor-border-strong" />

        {/* Sidebar Toggle */}
        <button
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary focus-visible:outline-2 focus-visible:outline-editor-gold-dim focus-visible:outline-offset-2"
          aria-label="Toggle Sidebar"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}