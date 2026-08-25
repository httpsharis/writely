"use client";

import Link from "next/link";
import { ArrowLeft, Globe, Menu } from "lucide-react";
import { useEditorContext } from "../context/EditorContext";

export function EditorHeader() {
  const {
    novel,
    activeChapter,
    isSidebarOpen,
    setIsSidebarOpen,
    saveStatus,
    liveWordCount,
    handleChangeChapterStatus,
    setIsPublishModalOpen,
  } = useEditorContext();

  const isChapterPublished = activeChapter?.status === "published";

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-editor-border bg-editor-bg px-2 sm:px-6 gap-2">
      {/* 🟢 LEFT: Navigation & Breadcrumbs (Aggressively truncates on mobile) */}
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-4">
        <Link
          href={`/project/${novel?._id}`}
          className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-md text-editor-text-secondary transition-colors hover:bg-editor-surface-hover hover:text-editor-text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2 whitespace-nowrap text-[13px] text-editor-text-secondary">
          <span className="hidden max-w-[140px] truncate font-serif text-[15px] font-medium text-editor-text-primary lg:inline xl:max-w-none">
            {novel?.title || "Draft"}
          </span>
          <span className="hidden text-editor-text-tertiary lg:inline">/</span>

          <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
            {/* 🟢 FIXED: Extremely tight max-width on mobile to prevent pushing right-side icons off screen */}
            <span className="truncate max-w-[70px] xs:max-w-[100px] sm:max-w-[180px] md:max-w-[260px] lg:max-w-none">
              {activeChapter?.title || "Untitled"}
            </span>

            {activeChapter?._id !== "draft" && (
              <button
                onClick={() => handleChangeChapterStatus(activeChapter._id, isChapterPublished ? "draft" : "published")}
                className={`shrink-0 rounded-[4px] px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors ${isChapterPublished ? "bg-[#7cbf8e]/10 text-[#7cbf8e]" : "bg-editor-surface-hover text-editor-text-tertiary"
                  }`}
              >
                {isChapterPublished ? "Published" : "Draft"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 🟢 RIGHT: Stats, Status, & Actions (Now visible and scaled for mobile) */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">

        {/* 🟢 FIXED: Removed 'hidden', scaled text size for mobile */}
        <div className="flex flex-col items-end leading-[1.15]">
          <span className="font-mono tabular-nums text-[11px] sm:text-[14px] font-medium text-editor-text-primary">
            {liveWordCount.toLocaleString()}
          </span>
          <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.08em] text-editor-text-tertiary">
            Words
          </span>
        </div>

        <div className="h-4 sm:h-5 w-px bg-editor-border-strong" />

        {/* Save Status Indicator */}
        <div 
          className="flex items-center justify-center gap-1.5 rounded-full sm:rounded-[20px] border border-editor-border-strong bg-editor-surface w-6 h-6 sm:w-auto sm:h-auto sm:px-3 sm:py-1"
          title={saveStatus === "saving" ? "Saving to server..." : saveStatus === "off" ? "Saved to local device (offline)" : "All changes saved to cloud"}
        >
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-200 ${
            saveStatus === "saving" 
              ? "animate-pulse bg-editor-gold" 
              : saveStatus === "off" 
              ? "bg-amber-400" 
              : "bg-editor-green"
          }`} />
          <span className="hidden sm:inline text-[12px] text-editor-text-secondary">
            {saveStatus === "saving" ? "Saving" : saveStatus === "off" ? "Local Draft" : "Saved"}
          </span>
        </div>

        {/* Share Button */}
        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="flex h-6 w-6 sm:h-8 sm:w-auto items-center justify-center gap-2 rounded-md border border-white/10 sm:px-3 text-[10px] font-bold uppercase tracking-widest text-[#5c5868] hover:bg-white/5 hover:text-[#ede9e2] transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        <div className="h-4 sm:h-5 w-px bg-editor-border-strong" />

        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-md text-editor-text-secondary hover:bg-editor-surface-hover hover:text-editor-text-primary transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}