"use client";

import NovelEditor from "./NovelEditor";
import EditorSidebar from "./EditorSidebar";
import PublishDialog from "./PublishDialog";
import { EditorHeader } from "./EditorHeader";
import { useEditorContext } from "../context/EditorContext";

/**
 * EditorLayout: The primary architectural shell for the writing interface.
 * Handles the grid layout, animated save bar, and conditional modal rendering.
 * Mobile-responsive: sidebar becomes a slide-in drawer below the md breakpoint.
 */
export function EditorLayout() {
  const {
    novel,
    isSidebarOpen,
    saveStatus,
    isPublishModalOpen,
    setIsSidebarOpen,
  } = useEditorContext();

  return (
    <div className="grid h-screen grid-rows-[auto_2px_1fr] overflow-hidden bg-editor-bg font-['Inter'] text-editor-text-primary antialiased selection:bg-editor-gold-soft selection:text-editor-text-primary">
      {/* Modals */}
      {isPublishModalOpen && novel && <PublishDialog />}

      {/* Top Header */}
      <EditorHeader />

      {/* Animated Saving Progress Bar */}
      <div className="relative overflow-hidden bg-transparent">
        <div
          className={`absolute inset-0 origin-left scale-x-0 transform bg-editor-gold opacity-0 ${
            saveStatus === "saving" ? "animate-editor-fill" : ""
          }`}
        />
      </div>

      {/* Main Workspace (Canvas + Sidebar) */}
      <div
        className={`relative grid min-h-0 max-w-[100vw] grid-cols-1 ${
          isSidebarOpen ? "md:grid-cols-[1fr_320px]" : ""
        }`}
      >
        <NovelEditor />

        {isSidebarOpen && (
          <>
            {/* Mobile backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
            {/* Sidebar wrapper: drawer on mobile, static grid child on desktop */}
            <div className="fixed right-0 top-0 z-50 h-full w-[88vw] max-w-[340px] animate-in slide-in-from-right duration-300 md:static md:z-auto md:w-auto md:max-w-none md:animate-none">
              <EditorSidebar />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
